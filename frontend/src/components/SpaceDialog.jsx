import { useState, useEffect, useRef } from "react";
import { saveSpace, updatePage, deletePage, createPage, createBlock, deleteBlock, reorderBlocks } from "../api";
import Block from "./Block";
import SpaceDialogSettings from "./SpaceDialogSettings";

const CARD_TEXT_COLORS = {
  "#f1f1f1": "var(--card-gray-text)",
  "#fdefee": "var(--card-red-text)",
  "#e6f2ff": "var(--card-blue-text)",
  "#e1fae7": "var(--card-green-text)",
  "#fcf5db": "var(--card-yellow-text)",
  "#efeaff": "var(--card-purple-text)",
};

const getCardTextColor = (color) => CARD_TEXT_COLORS[color] || "var(--color-text)";

function SpaceDialog({ space: activeSpace, onSpaceChange, onSaveSpace, onClose }) {
  const dialogRef = useRef(null);
  const pageMenuRef = useRef(null);
  const blockMenuElementRef = useRef(null);
  const isSavingRef = useRef(false);
  const dirtyBlockIdsRef = useRef(new Set());
  const isDirtyRef = useRef(false);
  const saveTimerRef = useRef(null);
  const defaultPage = activeSpace?.pages.at(-1);
  const [pageId, setPageId] = useState(defaultPage);
  const [activeTab, setActiveTab] = useState("editor");
  const [isSaving, setIsSaving] = useState(false);

  const [focusedBlockId, setFocusedBlockId] = useState(null);
  const [pageMenuTargetId, setPageMenuTargetId] = useState(null);
  const [blockMenuTarget, setBlockMenuTarget] = useState(null);
  const [savedColor, setSavedColor] = useState(activeSpace?.color || "#f1f1f1");

  const [userMode, setUserMode] = useState(
    localStorage.getItem("compact") === "true"
  );

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    dialog.classList.toggle("compact-mode", userMode);
    localStorage.setItem("compact", String(userMode));
  }, [userMode]);

  // Cuando el espacio activo cambia, actualizamos el pageId y abrimos/cerramos el diálogo según corresponda 
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeSpace) {
      // This effect intentionally resets editor state only when a different space opens.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSavedColor(activeSpace.color || "#f1f1f1");
      setPageId(defaultPage?.id);
      setFocusedBlockId(defaultPage?.blocks?.at(-1)?.id ?? null);
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSpace?.id]);

  useEffect(() => {
    const handleResize = () => {
      [
        "card-dialog-mobile-menu",
        "card-page-menu",
        "card-dialog-block-menu",
      ].forEach((popoverId) => {
        const popover = document.getElementById(popoverId);
        if (popover?.matches(":popover-open")) {
          popover.hidePopover();
        }
      });
      setBlockMenuTarget(null);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const persistSpace = async (space) => {
    setIsSaving(true);
    try {
      const blocks = space.pages
        .flatMap((page) => page.blocks || [])
        .filter((block) => dirtyBlockIdsRef.current.has(block.id));

      await saveSpace(space.id, {
        title: space.title,
        marker: space.marker,
        tag: space.tag,
        color: space.color,
        blocks,
      });
      dirtyBlockIdsRef.current.clear();
      isDirtyRef.current = false;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!activeSpace || !isDirtyRef.current) return undefined;

    saveTimerRef.current = window.setTimeout(() => {
      persistSpace(activeSpace).catch((err) => {
        console.error("Error en autosave:", err);
      });
    }, 800);

    return () => window.clearTimeout(saveTimerRef.current);
  }, [activeSpace]);

  if (!activeSpace) {
    return <dialog ref={dialogRef} id="card-dialog" onClose={onClose} />;
  }

  const activePage = activeSpace.pages?.find((page) => page.id === pageId);

  const closeMobileMenu = () => {
    const mobileMenu = document.getElementById("card-dialog-mobile-menu");
    if (mobileMenu?.matches(":popover-open")) {
      mobileMenu.hidePopover();
    }
  };

  const handleBlockChange = (pageId, blockId, newContent) => {
    isDirtyRef.current = true;
    dirtyBlockIdsRef.current.add(blockId);
    const spaceUpdated = {
      ...activeSpace,
      pages: activeSpace.pages.map((page) => {
        if (page.id !== pageId) return page;

        return {
          ...page,
          blocks: page.blocks.map((block) =>
            block.id === blockId ? { ...block, content: newContent } : block
          ),
        };
      }),
    };

    onSpaceChange(spaceUpdated);

  };

  const handleBlockTypeChange = (pageId, blockId, action, value, blockElement) => {
    if (action === "dismiss") {
      if (blockMenuTarget?.menu?.matches(":popover-open")) {
        blockMenuTarget.menu.hidePopover();
      }
      setBlockMenuTarget(null);
      return;
    }

    if (action === "command") {
      const menu = document.getElementById("card-dialog-block-menu");
      if (!menu || !blockElement) return;

      const rect = blockElement.getBoundingClientRect();
      menu.style.position = "fixed";
      menu.style.margin = "0";
      menu.style.top = `${rect.bottom + 8}px`;
      menu.style.left = `${rect.left}px`;
      blockMenuElementRef.current = blockElement;
      setBlockMenuTarget({ menu, pageId, blockId });
      if (!menu.matches(":popover-open")) menu.showPopover();
      return;
    }

    if (!action) return;
    isDirtyRef.current = true;
    const nextBlock = action === "checked" ? { checked: value } : { type: value };
    const updatedSpace = {
      ...activeSpace,
      pages: activeSpace.pages.map((page) => page.id !== pageId ? page : {
        ...page,
        blocks: page.blocks.map((block) => block.id === blockId ? { ...block, ...nextBlock } : block),
      }),
    };
    onSpaceChange(updatedSpace);
    dirtyBlockIdsRef.current.add(blockId);
  };

  const handleBlockMenuAction = (type) => {
    if (!blockMenuTarget) return;
    const { menu, pageId, blockId } = blockMenuTarget;
    const blockElement = blockMenuElementRef.current;
    const content = blockElement?.innerText || "";
    const contentWithoutCommand = content.replace(/\s*:[a-zA-Z]*$/, "");

    if (blockElement && content !== contentWithoutCommand) {
      blockElement.innerText = contentWithoutCommand;
      handleBlockChange(pageId, blockId, contentWithoutCommand);
    }

    handleBlockTypeChange(pageId, blockId, "type", type);
    menu.hidePopover();
    setBlockMenuTarget(null);

    requestAnimationFrame(() => {
      blockElement?.focus();
      if (!blockElement || typeof window.getSelection === "undefined") return;

      const range = document.createRange();
      range.selectNodeContents(blockElement);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });
  };

  const handleSaveAndClose = async () => {
    isSavingRef.current = true;
    window.clearTimeout(saveTimerRef.current);

    try {
      await persistSpace(activeSpace);

      const firstBlock = activeSpace.pages[0]?.blocks?.[0];
      dialogRef.current?.close();
      setSavedColor(activeSpace.color || "#f1f1f1");
      onSaveSpace({
        ...activeSpace,
        preview: firstBlock?.content || "",
      });
      dirtyBlockIdsRef.current.clear();
      isDirtyRef.current = false;
    } catch (err) {
      isSavingRef.current = false;
      console.error("Error guardando el espacio:", err);
    }
  };

  const handleSettingsSave = async () => {
    closeMobileMenu();
    setActiveTab("editor");
  };

  const handleCreatePage = async () => {
    try {
      const newPage = await createPage(activeSpace.id, {
        title: `Page ${activeSpace.pages.length + 1}`,
        emoji: "📄",
      });

      onSpaceChange({
        ...activeSpace,
        pages: [...activeSpace.pages, newPage],
      });
      setPageId(newPage.id);
      setActiveTab("editor");
      setFocusedBlockId(newPage.blocks?.[0]?.id ?? null);
    } catch (err) {
      console.error("Error creando la página:", err);
    }
  };

  const handleOpenPageMenu = (event, pageId) => {
    event.stopPropagation();
    setPageMenuTargetId(pageId);

    const menu = pageMenuRef.current;
    if (!menu) return;

    const rect = event.currentTarget.getBoundingClientRect();
    menu.style.position = "fixed";
    menu.style.margin = "0";
    menu.style.top = `${rect.bottom + 4}px`;
    menu.style.left = `${Math.max(8, rect.right - 150)}px`;

    if (!menu.matches(":popover-open")) {
      menu.showPopover();
    }
  };

  const handlePageMenuAction = async (action) => {
    const page = activeSpace.pages.find((item) => item.id === pageMenuTargetId);
    const closePageMenu = () => {
      pageMenuRef.current?.hidePopover();
      setPageMenuTargetId(null);
    };

    if (!page || action === "duplicate") {
      closePageMenu();
      return;
    }

    if (action === "rename") {
      const title = window.prompt("Rename the page", page.title || "");
      if (title === null) {
        closePageMenu();
        return;
      }

      try {
        const nextTitle = title.trim() || "Untitled";
        await updatePage(page.id, { title: nextTitle });
        onSpaceChange({
          ...activeSpace,
          pages: activeSpace.pages.map((item) =>
            item.id === page.id ? { ...item, title: nextTitle } : item
          ),
        });
      } catch (err) {
        console.error("Error renombrando la página:", err);
      }
    }

    if (action === "change-emoji") {
      const emoji = window.prompt("Type an emoji", page.emoji || "📄");
      if (emoji === null) {
        closePageMenu();
        return;
      }

      try {
        const nextEmoji = emoji.trim() || "📄";
        await updatePage(page.id, { emoji: nextEmoji });
        onSpaceChange({
          ...activeSpace,
          pages: activeSpace.pages.map((item) =>
            item.id === page.id ? { ...item, emoji: nextEmoji } : item
          ),
        });
      } catch (err) {
        console.error("Error cambiando el emoji:", err);
      }
    }

    if (action === "delete") {
      try {
        await deletePage(page.id);
        const remainingPages = activeSpace.pages.filter((item) => item.id !== page.id);
        onSpaceChange({ ...activeSpace, pages: remainingPages });
        if (page.id === pageId) {
          setPageId(remainingPages[0]?.id);
          setFocusedBlockId(null);
        }
      } catch (err) {
        console.error("Error eliminando la página:", err);
      }
    }

    closePageMenu();
  };

  // 1. Al crear un bloque nuevo (con Enter)
  const handleCreateBlock = async (pageId, currentBlockId) => {
    const activePage = activeSpace.pages.find((p) => p.id === pageId);
    if (!activePage) return;

    const currentIndex = activePage.blocks.findIndex((b) => b.id === currentBlockId);
    const targetPosition = currentIndex !== -1 ? currentIndex + 1 : activePage.blocks.length;

    try {
      // Creamos el bloque en el backend
      const newBlock = await createBlock(pageId, {
        type: "text",
        content: "",
        position: targetPosition
      });

      // Insertamos el bloque en la posición correcta en el estado local de React
      const updatedBlocks = [...activePage.blocks];
      if (currentIndex !== -1) {
        updatedBlocks.splice(currentIndex + 1, 0, newBlock);
      } else {
        updatedBlocks.push(newBlock);
      }

      // Actualizamos el estado local del espacio
      const updatedSpace = {
        ...activeSpace,
        pages: activeSpace.pages.map((p) =>
          p.id === pageId ? { ...p, blocks: updatedBlocks } : p
        )
      };
      onSpaceChange(updatedSpace);
      setFocusedBlockId(newBlock.id);

      // Sincronizamos las posiciones reales en la DB enviando el array completo de IDs
      const blockIdsOrder = updatedBlocks.map((b) => b.id);
      await reorderBlocks(pageId, { order: blockIdsOrder });

    } catch (err) {
      console.error("Error creating block:", err);
    }
  };

  const handleDeleteBlock = async (pageId, blockId) => {
    const activePage = activeSpace.pages.find((p) => p.id === pageId);
    if (!activePage || activePage.blocks.length <= 1) return; // Evitar borrar si es el único bloque

    const updatedBlocks = activePage.blocks.filter((b) => b.id !== blockId);
    const deletedIndex = activePage.blocks.findIndex((b) => b.id === blockId);
    const nextFocusBlock = updatedBlocks[Math.max(0, deletedIndex - 1)];

    const updatedSpace = {
      ...activeSpace,
      pages: activeSpace.pages.map((p) =>
        p.id === pageId ? { ...p, blocks: updatedBlocks } : p
      )
    };

    onSpaceChange(updatedSpace);
    if (nextFocusBlock) setFocusedBlockId(nextFocusBlock.id);

    try {
      await deleteBlock(blockId);
      // Sincronizamos las posiciones restantes con el backend
      const blockIdsOrder = updatedBlocks.map((b) => b.id);
      await reorderBlocks(pageId, { order: blockIdsOrder });
    } catch (err) {
      console.error("Error deleting block:", err);
    }
  };

  const handleCompactMode = (event) => {
    setUserMode(event.target.checked);
  };

  return (
    <dialog
      ref={dialogRef}
      id="card-dialog"
      aria-modal="true"
      aria-labelledby="card-dialog-title-input"
      closedby="any"
      onClose={() => {
        if (isSavingRef.current) {
          isSavingRef.current = false;
          return;
        }
        setBlockMenuTarget(null);
        onClose();
      }}
    >
      <div className="card-dialog__layout">
        {/* Botón flotante para Mobile */}
        {activeTab === "editor" && (
          <button
            type="button"
            className="card-dialog__menu"
            popoverTarget="card-dialog-mobile-menu"
            role="menuitem"
            style={{ backgroundColor: savedColor, color: getCardTextColor(savedColor) }}
          >
            <svg className="icon" aria-hidden="true" focusable="false">
              <use href="../assets/icons/sprite.svg#icon-menu"></use>
            </svg>
          </button>
        )}

        {/* Navegación Lateral */}
        <nav
          id="card-dialog-mobile-menu"
          className="card-dialog__nav"
          popover="auto"
          aria-label="Pages in this section"
        >
          <div className="card-dialog__nav-top">
            <button
              type="button"
              id="card-dialog-page-add"
              className="card-dialog__page-add"
              onClick={handleCreatePage}
            >
              <svg className="icon icon-add-page" aria-hidden="true" focusable="false">
                <use href="../assets/icons/sprite.svg#icon-add"></use>
              </svg>
              <span>Add page</span>
            </button>
          </div>

          <div
            id="card-dialog-pages"
            className="card-dialog__pages"
            role="tablist"
            aria-label="List of pages"
          >
            {activeSpace.pages?.map((page) => (
              <div key={page.id} className="card-dialog__page" role="presentation">
                <button
                  type="button"
                  className={`card-dialog__page-tab ${
                    activeTab === "editor" && page.id === pageId
                      ? "card-dialog__page-tab--active"
                      : ""
                  }`}
                  role="tab"
                  aria-selected={activeTab === "editor" && page.id === pageId}
                  onClick={() => {
                    closeMobileMenu();
                    setPageId(page.id);
                    setActiveTab("editor");
                  }}
                >
                  <span className="card-dialog__page-emoji">{page.emoji}</span>
                  <span className="card-dialog__page-label">{page.title}</span>
                </button>
                <button
                  type="button"
                  className="card-dialog__page-menu"
                  aria-label="Page Actions"
                  aria-controls="card-page-menu"
                  onClick={(event) => handleOpenPageMenu(event, page.id)}
                >
                  <svg className="icon" aria-hidden="true" focusable="false">
                    <use href="../assets/icons/sprite.svg#icon-more-vert"></use>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="card-dialog__nav-bottom">
            <button
              type="button"
              id="card-dialog-tab-config"
              className={`card-dialog__page-tab ${
                activeTab === "settings" ? "card-dialog__page-tab--active" : ""
              }`}
              role="tab"
              aria-selected={activeTab === "settings"}
              onClick={() => {
                closeMobileMenu();
                setActiveTab("settings");
              }}
            >
              <svg className="icon" aria-hidden="true" focusable="false">
                <use href="../assets/icons/sprite.svg#icon-settings"></use>
              </svg>
              <span>Settings</span>
            </button>
          </div>
        </nav>

        <div ref={pageMenuRef} id="card-page-menu" popover="auto" className="note-card__menu-panel" role="menu" aria-label="Acciones de la página">
          <button type="button" className="note-card__menu-item page" role="menuitem" data-action="rename" onClick={() => handlePageMenuAction("rename")}>
                <svg className="icon menu-item" aria-hidden="true" focusable="false">
                    <use href="../assets/icons/sprite.svg#icon-edit"></use>
                </svg>
                Rename
            </button>
            <button type="button" className="note-card__menu-item page" role="menuitem" data-action="duplicate">
                <svg className="icon menu-item" aria-hidden="true" focusable="false">
                    <use href="../assets/icons/sprite.svg#icon-copy"></use>
                </svg>
                Duplicate
            </button>
            <button type="button" className="note-card__menu-item page" role="menuitem" data-action="change-emoji" onClick={() => handlePageMenuAction("change-emoji")}>
                <svg className="icon menu-item" aria-hidden="true" focusable="false">
                    <use href="../assets/icons/sprite.svg#icon-add-reaction"></use>
                </svg>
                Change Emoji
            </button>
            <button type="button" className="note-card__menu-item note-card__delete page" role="menuitem" data-action="delete" onClick={() => handlePageMenuAction("delete")}>
                <svg className="icon menu-item" aria-hidden="true" focusable="false">
                    <use href="../assets/icons/sprite.svg#icon-trash-can"></use>
                </svg>
                Delete
            </button>
        </div>

        {/* Panel Principal */}
        <div className="card-dialog__main">

          <header className="card-dialog__header">
            {activeTab === "editor" ? (
              <>
                <label className="visually-hidden" htmlFor="card-dialog-title-input">
                  Untitled
                </label>
                <input
                  id="card-dialog-title-input"
                  className="card-dialog__title-input"
                  type="text"
                  placeholder="Untitled"
                  maxLength={80}
                  autoComplete="off"
                  value={activeSpace.title || ""}
                  onChange={(e) => {
                    isDirtyRef.current = true;
                    onSpaceChange({ ...activeSpace, title: e.target.value });
                  }}
                />

                <button
                  type="button"
                  id="card-dialog-close"
                  className="card-dialog__save"
                  aria-label="Save and close"
                  disabled={isSaving}
                  onClick={handleSaveAndClose}
                >
                  {isSaving ? "..." : "💾"} <span className="hidden card-dialog__save--text">Save and close</span>
                </button> 
              </>) : ( <h2>Settings</h2> ) }
          </header>

          {activeTab === "editor" ? (
            <main
              id="card-dialog-panel-content"
              className="card-dialog__canvas card-dialog__panel card-dialog__panel--active"
              role="tabpanel"
              tabIndex={0}
            >
              <div id="space-blocks-container" className="card-dialog__editor">
                {activePage?.blocks.map((block) => (
                  <Block
                    key={block.id}
                    block={block}
                    onEnter={() => {handleCreateBlock(activePage.id, block.id)}}
                    onChange={(newContent) => handleBlockChange(activePage.id, block.id, newContent) }
                    onTypeChange={(action, value, element) => handleBlockTypeChange(activePage.id, block.id, action, value, element)}
                    onDelete={() => handleDeleteBlock(activePage.id, block.id)}
                    shouldFocus={block.id === focusedBlockId}
                  />
                ))}
              </div>
            </main>
          ) : (
            <SpaceDialogSettings space={activeSpace} onUpdateSpace={(updatedSpace) => {
              isDirtyRef.current = true;
              onSpaceChange(updatedSpace);
            }} onSave={handleSettingsSave} onClose={() => setActiveTab("editor")} compactMode={userMode} onCompactModeChange={handleCompactMode}/>
          )}
        </div>

        <div id="card-dialog-block-menu" popover="auto" className="card-dialog__block-menu" role="menu" aria-label="Block type">
          <button type="button" className="card-dialog__block-menu-item" data-block="text" role="menuitem" onClick={() => handleBlockMenuAction("text")}><span>✏️</span> Normal Text</button>
          <button type="button" className="card-dialog__block-menu-item" data-block="heading" role="menuitem" onClick={() => handleBlockMenuAction("heading")}> 
            <svg className="icon" aria-hidden="true" focusable="false">
              <use href="../assets/icons/sprite.svg#icon-title"></use>
            </svg>
            Title
          </button>
          <button type="button" className="card-dialog__block-menu-item" data-block="subheading" role="menuitem" onClick={() => handleBlockMenuAction("subheading")}>
            <svg className="icon" aria-hidden="true" focusable="false">
              <use href="../assets/icons/sprite.svg#icon-subtitle"></use>
            </svg>
            Subtitle
          </button>
          <button type="button" className="card-dialog__block-menu-item" data-block="task" role="menuitem" onClick={() => handleBlockMenuAction("task")}>
            <svg className="icon" aria-hidden="true" focusable="false">
              <use href="../assets/icons/sprite.svg#icon-task"></use>
            </svg>
            Task
            </button>
        </div>
      </div>
    </dialog>
  );
}

export default SpaceDialog;