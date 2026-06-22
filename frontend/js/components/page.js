// page.js

const addPage = (pageAddBtn, pagesContainer, setPanel) => {
    let pageCount = 1;
    const pageMenuPopover = document.querySelector('#card-page-menu');
    let activeTargetPageWrapper = null; // Guardará la referencia de la página que abrió el menú

    // Función auxiliar para inicializar eventos en una página (tanto iniciales como nuevas)
    const setupPageEvents = (pageWrapper) => {
        const tabBtn = pageWrapper.querySelector('.card-dialog__page-tab');
        const menuBtn = pageWrapper.querySelector('.card-dialog__page-menu');

        // Evento para cambiar de pestaña
        tabBtn?.addEventListener('click', () => {
            setPanel(tabBtn.dataset.panel);
        });

        // Evento para abrir el popover de opciones de la página
        menuBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            activeTargetPageWrapper = pageWrapper; // Guardamos cuál página se está gestionando

            // Posicionamos el popover justo donde está el botón de tres puntos
            const rect = menuBtn.getBoundingClientRect();
            pageMenuPopover.style.position = 'fixed';
            pageMenuPopover.style.margin = '0';
            pageMenuPopover.style.top = `${rect.bottom + 4}px`;
            pageMenuPopover.style.left = `${rect.left - 80}px`; // Ajuste a la izquierda para que no se corte

            if (!pageMenuPopover.matches(':popover-open')) {
                pageMenuPopover.showPopover();
            }
        });
    };

    // 1. Vincular eventos a las páginas que ya existan por defecto en el DOM al cargar
    const initialPages = pagesContainer.querySelectorAll('.card-dialog__page');
    initialPages.forEach(page => setupPageEvents(page));

    // 2. Lógica para añadir una nueva página
    pageAddBtn?.addEventListener('click', () => {
        pageCount++;
        const newPageId = `page-${Date.now()}`;
    
        const newPageHTML = `
            <div class="card-dialog__page" role="presentation">
                <button type="button" class="card-dialog__page-tab"
                    role="tab" aria-selected="false"
                    aria-controls="card-dialog-panel-content" data-panel="${newPageId}">
                    <svg class="icon" aria-hidden="true" focusable="false">
                        <use href="../assets/icons/sprite.svg#icon-document"></use>
                    </svg>
                    <span class="card-dialog__page-label">Page ${pageCount}</span>
                </button>
                <button type="button" class="card-dialog__page-menu" aria-label="Page Actions">
                    <svg class="icon" aria-hidden="true" focusable="false">
                        <use href="../assets/icons/sprite.svg#icon-more-vert"></use>
                    </svg>
                </button>
            </div>
        `;
    
        pagesContainer.insertAdjacentHTML('beforeend', newPageHTML);
    
        // Obtenemos la última página añadida y le asociamos sus eventos
        const allPages = pagesContainer.querySelectorAll('.card-dialog__page');
        const newlyAddedPage = allPages[allPages.length - 1];
        setupPageEvents(newlyAddedPage);

        // Opcional: Auto-seleccionar la página recién creada
        const newTab = newlyAddedPage.querySelector('.card-dialog__page-tab');
        setPanel(newTab.dataset.panel);
    });

    // 3. Manejar las acciones dentro del Popover (Eliminar y Renombrar)
    pageMenuPopover?.addEventListener('click', (e) => {
        const item = e.target.closest('.note-card__menu-item');
        if (!item || !activeTargetPageWrapper) return;

        const action = item.dataset.action;

        if (action === 'delete') {
            // Validamos que no sea la última página existente para no romper la interfaz
            const totalPages = pagesContainer.querySelectorAll('.card-dialog__page').length;
            if (totalPages <= 1) {
                alert("¡No puedes eliminar todas las páginas! Al menos debe quedar una activa.");
                pageMenuPopover.hidePopover();
                return;
            }

            // Si la página que eliminamos estaba activa, cambiamos el foco a otra antes de borrarla
            const tabBtn = activeTargetPageWrapper.querySelector('.card-dialog__page-tab');
            if (tabBtn.classList.contains('card-dialog__page-tab--active')) {
                const allPages = [...pagesContainer.querySelectorAll('.card-dialog__page')];
                const currentIndex = allPages.indexOf(activeTargetPageWrapper);
                // Buscamos la página anterior, o la siguiente si era la primera
                const fallbackPage = allPages[currentIndex === 0 ? 1 : currentIndex - 1];
                const fallbackTab = fallbackPage.querySelector('.card-dialog__page-tab');
                setPanel(fallbackTab.dataset.panel);
            }

            // Eliminamos del DOM
            activeTargetPageWrapper.remove();
            activeTargetPageWrapper = null;
            pageMenuPopover.hidePopover();

        } else if (action === 'rename') {
            // Dejado como gancho para el siguiente paso, cerramos el popover por ahora
            pageMenuPopover.hidePopover();
            console.log("Pronto implementaremos el cambio de nombre aquí");
        }
    });
};

export { addPage };
