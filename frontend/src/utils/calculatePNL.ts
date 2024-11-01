import { Trade } from '../context/TradeContext';

interface CSVTrade {
  orderId: string;
  'B/S': string;
  Contract: string;
  Product: string;
  avgPrice: number | string;
  filledQty: number | string;
  'Fill Time': string;
  Status: string;
  Text: string;
}

interface Position {
  entryPrice: number;
  quantity: number;
  entryTime: string;
  side: 'LONG' | 'SHORT';
  exits: {
    price: number;
    quantity: number;
    time: string;
  }[];
  orderId: string;
  text: string;
  product: string;
}

function parseNumber(value: string | number | undefined): number {
  if (value === undefined || value === '') return 0;
  const cleanValue = value.toString().replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  
  try {
    // Extract date part if datetime is provided
    const datePart = dateStr.split(' ')[0];
    
    // Handle MM/DD/YYYY format
    if (datePart.includes('/')) {
      const [month, day, year] = datePart.split('/');
      // Assuming all years are in the 2000s if they're 2 digits
      const fullYear = year.length === 2 ? `20${year}` : year;
      return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return datePart;
  } catch (error) {
    console.error('Error formatting date:', dateStr, error);
    return new Date().toISOString().split('T')[0];
  }
}

function formatTime(timeStr: string): string {
  if (!timeStr) return '00:00:00';
  
  try {
    // Extract time from datetime string
    const timePart = timeStr.split(' ')[1] || timeStr;
    return timePart;
  } catch (error) {
    console.error('Error formatting time:', timeStr, error);
    return '00:00:00';
  }
}

function getContractMultiplier(product: string): number {
  const multipliers: Record<string, number> = {
    'MNQ': 2,
    'MES': 5,
    'ES': 50,
    'NQ': 20,
    'RTY': 10,
    'CL': 1000,
    'GC': 100,
    'SI': 5000
  };
  return multipliers[product] || 1;
}

export function calculatePNL(csvTrades: CSVTrade[]): Trade[] {
  const processedTrades: Trade[] = [];
  const openPositions: Map<string, Position> = new Map();

  // Filter and sort filled trades by time
  const filledTrades = csvTrades
    .filter(trade => trade.Status === 'Filled' && trade['Fill Time'] && trade.avgPrice && trade.filledQty)
    .sort((a, b) => new Date(a['Fill Time']).getTime() - new Date(b['Fill Time']).getTime());

  filledTrades.forEach(trade => {
    const isBuy = trade['B/S'].toUpperCase().includes('BUY');
    const quantity = parseNumber(trade.filledQty);
    const price = parseNumber(trade.avgPrice);
    const key = trade.Contract;
    const multiplier = getContractMultiplier(trade.Product);

    if (isBuy) {
      // Opening or adding to a long position
      if (!openPositions.has(key)) {
        openPositions.set(key, {
          entryPrice: price,
          quantity: quantity,
          entryTime: trade['Fill Time'],
          side: 'LONG',
          exits: [],
          orderId: trade.orderId,
          text: trade.Text,
          product: trade.Product
        });
      } else {
        const position = openPositions.get(key)!;
        if (position.side === 'LONG') {
          // Average up/down the position
          const totalCost = position.entryPrice * position.quantity + price * quantity;
          const totalQuantity = position.quantity + quantity;
          position.entryPrice = totalCost / totalQuantity;
          position.quantity = totalQuantity;
        } else {
          // Closing short position
          const closeQuantity = Math.min(position.quantity, quantity);
          const pnl = (position.entryPrice - price) * closeQuantity * multiplier;
          
          if (position.quantity === closeQuantity) {
            // Position fully closed
            processedTrades.push({
              id: position.orderId,
              date: formatDate(position.entryTime),
              time: formatTime(position.entryTime),
              symbol: position.product,
              side: position.side,
              entryPrice: position.entryPrice,
              exitPrice: price,
              quantity: closeQuantity,
              pnl,
              strategy: position.text || 'gap-and-go',
              notes: '',
              contractMultiplier: multiplier,
              brokerage: 'tradeovate'
            });
            openPositions.delete(key);
          } else {
            // Partial close
            position.quantity -= closeQuantity;
          }
        }
      }
    } else {
      // Selling
      if (!openPositions.has(key)) {
        // Opening short position
        openPositions.set(key, {
          entryPrice: price,
          quantity: quantity,
          entryTime: trade['Fill Time'],
          side: 'SHORT',
          exits: [],
          orderId: trade.orderId,
          text: trade.Text,
          product: trade.Product
        });
      } else {
        const position = openPositions.get(key)!;
        if (position.side === 'LONG') {
          // Closing long position
          const closeQuantity = Math.min(position.quantity, quantity);
          position.exits.push({
            price,
            quantity: closeQuantity,
            time: trade['Fill Time']
          });

          if (position.quantity === position.exits.reduce((sum, exit) => sum + exit.quantity, 0)) {
            // Position fully closed, calculate total P&L
            let totalPnL = 0;
            position.exits.forEach(exit => {
              totalPnL += (exit.price - position.entryPrice) * exit.quantity * multiplier;
            });

            processedTrades.push({
              id: position.orderId,
              date: formatDate(position.entryTime),
              time: formatTime(position.entryTime),
              symbol: position.product,
              side: position.side,
              entryPrice: position.entryPrice,
              exitPrice: position.exits[position.exits.length - 1].price,
              quantity: position.quantity,
              pnl: totalPnL,
              strategy: position.text || 'gap-and-go',
              notes: '',
              contractMultiplier: multiplier,
              brokerage: 'tradeovate'
            });
            openPositions.delete(key);
          }
        } else {
          // Average up/down the short position
          const totalCost = position.entryPrice * position.quantity + price * quantity;
          const totalQuantity = position.quantity + quantity;
          position.entryPrice = totalCost / totalQuantity;
          position.quantity = totalQuantity;
        }
      }
    }
  });

  return processedTrades;
}