import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import styled from 'styled-components';
import { Button } from '../components/atoms/Button';
import api from '../api';

const UserContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Section = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background-color: #111;
  border: 1px solid #00ff00;
  border-radius: 4px;
`;

const Title = styled.h2`
  color: #00ff00;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #00ff00;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  background-color: #000;
  border: 1px solid #00ff00;
  color: #00ff00;
  font-family: 'Courier New', Courier, monospace;
`;

const PasswordToggle = styled.span`
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  color: #00ff00;
`;

const Error = styled.div`
  color: #ff0000;
  margin-top: 5px;
`;

const Success = styled.div`
  color: #00ff00;
  margin-top: 10px;
`;

export const User = () => {
  const { user } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return regex.test(password);
  };

  const handleUpdateProfile = async () => {
    const newErrors = {};
    
    if (!name) newErrors.name = 'Name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await api.patch('/user/profile', { name, email });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setErrors({});
    } catch (err) {
      setErrors({ general: 'Failed to update profile' });
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
      await api.patch('/user/password', { currentPassword: password, newPassword });
      setSuccess('Password changed successfully!');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    } catch (err) {
      setErrors({ general: 'Failed to change password' });
    }
  };

  return (
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
          {errors.name && <Error>{errors.name}</Error>}
        </FormGroup>
        
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
          />
          {errors.email && <Error>{errors.email}</Error>}
        </FormGroup>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={handleUpdateProfile}>Save Changes</Button>
            <Button variant="danger" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}
      </Section>

      <Section>
        <Title>Change Password</Title>
        
        <FormGroup style={{ position: 'relative' }}>
          <Label>Current Password</Label>
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? '🙈' : '👁️'}
          </PasswordToggle>
          {errors.password && <Error>{errors.password}</Error>}
        </FormGroup>
        
        <FormGroup>
          <Label>New Password</Label>
          <Input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {errors.newPassword && <Error>{errors.newPassword}</Error>}
        </FormGroup>
        
        <FormGroup>
          <Label>Confirm New Password</Label>
          <Input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <Error>{errors.confirmPassword}</Error>}
        </FormGroup>
        
        <Button onClick={handleChangePassword}>Change Password</Button>
      </Section>
      
      {success && <Success>{success}</Success>}
      {errors.general && <Error>{errors.general}</Error>}
    </UserContainer>
  );
};