import { Client } from "pg";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const connectionString = process.env.POSTGRES_URL;
  
  if (!connectionString) {
    return NextResponse.json({ error: "MISSING POSTGRES_URL" }, { status: 500 });
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // 1. Check connection
    const dbInfo = await client.query("SELECT current_database(), current_user");
    
    // 2. Check if "user" table exists and list emails (to see if the account exists)
    const users = await client.query('SELECT email FROM "user" LIMIT 10');
    
    await client.end();
    
    return NextResponse.json({
      status: "connected",
      db: dbInfo.rows[0],
      existing_emails: users.rows.map(r => r.email),
      message: "If your email is NOT in the list above, you MUST Sign Up first!"
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "failed",
      error: error.message,
    }, { status: 500 });
  }
}
