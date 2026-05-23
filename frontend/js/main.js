import { getDataCards, setDataCards } from './state.js';
import { makeCard } from './components/card.js';
import './components/dialog.js';
import { deleteCard, getCards, updateCard } from './api.js';

// --- Variables de Control Global ---
let currentCard = null;
let cardToDeleteId = null;
let currentCardDOM = null;

// --- Selectores del DOM ---
const cardsContainer = document.querySelector('.lists-wrapper');

const cardDialog = document.querySelector('#card-dialog');
const closeNoteDialogBtn = document.querySelector('#card-dialog__close');
const noteDialogTitleInput = document.querySelector('.card-dialog__title');

const deleteConfirmationDialog = document.querySelector('#delete-confirmation-dialog');
const confirmDeleteBtn = document.querySelector('#delete-confirmation-dialog .dialog-btn--danger');
const cancelDeleteBtn = document.querySelector('#delete-confirmation-dialog .dialog-btn--cancel');

// --- Carga Inicial de Datos ---
const loadCards = async () => {
    console.log('loadCards called');
    cardsContainer.innerHTML = '';
    const cards = await getCards();
    cards.forEach(card => {
        console.log('rendering card', card.id);
        makeCard(card, cardsContainer);
    });
    setDataCards(cards);
};
loadCards();

// --- Delegación de Eventos en las Tarjetas ---
cardsContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.note-card');
    const clickedDeleteBtn = e.target.closest('.delete-card'); 
    const cardOptionsMenu = e.target.closest('.card-menu-btn');

    // Cláusula de Guarda: Si no hay tarjeta o es el menú, no hacemos nada
    if (!card || cardOptionsMenu) return;

    // Caso Especial: El usuario quiere borrar la nota
    if (clickedDeleteBtn) {
        cardToDeleteId = Number(card.dataset.id);
        
        deleteConfirmationDialog.showModal();
        const audio = new Audio('../assets/sounds/access-denied-alert-sound.mp3');
        audio.volume = 0.5;
        audio.play().catch(error => console.log("Error al reproducir:", error));
        
        return;
    }

    // Caso por Defecto: El usuario quiere editar la nota
    currentCardDOM = card; // Guardamos la tarjeta física actual
    cardDialog.showModal();
    
    const cardId = Number(card.dataset.id);
    currentCard = getDataCards().find(card => card.id === cardId);
    noteDialogTitleInput.value = currentCard.title;
    console.log("click: ", currentCard);
});

// --- Cerrar y Guardar Edición ---
closeNoteDialogBtn.addEventListener('click', () => {
    cardDialog.close();
});

cardDialog.addEventListener('close', () => {
    if (!currentCard || !currentCardDOM) return;
    // Buscamos el título directamente dentro de la tarjeta física guardada
    const cardTitleHeading = currentCardDOM.querySelector('.note-card__title');
    const newTitle = noteDialogTitleInput.value || 'Untitled';
    let currentTitle = currentCard.title;

    currentCard.title = newTitle;
    cardTitleHeading.textContent = newTitle;

    if (newTitle !== currentTitle) {
        updateCard(currentCard.id, newTitle);
    }
})

// --- Confirmar Borrado ---
confirmDeleteBtn.addEventListener('click', async () => {
    const cardToDelete = document.querySelector(`[data-id="${cardToDeleteId}"]`);
    const cardId = cardToDeleteId;

    // Actualizamos el estado local
    let cards = getDataCards();
    cards = cards.filter(card => card.id !== cardId);
    setDataCards(cards);

    // Persistimos en la base de datos y removemos del DOM
    await deleteCard(cardId);
    cardToDelete.remove();
    deleteConfirmationDialog.close();
});

// --- Evento: Cancelar Borrado ---
cancelDeleteBtn.addEventListener('click', () => { 
    deleteConfirmationDialog.close();
});

// --- Efecto Visual de Ajustes (Scroll) ---
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / maxScroll; 

    const rotation = progress * 360; 
    document.querySelector('.sidebar__settings-link svg').style.transform = `rotate(${rotation}deg)`;
});