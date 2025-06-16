import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import Button from '../components/atoms/Button';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid #00ff00;
  border-radius: 4px;
  color: #00ff00;
`;

const AnswerForm = styled.div`
  margin-top: 30px;
`;

const TextArea = styled.textarea`
  width: 100%;
  background-color: #111;
  border: 1px solid #00ff00;
  color: #00ff00;
  border-radius: 4px;
  padding: 10px;
  font-family: 'Courier New', monospace;
  margin-bottom: 10px;
`;

const AnswerItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #333;
  position: relative;
  background-color: rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
  border-radius: 4px;
`;

const AnswerActions = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
`;

const AnswerText = styled.p`
  margin: 5px 0 10px;
`;

const AnswerMeta = styled.small`
  color: #666;
  display: block;
  font-size: 0.9rem;
`;

const EditForm = styled.div`
  margin-top: 10px;
`;

const Message = styled.div`
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  text-align: center;
  background-color: ${({ $error }) => $error ? 'rgba(102, 102, 102, 0.2)' : 'rgba(0, 255, 0, 0.1)'};
  border: 1px solid ${({ $error }) => $error ? '#666' : '#00ff00'};
`;

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [question, setQuestion] = useState(null);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editAnswerText, setEditAnswerText] = useState('');
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', error: false });
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/questions/${id}`);
      setQuestion(res.data);
      setAnswers(res.data.answers || []);
    } catch (err) {
      console.error(err);
      setMsg({ text: 'Failed to load question', error: true });
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  const postAnswer = async () => {
    if (!user) return navigate('/login');
    if (!newAnswer.trim()) {
      setMsg({ text: 'Answer cannot be empty', error: true });
      return;
    }
    
    try {
      await api.post(`/questions/${id}/answers`, { content: newAnswer });
      setNewAnswer('');
      setShowAnswerForm(false);
      setMsg({ text: 'Answer posted successfully!', error: false });
      load(); // Perkraunu duomenis
    } catch (err) {
      console.error(err);
      setMsg({ text: 'Failed to post answer', error: true });
    }
  };

  const startEditAnswer = (answer) => {
    setEditingAnswerId(answer._id);
    setEditAnswerText(answer.answer);
  };

  const cancelEdit = () => {
    setEditingAnswerId(null);
    setEditAnswerText('');
  };

  const saveEditedAnswer = async () => {
    if (!editAnswerText.trim()) {
      setMsg({ text: 'Answer cannot be empty', error: true });
      return;
    }
    
    try {
      await api.patch(`/answers/${editingAnswerId}`, {
        content: editAnswerText
      });
      setMsg({ text: 'Answer updated successfully!', error: false });
      setEditingAnswerId(null);
      load();
    } catch (err) {
      console.error(err);
      setMsg({ text: 'Failed to update answer', error: true });
    }
  };

  const deleteAnswer = async (answerId) => {
    if (window.confirm('Are you sure you want to delete this answer?')) {
      try {
        await api.delete(`/answers/${answerId}`);
        setMsg({ text: 'Answer deleted successfully!', error: false });
        load();
      } catch (err) {
        console.error(err);
        setMsg({ text: 'Failed to delete answer', error: true });
      }
    }
  };

  if (loading) return <Container><div style={{ color: '#00ff00' }}>Loading...</div></Container>;
  if (!question) return <Container><div style={{ color: '#666666' }}>No question found</div></Container>;

  return (
    <Container>
      <h2>{question.question}</h2>
      
      {msg.text && (
        <Message $error={msg.error}>
          {msg.text}
        </Message>
      )}
      
      <h3>Answers ({answers.length})</h3>

      {!showAnswerForm ? (
        <Button 
          onClick={() => setShowAnswerForm(true)}
          style={{ marginBottom: '20px' }}
        >
          Add Answer
        </Button>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <TextArea
            rows="4"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Write your answer here..."
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Button onClick={postAnswer}>Submit Answer</Button>
            <Button variant="danger" onClick={() => setShowAnswerForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {answers.length === 0 ? (
        <p>No answers yet. Be the first to answer!</p>
      ) : (
        answers.map(a => (
          <AnswerItem key={a._id}>
            {editingAnswerId === a._id ? (
              <EditForm>
                <TextArea
                  rows="4"
                  value={editAnswerText}
                  onChange={e => setEditAnswerText(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button size="small" onClick={saveEditedAnswer}>
                    Save
                  </Button>
                  <Button variant="danger" size="small" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </EditForm>
            ) : (
              <>
                <AnswerText>{a.answer}</AnswerText>
                <AnswerMeta>
                  By {a.userName} on {new Date(a.createdAt).toLocaleString()}
                  {a.updatedAt && ' (edited)'}
                </AnswerMeta>
                {user && user.id === a.userId && (
                  <AnswerActions>
                    <Button size="small" onClick={() => startEditAnswer(a)}>
                      Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      size="small" 
                      onClick={() => deleteAnswer(a._id)}
                    >
                      Delete
                    </Button>
                    {showAnswerForm ? (
                      <div>
                        <textarea
                          value={newAnswer}
                          onChange={(e) => setNewAnswer(e.target.value)}
                        />
                        <button onClick={postAnswer}>Submit</button>
                      </div>
                    ) : (
                      <button onClick={() => setShowAnswerForm(true)}>
                        Answer
                      </button>
                    )}
                  </AnswerActions>
                )}
              </>
            )}
          </AnswerItem>
        ))
      )}

      <AnswerForm>
        <h3>Post Your Answer</h3>
        <TextArea
          rows="4"
          placeholder="Your answer..."
          value={newAnswer}
          onChange={e => setNewAnswer(e.target.value)}
        />
        <Button size="medium" onClick={postAnswer}>
          Post Answer
        </Button>
      </AnswerForm>
    </Container>
  );
}
