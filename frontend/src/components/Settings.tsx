import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import { useJournal } from '../context/JournalContext';
import Sidebar from './Sidebar';

const Settings: React.FC = () => {
  const { clearAllTrades } = useTrades();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClearData = () => {
    clearAllTrades();
    localStorage.clear();
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Data Management</h2>
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Clear All Data
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  This will permanently remove all trades, journal entries, and other data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md">
              <h3 className="text-lg font-semibold mb-4">Confirm Clear Data</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to clear all data? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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