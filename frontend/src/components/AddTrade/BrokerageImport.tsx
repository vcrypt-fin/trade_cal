import React, { useEffect, useState } from "react";
import { useSnapTrade } from "../../context/SnapTradeContext";
import Sidebar from "../Sidebar";

interface BrokerageImportProps {
  onBack: () => void;
}

const BrokerageImport: React.FC<BrokerageImportProps> = ({ onBack }) => {
  const { listBrokerageConnections, importAccount, getUser } = useSnapTrade();
  const [connections, setConnections] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {

  }, []);

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      setError(null);

      try {
        getUser().then(async (user) => {
          console.log(user)
          const rawConnections = await listBrokerageConnections(user.userId, user.userSecret);

          // Extract the necessary fields: connection ID and brokerage name
          const simplifiedConnections = rawConnections.map((connection: any) => ({
            id: connection.id,
            name: connection.name || "Unknown Brokerage",
          }));

          setConnections(simplifiedConnections);
          // Automatically select the first connection
          if (simplifiedConnections.length > 0) {
            setSelectedConnection(simplifiedConnections[0].id);
          }
        })

      } catch (err: any) {
        console.error("Error fetching connections:", err);
        setError("Failed to load connections. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [listBrokerageConnections]);

  const handleImport = () => {
    if (selectedConnection) {
      console.log(`Import initiated for connection: ${selectedConnection}`);
      importAccount(selectedConnection.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118]">
      <Sidebar />
      <div className="max-w-4xl mx-auto mt-10">
        <button
          onClick={onBack}
          className="text-purple-400 hover:text-purple-300 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-semibold text-purple-100 mb-4">
          Import Trades from Brokerage
        </h1>

        {loading && (
          <div className="text-purple-100 text-center">
            Loading connections...
          </div>
        )}

        {error && <div className="text-red-500 text-center">{error}</div>}

        {!loading && !error && connections.length === 0 && (
          <div className="text-purple-100 text-center">
            No connections found. Please link a brokerage account.
          </div>
        )}

        {!loading && connections.length > 0 && (
          <div className="bg-[#1A0F2E] p-6 rounded-lg border border-purple-800/30">
            <label
              htmlFor="connections"
              className="text-purple-200 font-semibold"
            >
              Select a Brokerage Connection
            </label>
            <select
              id="connections"
              value={selectedConnection || ""}
              onChange={(e) => {
                const connection = connections.find(c => c.id === e.target.value);
                setSelectedConnection(connection || null);
              }}
              className="w-full mt-2 p-2 bg-[#2A1A4A] text-purple-100 rounded-lg"
            >
              {connections.map((connection) => (
                <option key={connection.id} value={connection.id}>
                  {connection.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleImport}
              className="mt-4 w-full py-2 bg-purple-700 text-purple-100 rounded-lg hover:bg-purple-600"
            >
              Import
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrokerageImport;
