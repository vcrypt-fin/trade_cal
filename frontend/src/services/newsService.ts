const ALPACA_API_KEY = import.meta.env.VITE_ALPACA_API_KEY;
const ALPACA_API_SECRET = import.meta.env.VITE_ALPACA_API_SECRET;
const ALPACA_NEWS_URL = 'https://data.alpaca.markets/v1beta1/news';

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  author: string;
  created_at: string;
  updated_at: string;
  url: string;
  content: string;
  symbols: string[];
  source: string;
  isNew?: boolean;
}

class NewsService {
  private pollingInterval: number | null = null;
  private subscribers: ((data: NewsItem[]) => void)[] = [];
  private lastFetchTimestamp: string | null = null;
  private lastSuccessfulNews: NewsItem[] = [];
  private retryCount = 0;
  private maxRetries = 3;

  public async fetchNews(symbols: string[]) {
    try {
      const symbolsParam = symbols.join(',');
      const params = new URLSearchParams({
        sort: 'desc',
        limit: '50',
        symbols: symbolsParam,
      });

      const response = await fetch(
        `${ALPACA_NEWS_URL}?${params}`,
        {
          headers: {
            'APCA-API-KEY-ID': ALPACA_API_KEY!,
            'APCA-API-SECRET-KEY': ALPACA_API_SECRET!,
            'accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
      }

      const data = await response.json();
      const news = data.news as NewsItem[];

      // Mark new items
      if (this.lastFetchTimestamp) {
        news.forEach(item => {
          item.isNew = new Date(item.created_at) > new Date(this.lastFetchTimestamp!);
        });
      }

      // Update last fetch timestamp to latest news item's timestamp
      if (news.length > 0) {
        this.lastFetchTimestamp = news[0].created_at;
        this.lastSuccessfulNews = news;
        this.retryCount = 0;
      }

      return news;
    } catch (error) {
      console.error('Error fetching news:', error);
      
      // If we have previous successful news and haven't exceeded retry count,
      // return the last successful news instead of empty array
      if (this.lastSuccessfulNews.length > 0 && this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retry ${this.retryCount}/${this.maxRetries}: Using cached news`);
        return this.lastSuccessfulNews;
      }
      
      return this.lastSuccessfulNews.length > 0 ? this.lastSuccessfulNews : [];
    }
  }

  public startPolling(symbols: string[]) {
    console.log('Starting news polling for symbols:', symbols);
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    // Initial fetch
    this.fetchAndNotify(symbols);

    // Set up polling every 30 seconds
    this.pollingInterval = window.setInterval(() => {
      this.fetchAndNotify(symbols);
    }, 30000);
  }

  private async fetchAndNotify(symbols: string[]) {
    const news = await this.fetchNews(symbols);
    this.notifySubscribers(news);
  }

  public subscribe(callback: (data: NewsItem[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(data: NewsItem[]) {
    this.subscribers.forEach(callback => callback(data));
  }

  public stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}

const newsService = new NewsService();
export default newsService; 