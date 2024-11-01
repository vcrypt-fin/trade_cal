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
  remainingQuantity: number;
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
    const datePart = dateStr.split(' ')[0];
    
    if (datePart.includes('/')) {
      const [month, day, year] = datePart.split('/');
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

  const filledTrades = csvTrades
    .filter(trade => trade.Status === 'Filled' && trade['Fill Time'] && trade.avgPrice && trade.filledQty)
    .sort((a, b) => new Date(a['Fill Time']).getTime() - new Date(b['Fill Time']).getTime());

  filledTrades.forEach(trade => {
    const isBuy = trade['B/S'].toUpperCase().includes('BUY');
    const quantity = parseNumber(trade.filledQty);
    const price = parseNumber(trade.avgPrice);
    const key = trade.Contract;
    const multiplier = getContractMultiplier(trade.Product);

    if (!openPositions.has(key)) {
      // Opening a new position
      openPositions.set(key, {
        entryPrice: price,
        quantity: quantity,
        remainingQuantity: quantity,
        entryTime: trade['Fill Time'],
        side: isBuy ? 'LONG' : 'SHORT',
        exits: [],
        orderId: trade.orderId,
        text: trade.Text,
        product: trade.Product
      });
    } else {
      const position = openPositions.get(key)!;
      
      if ((position.side === 'LONG' && !isBuy) || (position.side === 'SHORT' && isBuy)) {
        // Closing or partially closing position
        const closeQuantity = Math.min(position.remainingQuantity, quantity);
        const pnl = position.side === 'LONG' 
          ? (price - position.entryPrice) * closeQuantity * multiplier
          : (position.entryPrice - price) * closeQuantity * multiplier;

        position.exits.push({
          price,
          quantity: closeQuantity,
          time: trade['Fill Time']
        });
        
        position.remainingQuantity -= closeQuantity;

        if (position.remainingQuantity === 0) {
          // Position fully closed, calculate total P&L
          let totalPnL = position.exits.reduce((sum, exit) => {
            const exitPnL = position.side === 'LONG'
              ? (exit.price - position.entryPrice) * exit.quantity * multiplier
              : (position.entryPrice - exit.price) * exit.quantity * multiplier;
            return sum + exitPnL;
          }, 0);

          processedTrades.push({
            id: String(position.orderId), // Ensure 'id' is a string
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
        // Adding to existing position
        const totalCost = position.entryPrice * position.quantity + price * quantity;
        const totalQuantity = position.quantity + quantity;
        position.entryPrice = totalCost / totalQuantity;
        position.quantity = totalQuantity;
        position.remainingQuantity = totalQuantity;
      }
    }
  });

  return processedTrades;
}
