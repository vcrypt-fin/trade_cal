// Constants
const STOCKDATA_API_KEY = 'yDnwZmCAS9ZfY9jXuAwqXKjaP8pd6XS2vSDUpwhC'; // You'll need to sign up for a free API key
const STOCKDATA_API_URL = 'https://api.stockdata.org/v1';

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

interface StockDataResponse {
  meta: {
    requested: number;
    returned: number;
  };
  data: Array<{
    ticker: string;
    name: string;
    price: number;
    day_change: number;
    day_open: number;
    previous_close_price: number;
    day_high: number;
    day_low: number;
    volume: number;
    is_extended_hours_price: boolean;
    last_trade_time: string;
  }>;
}

class StockDataService {
  private subscribers: ((data: MarketData[]) => void)[] = [];
  private pollingInterval: number | null = null;
  private tickers: Ticker[] = [];
  private batchSize = 3; // Maximum number of tickers per request
  private lastMarketData: Map<string, MarketData> = new Map();

  public async connect(tickers: Ticker[]) {
    try {
      this.tickers = tickers;
      this.startPolling();
    } catch (error) {
      console.error('Error connecting to StockData:', error);
    }
  }

  private async fetchLatestData() {
    try {
      const allMarketUpdates: MarketData[] = [];
      
      // Process tickers in batches
      for (let i = 0; i < this.tickers.length; i += this.batchSize) {
        const batchTickers = this.tickers.slice(i, i + this.batchSize);
        const symbols = batchTickers.map(t => t.symbol).join(',');
        console.log('Fetching batch data for:', symbols);
        
        const response = await fetch(
          `${STOCKDATA_API_URL}/data/quote?symbols=${symbols}&api_token=${STOCKDATA_API_KEY}`,
          {
            headers: {
              'accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: StockDataResponse = await response.json();
        
        for (const ticker of batchTickers) {
          const stockData = data.data.find(d => d.ticker === ticker.symbol);
          if (stockData) {
            const changePercent = (stockData.day_change / stockData.previous_close_price) * 100;
            
            const marketData: MarketData = {
              symbol: ticker.symbol,
              name: ticker.name,
              price: stockData.price,
              change: stockData.day_change,
              changePercent: changePercent
            };
            
            this.lastMarketData.set(ticker.symbol, marketData);
            allMarketUpdates.push(marketData);
          }
        }

        // Add a small delay between batch requests to avoid rate limiting
        if (i + this.batchSize < this.tickers.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (allMarketUpdates.length > 0) {
        console.log('Sending market updates:', allMarketUpdates);
        this.notifySubscribers(Array.from(this.lastMarketData.values()));
      }

    } catch (error) {
      console.error('Error fetching market data:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
    }
  }

  private startPolling() {
    // Stop any existing polling
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    // Initial fetch
    this.fetchLatestData();

    // Start polling every 30 seconds
    this.pollingInterval = window.setInterval(() => {
      this.fetchLatestData();
    }, 30000); // 30 seconds
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