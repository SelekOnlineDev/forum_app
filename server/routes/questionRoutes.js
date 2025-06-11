import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getAllQuestions,
  createQuestion,
  getQuestionById,
  deleteQuestion,
  updateQuestion,
} from '../controllers/questionController.js';

const router = express.Router();

router.get('/questions', getAllQuestions);
router.post('/questions', authMiddleware, createQuestion);
router.get('/questions/:id', getQuestionById);
router.delete('/questions/:id', authMiddleware, deleteQuestion);
router.put('/questions/:id', authMiddleware, updateQuestion);

export default router;
