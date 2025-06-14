import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import styled from 'styled-components';
import Button from '../components/atoms/Button';
import api from '../services/api';

const AllContainer = styled.div`
  background-image: url('/src/assets/matrix.png');
  /* height: 100vh; */
  padding: 20px 20px 20px 20px;
`;

const UserContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #000;
  border: 1px solid #00ff00;
  border-radius: 4px;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #00ff00;
  border-bottom: 1px solid #00ff00;
  padding-bottom: 0.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #00ff00;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  background-color: #111;
  border: 1px solid #00ff00;
  color: #00ff00;
  font-family: 'Courier New', Courier, monospace;
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const ToggleVisibility = styled.span`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  color: #00ff00;
`;

const ErrorMessage = styled.div`
  color: #666666;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #00ff00;
  margin-top: 0.5rem;
`;

const User = () => {
  const { user, updateUser, resetLogoutTimer } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    resetLogoutTimer?.();
    
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user, resetLogoutTimer]);

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;
    return regex.test(pwd);
  };

  const handleUpdateProfile = async () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      const response = await api.patch('user/profile', { name, email });
      
      if (response.status === 200) {
        updateUser({ name, email });
        updateUser(response.data.user);
        setSuccess('Profile updated successfully');
        setErrors({});
        setIsEditing(false);
        
        // Išvalau pranešimą po 5 sekundžių

        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (err) {
      setErrors({ 
        general: err.response?.data?.message || 'Failed to update profile' 
      });
    }
  };

  const handleChangePassword = async () => {
    const newErrors = {};
    
    if (!password) newErrors.password = 'Current password is required';
    
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!validatePassword(newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, number and special character';
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      const response = await api.patch('user/password', {
        currentPassword: password,
        newPassword
      });
      
      if (response.status === 200) {
        setSuccess('Password changed successfully');
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Išvalau pranešimą po 5 sekundžių

        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (err) {
      setErrors({ 
        general: err.response?.data?.message || 'Failed to change password' 
      });
    }
  };

  return (
    <AllContainer>
    <UserContainer>
      <Section>
        <Title>User Profile</Title>
        
        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormGroup>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
            <Button onClick={handleUpdateProfile}>Save Changes</Button>
            <Button 
              variant="danger" 
              onClick={() => {
                setIsEditing(false);
                setName(user.name);
                setEmail(user.email);
                setErrors({});
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </Section>

      <Section>
        <Title>Change Password</Title>
        
        <FormGroup>
          <Label>Current Password</Label>
          <PasswordWrapper>
            <Input
              type={showPasswords ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}  
              placeholder="Enter current password"
            />
            <ToggleVisibility onClick={() => setShowPasswords(!showPasswords)}>
              {showPasswords ? '👁️' : '🙈'}
            </ToggleVisibility>
          </PasswordWrapper>
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label>New Password</Label>
          <PasswordWrapper>
            <Input
              type={showPasswords ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </PasswordWrapper>
          {errors.newPassword && <ErrorMessage>{errors.newPassword}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label>Confirm New Password</Label>
          <PasswordWrapper>
            <Input
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </PasswordWrapper>
          {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
        </FormGroup>
        
        <Button onClick={handleChangePassword}>Change Password</Button>
      </Section>
      
      {success && <SuccessMessage>{success}</SuccessMessage>}
      {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}
    </UserContainer>
    </AllContainer>
  );
};

export default User;
