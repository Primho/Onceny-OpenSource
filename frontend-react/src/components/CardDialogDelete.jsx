import { useRef, useEffect } from "react";

function CardDialogDelete({ card, onClose, onDelete }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (card) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [card]);

    if (!card) return null;

    return (
        <dialog 
            ref={dialogRef} 
            id="delete-dialog" 
            aria-labelledby="delete-dialog-title" 
            aria-describedby="delete-dialog-desc" 
            onClose={onClose}
        >
            <div className="confirm-dialog">
                <h2 id="delete-dialog-title" className="confirm-dialog__title">Delete Space</h2>
                <p id="delete-dialog-desc" className="confirm-dialog__desc">
                    Are you sure you want to permanently delete "{card.title || "this space"}"? This action cannot be undone.
                </p>
                <div className="confirm-dialog__actions">
                    <button 
                        type="button" 
                        className="confirm-dialog__btn confirm-dialog__btn--ghost"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        className="confirm-dialog__btn confirm-dialog__btn--danger"
                        onClick={() => onDelete(card.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </dialog>
    );
}

export default CardDialogDelete;