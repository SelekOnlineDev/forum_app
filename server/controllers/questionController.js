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
    if (req.query.tag) {
      query.tags = req.query.tag;
    }
    if (filter === 'answered') {
      query.answerCount = { $gt: 0 };  // Tik atsakyti klausimai
    }   
    else if (filter === 'unanswered') {
      query.answerCount = { $eq: 0 };  // Tik neatsakyti klausimai
    }
    
    let sortOption = { createdAt: -1 };
    if (sort === 'popular') {
      sortOption = { likes: -1 };
    }
    
    const questions = await db.collection('questions')
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('questions').countDocuments(query);
      
    // Gaunu atsakymus kiekvienam klausimui

    for (const question of questions) {
      const answers = await db.collection('answers')
        .find({ questionId: question._id })
        .toArray();
      question.answers = answers;
    }

    res.status(200).json({
      questions, 
      total, 
      page,
      totalPages: Math.ceil(total / limit)
    });
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
    // Pridedu atsakymus prie klausimo
    
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
      { $set: { question: updatedQuestion, updatedAt: new Date().toISOString()}},
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

export const likeQuestion = async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const userId = req.user.id;
    
    // Pirmiausia gauti klausimą

    const question = await db.collection('questions').findOne({ _id: id });
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Patikrinu ar vartotojas jau "like"

    if (question.likedBy?.includes(userId)) {
      return res.status(400).json({ message: 'You have already liked this question' });
    }
    
    // Konvertuoju "likes" į skaičių (jei tai masyvas) ir atnaujinu

    const currentLikes = Array.isArray(question.likes) ? 
      question.likes[0] : 
      question.likes;
    
    // Atnaujinu su nauja reikšme ir vartotojo ID

    await db.collection('questions').updateOne(
      { _id: id },
      { 
        $set: { likes: currentLikes + 1 },
        $push: { likedBy: userId },
        $pull: { dislikedBy: userId } // Pašalinu iš priešingos kategorijos
      }
    );
    
    res.status(200).json({ message: 'Question liked' });
  } catch (err) {
    console.error('Error liking question:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const dislikeQuestion = async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const userId = req.user.id;
    
    // Pirmiausia gauti klausimą

    const question = await db.collection('questions').findOne({ _id: id });
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Konvertuoju dislikes į skaičių (jei tai masyvas) ir atnaujinu

    const currentDislikes = Array.isArray(question.dislikes) ? 
      question.dislikes[0] : 
      question.dislikes;
    
    // Atnaujinu su nauja reikšme

    await db.collection('questions').updateOne(
      { _id: id },
      { 
        $set: { likes: currentDislikes + 1 },
        $push: { dislikedBy: userId },
        $pull: { likedBy: userId } // Pašalinu iš priešingos kategorijos
      }
    );
    
    res.status(200).json({ message: 'Question disliked' });
  } catch (err) {
    console.error('Error disliking question:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


