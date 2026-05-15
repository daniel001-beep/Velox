import React from 'react';
import { db } from '@/src/db';
import { transactions } from '@/src/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DashboardClient from '@/app/components/DashboardClient';
import { UITransaction } from '@/app/components/LedgerClient';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // Fetch only the transactions for the logged-in user
  let dbTx = [];
  try {
    dbTx = await db.query.transactions.findMany({
      where: eq(transactions.userId, session.user.id),
      orderBy: [desc(transactions.createdAt)],
    });
  } catch (error) {
    console.error("Dashboard database fetch failed:", error);
    // Graceful fallback to empty state
  }

  let totalBalanceCents = 0n;
  let dayChangeCents = 0n;
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Map database transactions to the format expected by the UI
  // and simultaneously calculate aggregates
  const mappedTx: UITransaction[] = dbTx.map((tx) => {
    const meta = (tx.metadata as any) || {};
    const type = meta.type || (tx.amount > 0n ? 'DEPOSIT' : 'TRANSFER');
    const description = meta.description || `Transaction ${tx.id.substring(0, 8)}`;
    
    // Accumulate total balance
    totalBalanceCents += tx.amount;

    // Accumulate day change
    if (tx.createdAt && new Date(tx.createdAt) > oneDayAgo) {
      dayChangeCents += tx.amount;
    }

    return {
      id: tx.id,
      type: type,
      description: description,
      date: tx.createdAt ? new Date(tx.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      amount: Number(tx.amount) / 100, // Convert from BigInt cents back to float/dollars for display
      status: tx.status.toUpperCase(),
    };
  });

  const totalBalanceUsd = Number(totalBalanceCents) / 100;
  const dayChangeUsd = Number(dayChangeCents) / 100;

  return (
    <DashboardClient 
      totalBalanceUsd={totalBalanceUsd} 
      dayChangeUsd={dayChangeUsd} 
      transactions={mappedTx} 
    />
  );
}
