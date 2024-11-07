// src/utils/calculatePNL.ts

import { Trade } from '../context/TradeContext';

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
  _tickSize: number | string;
}

interface Trade {
  id: string;
  date: string; // 'YYYY-MM-DD'
  time: string; // 'HH:MM AM/PM'
  symbol: string;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  strategy: string;
  notes: string;
  contractMultiplier: number;
  brokerage: string;
}

interface Position {
  entryPrice: number;
  quantity: number;
  remainingQuantity: number;
  entryTime: string;
  side: 'LONG' | 'SHORT';
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
  if (value === undefined || value === '') return 0;
  const cleanValue = typeof value === 'string' ? value.replace(/,/g, '') : value.toString();
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

function formatDate(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return ''; // Handle invalid dates

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`; // Returns 'YYYY-MM-DD'
}

function formatTime(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  return isNaN(date.getTime())
    ? ''
    : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Returns 'HH:MM AM/PM'
}

export function calculatePNL(csvTrades: CSVTrade[]): Trade[] {
  const processedTrades: Trade[] = [];
  const openPositions: Map<string, Position> = new Map();

  console.log('Total trades from CSV:', csvTrades.length);
  csvTrades.forEach((trade, index) => {
    console.log(`Trade ${index + 1}:`, trade);
  });

  // Filter trades
  const filledTrades = csvTrades
    .filter(trade =>
      trade.status === 'Filled' &&
      trade.fillTime &&
      trade.avgPrice &&
      trade.filledQty
    )
    .sort((a, b) => new Date(a.fillTime).getTime() - new Date(b.fillTime).getTime());

  console.log('Filtered filledTrades:', filledTrades);

  filledTrades.forEach(trade => {
    const isBuy = trade.side.toUpperCase().includes('BUY');
    const quantity = parseNumber(trade.filledQty);
    const price = parseNumber(trade.avgPrice);
    const key = trade.contract;
    const tickSize = parseNumber(trade._tickSize);
    const multiplier = tickSize !== 0 ? (1 / tickSize) / 2 : 1; // Prevent division by zero

    if (!openPositions.has(key)) {
      // Opening a new position
      openPositions.set(key, {
        entryPrice: price,
        quantity: quantity,
        remainingQuantity: quantity,
        entryTime: trade.fillTime,
        side: isBuy ? 'LONG' : 'SHORT',
        exits: [],
        orderId: trade.orderId,
        text: trade.text,
        product: trade.product
      });
      console.log(`Opened new position for ${key}:`, openPositions.get(key));
    } else {
      const position = openPositions.get(key)!;

      if ((position.side === 'LONG' && !isBuy) || (position.side === 'SHORT' && isBuy)) {
        // Closing or partially closing position
        const closeQuantity = Math.min(position.remainingQuantity, quantity);
        if (closeQuantity <= 0) {
          console.log(`Trade ${trade.orderId} has zero closeQuantity, skipping.`);
          return;
        }

        position.exits.push({
          price,
          quantity: closeQuantity,
          time: trade.fillTime
        });

        position.remainingQuantity -= closeQuantity;

        console.log(`Trade ${trade.orderId} closes ${closeQuantity} of position for ${key}`);

        if (position.remainingQuantity === 0) {
          // Position fully closed, calculate total P&L
          const totalPnL = position.exits.reduce((sum, exit) => {
            const exitPnL = position.side === 'LONG'
              ? (exit.price - position.entryPrice) * exit.quantity * multiplier
              : (position.entryPrice - exit.price) * exit.quantity * multiplier;
            return sum + exitPnL;
          }, 0);

          processedTrades.push({
            id: String(position.orderId), // Ensure 'id' is a string
            date: formatDate(position.entryTime), // 'YYYY-MM-DD'
            time: formatTime(position.entryTime), // 'HH:MM AM/PM'
            symbol: position.product,
            side: position.side,
            entryPrice: position.entryPrice,
            exitPrice: position.exits[position.exits.length - 1].price,
            quantity: position.quantity,
            pnl: totalPnL,
            strategy: position.text || 'N/A',
            notes: '',
            contractMultiplier: multiplier,
            brokerage: 'tradeovate'
          });

          console.log(`Closed position for ${key}. Total P&L: ${totalPnL}`);

          openPositions.delete(key);
        } else {
          // Position partially closed, update position quantity
          console.log(`Partially closed position for ${key}. Remaining Quantity: ${position.remainingQuantity}`);
        }
      } else {
        // Adding to existing position
        const totalCost = (position.entryPrice * position.quantity) + (price * quantity);
        const totalQuantity = position.quantity + quantity;
        position.entryPrice = totalCost / totalQuantity;
        position.quantity = totalQuantity;
        position.remainingQuantity = totalQuantity;

        console.log(`Added to existing position for ${key}. New Entry Price: ${position.entryPrice}, New Quantity: ${position.quantity}`);
      }
    }
  });

  console.log('Final processedTrades:', processedTrades);
  return processedTrades;
}
