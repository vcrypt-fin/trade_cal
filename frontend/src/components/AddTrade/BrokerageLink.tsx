// src/components/BrokerageLink.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import axios from 'axios';

const BrokerageLink: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-semibold">Link Brokerage</h1>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Available Brokerages</h2>
              <p className="text-gray-600">Select your brokerage to import trades automatically</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleTradeovateConnect}
                className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                <div>
                  <h3 className="font-semibold">Tradeovate</h3>
                  <p className="text-sm text-gray-600">Connect your Tradeovate account</p>
                </div>
                <span className="text-blue-600">Connect →</span>
              </button>

              {loading && <p>Loading...</p>}

              {/* Display Orders */}
              {orders.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold">Fetched Orders</h2>
                  <ul className="bg-gray-100 p-4 rounded-lg shadow-inner">
                    {orders.map((order, index) => (
                      <li key={index} className="mb-2">
                        <span className="font-semibold">Order ID:</span> {order.orderId} <br />
                        <span className="font-semibold">Symbol:</span> {order.symbol} <br />
                        <span className="font-semibold">Quantity:</span> {order.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg mt-4">
                <p className="text-sm text-gray-600">
                  More brokerages coming soon. Currently supporting Tradeovate integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerageLink;
