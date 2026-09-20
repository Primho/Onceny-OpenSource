function Header({ onCreateSpace, isCreating }) {
    return (
        <header className="workspace__header">
            <div className="workspace__heading">
                <h1 id="workspace-title" className="workspace__title">Workspace</h1>
                <p className="workspace__subtitle">Your spaces and notes all in one place</p>
            </div>

            <div className="workspace__actions">
                <button type="button" popoverTarget="workspace-create-menu"
                    className="workspace__btn workspace__btn--primary" id="workspace-create-trigger"
                    aria-haspopup="menu" aria-controls="workspace-create-menu"
                    aria-busy={isCreating}
                    disabled={isCreating}
                    aria-label="Create a new space">
                    <svg className="icon" aria-hidden="true" focusable="false">
                        <use href="../assets/icons/sprite.svg#icon-add"></use>
                    </svg>
                    <span className="hidden-text-btn">{isCreating ? "Creating..." : "New Space"}</span>
                </button>

                <div id="workspace-create-menu" popover="auto" className="workspace__menu" role="menu"
                    aria-label="Type of space to be created">
                    <button type="button" className="workspace__menu-item" role="menuitem" onClick={() => onCreateSpace("normal")}>
                        📄 Space
                    </button>
                    <button type="button" className="workspace__menu-item" role="menuitem" onClick={() => onCreateSpace("temporal")}>
                        ⏳ Temporal Space
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header;