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
    const baseStyles = 'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border';
    
    if (filter === status) {
      switch (status) {
        case 'PENDING':
          return `${baseStyles} bg-amber-100 text-amber-800 border-amber-300 shadow-sm`;
        case 'IN_PROGRESS':
          return `${baseStyles} bg-blue-100 text-blue-800 border-blue-300 shadow-sm`;
        case 'COMPLETED':
          return `${baseStyles} bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm`;
        default:
          return `${baseStyles} bg-slate-100 text-slate-800 border-slate-300 shadow-sm`;
      }
    }
    
    return `${baseStyles} bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-[#e8f5ff] to-[#f3f4ff]">
        <div className="mx-auto max-w-7xl pt-12 pb-20 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="card-neu p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
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
        <div className="mx-auto max-w-7xl pt-12 pb-20 px-4">
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
      <div className="mx-auto max-w-7xl pt-12 pb-20 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="heading-primary text-slate-800 mb-2">Available Projects</h1>
            <p className="text-slate-600">
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
                {getStatusLabel(status)}
                {status !== 'all' && (
                  <span className="ml-2 text-xs opacity-75">
                    ({projects.filter(p => p.status === status).length})
                  </span>
                )}
                {status === 'all' && (
                  <span className="ml-2 text-xs opacity-75">
                    ({projects.length})
                  </span>
                )}
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
      </div>
    </div>
  );
}
