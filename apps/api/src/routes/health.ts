import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'NexBid API'
  });
});

export default router; 