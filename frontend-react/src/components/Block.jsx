import { useEffect, useRef } from "react";

export default function Block({ block, onEnter, onChange, onTypeChange, shouldFocus, onDelete }) {
    const ref = useRef(null);

   // 1. Sincronizar el contenido
   useEffect(() => {
        if (ref.current && ref.current.innerText !== block.content) {
            ref.current.innerText = block.content || '';
        }
    }, [block.content]);

    // 2. Efecto exclusivo para manejar el foco automático del bloque nuevo
    useEffect(() => {
        if (shouldFocus && ref.current) {
            const el = ref.current;
            
            // Usamos requestAnimationFrame para asegurar que el navegador posicione el cursor
            // después de que se completen los eventos por defecto de la tecla presionado.
            requestAnimationFrame(() => {
                el.focus();

                if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
                    const range = document.createRange();
                    range.selectNodeContents(el);
                    range.collapse(false); // 'false' colapsa la selección exactamente al final del texto
                    
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            });
        }
    }, [shouldFocus]);

    const handleInput = (event) => {
        const content = event.currentTarget.innerText;
        onChange(content);

        if (/(?:^|\s):[a-zA-Z]*$/.test(content)) {
            onTypeChange?.("command", null, ref.current);
        } else {
            onTypeChange?.("dismiss", null, ref.current);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                console.log('Mismo bloque (Shift + Enter)');
            } else {
                event.preventDefault();
                if (onEnter) { onEnter(); }
            }
        }

        if (event.key === 'Backspace' || event.key === 'Delete') {
            const content = ref.current ? ref.current.textContent : '';
            
            // Solo borramos el bloque completo si no contiene caracteres o espacios
            if (content.length === 0) {
                event.preventDefault();
                if (onDelete) { 
                    onDelete(); 
                }
            }
        }
    }

    return (
        <div
            className={`editor-block-wrapper ${block.type === "task" ? "editor-block-wrapper--task" : ""}`}
            data-block-id={`default-${block.id}`}
        >
            {block.type === "task" && (
                <input
                    type="checkbox"
                    className="editor-block__task-checkbox"
                    checked={block.checked}
                    onChange={(event) => onTypeChange?.("checked", event.target.checked)}
                    aria-label="Mark task as complete"
                />
            )}
            <div
                ref={ref}
                className={`editor-block editor-block--${block.type || "text"}`}
                placeholder="Type your content here or use ':' for commands..."
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
};