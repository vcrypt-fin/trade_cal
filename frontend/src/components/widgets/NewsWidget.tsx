import React, { useEffect, useState } from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import newsService, { NewsItem } from '../../services/newsService';
import { TICKER_SYMBOLS } from '../TickerBar';
import './NewsWidget.css';

// Only use the major indices for news
const NEWS_SYMBOLS = TICKER_SYMBOLS.slice(0, 3); // SPY, DIA, QQQ

const NewsWidget: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const symbols = NEWS_SYMBOLS.map(t => t.symbol);
    console.log('Starting news service with symbols:', symbols);

    const unsubscribe = newsService.subscribe((newsData) => {
      console.log('Received news update:', newsData);
      setNews(newsData);
      setLastUpdated(new Date());
      setLoading(false);
    });

    newsService.startPolling(symbols);

    return () => {
      unsubscribe();
      newsService.stopPolling();
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const time = date.toLocaleString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
    
    return `${month} ${day}, ${time}`;
  };

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // difference in seconds

    if (diff < 5) return 'Just now';
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    return formatDate(date.toISOString());
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white/60">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Market News</h3>
        {lastUpdated && (
          <div className="flex items-center gap-1 text-xs text-white/40">
            <Clock size={12} />
            <span>Updated {formatLastUpdated(lastUpdated)}</span>
          </div>
        )}
      </div>
      <div className="news-scroll flex-1 overflow-y-auto space-y-4 pr-2">
        {news.map((item) => (
          <div 
            key={item.id}
            className={`p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer relative ${
              item.isNew ? 'border border-purple-500/50' : ''
            }`}
          >
            {item.isNew && (
              <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                New
              </div>
            )}
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">{item.headline}</h4>
                <p className="text-white/60 text-sm mb-2 line-clamp-2">{item.summary}</p>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{formatDate(item.created_at)}</span>
                  {item.author && (
                    <>
                      <span>•</span>
                      <span>{item.author}</span>
                    </>
                  )}
                </div>
              </div>
              <a 
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white/80"
              >
                <ExternalLink size={16} />
              </a>
            </div>
            {item.symbols.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {item.symbols.map(symbol => (
                  <span 
                    key={symbol}
                    className="px-2 py-1 bg-white/10 rounded text-xs text-white/80"
                  >
                    {symbol}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsWidget; 