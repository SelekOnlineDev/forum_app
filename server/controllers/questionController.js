import { v4 as uuidv4 } from 'uuid'
import { getDb } from '../index.js';

export const getAllQuestions = async (req, res) => {
    try {
    const db = await getDb();
    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;
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
    
    // Gaunu klausimus su vartotojų informacija

    const questions = await db.collection('questions').aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          question: 1,
          createdAt: 1,
          updatedAt: 1,
          likes: 1,
          dislikes: 1,
          answerCount: 1,
          userName: "$user.name"
        }
      },
      { $match: query },
      { $sort: sortOption },
      { $skip: skip },
      { $limit: limit }
    ]).toArray();

    const total = await db.collection('questions').countDocuments(query);
      
    // Gaunu atsakymus kiekvienam klausimui

    for (const question of questions) {
      const answers = await db.collection('answers').aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            answer: 1,
            createdAt: 1,
            updatedAt: 1,
            userName: "$user.name"
          }
        },
        { $match: { questionId: question._id } }
      ]).toArray();
      
      question.answers = answers;
    }
      
    // Atsakymų kiekis kiekvienam klausimui

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
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
      answerCount: 0
    };
    if (!req.body.question || req.body.question.length < 4) {
      return res.status(400).json({ message: 'Question too short' });
}
    const result = await db.collection('questions').insertOne(newQuestion);
    res.status(201).json({ message: 'Question created',question: newQuestion, id: result.insertedId });
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

    const hasLiked = question.likedBy?.includes(userId);
    const hasDisliked = question.dislikedBy?.includes(userId);

    let update = {};

    if (hasLiked) {

      // Pašalinu like

      update = {
        $inc: { likes: -1 },
        $pull: { likedBy: userId }
      };
    } else {

      // Pridedu like

      update = {
        $inc: { likes: 1 },
        $addToSet: { likedBy: userId }
      };
      
      // Pašalinti dislike jei buvo

      if (hasDisliked) {
        update.$inc.dislikes = -1;
        update.$pull = { dislikedBy: userId };
      }
    }

    const result = await db.collection('questions').updateOne(
      { _id: id },
      update
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'Update failed' });
    }

    res.status(200).json({ message: 'Like updated' });
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
    
     // Patikrinti ar vartotojas jau "dislike"

    const hasDisliked = question.dislikedBy?.includes(userId);
    const hasLiked = question.likedBy?.includes(userId);

     let update = {};

    if (hasDisliked) {

      // Pašalinu dislike

      update = {
        $inc: { dislikes: -1 },
        $pull: { dislikedBy: userId }
      };
    } else {

      // Pridedu dislike

      update = {
        $inc: { dislikes: 1 },
        $addToSet: { dislikedBy: userId }
      };
      
      // Pašalinu like jei buvo
      
      if (hasLiked) {
        update.$inc.likes = -1;
        update.$pull = { likedBy: userId };
      }
    }

    const result = await db.collection('questions').updateOne(
      { _id: id },
      update
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'Update failed' });
    }

    res.status(200).json({ message: 'Dislike updated' });
  } catch (err) {
    console.error('Error disliking question:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
