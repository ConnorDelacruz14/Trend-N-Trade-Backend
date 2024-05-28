const { MongoClient } = require('mongodb');

let db = null;

const connectToDatabase = async () => {
    if (db) return db; // Reuse existing connection

    const client = new MongoClient(process.env.DB_URI);

    await client.connect();
    db = client.db(); // Use the database specified in the URI
    return db;
};

module.exports = { connectToDatabase };
