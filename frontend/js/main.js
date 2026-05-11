import { makeCard } from './components/card.js';
import {/*funcion*/} from './components/dialog.js';

const LISTS_WRAPPER = document.querySelector('.lists-wrapper');

const CARD_CONFIG = document.querySelector('#card-dialog__config');
const CARD_HEADER = document.querySelector('#card-dialog__config');

LISTS_WRAPPER.addEventListener('click', (e) => {
    const isCard = e.target.closest('.todo-card');

    if (!isCard) return;
    CARD_CONFIG.showModal();
    const card = Number(isCard.dataset.id);
    
    const findIt = dataCards.find(elemento => elemento.id === card);
    console.log(findIt);

});