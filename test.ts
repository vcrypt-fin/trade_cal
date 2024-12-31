import process from 'process';

// SnapTrade API Credentials
const PARTNER_CLIENT_ID = "VCRYPT-SOFTWARE-LLC"
const CONSUMER_KEY  = "3Xn7XlIzA7k09RO6OKNs36yb6crxGHgbRFulJXjUNDXRv1GzEx"
const ACC_ID = "c9627c35-cb34-4b65-a370-68d8b28aea79"

/**
 * Fetch recent executed orders from SnapTrade using node-fetch
 *
 * @param {string} accountId    - The UUID of the connected brokerage account in SnapTrade
 * @param {string} userId       - Unique ID you chose for this user
 * @param {string} userSecret   - Secret SnapTrade generated for this user
 * @param {boolean} [onlyExecuted=true] - true => only orders executed in last 24h; false => includes non-executed
 * @returns {Promise<any>}      - JSON response from the SnapTrade API
 */

async function getRecentOrders(accountId, userId, userSecret, onlyExecuted = true) {
    // For Node versions < 18, uncomment:
    // const fetch = require('node-fetch');

    // Build the request URL
    const baseUrl = "https://api.snaptrade.com/api/v1";
    const url = new URL(`${baseUrl}/accounts/${accountId}/recentOrders`);

    // Add required query parameters
    url.searchParams.set("userId", userId);
    url.searchParams.set("userSecret", userSecret);
    // onlyExecuted defaults to true
    url.searchParams.set("only_executed", onlyExecuted);

    // Prepare necessary headers
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // SnapTrade’s partner credentials
        clientId: PARTNER_CLIENT_ID,
        consumerKey: CONSUMER_KEY 
    };

    try {
        const response = await fetch(url, { method: "GET", headers });

        // If the response is not successful, throw error with details
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(
                `Request failed with status ${response.status} (${response.statusText}): ${errorBody}`
            );
        }

        // Return parsed JSON data
        return await response.json();
    } catch (error) {
        console.error("Error fetching recent orders from SnapTrade:", error);
        throw error;
    }
}

// Example usage:
(async () => {
    try {
        const recentOrders = await getRecentOrders(
            "c9627c35-cb34-4b65-a370-68d8b28aea79", // accountId
            "e71331ce-7022-4368-bada-5c9f25be9333", // userId
            "5cf39d56-cc98-43e2-8b96-9e34a1ad9c75", // userSecret
            true // onlyExecuted (optional, defaults to true)
        );
        console.log("Recent orders:", recentOrders);
    } catch (error) {
        // 403 Forbidden is common if the endpoint is not enabled or credentials are invalid
        console.error(error.message);
    }
})();
