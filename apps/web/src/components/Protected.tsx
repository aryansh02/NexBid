'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedProps {
  children: React.ReactNode;
  role?: 'BUYER' | 'SELLER';
  requireAuth?: boolean;
}

export default function Protected({ children, role, requireAuth = true }: ProtectedProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push('/auth/login');
        return;
      }

      if (role && user && user.role !== role) {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, loading, router, role, requireAuth]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // If auth is required but user is not logged in, don't render children
  if (requireAuth && !user) {
    return null;
  }

  // If specific role is required but user doesn't have it, don't render children
  if (role && user && user.role !== role) {
    return null;
  }

  return <>{children}</>;
} 