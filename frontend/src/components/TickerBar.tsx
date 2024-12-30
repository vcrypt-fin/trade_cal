import { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';
import stockDataService, { Ticker } from '../services/stockDataService';

interface TickerBarProps {
  isCollapsed: boolean;
  isTickerCollapsed: boolean;
  onTickerToggle: () => void;
}

interface TickerData {
  name: string;
  value: string;
  change: string;
}

export const TICKER_SYMBOLS: Ticker[] = [
  { symbol: 'SPY', name: 'S&P 500' },
  { symbol: 'DIA', name: 'Dow Jones' },
  { symbol: 'QQQ', name: 'Nasdaq' },
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'GOOGL', name: 'Google' },
  { symbol: 'AMZN', name: 'Amazon' },
  { symbol: 'TSLA', name: 'Tesla' }
];

export function TickerBar({ isCollapsed, isTickerCollapsed, onTickerToggle }: TickerBarProps) {
  const tickerRef = useRef<HTMLDivElement>(null);
  const [marketData, setMarketData] = useState<Map<string, { price: number; change: number }>>(new Map());

  useEffect(() => {
    console.log('TickerBar: Connecting to stock data service');
    stockDataService.connect(TICKER_SYMBOLS);

    const unsubscribe = stockDataService.subscribe((data) => {
      console.log('TickerBar: Received market data update:', data);
      setMarketData(prevData => {
        const newData = new Map(prevData);
        data.forEach(update => {
          console.log(`TickerBar: Processing update for ${update.symbol}:`, update);
          newData.set(update.symbol, {
            price: update.price,
            change: update.changePercent
          });
        });
        return newData;
      });
    });

    return () => {
      console.log('TickerBar: Cleaning up stock data service connection');
      unsubscribe();
      stockDataService.disconnect();
    };
  }, []);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (ticker) {
      const clone = ticker.cloneNode(true) as HTMLDivElement;
      ticker.after(clone);

      const tickerWidth = ticker.offsetWidth;
      const moveTickerElement = (element: HTMLDivElement, startPosition: number) => {
        let position = startPosition;
        const move = () => {
          position -= 0.5;
          if (position <= -tickerWidth) {
            position = tickerWidth;
          }
          element.style.transform = `translateX(${position}px)`;
          requestAnimationFrame(move);
        };
        requestAnimationFrame(move);
      };

      moveTickerElement(ticker, 0);
      moveTickerElement(clone, tickerWidth);

      return () => {
        clone.remove();
      };
    }
  }, [marketData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change: number) => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  const getTickerData = (): TickerData[] => {
    return TICKER_SYMBOLS.map(({ symbol, name }) => {
      const data = marketData.get(symbol);
      return {
        name,
        value: data ? formatPrice(data.price) : '...',
        change: data ? formatChange(data.change) : '...'
      };
    });
  };

  return (
    <div className={cn(
      'fixed top-0 right-0 z-10 transition-all duration-300',
      isCollapsed ? 'left-[60px]' : 'left-[250px]',
      isTickerCollapsed ? '-translate-y-full' : 'translate-y-0'
    )}>
      <div className="bg-gradient-to-r from-[#110420] via-[#1E002F] to-[#110420] h-12 overflow-hidden relative ticker-container">
        <div 
          ref={tickerRef}
          className="flex items-center h-full absolute whitespace-nowrap will-change-transform"
        >
          {getTickerData().map((item, index) => (
            <div key={`${item.name}-${index}`} className="inline-flex items-center gap-4 px-4">
              <span className="text-sm font-medium text-white/80">{item.name}</span>
              <span className="text-sm text-white">{item.value}</span>
              <span
                className={cn(
                  'text-sm',
                  item.change.startsWith('-') ? 'text-red-400' : 'text-green-400'
                )}
              >
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={onTickerToggle}
        className="absolute bottom-2 right-4 translate-y-full rounded-lg bg-gradient-to-r from-[#110420] via-[#1E002F] to-[#110420] px-2 py-1 text-white hover:bg-white/10 border border-purple-800 shadow-lg"
      >
        {isTickerCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
      </button>
    </div>
  );
} 