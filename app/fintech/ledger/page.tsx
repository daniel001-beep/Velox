import React from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import LedgerClient, { UITransaction } from '@/app/components/LedgerClient';
import { db } from '@/src/db';
import { transactions } from '@/src/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function LedgerPage() {
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
    console.error("Ledger database fetch failed:", error);
    // Graceful fallback to empty state
  }

  // Map database transactions to the format expected by the UI
  const mappedTx: UITransaction[] = dbTx.map((tx) => {
    const meta = (tx.metadata as any) || {};
    
    // Infer type if not explicitly set
    const type = meta.type || (tx.amount > 0n ? 'DEPOSIT' : 'TRANSFER');
    
    // Fallback description
    const description = meta.description || `Transaction ${tx.id.substring(0, 8)}`;

    return {
      id: tx.id,
      type: type,
      description: description,
      date: tx.createdAt ? new Date(tx.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      amount: Number(tx.amount) / 100, // Convert from BigInt cents back to float/dollars for display
      status: tx.status.toUpperCase(),
    };
  });

  return (
    <DashboardLayout>
      <LedgerClient initialTransactions={mappedTx} />
    </DashboardLayout>
  );
}
