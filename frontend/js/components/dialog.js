import { createCard, updateCard } from '../api.js';
import { getActiveCard, getColor, setColor } from '../state.js';
import { getCardColors } from './card.js';
import { createNewBlock } from './dialogblock.js';
import { addPage } from './page.js';

const cardDialog = document.querySelector('#card-dialog');
const closeBtn = document.querySelector('#card-dialog-close');
const titleInput = document.querySelector('#card-dialog-title-input');
const settingsTitle = document.querySelector('#card-dialog-settings-title');
const markerInput = document.querySelector('#card-dialog-marker');
const tagsInput = document.querySelector('#card-dialog-tags');
const colorPicker = document.querySelector('.color-picker');

const pageTabs = document.querySelectorAll('.card-dialog__page-tab[data-panel]');
const pageAddBtn = document.querySelector('#card-dialog-page-add');
const pagesContainer = document.querySelector('#card-dialog-pages');

const panels = document.querySelectorAll('.card-dialog__panel');
const mobileMenu = document.querySelector('#card-dialog-mobile-menu');
const dialogMenuBtn = document.querySelector('.card-dialog__menu');

//  SELECTORES CORREGIDOS SEGÚN TU HTML
const spaceBlocksContainer = document.querySelector('#space-blocks-container'); // Sincronizado con tu HTML
const dialogBlockMenu = document.querySelector('#card-dialog-block-menu');

let currentCommandBlock = null;

const getCardElement = (id) => document.querySelector(`.note-card[data-id="${id}"]`);

const setPanel = (panelName) => {
    const currentTabs = document.querySelectorAll('.card-dialog__page-tab[data-panel]');

    currentTabs.forEach((tab) => {
        const isActive = tab.dataset.panel === panelName;
        tab.classList.toggle('card-dialog__page-tab--active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
    });

    panels.forEach((panel) => {
        const isActive = panel.id === `card-dialog-panel-${panelName}`;
        panel.hidden = !isActive;
        panel.classList.toggle('card-dialog__panel--active', isActive);
    });

    if(mobileMenu && mobileMenu.matches(':popover-open')) {
        mobileMenu.hidePopover();
    }

    if(panelName === 'config') {
        titleInput.hidden = true;
        closeBtn.hidden = true;
        settingsTitle.hidden = false;
        dialogMenuBtn.classList.add('hidden');
    } else {
        dialogMenuBtn.classList.remove('hidden');
        titleInput.hidden = false;
        closeBtn.hidden = false;
        settingsTitle.hidden = true;
    }
};

const syncColorPicker = (hexColor) => {
    if (!colorPicker) return;
    const colorOpt = colorPicker.querySelectorAll('.color-picker__option');

    colorOpt.forEach((btn) => {
        const selected = btn.dataset.color === hexColor;
        btn.classList.toggle('color-picker__option--selected', selected);
        btn.setAttribute('aria-checked', String(selected));
    });
};

const applyCardColorToDom = (cardEl, hexColor, theme) => {
    if (!cardEl) return;
    const colors = getCardColors(hexColor);

    cardEl.style.backgroundColor = colors.bg;
    const titleEl = cardEl.querySelector('.note-card__title');
    const menuIcon = cardEl.querySelector('.note-card__menu-trigger svg');

    if (titleEl) titleEl.style.color = colors.text;
    if (menuIcon) menuIcon.style.color = colors.text;

    if (theme) {
        cardEl.dataset.theme = theme;
    }
};

const syncDialogFromCard = (card) => {
    if (!card) return;

    titleInput.value = card.title ?? '';
    markerInput.value = card.marker ?? '';
    tagsInput.value = card.tag ?? '';
    syncColorPicker(card.color ?? '#f1f1f1');
    setColor(card.color ?? '#f1f1f1');
    setPanel('content');
};

// --- MÉTODOS DE PERSISTENCIA MANUAL ORIGINALES ---

const persistCard = async () => {
    const card = getActiveCard();
    if (!card) return;

    const cardEl = getCardElement(card.id);
    const titleEl = cardEl?.querySelector('.note-card__title');

    const newTitle = titleInput.value.trim() || 'Untitled';
    const changed = newTitle !== (card.title ?? '');

    card.title = newTitle;
    if (titleEl) titleEl.textContent = newTitle;

    if (changed) {
        await updateCard(card.id, { title: newTitle });
    }
};

const persistConfig = async () => {
    const card = getActiveCard();
    if (!card) return;

    const cardEl = getCardElement(card.id);
    const tagEl = cardEl?.querySelector('.note-card__tag');

    const payload = {
        color: getColor(),
        marker: markerInput.value.trim(),
        tag: tagsInput.value.trim(),
    };

    const changed =
        payload.color !== (card.color ?? '#f1f1f1') ||
        payload.marker !== (card.marker ?? '') ||
        payload.tag !== (card.tag ?? '');

    Object.assign(card, payload);
    applyCardColorToDom(cardEl, payload.color);

    if (payload.tag && cardEl) {
        if (tagEl) {
            tagEl.textContent = payload.tag;
        } else {
            const info = cardEl.querySelector('.note-card__info');
            const span = document.createElement('span');
            span.className = 'note-card__tag';
            span.textContent = payload.tag;
            info?.append(span);
        }
    } else if (tagEl) {
        tagEl.remove();
    }

    if (changed) {
        await updateCard(card.id, payload);
    }
};

// --- LISTENERS DE INTERFAZ Y EVENTOS ---

pageTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        setPanel(tab.dataset.panel);
    });
});

if (colorPicker) {
    colorPicker.addEventListener('click', (event) => {
        const option = event.target.closest('.color-picker__option');
        if (!option) return;

        const card = getActiveCard();
        if (!card) return;

        const hex = option.dataset.color;
        const theme = option.dataset.theme;

        setColor(hex);
        syncColorPicker(hex);

        const cardEl = getCardElement(card.id);
        applyCardColorToDom(cardEl, hex, theme);
    });
}

closeBtn?.addEventListener('click', () => {
    cardDialog.close();
});

cardDialog?.addEventListener('close', () => {
    persistCard();
});

document.querySelector('[data-action="content-save"]')?.addEventListener('click', async () => {
    await persistCard();
});

document.querySelector('[data-action="config-save"]')?.addEventListener('click', async () => {
    await persistConfig();
    setPanel('content');
});

// --- GESTIÓN INTERNA DE BLOQUES Y COMANDOS DE TECLADO ---

spaceBlocksContainer?.addEventListener('keydown', (e) => {
    if (!e.target.classList.contains('editor-block')) return;
    const currentWrapper = e.target.closest('.editor-block-wrapper');

    if (e.key === 'Enter') {
        if (e.shiftKey) return; 
        else {
            e.preventDefault();            
            createNewBlock(currentWrapper);
        }
    }

    if(e.key === 'Backspace') {
        if(e.target.textContent === '' && spaceBlocksContainer.children.length > 1) {
            e.preventDefault();

            const prevWrapper = currentWrapper.previousElementSibling;
            if (prevWrapper) {
                const prevBlock = prevWrapper.querySelector('.editor-block');
                currentWrapper.remove();

                prevBlock.focus();

                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(prevBlock);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }
});

spaceBlocksContainer?.addEventListener('input', (e) => {
    const activeBlock = e.target;
    if (!activeBlock.classList.contains('editor-block')) return;

    const text = activeBlock.textContent;
    // Esta expresión regular busca si hay un ":" al final o seguido de letras
    const isValidCommand = text.match(/(?:^|\s):([a-zA-Z]*)$/);

    if (isValidCommand && dialogBlockMenu) { // <-- Validamos que exista el menú primero
        const rect = activeBlock.getBoundingClientRect();

        // Forzar la posición del Popover nativo justo debajo
        dialogBlockMenu.style.position = 'fixed';
        dialogBlockMenu.style.margin = '0'; 
        dialogBlockMenu.style.top = `${rect.bottom + 8}px`; 
        dialogBlockMenu.style.left = `${rect.left}px`;

        if (!dialogBlockMenu.matches(':popover-open')) {
            dialogBlockMenu.showPopover();
        }
    } else {
        // Usamos ?. para que si dialogBlockMenu es null, no lance un error en la consola
        if (dialogBlockMenu?.matches(':popover-open')) {
            dialogBlockMenu.hidePopover();
        }
    }
});

window.addEventListener('resize', () => {
    if(dialogBlockMenu && dialogBlockMenu.matches(':popover-open')) {
        dialogBlockMenu.hidePopover();
    }
});

// Inicialización modular segura del componente de páginas
addPage(pageAddBtn, pagesContainer, setPanel);

export { syncDialogFromCard, syncColorPicker };