import { createCard, updateCard } from "../api.js";
import { getActiveCard, getColor, setColor } from "../state.js";
import { getCardColors } from "./card.js";
import { createNewBlock } from "./dialogblock.js";
import { addPage } from "./page.js";

// Constantes globales de configuración
const DEFAULT_COLOR = "#f1f1f1";

// Selectores del DOM
const cardDialog = document.querySelector("#card-dialog");
const closeBtn = document.querySelector("#card-dialog-close");
const titleInput = document.querySelector("#card-dialog-title-input");
const settingsTitle = document.querySelector("#card-dialog-settings-title");
const markerInput = document.querySelector("#card-dialog-marker");
const tagsInput = document.querySelector("#card-dialog-tags");
const colorPicker = document.querySelector(".color-picker");
const toggleCompactMode = document.querySelector(".compact-toggle");
const pageAddBtn = document.querySelector("#card-dialog-page-add");
const pagesContainer = document.querySelector("#card-dialog-pages");
const mobileMenu = document.querySelector("#card-dialog-mobile-menu");
const dialogMenuBtn = document.querySelector(".card-dialog__menu");
const dialogBlockMenu = document.querySelector("#card-dialog-block-menu");

// CORRECCIÓN: Contenedor global de todos los paneles
const panelsParentContainer =
  document.querySelector(".card-dialog__panels-container") ||
  document.querySelector(".card-dialog__main");

// REFERENCIA: Rastrea qué bloque abrió el menú de comandos
let currentCommandBlock = null;

const getCardElement = (id) =>
  document.querySelector(`.note-card[data-id="${id}"]`);

const setPanel = (panelName) => {
  const currentTabs = document.querySelectorAll(
    ".card-dialog__page-tab[data-panel]",
  );
  const currentPanels = document.querySelectorAll(".card-dialog__panel");

  currentTabs.forEach((tab) => {
    const isActive = tab.dataset.panel === panelName;
    tab.classList.toggle("card-dialog__page-tab--active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  currentPanels.forEach((panel) => {
    const isActive = panel.id === `card-dialog-panel-${panelName}`;
    panel.hidden = !isActive;
    panel.classList.toggle("card-dialog__panel--active", isActive);
    panel.setAttribute("aria-expanded", String(isActive));
  });

  if (mobileMenu && mobileMenu.matches(":popover-open")) {
    mobileMenu.hidePopover();
  }

  if (panelName === "config") {
    titleInput.hidden = true;
    closeBtn.hidden = true;
    settingsTitle.hidden = false;
    dialogMenuBtn?.classList.add("hidden");
  } else {
    dialogMenuBtn?.classList.remove("hidden");
    titleInput.hidden = false;
    closeBtn.hidden = false;
    settingsTitle.hidden = true;
  }
};

const syncColorPicker = (hexColor) => {
  if (!colorPicker) return;
  const colorOpt = colorPicker.querySelectorAll(".color-picker__option");

  colorOpt.forEach((btn) => {
    const selected = btn.dataset.color === hexColor;
    btn.classList.toggle("color-picker__option--selected", selected);
    btn.setAttribute("aria-checked", String(selected));
  });
};

const applyCardColorToDom = (cardEl, hexColor, theme) => {
  if (!cardEl) return;
  const colors = getCardColors(hexColor);

  cardEl.style.backgroundColor = colors.bg;
  const titleEl = cardEl.querySelector(".note-card__title");
  const menuIcon = cardEl.querySelector(".note-card__menu-trigger svg");

  if (titleEl) titleEl.style.color = colors.text;
  if (menuIcon) menuIcon.style.color = colors.text;

  if (theme) {
    cardEl.dataset.theme = theme;
  }
};

const syncDialogFromCard = (card) => {
  if (!card) return;

  const fallbackColor = card.color ?? DEFAULT_COLOR;
  titleInput.value = card.title ?? "";
  markerInput.value = card.marker ?? "";
  tagsInput.value = card.tag ?? "";

  syncColorPicker(fallbackColor);
  setColor(fallbackColor);
  setPanel("content");
};

// --- MÉTODOS DE PERSISTENCIA ---
const persistCard = async () => {
  const card = getActiveCard();
  if (!card) return;

  const cardEl = getCardElement(card.id);
  const titleEl = cardEl?.querySelector(".note-card__title");

  const newTitle = titleInput.value.trim() || "Untitled";
  const changed = newTitle !== (card.title ?? "");

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
  const tagEl = cardEl?.querySelector(".note-card__tag");
  const currentGlobalColor = getColor();

  const payload = {
    color: currentGlobalColor,
    marker: markerInput.value.trim(),
    tag: tagsInput.value.trim(),
  };

  const changed =
    payload.color !== (card.color ?? DEFAULT_COLOR) ||
    payload.marker !== (card.marker ?? "") ||
    payload.tag !== (card.tag ?? "");

  Object.assign(card, payload);
  applyCardColorToDom(cardEl, payload.color);

  if (payload.tag && cardEl) {
    if (tagEl) {
      tagEl.textContent = payload.tag;
    } else {
      const info = cardEl.querySelector(".note-card__info");
      const span = document.createElement("span");
      span.className = "note-card__tag";
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

document.addEventListener("click", (e) => {
  const tab = e.target.closest(".card-dialog__page-tab[data-panel]");
  if (tab) {
    setPanel(tab.dataset.panel);
  }
});

// maneja los cambios sin que lo vea directo

if (colorPicker) {
  colorPicker.addEventListener("click", (event) => {
    const option = event.target.closest(".color-picker__option");
    if (!option) return;

    const card = getActiveCard();
    if (!card) return;

    const hex = option.dataset.color;
    const theme = option.dataset.theme;

    setColor(hex);
    syncColorPicker(hex);
  });
}

// manejamiento del color y como se guarda sin que le alla dado en el backdrop

closeBtn?.addEventListener("click", () => {
  cardDialog.close();
});

cardDialog?.addEventListener("close", async () => {
  await persistCard();

  currentCommandBlock = null;
  if (dialogBlockMenu?.matches(":popover-open")) {
    dialogBlockMenu.hidePopover();
  }
});

document
  .querySelector('#card-dialog [data-action="config-save"]')
  ?.addEventListener("click", async () => {
    await persistConfig();
    cardDialog.close();
  });

// --- GESTIÓN INTERNA DE BLOQUES (CORREGIDO: Escucha en todo el lienzo) ---

panelsParentContainer?.addEventListener("keydown", (e) => {
  if (!e.target.classList.contains("editor-block")) return;
  const currentWrapper = e.target.closest(".editor-block-wrapper");
  const currentPanelContainer = e.target.closest(".card-dialog__panel");

  if (e.key === "Enter") {
    if (e.shiftKey) return;
    else {
      e.preventDefault();
      createNewBlock(currentWrapper);
    }
  }

  if (e.key === "Backspace") {
    // CORRECCIÓN: Verifica el conteo de bloques relativo a la página donde se encuentra actualmente
    const totalBlocksInPage = currentPanelContainer.querySelectorAll(
      ".editor-block-wrapper",
    ).length;

    if (e.target.textContent === "" && totalBlocksInPage > 1) {
      e.preventDefault();

      const prevWrapper = currentWrapper.previousElementSibling;
      if (
        prevWrapper &&
        prevWrapper.classList.contains("editor-block-wrapper")
      ) {
        const prevBlock = prevWrapper.querySelector(".editor-block");
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

const applyBlockType = (block, blockType) => {
  if (!block?.classList.contains("editor-block")) return;

  block.classList.remove(
    "editor-block--heading",
    "editor-block--task",
    "editor-block--text",
  );
  block.classList.add(`editor-block--${blockType}`);
  block.dataset.blockType = blockType;

  switch (blockType) {
    case "heading":
      block.style.fontWeight = "700";
      block.style.fontSize = "2rem";
      block.style.lineHeight = "1.2";
      break;

    case "subheding":
        block.style.fontWeight = "700";
      block.style.fontSize = "1.5rem";
      block.style.lineHeight = "1.2";

    case "task":
      block.style.fontWeight = "500";
      block.style.fontSize = "1rem";
      block.style.lineHeight = "1.6";
      break;

    case "text":
    default:
      block.style.fontWeight = "500";
      block.style.fontSize = "1rem";
      block.style.lineHeight = "1.6";
      break;
  }
};

panelsParentContainer?.addEventListener("input", (e) => {
  const activeBlock = e.target;
  if (!activeBlock.classList.contains("editor-block")) return;

  const text = activeBlock.textContent;
  const isValidCommand = text.match(/(?:^|\s):([a-zA-Z]*)$/);

  if (isValidCommand && dialogBlockMenu) {
    currentCommandBlock = activeBlock;

    const rect = activeBlock.getBoundingClientRect();

    dialogBlockMenu.style.position = "fixed";
    dialogBlockMenu.style.margin = "0";
    dialogBlockMenu.style.top = `${rect.bottom + 8}px`;
    dialogBlockMenu.style.left = `${rect.left}px`;

    if (!dialogBlockMenu.matches(":popover-open")) {
      dialogBlockMenu.showPopover();
    }
  } else {
    if (dialogBlockMenu?.matches(":popover-open")) {
      dialogBlockMenu.hidePopover();
      currentCommandBlock = null;
    }
  }
});

dialogBlockMenu?.addEventListener("click", (event) => {
  const option = event.target.closest("[data-block]");
  if (!option || !currentCommandBlock) return;

  applyBlockType(currentCommandBlock, option.dataset.block);

  dialogBlockMenu.hidePopover();
  currentCommandBlock = null;
});

// DIALOG SETTINGS COMPACT MODE
const userMode = localStorage.getItem("compact");

// 1. CONTROL INICIAL: Solo aplicamos si el tema guardado es 'compact'
if (userMode === "true") {
  cardDialog.classList.add("compact-mode");
  if (toggleCompactMode) toggleCompactMode.checked = true;
}

// 2. EVENTO CLICK
if (toggleCompactMode) {
  toggleCompactMode.addEventListener("change", () => {
    if (toggleCompactMode.checked) {
      cardDialog.classList.add("compact-mode");
      localStorage.setItem("compact", true);
      return;
    }
    cardDialog.classList.remove("compact-mode");
    localStorage.setItem("compact", false);
  });
}

window.addEventListener("resize", () => {
  if (dialogBlockMenu && dialogBlockMenu.matches(":popover-open")) {
    dialogBlockMenu.hidePopover();
  }
});

addPage(pageAddBtn, pagesContainer, panelsParentContainer, setPanel);

export { syncDialogFromCard, syncColorPicker };
