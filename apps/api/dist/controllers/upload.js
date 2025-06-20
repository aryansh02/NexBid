"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDeliverable = exports.upload = void 0;
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const validation_1 = require("../lib/validation");
const prisma = new client_1.PrismaClient();
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-projectId-originalname
        const projectId = req.params.id;
        const timestamp = Date.now();
        const ext = path_1.default.extname(file.originalname);
        const name = path_1.default.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, `${timestamp}-${projectId}-${name}${ext}`);
    },
});
// File filter
const fileFilter = (req, file, cb) => {
    // Allow common file types
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/zip',
        'application/x-zip-compressed',
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Allowed types: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, ZIP'));
    }
};
// Configure multer
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
    },
});
// POST /api/projects/:id/upload - Upload deliverable
const uploadDeliverable = async (req, res, next) => {
    try {
        const { id: projectId } = validation_1.uuidParamSchema.parse(req.params);
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // Check if project exists and user has permission
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                buyer: true,
            },
        });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (project.status !== 'IN_PROGRESS') {
            return res.status(400).json({ error: 'Can only upload deliverables for projects in progress' });
        }
        // Update project with deliverable filename
        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                deliverable: req.file.filename,
            },
            include: {
                buyer: true,
            },
        });
        res.json({
            message: 'Deliverable uploaded successfully',
            project: updatedProject,
            file: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                url: `/uploads/${req.file.filename}`,
            },
        });
    }
    catch (error) {
        // Clean up uploaded file if database operation fails
        if (req.file) {
            try {
                fs_1.default.unlinkSync(req.file.path);
            }
            catch (unlinkError) {
                console.error('Failed to clean up uploaded file:', unlinkError);
            }
        }
        next(error);
    }
};
exports.uploadDeliverable = uploadDeliverable;
//# sourceMappingURL=upload.js.map