// server.ts
import { serve } from "bun";
import { handleApiRequest } from "./api";

const BASE_PATH = "../frontend/dist"; // Ensure this path is correct relative to server.ts

// Utility function to determine Content-Type based on file extension
function getContentType(filePath: string): string {
  const extension = filePath.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "html":
      return "text/html";
    case "js":
      return "application/javascript";
    case "css":
      return "text/css";
    case "json":
      return "application/json";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

// Start the Bun server
serve({
  port: 3000, // You can change the port if needed
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const pathname = url.pathname;
    console.log(`Incoming request: ${req.method} ${pathname}`);

    // Route API requests to handleApiRequest
    if (pathname.startsWith("/api")) {
      return await handleApiRequest(req);
    }

    // Serve static files for non-API routes
    // Default to index.html for the root path
    const filePath = pathname === "/" ? "/index.html" : pathname;
    const fullPath = `${BASE_PATH}${filePath}`;

    try {
      const file = Bun.file(fullPath);
      return new Response(file, {
        headers: {
          "Content-Type": getContentType(fullPath),
          // Add other headers if necessary
        },
      });
    } catch (error) {
      console.error(`Error serving file ${fullPath}:`, error);
      return new Response("Not Found", { status: 404 });
    }
  },
});

console.log("🚀 Bun server is running on http://localhost:3000");
