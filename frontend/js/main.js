import { getDataCards } from './state.js'
import './components/dialog.js';


const listsWrapper = document.querySelector('.lists-wrapper');

const cardDialog = document.querySelector('#card-dialog');
const noteDialogBtn = document.querySelector('#card-dialog__close');
const cardDialogTitle = document.querySelector('.card-dialog__title');
let currentCard = null;

listsWrapper.addEventListener('click', (e) => {
    const isCard = e.target.closest('.todo-card');
    const cardOptionsMenu = e.target.closest('.card-options');

    if (!isCard || cardOptionsMenu) return;
    cardDialog.showModal();
    const cardNumber = Number(isCard.dataset.id);
    
    currentCard = getDataCards().find(card => card.id === cardNumber);
    cardDialogTitle.value = currentCard.title;
    console.log("click: ", currentCard);

});

noteDialogBtn.addEventListener('click', () => {
    const currentCardTitle = document.querySelector(`[data-id="${currentCard.id}"]`);
    const cardTitle = currentCardTitle.querySelector('.todo-card__title');
    currentCard.title = cardDialogTitle.value;
    cardTitle.textContent = currentCard.title;

    cardDialog.close();
});