import { useState } from "react";
import { NavLink } from "react-router-dom";
import AppSettingsDialog from "./AppSettingsDialog";

function Sidebar({ user }) {

    const [showSettings, setShowSettings] = useState(false);

    const handleLink = (isActive) => {
        if (isActive === true) {
            return "sidebar__nav-link sidebar__nav-link--active"
        } else {
            return "sidebar__nav-link"
        }
    }


    return (
    <aside id="app-sidebar" className="sidebar" aria-label="Navegación lateral">
        <div className="sidebar__profile">
            <img src="../assets/Primh.png" alt="" className="sidebar__profile-img" width="50" height="50"
                decoding="async" />
            <div className="sidebar__profile-info">
                <span className="sidebar__profile-name">{user.username}</span>
                <span className="sidebar__profile-email">{user.email}</span>
            </div>
        </div>

        <nav className="sidebar__nav" aria-label="Principal menu">
            <ul className="sidebar__nav-list">
                <li className="sidebar__nav-item">
                    <NavLink to="/app/" end className={({ isActive }) => handleLink(isActive)}>
                        <svg className="icon" aria-hidden="true" focusable="false">
                            <use href="../assets/icons/sprite.svg#icon-home"></use>
                        </svg>
                        <span className="sidebar__nav-text">Home</span>
                    </NavLink>
                </li>
                <li className="sidebar__nav-item ">
                    <NavLink to="/app/spaces" className={({ isActive }) => handleLink(isActive)} aria-current="page">
                        <svg className="icon" aria-hidden="true" focusable="false">
                            <use href="../assets/icons/sprite.svg#icon-space-dashboard"></use>
                        </svg>
                        <span className="sidebar__nav-text">Spaces</span>
                    </NavLink>
                </li>
                <li className="sidebar__nav-item">
                    <NavLink to="/app/favorites" className={({ isActive }) => handleLink(isActive)}>
                        <svg className="icon" aria-hidden="true" focusable="false">
                            <use href="../assets/icons/sprite.svg#icon-favorite"></use>
                        </svg>
                        <span className="sidebar__nav-text">Favorites</span>
                    </NavLink>
                </li>
                <li className="sidebar__nav-item">
                    <NavLink to="/app/folders" className={({ isActive }) => handleLink(isActive)}>
                        <svg className="icon" aria-hidden="true" focusable="false">
                            <use href="../assets/icons/sprite.svg#icon-folder"></use>
                        </svg>
                        <span className="sidebar__nav-text">Folders</span>
                    </NavLink>
                </li>
                <li className="sidebar__nav-item">
                    <NavLink to="/app/shared" className={({ isActive }) => handleLink(isActive)}>
                        <svg className="icon" aria-hidden="true" focusable="false">
                            <use href="../assets/icons/sprite.svg#icon-share"></use>
                        </svg>
                        <span className="sidebar__nav-text">Shared</span>
                    </NavLink>
                </li>
            </ul>
        </nav>

        <div className="sidebar__settings">
            <ul className="sidebar__settings-list">
                <button className="sidebar__settings-item sidebar__settings-link sidebar__settings-btn" onClick={() => setShowSettings(true)}>
                    <svg className="icon sidebar__settings-icon" aria-hidden="true" focusable="false">
                        <use href="../assets/icons/sprite.svg#icon-settings"></use>
                    </svg>
                    <span className="sidebar__nav-text">Settings</span>
                </button>
            </ul>
        </div>

        <AppSettingsDialog
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
        />
    </aside>
    );
}

export default Sidebar;