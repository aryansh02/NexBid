"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projects_1 = require("../controllers/projects");
const upload_1 = require("../controllers/upload");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Project routes
router.get('/', projects_1.getProjects); // GET /api/projects (public)
router.post('/', auth_1.authMiddleware, (0, auth_1.requireRole)('BUYER'), projects_1.createProject); // POST /api/projects (BUYER only)
router.get('/:id', projects_1.getProject); // GET /api/projects/:id (public)
// Bid routes
router.post('/:id/bids', auth_1.authMiddleware, (0, auth_1.requireRole)('SELLER'), projects_1.createBid); // POST /api/projects/:id/bids (SELLER only)
router.get('/:id/bids', projects_1.getProjectBids); // GET /api/projects/:id/bids (public)
router.post('/:id/accept', auth_1.authMiddleware, (0, auth_1.requireRole)('BUYER'), projects_1.acceptBid); // POST /api/projects/:id/accept (BUYER only)
// Status and file upload routes
router.patch('/:id/status', auth_1.authMiddleware, auth_1.requireAuth, projects_1.updateProjectStatus); // PATCH /api/projects/:id/status (authenticated)
router.post('/:id/upload', auth_1.authMiddleware, (0, auth_1.requireRole)('SELLER'), upload_1.upload.single('deliverable'), upload_1.uploadDeliverable); // POST /api/projects/:id/upload (SELLER only)
// Review routes
router.post('/:id/review', auth_1.authMiddleware, (0, auth_1.requireRole)('BUYER'), projects_1.createReview); // POST /api/projects/:id/review (BUYER only)
exports.default = router;
//# sourceMappingURL=projects.js.map