"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Placeholder auth routes (stretch goal)
router.post('/signup', (req, res) => {
    res.status(501).json({ error: 'Authentication not implemented yet' });
});
router.post('/login', (req, res) => {
    res.status(501).json({ error: 'Authentication not implemented yet' });
});
exports.default = router;
//# sourceMappingURL=auth.js.map