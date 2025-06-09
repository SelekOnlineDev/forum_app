import { ObjectId } from 'mongodb';
import { getDb } from '../index.js';

export const getAllQuestions = async (req, res) => {
  try {
    const db = await getDb();
    const questions = await db.collection('questions').find().toArray();
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
      ...req.body,
      createdAt: new Date(),
    };
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
    const question = await db.collection('questions').findOne({ _id: new ObjectId(req.params.id) });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(question);
  } catch (err) {
    console.error('Error getting question by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.collection('questions').deleteOne({ _id: new ObjectId(req.params.id) });
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
    const { title, body } = req.body;
    const result = await db.collection('questions').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { title, body } }
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
