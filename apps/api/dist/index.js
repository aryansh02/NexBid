"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = exports.requireRole = exports.authMiddleware = exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const client_1 = require("@prisma/client");
// Load environment variables
dotenv_1.default.config();
// Initialize Prisma Client
exports.prisma = new client_1.PrismaClient();
// Import routes
const projects_1 = __importDefault(require("./routes/projects"));
const auth_1 = __importDefault(require("./routes/auth"));
// Export auth middleware for use in other files
var auth_2 = require("./middleware/auth");
Object.defineProperty(exports, "authMiddleware", { enumerable: true, get: function () { return auth_2.authMiddleware; } });
Object.defineProperty(exports, "requireRole", { enumerable: true, get: function () { return auth_2.requireRole; } });
Object.defineProperty(exports, "requireAuth", { enumerable: true, get: function () { return auth_2.requireAuth; } });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// Middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
// Serve static files (uploads)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// API Routes
app.use('/api/projects', projects_1.default);
app.use('/api/auth', auth_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Start server
async function startServer() {
    try {
        // Test database connection
        await exports.prisma.$connect();
        console.log('✅ Database connected successfully');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    await exports.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down server...');
    await exports.prisma.$disconnect();
    process.exit(0);
});
startServer();
//# sourceMappingURL=index.js.map