'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  if (loading) {
    return (
      <header className="sticky top-0 z-40 bg-white/[0.9] backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-brand">NexBid</h1>
            </div>
            <div className="animate-pulse">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-white/[0.9] backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-brand cursor-pointer hover:bg-slate-100 px-2 py-0.5 rounded-lg transition-colors">
                NexBid
              </h1>
            </Link>
          </div>
          
          {user ? (
            <nav className="flex items-center space-x-4">
              <Link 
                href="/" 
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-brand font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-brand' 
                    : 'text-slate-600 hover:text-brand'
                }`}
              >
                Projects
              </Link>
              
              {user.role === 'BUYER' && (
                <Link href="/project/new" className="btn-primary text-sm">
                  Post Project
                </Link>
              )}
              
              <Link 
                href="/dashboard" 
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/dashboard') 
                    ? 'text-brand font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-brand' 
                    : 'text-slate-600 hover:text-brand'
                }`}
              >
                Dashboard
              </Link>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">
                  Hi, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            </nav>
          ) : (
            <nav className="flex space-x-2">
              <Link 
                href="/" 
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-brand font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-brand' 
                    : 'text-slate-600 hover:text-brand'
                }`}
              >
                Projects
              </Link>
              <Link 
                href="/auth/login" 
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/auth/login') 
                    ? 'text-brand font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-brand' 
                    : 'text-slate-600 hover:text-brand'
                }`}
              >
                Login
              </Link>
              <Link href="/auth/signup" className="btn-primary text-sm">
                Sign Up
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
} 