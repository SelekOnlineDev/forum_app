import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InputField from '../components/molecules/InputField';
import Button from '../components/atoms/Button';
import styled from 'styled-components';
import api from '../services/api';
import { useUser } from '../context/UserContext';

const Container = styled.div`
   background-image: url('/src/assets/matrix.png');
   padding: 120px;
   margin: 0;
   height: 70vh;
  `;

const AskContainer = styled.div`
  max-width: 800px;
  margin: 0rem auto;
  padding: 25px;
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ff00;
  border-radius: 4px;
`;

const Title = styled.h2`
  color: #00ff00;
  text-align: center;
  margin-top: 0;
`;

const Ask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Tikrinu ar redaguojamas esamas klausimas

  const questionToEdit = location.state?.questionToEdit;

  useEffect(() => {
    if (questionToEdit) {
      setQuestion(questionToEdit.question);
    }
  }, [questionToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!question || question.length < 10) {
      setError('Question must be at least 10 characters');
      return;
    }
    
    try {
      if (questionToEdit) {
        // Redaguoju esamą klausimą
        await api.patch(`/questions/${questionToEdit._id}`, { question });
        setSuccess('Question updated successfully!');
      } else {
        // Kuriamas naujas klausimas
        await api.post('/questions', { question });
        setSuccess('Question created successfully!');
      }
      
      setTimeout(() => navigate('/forum'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving question');
    }
  };

  return (
    <Container>
      <AskContainer>
        <Title>{questionToEdit ? 'Edit Question' : 'Ask a Question'}</Title>
        
        <form onSubmit={handleSubmit}>
          <InputField
            label="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            error={error}
          />
          
          {success && <div style={{ color: '#00ff00', margin: '15px 0' }}>{success}</div>}
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <Button type="submit">
              {questionToEdit ? 'Update Question' : 'Post Question'}
            </Button>
            <Button variant="danger" onClick={() => navigate('/forum')}>
              Cancel
            </Button>
          </div>
        </form>
      </AskContainer>
    </Container>
  );
};

export default Ask;
