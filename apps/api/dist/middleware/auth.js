"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.requireRole = requireRole;
exports.requireAuth = requireAuth;
const auth_1 = require("../lib/auth");
/**
 * Authentication middleware that verifies JWT token from cookies
 */
function authMiddleware(req, res, next) {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }
        const payload = (0, auth_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
/**
 * Role-based authorization middleware
 */
function requireRole(role) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (req.user.role !== role) {
            return res.status(403).json({ error: `${role} role required` });
        }
        next();
    };
}
/**
 * Middleware that allows both BUYER and SELLER roles
 */
function requireAuth(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
}
//# sourceMappingURL=auth.js.map