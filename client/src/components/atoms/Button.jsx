import styled from 'styled-components';

const Button = styled.button`
  background-color: ${({ $variant }) => 
    $variant === 'danger' ? '#666666' : '#33FF33'};
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
    color: #33FF33;
    border-color: #33FF33;
  }
`;

export default Button;
