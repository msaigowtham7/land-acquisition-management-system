'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Loader2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: LayoutProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gov-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-gov-accent mb-4" size={48} />
          <p className="text-gov-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gov-50 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
