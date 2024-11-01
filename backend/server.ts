// server.ts
import { serve } from "bun";
import { handleApiRequest } from "./api";

const BASE_PATH = "../frontend/dist"

// Start the Bun server
serve({
  port: 3000, // You can change the port if needed
  async fetch(req) {
    const url = new URL(req.url);
    console.log(req.method + " " + url.pathname);

    // Direct all API requests to '/api'
    if (url.pathname.startsWith("/api")) {
      return await handleApiRequest(req);
    }

    // Serve static files for the root path and other paths
    const pname = (url.pathname == "/" ? "/index.html" : url.pathname)
    const filePath = BASE_PATH + pname;
    const file = Bun.file(filePath);
    return new Response(file);
  },
});

console.log("🚀 Bun server is running on http://localhost:3000");
