import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import QuestionCard from '../components/molecules/QuestionCard';
import SearchBar from '../components/atoms/SearchBar';
import Button from '../components/atoms/Button';
import Modal from '../components/molecules/Modal';
import styled from 'styled-components';
import api from '../services/api';

const PageContainer = styled.div`
  background-image: url('/src/assets/matrix.png');
  position: relative;
  z-index: 1; 
`;

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

const Title = styled.h2`
  border: 2px solid #00ff00;
  border-radius: 4px;
  flex-wrap: wrap;
  padding: 0px 20px 0px 20px;
  background-color: #000;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
`;

const FilterButton = styled(Button)`
  background-color: ${({ active }) => active ? '#00ff00' : '#666666'};
  color: ${({ active }) => active ? '#000' : '#000'};
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
  const [loading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 3,
    total: 0
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/questions?search=${searchTerm}&filter=${filter}&sort=${sort}`);
        console.log('Questions response:', response.data);
    
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
    <PageContainer >
    <ForumContainer>
      <Header>
        <Title>
          <h2>Quantum Physics Forum</h2>
        </Title>
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

       {questions.length === 0 && !loading && (
          <div style={{ color: '#00ff00', textAlign: 'center' }}>
                No questions found
          </div>
            )}
       {loading && (
           <div style={{ color: '#00ff00', textAlign: 'center' }}>
                Loading questions...
           </div>
            )}
       {loading ? (
           <div style={{ color: '#00ff00', textAlign: 'center' }}>
                Loading questions...
           </div>
          ) : questions.length === 0 ? (
           <div style={{ color: '#00ff00', textAlign: 'center' }}>
          No questions found
           </div>
          ) : (
              questions.map(question => (
         <QuestionCard 
            key={question._id} 
            question={question.question}
            answers={question.answers}
            {...question}/>
        ))
      )}

      <QuestionsList>
        {questions.map(q => (
          <QuestionCard
            key={q._id}
            question={q.question}
            answers={q.answers}
            onDelete={() => handleDeleteClick(q._id)}
            onEdit={() => handleEditQuestion(q._id)}
            isOwner={user && user.id === q.userId}
            onClick={() => navigate(`/question/${q._id}`)}
          />
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button 
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </button>
          
          <span style={{ margin: '0 10px' }}>
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          
          <button 
            disabled={pagination.page * pagination.limit >= pagination.total}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </button>
        </div>
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
    </PageContainer>
  );
};

export default Forum;
