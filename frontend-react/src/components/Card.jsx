const COLOR_MAP = {
    "#f1f1f1": { bg: "var(--card-gray)", text: "var(--card-gray-text)" },
    "#fdefee": { bg: "var(--card-red)", text: "var(--card-red-text)" },
    "#e6f2ff": { bg: "var(--card-blue)", text: "var(--card-blue-text)" },
    "#e1fae7": { bg: "var(--card-green)", text: "var(--card-green-text)" },
    "#fcf5db": { bg: "var(--card-yellow)", text: "var(--card-yellow-text)" },
    "#efeaff": { bg: "var(--card-purple)", text: "var(--card-purple-text)" },
};

function Card({ card, onOpen, onDelete }) {
    const colors = COLOR_MAP[card.color] ?? {
        bg: card.color || "var(--card-gray)",
        text: "inherit",
    };

    const displayTitle = card.title?.trim() || "Sin título";
    const temporalClass = card.type === "temporal" ? " note-card--temporal" : "";

    const firstBlockContent = card.preview;
    const previewContent = firstBlockContent || "Add content by opening this space.";

    return (
        <article
            className={`note-card${temporalClass}`}
            role="listitem"
            data-id={card.id}
            style={{
                backgroundColor: colors.bg,
                border: card.type === "temporal" ? `2px dashed ${colors.text}` : undefined
            }}
            onClick={() => onOpen(card)}
        >
            <header className="note-card__header">
                <div className="note-card__info">
                    <h2 className="note-card__title" style={{ color: colors.text }}>
                        {displayTitle}
                    </h2>
                    {card.tag && (
                        <span
                            className="note-card__tag"
                            style={{ color: `color-mix(in srgb, ${colors.text} 80%, white)` }}
                        >
                            {card.tag}
                        </span>
                    )}
                </div>

                <div className="note-card__menu">
                    <button
                        type="button"
                        className="note-card__menu-trigger"
                        aria-label={`Opciones de ${displayTitle}`}
                        popoverTarget={`note-menu-${card.id}`}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
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
                        id={`note-menu-${card.id}`}
                        popover="auto"
                        className="note-card__menu-panel"
                        style={{ positionAnchor: `--note-anchor-${card.id}` }}
                        role="menu"
                        aria-label="Space Actions"
                    >
                        <button
                            type="button"
                            className="note-card__menu-item"
                            role="menuitem"
                            data-action="edit"
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="note-card__menu-item note-card__delete"
                            role="menuitem"
                            data-action="delete"
                            onClick={(event) => {
                                event.stopPropagation()
                                onDelete(card.id)
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
    );
}

export default Card;