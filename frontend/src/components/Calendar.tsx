// src/components/Calendar.tsx

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useTrades } from '../context/TradeContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

interface DayTrade {
  date: string;   // Format: 'YYYY-MM-DD'
  profit: number; // PnL
  trades: number; // Number of trades
  winRate: number; // Percentage
}

interface TradeInfoProps {
  trade: DayTrade;
}

const TradeInfo: React.FC<TradeInfoProps> = ({ trade }) => {
  const isProfit = trade.profit > 0;
  const bgColor = isProfit ? 'bg-green-500/10' : 'bg-red-500/10';
  const textColor = isProfit ? 'text-green-400' : 'text-red-400';

  return (
    <div className={`${bgColor} p-2 rounded-lg h-full cursor-pointer hover:bg-white/5`}>
      <div className={`${textColor} font-semibold text-sm`}>
        ${Math.abs(trade.profit).toLocaleString()}
      </div>
      <div className="text-xs text-white/60">
        {trade.trades} trade{trade.trades > 1 ? 's' : ''}
      </div>
      <div className="text-xs text-white/50">{trade.winRate.toFixed(1)}% win</div>
    </div>
  );
};

interface CalendarDayProps {
  dayNum: number;
  trade?: DayTrade;
  onClick?: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ dayNum, trade, onClick }) => {
  const navigate = useNavigate();
  
  if (dayNum === 0) {
    return <div className="aspect-square p-1"></div>;
  }

  return (
    <div 
      className="aspect-square p-1" 
      onClick={onClick}
    >
      <div className="relative h-full bg-white/5 rounded-md p-1 flex flex-col justify-between">
        <span className="text-sm text-white/80">{dayNum}</span>
        <div className="flex-1 pt-2">
          {trade && <TradeInfo trade={trade} />}
        </div>
        {!trade && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate('/add-trade');
            }}
            className="absolute bottom-1 right-1 rounded p-1 hover:bg-white/10"
          >
            <Plus className="h-3 w-3 text-white/60" />
          </button>
        )}
      </div>
    </div>
  );
};

const CalendarHeader: React.FC = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <>
      {days.map(day => (
        <div key={day} className="text-center text-sm font-medium text-white/60">
          {day}
        </div>
      ))}
    </>
  );
};

const getWeeksInMonth = (date: Date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Math.ceil((firstDay + totalDays) / 7);
};

interface CalendarProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  symbols: string[];
  strategies: string[];
}

const Calendar: React.FC<CalendarProps> = ({
  dateRange,
  symbols,
  strategies,
}) => {
  const { trades, filters, fetchTrades, isLoading } = useTrades();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades, filters]);

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const totalDays = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

  const getDayTrades = (dayNum: number): DayTrade | undefined => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(dayNum).padStart(2, '0');
    const dayStr = `${year}-${month}-${day}`;
  
    const filteredTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      return (
        trade.date === dayStr &&
        tradeDate >= start &&
        tradeDate <= end &&
        (filters.symbols.length === 0 || (trade.symbol && filters.symbols.includes(trade.symbol))) &&
        (filters.strategies.length === 0 || (trade.strategy && filters.strategies.includes(trade.strategy)))
      );
    });

    if (filteredTrades.length === 0) return undefined;

    const totalProfit = filteredTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const winningTrades = filteredTrades.filter(trade => trade.pnl > 0).length;
    const winRate = (winningTrades / filteredTrades.length) * 100;

    return {
      date: dayStr,
      profit: totalProfit,
      trades: filteredTrades.length,
      winRate: winRate,
    };
  };

  const handleDayClick = (dayNum: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(dayNum).padStart(2, '0');
    const dayStr = `${year}-${month}-${day}`;
    navigate('/trades', { state: { date: dayStr } });
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  const renderCalendarDays = () => {
    return Array.from({ length: totalDays }).map((_, i) => {
      const dayNum = i - firstDayOfMonth + 1;
      const isValidDay = dayNum > 0 && dayNum <= daysInMonth;
      
      return (
        <CalendarDay
          key={i}
          dayNum={isValidDay ? dayNum : 0}
          trade={isValidDay ? getDayTrades(dayNum) : undefined}
          onClick={isValidDay ? () => handleDayClick(dayNum) : undefined}
        />
      );
    });
  };

  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  if (isLoading) {
    return (
      <div className="rounded-lg overflow-hidden bg-gradient-to-bl from-[#110420] via-[#0B0118] to-[#0B0118] p-6 text-white/80">
        Loading calendar...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-bl from-[#110420] via-[#0B0118] to-[#0B0118] rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button 
            className="p-2 hover:bg-white/10 rounded-full"
            onClick={handlePrevMonth}
            aria-label="Previous Month"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <h2 className="text-lg font-semibold text-white">{monthYear}</h2>
          <button 
            className="p-2 hover:bg-white/10 rounded-full"
            onClick={handleNextMonth}
            aria-label="Next Month"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        <CalendarHeader />
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;