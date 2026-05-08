import React from 'react';
import AgenticCommandBar from '@/app/components/AgenticCommandBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <section className="container mx-auto px-4 md:px-8 lg:px-12 pt-4 pb-20 max-w-7xl">
      <div className="space-y-10">
        {children}
      </div>
      <AgenticCommandBar />
    </section>
  );
}
