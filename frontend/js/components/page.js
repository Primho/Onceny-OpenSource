import { createNewBlock } from './dialogblock.js';

// GESTION Y CREACION DE NUEVAS PAGINAS Y SU CONTENIDO
const addPage = (pageAddBtn, pagesContainer, panelsParentContainer, setPanel) => {
    let pageCount = 1;
    let selectedEmoji = '📄';
    const pageMenuPopover = document.querySelector('#card-page-menu');
    let activeTargetPageWrapper = null;

    const setupPageMenuEvent = (pageWrapper) => {
        const menuBtn = pageWrapper.querySelector('.card-dialog__page-menu');

        menuBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            activeTargetPageWrapper = pageWrapper;

            const rect = menuBtn.getBoundingClientRect();
            pageMenuPopover.style.position = 'fixed';
            pageMenuPopover.style.margin = '0';
            pageMenuPopover.style.top = `${rect.bottom + 4}px`;
            pageMenuPopover.style.left = `${rect.left - 80}px`;

            if (!pageMenuPopover.matches(':popover-open')) {
                pageMenuPopover.showPopover();
            }
        });
    };

    const initialPages = pagesContainer.querySelectorAll('.card-dialog__page');
    initialPages.forEach(page => setupPageMenuEvent(page));

    pageAddBtn?.addEventListener('click', () => {
        pageCount++;
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
        const newPageId = `page-${uniqueId}`;
        const panelId = `card-dialog-panel-${newPageId}`;

        const newPageHTML = `
            <div class="card-dialog__page" role="presentation">
                <button type="button" class="card-dialog__page-tab"
                    role="tab" aria-selected="false"
                    aria-controls="${panelId}" data-panel="${newPageId}">
                    <span class="card-dialog__page-emoji">${selectedEmoji}</span>
                    <span class="card-dialog__page-label">Page ${pageCount}</span>
                </button>
                <button type="button" class="card-dialog__page-menu" aria-label="Page Actions">
                    <svg class="icon" aria-hidden="true" focusable="false">
                        <use href="../assets/icons/sprite.svg#icon-more-vert"></use>
                    </svg>
                </button>
            </div>
        `;

        const newPanel = document.createElement('main');
        newPanel.id = panelId;
        newPanel.className = 'card-dialog__panel card-dialog__canvas';
        newPanel.role = 'tabpanel';
        newPanel.tabIndex = 0;
        newPanel.hidden = true;

        // CONTENIDO INTERIOR
        const blocksContainer = document.createElement('div');
        blocksContainer.className = 'card-dialog__editor';

        const initialBlockWrapper = document.createElement('div');
        initialBlockWrapper.className = 'editor-block-wrapper';

        const initialBlock = document.createElement('div');
        initialBlock.className = 'editor-block editor-block--text';
        initialBlock.contentEditable = "true";
        const placeholderText = "Type your content here or use ':' for commands...";

        initialBlock.setAttribute('placeholder', placeholderText);
        initialBlock.setAttribute('aria-placeholder', placeholderText);
        initialBlock.setAttribute('role', 'textbox');

        initialBlockWrapper.appendChild(initialBlock);
        blocksContainer.appendChild(initialBlockWrapper);
        newPanel.appendChild(blocksContainer);

        pagesContainer.insertAdjacentHTML('beforeend', newPageHTML);
        panelsParentContainer.appendChild(newPanel);

        console.log(blocksContainer);

        const allPages = pagesContainer.querySelectorAll('.card-dialog__page');
        const newlyAddedPage = allPages[allPages.length - 1];
        setupPageMenuEvent(newlyAddedPage);

        setPanel(newPageId);
        initialBlock.focus();
    });

    pageMenuPopover?.addEventListener('click', (e) => {
        const item = e.target.closest('.note-card__menu-item');
        if (!item || !activeTargetPageWrapper) return;

        const action = item.dataset.action;

        if (action === 'delete') {
            const totalPages = pagesContainer.querySelectorAll('.card-dialog__page').length;
            if (totalPages <= 1) {
                alert("¡No puedes eliminar todas las páginas! Al menos debe quedar una activa.");
                pageMenuPopover.hidePopover();
                return;
            }

            const tabBtn = activeTargetPageWrapper.querySelector('.card-dialog__page-tab');
            const targetPanelId = `card-dialog-panel-${tabBtn.dataset.panel}`;
            const targetPanel = document.getElementById(targetPanelId);

            if (tabBtn.classList.contains('card-dialog__page-tab--active')) {
                const allPages = [...pagesContainer.querySelectorAll('.card-dialog__page')];
                const currentIndex = allPages.indexOf(activeTargetPageWrapper);
                const fallbackPage = allPages[currentIndex === 0 ? 1 : currentIndex - 1];
                const fallbackTab = fallbackPage.querySelector('.card-dialog__page-tab');
                setPanel(fallbackTab.dataset.panel);
            }

            activeTargetPageWrapper.remove();
            targetPanel?.remove();

            activeTargetPageWrapper = null;
            pageMenuPopover.hidePopover();

        } else if (action === 'rename') {
            pageMenuPopover.hidePopover();
            console.log("Pronto implementaremos el cambio de nombre aquí");
        }
    });
};

export { addPage };