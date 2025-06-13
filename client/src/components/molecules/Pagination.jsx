import React from 'react';
import styled from 'styled-components';

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const PageButton = styled.button`
  background-color: ${({ active }) => (active ? '#00ff00' : '#000')};
  color: #666666;
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

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <PaginationWrapper>
      {pages.map((page) => (
        <PageButton
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </PageButton>
      ))}
    </PaginationWrapper>
  );
};

export default Pagination;
