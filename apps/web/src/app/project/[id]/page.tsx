'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { Project, Bid } from '@/types';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import BidCard from '@/components/BidCard';
import BidModal from './bids/BidModal';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projectData, bidsData] = await Promise.all([
        api.getProject(projectId),
        api.getProjectBids(projectId)
      ]);
      setProject(projectData);
      setBids(bidsData);
    } catch (err) {
      setError('Failed to load project data');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    try {
      await api.acceptBid(projectId, bidId);
      await fetchProjectData(); // Refresh data
    } catch (err) {
      console.error('Failed to accept bid:', err);
    }
  };

  const handleBidSubmitted = () => {
    setShowBidModal(false);
    fetchProjectData(); // Refresh bids
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto py-8"
      >
        <div className="card-neu p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-neu-gray mt-4">Loading project details...</p>
        </div>
      </motion.div>
    );
  }

  if (error || !project) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto py-8"
      >
        <div className="card-neu p-8 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="heading-secondary mb-2">Project not found</h2>
          <p className="text-body">{error || 'The project you are looking for does not exist.'}</p>
        </div>
      </motion.div>
    );
  }

  const tabs = [
    { name: 'Overview', count: null },
    { name: 'Bids', count: bids.length },
    { name: 'Deliverables', count: project.deliverable ? 1 : 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto py-8"
    >
      {/* Hero Section */}
      <div className="card-neu mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <h1 className="heading-primary flex-1 mr-4">{project.title}</h1>
              <StatusBadge status={project.status} />
            </div>
            
            <p className="text-body mb-6 leading-relaxed">{project.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-semibold text-neu-gray-dark mb-1">Budget Range</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(project.minBudget)} - {formatCurrency(project.maxBudget)}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-neu-gray-dark mb-1">Deadline</p>
                <p className="text-lg font-semibold text-slate-700">{formatDate(project.deadline)}</p>
                <p className="text-sm text-neu-gray">{formatRelativeTime(project.deadline)}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-neu-gray-dark mb-1">Posted by</p>
                <p className="text-lg font-semibold text-slate-700">{project.buyer.name}</p>
                <p className="text-sm text-neu-gray">{formatRelativeTime(project.createdAt)}</p>
              </div>
            </div>
          </div>
          
          {project.status === 'PENDING' && (
            <div className="lg:ml-6">
              <button
                onClick={() => setShowBidModal(true)}
                className="btn-primary w-full lg:w-auto"
              >
                Place Bid
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="card-neu">
        <Tab.Group selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
          <Tab.List className="flex space-x-1 rounded-xl bg-neu-bg p-1 mb-6">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all duration-200 ${
                    selected
                      ? 'bg-neu-card shadow-neu text-primary-500'
                      : 'text-neu-gray hover:text-slate-700 hover:bg-white/50'
                  }`
                }
              >
                <span className="flex items-center justify-center gap-2">
                  {tab.name}
                  {tab.count !== null && (
                    <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </span>
              </Tab>
            ))}
          </Tab.List>
          
          <Tab.Panels>
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              <Tab.Panel key="overview">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="heading-secondary mb-4">Project Requirements</h3>
                    <div className="card-neu-inset">
                      <p className="text-body whitespace-pre-wrap">{project.description}</p>
                    </div>
                  </div>
                  
                  {project.reviews && project.reviews.length > 0 && (
                    <div>
                      <h3 className="heading-secondary mb-4">Reviews</h3>
                      <div className="space-y-4">
                        {project.reviews.map((review) => (
                          <div key={review.id} className="card-neu-inset">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-slate-700">Review for {review.seller.name}</span>
                              <div className="flex items-center">
                                <span className="text-accent-orange text-lg">
                                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                </span>
                                <span className="ml-2 text-sm text-neu-gray">({review.rating}/5)</span>
                              </div>
                            </div>
                            <p className="text-body">{review.comment}</p>
                            <p className="text-sm text-neu-gray mt-2">{formatRelativeTime(review.createdAt)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </Tab.Panel>

              {/* Bids Tab */}
              <Tab.Panel key="bids">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {bids.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💼</div>
                      <h3 className="heading-secondary mb-2">No bids yet</h3>
                      <p className="text-body">Be the first to place a bid on this project!</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                      {bids.map((bid) => (
                        <BidCard
                          key={bid.id}
                          bid={bid}
                          onAccept={handleAcceptBid}
                          showAcceptButton={project.status === 'PENDING'}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </Tab.Panel>

              {/* Deliverables Tab */}
              <Tab.Panel key="deliverables">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {project.deliverable ? (
                    <div className="card-neu-inset">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-700 mb-1">Project Deliverable</h3>
                          <p className="text-neu-gray text-sm">Uploaded by the seller</p>
                        </div>
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/${project.deliverable}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary"
                        >
                          Download File
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📁</div>
                      <h3 className="heading-secondary mb-2">No deliverables yet</h3>
                      <p className="text-body">
                        {project.status === 'PENDING' 
                          ? 'Deliverables will be available once a bid is accepted and work begins.'
                          : project.status === 'IN_PROGRESS'
                          ? 'The seller will upload deliverables here when ready.'
                          : 'No deliverables were uploaded for this project.'
                        }
                      </p>
                      
                      {project.status === 'IN_PROGRESS' && project.sellerId && (
                        <a
                          href={`/project/${project.id}/upload`}
                          className="btn-primary mt-4"
                        >
                          Upload Deliverable
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              </Tab.Panel>
            </AnimatePresence>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Bid Modal */}
      {showBidModal && (
        <BidModal
          projectId={projectId}
          onClose={() => setShowBidModal(false)}
          onBidSubmitted={handleBidSubmitted}
        />
      )}
    </motion.div>
  );
} 