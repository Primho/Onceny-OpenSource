const COLOR_MAP = {
    '#f1f1f1': {
        bg: 'var(--card-gray)',
        text: 'var(--card-gray-text)',
    },
    '#fdefee': {
        bg: 'var(--card-red)',
        text: 'var(--card-red-text)',
    },
    '#e6f2ff': {
        bg: 'var(--card-blue)',
        text: 'var(--card-blue-text)',
    },
    '#e1fae7': {
        bg: 'var(--card-green)',
        text: 'var(--card-green-text)',
    },
    '#fcf5db': {
        bg: 'var(--card-yellow)',
        text: 'var(--card-yellow-text)',
    },
    '#efeaff': {
        bg: 'var(--card-purple)',
        text: 'var(--card-purple-text)',
    },
};

const getCardColors = (hex) =>
    COLOR_MAP[hex] ?? {
        bg: hex,
        text: 'inherit',
    };

const escapeHtml = (value) =>
    String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');

// Mete la tarjet a el grid
const makeCard = (card, container, isNew = false) => {
    const colors = COLOR_MAP[card.color] ?? {
        bg: card.color,
        text: 'inherit',
    };

    const displayTitle = card.title?.trim() || 'Sin título';
    const temporalClass = card.type === 'temporal' ? ' note-card--temporal' : '';
    const tag = card.tag ? escapeHtml(card.tag) : '';
    const tagMarkup = tag ? `<span class="note-card__tag" style="color: color-mix(in srgb, ${colors.text} 80%, white)">${tag}</span>` : '';

    container.insertAdjacentHTML(
        'afterbegin',
        `
        <article class="note-card${isNew ? ' note-card--new' : ''}${temporalClass}"
            role="listitem"
            data-id="${card.id}"
            style="background-color: ${colors.bg};">
            <header class="note-card__header">
                <div class="note-card__info">
                    <h2 class="note-card__title" style="color: ${colors.text};">${escapeHtml(displayTitle)}</h2>
                    ${tagMarkup}
                </div>
                <div class="note-card__menu">
                    <button type="button"
                        popovertarget="note-menu-${card.id}"
                        class="note-card__menu-trigger"
                        style="anchor-name: --note-anchor-${card.id};"
                        aria-label="Opciones de ${escapeHtml(displayTitle)}"
                        aria-haspopup="menu">
                        <svg class="icon" style="color: ${colors.text};" aria-hidden="true" focusable="false">
                            <use href="../assets/icons/sprite.svg#icon-more-horiz"></use>
                        </svg>
                    </button>
                    <div id="note-menu-${card.id}" popover="auto"
                        class="note-card__menu-panel"
                        style="position-anchor: --note-anchor-${card.id};"
                        role="menu"
                        aria-label="Acciones de la nota">
                        <button type="button" class="note-card__menu-item" role="menuitem"
                            data-action="edit">Edit</button>
                        <button type="button" class="note-card__menu-item note-card__delete"
                            role="menuitem" data-action="delete">Delete</button>
                    </div>
                </div>
            </header>
            <div class="note-card__preview" >
                <p class="note-card__preview-text" style="color: color-mix(in srgb, ${colors.text} 70%, white)">Add content by opening this space.</p>
            </div>
        </article>
        `,
    );
};


export { makeCard, getCardColors };
