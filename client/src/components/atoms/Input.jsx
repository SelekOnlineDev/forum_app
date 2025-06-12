import styled from 'styled-components';

const Input = styled.input`
  width: 100%;
  padding: 10px;
  background-color: #111;
  border: 1px solid ${({ error }) => error ? '#ff0000' : '#00ff00'};
  color: #00ff00;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #00ff77;
    box-shadow: 0 0 5px rgba(0, 255, 119, 0.5);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default Input;
