const ADD_TODO = document.querySelector('.fab-container');

const DIALOG = document.querySelector('#myDialog');
const BAR = document.querySelector('.bar');
const ANS_THEME = document.querySelector('#userAnswer');
const TAG = document.querySelector('#todo-tags');
const MARKER = document.querySelector('#marker');
const COLOR_OPTS = document.querySelectorAll('.color-opt');
const CANCEL_BTN = document.getElementById('btn-cancel');
const ACEPT_BTN = document.getElementById('btn-acept');

const LISTS_WRAPPER = document.querySelector('.lists-wrapper');

const CARD_CONFIG = document.querySelector('#card-dialog__config');
const CARD_HEADER = document.querySelector('#card-dialog__config');

let selectedColor = '#f1f1f1';

ADD_TODO.addEventListener('click', () => {
    DIALOG.showModal();
});

COLOR_OPTS.forEach(btn => {
    btn.addEventListener('click', () => {
        COLOR_OPTS.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedColor = btn.dataset.color;
        BAR.style.backgroundColor = selectedColor;
    });
});

const titleColor = (selectedColor) => {
    if (selectedColor === '#f1f1f1') return '#787878';
    else if (selectedColor === '#fdefee') return '#ec6a5a';
    else if (selectedColor === '#e6f2ff') return '#038cff';
    else if (selectedColor === '#e1fae7') return '#36c25c';
    else if (selectedColor === '#fcf5db') return '#e6961f';
    else if (selectedColor === '#efeaff') return '#6d3cfa';
    else return 'inherit';
}

let dataCards = [];
let counter = 0;

ACEPT_BTN.addEventListener('click', () => {
    counter++;
    const newCard = {
        id: counter,
        color: selectedColor,
        title: ANS_THEME.value || 'To-Do App',
        tag: TAG.value,
        blocks: [],
        marker: MARKER.value
    };
    dataCards.push(newCard);

    LISTS_WRAPPER.insertAdjacentHTML('beforeend', `
        <article class="todo-card" data-id="${newCard.id}" style="background-color: ${newCard.color};">
            <header class="todo-card__header">
                <div class="title-container">
                    <h2 class="todo-card__title" style="color: ${titleColor(newCard.color)};">${newCard.title}</h2>
                    <span class="todo-card__tag">${newCard.tag}</span>
                </div>
                <span class="material-symbols-outlined" style="color: ${titleColor(newCard.color)}; ">more_horiz</span>
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
    
    DIALOG.close();
});

CANCEL_BTN.addEventListener ('click', () => {
    DIALOG.close();
});

LISTS_WRAPPER.addEventListener('click', (e) => {
    const isCard = e.target.closest('.todo-card');

    if (!isCard) return;
    CARD_CONFIG.showModal();
    const card = Number(isCard.dataset.id);
    
    const findIt = dataCards.find(elemento => elemento.id === card);
    console.log(findIt);


});


