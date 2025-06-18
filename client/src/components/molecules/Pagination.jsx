import React from 'react';
import styled from 'styled-components';

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const PageButton = styled.button`
  background-color: ${({ $active }) => ($active ? '#666666' : '#000')};
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 6px 12px;
  margin: 0 4px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #00ff00;
    color: #000;
  }
`;

// Puslapio numeravimo komponentas, skirtas puslapio navigacijai tvarkyti

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) { // Sukuriu puslapių mygtukus
    pages.push(
      <PageButton 
        key={i}
        $active={currentPage === i}
        onClick={() => onPageChange(i)}
      >
        {i}
      </PageButton>
    );
  }

  return (
    <PaginationWrapper>
      {currentPage > 1 && (
        <PageButton onClick={() => onPageChange(currentPage - 1)}>
          &lt;
        </PageButton>
      )}
      
      {pages}
      
      {currentPage < totalPages && (
        <PageButton onClick={() => onPageChange(currentPage + 1)}>
          &gt;
        </PageButton>
      )}
    </PaginationWrapper>
  );
};

export default Pagination;
