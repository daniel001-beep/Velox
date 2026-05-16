import React from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import { getRealUsers } from '@/src/lib/ledger-service';
import UserManagementClient from '@/app/components/UserManagementClient';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function UserManagementPage() {
  const session = await auth();

  // Basic security check (Middleware handles strict check, but this is a fallback)
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // Fetch real users from database
  const realUsers = await getRealUsers();

  return (
    <DashboardLayout>
      <UserManagementClient initialUsers={realUsers} />
    </DashboardLayout>
  );
}
