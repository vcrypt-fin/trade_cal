import { supabase } from '../context/SupabaseClient';

export interface LeaderboardUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  total_pnl: number;
  weekly_pnl: number;
  daily_pnl: number;
  win_rate: number;
  trade_count: number;
  last_stats_update?: string;
  leaderboard_stats?: {
    daily_rank: number;
    weekly_rank: number;
    overall_rank: number;
  };
}

export interface StatsUpdateStatus {
  isEnabled: boolean;
  lastUpdate: string | null;
  hasStats: boolean;
}

class LeaderboardService {
  private subscribers: ((data: LeaderboardUser[]) => void)[] = [];
  private pollingInterval: number | null = null;

  public async checkSocialPromptStatus(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('has_seen_social_prompt')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking social prompt status:', error);
        return false;
      }

      return data?.has_seen_social_prompt || false;
    } catch (error) {
      console.error('Error in checkSocialPromptStatus:', error);
      return false;
    }
  }

  public async markSocialPromptAsSeen(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          has_seen_social_prompt: true
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error marking social prompt as seen:', error);
    }
  }

  public async updateSocialStatus(enabled: boolean): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update social_enabled in user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ social_enabled: enabled })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Mark prompt as seen
      await this.markSocialPromptAsSeen();

      // If enabled, trigger stats update
      if (enabled) {
        await this.updateUserStats(user.id);
      }
    } catch (error) {
      console.error('Error updating social status:', error);
    }
  }

  private async updateUserStats(userId: string): Promise<void> {
    try {
      // Call the edge function to update user stats
      const { error } = await supabase.functions.invoke('update-leaderboard', {
        body: { userId }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }

  public async fetchLeaderboard(timeframe: 'daily' | 'weekly' | 'overall' = 'overall'): Promise<LeaderboardUser[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          id,
          username,
          display_name,
          avatar_url,
          total_pnl,
          weekly_pnl,
          daily_pnl,
          win_rate,
          trade_count,
          leaderboard_stats (
            daily_rank,
            weekly_rank,
            overall_rank
          )
        `)
        .eq('social_enabled', true)
        .gt('trade_count', 0)  // Only show users with trades
        .order(
          timeframe === 'daily' ? 'daily_pnl' :
          timeframe === 'weekly' ? 'weekly_pnl' :
          'total_pnl',
          { ascending: false }
        )
        .limit(100);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
      }

      return (data || []).map(user => ({
        ...user,
        leaderboard_stats: Array.isArray(user.leaderboard_stats) ? user.leaderboard_stats[0] : user.leaderboard_stats
      })) as LeaderboardUser[];
    } catch (error) {
      console.error('Error in fetchLeaderboard:', error);
      return [];
    }
  }

  public async checkSocialStatus(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('social_enabled')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data?.social_enabled || false;
    } catch (error) {
      console.error('Error checking social status:', error);
      return false;
    }
  }

  public startPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    // Initial fetch
    this.fetchAndNotify();

    // Poll every minute
    this.pollingInterval = window.setInterval(() => {
      this.fetchAndNotify();
    }, 60000);
  }

  private async fetchAndNotify() {
    const [daily, weekly, overall] = await Promise.all([
      this.fetchLeaderboard('daily'),
      this.fetchLeaderboard('weekly'),
      this.fetchLeaderboard('overall')
    ]);
    
    this.notifySubscribers([...daily, ...weekly, ...overall]);
  }

  public subscribe(callback: (data: LeaderboardUser[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(data: LeaderboardUser[]) {
    this.subscribers.forEach(callback => callback(data));
  }

  public stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  public async checkStatsStatus(): Promise<StatsUpdateStatus> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          social_enabled,
          last_stats_update,
          total_pnl,
          daily_pnl,
          weekly_pnl,
          trade_count
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const hasStats = data.trade_count > 0 || 
                      data.total_pnl !== 0 || 
                      data.daily_pnl !== 0 || 
                      data.weekly_pnl !== 0;

      return {
        isEnabled: data.social_enabled || false,
        lastUpdate: data.last_stats_update,
        hasStats
      };
    } catch (error) {
      console.error('Error checking stats status:', error);
      return {
        isEnabled: false,
        lastUpdate: null,
        hasStats: false
      };
    }
  }

  public async forceStatsUpdate(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Get the session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const { error } = await supabase.functions.invoke('update-leaderboard', {
        body: { userId: user.id },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error forcing stats update:', error);
      return false;
    }
  }
}

const leaderboardService = new LeaderboardService();
export default leaderboardService; 