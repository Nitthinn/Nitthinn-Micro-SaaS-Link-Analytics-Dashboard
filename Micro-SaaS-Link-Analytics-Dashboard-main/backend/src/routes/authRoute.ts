import express, {Request, Response} from 'express';
import {signin, signup} from '../controllers/authController'
const router = express.Router();

// POST /api/auth/login
router.post('/login', signin);
router.post('/signup', signup)
export default router;
