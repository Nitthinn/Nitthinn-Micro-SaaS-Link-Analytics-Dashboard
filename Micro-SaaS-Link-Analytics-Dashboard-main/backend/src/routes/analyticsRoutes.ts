import express from 'express';
import { getAnalytics } from '../controllers/analyticsController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// @route   GET /api/analytics
// @desc    Get analytics data
// @access  Private
router.get('/', authenticate, getAnalytics);

export default router;
