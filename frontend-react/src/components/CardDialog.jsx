import { useState, useEffect, useRef } from "react";
import { updateCard, updateBlock } from "../api";
import Block from "./Block";
import CardDialogSettings from "./CardDialogSettings";

function CardDialog({ card: activeCard, onSpaceChange, onClose }) {
  const dialogRef = useRef(null);
  const defaultPage = activeCard?.pages[0]?.id;
  const [pageId, setPageId] = useState(defaultPage);
  const saveTimers = useRef({});
  const [activeTab, setActiveTab] = useState("editor");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeCard) {
      setPageId(defaultPage);
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [activeCard?.id]);

  useEffect(() => {
    return () => {
      Object.values(saveTimers.current).forEach(clearTimeout);
    };
  }, []);

  if (!activeCard) return null;

  const activePage = activeCard.pages?.find((page) => page.id === pageId);

  const handleBlockChange = (pageId, blockId, newContent) => {
    const spaceUpdated = {
      ...activeCard,
      pages: activeCard.pages.map((page) => {
        if (page.id !== pageId) return page;

        return {
          ...page,
          blocks: page.blocks.map((block) => {
            if (block.id !== blockId) return block;
            return {
              ...block,
              content: newContent,
            };
          }),
        };
      }),
    };
    onSpaceChange(spaceUpdated);

    clearTimeout(saveTimers.current[blockId]);
    saveTimers.current[blockId] = setTimeout(() => {
      updateBlock(blockId, { content: newContent });
    }, 500);
  };

  const handleSaveAndClose = async () => {
    await updateCard(activeCard.id, {
        title: activeCard.title
    });

    onClose();
  };

  const handleSettingsSave = async () => {
    await updateCard(activeCard.id, {
        marker: activeCard.marker,
        tag: activeCard.tag,
        color: activeCard.color
    });

    setActiveTab("editor");
  };

  return (
    <dialog
      ref={dialogRef}
      id="card-dialog"
      aria-modal="true"
      aria-labelledby="card-dialog-title-input"
      closedby="any"
      onClose={onClose}
    >
      <div className="card-dialog__layout">
        {/* Botón flotante para Mobile */}
        <button
          type="button"
          className="card-dialog__menu"
          popovertarget="card-dialog-mobile-menu"
          role="menuitem"
        >
          <svg className="icon" aria-hidden="true" focusable="false">
            <use href="../assets/icons/sprite.svg#icon-menu"></use>
          </svg>
        </button>

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
            {activeCard.pages?.map((page) => (
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
                  title="Coming soon"
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
              onClick={() => setActiveTab("settings")}
            >
              <svg className="icon" aria-hidden="true" focusable="false">
                <use href="../assets/icons/sprite.svg#icon-settings"></use>
              </svg>
              <span>Settings</span>
            </button>
          </div>
        </nav>

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
                  value={activeCard.title || ""}
                  onChange={(e) => {
                    onSpaceChange({ ...activeCard, title: e.target.value });
                  }}
                />

                <button
                  type="button"
                  id="card-dialog-close"
                  className="card-dialog__save"
                  aria-label="Save and close"
                  onClick={handleSaveAndClose}
                >
                  💾 <span className="hidden">Save and close</span>
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
                    onChange={(newContent) =>
                      handleBlockChange(activePage.id, block.id, newContent)
                    }
                  />
                ))}
              </div>
            </main>
          ) : (
            <CardDialogSettings card={activeCard} onUpdateSpace={onSpaceChange} onSave={handleSettingsSave}/>
          )}
        </div>
      </div>
    </dialog>
  );
}

export default CardDialog;