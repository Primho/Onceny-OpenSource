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
        <article class="todo-card" data-id="${card.id}" style="background-color: ${card.color};">
            <header class="todo-card__header">
                <div class="title-container">
                    <h2 class="todo-card__title" style="color: ${titleColor(card.color)};">${card.title}</h2>
                    <span class="todo-card__tag">${card.tag}</span>
                </div>
                <div>
                    <button popovertarget="menu-${card.id}" style="anchor-name: --ancla-${card.id};" class="card-options">
                        <svg style="width: 24px; height: 24px; color: ${titleColor(card.color)};">
                            <use href="../assets/icons/sprite.svg#icon-more-horiz"></use>
                        </svg>
                    </button>
                    <div id="menu-${card.id}" popover style="position-anchor: --ancla-${card.id};" class="menu-flotante">
                        <button onclick="console.log('editste ${card.id}')">Editar</button>
                        <button onclick="console.log('eliminaste ${card.id}')" class="delete">Eliminar</button>
                    </div>
                </div>
            </header>
            <section class="todo-card__preview">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis deleniti ea explicabo consectetur modi necessitatibus quibusdam exercitationem autem praesentium illum, voluptatibus animi debitis dolorem repudiandae. Minima illo eveniet exercitationem aperiam?</p>
                <ul class="todo-card__preview-list">
                    <!-- aquí solo las primeras 3 tareas, solo lectura -->
                </ul>
                <!-- o contenido como notas -->
            </section>
        </article>
    `);
};

export { makeCard };