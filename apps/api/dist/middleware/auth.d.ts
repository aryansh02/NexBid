import { Request, Response, NextFunction } from 'express';
import { JWTPayload } from '../lib/auth';
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}
/**
 * Authentication middleware that verifies JWT token from cookies
 */
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Role-based authorization middleware
 */
export declare function requireRole(role: 'BUYER' | 'SELLER'): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware that allows both BUYER and SELLER roles
 */
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map