import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../Sidebar';
import ManualTradeForm from './ManualTradeForm';
import BrokerageLink from './BrokerageLink';
import CSVTradeImport from './CSVTradeImport';
import { supabase } from '../../context/SupabaseClient';

const SNAPTRADE_URL = "https://wxvmssqfidodxyoxjtju.supabase.co/functions/v1/snaptrade"

export default function AddTradeForm() {
  const [entryMethod, setEntryMethod] = useState<'manual' | 'brokerage' | 'csv' | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [snaptradeData, setSnaptradeData] = useState<any>(null);

  const navigate = useNavigate();

  // Sync snaptrade user data
  // Check supabase if user has snaptrade data
  // If not, prompt user to link snaptrade account
  // If so, prompt user to sync holdings
  // If holdings are synced, prompt user to add trade
  useEffect(() => {
    const checkSnapTradeData = async () => {
      // Check if user has snaptrade data
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("User is not logged in");

      try {

        const { data: snaptradeData, error } = await supabase
          .from('snap_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;
        setSnaptradeData(snaptradeData);
        console.log("SNAP DATA", snaptradeData);

      } catch (error) {
        if (error.code == "PGRST116") {
          console.log("No SnapTrade data found for user");
          // Create a new SnapTrade user using function

          let path = `${SNAPTRADE_URL}/snaptrade-newuser`;
          let body = {
            type: "snaptrade-newuser",
            userId: session.user.id,
          };

          const response = await fetch(path, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            throw new Error(`Failed to create SnapTrade user: ${response.statusText}`);
          }

          console.log("Created new SnapTrade user:", await response.json());

        } else {
          console.error("Error checking SnapTrade data:", error);
        }

        // No snaptrade data found, prompt user to link account

        // Handle specific error cases as needed
      }
    };

    checkSnapTradeData();
  }, []);

  const onLink = async (broker: string) => {
    // Check if user has snaptrade data
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("User is not logged in");
    
    let path = `${SNAPTRADE_URL}/snaptrade-login`;
    let body = {
      type: "snaptrade-login",
      userId: snaptradeData.snap_user_id,
      userSecret: snaptradeData.snap_user_secret, 
      broker: broker,
    };

    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(body),
    });

    const { redirectURI } = await response.json();

    window.location.href = redirectURI

    if (!response.ok) {
      throw new Error(`Failed to create SnapTrade user: ${response.statusText}`);
    }
  };

  if (!entryMethod) {
    return (
      <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118]">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
        <div className={`transition-all duration-300 ${isCollapsed ? 'ml-[80px]' : 'ml-[280px]'} p-8`}>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link
                to="/"
                className="text-purple-400 hover:text-purple-300"
              >
                ← Back
              </Link>
              <h1 className="text-2xl font-semibold text-purple-100">Add New Trade</h1>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <button
                onClick={() => setEntryMethod('manual')}
                className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm hover:bg-[#2A1A4A] transition-colors duration-300"
              >
                <h2 className="text-lg font-semibold mb-2 text-purple-100">Manual Entry</h2>
                <p className="text-purple-200">Manually input your trade details</p>
              </button>
              <button
                onClick={() => onLink('SCHWAB')}
                className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm hover:bg-[#2A1A4A] transition-colors duration-300"
              >
                <h2 className="text-lg font-semibold mb-2 text-purple-100">Link Brokerage</h2>
                <p className="text-purple-200">Import trades from your brokerage account</p>
              </button>
              <button
                onClick={() => setEntryMethod('csv')}
                className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm hover:bg-[#2A1A4A] transition-colors duration-300"
              >
                <h2 className="text-lg font-semibold mb-2 text-purple-100">Import CSV</h2>
                <p className="text-purple-200">Upload a CSV file of your trades</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (entryMethod === 'manual') return <ManualTradeForm onBack={() => setEntryMethod(null)} />;
  if (entryMethod === 'brokerage') return <BrokerageLink onBack={() => setEntryMethod(null)} />;
  if (entryMethod === 'csv') return <CSVTradeImport onBack={() => setEntryMethod(null)} />;
  return null;
}