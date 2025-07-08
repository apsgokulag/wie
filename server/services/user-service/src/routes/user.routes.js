import express from 'express';
import { getProfile } from '../services/user.services.js';
import { protect } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/me', protect, getProfile);
// router.post('/upload', protect, upload.single('image'), updateProfileImage);

export default router;
