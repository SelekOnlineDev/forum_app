import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import InputField from '../components/molecules/InputField';
import Button from '../components/atoms/Button';
import styled from 'styled-components';
import api from '../services/api';

const Container = styled.div`
  background-image: url('/src/assets/matrix.png');
  padding: 120px 20px;
  margin: 0;
  min-height: 70vh;
  
  @media (max-width: 768px) {
    padding: 60px 15px;
  }
  
  @media (max-width: 480px) {
    padding: 40px 10px;
  }
`;

const AskContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 25px;
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ff00;
  border-radius: 4px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const Title = styled.h2`
  color: #00ff00;
  text-align: center;
  margin-top: 0;
  font-size: 1.8rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Actions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const Ask = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Jei vartotojas neprisijungęs, nukreipiu į login puslapį

    if (!user) {
      navigate('/login', { state: { from: '/ask' } });
      return;
    }
    
    if (!question.trim()) {
      setError('Question cannot be empty');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/questions', { question });
      navigate('/forum');
    } catch (err) {
      console.error('Error posting question:', err);
      setError('Failed to post question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {

    // Jei vartotojas neprisijungęs, grąžiny į pagrindinį puslapį
    
    if (!user) {
      navigate('/');
    } else {
      navigate('/forum');
    }
  };

  return (
    <Container>
      <AskContainer>
        <Title>Ask a Quantum Question</Title>
        
        {error && (
          <div style={{ color: '#666666', textAlign: 'center', marginBottom: '15px' }}>
            {error}
          </div>
        )}
        
        <Form onSubmit={handleSubmit}>
          <InputField
            label="Your Question"
            as="textarea"
            rows={5}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your quantum physics question..."
            required
          />
          
          <Actions>
            <Button 
              type="submit" 
              size="large"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Posting...' : 'Post Question'}
            </Button>
            
            <Button 
              type="button" 
              variant="danger"
              size="large"
              onClick={handleCancel}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
          </Actions>
        </Form>
      </AskContainer>
    </Container>
  );
};

export default Ask;
