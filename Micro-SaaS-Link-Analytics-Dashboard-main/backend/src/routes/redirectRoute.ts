
import express from 'express';
import { redirectToOriginalUrl } from '../controllers/urlController';

const router = express.Router();
router.get('/:shortCode', redirectToOriginalUrl);

export default router;



