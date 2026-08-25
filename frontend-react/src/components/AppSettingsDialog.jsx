import { useEffect, useRef } from 'react';

function AppSettingsDialog({ isOpen, onClose }) {
    const settingsDialogRef = useRef(null);

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
                    <div className="color-theme-picker" role="radiogroup" aria-labelledby="card-dialog-bg-label">
                        <button type="button" className="color-picker__option color-picker__option--selected" data-color="#fff" data-theme="light" style={{ backgroundColor: '#ddd' }} role="radio" aria-checked="true" aria-label="Light Mode"></button>

                        <button type="button" className="color-picker__option" data-color="#222" data-theme="dark" style={{ backgroundColor: '#222' }} role="radio" aria-checked="false" aria-label="Dark Mode"></button>
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