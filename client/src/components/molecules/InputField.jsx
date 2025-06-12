import React from 'react';
import styled from 'styled-components';
import Input from '../atoms/Input';

const Container = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #00ff00;
  font-weight: bold;
`;

const ErrorText = styled.div`
  color: #ff0000;
  margin-top: 5px;
  font-size: 0.9rem;
`;

const InputField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  error,
  disabled = false
}) => {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={!!error}
        disabled={disabled}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};

export default InputField;
