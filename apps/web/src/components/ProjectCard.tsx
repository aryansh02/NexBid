'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Project } from '@/types';
import { money, formatDate, formatTimeAgo } from '@/lib/format';
import { truncateText } from '@/lib/utils';
import StatusBadge from './StatusBadge';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export default function ProjectCard({ project, className = '' }: ProjectCardProps) {
  const getDeadlineDisplay = () => {
    const deadline = new Date(project.deadline);
    const now = new Date();
    const diffInDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} left`;
    }
    return formatDate(project.deadline);
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className={`card-neu flex flex-col justify-between h-full min-h-[320px] lg:min-h-[340px] hover:-translate-y-1 hover:shadow-neuHover transition-transform ${className}`}
    >
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
          <p className="text-slate-400 text-sm">Budget</p>
          <p className="font-semibold text-emerald-600">
            {money(project.minBudget)} - {money(project.maxBudget)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-sm">Deadline</p>
          <p className="font-medium text-slate-700">{getDeadlineDisplay()}</p>
        </div>
      </div>
      
      {/* Footer with bids count and CTA */}
      <div className="flex justify-between items-center mt-auto">
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-slate-400 text-sm">Bids</span>
            <span className="ml-1 rounded-full bg-slate-200 px-1.5 text-xs">
              {project._count?.bids || 0}
            </span>
          </div>
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
    </motion.article>
  );
} 