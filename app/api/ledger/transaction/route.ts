import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { transactions, ledgerEntries } from '@/src/db/schema';
import { generateTransactionHash } from '@/src/lib/crypto';
import { auth } from '@/auth';
import { eq, desc } from 'drizzle-orm';
import { transactionRateLimiter } from '@/src/lib/ratelimit';
import { dispatchWebhook } from '@/src/lib/webhooks';


export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // 0. Rate Limiting Check
    if (!transactionRateLimiter.isAllowed(userId)) {
      return NextResponse.json({ 
        error: 'Too many requests. Please slow down (Limit: 5/min).',
      }, { status: 429 });
    }

    const body = await req.json();

    const { amount, idempotencyKey, orderId, metadata, description } = body;

    // Validate inputs
    if (!amount || typeof amount !== 'number' && typeof amount !== 'string') {
      return NextResponse.json({ error: 'Valid amount is required (in cents/kobo)' }, { status: 400 });
    }

    if (!idempotencyKey) {
      return NextResponse.json({ error: 'idempotencyKey is required' }, { status: 400 });
    }

    // Parse amount to BigInt
    let amountBigInt: bigint;
    try {
      amountBigInt = BigInt(Math.floor(Number(amount)));
    } catch (e) {
      return NextResponse.json({ error: 'Invalid amount format' }, { status: 400 });
    }

    if (amountBigInt === 0n) {
      return NextResponse.json({ error: 'Amount cannot be zero' }, { status: 400 });
    }

    // Atomic transaction with retry logic for network resilience
    const MAX_RETRIES = 2;
    let result;
    
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        result = await db.transaction(async (tx) => {
          // 1. Idempotency Check: Prevent duplicate processing
          const existingTx = await tx.query.transactions.findFirst({
            where: eq(transactions.idempotencyKey, idempotencyKey),
          });

          if (existingTx) {
            // Return existing to be idempotent
            return { success: true, transaction: existingTx, idempotent: true };
          }

          // 2. Fetch the most recent transaction for this user to get previousHash
          const lastTx = await tx.query.transactions.findFirst({
            where: eq(transactions.userId, userId),
            orderBy: [desc(transactions.createdAt)],
          });

          const previousHash = lastTx?.hash || null;
          const timestamp = new Date();

          // 3. Generate cryptographic hash
          const hash = generateTransactionHash(
            amountBigInt,
            userId,
            timestamp,
            previousHash
          );

          // 4. Insert main transaction record
          const [newTx] = await tx.insert(transactions).values({
            userId,
            orderId: orderId || null,
            idempotencyKey,
            amount: amountBigInt,
            status: 'completed',
            hash,
            previousHash,
            metadata: metadata || {},
            createdAt: timestamp,
            completedAt: timestamp,
          }).returning();

          // 5. Insert double-entry ledger records
          await tx.insert(ledgerEntries).values({
            transactionId: newTx.id,
            userId,
            accountType: 'MAIN',
            entryType: amountBigInt > 0n ? 'CREDIT' : 'DEBIT',
            amount: amountBigInt,
            description: description || 'Ledger transaction',
            createdAt: timestamp,
          });

          // Offset entry for balance
          await tx.insert(ledgerEntries).values({
            transactionId: newTx.id,
            userId: 'SYSTEM',
            accountType: 'SETTLEMENT',
            entryType: amountBigInt > 0n ? 'DEBIT' : 'CREDIT',
            amount: -amountBigInt,
            description: `Offset for transaction ${newTx.id}`,
            createdAt: timestamp,
          });

          return { success: true, transaction: newTx, idempotent: false };
        });
        
        break; // Success!
      } catch (error) {
        if (i === MAX_RETRIES - 1) throw error; // Re-throw if last attempt fails
        console.warn(`Transaction attempt ${i + 1} failed due to network. Retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
      }
    }

    // 6. Dispatch webhook for new successful transactions (Async)
    if (result.success && !result.idempotent) {
      dispatchWebhook(userId, 'transaction.completed', result.transaction);
    }


    // Serialize BigInt for JSON response
    const serializedResult = JSON.parse(
      JSON.stringify(result, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return NextResponse.json(serializedResult, { status: 200 });

  } catch (error: any) {
    console.error('Transaction Error:', error);
    
    // Check for Postgres unique constraint violation on idempotency key
    if (error.code === '23505' && error.constraint === 'transaction_idempotency_key_key') {
       return NextResponse.json({ error: 'Duplicate transaction (Idempotency Key Collision)' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
