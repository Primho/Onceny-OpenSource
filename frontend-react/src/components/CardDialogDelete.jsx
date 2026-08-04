import { useRef } from "react";

function CardDialogDelete({ card, onDelete }) {
    const dialogRef = useRef(null);

    return (
        <dialog id="delete-dialog" closedby="any" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-desc">
        <form className="confirm-dialog" method="dialog">
            <h2 id="delete-dialog-title" class="confirm-dialog__title">Delete Space</h2>
            <p id="delete-dialog-desc" class="confirm-dialog__desc">
                Are you sure you want to permanently delete this Space? This action cannot be undone.
            </p>
            <div class="confirm-dialog__actions">
                <button type="button" class="confirm-dialog__btn confirm-dialog__btn--ghost"
                    data-action="delete-cancel">
                    Cancel
                </button>
                <button type="submit" value="confirm" class="confirm-dialog__btn confirm-dialog__btn--danger">
                    Delete
                </button>
            </div>
        </form>
    </dialog>
    )
}

export default CardDialogDelete;