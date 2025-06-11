import React from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  display: flex;
  width: 70%;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 15px;
  background-color: #111;
  border: 1px solid #00ff00;
  color: #00ff00;
  font-family: 'Courier New', Courier, monospace;
  border-radius: 4px;
  font-size: 1rem;
`;

export const SearchBar = ({ onSearch }) => {
  return (
    <SearchContainer>
      <Input
        type="text"
        placeholder="Search questions..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </SearchContainer>
  );
};