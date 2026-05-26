import { updateCard } from "../api.js";
import { setColor, getActiveCard } from '../state.js';

// --- Selectores del Dialog ---
const cardDialog = document.querySelector('#card-dialog');
const closeNoteDialogBtn = document.querySelector('#card-dialog__close');
const noteDialogTitleInput = document.querySelector('#modal-card-title');
const sideBarTab = document.querySelectorAll('.sidebar-tab');
const colorPicker = document.querySelector('.color-picker');

// --- Cambiar Color (Paleta Interactiva) ---
if (colorPicker) {
    colorPicker.addEventListener('click', (e) => {
        const clickedBtn = e.target.closest('.color-opt');
        if (!clickedBtn) return;

        const currentCard = getActiveCard();
        if (!currentCard) return;

        const currentCardDOM = document.querySelector(`[data-id="${currentCard.id}"]`);
        if (!currentCardDOM) return;

        const colorOptions = document.querySelectorAll('.color-opt');
        colorOptions.forEach(b => b.classList.remove('selected'));
        clickedBtn.classList.add('selected');
        
        // Guardamos el color seleccionado en el estado
        setColor(clickedBtn.dataset.color);


        const titleHeading = currentCardDOM.querySelector('.note-card__title');
        const menuBtnSvg = currentCardDOM.querySelector('.card-menu-btn svg');
            
        // Obtenemos el estilo de texto desde el mapa del navegador o el CSS inyectado
        if (titleHeading) titleHeading.style.color = `var(--card-${clickedBtn.ariaLabel.toLowerCase()}-text)`;
        if (menuBtnSvg) menuBtnSvg.style.color = `var(--card-${clickedBtn.ariaLabel.toLowerCase()}-text)`;

    });
}

// --- Cerrar Manual ---
closeNoteDialogBtn.addEventListener('click', () => {
    cardDialog.close();
});

// --- Auto Guardar al Cerrar (Mejor práctica de Persistencia) ---
cardDialog.addEventListener('close', () => {
    const currentCard = getActiveCard();
    if (!currentCard) return;
    
    // Buscamos la tarjeta en el DOM
    const currentCardDOM = document.querySelector(`[data-id="${currentCard.id}"]`);
    if (!currentCardDOM) return;

    const cardTitleHeading = currentCardDOM.querySelector('.note-card__title');

    const newTitle = noteDialogTitleInput.value.trim() || 'Untitled';
    let currentTitle = currentCard.title;

    // Actualizamos interfaz física y objeto en memoria
    currentCard.title = newTitle;
    if (cardTitleHeading) cardTitleHeading.textContent = newTitle;

    // Solo golpeamos la API si el título realmente cambió para no saturar el servidor backend
    if (newTitle !== currentTitle) {
        updateCard(currentCard.id, newTitle);
    }
});
// Content
let currentTab = 'content';

sideBarTab.forEach(btn => {
    btn.addEventListener('click', () => {
        const activeTab = document.querySelector('.sidebar-tab.active');
        activeTab.classList.remove('active');

        btn.classList.add('active');
        currentTab = btn.dataset.tab;

        // content
        const currentContent = document.querySelector(`#tab-${currentTab}`);
        const activeContent = document.querySelector('.tab-view.active');
        activeContent.classList.remove('active');
 
        currentContent.classList.add('active');
    })
})

