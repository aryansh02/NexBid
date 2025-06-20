import { Router } from 'express';
import {
  getProjects,
  createProject,
  getProject,
  createBid,
  getProjectBids,
  acceptBid,
  updateProjectStatus,
  createReview,
} from '../controllers/projects';
import { upload, uploadDeliverable } from '../controllers/upload';
import { authMiddleware, requireRole, requireAuth } from '../middleware/auth';

const router = Router();

// Project routes
router.get('/', getProjects);                    // GET /api/projects (public)
router.post('/', authMiddleware, requireRole('BUYER'), createProject);                 // POST /api/projects (BUYER only)
router.get('/:id', getProject);                  // GET /api/projects/:id (public)

// Bid routes
router.post('/:id/bids', authMiddleware, requireRole('SELLER'), createBid);             // POST /api/projects/:id/bids (SELLER only)
router.get('/:id/bids', getProjectBids);         // GET /api/projects/:id/bids (public)
router.post('/:id/accept', authMiddleware, requireRole('BUYER'), acceptBid);           // POST /api/projects/:id/accept (BUYER only)

// Status and file upload routes
router.patch('/:id/status', authMiddleware, requireAuth, updateProjectStatus); // PATCH /api/projects/:id/status (authenticated)
router.post('/:id/upload', authMiddleware, requireRole('SELLER'), upload.single('deliverable'), uploadDeliverable); // POST /api/projects/:id/upload (SELLER only)

// Review routes
router.post('/:id/review', authMiddleware, requireRole('BUYER'), createReview);        // POST /api/projects/:id/review (BUYER only)

export default router; 