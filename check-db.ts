import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function checkDatabase() {
  try {
    console.log("Checking database tables...");
    
    const tables = await db.execute(sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    
    console.log("Existing tables:", tables.rows);
    
    // Try to query the user table
    const users = await db.execute(sql`SELECT COUNT(*) FROM "user"`);
    console.log("User table count:", users.rows[0]);
    
  } catch (error: any) {
    console.error("Database error:", error.message);
  }
}

checkDatabase();
