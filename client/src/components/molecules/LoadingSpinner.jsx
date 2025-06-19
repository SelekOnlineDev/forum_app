import styled from 'styled-components';

const SpinnerContainer = styled.div`
  display: inline-block;
  width: ${({ size }) => size || '20px'};
  height: ${({ size }) => size || '20px'};
`;

const Spinner = styled.div`
  border: 3px solid rgba(0, 255, 0, 0.3);
  border-radius: 50%;
  border-top: 3px solid #00ff00;
  width: 100%;
  height: 100%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingSpinner = ({ size }) => (
  <SpinnerContainer size={size}>
    <Spinner />
  </SpinnerContainer>
);

export default LoadingSpinner;
