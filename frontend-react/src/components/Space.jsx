import { useState } from "react";
import SpaceDialogDelete from "./SpaceDialogDelete";

const COLOR_MAP = {
    "#f1f1f1": { bg: "var(--card-gray)", text: "var(--card-gray-text)" },
    "#fdefee": { bg: "var(--card-red)", text: "var(--card-red-text)" },
    "#e6f2ff": { bg: "var(--card-blue)", text: "var(--card-blue-text)" },
    "#e1fae7": { bg: "var(--card-green)", text: "var(--card-green-text)" },
    "#fcf5db": { bg: "var(--card-yellow)", text: "var(--card-yellow-text)" },
    "#efeaff": { bg: "var(--card-purple)", text: "var(--card-purple-text)" },
};

function Space({space, onOpen, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const colors = COLOR_MAP[space.color] ?? {
        bg: space.color || "var(--card-gray)",
        text: "inherit",
    };

    const displayTitle = space.title?.trim() || "Sin título";
    const temporalClass = space.type === "temporal" ? " note-card--temporal" : "";

    const firstBlockContent = space.preview;
    const previewContent = firstBlockContent || "Add content by opening this space.";

    const handleDeleteConfirm = (id) => {
        onDelete(id);
        setIsDeleting(false);
    };

    return (
        <>
            <article
                className={`note-card${temporalClass}`}
                role="listitem"
                data-id={space.id}
                style={{
                    backgroundColor: colors.bg,
                    border: space.type === "temporal" ? `2px dashed ${colors.text}` : undefined
                }}
                onClick={() => onOpen(space)}
            >
                <header className="note-card__header">
                    <div className="note-card__info">
                        <h2 className="note-card__title" style={{ color: colors.text }}>
                            {displayTitle}
                        </h2>
                        {space.tag && (
                            <span
                                className="note-card__tag"
                                style={{ color: `color-mix(in srgb, ${colors.text} 80%, white)` }}
                            >
                                {space.tag}
                            </span>
                        )}
                    </div>

                    <div className="note-card__menu">
                        {space.type === "temporal" && (
                            <svg
                                className="icon note-card__temporal-icon"
                                style={{ color: colors.text }}
                                aria-label="Temporal space"
                                focusable="false"
                            >
                                <use href="../assets/icons/sprite.svg#icon-temporal"></use>
                            </svg>
                        )}
                        <button
                            type="button"
                            className="note-card__menu-trigger"
                            aria-label={`Opciones de ${displayTitle}`}
                            popoverTarget={`note-menu-${space.id}`}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            style={{ anchorName: `--note-anchor-${space.id}`}}
                            aria-haspopup="menu"
                        >
                            <svg
                                className="icon"
                                style={{ color: colors.text }}
                                aria-hidden="true"
                                focusable="false"
                            >
                                <use href="../assets/icons/sprite.svg#icon-more-horiz"></use>
                            </svg>
                        </button>
                        <div
                            id={`note-menu-${space.id}`}
                            popover="auto"
                            className="note-card__menu-panel"
                            style={{ positionAnchor: `--note-anchor-${space.id}` }}
                            role="menu"
                            aria-label="Space Actions"
                            onClick={(e) => e.stopPropagation()} // Detiene eventos dentro del menú
                        >
                            <button
                                type="button"
                                className="note-card__menu-item"
                                role="menuitem"
                                data-action="edit"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpen(space);
                                }}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                className="note-card__menu-item note-card__delete"
                                role="menuitem"
                                data-action="delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDeleting(true);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </header>
                <div className="note-card__preview">
                    <p
                        className="note-card__preview-text"
                        style={{ color: `color-mix(in srgb, ${colors.text} 70%, white)` }}
                    >
                        { previewContent }
                    </p>
                </div>
            </article>

            {isDeleting && (
                <SpaceDialogDelete 
                    space={space} 
                    onClose={() => setIsDeleting(false)} 
                    onDelete={handleDeleteConfirm} 
                />
            )}
        </>
    );
}

// Corregido: exportar Card en vez de CardDialog
export default Space;