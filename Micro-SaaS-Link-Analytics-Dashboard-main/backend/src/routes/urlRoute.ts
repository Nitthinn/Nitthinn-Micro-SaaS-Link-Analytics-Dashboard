import express from 'express';
import { createShortUrl, getAnalyticsForAllLinks , searchShortenedUrls, getLinksForUser} from '../controllers/urlController';
import { authenticate} from '../middleware/authMiddleware';

const router = express.Router();

router.post('/shorten', authenticate, createShortUrl);
router.get('/analytics', authenticate, getAnalyticsForAllLinks);
router.post('/search', authenticate, searchShortenedUrls);
router.get('/links', authenticate, getLinksForUser);


export default router;
