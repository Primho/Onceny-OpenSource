import { updateCard } from '../api.js';
import { getActiveCard, getColor, setColor } from '../state.js';
import { titleColor } from './card.js';

const cardDialog = document.querySelector('#card-dialog');
const closeBtn = document.querySelector('#card-dialog-close');
const titleInput = document.querySelector('#card-dialog-title-input');
const markerInput = document.querySelector('#card-dialog-marker');
const tagsInput = document.querySelector('#card-dialog-tags');
const colorPicker = document.querySelector('.color-picker');
const pageTabs = document.querySelectorAll('.card-dialog__page-tab[data-panel]');
const panels = document.querySelectorAll('.card-dialog__panel');

const getCardElement = (id) => document.querySelector(`.note-card[data-id="${id}"]`);

const setPanel = (panelName) => {
    pageTabs.forEach((tab) => {
        const isActive = tab.dataset.panel === panelName;
        tab.classList.toggle('card-dialog__page-tab--active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
    });

    panels.forEach((panel) => {
        const isActive = panel.id === `card-dialog-panel-${panelName}`;
        panel.hidden = !isActive;
        panel.classList.toggle('card-dialog__panel--active', isActive);
    });
};

const syncColorPicker = (hexColor) => {
    if (!colorPicker) return;
    console.log(hexColor);

    const colorOpt = colorPicker.querySelectorAll('.color-picker__option')

    colorOpt.forEach((btn) => {
        // verificar si el color es el mismo
        const selected = btn.dataset.color === hexColor; // true or flase
        btn.classList.toggle('color-picker__option--selected', selected);
        btn.setAttribute('aria-checked', String(selected));
        console.log(btn);
    });
};

const applyCardColorToDom = (cardEl, hexColor, theme) => {
    if (!cardEl) return;

    const contrast = titleColor(hexColor);
    cardEl.style.backgroundColor = hexColor;

    const titleEl = cardEl.querySelector('.note-card__title');
    const menuIcon = cardEl.querySelector('.note-card__menu-trigger svg');

    if (titleEl) titleEl.style.color = contrast;
    if (menuIcon) menuIcon.style.color = contrast;

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

const persistCard = async () => {
    const card = getActiveCard();
    if (!card) return;

    const cardEl = getCardElement(card.id);
    const titleEl = cardEl?.querySelector('.note-card__title');
    const tagEl = cardEl?.querySelector('.note-card__tag');

    const payload = {
        title: titleInput.value.trim() || 'Untitled',
        color: getColor(),
        marker: markerInput.value.trim(),
        tag: tagsInput.value.trim(),
    };

    const changed =
        payload.title !== (card.title ?? '') ||
        payload.color !== (card.color ?? '#f1f1f1') ||
        payload.marker !== (card.marker ?? '') ||
        payload.tag !== (card.tag ?? '');

    Object.assign(card, payload);

    if (titleEl) titleEl.textContent = payload.title;
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
        card.color = hex;
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

document.querySelector('[data-action="config-cancel"]')?.addEventListener('click', () => {
    const card = getActiveCard();
    if (card) syncDialogFromCard(card);
    setPanel('content');
});

document.querySelector('[data-action="config-save"]')?.addEventListener('click', async () => {
    await persistCard();
    setPanel('content');
});

export { syncDialogFromCard };