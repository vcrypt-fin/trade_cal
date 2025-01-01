// src/utils/calculatePNL.ts

import { Trade, Execution } from "../types/trade";

interface CSVTrade {
  orderId: string;
  side: string;
  contract: string;
  product: string;
  avgPrice: number | string;
  filledQty: number | string;
  fillTime: string;
  status: string;
  text: string;
  limitPrice: number | string;
  stopPrice: number | string;
  avgFillPrice: number | string;
}

interface Position {
  entryPrice: number;
  quantity: number;
  remainingQuantity: number;
  entryTime: string;
  side: "LONG" | "SHORT";
  exits: Exit[];
  orderId: string;
  text: string;
  product: string;
}

interface Exit {
  price: number;
  quantity: number;
  time: string;
}

function parseNumber(value: string | number | undefined): number {
  if (value === undefined || value === "") return 0;
  const cleanValue =
    typeof value === "string" ? value.replace(/,/g, "") : value.toString();
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

function formatDate(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return ""; // Handle invalid dates

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`; // Returns 'YYYY-MM-DD'
}

function formatTime(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  return isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString("en-GB", { hour12: false }); // Returns 'HH:MM:SS'
}

export function calculatePNL(
  csvTrades: CSVTrade[],
  dateRange?: { startDate: string; endDate: string }
): Trade[] {
  console.log("Starting calculatePNL with trades:", csvTrades);

  const processedTrades: Trade[] = [];
  const openPositions: Map<string, Position[]> = new Map();

  const productMultipliers: { [key: string]: number } = {
    NQ: 20,
    "E-MINI NA": 20,
    MNQ: 2,
    ES: 50,
    MES: 5,
  };

  console.log("Product multipliers:", productMultipliers);

  const filteredTrades = dateRange
    ? csvTrades.filter((trade) => {
        const tradeDate = new Date(trade.fillTime);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        return tradeDate >= startDate && tradeDate <= endDate;
      })
    : csvTrades;

  console.log("Filtered trades:", filteredTrades);

  const filledTrades = filteredTrades
    .filter(
      (trade) =>
        trade.status === "Filled" &&
        trade.fillTime &&
        trade.avgPrice !== null &&
        trade.filledQty !== null
    )
    .sort(
      (a, b) => new Date(a.fillTime).getTime() - new Date(b.fillTime).getTime()
    );

  console.log("Filled and sorted trades:", filledTrades);

  filledTrades.forEach((trade) => {
    const isBuy = trade.side.toUpperCase().includes("BUY");
    const quantity = parseNumber(trade.filledQty);
    const price = parseNumber(trade.avgPrice);
    const product = trade.product.toUpperCase();
    const contract = trade.contract;
    const key = `${product}-${contract}`; // Consistent key per product and contract
    console.log("key:", key);
    console.log("\nProcessing trade:", {
      orderId: trade.orderId,
      side: trade.side,
      product,
      contract,
      price,
      quantity,
      key,
    });

    const multiplier = productMultipliers[product] || 1;
    console.log("Selected multiplier for product:", product, "is:", multiplier);

    if (!openPositions.has(key)) {
      openPositions.set(key, []);
      console.log(
        `No existing positions for ${key}. Initialized positions array.`
      );
    }

    const positions = openPositions.get(key)!;

    if (isBuy) {
      // Buy trade: Either closing SHORT positions or opening LONG positions
      let remainingQty = quantity;

      console.log(
        `Attempting to close SHORT positions for ${key} with quantity: ${remainingQty}`
      );

      // Attempt to close existing SHORT positions first (FIFO)
      for (const pos of positions) {
        if (pos.side === "SHORT" && remainingQty > 0) {
          const closeQty = Math.min(pos.remainingQuantity, remainingQty);
          pos.exits.push({
            price,
            quantity: closeQty,
            time: trade.fillTime,
          });

          pos.remainingQuantity -= closeQty;
          remainingQty -= closeQty;

          console.log(
            `Closing ${closeQty} of SHORT position for ${key}. Remaining quantity in SHORT position: ${pos.remainingQuantity}`
          );

          if (pos.remainingQuantity === 0) {
            // Calculate PnL for the closed SHORT position
            const totalPnL = pos.exits.reduce((sum, exit) => {
              const exitPnL =
                (pos.entryPrice - exit.price) * exit.quantity * multiplier;
              return sum + exitPnL;
            }, 0);

            processedTrades.push({
              id: String(pos.orderId),
              date: formatDate(pos.entryTime),
              time: formatTime(pos.entryTime),
              symbol: pos.product,
              side: pos.side,
              entryPrice: pos.entryPrice,
              exitPrice: pos.exits[pos.exits.length - 1].price,
              quantity: pos.quantity,
              pnl: totalPnL,
              strategy: pos.text || "N/A",
              notes: "",
              contractMultiplier: multiplier,
              brokerage: "not added yet",
            });

            console.log(
              `SHORT position for ${key} fully closed with PnL: ${totalPnL}`
            );

            // Remove the closed position from openPositions
            const index = positions.indexOf(pos);
            if (index > -1) {
              positions.splice(index, 1);
              console.log(
                `Removed fully closed SHORT position from openPositions for ${key}.`
              );
            }
          }
        }
        if (remainingQty <= 0) break;
      }

      if (remainingQty > 0) {
        // Open a new LONG position for the remaining quantity
        const newLongPos: Position = {
          entryPrice: price,
          quantity: remainingQty,
          remainingQuantity: remainingQty,
          entryTime: trade.fillTime,
          side: "LONG",
          exits: [],
          orderId: trade.orderId,
          text: trade.text,
          product: product,
        };

        positions.push(newLongPos);
        console.log(`Opening new LONG position for ${key}:`, newLongPos);
      } else {
        console.log(
          `All ${quantity} units of the BUY trade for ${key} have been used to close existing SHORT positions.`
        );
      }
    } else {
      // Sell trade: Either closing LONG positions or opening SHORT positions
      let remainingQty = quantity;

      console.log(
        `Attempting to close LONG positions for ${key} with quantity: ${remainingQty}`
      );

      // Attempt to close existing LONG positions first (FIFO)
      for (const pos of positions) {
        if (pos.side === "LONG" && remainingQty > 0) {
          const closeQty = Math.min(pos.remainingQuantity, remainingQty);
          pos.exits.push({
            price,
            quantity: closeQty,
            time: trade.fillTime,
          });

          pos.remainingQuantity -= closeQty;
          remainingQty -= closeQty;

          console.log(
            `Closing ${closeQty} of LONG position for ${key}. Remaining quantity in LONG position: ${pos.remainingQuantity}`
          );

          if (pos.remainingQuantity === 0) {
            // Calculate PnL for the closed LONG position
            const totalPnL = pos.exits.reduce((sum, exit) => {
              const exitPnL =
                (exit.price - pos.entryPrice) * exit.quantity * multiplier;
              return sum + exitPnL;
            }, 0);

            processedTrades.push({
              id: String(pos.orderId),
              date: formatDate(pos.entryTime),
              time: formatTime(pos.entryTime),
              symbol: pos.product,
              side: pos.side,
              entryPrice: pos.entryPrice,
              exitPrice: pos.exits[pos.exits.length - 1].price,
              quantity: pos.quantity,
              pnl: totalPnL,
              strategy: pos.text || "N/A",
              notes: "",
              contractMultiplier: multiplier,
              brokerage: "not added yet",
            });

            console.log(
              `LONG position for ${key} fully closed with PnL: ${totalPnL}`
            );

            // Remove the closed position from openPositions
            const index = positions.indexOf(pos);
            if (index > -1) {
              positions.splice(index, 1);
              console.log(
                `Removed fully closed LONG position from openPositions for ${key}.`
              );
            }
          }
        }
        if (remainingQty <= 0) break;
      }

      if (remainingQty > 0) {
        // Open a new SHORT position for the remaining quantity
        const newShortPos: Position = {
          entryPrice: price,
          quantity: remainingQty,
          remainingQuantity: remainingQty,
          entryTime: trade.fillTime,
          side: "SHORT",
          exits: [],
          orderId: trade.orderId,
          text: trade.text,
          product: product,
        };

        positions.push(newShortPos);
        console.log(`Opening new SHORT position for ${key}:`, newShortPos);
      } else {
        console.log(
          `All ${quantity} units of the SELL trade for ${key} have been used to close existing LONG positions.`
        );
      }
    }
  });

  // Optional: Handle any remaining open positions if needed
  // For example, you might want to calculate unrealized PnL or report open positions

  console.log("Final processed trades:", processedTrades);
  console.log("Open positions remaining:", openPositions);

  return processedTrades;
}
