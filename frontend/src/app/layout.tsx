import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import OperationalStatus from '@/components/OperationalStatus';
import { DemoProvider } from '@/context/DemoContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'RAILOPT AI — AI-Powered Railway Maintenance & Block Optimization',
  description: 'AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways (SIH 2026 SIH26027)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <DemoProvider>
            <Topbar />
            <div className="flex flex-1 min-h-0 overflow-hidden">
              <Sidebar />
              <main className="flex-1 min-w-0 overflow-y-auto bg-transparent p-4 pt-16 sm:p-5 lg:p-6">
                <OperationalStatus />
                {children}
              </main>
            </div>
          </DemoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
