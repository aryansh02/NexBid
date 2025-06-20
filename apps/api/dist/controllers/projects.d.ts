import { Request, Response, NextFunction } from 'express';
export declare const getProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getProject: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createBid: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProjectBids: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const acceptBid: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateProjectStatus: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createReview: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=projects.d.ts.map