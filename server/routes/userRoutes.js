import express from 'express';
import { 
    registerUser,
    loginUser,
    updateProfile,
    updatePassword
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router(); // Sukuriu naują Express maršrutizatorių

router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/profile', authMiddleware, updateProfile);
router.patch('/password', authMiddleware, updatePassword);
router.patch('/user/profile', authMiddleware, updateProfile);
router.patch('/user/password', authMiddleware, updatePassword);

export default router;
