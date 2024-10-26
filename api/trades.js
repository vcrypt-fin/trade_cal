// api/trades.js
import { connectToDatabase } from '../database';

export default async function handler(req, res) {
    const { db } = await connectToDatabase();

    switch (req.method) {
        case 'POST':
            const { symbol, price, quantity } = req.body;
            const trade = { symbol, price, quantity };
            const result = await db.collection('trades').insertOne(trade);
            res.status(201).json({ id: result.insertedId, ...trade });
            break;
        case 'GET':
            const trades = await db.collection('trades').find({}).toArray();
            res.json(trades);
            break;
        case 'PUT':
            const tradeId = req.query.id;
            const { newSymbol, newPrice, newQuantity } = req.body;
            await db.collection('trades').updateOne({ _id: new MongoClient.ObjectId(tradeId) }, { $set: { symbol: newSymbol, price: newPrice, quantity: newQuantity } });
            res.json({ id: tradeId, symbol: newSymbol, price: newPrice, quantity: newQuantity });
            break;
        case 'DELETE':
            const deleteId = req.query.id;
            await db.collection('trades').deleteOne({ _id: new MongoClient.ObjectId(deleteId) });
            res.status(204).send();
            break;
        default:
            res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']).status(405).end(`Method ${req.method} Not Allowed`);
    }
}
