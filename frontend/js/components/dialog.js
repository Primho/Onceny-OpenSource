import { makeCard } from "./card.js";
import { setColor, getColor, setDataCards, getDataCards, setCounter, getCounter } from '../state.js';

const ADD_TODO = document.querySelector('.fab-container');

const DIALOG = document.querySelector('#myDialog');
const BAR = document.querySelector('.bar');
const ANS_THEME = document.querySelector('#userAnswer');
const TAG = document.querySelector('#todo-tags');
const MARKER = document.querySelector('#marker');
const COLOR_OPTS = document.querySelectorAll('.color-opt');
const CANCEL_BTN = document.getElementById('btn-cancel');
const ACEPT_BTN = document.getElementById('btn-acept');

ADD_TODO.addEventListener('click', () => {
    DIALOG.showModal();
});

COLOR_OPTS.forEach(btn => {
    btn.addEventListener('click', () => {
        COLOR_OPTS.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        setColor(btn.dataset.color);
        BAR.style.backgroundColor = selectedColor;
    });
});

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
    makeCard(newCard, LISTS_WRAPPER);
    
    DIALOG.close();
});

CANCEL_BTN.addEventListener ('click', () => {
    DIALOG.close();
});