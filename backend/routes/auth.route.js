import express from 'express';
import { forgotPassword, login, logout, signup, verifyEmail, resetPassword, checkAuth } from '../controller/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/check-auth', verifyToken, checkAuth); // check if user is authenticated or not. I can name verifyToken as ProtectRoute
router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);

router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

export default router;