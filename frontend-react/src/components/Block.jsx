import { useEffect, useRef } from "react";

export default function Block({ block, onChange }) {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.textContent = block.content || ""
        }
    }, [block.id])
    return (
        <div className="editor-block-wrapper" data-block-id={`default-${block.id}`}>
            <div
                ref={ref}
                className="editor-block editor-block--text"
                aria-placeholder="Type your content here or use ':' for commands..."
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => onChange(e.currentTarget.textContent)}
            />
        </div>
    )
};