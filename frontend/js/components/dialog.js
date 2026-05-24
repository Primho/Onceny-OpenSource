import { updateCard } from "../api.js";
import { setColor, getColor } from '../state.js';

// --- Selectores del Dialog ---
const cardDialog = document.querySelector('#card-dialog');
const closeNoteDialogBtn = document.querySelector('#card-dialog__close');
const noteDialogTitleInput = document.querySelector('#modal-card-title');
const colorPicker = document.querySelector('.color-picker');

// --- Cambiar Color (Paleta Interactiva) ---
if (colorPicker) {
    colorPicker.addEventListener('click', (e) => {
        const clickedBtn = e.target.closest('.color-opt');
        if (!clickedBtn) return;

        const colorOptions = document.querySelectorAll('.color-opt');
        colorOptions.forEach(b => b.classList.remove('selected'));
        clickedBtn.classList.add('selected');
        
        // Guardamos el color seleccionado en el estado
        setColor(clickedBtn.dataset.color);
        
        // Si hay una tarjeta activa editándose, le cambiamos el fondo de una vez en vivo
        if (window.currentCard && window.currentCardDOM) {
            window.currentCard.color = clickedBtn.dataset.color;
            window.currentCardDOM.style.backgroundColor = clickedBtn.dataset.color;
            
            // Forzar actualización del color del título según tu mapa de contrastes
            const titleHeading = window.currentCardDOM.querySelector('.note-card__title');
            const menuBtnSvg = window.currentCardDOM.querySelector('.card-menu-btn svg');
            
            // Obtenemos el estilo de texto desde el mapa del navegador o el CSS inyectado
            if (titleHeading) titleHeading.style.color = `var(--card-${clickedBtn.ariaLabel.toLowerCase()}-text)`;
            if (menuBtnSvg) menuBtnSvg.style.color = `var(--card-${clickedBtn.ariaLabel.toLowerCase()}-text)`;
        }
    });
}

// --- Cerrar Manual ---
closeNoteDialogBtn.addEventListener('click', () => {
    cardDialog.close();
});

// --- Auto Guardar al Cerrar (Mejor práctica de Persistencia) ---
cardDialog.addEventListener('close', () => {
    // Si no hay tarjeta seleccionada en el entorno global, salimos
    if (!window.currentCard || !window.currentCardDOM) return;
    
    const cardTitleHeading = window.currentCardDOM.querySelector('.note-card__title');
    const newTitle = noteDialogTitleInput.value.trim() || 'Untitled';
    let currentTitle = window.currentCard.title;

    // Actualizamos interfaz física y objeto en memoria
    window.currentCard.title = newTitle;
    if (cardTitleHeading) cardTitleHeading.textContent = newTitle;

    // Solo golpeamos la API si el título realmente cambió para no saturar el servidor backend
    if (newTitle !== currentTitle) {
        updateCard(window.currentCard.id, newTitle);
    }
});