import { v4 as uuidv4 } from 'uuid'
import { getDb } from '../index.js';

export const getAllQuestions = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 3;  // 3 klausimai per puslapį
    const skip = (page - 1) * limit;
  try {
    const db = await getDb();
    const { search, filter, sort } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (filter === 'answered') {
      query.answerCount = { $gt: 0 };  // Tik atsakyti klausimai
    }   
    else if (filter === 'unanswered') {
      query.answerCount = { $eq: 0 };  // Tik neatsakyti klausimai
    }
    
    let sortOption = { createdAt: -1 };
    if (sort === 'popular') {
      sortOption = { answerCount: -1 };
    }
    
    const questions = await db.collection('questions')
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('questions').countDocuments();
      
    // Gaunu atsakymus kiekvienam klausimui

    for (const question of questions) {
      const answers = await db.collection('answers')
        .find({ questionId: question._id })
        .toArray();
      question.answers = answers;
    }

    res.status(200).json(questions);
  } catch (err) {
    console.error('Error getting questions:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const db = await getDb();
    const newQuestion = {
      _id: uuidv4(),
      userId: req.user.id, // Naudoju prisijungusio vartotojo ID
      question: req.body.question,
      createdAt: new Date().toISOString()
    };
    if (!req.body.question || req.body.question.length < 4) {
      return res.status(400).json({ message: 'Question too short' });
}
    const result = await db.collection('questions').insertOne(newQuestion);
    res.status(201).json({ message: 'Question created', id: result.insertedId });
  } catch (err) {
    console.error('Error creating question:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const db = await getDb();
    const question = await db.collection('questions').findOne({ _id: req.params.id });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    } 
    if (question.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unautorized' });
    }
    res.status(200).json(question);
    const answers = await db.collection('answers')
      .find({ questionId: req.params.id })
      .toArray();
    
    res.status(200).json({ ...question, answers });
  } catch (err) {
    console.error('Error getting question by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const db = await getDb();
    const questionId = req.params.id;
    await db.collection('answers').deleteMany({ questionId: questionId }); // Ištrinu visus atsakymus, susijusius su šiuo klausimu
    const result = await db.collection('questions').deleteOne({ _id: req.params.id }); // Ištrinu klausimą pagal ID
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json({ message: 'Question deleted' });
  } catch (err) {
    console.error('Error deleting question:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const db = await getDb();
    const { question: updatedQuestion } = req.body;

     // Randu klausimą, pradedu savininko patikrinimą

    const existingQuestion = await db.collection('questions').findOne({ _id: req.params.id });
    if (!existingQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
     // Tikrinu ar vartotojas yra savininkas
    if (existingQuestion.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    // Atnaujinu klausimą
    const result = await db.collection('questions').updateOne(
      { _id: req.params.id },
      { $set: { question: updatedQuestion } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json({ message: 'Question updated' });
  } catch (err) {
    console.error('Error updating question:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
