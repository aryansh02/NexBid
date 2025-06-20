'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PlusIcon, BriefcaseIcon, UserIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { Project, Role } from '@/types';
import ProjectCard from '@/components/ProjectCard';
import StatusBadge from '@/components/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';

// TODO: Replace with actual user context when JWT auth is implemented
const mockUser = {
  id: 'buyer-1-id',
  name: 'John Buyer',
  email: 'john@example.com',
  role: 'BUYER' as Role,
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // TODO: Get user from auth context
  const user = mockUser;

  useEffect(() => {
    fetchUserProjects();
  }, [activeTab]);

  const fetchUserProjects = async () => {
    try {
      setLoading(true);
      // For now, fetch all projects and filter on client side
      // TODO: Update API to support user-specific project filtering
      const response = await api.getProjects({
        status: activeTab === 'active' ? undefined : 'COMPLETED',
        limit: 50,
      });
      
      // Filter projects based on user role
      let filteredProjects = response.projects;
      if (user.role === 'BUYER') {
        filteredProjects = response.projects.filter((p: Project) => p.buyerId === user.id);
      } else {
        filteredProjects = response.projects.filter((p: Project) => p.sellerId === user.id);
      }
      
      if (activeTab === 'active') {
        filteredProjects = filteredProjects.filter((p: Project) => 
          p.status === 'PENDING' || p.status === 'IN_PROGRESS'
        );
      }
      
      setProjects(filteredProjects);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProjectStats = () => {
    const pending = projects.filter(p => p.status === 'PENDING').length;
    const inProgress = projects.filter(p => p.status === 'IN_PROGRESS').length;
    const completed = projects.filter(p => p.status === 'COMPLETED').length;
    
    return { pending, inProgress, completed };
  };

  const stats = getProjectStats();

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto py-8"
      >
        <div className="card-neu p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-neu-gray mt-4">Loading your dashboard...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto py-8"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
        <div>
          <h1 className="heading-primary">My Workspace</h1>
          <p className="text-body mt-2">
            Welcome back, {user.name}! Here&apos;s your {user.role.toLowerCase()} dashboard.
          </p>
        </div>
        
        {user.role === 'BUYER' && (
          <Link href="/project/new" className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            New Project
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-neu text-center"
        >
          <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pending}</div>
          <p className="text-neu-gray">Pending Projects</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-neu text-center"
        >
          <div className="text-3xl font-bold text-blue-600 mb-2">{stats.inProgress}</div>
          <p className="text-neu-gray">In Progress</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-neu text-center"
        >
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.completed}</div>
          <p className="text-neu-gray">Completed</p>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="card-neu mb-8">
        <div className="flex space-x-1 rounded-xl bg-neu-bg p-1 mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ${
              activeTab === 'active'
                ? 'bg-neu-card shadow-neu text-primary-500'
                : 'text-neu-gray hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            Active Projects
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ${
              activeTab === 'completed'
                ? 'bg-neu-card shadow-neu text-primary-500'
                : 'text-neu-gray hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            Completed Projects
          </button>
        </div>

        {/* Projects Grid */}
        {error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="heading-secondary mb-2">Something went wrong</h3>
            <p className="text-body mb-4">{error}</p>
            <button onClick={fetchUserProjects} className="btn-primary">
              Try again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">
              {user.role === 'BUYER' ? '📝' : '💼'}
            </div>
            <h3 className="heading-secondary mb-4">
              {activeTab === 'active' 
                ? `No active projects${user.role === 'BUYER' ? ' yet' : ' assigned'}`
                : 'No completed projects yet'
              }
            </h3>
            <p className="text-body mb-6">
              {user.role === 'BUYER' ? (
                activeTab === 'active' 
                  ? "Ready to start your first project? Post a project and connect with talented sellers!"
                  : "Once you complete projects, they&apos;ll appear here with reviews and final deliverables."
              ) : (
                activeTab === 'active'
                  ? "Browse available projects and place bids to get started with your freelancing journey!"
                  : "Complete projects will appear here with client reviews and your earnings history."
              )}
            </p>
            
            {user.role === 'BUYER' && activeTab === 'active' && (
              <Link href="/project/new" className="btn-primary">
                <PlusIcon className="h-5 w-5 mr-2" />
                Post Your First Project
              </Link>
            )}
            
            {user.role === 'SELLER' && activeTab === 'active' && (
              <Link href="/" className="btn-primary">
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                Browse Projects
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-6">
            {user.role === 'BUYER' ? (
              // Buyer View - Show project cards with New Project card
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeTab === 'active' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link href="/project/new" className="block">
                      <div className="card-neu card-neu-hover border-2 border-dashed border-primary-300 text-center min-h-[280px] flex flex-col items-center justify-center">
                        <PlusIcon className="h-12 w-12 text-primary-500 mb-4" />
                        <h3 className="text-lg font-semibold text-primary-500 mb-2">New Project</h3>
                        <p className="text-neu-gray">Post a new project and get bids from sellers</p>
                      </div>
                    </Link>
                  </motion.div>
                )}
                
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 1) * 0.1 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </div>
            ) : (
              // Seller View - Show accepted projects with buyer info
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card-neu"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-slate-800 flex-1 mr-4">
                            {project.title}
                          </h3>
                          <StatusBadge status={project.status} />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-neu-gray">Client</p>
                            <div className="flex items-center">
                              <UserIcon className="h-4 w-4 text-neu-gray mr-1" />
                              <p className="font-medium text-slate-700">{project.buyer.name}</p>
                            </div>
                          </div>
                          
                                                     <div>
                             <p className="text-sm text-neu-gray">Your Bid</p>
                             <p className="font-semibold text-green-600">
                               {formatCurrency(project.bids?.find(bid => bid.accepted)?.amount || 0)}
                             </p>
                           </div>
                          
                          <div>
                            <p className="text-sm text-neu-gray">Deadline</p>
                            <p className="font-medium text-slate-700">{formatDate(project.deadline)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link
                          href={`/project/${project.id}`}
                          className="btn-secondary text-sm"
                        >
                          View Details
                        </Link>
                        
                        {project.status === 'IN_PROGRESS' && !project.deliverable && (
                          <Link
                            href={`/project/${project.id}/upload`}
                            className="btn-primary text-sm"
                          >
                            Upload Deliverable
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
} 