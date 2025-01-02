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
  executions: Execution[]; // Unified executions array
  orderId: string;
  text: string;
  product: string;
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
  const processedTrades: Trade[] = [];
  const openPositions: Map<string, Position[]> = new Map();

  const productMultipliers: { [key: string]: number } = {
    NQ: 20,
    "E-MINI NA": 20,
    MNQ: 2,
    ES: 50,
    MES: 5,
  };

  const filteredTrades = dateRange
    ? csvTrades.filter((trade) => {
        const tradeDate = new Date(trade.fillTime);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        return tradeDate >= startDate && tradeDate <= endDate;
      })
    : csvTrades;

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

  filledTrades.forEach((trade) => {
    const isBuy = trade.side.toUpperCase().includes("BUY");
    const quantity = parseNumber(trade.filledQty);
    const price = parseNumber(trade.avgPrice);
    const product = trade.product.toUpperCase();
    const contract = trade.contract;
    const key = `${product}-${contract}`;
    const multiplier = productMultipliers[product] || 1;

    if (!openPositions.has(key)) {
      openPositions.set(key, []);
    }

    const positions = openPositions.get(key)!;

    if (isBuy) {
      let remainingQty = quantity;

      // Attempt to close existing SHORT positions
      for (const pos of positions) {
        if (pos.side === "SHORT" && remainingQty > 0) {
          const closeQty = Math.min(pos.remainingQuantity, remainingQty);
          pos.executions.push({
            id: `${trade.orderId}-exit`,
            type: "EXIT",
            price,
            quantity: closeQty,
            fee: 0,
          });

          pos.remainingQuantity -= closeQty;
          remainingQty -= closeQty;

          if (pos.remainingQuantity === 0) {
            const totalPnL = pos.executions.reduce((sum, exec) => {
              if (exec.type === "EXIT") {
                return (
                  sum +
                  (pos.entryPrice - exec.price) * exec.quantity * multiplier
                );
              }
              return sum;
            }, 0);

            processedTrades.push({
              id: String(pos.orderId),
              date: formatDate(pos.entryTime),
              time: formatTime(pos.entryTime),
              timestamp: new Date().toISOString(),
              symbol: pos.product,
              side: pos.side,
              entryPrice: pos.entryPrice,
              exitPrice: pos.executions[pos.executions.length - 1].price,
              quantity: pos.quantity,
              pnl: totalPnL,
              strategy: pos.text || "N/A",
              notes: "",
              contractMultiplier: multiplier,
              brokerage: "not added yet",
              executions: pos.executions, // Include executions in processed trades
            });

            positions.splice(positions.indexOf(pos), 1);
          }
        }
        if (remainingQty <= 0) break;
      }

      // Open a new LONG position for remaining quantity
      if (remainingQty > 0) {
        positions.push({
          entryPrice: price,
          quantity: remainingQty,
          remainingQuantity: remainingQty,
          entryTime: trade.fillTime,
          side: "LONG",
          executions: [
            {
              id: `${trade.orderId}-entry`,
              type: "ENTRY",
              price,
              quantity: remainingQty,
              fee: 0,
            },
          ],
          orderId: trade.orderId,
          text: trade.text,
          product: product,
        });
      }
    } else {
      let remainingQty = quantity;

      // Attempt to close existing LONG positions
      for (const pos of positions) {
        if (pos.side === "LONG" && remainingQty > 0) {
          const closeQty = Math.min(pos.remainingQuantity, remainingQty);
          pos.executions.push({
            id: `${trade.orderId}-exit`,
            type: "EXIT",
            price,
            quantity: closeQty,
            fee: 0,
          });

          pos.remainingQuantity -= closeQty;
          remainingQty -= closeQty;

          if (pos.remainingQuantity === 0) {
            const totalPnL = pos.executions.reduce((sum, exec) => {
              if (exec.type === "EXIT") {
                return (
                  sum +
                  (exec.price - pos.entryPrice) * exec.quantity * multiplier
                );
              }
              return sum;
            }, 0);

            processedTrades.push({
              id: String(pos.orderId),
              date: formatDate(pos.entryTime),
              time: formatTime(pos.entryTime),
              timestamp: new Date().toISOString(),
              symbol: pos.product,
              side: pos.side,
              entryPrice: pos.entryPrice,
              exitPrice: pos.executions[pos.executions.length - 1].price,
              quantity: pos.quantity,
              pnl: totalPnL,
              strategy: pos.text || "N/A",
              notes: "",
              contractMultiplier: multiplier,
              brokerage: "not added yet",
              executions: pos.executions, // Include executions in processed trades
            });

            positions.splice(positions.indexOf(pos), 1);
          }
        }
        if (remainingQty <= 0) break;
      }

      // Open a new SHORT position for remaining quantity
      if (remainingQty > 0) {
        positions.push({
          entryPrice: price,
          quantity: remainingQty,
          remainingQuantity: remainingQty,
          entryTime: trade.fillTime,
          side: "SHORT",
          executions: [
            {
              id: `${trade.orderId}-entry`,
              type: "ENTRY",
              price,
              quantity: remainingQty,
              fee: 0,
            },
          ],
          orderId: trade.orderId,
          text: trade.text,
          product: product,
        });
      }
    }
  });

  console.log(processedTrades);
  return processedTrades;
}
