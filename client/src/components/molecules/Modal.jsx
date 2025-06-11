import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../atoms/Button';

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #000;
  border: 2px solid #00ff00;
  border-radius: 4px;
  padding: 25px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
`;

const Title = styled.h3`
  color: #00ff00;
  margin-top: 0;
  border-bottom: 1px solid #00ff00;
  padding-bottom: 10px;
`;

const Message = styled.p`
  color: #00ff00;
  margin: 20px 0;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
`;

export const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = "Delete",
  cancelText = "Cancel"
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <Actions>
          <Button onClick={onClose}>{cancelText}</Button>
          <Button variant="danger" onClick={onConfirm}>{confirmText}</Button>
        </Actions>
      </ModalContent>
    </Backdrop>
  );
};