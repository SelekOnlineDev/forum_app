import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import QuestionCard from '../components/molecules/QuestionCard';
import SearchBar from '../components/atoms/SearchBar';
import Button from '../components/atoms/Button';
import Modal from '../components/molecules/Modal';
import Pagination from '../components/molecules/Pagination';
import styled from 'styled-components';
import api from '../services/api';

const PageContainer = styled.div`
  background-image: url('/src/assets/matrix.png');
  position: relative;
  z-index: 1; 
  min-height: 100vh;
  padding: 20px 0;
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

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Title = styled.h2`
  border: 2px solid #00ff00;
  border-radius: 4px;
  padding: 13px;
  background-color: #000;
  margin: 0;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
  align-items: center;

  > span {
    color: #00ff00;
    font-weight: bold;
  }
`;

const FilterButton = styled(Button)`
  background-color: ${({ $active }) => $active ? '#00ff00' : '#000'};
  color: ${({ $active }) => $active ? '#000' : '#00ff00'};
  font-size: 0.9rem;
  padding: 8px 15px;
  border: 1px solid #00ff00;
`;

const QuestionsList = styled.div`
  display: grid;
  gap: 20px;
`;

const AnswerFormContainer = styled.div`
  margin-top: -15px;
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #00ff00;
  background: #000;
`;

const AnswerTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  background: #000;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 10px;
  font-family: 'Courier New', monospace;
  resize: vertical;
`;

const Forum = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 3,
    total: 0,
    totalPages: 1
  });
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [activeAnswerForm, setActiveAnswerForm] = useState(null);
  const [answerContent, setAnswerContent] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/questions?page=${pagination.page}&limit=${pagination.limit}&filter=${filter}&sort=${sort}&search=${searchTerm}`
        );
        
        if (res.data) {
          setQuestions(res.data.questions);
          setPagination({
            page: res.data.page,
            total: res.data.total,
            totalPages: res.data.totalPages,
            limit: pagination.limit
          });
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [searchTerm, filter, sort, pagination.page, refreshCounter]);

  const handleAsk = () => user ? navigate('/ask') : navigate('/login');

  const handleDeleteClick = id => {
    setQuestionToDelete(id);
    setDeleteModalOpen(true);
  };

  // // Funkcija atsakymų išskleidimui

  const toggleAnswers = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // // Funkcija atsakymo formos atidarymui

  const handleAnswerClick = (questionId) => {
    // Automatiškai išskleidžiu visus atsakymus
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: true
    }));
    // Atidarau atsakymo formą
    setActiveAnswerForm(questionId);
  };

   const confirmDelete = async () => {
    try {
      await api.delete(`/questions/${questionToDelete}`);
      setRefreshCounter(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
    setDeleteModalOpen(false);
  };

  const handleLike = async (questionId) => {
    try {
      await api.post(`/questions/${questionId}/like`);
      setRefreshCounter(prev => prev + 1);
    } catch (err) {
      console.error('Error liking question:', err);
    }
  };

  const handleDislike = async (questionId) => {
    try {
      await api.post(`/questions/${questionId}/dislike`);
      setRefreshCounter(prev => prev + 1);
    } catch (err) {
      console.error('Error disliking question:', err);
    }
  };

  const handleAnswerSubmit = async (questionId) => {
    try {
      await api.post(`/questions/${questionId}/answers`, {
        content: answerContent
      });
      setAnswerContent('');
      setActiveAnswerForm(null);
      setRefreshCounter(prev => prev + 1);
    } catch (err) {
      console.error('Error posting answer:', err);
    }
  };

  return (
    <PageContainer>
      <ForumContainer>
        <Header>
          <Title>Quantum Physics Forum</Title>
          <Button size="large" onClick={handleAsk}>
            Ask Question
          </Button>
        </Header>

        <SearchBar onSearch={setSearchTerm} />

        <Filters>
          <span>Filter:</span>
          {['all', 'answered', 'unanswered'].map(f => (
            <FilterButton
              key={f}
              $active={filter === f}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </FilterButton>
          ))}

          <span>Sort:</span>
          {['newest', 'popular'].map(s => (
            <FilterButton
              key={s}
              $active={sort === s}
              onClick={() => setSort(s)}
            >
              {s === 'popular' ? 'Most Answered' : 'Newest'}
            </FilterButton>
          ))}
        </Filters>

        {loading && <div style={{ color: '#00ff00', textAlign: 'center' }}>Loading questions...</div>}
        
        {!loading && questions.length === 0 && (
          <div style={{ color: '#00ff00', textAlign: 'center' }}>No questions found</div>
        )}

          <QuestionsList>
          {questions.map(question => (
            <React.Fragment key={question._id}>
              <QuestionCard
                questionData={question}
                isOwner={user && user.id === question.userId}
                onDelete={handleDeleteClick}
                onLike={handleLike}
                onDislike={handleDislike}
                onAnswer={handleAnswerClick}
                onShowMore={toggleAnswers}
                expanded={expandedQuestions[question._id]}
              />
              
             {/* Rodsu atsakymo formą tik aktyviam klausimui */}

              {activeAnswerForm === question._id && (
                <AnswerFormContainer>
                  <AnswerTextarea
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    placeholder="Write your answer here..."
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Button onClick={() => handleAnswerSubmit(question._id)}>Submit</Button>
                    <Button variant="danger" onClick={() => setActiveAnswerForm(null)}>
                      Cancel
                    </Button>
                  </div>
                </AnswerFormContainer>
              )}
            </React.Fragment>
          ))}
        </QuestionsList>

          <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        />

        <Modal
          isOpen={deleteModalOpen}
          title="Confirm deletion"
          message="Are you sure you want to delete this question? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onClose={() => setDeleteModalOpen(false)}
        />
      </ForumContainer>
    </PageContainer>
  );
}

export default Forum;
