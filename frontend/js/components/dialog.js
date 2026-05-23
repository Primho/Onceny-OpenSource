import { makeCard } from "./card.js";
import { createCard } from "../api.js";
import { setColor, getColor, setDataCards, getDataCards } from '../state.js';

const listWrapper = document.querySelector('.lists-wrapper');
const addCardBtn = document.querySelector('#addNote-btn');
const newCardDialog = document.querySelector('#myDialog');
const dialogForm = document.querySelector('.dialog-form');
const dialogColorBar = document.querySelector('.bar');

const colorPicker = document.querySelector('.color-picker');

const cancelCreateBtn = document.getElementById('btn-cancel');

colorPicker.addEventListener('click', (e) => {
    const clickedBtn = e.target.closest('.color-opt');
    if (!clickedBtn) return;

    const colorOptions = document.querySelectorAll('.color-opt');
    colorOptions.forEach(b => b.classList.remove('selected'));
    clickedBtn.classList.add('selected');
    setColor(clickedBtn.dataset.color);
    dialogColorBar.style.backgroundColor = getColor();
    newCardDialog.style.borderTop = `2px solid ${getColor()}`;
})

addCardBtn.addEventListener('click', () => {
    newCardDialog.showModal();
});

cancelCreateBtn.addEventListener('click', () => {
    newCardDialog.close();
});

dialogForm.addEventListener('submit', async (e) => {
    // Evitamos que la página se recargue (comportamiento por defecto de HTML)
    e.preventDefault(); 

    const formData = new FormData(dialogForm);
    const formValues = Object.fromEntries(formData);

    const newCard = {
        color: getColor(),
        title: formValues.title || 'Untitled',
        tag: formValues.tag,
        marker: formValues.marker
    };
    
    newCardDialog.close();
    
    const savedCard = await createCard(newCard);
    
    const cards = getDataCards();
    cards.push(savedCard);
    setDataCards(cards);
    
    makeCard(savedCard, listWrapper, true); 

    resetStyles();
});

function resetStyles() {
    const colorOptions = document.querySelectorAll('.color-opt');
    dialogForm.reset();
    colorOptions.forEach(btn => btn.classList.remove('selected'));
    colorOptions[0].classList.add('selected');
    dialogColorBar.style.backgroundColor = colorOptions[0].dataset.color;
    newCardDialog.style.borderTop = `2px solid ${colorOptions[0].dataset.color}`;
    setColor(colorOptions[0].dataset.color);
}