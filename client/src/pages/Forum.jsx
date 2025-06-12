import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import QuestionCard from '../components/molecules/QuestionCard';
import SearchBar from '../components/atoms/SearchBar';
import Button from '../components/atoms/Button';
import Modal from '../components/molecules/Modal';
import styled from 'styled-components';
import api from '../services/api';

const ForumContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
`;

const FilterButton = styled(Button)`
  background-color: ${({ active }) => active ? '#00ff00' : '#333'};
  color: ${({ active }) => active ? '#000' : '#00ff00'};
  font-size: 0.9rem;
  padding: 8px 15px;
`;

const QuestionsList = styled.div`
  display: grid;
  gap: 20px;
`;

const Forum = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/questions?search=${searchTerm}&filter=${filter}&sort=${sort}`);
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [searchTerm, filter, sort]);

  const handleAskQuestion = () => {
   if (user) {
      navigate('/ask');
    } else {
      navigate('/login');
    }
  };

  const handleEditQuestion = (questionId) => {
  const question = questions.find(q => q._id === questionId);
  navigate('/ask', { state: { questionToEdit: question } });
  };

  const handleDeleteClick = (questionId) => {
    setQuestionToDelete(questionId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!questionToDelete) return;
    
    try {
      await api.delete(`/questions/${questionToDelete}`);
      setQuestions(questions.filter(q => q._id !== questionToDelete));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
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
        <span style={{ color: '#00ff00', alignSelf: 'center' }}>Filter:</span>
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
        
        <span style={{ color: '#00ff00', alignSelf: 'center', marginLeft: '15px' }}>Sort:</span>
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
            onDelete={() => handleDeleteClick(question._id)}
            onEdit={() => handleEditQuestion(question._id)}
            isOwner={user && user.id === question.userId}
            onClick={() => navigate(`/question/${question._id}`)}
          />
        ))}
      </QuestionsList>
      
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </ForumContainer>
  );
};

export default Forum;
