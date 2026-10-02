/**
 * MongoDB and Session Persistence Layer
 * Provides high-performance connection pooling when MONGODB_URI is configured,
 * and resilient in-memory storage fallback when running without MongoDB.
 */

import { MongoClient, Db } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export interface BindingRecord {
  id: string;
  toolType: string;
  targetId: string;
  mode: string;
  createdAt: Date;
  updatedAt?: Date;
}

// In-memory fallback stores for zero-setup local resilience
const memoryStore = {
  activities: [] as any[],
  bindings: [
    { id: "bind_1", toolType: "anti_ban_guard", targetId: "PRIMARY_SYS", mode: "standard", createdAt: new Date() },
    { id: "bind_2", toolType: "session_router", targetId: "USER_PROXY", mode: "standard", createdAt: new Date() },
    { id: "bind_3", toolType: "auto_responder", targetId: "DEFAULT_GATEWAY", mode: "high priority", createdAt: new Date() },
  ] as BindingRecord[],
  sessions: new Map<string, { lastActive: number; actionCount: number }>(),
};

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: Db | null; isConnected: boolean; mode: "mongodb" | "memory" }> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    return { client: null, db: null, isConnected: false, mode: "memory" };
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb, isConnected: true, mode: "mongodb" };
  }

  try {
    const client = new MongoClient(uri, {
      connectTimeoutMS: 4000,
      serverSelectionTimeoutMS: 4000,
    });
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME || "tg_bot_hub");

    cachedClient = client;
    cachedDb = db;
    return { client, db, isConnected: true, mode: "mongodb" };
  } catch (error: any) {
    console.warn("[MongoDB Connection Warning]:", error.message, "- Falling back to memory store");
    return { client: null, db: null, isConnected: false, mode: "memory" };
  }
}

/**
 * Record action event to persistent storage
 */
export async function persistActivity(activity: {
  action: string;
  feature: string;
  status: string;
  message: string;
  details?: Record<string, any>;
  ip?: string;
}) {
  const record = {
    ...activity,
    timestamp: new Date().toISOString(),
    createdAt: new Date(),
  };

  const { db, mode } = await connectToDatabase();

  if (mode === "mongodb" && db) {
    try {
      await db.collection("activity_logs").insertOne(record);
      return record;
    } catch (e) {
      console.warn("Failed to write to MongoDB, falling back to memory:", e);
    }
  }

  memoryStore.activities.unshift(record);
  if (memoryStore.activities.length > 100) {
    memoryStore.activities.pop();
  }
  return record;
}

/**
 * Persist or update binding
 */
export async function persistBinding(binding: {
  toolType: string;
  targetId: string;
  mode: string;
  actionId: string;
}): Promise<BindingRecord> {
  const now = new Date();
  const item: BindingRecord = {
    id: binding.actionId,
    toolType: binding.toolType,
    targetId: binding.targetId,
    mode: binding.mode,
    createdAt: now,
    updatedAt: now,
  };

  const { db, mode } = await connectToDatabase();

  if (mode === "mongodb" && db) {
    try {
      await db.collection("bindings").updateOne(
        { targetId: binding.targetId },
        { $set: item },
        { upsert: true }
      );
      return item;
    } catch (e) {
      console.warn("MongoDB binding persist error:", e);
    }
  }

  const existingIdx = memoryStore.bindings.findIndex((b) => b.targetId === binding.targetId);
  if (existingIdx >= 0) {
    memoryStore.bindings[existingIdx] = {
      ...memoryStore.bindings[existingIdx],
      ...item,
      createdAt: memoryStore.bindings[existingIdx].createdAt,
    };
  } else {
    memoryStore.bindings.push(item);
  }
  return item;
}

/**
 * Get active bindings count
 */
export async function getActiveBindingsCount(): Promise<number> {
  const { db, mode } = await connectToDatabase();
  if (mode === "mongodb" && db) {
    try {
      return await db.collection("bindings").countDocuments();
    } catch {
      // Fallback
    }
  }
  return memoryStore.bindings.length;
}
