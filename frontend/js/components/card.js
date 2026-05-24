const COLOR_MAP = {
    '#f1f1f1': 'var(--card-gray-text)',
    '#fdefee': 'var(--card-red-text)',
    '#e6f2ff': 'var(--card-blue-text)',
    '#e1fae7': 'var(--card-green-text)',
    '#fcf5db': 'var(--card-yellow-text)',
    '#efeaff': 'var(--card-purple-text)'
};

const titleColor = (selectedColor) => COLOR_MAP[selectedColor] || 'inherit';

/**
 * Genera de forma dinámica una tarjeta de nota con semántica y accesibilidad avanzada.
 */
const makeCard = (card, container, isNew = false) => {
    const displayTitle = card.title?.trim() || 'Untitled';
    const currentContrastColor = titleColor(card.color);

    container.insertAdjacentHTML('afterbegin', `
        <article class="note-card ${isNew ? 'note-card--new' : ''}" data-id="${card.id}" style="background-color: ${card.color};">
            <header class="note-card__header">
                <div class="note-card__info">
                    <h3 class="note-card__title" style="color: ${currentContrastColor};">${displayTitle}</h3>
                    <span class="note-card__tag" aria-label="Categoría: ${card.tag}">${card.tag}</span>
                </div>
                
                <div class="note-card__menu-container">
                    <button popovertarget="menu-${card.id}" style="anchor-name: --ancla-${card.id};" class="card-menu-btn" aria-label="Opciones de la nota: ${displayTitle}">
                        <svg style="width: 24px; height: 24px; color: ${currentContrastColor};" aria-hidden="true">
                            <use href="../assets/icons/sprite.svg#icon-more-horiz"></use>
                        </svg>
                    </button>
                    
                    <div id="menu-${card.id}" popover style="position-anchor: --ancla-${card.id};" class="card-menu" role="menu">
                        <button role="menuitem" class="card-menu__btn">Edit</button>
                        <button role="menuitem" class="card-menu__btn card-menu__btn--danger delete-card">Delete</button>
                    </div>
                </div>
            </header>
            
            <div class="note-card__preview">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis deleniti ea explicabo.</p>
            </div>
        </article>
    `);
};

export { makeCard };