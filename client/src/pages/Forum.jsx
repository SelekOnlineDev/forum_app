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
  padding: 13px 13px 13px 13px;
  background-color: #000;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
`;

const FilterButton = styled(Button)`
  background-color: ${({ $active }) => $active ? '#00ff00' : '#666666'};
  color: ${({ $active }) => $active ? '#000' : '#000'};
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
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 3,
    total: 0
  });

   useEffect(() => {
    console.log("Fetched questions:", questions);
    async function fetchQuestions() {
      setLoading(true);
      try {
        const res = await api.get(
          `/questions?page=${pagination.page}&filter=${filter}&sort=${sort}&search=${encodeURIComponent(searchTerm)}`
        );
        setQuestions(res.data);
        setPagination(prev => ({
          ...prev,
          total: parseInt(res.headers['x-total-count'] || '0', 10),
        }));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchQuestions();
  }, [searchTerm, filter, sort, pagination.page]);

  const handleAsk = () => user ? navigate('/ask') : navigate('/login');

  const handleDeleteClick = id => {
    setQuestionToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/questions/${questionToDelete}`);
      setQuestions(qs => qs.filter(q => q._id !== questionToDelete));
    } catch (err) {
      console.error(err);
    }
    setDeleteModalOpen(false);
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
          <span style={{ color: '#00ff00' }}>Filter:</span>
          {['all', 'answered', 'unanswered'].map(f => (
            <FilterButton
              key={f}
              $active={filter === f}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </FilterButton>
          ))}
          <span style={{ color: '#00ff00', marginLeft: 20 }}>Sort:</span>
          {['newest', 'popular'].map(s => (
            <FilterButton
              key={s}
              $active={sort === s}
              onClick={() => setSort(s)}
            >
              {s === 'popular' ? 'Most Answers' : 'Newest'}
            </FilterButton>
          ))}
        </Filters>

        {loading && <div style={{ color: '#00ff00' }}>Loading questions...</div>}
        {!loading && questions.length === 0 && (
          <div style={{ color: '#00ff00', textAlign: 'center' }}>No questions found</div>
        )}

        <QuestionsList>
          {questions.map(q => (
            <QuestionCard
              key={q._id}
              question={q.question}
              answers={q.answers}
              answerCount={q.answers.length}
              userName={q.userName}
              createdAt={q.createdAt}
              isOwner={user && user.id === q.userId}
              onDelete={() => handleDeleteClick(q._id)}
              onEdit={() => navigate('/ask', { state: { questionToEdit: q } })}
              onClick={() => navigate(`/question/${q._id}`)}
            />
          ))}
        </QuestionsList>

        <Pagination>
          <button disabled={pagination.page === 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>
            Previous
          </button>
          <span>
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit) || 1}
          </span>
          <button
            disabled={pagination.page * pagination.limit >= pagination.total}
            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
          >
            Next
          </button>
        </Pagination>
      </ForumContainer>

      <Modal
        isOpen={deleteModalOpen}
        title="Confirm deletion"
        message="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onClose={() => setDeleteModalOpen(false)}
      />
    </PageContainer>
  );
}

export default Forum;