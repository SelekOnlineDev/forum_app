import React from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  display: flex;
  width: 70%;
  margin: 20px auto;

   @media (max-width: 768px) {
    width: 85%;
  }
  
  @media (max-width: 480px) {
    width: 95%;
    margin: 15px auto;
  }
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  background-color: #000;
  border: 1px solid #00ff00;
  color: #666666;
  font-family: 'Courier New', Courier, monospace;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 8px rgba(0, 255, 0, 0.6);
  }
  
  &::placeholder {
    color: #666666;
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 0.9rem;
  }
`;

const SearchBar = ({ onSearch }) => {
  return (
    <SearchContainer>
      <StyledInput
        type="text"
        placeholder="Search questions..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </SearchContainer>
  );
};

export default SearchBar;
