// Constants
const ALPACA_API_KEY = import.meta.env.VITE_ALPACA_API_KEY;
const ALPACA_API_SECRET = import.meta.env.VITE_ALPACA_API_SECRET;
const ALPACA_API_URL = 'https://data.alpaca.markets/v2';
const ALPACA_PAPER_URL = 'https://paper-api.alpaca.markets/v2';

export interface Ticker {
  symbol: string;
  name: string;
}

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface AlpacaTradeResponse {
  trades: {
    [symbol: string]: {
      c: string[];    // Conditions
      i: number;      // Trade ID
      p: number;      // Price
      s: number;      // Size
      t: string;      // Timestamp
      x: string;      // Exchange
      z: string;      // Tape
    }
  }
}

interface AlpacaHistoricalTradeResponse {
  trades: Array<{
    c: string[];    // Conditions
    i: number;      // Trade ID
    p: number;      // Price
    s: number;      // Size
    t: string;      // Timestamp
    x: string;      // Exchange
    z: string;      // Tape
  }>;
  next_page_token: string | null;
  symbol: string;
}

interface CalendarDay {
  date: string;
  open: string;
  close: string;
  session_open: string;
  session_close: string;
}

class StockDataService {
  private subscribers: ((data: MarketData[]) => void)[] = [];
  private pollingInterval: number | null = null;
  private tickers: Ticker[] = [];
  private lastMarketData: Map<string, MarketData> = new Map();
  private lastTradingDay: string | null = null;
  private previousClosePrices: Map<string, number> = new Map();

  public async connect(tickers: Ticker[]) {
    try {
      console.log('Connecting to Alpaca with tickers:', tickers);
      this.tickers = tickers;
      await this.initializeLastTradingDay();
      await this.fetchPreviousClosePrices();
      this.startPolling();
    } catch (error) {
      console.error('Error connecting to Alpaca:', error);
    }
  }

  private formatPrice(price: number): number {
    return Number(price.toFixed(2));
  }

  private formatChange(change: number): number {
    return Number(change.toFixed(2));
  }

  private formatChangePercent(percent: number): number {
    return Number(percent.toFixed(2));
  }

  private async initializeLastTradingDay() {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Fetch calendar for the last few days
      const response = await fetch(
        `${ALPACA_PAPER_URL}/calendar?start=${yesterday.toISOString().split('T')[0]}&end=${today.toISOString().split('T')[0]}`,
        {
          headers: {
            'APCA-API-KEY-ID': ALPACA_API_KEY!,
            'APCA-API-SECRET-KEY': ALPACA_API_SECRET!,
            'accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch calendar: ${response.status}`);
      }

      const tradingDays: CalendarDay[] = await response.json();
      console.log('Fetched trading calendar:', tradingDays);

      // Sort by date in descending order
      const sortedDays = tradingDays.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Find the last completed trading day
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
      const todayDate = now.toISOString().split('T')[0];

      for (const day of sortedDays) {
        // Skip today if market isn't closed yet
        if (day.date === todayDate && currentTime < day.close) {
          continue;
        }
        this.lastTradingDay = day.date;
        console.log('Last trading day set to:', this.lastTradingDay);
        break;
      }

      if (!this.lastTradingDay) {
        throw new Error('Could not determine last trading day');
      }
    } catch (error) {
      console.error('Error initializing last trading day:', error);
    }
  }

  private async fetchPreviousClosePrices() {
    if (!this.lastTradingDay) {
      console.error('No last trading day available');
      return;
    }

    try {
      const symbols = this.tickers.map(t => t.symbol).join(',');
      const response = await fetch(
        `${ALPACA_API_URL}/stocks/trades?symbols=${symbols}&start=${this.lastTradingDay}&end=${this.lastTradingDay}T23:59:59Z&limit=1&sort=desc`,
        {
          headers: {
            'APCA-API-KEY-ID': ALPACA_API_KEY!,
            'APCA-API-SECRET-KEY': ALPACA_API_SECRET!,
            'accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch historical trades: ${response.status}`);
      }

      const data = await response.json();
      console.log('Previous close prices data:', data);

      // Store the closing prices for each symbol
      for (const ticker of this.tickers) {
        const trades = data[ticker.symbol]?.trades;
        if (trades && trades.length > 0) {
          const closePrice = this.formatPrice(trades[0].p);
          this.previousClosePrices.set(ticker.symbol, closePrice);
          console.log(`Stored previous close for ${ticker.symbol}:`, closePrice);
        }
      }
    } catch (error) {
      console.error('Error fetching previous close prices:', error);
    }
  }

  private async fetchLatestData() {
    try {
      const symbols = this.tickers.map(t => t.symbol).join(',');
      const tradesResponse = await fetch(
        `${ALPACA_API_URL}/stocks/trades/latest?symbols=${symbols}`,
        {
          headers: {
            'APCA-API-KEY-ID': ALPACA_API_KEY!,
            'APCA-API-SECRET-KEY': ALPACA_API_SECRET!,
            'accept': 'application/json'
          }
        }
      );

      if (!tradesResponse.ok) {
        throw new Error(`Failed to fetch latest trades: ${tradesResponse.status}`);
      }

      const tradesData: AlpacaTradeResponse = await tradesResponse.json();
      console.log('Latest trades data:', tradesData);

      const allMarketUpdates: MarketData[] = [];

      for (const ticker of this.tickers) {
        try {
          const tradeInfo = tradesData.trades[ticker.symbol];
          if (!tradeInfo) {
            console.error(`No trade data for ${ticker.symbol}`);
            continue;
          }

          const currentPrice = this.formatPrice(tradeInfo.p);
          const previousClose = this.previousClosePrices.get(ticker.symbol);

          if (!previousClose) {
            console.error(`No previous close price for ${ticker.symbol}`);
            continue;
          }

          const change = this.formatChange(currentPrice - previousClose);
          const changePercent = this.formatChangePercent((change / previousClose) * 100);

          const marketData: MarketData = {
            symbol: ticker.symbol,
            name: ticker.name,
            price: currentPrice,
            change: change,
            changePercent: changePercent
          };

          console.log(`Processed market data for ${ticker.symbol}:`, marketData);
          this.lastMarketData.set(ticker.symbol, marketData);
          allMarketUpdates.push(marketData);
        } catch (error) {
          console.error(`Error processing ${ticker.symbol}:`, error);
        }
      }

      if (allMarketUpdates.length > 0) {
        this.notifySubscribers(Array.from(this.lastMarketData.values()));
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  }

  private startPolling() {
    console.log('Starting polling...');
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    this.fetchLatestData();
    this.pollingInterval = window.setInterval(() => {
      this.fetchLatestData();
    }, 5000);
  }

  public subscribe(callback: (data: MarketData[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(data: MarketData[]) {
    this.subscribers.forEach(callback => callback(data));
  }

  public disconnect() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.tickers = [];
  }
}

// Create a singleton instance
const stockDataService = new StockDataService();

export default stockDataService; 