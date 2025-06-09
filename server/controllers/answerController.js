import { ObjectId } from 'mongodb';
import { getDb } from '../index.js';

export const getAnswersByQuestionId = async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const result = await db.collection('answers').find({ questionId: id }).toArray();
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching answers:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAnswer = async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { content } = req.body;

    const newAnswer = {
      questionId: id,
      content,
      creatorId: req.user?.id || null,
      createdAt: new Date(),
    };

    await db.collection('answers').insertOne(newAnswer);
    res.status(201).json({ message: 'Answer created' });
  } catch (err) {
    console.error('Error creating answer:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAnswer = async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { content } = req.body;

    const result = await db.collection('answers').updateOne(
      { _id: new ObjectId(id) },
      { $set: { content } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    res.status(200).json({ message: 'Answer updated' });
  } catch (err) {
    console.error('Error updating answer:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAnswer = async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;

    const result = await db.collection('answers').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    res.status(200).json({ message: 'Answer deleted' });
  } catch (err) {
    console.error('Error deleting answer:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
