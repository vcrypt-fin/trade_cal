import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import ManualTradeForm from './ManualTradeForm';
import BrokerageLink from './BrokerageLink';

const AddTradeForm: React.FC = () => {
  const [entryMethod, setEntryMethod] = React.useState<'manual' | 'brokerage' | null>(null);
  const navigate = useNavigate();

  if (!entryMethod) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-64 p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Add New Trade</h1>
            
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => setEntryMethod('manual')}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-lg font-semibold mb-2">Manual Entry</h2>
                <p className="text-gray-600">Manually input your trade details</p>
              </button>

              <button
                onClick={() => setEntryMethod('brokerage')}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-lg font-semibold mb-2">Link Brokerage</h2>
                <p className="text-gray-600">Import trades from your brokerage account</p>
              </button>
            </div>

            <button
              onClick={() => navigate('/')}
              className="mt-6 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return entryMethod === 'manual' ? <ManualTradeForm /> : <BrokerageLink />;
};

export default AddTradeForm;