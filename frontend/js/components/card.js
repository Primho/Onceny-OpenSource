const titleColor = (selectedColor) => {
    if (selectedColor === '#f1f1f1') return '#787878';
    else if (selectedColor === '#fdefee') return '#ec6a5a';
    else if (selectedColor === '#e6f2ff') return '#038cff';
    else if (selectedColor === '#e1fae7') return '#36c25c';
    else if (selectedColor === '#fcf5db') return '#e6961f';
    else if (selectedColor === '#efeaff') return '#6d3cfa';
    else return 'inherit';
}

const makeCard = (card, container) => {
    container.insertAdjacentHTML('afterbegin', `
        <article class="note-card" data-id="${card.id}" style="background-color: ${card.color};">
            <header class="note-card__header">
                <div class="note-card__info">
                    <h2 class="note-card__title" style="color: ${titleColor(card.color)};">${card.title}</h2>
                    <span class="note-card__tag">${card.tag}</span>
                </div>
                <div>
                    <button popovertarget="menu-${card.id}" style="anchor-name: --ancla-${card.id};" class="card-menu-btn">
                        <svg style="width: 24px; height: 24px; color: ${titleColor(card.color)};">
                            <use href="../assets/icons/sprite.svg#icon-more-horiz"></use>
                        </svg>
                    </button>
                    
                    <div id="menu-${card.id}" popover style="position-anchor: --ancla-${card.id};" class="card-menu">
                        <button onclick="console.log('editste ${card.id}')">Edit</button>
                        <button onclick="console.log('eliminaste ${card.id}')" class="delete-card">Delete</button>
                    </div>
                </div>
            </header>
            <section class="note-card__preview">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis deleniti ea explicabo consectetur modi necessitatibus quibusdam exercitationem autem praesentium illum, voluptatibus animi debitis dolorem repudiandae. Minima illo eveniet exercitationem aperiam?</p>
                <!-- o contenido como notas -->
            </section>
        </article>
    `);
};

export { makeCard };