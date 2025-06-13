import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getAllQuestions,
  createQuestion,
  getQuestionById,
  deleteQuestion,
  updateQuestion,
} from '../controllers/questionController.js';
import { 
  getAnswersByQuestionId, 
  createAnswer 
} from '../controllers/answerController.js';


const router = express.Router();

router.get('/questions', getAllQuestions);
router.post('/questions', authMiddleware, createQuestion);
router.get('/questions/:id', getQuestionById);
router.delete('/questions/:id', authMiddleware, deleteQuestion);
router.put('/questions/:id', authMiddleware, updateQuestion);
router.get('/questions/:id/answers', getAnswersByQuestionId);
router.post('/questions/:id/answers', authMiddleware, createAnswer);

export default router;
