import express from 'express';
import {
  getAnswersByQuestionId,
  createAnswer,
  updateAnswer,
  deleteAnswer,
} from '../controllers/answerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/questions/:id/answers', getAnswersByQuestionId);
router.post('/questions/:id/answers', authMiddleware, createAnswer);
router.patch('/answers/:id', authMiddleware, updateAnswer);
router.delete('/answers/:id', authMiddleware, deleteAnswer);

export default router;