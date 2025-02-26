import { Router } from 'express';

const router = Router();

// Placeholder for user routes
router.get('/profile', (req, res) => {
  res.json({ message: 'User profile route' });
});

export const userRoutes = router; 