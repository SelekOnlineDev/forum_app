import React from 'react';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: #000;
  border-top: 2px solid #00ff00;
  padding: 20px;
  text-align: center;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
`;

const SocialLink = styled.a`
  color: #00ff00;
  font-size: 1.5rem;
  transition: color 0.3s;
  
  &:hover {
    color: #00cc66;
  }
`;

const Copyright = styled.p`
  color: #00ff00;
  font-size: 0.9rem;
  margin: 0;
`;

export const Footer = () => {
  return (
    <FooterContainer>
      <SocialLinks>
        <SocialLink href="#" aria-label="Facebook"><FaFacebook /></SocialLink>
        <SocialLink href="#" aria-label="Twitter"><FaTwitter /></SocialLink>
        <SocialLink href="#" aria-label="Instagram"><FaInstagram /></SocialLink>
        <SocialLink href="#" aria-label="LinkedIn"><FaLinkedin /></SocialLink>
        <SocialLink href="#" aria-label="TikTok"><FaTiktok /></SocialLink>
      </SocialLinks>
      <Copyright>
        &copy; {new Date().getFullYear()} Quantum Physics Forum. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};