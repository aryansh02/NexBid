"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.hashPasswordSync = hashPasswordSync;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
/**
 * Sign a JWT token with user payload
 */
function signToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '7d',
    });
}
/**
 * Verify and decode a JWT token
 */
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error('Invalid or expired token');
    }
}
/**
 * Hash a password using bcrypt
 */
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 10);
}
/**
 * Compare a password with its hash
 */
async function comparePassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
/**
 * Synchronous password hashing for seed scripts
 */
function hashPasswordSync(password) {
    return bcryptjs_1.default.hashSync(password, 10);
}
//# sourceMappingURL=auth.js.map