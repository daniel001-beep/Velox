import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DashboardClient from '@/app/components/DashboardClient';
import { getDashboardStats } from '@/src/lib/ledger-service';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const { totalBalanceUsd, dayChangeUsd, transactions } = await getDashboardStats(session.user.id);

  return (
    <DashboardClient 
      totalBalanceUsd={totalBalanceUsd} 
      dayChangeUsd={dayChangeUsd} 
      transactions={transactions} 
    />
  );
}
