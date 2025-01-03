import React, { useEffect, useState } from 'react';
import leaderboardService, { LeaderboardUser } from '../../services/leaderboardService';
import { Trophy, TrendingUp, TrendingDown, User, X, Calendar, BarChart2, Circle, UserPlus, UserMinus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import followService, { FollowStats } from '../../services/followService';
import './NewsWidget.css';

console.log('LeaderboardWidget.tsx is being imported!');

type TimeFrame = 'daily' | 'weekly' | 'overall';

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

const getOnlineStatus = (lastOnline: string | undefined) => {
  if (!lastOnline) {
    console.log('No last_online timestamp available', {
      lastOnline,
      currentTime: new Date().toISOString()
    });
    return 'offline';
  }
  
  const lastOnlineDate = new Date(lastOnline);
  const now = new Date();
  const diffMinutes = (now.getTime() - lastOnlineDate.getTime()) / (1000 * 60);
  
  const status = diffMinutes <= 5 ? 'online' : diffMinutes <= 30 ? 'away' : 'offline';
  
  console.log('Online Status Check:', {
    lastOnline,
    lastOnlineDate: lastOnlineDate.toISOString(),
    now: now.toISOString(),
    diffMinutes: Math.round(diffMinutes * 100) / 100,
    status,
    thresholds: {
      online: '≤ 5 minutes',
      away: '≤ 30 minutes',
      offline: '> 30 minutes'
    }
  });
  
  return status;
};

interface ProfileModalProps {
  user: LeaderboardUser;
  onClose: () => void;
}

const ProfileModal = ({ user, onClose }: ProfileModalProps): JSX.Element => {
  const { user: currentUser } = useAuth();
  const [, forceUpdate] = useState({});
  const onlineStatus = getOnlineStatus(user.last_online);
  const [followStats, setFollowStats] = useState<FollowStats>({
    follower_count: 0,
    following_count: 0,
    is_following: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFollowStats();
  }, [user.id]);

  const loadFollowStats = async () => {
    const stats = await followService.getFollowStats(user.id);
    setFollowStats(stats);
  };

  const handleFollow = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    
    const success = followStats.is_following
      ? await followService.unfollowUser(user.id)
      : await followService.followUser(user.id);

    if (success) {
      await loadFollowStats();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const logData = {
      userId: user.id,
      lastOnline: user.last_online,
      currentStatus: onlineStatus
    };
    console.log('ProfileModal: Initial render', logData);

    const interval = setInterval(() => {
      const updateData = {
        userId: user.id,
        lastOnline: user.last_online,
        currentTime: new Date().toISOString()
      };
      console.log('ProfileModal: Forcing update for user', updateData);
      forceUpdate({});
    }, 60000);
    
    return () => clearInterval(interval);
  }, [user.id, user.last_online, onlineStatus]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#120322] rounded-lg border border-purple-800/30 p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.display_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-default-400/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-default-500/80" />
                </div>
              )}
              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#120322] ${
                onlineStatus === 'online' ? 'bg-green-500' :
                onlineStatus === 'away' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{user.display_name}</h2>
              <p className="text-purple-300 text-sm">@{user.username}</p>
              <p className="text-xs text-gray-400 mt-1">
                {onlineStatus === 'online' ? 'Online' :
                 onlineStatus === 'away' ? 'Away' :
                 user.last_online ? `Last seen ${new Date(user.last_online).toLocaleString()}` : 'Offline'}
              </p>
              <div className="flex gap-4 mt-2 text-sm text-gray-400">
                <span>{followStats.follower_count} followers</span>
                <span>{followStats.following_count} following</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {currentUser && currentUser.id !== user.id && (
              <button
                onClick={handleFollow}
                disabled={isLoading}
                className={`p-2 rounded-full transition-colors ${
                  followStats.is_following 
                    ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400' 
                    : 'bg-purple-900/20 hover:bg-purple-900/30 text-gray-400 hover:text-gray-300'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : followStats.is_following ? (
                  <UserMinus size={20} />
                ) : (
                  <UserPlus size={20} />
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-900/20 rounded-full"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-800/30">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="text-purple-400 w-4 h-4" />
                <h3 className="text-sm font-medium text-purple-200">Overall Rank</h3>
              </div>
              <p className="text-xl font-semibold text-white">
                #{user.leaderboard_stats?.overall_rank || 'N/A'}
              </p>
            </div>
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-800/30">
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="text-purple-400 w-4 h-4" />
                <h3 className="text-sm font-medium text-purple-200">Win Rate</h3>
              </div>
              <p className="text-xl font-semibold text-white">
                {(user.win_rate * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="space-y-4">
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-800/30">
              <h3 className="text-sm font-medium text-purple-200 mb-3">Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total P&L</span>
                  <span className={`font-medium ${user.total_pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatPnL(user.total_pnl)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Weekly P&L</span>
                  <span className={`font-medium ${user.weekly_pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatPnL(user.weekly_pnl)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Daily P&L</span>
                  <span className={`font-medium ${user.daily_pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatPnL(user.daily_pnl)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-800/30">
              <h3 className="text-sm font-medium text-purple-200 mb-3">Activity</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Trades</span>
                  <span className="font-medium text-white">{user.trade_count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Last Trade</span>
                  <span className="font-medium text-white">
                    {user.last_stats_update ? new Date(user.last_stats_update).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaderboardWidget: React.FC = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<TimeFrame>('daily');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    console.log('LeaderboardWidget: Starting subscription');
    const unsubscribe = leaderboardService.subscribe((data) => {
      console.log('LeaderboardWidget: Received data update:', {
        dataLength: data.length,
        firstUser: data[0] ? {
          id: data[0].id,
          lastOnline: data[0].last_online,
          currentTime: new Date().toISOString()
        } : null,
      });
      setLeaderboardData(data);
      setIsLoading(false);
    });

    leaderboardService.startPolling();
    leaderboardService.startOnlineStatusUpdates();
    console.log('LeaderboardWidget: Started polling and online updates');

    const statusInterval = setInterval(() => {
      console.log('LeaderboardWidget: Forcing status update, current time:', new Date().toISOString());
      forceUpdate({});
    }, 60000);

    return () => {
      console.log('LeaderboardWidget: Cleaning up subscription and intervals');
      unsubscribe();
      leaderboardService.stopPolling();
      leaderboardService.stopOnlineStatusUpdates();
      clearInterval(statusInterval);
    };
  }, []);

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

  const renderLeaderboardList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    return leaderboardData.map((userData, index) => {
      const onlineStatus = getOnlineStatus(userData.last_online);
      
      return (
        <div
          key={userData.id}
          className="flex items-center justify-between p-3 hover:bg-purple-900/20 rounded-lg cursor-pointer transition-colors"
          onClick={() => setSelectedUser(userData)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 text-center font-medium text-gray-400">
              #{index + 1}
            </div>
            <div className="relative">
              {userData.avatar_url ? (
                <img
                  src={userData.avatar_url}
                  alt={userData.display_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-default-400/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-default-500/80" />
                </div>
              )}
              <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-[#120322] ${
                onlineStatus === 'online' ? 'bg-green-500' :
                onlineStatus === 'away' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`} />
            </div>
            <div>
              <div className="font-medium text-white">{userData.display_name}</div>
              <div className="text-xs text-gray-400">@{userData.username}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">
              {formatPnL(timeframe === 'daily' ? userData.daily_pnl :
                        timeframe === 'weekly' ? userData.weekly_pnl :
                        userData.total_pnl)}
            </div>
            <div className="text-xs text-gray-400">
              {userData.trade_count} trades
            </div>
          </div>
        </div>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col mb-4 pt-3 px-3">
        <div className="flex items-center justify-between">
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
        <div className="-mt-2 ml-4 mb-[-20px]">
          <span className="text-[8px] px-1 py-0 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">Beta</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs text-white/60">
        <div className="col-span-4">Trader</div>
        <div className="col-span-4 text-center">P&L</div>
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
                onClick={() => setSelectedUser(leaderboardUser)}
                className={`grid grid-cols-12 gap-2 px-4 py-2.5 transition-colors cursor-pointer ${
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

      {selectedUser && (
        <ProfileModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

export default LeaderboardWidget; 