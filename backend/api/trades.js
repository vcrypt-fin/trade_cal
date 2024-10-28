import { get, put } from '@vercel/blob';

const TRADE_FILE_PATH = 'trades/all_trades.json';

export default async function handler(req, res) {
    try {
        switch (req.method) {
            case 'POST': {
                const { symbol, price, quantity } = req.body;

                // Retrieve existing trades from the Blob
                const trades = await get(TRADE_FILE_PATH, { json: false });

                // Add the new trade
                const newTrade = {
                    symbol,
                    price,
                    quantity,
                    timestamp: new Date().toISOString()
                };

                console.log('New trade:', newTrade);    

                trades.push(newTrade);

                // Upload updated trades to Blob
                await put(TRADE_FILE_PATH, JSON.stringify(trades), { access: 'public' });

                res.status(201).json(newTrade);
                break;
            }

            case 'GET': {
                // Retrieve and return all trades
                const trades = await get(TRADE_FILE_PATH, { json: false });
                res.status(200).json(trades);
                break;
            }

            case 'PUT': {
                const tradeId = req.query.id;
                const { newSymbol, newPrice, newQuantity } = req.body;

                // Retrieve existing trades from the Blob
                const trades = await get(TRADE_FILE_PATH, { json: false });

                // Find and update the trade
                const trade = trades.find(t => t.timestamp === tradeId);
                if (!trade) {
                    res.status(404).json({ error: 'Trade not found' });
                    return;
                }
                trade.symbol = newSymbol || trade.symbol;
                trade.price = newPrice || trade.price;
                trade.quantity = newQuantity || trade.quantity;
                trade.timestamp = new Date().toISOString(); // Update timestamp

                // Upload updated trades to Blob
                await put(TRADE_FILE_PATH, JSON.stringify(trades), { access: 'public' });

                res.status(200).json(trade);
                break;
            }

            case 'DELETE': {
                const deleteId = req.query.id;

                // Retrieve existing trades from the Blob
                const trades = await get(TRADE_FILE_PATH, { json: false });

                // Filter out the trade to delete
                const newTrades = trades.filter(t => t.timestamp !== deleteId);

                // Upload updated trades to Blob
                await put(TRADE_FILE_PATH, JSON.stringify(trades), { access: 'public' });

                res.status(204).send();
                break;
            }

            default:
                res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']).status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Blob operation failed:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

