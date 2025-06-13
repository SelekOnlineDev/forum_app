import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import InputField from '../components/molecules/InputField';
import PasswordField from '../components/molecules/PasswordField';
import Button from '../components/atoms/Button';
import styled from 'styled-components';
import api from '../services/api';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 6rem auto;
  padding: 25px;
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid #00ff00;
  border-radius: 4px;
  backdrop-filter: blur(5px);
  
  @media (max-width: 480px) {
    width: 90%;
    padding: 15px;
  }
`;

const Title = styled.h2`
  color: #00ff00;
  text-align: center;
  margin-top: 0;
  border-bottom: 1px solid #00ff00;
  padding-bottom: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const ErrorMessage = styled.div`
  color: #666666;
  margin-top: 10px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #00ff00;
  margin-top: 10px;
  text-align: center;
`;

const SignupPrompt = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #00ff00;
`;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
   try {
    const response = await api.post('/login', { email, password });
    
    if (response.data.token) {
      login(response.data.token, response.data.user);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);  // Navigacija į Home
    }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('Login failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Title>Login to Secret Forum</Title>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <PasswordField 
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            placeholder="Enter password"
            required
          />
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <Button 
          type="submit" 
          size="large" 
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <SignupPrompt>
        Don't have an account?{' '}
          <Button variant="link" onClick={() => navigate('/register')}>
              Sign Up
          </Button>
      </SignupPrompt>
    </LoginContainer>
  );
};

export default Login;
