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
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [questionRes, answersRes] = await Promise.all([
        api.get(`/questions/${id}`),
        api.get(`/questions/${id}/answers`)
      ]);
      
      setQuestion(questionRes.data);
      setAnswers(answersRes.data);
    };
    
    fetchData();
  }, [id]);

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