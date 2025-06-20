import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["BUYER", "SELLER"]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    role: "BUYER" | "SELLER";
}, {
    name: string;
    email: string;
    password: string;
    role: "BUYER" | "SELLER";
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const createProjectSchema: z.ZodEffects<z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    minBudget: z.ZodNumber;
    maxBudget: z.ZodNumber;
    deadline: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    minBudget: number;
    maxBudget: number;
    deadline: string;
}, {
    title: string;
    description: string;
    minBudget: number;
    maxBudget: number;
    deadline: string;
}>, {
    title: string;
    description: string;
    minBudget: number;
    maxBudget: number;
    deadline: string;
}, {
    title: string;
    description: string;
    minBudget: number;
    maxBudget: number;
    deadline: string;
}>;
export declare const updateProjectStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["PENDING", "IN_PROGRESS", "COMPLETED"]>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}, {
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}>;
export declare const createBidSchema: z.ZodObject<{
    amount: z.ZodNumber;
    etaDays: z.ZodNumber;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    amount: number;
    etaDays: number;
}, {
    message: string;
    amount: number;
    etaDays: number;
}>;
export declare const acceptBidSchema: z.ZodObject<{
    bidId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    bidId: string;
}, {
    bidId: string;
}>;
export declare const createReviewSchema: z.ZodObject<{
    rating: z.ZodNumber;
    comment: z.ZodString;
}, "strip", z.ZodTypeAny, {
    rating: number;
    comment: string;
}, {
    rating: number;
    comment: string;
}>;
export declare const projectQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["PENDING", "IN_PROGRESS", "COMPLETED"]>>;
    page: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | undefined;
}, {
    status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | undefined;
    page?: string | undefined;
    limit?: string | undefined;
}>;
export declare const uuidParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=validation.d.ts.map