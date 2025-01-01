import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./SupabaseClient";
import { Snaptrade } from "snaptrade-typescript-sdk";

const SNAPTRADE_URL = "https://wxvmssqfidodxyoxjtju.supabase.co/functions/v1/snaptrade";

interface SnapTradeContextProps {
  snapTradeUserId: string | null;
  snapTradeUserSecret: string | null;
  getUser: () => Promise<void>;
  loginSnapTradeUser: (args: {
    broker: string;
    customRedirect: string;
  }) => Promise<string>;
  listBrokerageConnections: () => Promise<any[]>;
}

const SnapTradeContext = createContext<SnapTradeContextProps | undefined>(
  undefined
);

export const useSnapTrade = () => {
  const context = useContext(SnapTradeContext);
  if (!context) {
    throw new Error("useSnapTrade must be used within a SnapTradeProvider");
  }
  return context;
};

interface SnapTradeProviderProps {
  children: React.ReactNode;
}

export const SnapTradeProvider: React.FC<SnapTradeProviderProps> = ({
  children,
}) => {
  const [snapTradeUserId, setSnapTradeUserId] = useState<string | null>(null);
  const [snapTradeUserSecret, setSnapTradeUserSecret] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const snaptrade = new Snaptrade({
    consumerKey: "Z0jnOWoayCociGyUpbYJFKNL4PGEN7Jofv3ZFEtBG58J5I1krc",
    clientId: "VCRYPT-FINANCIAL-TEST",
  });

  const getUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) { console.error("User is not logged in"); return; }
  

      // Fetch SnapTrade user secret
      const { data, error } = await supabase
        .from("snap_users")
        .select("snap_user_secret")
        .eq("snap_user_id", snapTradeUserId)
        .single();

      if(error && error.code == 'PGRST116') {
        // Register new SnapTrade user
        const response = await fetch(`${SNAPTRADE_URL}/snaptrade-newuser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            type: 'snaptrade-newuser',
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to register SnapTrade user: ${response.statusText}`);
        }
        
        let res = await response.json();

        if (!res.userSecret || !res.userId) {
          throw new Error("Failed to register SnapTrade user.");
        }

        setSnapTradeUserId(res.userId);
        setSnapTradeUserSecret(res.userSecret);
      } else {
        setSnapTradeUserSecret(data.snap_user_secret);
      }
    } catch (err) {
      console.error("Error fetching or registering SnapTrade user:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const loginSnapTradeUser = async (args: {
    broker: string;
    customRedirect: string;
  }) => {
    const { broker, customRedirect } = args;

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session) { console.error("User is not logged in"); return; }

    if (!snapTradeUserId || !snapTradeUserSecret) {
      throw new Error("SnapTrade user ID or secret is not available.");
    }

    try {
      console.log(snapTradeUserId, snapTradeUserSecret, broker);

      const response = await fetch(`${SNAPTRADE_URL}/snaptrade-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          type: 'snaptrade-login',
          userId: snapTradeUserId,
          userSecret: snapTradeUserSecret,
          broker,
        }),
      });

      let res = await response.json();

      console.log(res)

      if (!res.redirectURI) {
        throw new Error("Failed to retrieve redirect URI.");
      }

      return res.redirectURI;
    } catch (error) {
      console.error("Error logging in SnapTrade user:", error);
      throw new Error(
        "Failed to authenticate with SnapTrade. Please try again."
      );
    }
  };

  const listBrokerageConnections = async () => {
    if (!snapTradeUserId || !snapTradeUserSecret) {
      throw new Error("SnapTrade user ID or secret is not available.");
    }

    try {
      const response = await snaptrade.connections.listBrokerageAuthorizations({
        userId: snapTradeUserId,
        userSecret: snapTradeUserSecret,
      });

      console.log(response.data);

      return response.data; // Return the list of connections
    } catch (error) {
      console.error("Error listing brokerage connections:", error);
      throw new Error(
        "Failed to retrieve brokerage connections. Please try again."
      );
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <SnapTradeContext.Provider
      value={{
        snapTradeUserId,
        snapTradeUserSecret,
        getUser,
        loginSnapTradeUser,
        listBrokerageConnections,
      }}
    >
      {loading ? <div>Loading...</div> : error ? <div>{error}</div> : children}
    </SnapTradeContext.Provider>
  );
};
