import Link from 'next/link';
import { Project } from '@/types';
import { money, formatDate, formatTimeAgo } from '@/lib/format';
import { truncateText } from '@/lib/utils';
import StatusBadge from './StatusBadge';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export default function ProjectCard({ project, className = '' }: ProjectCardProps) {
  return (
    <div className={`card-neu card-neu-hover flex flex-col justify-between h-full min-h-[320px] lg:min-h-[340px] ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 flex-1 mr-4">
          {project.title}
        </h3>
        <StatusBadge status={project.status} />
      </div>
      
      {/* Description */}
      <p className="text-body mb-4 line-clamp-3 flex-grow">
        {truncateText(project.description, 150)}
      </p>
      
      {/* Budget and Deadline */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-neu-gray">Budget</p>
          <p className="font-semibold text-emerald-600">
            {money(project.minBudget)} - {money(project.maxBudget)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-neu-gray">Deadline</p>
          <p className="font-medium text-slate-700">{formatDate(project.deadline)}</p>
        </div>
      </div>
      
      {/* Footer with bids count and CTA */}
      <div className="flex justify-between items-center mt-auto">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-neu-gray">
            {project._count?.bids || 0} bid{(project._count?.bids || 0) !== 1 ? 's' : ''}
          </span>
          <span className="text-xs text-neu-gray">
            {formatTimeAgo(project.createdAt)}
          </span>
        </div>
        <Link
          href={`/project/${project.id}`}
          className="btn-primary text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-neuHover"
        >
          View Details
        </Link>
      </div>
    </div>
  );
} 