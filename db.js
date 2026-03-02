const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'Wine';

let db;

async function connect() {
  if (db) return db;
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to MongoDB [${dbName}]`);
    client.on('close', () => { db = null; });
    return db;
  } catch (err) {
    db = null;
    throw err;
  }
}

module.exports = { connect };
