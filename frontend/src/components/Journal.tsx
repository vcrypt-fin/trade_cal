import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import JournalEntry from './Journal/JournalEntry';
import JournalNote from './Journal/JournalNote';
import { useJournal } from '../context/JournalContext';
import { useTrades } from '../context/TradeContext';

const Journal: React.FC = () => {
  const { entries, addEntry, updateEntry, getEntry } = useJournal();
  const { trades } = useTrades();
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<string>('');

  useEffect(() => {
    const tradesByDate = trades.reduce((acc, trade) => {
      const date = trade.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(trade);
      return acc;
    }, {} as Record<string, typeof trades>);

    Object.entries(tradesByDate).forEach(([date, dateTrades]) => {
      if (!getEntry(date)) {
        addEntry({
          date,
          content: '',
          trades: dateTrades,
          tags: [],
          linkedTrades: []
        });
      }
    });
  }, [trades, addEntry, getEntry]);

  const calculateDayStats = (dateTrades: typeof trades) => {
    const netPnl = dateTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const winners = dateTrades.filter(trade => trade.pnl > 0).length;
    const losers = dateTrades.filter(trade => trade.pnl < 0).length;
    const grossPnl = dateTrades.reduce((sum, trade) => sum + Math.max(trade.pnl, 0), 0);

    return {
      netPnl: netPnl.toFixed(2),
      totalTrades: dateTrades.length,
      winners,
      losers,
      grossPnl: grossPnl.toFixed(2),
      commissions: '0.00', // Add commission calculation if needed
    };
  };

  const toggleDayExpansion = (date: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const handleViewNote = (date: string) => {
    const entry = getEntry(date);
    if (entry) {
      setActiveContent(entry.content);
      setActiveDate(date);
    }
  };

  const handleNoteChange = (content: string) => {
    setActiveContent(content);
  };

  const handleNoteSave = () => {
    if (activeDate) {
      const entry = getEntry(activeDate);
      if (entry) {
        updateEntry(entry.id, {
          ...entry,
          content: activeContent,
        });
      }
    }
    setActiveDate(null);
  };

  // Group trades by date
  const tradesByDate = trades.reduce((acc, trade) => {
    const date = trade.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trade);
    return acc;
  }, {} as Record<string, typeof trades>);

  // Sort dates in descending order
  const sortedDates = Object.keys(tradesByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <h1 className="text-2xl font-semibold mb-6">Daily Journal</h1>
        <div className="space-y-6">
          {sortedDates.map(date => {
            const dateTrades = tradesByDate[date];
            const stats = calculateDayStats(dateTrades);
            const entry = getEntry(date);

            if (!entry) return null;

            return (
              <JournalEntry
                key={date}
                date={date}
                netPnl={`$${stats.netPnl}`}
                totalTrades={stats.totalTrades}
                winners={stats.winners}
                losers={stats.losers}
                grossPnl={`$${stats.grossPnl}`}
                commissions={`$${stats.commissions}`}
                trades={dateTrades}
                isExpanded={expandedDays[date] || false}
                onToggle={() => toggleDayExpansion(date)}
                onViewNote={() => handleViewNote(date)}
              />
            );
          })}
        </div>

        {activeDate && (
          <JournalNote
            content={activeContent}
            onChange={handleNoteChange}
            onSave={handleNoteSave}
            onClose={() => setActiveDate(null)}
            date={activeDate}
          />
        )}
      </div>
    </div>
  );
};

export default Journal;