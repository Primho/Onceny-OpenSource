import { getDataCards, setDataCards } from './state.js'
import './components/dialog.js';


const cardsContainer = document.querySelector('.lists-wrapper');

const cardDialog = document.querySelector('#card-dialog');
const closeNoteDialogBtn = document.querySelector('#card-dialog__close');
const noteDialogTitleInput = document.querySelector('.card-dialog__title');

const deleteConfirmationDialog = document.querySelector('#delete-confirmation-dialog');
const confirmDeleteBtn = document.querySelector('.dialog-btn--danger');
const cancelDeleteBtn = document.querySelector('.dialog-btn--cancel');

let currentCard = null;
let cardToDeleteId = null;

cardsContainer.addEventListener('click', (e) => {
    const isCard = e.target.closest('.note-card');
    const isDelete = e.target.closest('.delete-card'); 
    const cardOptionsMenu = e.target.closest('.card-menu-btn');

    if (!isCard || cardOptionsMenu || isDelete) return;
    cardDialog.showModal();
    
    const cardNumber = Number(isCard.dataset.id);
    currentCard = getDataCards().find(card => card.id === cardNumber);
    noteDialogTitleInput.value = currentCard.title;
    console.log("click: ", currentCard);

});

closeNoteDialogBtn.addEventListener('click', () => {
    const targetCardElement = document.querySelector(`[data-id="${currentCard.id}"]`);
    const cardTitleHeading = targetCardElement.querySelector('.note-card__title');
    currentCard.title = noteDialogTitleInput.value;
    cardTitleHeading.textContent = currentCard.title;

    cardDialog.close();
});

document.addEventListener('click', (e) => {
    const clickedDeleteBtn = e.target.closest('.delete-card');
    if(!clickedDeleteBtn) return;
    const card = clickedDeleteBtn.closest('.note-card');
    cardToDeleteId = Number(card.dataset.id);
    
    deleteConfirmationDialog.showModal();
});

confirmDeleteBtn.addEventListener('click', (e) => {
    const currentCardDom = document.querySelector(`[data-id="${cardToDeleteId}"]`);
    const cardId = cardToDeleteId;

    let cards = getDataCards();
    cards = cards.filter(card => card.id !== cardId);
    setDataCards(cards);

    currentCardDom.remove();
    deleteConfirmationDialog.close();
})