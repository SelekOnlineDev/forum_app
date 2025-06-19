import React, { useReducer, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import QuestionCard from '../components/organisms/QuestionCard';
import SearchBar from '../components/molecules/SearchBar';
import Button from '../components/atoms/Button';
import Modal from '../components/molecules/Modal';
import Pagination from '../components/molecules/Pagination';
import LoadingSpinner from '../components/molecules/LoadingSpinner';
import Alert from '../components/molecules/Alert';
import styled from 'styled-components';
import api from '../services/api';

const FILTERS = {
  ALL: 'All',
  ANSWERED: 'Answered',
  UNANSWERED: 'Unanswered'
};

const SORT_OPTIONS = {
  NEWEST: 'Newest',
  POPULAR: 'Popular'
};
// Funkcija, kuri gauna klausimus iš serverio

const fetchQuestions = async (params) => {
  try {
    const res = await api.get('/questions', { params });
    return {
      success: true,
      data: res.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error fetching questions'
    };
  }
};

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
  padding: 10px;
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
    min-width: 50px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
  
  @media (max-width: 480px) {
    gap: 5px;
  }
`;

const FilterButton = styled(Button)`
  background-color: ${({ $active }) => $active ? '#00ff00' : '#000'};
  color: ${({ $active }) => $active ? '#000' : '#00ff00'};
  font-size: 0.9rem;
  padding: 8px 15px;
  border: 1px solid #00ff00;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background-color: #00ff00;
    color: #000;
  }

  @media (max-width: 768px) {
    padding: 7px 12px;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
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

// Pradinė būsena

const initialState = {
  questions: [],
  pagination: {
    page: 1,
    limit: 3,
    total: 0,
    totalPages: 1
  },
  loading: true,
  deleteModalOpen: false,
  questionToDelete: null,
  expandedQuestion: null,
  activeAnswerForm: null,
  answerContent: '',
  searchTerm: '',
  filter: FILTERS.ALL,
  sort: SORT_OPTIONS.NEWEST,
  error: null
};

// Reduceris, kuris tvarko forumo būseną
// Jis apdoroja veiksmus, tokius kaip klausimų nustatymas

const forumReducer = (state, action) => {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };

    case 'SET_EXPANDED_QUESTION':
      return { 
        ...state, 
         expandedQuestion: state.expandedQuestion === action.payload ? null : action.payload
      };
    
    case 'SET_PAGINATION':
      return { ...state, pagination: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'TOGGLE_DELETE_MODAL':
      return { 
        ...state, 
        deleteModalOpen: action.payload.open,
        questionToDelete: action.payload.id 
      };
    
    case 'TOGGLE_ANSWER_FORM':
      return { 
        ...state, 
        activeAnswerForm: action.payload.id,
        expandedQuestion: action.payload.id 
      };
    
    case 'SET_ANSWER_CONTENT':
      return { ...state, answerContent: action.payload };
    
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    
    case 'SET_PAGE':
      return { 
        ...state, 
        pagination: { ...state.pagination, page: action.payload } 
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'RESET_ANSWER_FORM':
      return { 
        ...state, 
        activeAnswerForm: null, 
        answerContent: '',
        error: null
      };
    
    case 'REFRESH_QUESTIONS':
      return { ...state, refreshCounter: state.refreshCounter + 1 };
    
    default:
      return state;
  }
};

const Forum = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(forumReducer, initialState);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
  
  const {
    questions,
    pagination,
    loading,
    deleteModalOpen,
    questionToDelete,
    expandedQuestion,
    activeAnswerForm,
    answerContent,
    searchTerm,
    filter,
    sort,
    error
  } = state;

  // Funkcija, kuri nustato mygtuko tekstą pagal mobilųjį įrenginį
  
  const getButtonText = (text) => {
    if (!isMobile) return text;
    
    if (text === 'Most Answered') return 'Popular';
    if (text === 'Newest') return 'Newest';
    
    return text.length > 8 ? text.substring(0, 6) + '..' : text;
  };

  // Klausimų įkėlimo funkcija
  // Naudoju useCallback, kad išvengčiau nereikalingų funkcijų kūrimo

  const loadQuestions = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const result = await fetchQuestions({
        page: pagination.page,
        limit: pagination.limit,
        filter,
        sort,
        search: searchTerm
      });
      
      if (result.success) {
        dispatch({ 
          type: 'SET_QUESTIONS', 
          payload: result.data.questions 
        });
        
        dispatch({ 
          type: 'SET_PAGINATION', 
          payload: {
            page: result.data.page,
            total: result.data.total,
            totalPages: result.data.totalPages,
            limit: pagination.limit
          }
        });
      } else {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: result.message || 'Failed to load questions' 
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Network error. Please try again later.' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [pagination.page, filter, sort, searchTerm, pagination.limit]);

  // Pradinis duomenų įkėlimas
  // Naudoji useEffect, kad įkelčiau klausimus, kai komponentas yra įkeltas

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // Ekrano dydžio stebėjimas
  // Naudoju useEffect, kad nustatyčiau, ar tai mobilus įrenginys
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAsk = () => user ? navigate('/ask') : navigate('/login');

  const handleDeleteClick = id => {
    dispatch({ 
      type: 'TOGGLE_DELETE_MODAL', 
      payload: { open: true, id } 
    });
  };

  const handleShowMore = (questionId) => {
    dispatch({
      type: 'SET_EXPANDED_QUESTION',
      payload: questionId
    });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/questions/${questionToDelete}`);
      dispatch({ type: 'REFRESH_QUESTIONS' });
      loadQuestions();
    } catch (err) {
      console.error(err);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to delete question' 
      });
    } finally {
      dispatch({ 
        type: 'TOGGLE_DELETE_MODAL', 
        payload: { open: false, id: null } 
      });
    }
  };

  const handleLike = async (questionId) => {
    try {
      await api.post(`/questions/${questionId}/like`);
      dispatch({ type: 'REFRESH_QUESTIONS' });
      loadQuestions();
    } catch (err) {
      console.error(err);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to like question' 
      });
    }
  };

  const handleDislike = async (questionId) => {
    try {
      await api.post(`/questions/${questionId}/dislike`);
      dispatch({ type: 'REFRESH_QUESTIONS' });
      loadQuestions();
    } catch (err) {
      console.error(err);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to dislike question' 
      });
    }
  };

  const handleAnswerSubmit = async (questionId) => {
    try {
      await api.post(`/questions/${questionId}/answers`, {
        content: answerContent
      });
      
      dispatch({ type: 'RESET_ANSWER_FORM' });
      dispatch({ type: 'REFRESH_QUESTIONS' });
      loadQuestions();
    } catch (err) {
      console.error(err);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to post answer' 
      });
    }
  };

  useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 480);
  };
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <PageContainer>
      <ForumContainer>
        {error && <Alert type="error" message={error} />}
        
        <Header>
          <Title>Quantum Physics Forum</Title>
          <Button size="large" onClick={handleAsk}>
            Ask Question
          </Button>
        </Header>

        <SearchBar 
          onSearch={(term) => dispatch({ 
            type: 'SET_SEARCH_TERM', 
            payload: term 
          })} 
        />

        <Filters>
          <FilterGroup>
            <span>Filter:</span>
            {Object.values(FILTERS).map(f => (
              <FilterButton
                key={f}
                $active={filter === f}
                onClick={() => dispatch({ 
                  type: 'SET_FILTER', 
                  payload: f 
                })}
              >
                {isMobile ? 
                  (f === 'unanswered' ? 'Unans' : f.substring(0, 4)) : 
                  f}
              </FilterButton>
            ))}
          </FilterGroup>

          <FilterGroup>
            <span>Sort:</span>
            {Object.values(SORT_OPTIONS).map(s => (
              <FilterButton
                key={s}
                $active={sort === s}
                onClick={() => dispatch({ 
                  type: 'SET_SORT', 
                  payload: s 
                })}
              >
                {getButtonText(
                  s === SORT_OPTIONS.POPULAR ? 'Most Answered' : 'Newest'
                )}
              </FilterButton>
            ))}
          </FilterGroup>
        </Filters>

        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            margin: '20px' 
          }}>
            <LoadingSpinner size="40px" />
          </div>
        ) : (
          <>
            {questions.length === 0 ? (
              <Alert 
                type="info" 
                message="No questions found" 
              />
            ) : (
              <QuestionsList>
                {questions.map(question => (
                  <React.Fragment key={question._id}>
                    <QuestionCard
                      questionData={question}
                      isOwner={user && user.id === question.userId}
                      onDelete={() => handleDeleteClick(question._id)}
                      onLike={() => handleLike(question._id)}
                      onDislike={() => handleDislike(question._id)}
                      onAnswer={() => dispatch({ 
                        type: 'TOGGLE_ANSWER_FORM', 
                        payload: { id: question._id } 
                      })}
                      onShowMore={handleShowMore}
                      expanded={expandedQuestion === question._id}
                    />
                    
                    {activeAnswerForm === question._id && (
                      <AnswerFormContainer>
                        <AnswerTextarea
                          value={answerContent}
                          onChange={(e) => dispatch({ 
                            type: 'SET_ANSWER_CONTENT', 
                            payload: e.target.value 
                          })}
                          placeholder="Write your answer here..."
                        />
                        <div style={{ 
                          display: 'flex', 
                          gap: '10px', 
                          marginTop: '10px' 
                        }}>
                          <Button 
                            onClick={() => handleAnswerSubmit(question._id)}
                          >
                            Submit
                          </Button>
                          <Button 
                            variant="danger" 
                            onClick={() => dispatch({ 
                              type: 'RESET_ANSWER_FORM' 
                            })}
                          >
                            Cancel
                          </Button>
                        </div>
                      </AnswerFormContainer>
                    )}
                  </React.Fragment>
                ))}
              </QuestionsList>
            )}

            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(page) => dispatch({ 
                type: 'SET_PAGE', 
                payload: page 
              })}
            />
          </>
        )}

        <Modal
          isOpen={deleteModalOpen}
          title="Confirm deletion"
          message="Are you sure you want to delete this question? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onClose={() => dispatch({ 
            type: 'TOGGLE_DELETE_MODAL', 
            payload: { open: false, id: null } 
          })}
        />
      </ForumContainer>
    </PageContainer>
  );
}

export default Forum;
