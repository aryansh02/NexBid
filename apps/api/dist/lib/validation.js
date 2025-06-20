"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidParamSchema = exports.projectQuerySchema = exports.createReviewSchema = exports.acceptBidSchema = exports.createBidSchema = exports.updateProjectStatusSchema = exports.createProjectSchema = exports.loginSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
// User schemas
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['BUYER', 'SELLER']),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
// Project schemas
exports.createProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().min(1).max(2000),
    minBudget: zod_1.z.number().int().positive(),
    maxBudget: zod_1.z.number().int().positive(),
    deadline: zod_1.z.string().datetime(),
}).refine((data) => data.maxBudget >= data.minBudget, {
    message: "maxBudget must be greater than or equal to minBudget",
    path: ["maxBudget"],
});
exports.updateProjectStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
});
// Bid schemas
exports.createBidSchema = zod_1.z.object({
    amount: zod_1.z.number().int().positive(),
    etaDays: zod_1.z.number().int().positive().max(365),
    message: zod_1.z.string().min(1).max(1000),
});
exports.acceptBidSchema = zod_1.z.object({
    bidId: zod_1.z.string().uuid(),
});
// Review schemas
exports.createReviewSchema = zod_1.z.object({
    rating: zod_1.z.number().int().min(1).max(5),
    comment: zod_1.z.string().min(1).max(1000),
});
// Query parameter schemas
exports.projectQuerySchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
    page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
    limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
});
exports.uuidParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
//# sourceMappingURL=validation.js.map