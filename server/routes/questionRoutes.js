import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getAllQuestions,
  createQuestion,
  getQuestionById,
  deleteQuestion,
  updateQuestion,
  likeQuestion, 
  dislikeQuestion
} from '../controllers/questionController.js';
import { 
  getAnswersByQuestionId, 
  createAnswer 
} from '../controllers/answerController.js';


const router = express.Router(); // Sukuriu naują Express maršrutizatorių

router.get('/questions', getAllQuestions);
router.post('/questions', authMiddleware, createQuestion);
router.get('/questions/:id', getQuestionById);
router.delete('/questions/:id', authMiddleware, deleteQuestion);
router.put('/questions/:id', authMiddleware, updateQuestion);
router.get('/questions/:id/answers', getAnswersByQuestionId);
router.post('/questions/:id/answers', authMiddleware, createAnswer);
router.post('/questions/:id/like', authMiddleware, likeQuestion);
router.post('/questions/:id/dislike', authMiddleware, dislikeQuestion);

export default router;
