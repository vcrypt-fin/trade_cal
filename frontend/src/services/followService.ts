import { supabase } from '../context/SupabaseClient';

export interface FollowStats {
  follower_count: number;
  following_count: number;
  is_following: boolean;
}

class FollowService {
  public async followUser(targetUserId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_relationships')
        .insert({
          follower_id: user.id,
          following_id: targetUserId,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error following user:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in followUser:', error);
      return false;
    }
  }

  public async unfollowUser(targetUserId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_relationships')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);

      if (error) {
        console.error('Error unfollowing user:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in unfollowUser:', error);
      return false;
    }
  }

  public async getFollowStats(userId: string): Promise<FollowStats> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get follower count
      const { count: followerCount } = await supabase
        .from('user_relationships')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

      // Get following count
      const { count: followingCount } = await supabase
        .from('user_relationships')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

      // Check if current user is following this user
      let isFollowing = false;
      if (user) {
        const { data } = await supabase
          .from('user_relationships')
          .select('*')
          .eq('follower_id', user.id)
          .eq('following_id', userId)
          .single();
        
        isFollowing = !!data;
      }

      return {
        follower_count: followerCount || 0,
        following_count: followingCount || 0,
        is_following: isFollowing
      };
    } catch (error) {
      console.error('Error in getFollowStats:', error);
      return {
        follower_count: 0,
        following_count: 0,
        is_following: false
      };
    }
  }
}

const followService = new FollowService();
export default followService; 