// api.ts
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed

// Determine __dirname for absolute paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute paths
const TRADES_FILE = path.join(__dirname, "trades.json");
const PLAYBOOKS_FILE = path.join(__dirname, "playbooks.json");

// Helper function to read trades from the JSON file
export const readTrades = async () => {
  try {
    const data = await fs.readFile(TRADES_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading trades file:", error);
    return [];
  }
};

// Helper function to write trades to the JSON file
export const writeTrades = async (trades: any) => {
  try {
    await fs.writeFile(TRADES_FILE, JSON.stringify(trades, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing trades file:", error);
  }
};

// Helper function to read playbooks from the JSON file
export const readPlaybooks = async () => {
  try {
    const data = await fs.readFile(PLAYBOOKS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading playbooks file:", error);
    return [];
  }
};

// Helper function to write playbooks to the JSON file
export const writePlaybooks = async (playbooks: any) => {
  try {
    await fs.writeFile(PLAYBOOKS_FILE, JSON.stringify(playbooks, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing playbooks file:", error);
  }
};

// Utility function to generate unique IDs
const generateUniqueId = (): string => {
  return uuidv4();
};

// API handler function
export const handleApiRequest = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const pathname = url.pathname;
  console.log(`${req.method} ${pathname}`);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  // Handle API routes
  if (pathname.startsWith("/api")) {
    // Handle DELETE /api/clear
    if (pathname === "/api/clear" && req.method === "DELETE") {
      try {
        await writeTrades([]);
        await writePlaybooks([]);
        console.log("All trades and playbooks cleared.");
        return new Response(JSON.stringify({ message: "All data cleared." }), {
          status: 200,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      } catch (error) {
        console.error("Error clearing data:", error);
        return new Response(JSON.stringify({ error: "Failed to clear data." }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    // Handle /api/playbooks
    if (pathname === "/api/playbooks") {
      if (req.method === "GET") {
        try {
          let playbooks = await readPlaybooks();
          
          // Initialize with default playbooks if empty
          if (playbooks.length === 0) {
            playbooks = [
              { id: generateUniqueId(), name: "Gap and Go", createdAt: new Date().toISOString() },
              { id: generateUniqueId(), name: "Reversal", createdAt: new Date().toISOString() },
            ];
            await writePlaybooks(playbooks);
            console.log("Initialized playbooks with default entries.");
          }

          console.log("Fetched playbooks:", playbooks);
          return new Response(JSON.stringify(playbooks), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        } catch (error) {
          console.error("Error fetching playbooks:", error);
          return new Response(JSON.stringify({ error: "Failed to fetch playbooks." }), {
            status: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        }
      }

      if (req.method === "POST") {
        try {
          const playbookData = await req.json();
          
          // Basic validation
          if (!playbookData.name) {
            throw new Error("Playbook name is required.");
          }

          let playbooks = await readPlaybooks();
          
          // Check for duplicate playbook names
          const duplicate = playbooks.find((pb: any) => pb.name.toLowerCase() === playbookData.name.toLowerCase());
          if (duplicate) {
            throw new Error("Playbook with this name already exists.");
          }

          const newPlaybook = { id: generateUniqueId(), ...playbookData, createdAt: new Date().toISOString() };
          playbooks.push(newPlaybook);
          await writePlaybooks(playbooks);
          console.log("Added new playbook:", newPlaybook);
          return new Response(JSON.stringify(newPlaybook), {
            status: 201,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        } catch (error) {
          console.error("Error creating playbook:", error);
          return new Response(JSON.stringify({ error: error.message || "Invalid playbook data." }), {
            status: 400,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        }
      }
    }

    // Handle /api/trades
    if (pathname === "/api/trades") {
      if (req.method === "GET") {
        try {
          const trades = await readTrades();
          console.log("Fetched trades:", trades);
          return new Response(JSON.stringify(trades), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        } catch (error) {
          console.error("Error fetching trades:", error);
          return new Response(JSON.stringify({ error: "Failed to fetch trades." }), {
            status: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        }
      }

      if (req.method === "POST") {
        try {
          const tradeData = await req.json();
          console.log("Received trade data:", tradeData);

          if (!tradeData.date || !tradeData.symbol || !tradeData.side) {
            console.error("Validation failed:", tradeData);
            throw new Error("Missing required trade fields: date, symbol, or side");
          }

          if (!tradeData.time) {
            const now = new Date();
            tradeData.time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
          }

          const newTrade = {
            id: generateUniqueId(),
            brokerage: tradeData.brokerage || 'Default',
            contractMultiplier: tradeData.contractMultiplier || 1,
            notes: tradeData.notes || '',
            ...tradeData
          };

          const trades = await readTrades();
          trades.push(newTrade);
          await writeTrades(trades);
          
          console.log("Added new trade:", newTrade);
          return new Response(JSON.stringify(newTrade), {
            status: 201,
            headers: { 
              "Content-Type": "application/json", 
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true"
            },
          });
        } catch (error) {
          console.error("Error creating trade:", error);
          return new Response(JSON.stringify({ 
            error: error.message || "Invalid trade data",
            details: error.toString()
          }), {
            status: 400,
            headers: { 
              "Content-Type": "application/json", 
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true"
            },
          });
        }
      }

      // Handle PUT, PATCH, DELETE as needed
      // Ensure these methods are correctly implemented
    }

    // Handle /api/trades/bulk
    if (pathname === "/api/trades/bulk") {
      if (req.method === "POST") {
        try {
          const newTrades = await req.json();

          if (!Array.isArray(newTrades)) {
            throw new Error("Expected an array of trades.");
          }

          let trades = await readTrades();
          const addedTrades: any[] = [];
          const skippedTrades: any[] = [];

          newTrades.forEach((trade: any) => {
            // Basic validation
            if (!trade.date || !trade.time || !trade.symbol || !trade.side) {
              console.warn("Skipping trade with missing fields:", trade);
              skippedTrades.push(trade);
              return;
            }

            // Validate time format (HH:MM:SS)
            const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
            if (!timeRegex.test(trade.time)) {
              console.warn("Skipping trade with invalid time format:", trade);
              skippedTrades.push(trade);
              return;
            }

            // Assign unique ID
            const newTrade = { id: generateUniqueId(), ...trade };
            trades.push(newTrade);
            addedTrades.push(newTrade);
          });

          await writeTrades(trades);
          console.log(`Bulk added ${addedTrades.length} trades. Skipped ${skippedTrades.length} trades.`);
          return new Response(JSON.stringify({ added: addedTrades, skipped: skippedTrades }), {
            status: 201,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        } catch (error) {
          console.error("Error adding bulk trades:", error);
          return new Response(JSON.stringify({ error: error.message || "Invalid bulk trade data." }), {
            status: 400,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        }
      } else {
        return new Response("Method Not Allowed", { status: 405 });
      }
    }

    // Handle other API routes like /api/trades/:id for PATCH, DELETE etc.
    if (pathname.startsWith("/api/trades/")) {
      const tradeId = pathname.split("/")[3];
      if (req.method === "PATCH" || req.method === "PUT") {
        try {
          const updatedTradeData = await req.json();
          let trades = await readTrades();
          const tradeIndex = trades.findIndex(t => t.id === tradeId);
          if (tradeIndex === -1) {
            return new Response(JSON.stringify({ error: "Trade not found." }), { status: 404 });
          }

          // Update trade
          trades[tradeIndex] = { ...trades[tradeIndex], ...updatedTradeData };
          await writeTrades(trades);
          console.log("Updated trade:", trades[tradeIndex]);
          return new Response(JSON.stringify(trades[tradeIndex]), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        } catch (error) {
          console.error("Error updating trade:", error);
          return new Response(JSON.stringify({ error: "Invalid trade data." }), {
            status: 400,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        }
      }

      if (req.method === "DELETE") {
        try {
          let trades = await readTrades();
          const initialLength = trades.length;
          trades = trades.filter(t => t.id !== tradeId);
          if (trades.length === initialLength) {
            return new Response(JSON.stringify({ error: "Trade not found." }), { status: 404 });
          }
          await writeTrades(trades);
          console.log(`Deleted trade with ID: ${tradeId}`);
          return new Response(JSON.stringify({ message: "Trade deleted." }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        } catch (error) {
          console.error("Error deleting trade:", error);
          return new Response(JSON.stringify({ error: "Failed to delete trade." }), {
            status: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
          });
        }
      }
    }

    // Handle undefined API routes
    return new Response(JSON.stringify({ error: "API endpoint not found." }), {
      status: 404,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }

  // If not an API route, return 404
  return new Response(JSON.stringify({ error: "Not Found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
};
