import React from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LedgerClient from '@/app/components/LedgerClient';
import { getDashboardStats } from '@/src/lib/ledger-service';

export default async function LedgerPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const { transactions } = await getDashboardStats(session.user.id);

  return (
    <DashboardLayout>
      <LedgerClient initialTransactions={transactions} />
    </DashboardLayout>
  );
}
