import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; 
import styled from 'styled-components';
import api from '../services/api';

const Container = styled.div`
  padding: 20px;
`;

const AnswerForm = styled.div`
  margin-top: 20px;
`;

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => { 
    
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/questions/${id}`);
      setQuestion(response.data);
      setAnswers(response.data.answers || []);
    } catch (error) {
      setError('Failed to load question');
      console.error('Failed to fetch question:', error);
      } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, [id]);

  if (loading) return <div style={{ color: '#00ff00' }}>Loading...</div>;
  if (error) return <div style={{ color: '#00ff00' }}>{error}</div>;

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    await api.post(`/questions/${id}/answers`, { content: newAnswer });
    setNewAnswer('');
    
    // Atnaujina atsakymus

    const answersRes = await api.get(`/questions/${id}/answers`);
    setAnswers(answersRes.data);
  };

  if (!question) return <div>Loading...</div>;

  return (
    <Container>
      <h1>{question.question}</h1>
      <p>{question.description}</p>
      
      <h2>Answers ({answers.length})</h2>
      {answers.map(answer => (
        <div key={answer._id}>
          <p>{answer.answer}</p>
          <small>By: {answer.userName}</small>
        </div>
      ))}
      
      <AnswerForm>
        <textarea 
          value={newAnswer} 
          onChange={(e) => setNewAnswer(e.target.value)} 
          placeholder="Your answer..."
        />
        <button onClick={handleSubmit}>Post Answer</button>
      </AnswerForm>
    </Container>
  );
};

export default QuestionDetail;