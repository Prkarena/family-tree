import { Modal, ModalContent, ModalOverlay, Card } from "@chakra-ui/react";

const Popup = ({ isModalOpen, handleCloseModal, children }) => {
  return (
    <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <Card>{children}</Card>
      </ModalContent>
    </Modal>
  );
};

export default Popup;
