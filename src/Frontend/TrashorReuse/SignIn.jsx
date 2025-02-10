import SignForm from './SignForm';
import ModalOverlay from '../components/modals/shared/ModalOverlay';

function SignInModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    
    const handleSubmit = (formData) => {
        console.log('Submitting:', formData);
        onClose();
    };

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose}>
            <SignForm onSubmit={handleSubmit} />
        </ModalOverlay>
    );
}

export default SignInModal;
