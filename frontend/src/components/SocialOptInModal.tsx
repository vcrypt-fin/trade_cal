import React, { useState } from 'react';
import { Trophy, Shield, Users, Loader } from 'lucide-react';
import { supabase } from '../context/SupabaseClient';
import leaderboardService from '../services/leaderboardService';

interface SocialOptInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialOptInModal: React.FC<SocialOptInModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'initial' | 'enabling' | 'updating' | 'complete'>('initial');
  const [error, setError] = useState<string | null>(null);

  const handleOptIn = async () => {
    try {
      setIsLoading(true);
      setStatus('enabling');
      setError(null);

      // Enable social features
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ social_enabled: true })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (updateError) throw updateError;

      // Mark prompt as seen
      await leaderboardService.markSocialPromptAsSeen();

      // Update stats
      setStatus('updating');
      const success = await leaderboardService.forceStatsUpdate();
      
      if (!success) {
        throw new Error('Failed to update stats');
      }

      setStatus('complete');
      
      // Check final status
      const statsStatus = await leaderboardService.checkStatsStatus();
      if (!statsStatus.hasStats) {
        setError('Stats were enabled but no trade data was found. Your stats will appear once you record some trades.');
      }

    } catch (error: any) {
      console.error('Error updating social preferences:', error);
      setError(error?.message || 'An error occurred while updating social preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setStatus('initial');
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1625] rounded-lg w-full max-w-lg border border-purple-900/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="text-purple-500 stroke-[2.5px]" size={24} />
          <h2 className="text-xl font-semibold text-gray-200">Join TradeMind Social</h2>
        </div>

        {status === 'initial' ? (
          <>
            <p className="text-gray-300 mb-6">
              Enable social features to compete on the leaderboard and connect with other traders. Your trading statistics will be visible to other users.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Trophy className="text-purple-500 mt-1" size={20} />
                <div>
                  <h3 className="text-gray-200 font-medium">Leaderboard Rankings</h3>
                  <p className="text-gray-400 text-sm">Compete with other traders and showcase your performance</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="text-purple-500 mt-1" size={20} />
                <div>
                  <h3 className="text-gray-200 font-medium">Social Trading</h3>
                  <p className="text-gray-400 text-sm">Connect with other traders and share insights</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="text-purple-500 mt-1" size={20} />
                <div>
                  <h3 className="text-gray-200 font-medium">Privacy Control</h3>
                  <p className="text-gray-400 text-sm">You can disable social features at any time</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 rounded-lg border border-purple-900/20 text-gray-400 hover:text-gray-300 hover:bg-purple-900/20 transition-colors"
                disabled={isLoading}
              >
                Maybe Later
              </button>
              <button
                onClick={handleOptIn}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Enabling...' : 'Enable Social Features'}
              </button>
            </div>
          </>
        ) : (
          <div className="py-8">
            <div className="flex flex-col items-center justify-center gap-4">
              {isLoading ? (
                <Loader className="animate-spin text-purple-500" size={32} />
              ) : error ? (
                <Shield className="text-yellow-500" size={32} />
              ) : (
                <Trophy className="text-purple-500" size={32} />
              )}
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-200 mb-2">
                  {isLoading ? (
                    status === 'enabling' ? 'Enabling Social Features...' : 'Updating Your Stats...'
                  ) : error ? (
                    'Almost There!'
                  ) : (
                    'Social Features Enabled!'
                  )}
                </h3>
                <p className="text-gray-400 text-sm">
                  {error || (isLoading ? 
                    'This may take a few moments...' : 
                    'Your stats are now visible on the leaderboard!'
                  )}
                </p>
              </div>

              {!isLoading && (
                <button
                  onClick={handleClose}
                  className="px-6 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                >
                  Got it
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 