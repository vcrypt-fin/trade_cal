import React, { useState } from "react";
import { SnapTradeReact } from "snaptrade-react";
import { useWindowMessage } from "snaptrade-react/hooks/useWindowMessage";
import { useSnapTrade } from "../../context/SnapTradeContext";
import Sidebar from "../Sidebar";

interface BrokerageLinkProps {
  onBack: () => void;
  onConnectionComplete: () => void; // New prop for handling connection completion
}

export default function BrokerageLink({
  onBack,
  onConnectionComplete,
}: BrokerageLinkProps) {
  const { loginSnapTradeUser } = useSnapTrade();
  const [selectedBroker, setSelectedBroker] = useState<string>("WEBULL");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectLink, setRedirectLink] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const brokers = [
    { slug: "WEBULL", name: "Webull US" },
    { slug: "WEBULL-CANADA", name: "Webull Canada" },
    { slug: "PUBLIC", name: "Public" },
    { slug: "SCHWAB", name: "Charles Schwab" },
  ];

  const onSuccess = (data: any) => {
    console.log("Connection successful:", data);
    setOpen(false);

    // Notify parent component that the connection is complete
    onConnectionComplete();
  };

  const onError = (data: any) => {
    console.error("Connection error:", data);
    setError("An error occurred during the connection process.");
  };

  const onExit = () => {
    console.log("User exited the connection process.");
    setOpen(false);
  };

  const close = () => {
    console.log("Modal closed.");
    setOpen(false);
  };

  useWindowMessage({
    handleSuccess: onSuccess,
    handleError: onError,
    handleExit: onExit,
    close: close,
  });

  const handleBrokerConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      const customRedirect = `${window.location.origin}/callback`;

      const link = await loginSnapTradeUser({
        broker: selectedBroker,
        customRedirect,
      });

      setRedirectLink(link);
      setOpen(true);
    } catch (err: any) {
      console.error("Error connecting to SnapTrade:", err);
      setError("An error occurred while connecting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-[#120322] via-[#0B0118] to-[#0B0118]">
      <Sidebar />
      <div className="max-w-2xl mx-auto mt-10">
        <button
          onClick={onBack}
          className="text-purple-400 hover:text-purple-300 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-semibold text-purple-100 mb-4">
          Link Brokerage
        </h1>
        {error && <div className="text-red-500 text-center">{error}</div>}

        <div className="bg-[#1A0F2E] p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="broker" className="text-purple-200 font-semibold">
              Select Brokerage
            </label>
            <select
              id="broker"
              value={selectedBroker}
              onChange={(e) => setSelectedBroker(e.target.value)}
              className="w-full mt-2 p-2 bg-[#2A1A4A] text-purple-100 rounded-lg"
            >
              {brokers.map((broker) => (
                <option key={broker.slug} value={broker.slug}>
                  {broker.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleBrokerConnect}
            disabled={loading}
            className={`w-full py-2 mt-4 rounded-lg text-purple-100 font-semibold ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-600"
            }`}
          >
            {loading ? "Connecting..." : "Connect"}
          </button>
        </div>

        {loading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        )}

        {redirectLink && (
          <SnapTradeReact
            loginLink={redirectLink}
            isOpen={open}
            close={() => {
              setOpen(false);
              onConnectionComplete(); // Notify parent when manually closed
            }}
          />
        )}
      </div>
    </div>
  );
}
