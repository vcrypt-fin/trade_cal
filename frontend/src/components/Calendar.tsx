// src/components/Calendar.tsx

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTrades } from '../context/TradeContext';
import { useNavigate } from 'react-router-dom';

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
  const bgColor = isProfit ? 'bg-green-100' : 'bg-red-100';
  const textColor = isProfit ? 'text-green-700' : 'text-red-700';

  return (
    <div className={`${bgColor} p-2 rounded-lg h-full cursor-pointer`}>
      <div className={`${textColor} font-semibold text-sm`}>
        ${Math.abs(trade.profit).toLocaleString()}
      </div>
      <div className="text-xs text-gray-600">
        {trade.trades} trade{trade.trades > 1 ? 's' : ''}
      </div>
      <div className="text-xs text-gray-500">{trade.winRate.toFixed(1)}% win</div>
    </div>
  );
};

interface CalendarDayProps {
  dayNum: number;
  trade?: DayTrade;
  onClick?: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ dayNum, trade, onClick }) => {
  if (dayNum === 0) {
    // Render empty cells for days not in the current month
    return <div className="aspect-square p-1"></div>;
  }

  return (
    <div className="aspect-square p-1" onClick={onClick}>
      <div className="relative h-full">
        <div className="absolute top-1 left-1 text-xs text-gray-500">
          {dayNum}
        </div>
        <div className="pt-6">
          {trade && <TradeInfo trade={trade} />}
        </div>
      </div>
    </div>
  );
};

const CalendarHeader: React.FC = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <>
      {days.map(day => (
        <div key={day} className="text-center text-sm font-medium text-gray-600">
          {day}
        </div>
      ))}
    </>
  );
};

const Calendar: React.FC = () => {
  const { trades, filters, fetchTrades, isLoading } = useTrades();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Fetch the latest trades when the Calendar component mounts or when filters change
    fetchTrades();
  }, [fetchTrades, filters]);

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const totalDays = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

  const getDayTrades = (dayNum: number): DayTrade | undefined => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(dayNum).padStart(2, '0');
    const dayStr = `${year}-${month}-${day}`; // 'YYYY-MM-DD'
  
    // Filter trades within the selected date range, symbols, and strategies
    const filteredTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      return (
        trade.date === dayStr &&
        tradeDate >= start &&
        tradeDate <= end &&
        (filters.symbols.length === 0 || filters.symbols.includes(trade.symbol)) &&
        (filters.strategies.length === 0 || filters.strategies.includes(trade.strategy))
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
    const dayStr = `${year}-${month}-${day}`; // 'YYYY-MM-DD'
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
    return <div className="bg-white rounded-lg p-6 shadow-sm">Loading calendar...</div>;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={handlePrevMonth}
            aria-label="Previous Month"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold">{monthYear}</h2>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={handleNextMonth}
            aria-label="Next Month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        <CalendarHeader />
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;