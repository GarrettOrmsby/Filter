import { useModal } from '../components/hooks/useModal';
import ModalOverlay from '../components/modals/shared/ModalOverlay';
import CreateAccountForm from './CreateForm';

function CreateAccountModal({ isOpen, onClose }) {
    const handleSubmit = (formData) => {
        console.log('Submitting:', formData);
        onClose();
    };

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose}>
            <CreateAccountForm onSubmit={handleSubmit} />
        </ModalOverlay>
    );
}

export default CreateAccountModal;
