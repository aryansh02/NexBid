"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = exports.updateProjectStatus = exports.acceptBid = exports.getProjectBids = exports.createBid = exports.getProject = exports.createProject = exports.getProjects = void 0;
const client_1 = require("@prisma/client");
const validation_1 = require("../lib/validation");
const mailer_1 = require("../lib/mailer");
const prisma = new client_1.PrismaClient();
// GET /api/projects - List projects with optional filtering
const getProjects = async (req, res, next) => {
    try {
        const query = validation_1.projectQuerySchema.parse(req.query);
        const projects = await prisma.project.findMany({
            where: {
                ...(query.status && { status: query.status }),
            },
            include: {
                buyer: {
                    select: { id: true, name: true, email: true, role: true },
                },
                bids: {
                    include: {
                        seller: {
                            select: { id: true, name: true, email: true, role: true },
                        },
                    },
                },
                _count: {
                    select: { bids: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip: (query.page - 1) * query.limit,
            take: query.limit,
        });
        const total = await prisma.project.count({
            where: {
                ...(query.status && { status: query.status }),
            },
        });
        res.json({
            projects,
            pagination: {
                page: query.page,
                limit: query.limit,
                total,
                pages: Math.ceil(total / query.limit),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProjects = getProjects;
// POST /api/projects - Create a new project
const createProject = async (req, res, next) => {
    try {
        const data = validation_1.createProjectSchema.parse(req.body);
        // Get buyerId from authenticated user
        const buyerId = req.user.id;
        const project = await prisma.project.create({
            data: {
                ...data,
                deadline: new Date(data.deadline),
                buyerId,
            },
            include: {
                buyer: {
                    select: { id: true, name: true, email: true, role: true },
                },
            },
        });
        res.status(201).json(project);
    }
    catch (error) {
        next(error);
    }
};
exports.createProject = createProject;
// GET /api/projects/:id - Get project details
const getProject = async (req, res, next) => {
    try {
        const { id } = validation_1.uuidParamSchema.parse(req.params);
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                buyer: {
                    select: { id: true, name: true, email: true, role: true },
                },
                bids: {
                    include: {
                        seller: {
                            select: { id: true, name: true, email: true, role: true },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                reviews: {
                    include: {
                        seller: {
                            select: { id: true, name: true, email: true, role: true },
                        },
                    },
                },
            },
        });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    }
    catch (error) {
        next(error);
    }
};
exports.getProject = getProject;
// POST /api/projects/:id/bids - Submit a bid
const createBid = async (req, res, next) => {
    try {
        const { id: projectId } = validation_1.uuidParamSchema.parse(req.params);
        const data = validation_1.createBidSchema.parse(req.body);
        // Get sellerId from authenticated user
        const sellerId = req.user.id;
        // Check if project exists and is still pending
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (project.status !== 'PENDING') {
            return res.status(400).json({ error: 'Project is no longer accepting bids' });
        }
        // Check if seller already bid on this project
        const existingBid = await prisma.bid.findFirst({
            where: {
                projectId,
                sellerId,
            },
        });
        if (existingBid) {
            return res.status(400).json({ error: 'You have already placed a bid on this project' });
        }
        const bid = await prisma.bid.create({
            data: {
                ...data,
                projectId,
                sellerId,
            },
            include: {
                seller: {
                    select: { id: true, name: true, email: true, role: true },
                },
                project: {
                    select: { id: true, title: true },
                },
            },
        });
        res.status(201).json(bid);
    }
    catch (error) {
        next(error);
    }
};
exports.createBid = createBid;
// GET /api/projects/:id/bids - Get bids for a project
const getProjectBids = async (req, res, next) => {
    try {
        const { id: projectId } = validation_1.uuidParamSchema.parse(req.params);
        const bids = await prisma.bid.findMany({
            where: { projectId },
            include: {
                seller: {
                    select: { id: true, name: true, email: true, role: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(bids);
    }
    catch (error) {
        next(error);
    }
};
exports.getProjectBids = getProjectBids;
// POST /api/projects/:id/accept - Accept a bid (transactional)
const acceptBid = async (req, res, next) => {
    try {
        const { id: projectId } = validation_1.uuidParamSchema.parse(req.params);
        const { bidId } = validation_1.acceptBidSchema.parse(req.body);
        // Use transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            // Get the bid and project
            const bid = await tx.bid.findUnique({
                where: { id: bidId },
                include: {
                    seller: true,
                    project: {
                        include: { buyer: true },
                    },
                },
            });
            if (!bid || bid.projectId !== projectId) {
                throw new Error('Bid not found or does not belong to this project');
            }
            if (bid.project.status !== 'PENDING') {
                throw new Error('Project is not in pending status');
            }
            // Check if the authenticated user is the project owner
            if (bid.project.buyerId !== req.user.id) {
                throw new Error('Only the project owner can accept bids');
            }
            // Update bid as accepted
            const updatedBid = await tx.bid.update({
                where: { id: bidId },
                data: { accepted: true },
            });
            // Update project with selected seller and status
            const updatedProject = await tx.project.update({
                where: { id: projectId },
                data: {
                    sellerId: bid.sellerId,
                    status: 'IN_PROGRESS',
                },
                include: {
                    buyer: true,
                },
            });
            return { bid: updatedBid, project: updatedProject, seller: bid.seller };
        });
        // Send email notification
        try {
            await (0, mailer_1.sendBidAcceptedEmail)(result.seller, result.project.buyer, result.project, result.bid);
        }
        catch (emailError) {
            console.error('Failed to send bid accepted email:', emailError);
            // Don't fail the request if email fails
        }
        res.json({
            message: 'Bid accepted successfully',
            project: result.project,
            bid: result.bid,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.acceptBid = acceptBid;
// PATCH /api/projects/:id/status - Update project status
const updateProjectStatus = async (req, res, next) => {
    try {
        const { id: projectId } = validation_1.uuidParamSchema.parse(req.params);
        const { status } = validation_1.updateProjectStatusSchema.parse(req.body);
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                buyer: true,
            },
        });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        // Check if user is authorized to update this project
        const isOwner = project.buyerId === req.user.id;
        const isAssignedSeller = project.sellerId === req.user.id;
        if (!isOwner && !isAssignedSeller) {
            return res.status(403).json({ error: 'Not authorized to update this project' });
        }
        // Validate status transition
        if (project.status === 'COMPLETED') {
            return res.status(400).json({ error: 'Project is already completed' });
        }
        if (status === 'COMPLETED' && project.status !== 'IN_PROGRESS') {
            return res.status(400).json({ error: 'Can only complete projects that are in progress' });
        }
        if (status === 'COMPLETED' && !project.deliverable) {
            return res.status(400).json({ error: 'Cannot complete project without uploading deliverable' });
        }
        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: { status },
            include: {
                buyer: true,
            },
        });
        // Send email if project completed
        if (status === 'COMPLETED' && project.sellerId) {
            try {
                const seller = await prisma.user.findUnique({
                    where: { id: project.sellerId },
                });
                if (seller) {
                    await (0, mailer_1.sendProjectCompletedEmail)(project.buyer, seller, updatedProject);
                }
            }
            catch (emailError) {
                console.error('Failed to send project completed email:', emailError);
            }
        }
        res.json(updatedProject);
    }
    catch (error) {
        next(error);
    }
};
exports.updateProjectStatus = updateProjectStatus;
// POST /api/projects/:id/review - Create a review
const createReview = async (req, res, next) => {
    try {
        const { id: projectId } = validation_1.uuidParamSchema.parse(req.params);
        const data = validation_1.createReviewSchema.parse(req.body);
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (project.status !== 'COMPLETED') {
            return res.status(400).json({ error: 'Can only review completed projects' });
        }
        if (!project.sellerId) {
            return res.status(400).json({ error: 'No seller assigned to this project' });
        }
        // Check if review already exists
        const existingReview = await prisma.review.findFirst({
            where: { projectId },
        });
        if (existingReview) {
            return res.status(400).json({ error: 'Review already exists for this project' });
        }
        const review = await prisma.review.create({
            data: {
                ...data,
                projectId,
                sellerId: project.sellerId,
            },
            include: {
                seller: {
                    select: { id: true, name: true, email: true, role: true },
                },
                project: {
                    select: { id: true, title: true },
                },
            },
        });
        res.status(201).json(review);
    }
    catch (error) {
        next(error);
    }
};
exports.createReview = createReview;
//# sourceMappingURL=projects.js.map