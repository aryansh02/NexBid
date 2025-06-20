'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <header className="card-neu mx-4 mt-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-500">NexBid</h1>
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
    <header className="card-neu mx-4 mt-4 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary-500 cursor-pointer">NexBid</h1>
            </Link>
          </div>
          
          {user ? (
            <nav className="flex items-center space-x-4">
              <Link href="/" className="btn-secondary text-sm">
                Projects
              </Link>
              
              {user.role === 'BUYER' && (
                <Link href="/project/new" className="btn-primary text-sm">
                  Post Project
                </Link>
              )}
              
              <Link href="/dashboard" className="btn-secondary text-sm">
                Dashboard
              </Link>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Hi, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </div>
            </nav>
          ) : (
            <nav className="flex space-x-2">
              <Link href="/" className="btn-secondary text-sm">
                Projects
              </Link>
              <Link href="/auth/login" className="btn-secondary text-sm">
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