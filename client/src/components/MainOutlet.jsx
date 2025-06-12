import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './organisms/Header';
import Footer from './organisms/Footer';
import styled from 'styled-components';

const OutletContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: transparent;
  min-height: calc(100vh - 120px); // header ir footer aukščiai
  
  // Dinaminis fono valdymas

  ${({ bg }) => bg && `
    background: ${bg};
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  `}
  
  // Responsive stiliai

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const MainOutlet = ({ background }) => {
  return (
    <OutletContainer bg={background}>
      <Header />
        <Outlet />
      <Footer />
    </OutletContainer>
  );
};

export default MainOutlet;
