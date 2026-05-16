import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, Client } from "pg";
import * as schema from "./schema";

const isProduction = process.env.NODE_ENV === "production";

// For Vercel/Serverless, we want to handle connections carefully to avoid exhaustion
let dbInstance: any;

if (isProduction) {
  // In production, we use the non-pooling URL for migrations or long-running tasks, 
  // but for the app, we usually use the pooling one. 
  // However, for pure serverless, sometimes a single Client is better if not using a pooler.
  const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Standard for Supabase
    },
    max: 1, // Keep it low for serverless
    connectionTimeoutMillis: 10000,
  });
  
  dbInstance = drizzle(pool, { schema });
} else {
  // Development: Persistent pool
  if (!(global as any).db) {
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
    
    (global as any).db = drizzle(pool, { schema });
  }
  dbInstance = (global as any).db;
}

export const db = dbInstance;
