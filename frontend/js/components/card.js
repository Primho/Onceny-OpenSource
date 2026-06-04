const COLOR_MAP = {
    '#f1f1f1': 'var(--card-gray-text)',
    '#fdefee': 'var(--card-red-text)',
    '#e6f2ff': 'var(--card-blue-text)',
    '#e1fae7': 'var(--card-green-text)',
    '#fcf5db': 'var(--card-yellow-text)',
    '#efeaff': 'var(--card-purple-text)',
};

const titleColor = (hex) => COLOR_MAP[hex] ?? 'inherit';

const escapeHtml = (value) =>
    String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');

/**
 * Inserta una tarjeta de espacio en el grid del workspace.
 */
const makeCard = (card, container, isNew = false) => {
    const displayTitle = card.title?.trim() || 'Sin título';
    const contrast = titleColor(card.color);
    const temporalClass = card.type === 'temporal' ? ' note-card--temporal' : '';
    const tag = card.tag ? escapeHtml(card.tag) : '';
    const tagMarkup = tag
        ? `<span class="note-card__tag">${tag}</span>`
        : '';

    container.insertAdjacentHTML(
        'afterbegin',
        `
        <article class="note-card${isNew ? ' note-card--new' : ''}${temporalClass}"
            role="listitem"
            data-id="${card.id}"
            style="background-color: ${escapeHtml(card.color)};">
            <header class="note-card__header">
                <div class="note-card__info">
                    <h2 class="note-card__title" style="color: ${contrast};">${escapeHtml(displayTitle)}</h2>
                    ${tagMarkup}
                </div>
                <div class="note-card__menu">
                    <button type="button"
                        popovertarget="note-menu-${card.id}"
                        class="note-card__menu-trigger"
                        style="anchor-name: --note-anchor-${card.id};"
                        aria-label="Opciones de ${escapeHtml(displayTitle)}"
                        aria-haspopup="menu">
                        <svg class="icon" style="color: ${contrast};" aria-hidden="true" focusable="false">
                            <use href="../assets/icons/sprite.svg#icon-more-horiz"></use>
                        </svg>
                    </button>
                    <div id="note-menu-${card.id}" popover="auto"
                        class="note-card__menu-panel"
                        style="position-anchor: --note-anchor-${card.id};"
                        role="menu"
                        aria-label="Acciones de la nota">
                        <button type="button" class="note-card__menu-item" role="menuitem"
                            data-action="edit">Editar</button>
                        <button type="button" class="note-card__menu-item note-card__delete"
                            role="menuitem" data-action="delete">Eliminar</button>
                    </div>
                </div>
            </header>
            <div class="note-card__preview">
                <p class="note-card__preview-text">Añade contenido abriendo este espacio.</p>
            </div>
        </article>
        `,
    );
};

export { makeCard, titleColor };
