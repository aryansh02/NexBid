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

const router = Router();

// Project routes
router.get('/', getProjects);                    // GET /api/projects
router.post('/', createProject);                 // POST /api/projects
router.get('/:id', getProject);                  // GET /api/projects/:id

// Bid routes
router.post('/:id/bids', createBid);             // POST /api/projects/:id/bids
router.get('/:id/bids', getProjectBids);         // GET /api/projects/:id/bids
router.post('/:id/accept', acceptBid);           // POST /api/projects/:id/accept

// Status and file upload routes
router.patch('/:id/status', updateProjectStatus); // PATCH /api/projects/:id/status
router.post('/:id/upload', upload.single('deliverable'), uploadDeliverable); // POST /api/projects/:id/upload

// Review routes (stretch goal)
router.post('/:id/review', createReview);        // POST /api/projects/:id/review

export default router; 