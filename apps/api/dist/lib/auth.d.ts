export interface JWTPayload {
    id: string;
    email: string;
    role: 'BUYER' | 'SELLER';
}
/**
 * Sign a JWT token with user payload
 */
export declare function signToken(payload: JWTPayload): string;
/**
 * Verify and decode a JWT token
 */
export declare function verifyToken(token: string): JWTPayload;
/**
 * Hash a password using bcrypt
 */
export declare function hashPassword(password: string): Promise<string>;
/**
 * Compare a password with its hash
 */
export declare function comparePassword(password: string, hash: string): Promise<boolean>;
/**
 * Synchronous password hashing for seed scripts
 */
export declare function hashPasswordSync(password: string): string;
//# sourceMappingURL=auth.d.ts.map