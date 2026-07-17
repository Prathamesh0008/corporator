import { MongoClient } from "mongodb";

let connectionPromise;

export async function getDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured.");
  if (!connectionPromise) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000, maxPoolSize: 10 });
    connectionPromise = client.connect().catch((error) => { connectionPromise = undefined; throw error; });
  }
  const client = await connectionPromise;
  return client.db(process.env.MONGODB_DB || "mla");
}
