#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });

const { Pool } = require('pg');

const rawUrl = new URL(
  process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL
);

const pool = new Pool({
  host: rawUrl.hostname,
  user: decodeURIComponent(rawUrl.username),
  password: decodeURIComponent(rawUrl.password),
  database: rawUrl.pathname.replace(/^\//, ''),
  port: Number(rawUrl.port) || 5432,
  ssl: { rejectUnauthorized: false },
});

async function createTables() {
  try {
    console.log('Creating tables...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        id TEXT NOT NULL PRIMARY KEY,
        name TEXT,
        email TEXT,
        "emailVerified" TIMESTAMP,
        image TEXT
      )
    `);
    console.log('✓ User table');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS account (
        "userId" TEXT NOT NULL,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        PRIMARY KEY ("provider", "providerAccountId"),
        FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Account table');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS session (
        "sessionToken" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        expires TIMESTAMP NOT NULL,
        FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Session table');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "verificationToken" (
        identifier TEXT NOT NULL,
        token TEXT NOT NULL,
        expires TIMESTAMP NOT NULL,
        PRIMARY KEY (identifier, token)
      )
    `);
    console.log('✓ VerificationToken table');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS product (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DOUBLE PRECISION NOT NULL,
        imageurl TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        tags TEXT[],
        createdat TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✓ Product table');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS review (
        id SERIAL PRIMARY KEY,
        productid INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
        userid TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        createdat TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✓ Review table');

    console.log('\n✓✓✓ Database initialized successfully! ✓✓✓');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createTables();
