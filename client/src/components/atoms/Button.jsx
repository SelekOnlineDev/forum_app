import styled from 'styled-components';

export const Button = styled.button`
  background-color: ${({ variant }) => 
    variant === 'danger' ? '#ff0000' : '#00ff00'};
  color: #000;
  border: 2px solid #000;
  border-radius: 4px;
  padding: ${({ size }) => 
    size === 'large' ? '12px 24px' : '8px 16px'};
  font-size: ${({ size }) => 
    size === 'large' ? '1.5rem' : '1rem'};
  cursor: pointer;
  transition: all 0.3s;
  font-weight: bold;

  &:hover {
    background-color: #000;
    color: #00ff00;
    border-color: #00ff00;
  }
`;