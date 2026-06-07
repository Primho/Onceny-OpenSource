import { getDataCards, setDataCards, setActiveCard } from './state.js';
import { makeCard } from './components/card.js';
import { syncDialogFromCard } from './components/dialog.js';
import { deleteCard, getCards, createCard } from './api.js';

const TEMPORAL_TTL_MS = 120_000;

const workspaceGrid = document.querySelector('#workspace-grid');
const workspaceEmpty = document.querySelector('#workspace-empty');
const createMenu = document.querySelector('#workspace-create-menu');
const createMenuItems = document.querySelectorAll('.workspace__menu-item[data-space]');
const cardDialog = document.querySelector('#card-dialog');
const deleteDialog = document.querySelector('#delete-dialog');
const titleInput = document.querySelector('#card-dialog-title-input');
const settingsIcon = document.querySelector('.sidebar__settings-icon');

let cardToDeleteId = null;

const toggleEmptyState = () => {
    const hasCards = workspaceGrid.children.length > 0;
    workspaceEmpty.hidden = hasCards;
};

const openCardDialog = (card) => {
    setActiveCard(card);
    syncDialogFromCard(card);
    titleInput.value = card.title ?? '';
    cardDialog.showModal();
};

const loadCards = async () => {
    workspaceGrid.replaceChildren();
    const allCards = await getCards();

    const validCards = allCards.filter((card) => {
        if (card.type === 'temporal') {
            return scheduleTemporalExpiry(card);
        }
        return true;
    });

    validCards.forEach((card) => makeCard(card, workspaceGrid));
    setDataCards(validCards);
    toggleEmptyState();
};

const createSpace = async (spaceType) => {
    const newCard = {
        color: '#f1f1f1',
        title: '',
        tag: '',
        marker: '📌',
        type: spaceType,
    };

    if (spaceType === 'temporal') {
        newCard.marker = '⏳';
        newCard.createdAt = Date.now();
    }

    const savedCard = await createCard(newCard);
    const cards = getDataCards();
    
    cards.push(savedCard);
    setDataCards(cards);

    makeCard(savedCard, workspaceGrid, true);
    toggleEmptyState();
    openCardDialog(savedCard);

    if (spaceType === 'temporal') {
        scheduleTemporalExpiry(savedCard);
    }
};

const scheduleTemporalExpiry = (card) => {
    const expiresAt = card.createdAt + TEMPORAL_TTL_MS;
    const remaining = expiresAt - Date.now();

    if (remaining <= 0) {
        deleteCard(card.id);
        return false;
    }

    setTimeout(async () => {
        const cardEl = document.querySelector(`.note-card[data-id="${card.id}"]`);
        const cards = getDataCards().filter((c) => c.id !== card.id);
        setDataCards(cards);
        await deleteCard(card.id);
        cardEl?.remove();
        toggleEmptyState();
    }, remaining);

    return true;
};

createMenuItems.forEach((btn) => {
    btn.addEventListener('click', () => {
        createMenu.hidePopover();
        createSpace(btn.dataset.space);
    });
});

workspaceGrid.addEventListener('click', (event) => {
    const cardEl = event.target.closest('.note-card');
    if (!cardEl) return;

    if (event.target.closest('.note-card__delete')) {
        cardToDeleteId = Number(cardEl.dataset.id);
        deleteDialog.showModal();

        const audio = new Audio('../assets/sounds/access-denied-alert-sound.m4a');
        audio.volume = 0.5;
        audio.play().catch(() => {});
        return;
    }

    if (event.target.closest('[data-action="edit"]')) {
        event.target.closest('.note-card__menu-panel')?.hidePopover?.();
        const card = getDataCards().find((c) => c.id === Number(cardEl.dataset.id));
        if (card) openCardDialog(card);
        return;
    }

    if (event.target.closest('.note-card__menu-trigger, .note-card__menu-panel')) {
        return;
    }

    const card = getDataCards().find((c) => c.id === Number(cardEl.dataset.id));
    if (card) openCardDialog(card);
});

deleteDialog.querySelector('[data-action="delete-cancel"]')?.addEventListener('click', () => {
    deleteDialog.close();
});

deleteDialog.addEventListener('close', async (event) => {
    if (event.target.returnValue !== 'confirm' || cardToDeleteId == null) {
        cardToDeleteId = null;
        return;
    }

    const cardId = cardToDeleteId;
    cardToDeleteId = null;

    const cardEl = document.querySelector(`.note-card[data-id="${cardId}"]`);
    setDataCards(getDataCards().filter((c) => c.id !== cardId));
    await deleteCard(cardId);
    cardEl?.remove();
    toggleEmptyState();
});

window.addEventListener(
    'scroll',
    () => {
        if (!settingsIcon) return;

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) return;

        settingsIcon.style.transform = `rotate(${(window.scrollY / maxScroll) * 360}deg)`;
    },
    { passive: true },
);

loadCards();
