import express from 'express';
import { login, logout, signup } from '../controller/auth.controller.js';

const router = express.Router();

router.get('/login', login);
router.post('/signup', signup);
router.get('/logout', logout);

export default router;