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
        status: filter === 'all' ? undefined : filter,
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
  }, [filter]);

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="card-neu p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-neu-gray mt-4 text-center">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8">
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
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="heading-primary">Available Projects</h1>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === status
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {projects.length === 0 ? (
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
          {projects.map((project) => (
            <div key={project.id}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
