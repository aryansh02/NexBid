'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Project, ProjectsResponse, Status } from '@/types';
import ProjectCard from '@/components/ProjectCard';

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | Status>('all');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response: ProjectsResponse = await api.getProjects({
        limit: 20,
      });
      setProjects(response.projects);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects locally
  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
      default:
        return 'All';
    }
  };

  const getFilterChipStyles = (status: 'all' | Status): string => {
    const baseStyles = 'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center';
    
    if (filter === status) {
      switch (status) {
        case 'PENDING':
          return `${baseStyles} bg-amber-100 text-amber-800 border-amber-300 shadow-sm`;
        case 'IN_PROGRESS':
          return `${baseStyles} bg-blue-100 text-blue-800 border-blue-300 shadow-sm`;
        case 'COMPLETED':
          return `${baseStyles} bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm`;
        default:
          return `${baseStyles} bg-brand text-white border-brand shadow-sm`;
      }
    }
    
    return `${baseStyles} bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300`;
  };

  const getStatusCount = (status: 'all' | Status): number => {
    if (status === 'all') return projects.length;
    return projects.filter(p => p.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-[#e8f5ff] to-[#f3f4ff]">
        <div className="mx-auto max-w-7xl pt-20 sm:pt-16 pb-20 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="card-neu p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
              <p className="text-neu-gray mt-4 text-center">Loading projects...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-[#e8f5ff] to-[#f3f4ff]">
        <div className="mx-auto max-w-7xl pt-20 sm:pt-16 pb-20 px-4">
          <div className="card-neu max-w-md mx-auto p-6 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="heading-secondary mb-2">Something went wrong</h2>
            <p className="text-body mb-4">{error}</p>
            <button
              onClick={fetchProjects}
              className="btn-primary"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-[#e8f5ff] to-[#f3f4ff]">
      <main className="relative mx-auto max-w-7xl pt-20 sm:pt-16 pb-20 px-4">
        {/* Background accent */}
        <div className="absolute -z-10 inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#e8f2ff] via-transparent to-transparent" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-800 mb-2">Available Projects</h1>
            <p className="lead text-slate-500">
              Discover exciting opportunities and start building something amazing
            </p>
          </div>
          
          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={getFilterChipStyles(status)}
              >
                {status !== 'all' && (
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    status === 'PENDING' ? 'bg-amber-400' :
                    status === 'IN_PROGRESS' ? 'bg-blue-400' :
                    'bg-emerald-400'
                  }`} />
                )}
                {getStatusLabel(status)}
                <span className="ml-1 rounded-full bg-slate-200 px-1.5 text-xs">
                  {getStatusCount(status)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="card-neu max-w-md mx-auto p-8">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="heading-secondary mb-4">No projects found</h2>
              <p className="text-body mb-6">
                {filter === 'all' 
                  ? "Be the first to post a project and start building something amazing!"
                  : `No projects with status "${getStatusLabel(filter)}" at the moment.`
                }
              </p>
              <a
                href="/project/new"
                className="btn-primary"
              >
                Post the first project
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div key={project.id}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
