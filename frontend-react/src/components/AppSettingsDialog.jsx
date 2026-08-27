import { useEffect, useRef, useState } from 'react';

function AppSettingsDialog({ isOpen, onClose }) {
    const settingsDialogRef = useRef(null);
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const dialog = settingsDialogRef.current;

        if (!dialog) return;

        if (isOpen && !dialog.open) {
            dialog.showModal();
        }

        if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);


    return (
        <dialog ref={settingsDialogRef} id="settings-dialog" closedby="any" aria-labelledby="dialog-settings" aria-describedby="dialog-settings" onClose={onClose}>
            <h2>Settings</h2>
            <fieldset className="card-dialog__config-section">
                <legend>🖍️ Theme</legend>
                <p className="card-dialog__config-desc">Chosse your favorite theme.</p>
                <div className="card-dialog__field">
                    <div className="color-theme-picker" role="radiogroup" aria-label="Theme">
                        <button
                            type="button"
                            className={`color-picker__option ${theme === 'light' ? 'color-picker__option--selected' : ''}`}
                            data-theme="light"
                            style={{ backgroundColor: '#ddd' }}
                            role="radio"
                            aria-checked={theme === 'light'}
                            aria-label="Light Mode"
                            onClick={() => setTheme('light')}
                        ></button>

                        <button
                            type="button"
                            className={`color-picker__option ${theme === 'dark' ? 'color-picker__option--selected' : ''}`}
                            data-theme="dark"
                            style={{ backgroundColor: '#222' }}
                            role="radio"
                            aria-checked={theme === 'dark'}
                            aria-label="Dark Mode"
                            onClick={() => setTheme('dark')}
                        ></button>
                    </div>
                </div> 
            </fieldset>

            <footer className="settings-dialog__config-actions">
                <button type="button" className="settings-dialog__config-btn settings-dialog__config-btn--primary" data-action="config-save" onClick={onClose}>
                    ok
                </button>
            </footer>
        </dialog>
    )
}

export default AppSettingsDialog;