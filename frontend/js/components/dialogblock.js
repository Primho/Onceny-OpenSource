const createNewBlock = (currentWrapper) => {
    // creamos el bloque en la memoria
    const newWrapper = document.createElement('div');
    newWrapper.classList.add('editor-block-wrapper');
    // Generamos un ID unico temporal basado en la fecha exacta
    newWrapper.dataset.blockId = `block-${Date.now()}`;

    // creamos el bloque editable interno
    const newBlock = document.createElement('div');
    newBlock.classList.add('editor-block', 'editor-block--text');
    newBlock.contentEditable = "true";
    newBlock.setAttribute('placeholder', "Type your content here or use ':' for commands...");

    // insertamos el bloque editable en el wrapper
    newWrapper.appendChild(newBlock);

    currentWrapper.after(newWrapper);

    newBlock.focus();
}

export { createNewBlock };