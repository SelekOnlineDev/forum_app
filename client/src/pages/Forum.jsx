import { useState, useEffect } from 'react';
import { QuestionCard } from '../components/molecules/QuestionCard';
import { SearchBar } from '../components/atoms/SearchBar';
import styled from 'styled-components';

const ForumContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const QuestionsList = styled.div`
  margin-top: 20px;
`;

export const Forum = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:5500/api/questions?search=${searchTerm}`);
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [searchTerm]);

  return (
    <ForumContainer>
      <h2>Quantum Physics Forum</h2>
      
      <SearchBar onSearch={setSearchTerm} />
      
      <QuestionsList>
        {questions.map(question => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </QuestionsList>
    </ForumContainer>
  );
};