import React, { useEffect, useState } from 'react';
import leaderboardService, { LeaderboardUser } from '../../services/leaderboardService';
import { Trophy, TrendingUp, TrendingDown, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './NewsWidget.css';

console.log('LeaderboardWidget.tsx is being imported!');

type TimeFrame = 'daily' | 'weekly' | 'overall';

const LeaderboardWidget: React.FC = () => {
  const { user } = useAuth();
  //console.log('LeaderboardWidget is being rendered!');
  
  const [timeframe, setTimeframe] = useState<TimeFrame>('daily');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('LeaderboardWidget: Starting subscription');
    const unsubscribe = leaderboardService.subscribe((data) => {
      console.log('LeaderboardWidget: Received data update:', {
        dataLength: data.length,
        firstUser: data[0],
        allData: data
      });
      setLeaderboardData(data);
      setIsLoading(false);
    });

    leaderboardService.startPolling();
    console.log('LeaderboardWidget: Started polling');

    return () => {
      console.log('LeaderboardWidget: Cleaning up subscription');
      unsubscribe();
      leaderboardService.stopPolling();
    };
  }, []);

  const formatPnL = (value: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
    
    return value >= 0 ? (
      <div className="flex items-center text-green-500">
        <TrendingUp className="w-3 h-3 mr-1" />
        {formatted}
      </div>
    ) : (
      <div className="flex items-center text-red-500">
        <TrendingDown className="w-3 h-3 mr-1" />
        {formatted}
      </div>
    );
  };

  // Get unique users and sort them by PnL
  const filteredData = [...new Map(leaderboardData.map(user => [user.id, user]))
    .values()]
    .filter(user => {
      const relevantPnL = timeframe === 'daily' ? user.daily_pnl :
                         timeframe === 'weekly' ? user.weekly_pnl :
                         user.total_pnl;
      return relevantPnL !== 0;
    })
    .sort((a, b) => {
      const aPnL = timeframe === 'daily' ? a.daily_pnl :
                   timeframe === 'weekly' ? a.weekly_pnl :
                   a.total_pnl;
      const bPnL = timeframe === 'daily' ? b.daily_pnl :
                   timeframe === 'weekly' ? b.weekly_pnl :
                   b.total_pnl;
      return bPnL - aPnL;
    })
    .slice(0, 10);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pt-3 px-3">
        <div className="flex items-center gap-2 -ml-2">
          <Trophy className="text-purple-500 stroke-[2.5px]" size={16} />
          <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setTimeframe('daily')}
            className={`text-m px-2 font-bold ${
              timeframe === 'daily'
                ? 'text-purple-400'
                : 'text-white/60'
            }`}
          >
            D
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`text-m px-2 font-bold ${
              timeframe === 'weekly'
                ? 'text-purple-400'
                : 'text-white/60'   
            }`}
          >
            W
          </button>
          <button
            onClick={() => setTimeframe('overall')}
            className={`text-m px-2 font-bold ${
              timeframe === 'overall'
                ? 'text-purple-400'
                : 'text-white/60'
            }`}
          >
            Overall
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs text-white/60">
        <div className="col-span-4">Trader</div>
        <div className="col-span-4 text-right">P&L</div>
        <div className="col-span-4 text-right">Win Rate</div>
      </div>

      <div className="flex-1 overflow-y-auto news-scroll">
        {filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/60 text-xs">
            No data available
          </div>
        ) : (
          <div className="space-y-1">
            {filteredData.map((leaderboardUser) => (
              <div 
                key={leaderboardUser.id} 
                className={`grid grid-cols-12 gap-2 px-4 py-2.5 transition-colors ${
                  leaderboardUser.id === user?.id 
                    ? 'bg-purple-500/20 hover:bg-purple-500/30' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    {leaderboardUser.avatar_url ? (
                      <img 
                        src={leaderboardUser.avatar_url} 
                        alt={leaderboardUser.display_name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-default-400/10 flex items-center justify-center">
                        <User className="w-3 h-3 text-default-500/80" />
                      </div>
                    )}
                    <span className="text-xs text-white/80 truncate max-w-[100px]">{leaderboardUser.display_name}</span>
                  </div>
                </div>
                <div className="col-span-4 text-right text-xs">
                  {formatPnL(
                    timeframe === 'daily' ? leaderboardUser.daily_pnl :
                    timeframe === 'weekly' ? leaderboardUser.weekly_pnl :
                    leaderboardUser.total_pnl
                  )}
                </div>
                <div className="col-span-4 text-right text-xs text-white/80">
                  {(leaderboardUser.win_rate * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardWidget; 