// api.ts
import { Trade, Playbook } from "../../frontend/src/context/TradeContext";

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
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper to save trades to file
function saveTradesToFile() {
  Bun.write(TRADES_FILE_PATH, JSON.stringify(trades, null, 2));
}

// Helper to load playbooks from file
function loadPlaybooksFromFile(): Playbook[] {
  try {
    const data = Bun.file(PLAYBOOKS_FILE_PATH).textSync();
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper to save playbooks to file
function savePlaybooksToFile() {
  Bun.write(PLAYBOOKS_FILE_PATH, JSON.stringify(playbooks, null, 2));
}

export async function handleApiRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname === "/api/trades") {
    if (req.method === "GET") return getTrades();
    if (req.method === "POST") return addTrade(await req.json());
  }

  if (pathname.startsWith("/api/trades/")) {
    const tradeId = pathname.split("/")[3];
    if (req.method === "PUT") return editTrade(tradeId, await req.json());
  }

  if (pathname === "/api/playbooks") {
    if (req.method === "GET") return getPlaybooks();
    if (req.method === "POST") return addPlaybook(await req.json());
  }

  if (pathname === "/api/clear" && req.method === "DELETE") {
    return clearAllData();
  }

  return new Response("Not Found", { status: 404 });
}

function getTrades() {
  trades = loadTradesFromFile(); // Reload trades each time
  return new Response(JSON.stringify(trades), { status: 200 });
}

function addTrade(trade: Trade) {
  trades.push(trade);
  saveTradesToFile(); // Save trades to file after each addition
  return new Response(JSON.stringify(trade), { status: 201 });
}

function editTrade(tradeId: string, updatedTrade: Trade) {
  trades = trades.map((trade) => (trade.id === tradeId ? updatedTrade : trade));
  saveTradesToFile();
  return new Response(JSON.stringify(updatedTrade), { status: 200 });
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
