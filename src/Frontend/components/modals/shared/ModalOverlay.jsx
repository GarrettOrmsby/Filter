import './styles.css';

function ModalOverlay({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div 
            className="modal-overlay"
            onClick={onClose}
        >
            <div 
                className="modal-content"
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

export default ModalOverlay;