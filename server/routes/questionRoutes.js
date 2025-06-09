import express from 'express';
import {
  getAllQuestions,
  createQuestion,
  getQuestionById,
  deleteQuestion,
  updateQuestion,
} from '../controllers/questionController.js';

const router = express.Router();

router.get('/questions', getAllQuestions);
router.post('/questions', createQuestion);
router.get('/questions/:id', getQuestionById);
router.delete('/questions/:id', deleteQuestion);
router.put('/:id', updateQuestion);

export default router;
