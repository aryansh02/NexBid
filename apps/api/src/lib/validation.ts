import { z } from 'zod';

// User schemas
export const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['BUYER', 'SELLER']),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Project schemas
export const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  minBudget: z.number().int().positive(),
  maxBudget: z.number().int().positive(),
  deadline: z.string().datetime(),
}).refine((data: { maxBudget: number; minBudget: number }) => data.maxBudget >= data.minBudget, {
  message: "maxBudget must be greater than or equal to minBudget",
  path: ["maxBudget"],
});

export const updateProjectStatusSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
});

// Bid schemas
export const createBidSchema = z.object({
  amount: z.number().int().positive(),
  etaDays: z.number().int().positive().max(365),
  message: z.string().min(1).max(1000),
});

export const acceptBidSchema = z.object({
  bidId: z.string().uuid(),
});

// Review schemas
export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(1000),
});

// Query parameter schemas
export const projectQuerySchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
});

export const uuidParamSchema = z.object({
  id: z.string().uuid(),
}); 