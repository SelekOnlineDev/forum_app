import { Outlet } from 'react-router';
import styled from 'styled-components';

const OutletContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: ${({ bg }) => bg || 'transparent'};
`;

export const MainOutlet = ({ background }) => {
  return (
    <OutletContainer bg={background}>
      <Outlet />
    </OutletContainer>
  );
};