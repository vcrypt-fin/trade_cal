// api.ts
import fs from "fs/promises";

// File to store trades data
const DATA_FILE = "./trades.json";

// Helper function to read trades from the JSON file
export const readTrades = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading trades file:", error);
    return [];
  }
};

// Helper function to write trades to the JSON file
export const writeTrades = async (trades: any) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(trades, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing trades file:", error);
  }
};

// API handler function
export const handleApiRequest = async (req: Request) => {
  const url = new URL(req.url);
  console.log(req.method + " " + url.pathname);

  // Handle API routes
  if (url.pathname.startsWith("/api")) {
    if (req.method === "GET") {
      // Retrieve all trades
      const trades = await readTrades();
      return new Response(JSON.stringify(trades), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST") {
      // Create a new trade
      const tradeData = await req.json();
      const trades = await readTrades();
      const newTrade = { id: trades.length + 1, ...tradeData };
      trades.push(newTrade);
      await writeTrades(trades);
      return new Response(JSON.stringify(newTrade), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (req.method === "PUT") {
      // Update a trade
      const tradeData = await req.json();
      const trades = await readTrades();
      const tradeIndex = trades.findIndex(trade => trade.id === tradeData.id);
      if (tradeIndex !== -1) {
        trades[tradeIndex] = { ...trades[tradeIndex], ...tradeData };
        await writeTrades(trades);
        return new Response(JSON.stringify(trades[tradeIndex]), {
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Trade not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (req.method === "DELETE") {
      // Delete a trade
      const tradeData = await req.json();
      const trades = await readTrades();
      const updatedTrades = trades.filter(trade => trade.id !== tradeData.id);
      if (updatedTrades.length < trades.length) {
        await writeTrades(updatedTrades);
        return new Response(JSON.stringify({ message: "Trade deleted." }), {
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Trade not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Handle undefined API routes
    return new Response(JSON.stringify({ error: "API endpoint not found." }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
};