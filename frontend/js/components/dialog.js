import { makeCard } from "./card.js";
import { setColor, getColor, setDataCards, getDataCards, setCounter, getCounter } from '../state.js';

const listWrapper = document.querySelector('.lists-wrapper');
const addCardBtn = document.querySelector('.fab-container');

const newCardDialog = document.querySelector('#myDialog');
const dialogColorBar = document.querySelector('.bar');
const cardTitleInput = document.querySelector('#userAnswer');
const cardTagInput = document.querySelector('#todo-tags');
const cardMarkerInput = document.querySelector('#marker');
const colorOptions = document.querySelectorAll('.color-opt');

const aceptBtn = document.getElementById('btn-acept');
const cancelBtn= document.getElementById('btn-cancel');

// Card Dialog

colorOptions.forEach(btn => {
    btn.addEventListener('click', () => {
        colorOptions.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        setColor(btn.dataset.color);
        dialogColorBar.style.backgroundColor = getColor();
        newCardDialog.style.borderTop = `2px solid ${getColor()}`;
    });
});

addCardBtn.addEventListener('click', () => {
    newCardDialog.showModal();
});

cancelBtn.addEventListener ('click', () => {
    newCardDialog.close();
});

aceptBtn.addEventListener('click', () => {
    setCounter(getCounter() + 1);
    const newCard = {
        id: getCounter(),
        color: getColor(),
        title: cardTitleInput.value || 'Untitled',
        tag: cardTagInput.value,
        blocks: getDataCards(),/*es un arr es para acordarme que hay dentro */
        marker: cardMarkerInput.value
    };

    const cards = getDataCards();
    cards.push(newCard);
    setDataCards(cards);

    makeCard(newCard, listWrapper);
    
    newCardDialog.close();
});