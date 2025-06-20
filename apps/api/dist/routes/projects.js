"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projects_1 = require("../controllers/projects");
const upload_1 = require("../controllers/upload");
const router = (0, express_1.Router)();
// Project routes
router.get('/', projects_1.getProjects); // GET /api/projects
router.post('/', projects_1.createProject); // POST /api/projects
router.get('/:id', projects_1.getProject); // GET /api/projects/:id
// Bid routes
router.post('/:id/bids', projects_1.createBid); // POST /api/projects/:id/bids
router.get('/:id/bids', projects_1.getProjectBids); // GET /api/projects/:id/bids
router.post('/:id/accept', projects_1.acceptBid); // POST /api/projects/:id/accept
// Status and file upload routes
router.patch('/:id/status', projects_1.updateProjectStatus); // PATCH /api/projects/:id/status
router.post('/:id/upload', upload_1.upload.single('deliverable'), upload_1.uploadDeliverable); // POST /api/projects/:id/upload
// Review routes (stretch goal)
router.post('/:id/review', projects_1.createReview); // POST /api/projects/:id/review
exports.default = router;
//# sourceMappingURL=projects.js.map