'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import OperationalStatus from '@/components/OperationalStatus';
import { useAuth } from '@/context/AuthContext';
import { RefreshCw } from 'lucide-react';

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!isLoading && !user && !isLoginPage) {
      router.push('/login');
    }
  }, [user, isLoading, isLoginPage, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">{children}</div>;
  }

  if (isLoading || (!user && !isLoginPage)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3 font-mono text-xs text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
        <span>Authenticating Control Room Session...</span>
      </div>
    );
  }

  return (
    <>
      <Topbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto bg-transparent p-4 pt-16 sm:p-5 lg:p-6">
          <OperationalStatus />
          {children}
        </main>
      </div>
    </>
  );
}
