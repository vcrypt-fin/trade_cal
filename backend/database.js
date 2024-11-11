// database.js
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb://ethanmarreel1:ktRharlr2lWQO4G@tradebook.xsloi.mongodb.com/?retryWrites=true&w=majority&appName=TradeBook"; // process.env.MONGODB_URI; // Store your connection string in an environment variable
let db;

export async function connectToDatabase() {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    console.log("Connecting...")
    await client.connect();
    console.log("Connected")

    db = client.db('trade_history'); // Replace with your database name

    return { db, client };
}
