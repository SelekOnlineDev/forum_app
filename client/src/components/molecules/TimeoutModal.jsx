import React from 'react';
import Modal from './Modal';

const TimeoutModal = ({ isOpen, onClose }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Login Timed Out"
    message="Your session has expired due to inactivity."
    confirmText="OK"
    onConfirm={onClose}
  />
);

export default TimeoutModal;