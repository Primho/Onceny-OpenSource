import { getDataCards, setDataCards } from './state.js';
import { makeCard } from './components/card.js';
import { deleteCard, getCards, createCard } from './api.js';
import './components/dialog.js'; // Importamos para que ejecute la lógica interna del modal

// --- Variables de Control Global ---
let cardToDeleteId = null;

// --- Selectores del DOM (Actualizados al HTML 2026) ---
const cardsContainer = document.querySelector('.cards-display');
const addCardBtn = document.querySelector('#addCard-btn');
const cardDialog = document.querySelector('#card-dialog');
const noteDialogTitleInput = document.querySelector('#modal-card-title');

const deleteConfirmationDialog = document.querySelector('#delete-confirmation-dialog');
const confirmDeleteBtn = document.querySelector('#delete-confirmation-dialog .dialog-btn--danger');
const cancelDeleteBtn = document.querySelector('#delete-confirmation-dialog .dialog-btn--cancel');

// --- Carga Inicial de Datos ---
const loadCards = async () => {
    cardsContainer.innerHTML = '';
    const cards = await getCards();
    cards.forEach(card => {
        makeCard(card, cardsContainer);
    });
    setDataCards(cards);
};
loadCards();

// --- Crear Nota Nueva Directamente ---
addCardBtn.addEventListener('click', async () => {
    // Estructura por defecto usando tu lógica
    const newCard = {
        color: '#f1f1f1', // Gris por defecto
        title: '',
        tag: '',
        marker: '📌'
    };

    // 1. Guardar en Base de Datos
    const savedCard = await createCard(newCard);

    // 2. Actualizar tu estado en state.js
    const cards = getDataCards();
    cards.push(savedCard);
    setDataCards(cards);

    // 3. Pintarla en el contenedor con la animación de nueva (.note-card--new)
    makeCard(savedCard, cardsContainer, true);

    // 4. Llevar al usuario directo a editarla en el Dialog
    window.currentCard = savedCard; // Compartimos la tarjeta actual globalmente para dialog.js
    window.currentCardDOM = document.querySelector(`[data-id="${savedCard.id}"]`);
    
    noteDialogTitleInput.value = '';
    cardDialog.showModal();
});

// --- Delegación de Eventos (Click en Tarjeta o Borrar) ---
cardsContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.note-card');
    const clickedDeleteBtn = e.target.closest('.delete-card'); 
    const cardOptionsMenu = e.target.closest('.card-menu-btn');

    if (!card || cardOptionsMenu) return;

    // Caso: Borrar Nota
    if (clickedDeleteBtn) {
        cardToDeleteId = Number(card.dataset.id);
        deleteConfirmationDialog.showModal();
        
        const audio = new Audio('../assets/sounds/access-denied-alert-sound.m4a');
        audio.volume = 0.5;
        audio.play().catch(error => console.log("Audio play m4a no soportado o sin archivo:", error));
        return;
    }

    // Caso: Abrir para Editar existente
    window.currentCardDOM = card;
    const cardId = Number(card.dataset.id);
    window.currentCard = getDataCards().find(c => c.id === cardId);
    
    noteDialogTitleInput.value = window.currentCard.title;
    cardDialog.showModal();
});

// --- Confirmar Borrado ---
confirmDeleteBtn.addEventListener('click', async () => {
    const cardToDelete = document.querySelector(`[data-id="${cardToDeleteId}"]`);
    const cardId = cardToDeleteId;

    let cards = getDataCards();
    cards = cards.filter(c => c.id !== cardId);
    setDataCards(cards);

    await deleteCard(cardId);
    cardToDelete.remove();
    deleteConfirmationDialog.close();
});

cancelDeleteBtn.addEventListener('click', () => { 
    deleteConfirmationDialog.close();
});

// --- Efecto Visual Scroll Ajustes ---
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const progress = scrollTop / maxScroll; 
    const rotation = progress * 360; 
    const settingsIcon = document.querySelector('.sidebar__settings-link svg');
    if (settingsIcon) settingsIcon.style.transform = `rotate(${rotation}deg)`;
});