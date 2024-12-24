// src/components/BrokerageLink.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../Sidebar';
import axios from 'axios';

interface BrokerageLinkProps {
  onBack: () => void;
}

export default function BrokerageLink({ onBack }: BrokerageLinkProps) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const SERVER_URL = `${window.location.origin}/api`;

  const handleTradeovateConnect = async () => {
    setLoading(true);
    try {
      // Step 1: Authenticate with Tradeovate
      const clientId = process.env.REACT_APP_TRADEOVATE_CLIENT_ID;
      const clientSecret = process.env.REACT_APP_TRADEOVATE_CLIENT_SECRET;
      const username = process.env.REACT_APP_TRADEOVATE_USERNAME;
      const password = process.env.REACT_APP_TRADEOVATE_PASSWORD;

      const authResponse = await axios.post('https://demo-api-d.tradovate.com/v1/auth/accesstokenrequest', {
        name: username,
        password: password,
        appId: clientId,
        appVersion: "1.0",
      });

      const accessToken = authResponse.data.accessToken;

      // Step 2: Fetch All Orders from Tradeovate
      const ordersResponse = await axios.get('https://demo-api-d.tradovate.com/v1/order/list', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const fetchedOrders = ordersResponse.data;

      // Step 3: Send Orders to Backend
      const apiResponse = await axios.post(`${SERVER_URL}/trades/bulk`, fetchedOrders, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (apiResponse.status === 201) {
        const { added, skipped } = apiResponse.data;
        setOrders(added); // Update local state with added trades
        console.log('Orders synced with backend successfully:', apiResponse.data);
        if (skipped.length > 0) {
          alert(`${skipped.length} duplicate trades were skipped.`);
        }
      }

    } catch (error: any) {
      console.error('Error connecting to Tradeovate:', error);
      if (error.response && error.response.status === 409) {
        alert('Some trades already exist and were skipped.');
      } else {
        alert('Failed to connect to Tradeovate. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118]">
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-[80px]' : 'ml-[280px]'} p-8`}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="text-purple-400 hover:text-purple-300"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-semibold text-purple-100">Link Brokerage</h1>
          </div>

          <div className="bg-[#120322] p-6 rounded-lg border border-purple-800/30 backdrop-blur-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2 text-purple-100">Available Brokerages</h2>
              <p className="text-purple-200">Select your brokerage to import trades automatically</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleTradeovateConnect}
                className="w-full flex items-center justify-between p-4 border border-purple-800/30 rounded-lg bg-[#2A1A4A] hover:bg-purple-800/20 text-purple-100"
                disabled={loading}
              >
                <div>
                  <h3 className="font-semibold">Tradeovate</h3>
                  <p className="text-sm text-purple-200">Connect your Tradeovate account</p>
                </div>
                <span className="text-purple-400">Connect →</span>
              </button>

              {loading && (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              )}

              {/* Display Orders */}
              {orders.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-purple-100">Fetched Orders</h2>
                  <ul className="bg-[#1A0F2E] p-4 rounded-lg border border-purple-800/30">
                    {orders.map((order, index) => (
                      <li key={index} className="mb-2 text-purple-200">
                        <span className="font-semibold text-purple-100">Order ID:</span> {order.orderId} <br />
                        <span className="font-semibold text-purple-100">Symbol:</span> {order.symbol} <br />
                        <span className="font-semibold text-purple-100">Quantity:</span> {order.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 bg-[#1A0F2E] rounded-lg mt-4 border border-purple-800/30">
                <p className="text-sm text-purple-200">
                  More brokerages coming soon. Currently supporting Tradeovate integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
