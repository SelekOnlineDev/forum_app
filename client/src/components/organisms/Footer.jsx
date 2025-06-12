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
    color: #666666;
  }
`;

const Copyright = styled.p`
  color: #00ff00;
  font-size: 0.9rem;
  margin: 0;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <SocialLinks>
        <SocialLink href="https://www.facebook.com/" aria-label="Facebook"><FaFacebook /></SocialLink>
        <SocialLink href="https://x.com/" aria-label="Twitter"><FaTwitter /></SocialLink>
        <SocialLink href="https://www.instagram.com/" aria-label="Instagram"><FaInstagram /></SocialLink>
        <SocialLink href="https://www.linkedin.com/" aria-label="LinkedIn"><FaLinkedin /></SocialLink>
        <SocialLink href="https://www.tiktok.com/en/" aria-label="TikTok"><FaTiktok /></SocialLink>
      </SocialLinks>
      <Copyright>
        &copy; {new Date().getFullYear()} Secret Quantum Forum. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
