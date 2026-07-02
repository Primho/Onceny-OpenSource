/**
 * Crea un nuevo bloque de editor y lo inserta de manera segura en el DOM.
 * @param {HTMLElement} currentWrapper - Contenedor del bloque desde donde se pulsó Enter.
 */
const createNewBlock = (currentWrapper) => {
    if (!currentWrapper) {
        console.error("createNewBlock: No se proporcionó un wrapper de origen válido.");
        return;
    }

    const newWrapper = document.createElement('div');
    newWrapper.classList.add('editor-block-wrapper');
    
    newWrapper.dataset.blockId = `block-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const newBlock = document.createElement('div');
    newBlock.classList.add('editor-block', 'editor-block--text');
    newBlock.contentEditable = "true";
    
    const placeholderText = "Type your content here or use ':' for commands...";
    newBlock.setAttribute('placeholder', placeholderText); 
    newBlock.setAttribute('aria-placeholder', placeholderText); 
    newBlock.setAttribute('role', 'textbox'); 

    newWrapper.appendChild(newBlock);
    currentWrapper.after(newWrapper);

    newBlock.focus();
};

export { createNewBlock };