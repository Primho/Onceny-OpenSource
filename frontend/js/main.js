import { getDataCards, setDataCards } from './state.js'
import './components/dialog.js';


const listsWrapper = document.querySelector('.lists-wrapper');

const cardDialog = document.querySelector('#card-dialog');
const noteDialogBtn = document.querySelector('#card-dialog__close');
const cardDialogTitle = document.querySelector('.card-dialog__title');

const confirmDialog = document.querySelector('#confirm-dialog');
let currentCard = null;

listsWrapper.addEventListener('click', (e) => {
    const isCard = e.target.closest('.note-card');
    const isDelete = e.target.closest('.delete-card'); 
    const cardOptionsMenu = e.target.closest('.card-menu-btn');

    if (!isCard || cardOptionsMenu || isDelete) return;
    cardDialog.showModal();
    const cardNumber = Number(isCard.dataset.id);
    
    currentCard = getDataCards().find(card => card.id === cardNumber);
    cardDialogTitle.value = currentCard.title;
    console.log("click: ", currentCard);

});

noteDialogBtn.addEventListener('click', () => {
    const currentCardTitle = document.querySelector(`[data-id="${currentCard.id}"]`);
    const cardTitle = currentCardTitle.querySelector('.note-card__title');
    currentCard.title = cardDialogTitle.value;
    cardTitle.textContent = currentCard.title;

    cardDialog.close();
});

document.addEventListener('click', (e) => {
    const isDelete = e.target.closest('.delete-card');
    if(!isDelete) return;
    confirmDialog.showModal();
    
    const cardElement = e.target.closest('.note-card');
    const cardId = Number(cardElement.dataset.id);

    let cards = getDataCards();
    cards = cards.filter(card => card.id !== cardId);
    setDataCards(cards);
    cardElement.remove();
});