import { Router } from 'express';

const router = Router();

// Placeholder auth routes (stretch goal)
router.post('/signup', (req, res) => {
  res.status(501).json({ error: 'Authentication not implemented yet' });
});

router.post('/login', (req, res) => {
  res.status(501).json({ error: 'Authentication not implemented yet' });
});

export default router; 