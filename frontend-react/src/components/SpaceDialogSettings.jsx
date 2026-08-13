import { useState, useRef } from 'react';

export function InterruptorEjemplo() {
  return (
    <input useRef={toggleRef} type="checkbox" className="compact-toggle" onChange={handleCompactMode} />
  )
}


function SpaceDialogSettings({ space, onUpdateSpace, onSave, onClick }) {
  
  // DIALOG SETTINGS COMPACT MODE
  const [userMode, setUserMode] = useState(localStorage.getItem("compact"));
  const toggleRef = useRef(null);

  const handleCompactMode = () => {
    console.log(toggleRef.current);
  }

  return (
      <section
        id="card-dialog-panel-config"
        className="card-dialog__panel card-dialog__panel--active"
        role="tabpanel"
        tabIndex={0}
        aria-labelledby="card-dialog-tab-config"
      >
        <div className="card-dialog__config">
          {/* Sección: Apariencia */}
          <fieldset className="card-dialog__config-section">
            <legend>🎨 Appearance</legend>
            <p className="card-dialog__config-desc">
              Customize the background and highlight color for this Space.
            </p>
  
            <div className="card-dialog__field">
              <span className="card-dialog__field-label" id="card-dialog-bg-label">
                Background color
              </span>
              <div
                className="color-picker"
                role="radiogroup"
                aria-labelledby="card-dialog-bg-label"
              >
                <button
                  type="button"
                  className={`color-picker__option ${
                    space.color === "#f1f1f1"
                      ? "color-picker__option--selected"
                      : ""
                  }`}
                  data-color="#f1f1f1"
                  data-theme="gray"
                  style={{ backgroundColor: "#787878" }}
                  role="radio"
                  aria-checked="true"
                  aria-label="Grey"
                  onClick={() => {
                    onUpdateSpace({
                      ...space,
                      color: "#f1f1f1"
                    })
                    }
                  }
                ></button>
                <button
                  type="button"
                  className={`color-picker__option ${
                    space.color === "#fdefee"
                      ? "color-picker__option--selected"
                      : ""
                  }`}
                  data-color="#fdefee"
                  data-theme="red"
                  style={{ backgroundColor: "#ed6b5a" }}
                  role="radio"
                  aria-checked="false"
                  aria-label="Red"
                  onClick={() => {
                    onUpdateSpace({
                      ...space,
                      color: "#fdefee"
                    })
                    }
                  }
                ></button>
                <button
                  type="button"
                  className={`color-picker__option ${
                    space.color === "#e6f2ff"
                      ? "color-picker__option--selected"
                      : ""
                  }`}
                  data-color="#e6f2ff"
                  data-theme="blue"
                  style={{ backgroundColor: "#038cff" }}
                  role="radio"
                  aria-checked="false"
                  aria-label="Blue"
                  onClick={() => {
                    onUpdateSpace({
                      ...space,
                      color: "#e6f2ff"
                    })
                    }
                  }
                ></button>
                <button
                  type="button"
                  className={`color-picker__option ${
                    space.color === "#e1fae7"
                      ? "color-picker__option--selected"
                      : ""
                  }`}
                  data-color="#e1fae7"
                  data-theme="green"
                  style={{ backgroundColor: "#36c25c" }}
                  role="radio"
                  aria-checked="false"
                  aria-label="Green"
                  onClick={() => {
                    onUpdateSpace({
                      ...space,
                      color: "#e1fae7"
                    })
                    }
                  }
                ></button>
                <button
                  type="button"
                  className={`color-picker__option ${
                    space.color === "#fcf5db"
                      ? "color-picker__option--selected"
                      : ""
                  }`}
                  data-color="#fcf5db"
                  data-theme="yellow"
                  style={{ backgroundColor: "#e6961f" }}
                  role="radio"
                  aria-checked="false"
                  aria-label="Yellow"
                  onClick={() => {
                    onUpdateSpace({
                      ...space,
                      color: "#fcf5db"
                    })
                  }
                  }
                ></button>
                <button
                  type="button"
                  className={`color-picker__option ${
                    space.color === "#efeaff"
                      ? "color-picker__option--selected"
                      : ""
                  }`}
                  data-color="#efeaff"
                  data-theme="purple"
                  style={{ backgroundColor: "#6d3cfa" }}
                  role="radio"
                  aria-checked="false"
                  aria-label="Purple"
                  onClick={() => {
                    onUpdateSpace({
                      ...space,
                      color: "#efeaff"
                    })
                  }
                  }
                ></button>
              </div>
            </div>
  
            <div className="card-dialog__field-row">
              <div className="card-dialog__field">
                <label htmlFor="card-dialog-marker">Marker</label>
                <input
                  value={space.marker || ''}
                  type="text"
                  id="card-dialog-marker"
                  maxLength={2}
                  className="card-dialog__input"
                  placeholder="📌"
                  name="marker"
                  inputMode="text"
                  onChange={(evnt) => {
                    onUpdateSpace({
                      ...space,
                      marker: evnt.target.value
                    })
                  }}
                />
              </div>
              <div className="card-dialog__field">
                <label htmlFor="card-dialog-tags">Tags</label>
                <input
                  value={space.tag || ''}
                  type="text"
                  id="card-dialog-tags"
                  className="card-dialog__input"
                  placeholder="Personal"
                  name="tag"
                  onChange={(evnt) => {
                    onUpdateSpace({
                      ...space,
                      tag: evnt.target.value
                    })
                  }}
                />
              </div>
            </div>
  
            <div className="card-dialog__field-mode" aria-label="compact mode">
              <p className="card-dialog__config-desc">Layout.</p>
              <div className="card-dialog__shared-item">
                <div className="card-dialog__shared-body">
                  <svg className="icon" aria-hidden="true" focusable="false">
                    <use href="../assets/icons/sprite.svg#icon-fullscreen"></use>
                  </svg>
                  <div className="card-dialog__shared-meta">
                    <strong className="card-dialog__shared-name">Compact Mode</strong>
                    <span className="card-dialog__shared-role">
                      The space occupies the entire screen and is no longer displayed as a window.
                    </span>
                  </div>
                </div>
                <label className="switch">
                  
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </fieldset>
  
          {/* Sección: Compartidos */}
          <fieldset className="card-dialog__config-section">
            <legend>👥 Shared with</legend>
            <p className="card-dialog__config-desc">People with access to this space.</p>
            <ul className="card-dialog__shared-list" aria-label="Contributors">
              <li className="card-dialog__shared-item">
                <div className="card-dialog__shared-body">
                  <img
                    src="../assets/midudev.jpg"
                    alt="midudev's profile picture"
                    className="card-dialog__shared-avatar"
                    width="40"
                    height="40"
                    decoding="async"
                  />
                  <div className="card-dialog__shared-meta">
                    <strong className="card-dialog__shared-name">Midudev</strong>
                    <span className="card-dialog__shared-role">Editor</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="card-dialog__shared-remove"
                  aria-label="Remove Midudev from the shared space"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </li>
            </ul>
            <button type="button" className="card-dialog__invite">
              <span aria-hidden="true">+</span> Invite someone
            </button>
            <p className="card-dialog__soon" role="note">
              Usage by space and by page will be available soon.
            </p>
          </fieldset>
  
          {/* Sección: Atajos de Teclado */}
          <fieldset className="card-dialog__config-section">
            <legend>⌨️ Keyboard shortcuts</legend>
            <p className="card-dialog__config-desc">Commands for managing blocks of text.</p>
            <table className="card-dialog__shortcuts" aria-label="Keyboard Shortcut Reference">
              <tbody>
                <tr>
                  <td><kbd>Enter</kbd></td>
                  <td>Create a text block below.</td>
                </tr>
                <tr>
                  <td><kbd>Esc</kbd></td>
                  <td>Save and close the dialog box.</td>
                </tr>
                <tr>
                  <td><kbd>:</kbd></td>
                  <td>Open the block type menu.</td>
                </tr>
              </tbody>
            </table>
          </fieldset>
        </div>
  
        <footer className="card-dialog__config-actions">
          <button
            type="button"
            className="card-dialog__config-btn card-dialog__config-btn--primary"
            data-action="config-save"
            onClick={onSave}
          >
            Save
          </button>
        </footer>
      </section>
    );
}

export default SpaceDialogSettings;