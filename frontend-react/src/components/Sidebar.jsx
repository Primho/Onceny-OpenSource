function Sidebar() {
    return (
    <aside id="app-sidebar" className="sidebar" aria-label="Navegación lateral">
        <div className="sidebar__profile">
            <img src="../assets/Primh.png" alt="" className="sidebar__profile-img" width="50" height="50"
                decoding="async" />
            <div className="sidebar__profile-info">
                <span className="sidebar__profile-name">Kevin Parra</span>
                <span className="sidebar__profile-email">kevin@example.com</span>
            </div>
        </div>

        <nav className="sidebar__nav" aria-label="Principal menu">
            <ul className="sidebar__nav-list">
                <li className="sidebar__nav-item">
                    <a href="index.html" className="sidebar__nav-link">
                        <svg className="icon" aria-hidden="true" focusable="false">
                            <use href="../assets/icons/sprite.svg#icon-home"></use>
                        </svg>
                        <span className="sidebar__nav-text">Home</span>
                    </a>
                </li>
                <li className="sidebar__nav-item sidebar__nav-item--active">
                    <a href="#" className="sidebar__nav-link" aria-current="page">
                        <svg className="icon" aria-hidden="true" focusable="false">
                            <use href="../assets/icons/sprite.svg#icon-space-dashboard"></use>
                        </svg>
                        <span className="sidebar__nav-text">Spaces</span>
                    </a>
                </li>
                <li class="sidebar__nav-item">
                    <a href="#" className="sidebar__nav-link">
                        <svg className="icon" aria-hidden="true" focusable="false">
                            <use href="../assets/icons/sprite.svg#icon-favorite"></use>
                        </svg>
                        <span className="sidebar__nav-text">Favorites</span>
                    </a>
                </li>
                <li class="sidebar__nav-item">
                    <a href="#" className="sidebar__nav-link">
                        <svg className="icon" aria-hidden="true" focusable="false">
                            <use href="../assets/icons/sprite.svg#icon-folder"></use>
                        </svg>
                        <span className="sidebar__nav-text">Folders</span>
                    </a>
                </li>
                <li class="sidebar__nav-item">
                    <a href="#" class="sidebar__nav-link">
                        <svg className="icon" aria-hidden="true" focusable="false">
                            <use href="../assets/icons/sprite.svg#icon-share"></use>
                        </svg>
                        <span className="sidebar__nav-text">Shared</span>
                    </a>
                </li>
            </ul>
        </nav>

        <div className="sidebar__settings">
            <ul className="sidebar__settings-list">
                <li class="sidebar__settings-item">
                    <a href="#" role="button" aria-haspopup="dialog" className="sidebar__settings-link" >
                        <svg className="icon sidebar__settings-icon" aria-hidden="true" focusable="false">
                            <use href="../assets/icons/sprite.svg#icon-settings"></use>
                        </svg>
                        <span>Settings</span>
                    </a>
                </li>
            </ul>
        </div>
    </aside>
    );
}

export default Sidebar;