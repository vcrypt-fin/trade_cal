// api.ts

import { Trade, Playbook } from "../../frontend/src/context/TradeContext"; // Ensure correct path

const TRADES_FILE_PATH = "./trades.json";
const PLAYBOOKS_FILE_PATH = "./playbooks.json";

let trades: Trade[] = loadTradesFromFile();
let playbooks: Playbook[] = loadPlaybooksFromFile() || [
  { id: "gap-and-go", name: "Gap and Go", createdAt: new Date().toISOString() },
  { id: "reversal", name: "Reversal", createdAt: new Date().toISOString() },
];

// Helper to load trades from file
function loadTradesFromFile(): Trade[] {
  try {
    const data = Bun.file(TRADES_FILE_PATH).textSync();
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      console.error("Trades data is not an array:", parsed);
      return [];
    }
  } catch (error) {
    console.error("Error loading trades from file:", error);
    return [];
  }
}

// Helper to save trades to file
function saveTradesToFile() {
  if (!Array.isArray(trades)) {
    console.error("Cannot save trades. Data is not an array:", trades);
    return;
  }
  Bun.write(TRADES_FILE_PATH, JSON.stringify(trades, null, 2));
}

// Helper to load playbooks from file
function loadPlaybooksFromFile(): Playbook[] {
  try {
    const data = Bun.file(PLAYBOOKS_FILE_PATH).textSync();
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      console.error("Playbooks data is not an array:", parsed);
      return [];
    }
  } catch (error) {
    console.error("Error loading playbooks from file:", error);
    return [];
  }
}

// Helper to save playbooks to file
function savePlaybooksToFile() {
  if (!Array.isArray(playbooks)) {
    console.error("Cannot save playbooks. Data is not an array:", playbooks);
    return;
  }
  Bun.write(PLAYBOOKS_FILE_PATH, JSON.stringify(playbooks, null, 2));
}

export async function handleApiRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;

  console.log(`Received ${req.method} request for ${pathname}`);

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Adjust this in production
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*', // Allow all headers
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Routing
  let response: Response;

  if (pathname === "/api/trades") {
    if (req.method === "GET") {
      response = getTrades();
    } else if (req.method === "POST") {
      const trade = await req.json();
      response = addTrade(trade);
    } else {
      response = new Response("Method Not Allowed", { status: 405 });
    }
  }
  else if (pathname === "/api/health") { // Fixed typo from "/api/heath" to "/api/health"
    response = new Response("OK", { status: 200 });
  }
  else if (pathname === "/api/trades/bulk") {
    if (req.method === "POST") {
      const newTrades = await req.json();
      response = addBulkTrades(newTrades);
    } else {
      response = new Response("Method Not Allowed", { status: 405 });
    }
  }
  else if (pathname.startsWith("/api/trades/")) {
    const tradeId = pathname.split("/")[3];
    if (req.method === "PUT" || req.method === "PATCH") { // Accept PATCH as per frontend code
      const updatedTrade = await req.json();
      response = editTrade(tradeId, updatedTrade);
    } else {
      response = new Response("Method Not Allowed", { status: 405 });
    }
  }
  else if (pathname === "/api/playbooks") {
    if (req.method === "GET") {
      response = getPlaybooks();
    } else if (req.method === "POST") {
      const playbookData = await req.json();
      response = addPlaybook(playbookData);
    } else {
      response = new Response("Method Not Allowed", { status: 405 });
    }
  }
  else if (pathname === "/api/clear" && req.method === "DELETE") {
    response = clearAllData();
  }
  else {
    response = new Response("Not Found", { status: 404 });
  }

  // Add CORS headers to the response
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*'); // Adjust this in production

  return new Response(response.body, {
    status: response.status,
    headers: headers,
  });
}

function getTrades() {
  trades = loadTradesFromFile(); // Reload trades each time
  return new Response(JSON.stringify(trades), { status: 200 });
}

function addTrade(trade: Trade) {
  const existingTrade = trades.find(t => t.id === trade.id);
  if (existingTrade) {
    // Option 1: Skip adding duplicate
    // return new Response(JSON.stringify({ message: 'Trade already exists' }), { status: 409 });

    // Option 2: Update existing trade
    trades = trades.map(t => t.id === trade.id ? { ...t, ...trade } : t);
    saveTradesToFile();
    return new Response(JSON.stringify(trades.find(t => t.id === trade.id)), { status: 200 });
  } else {
    trades.push(trade);
    saveTradesToFile();
    return new Response(JSON.stringify(trade), { status: 201 });
  }
}

function addBulkTrades(newTrades: Trade[]) {
  if (!Array.isArray(newTrades)) {
    console.error("Bulk trades data is not an array:", newTrades);
    return new Response(JSON.stringify({ message: 'Invalid data format. Expected an array of trades.' }), { status: 400 });
  }

  const addedTrades: Trade[] = [];
  const skippedTrades: Trade[] = [];

  newTrades.forEach(trade => {
    if (!trade.date) {
      console.warn('Trade without date:', trade);
      skippedTrades.push(trade);
      return;
    }

    const existingTrade = trades.find(t => t.id === trade.id);
    if (existingTrade) {
      // Option 1: Skip adding duplicate
      skippedTrades.push(trade);

      // Option 2: Update existing trade
      // trades = trades.map(t => t.id === trade.id ? { ...t, ...trade } : t);
      // addedTrades.push(trades.find(t => t.id === trade.id)!);
    } else {
      trades.push(trade);
      addedTrades.push(trade);
    }
  });

  saveTradesToFile();
  return new Response(JSON.stringify({ added: addedTrades, skipped: skippedTrades }), { status: 201 });
}

function editTrade(tradeId: string, updatedTrade: Trade) {
  const index = trades.findIndex(t => t.id === tradeId);
  if (index === -1) {
    return new Response(JSON.stringify({ message: 'Trade not found' }), { status: 404 });
  }
  trades[index] = { ...trades[index], ...updatedTrade };
  saveTradesToFile();
  return new Response(JSON.stringify(trades[index]), { status: 200 });
}

function getPlaybooks() {
  return new Response(JSON.stringify(playbooks), { status: 200 });
}

function addPlaybook(playbookData: Omit<Playbook, "id" | "createdAt">) {
  const newPlaybook: Playbook = {
    ...playbookData,
    id: playbookData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    createdAt: new Date().toISOString(),
  };
  playbooks.push(newPlaybook);
  savePlaybooksToFile();
  return new Response(JSON.stringify(newPlaybook), { status: 201 });
}

function clearAllData() {
  trades = [];
  playbooks = [];
  saveTradesToFile();
  savePlaybooksToFile();
  return new Response("All data cleared", { status: 200 });
}
