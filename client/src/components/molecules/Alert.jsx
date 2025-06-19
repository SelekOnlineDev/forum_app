import styled from 'styled-components';

const AlertContainer = styled.div`
  padding: 15px;
  margin: 20px 0;
  border-radius: 4px;
  border: 1px solid ${({ $type }) => $type === 'error' ? '#666666' : '#00ff00'};
  background: ${({ $type }) => $type === 'error' ? 'rgba(102, 102, 102, 0.2)' : 'rgba(0, 255, 0, 0.1)'};
  color: #00ff00;
  text-align: center;
`;

const Alert = ({ type = 'info', message }) => {
  return (
    <AlertContainer $type={type}>
      {message}
    </AlertContainer>
  );
};

export default Alert;
