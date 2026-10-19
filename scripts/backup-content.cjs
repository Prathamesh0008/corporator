/* Read-only database export. Run before any client-approved cleanup; never commit its output. */
const fs = require("node:fs");
const path = require("node:path");
const { MongoClient, BSON } = require("mongodb");
(async () => {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required.");
  const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_DB || "mla");
    const target = path.resolve(process.cwd(), "backups", new Date().toISOString().replace(/[:.]/g, "-"));
    const expected = path.resolve(process.cwd(), "backups") + path.sep;
    if (!target.startsWith(expected)) throw new Error("Invalid backup location.");
    fs.mkdirSync(target, { recursive: true });
    for (const name of ["works", "news", "gallery", "siteContent", "complaints", "contact_messages"]) {
      const docs = await database.collection(name).find({}).toArray();
      fs.writeFileSync(path.join(target, name + ".json"), BSON.EJSON.stringify(docs, null, 2, { relaxed: false }) + "\n", { mode: 0o600, flag: "wx" });
      console.log(name + ": " + docs.length + " records backed up.");
    }
    console.log("Backup completed. The directory is ignored by Git; restrict access because it contains private submissions.");
  } finally { await client.close(); }
})().catch(error => { console.error("Backup did not complete:", error.code || error.name); process.exitCode = 1; });
