import Link from 'next/link';
import { Project } from '@/types';
import { formatCurrency, formatDate, truncateText } from '@/lib/utils';
import StatusBadge from './StatusBadge';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export default function ProjectCard({ project, className = '' }: ProjectCardProps) {
  return (
    <div className={`card-neu card-neu-hover ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 flex-1 mr-4">
          {project.title}
        </h3>
        <StatusBadge status={project.status} />
      </div>
      
      <p className="text-body mb-4 line-clamp-3">
        {truncateText(project.description, 150)}
      </p>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-neu-gray">Budget</p>
          <p className="font-semibold text-green-600">
            {formatCurrency(project.minBudget)} - {formatCurrency(project.maxBudget)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-neu-gray">Deadline</p>
          <p className="font-medium text-slate-700">{formatDate(project.deadline)}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm text-neu-gray">
            {project._count?.bids || 0} bid{(project._count?.bids || 0) !== 1 ? 's' : ''}
          </span>
        </div>
        <Link
          href={`/project/${project.id}`}
          className="btn-primary text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
} 