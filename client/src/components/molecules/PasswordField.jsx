import React from 'react';
import styled from 'styled-components';

const PasswordWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 40px 10px 10px;
  background-color: #111;
  border: 1px solid #00ff00;
  color: #00ff00;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
`;

const ToggleVisibility = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #00ff00;
`;

const PasswordField = ({ 
  value, 
  onChange, 
  showPassword, 
  setShowPassword,
  placeholder 
}) => {
  return (
    <PasswordWrapper>
      <Input
        type={showPassword ? 'text' : 'password'} 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <ToggleVisibility onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? '👁️' : '🙈'}
      </ToggleVisibility>
    </PasswordWrapper>
  );
};

export default PasswordField;
