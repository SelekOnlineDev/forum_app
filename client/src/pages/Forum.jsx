import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useUser } from '../context/UserContext';
import { QuestionCard } from '../components/molecules/QuestionCard';
import { SearchBar } from '../components/atoms/SearchBar';
import { Button } from '../components/atoms/Button';
import styled from 'styled-components';

const ForumContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Filters = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const FilterButton = styled(Button)`
  background-color: ${({ active }) => active ? '#00ff00' : '#333'};
  color: ${({ active }) => active ? '#000' : '#00ff00'};
`;

const QuestionsList = styled.div`
  display: grid;
  gap: 15px;
`;

export const Forum = () => {
  const { user } = useUser();
  const history = useHistory();
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const url = `http://localhost:5500/api/questions?search=${searchTerm}&filter=${filter}&sort=${sort}`;
        const response = await fetch(url);
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [searchTerm, filter, sort]);

  const handleAskQuestion = () => {
    if (user) {
      history.push('/ask');
    } else {
      history.push('/login');
    }
  };

  return (
    <ForumContainer>
      <Header>
        <h2>Quantum Physics Forum</h2>
        <Button size="large" onClick={handleAskQuestion}>
          Ask Question
        </Button>
      </Header>
      
      <SearchBar onSearch={setSearchTerm} />
      
      <Filters>
        <FilterButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All
        </FilterButton>
        <FilterButton 
          active={filter === 'answered'} 
          onClick={() => setFilter('answered')}
        >
          Answered
        </FilterButton>
        <FilterButton 
          active={filter === 'unanswered'} 
          onClick={() => setFilter('unanswered')}
        >
          Unanswered
        </FilterButton>
      </Filters>
      
      <Filters>
        <span>Sort by:</span>
        <FilterButton 
          active={sort === 'newest'} 
          onClick={() => setSort('newest')}
        >
          Newest
        </FilterButton>
        <FilterButton 
          active={sort === 'popular'} 
          onClick={() => setSort('popular')}
        >
          Most Answers
        </FilterButton>
      </Filters>
      
      <QuestionsList>
        {questions.map(question => (
          <QuestionCard 
            key={question._id} 
            question={question} 
            onClick={() => history.push(`/question/${question._id}`)}
          />
        ))}
      </QuestionsList>
    </ForumContainer>
  );
};