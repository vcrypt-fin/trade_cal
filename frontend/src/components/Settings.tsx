import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import Sidebar from './Sidebar';
import { supabase } from '../context/SupabaseClient';
import { useAuth } from '../context/AuthContext';

const Settings: React.FC = () => {
  const { clearAllTrades } = useTrades();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();

  const handleClearData = async () => {
    if (!user) return;

    try {
      // Delete all trades for this user
      const { error: tradesError } = await supabase
        .from('trades')
        .delete()
        .eq('userId', user.id);

      if (tradesError) throw tradesError;

      // Delete all notes for this user
      const { error: notesError } = await supabase
        .from('notes')
        .delete()
        .eq('user_id', user.id);

      if (notesError) throw notesError;

      // Delete all playbooks for this user
      const { error: playbooksError } = await supabase
        .from('playbooks')
        .delete()
        .eq('userId', user.id);

      if (playbooksError) throw playbooksError;

      // Clear trades context
      clearAllTrades();
      
      // Clear localStorage except for Supabase session
      for (let key of Object.keys(localStorage)) {
        if (!key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      }

      setShowConfirmation(false);
    } catch (error) {
      console.error('Error clearing data:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#110420] via-[#0B0118] to-[#0B0118] flex">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <div className={`flex-1 transition-all duration-300 pt-12 ${isCollapsed ? 'ml-[60px]' : 'ml-[250px]'} p-8`}>
        <h1 className="text-2xl font-semibold mb-6 text-purple-100">Settings</h1>

        <div className="bg-[#120322] rounded-lg border border-purple-800/30 backdrop-blur-sm p-6">
          {/* Data Management Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-purple-100">Data Management</h2>
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700/80 transition-colors"
                >
                  Clear All Data
                </button>
                <p className="mt-2 text-sm text-purple-300">
                  This will permanently remove all trades, journal entries, playbooks, and other data.
                </p>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4 text-purple-100">Support</h2>
            <div>
              <a
                href="mailto:eclinick@vcryptfinancial.com?subject=Bug%20Report&body=Please%20describe%20the%20issue%20you're%20experiencing:"
                className="px-4 py-2 bg-purple-600/80 text-white rounded-lg hover:bg-purple-700/80 transition-colors inline-block"
              >
                Report a Bug
              </a>
              <p className="mt-2 text-sm text-purple-300">
                Encountered a bug? Send us an email with the details.
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#120322] rounded-lg border border-purple-800/30 p-6 max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-purple-100">Confirm Clear Data</h3>
              <p className="text-purple-200 mb-6">
                Are you sure you want to clear all data? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 border border-purple-800/30 rounded-lg text-purple-200 hover:bg-purple-900/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700/80 transition-colors"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;