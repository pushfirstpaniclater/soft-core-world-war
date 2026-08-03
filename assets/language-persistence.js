(() => {
  'use strict';

  const LANGUAGE_STORAGE_KEY = 'scwwLanguageV1';
  const RADIO_COLLAPSE_STORAGE_KEY = 'scwwRadioCollapsedV1';

  function installLanguagePersistence() {
    const languageButton = document.getElementById('languageSwitch');

    if (!languageButton || typeof renderLanguage !== 'function') {
      return;
    }

    try {
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

      if (savedLanguage === 'en' || savedLanguage === 'fr') {
        language = savedLanguage;
        renderLanguage();
      }
    } catch {
      // Local storage may be unavailable in privacy-restricted browsers.
    }

    languageButton.addEventListener('click', () => {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      } catch {
        // The language switch still works for the current page without storage.
      }
    });
  }

  function installRadioCollapse() {
    const radio = document.querySelector('.scww-radio');

    if (!radio || radio.dataset.collapseReady === 'true') {
      return false;
    }

    const title = radio.querySelector('.scww-radio-title');

    if (!title) {
      return false;
    }

    radio.dataset.collapseReady = 'true';

    const style = document.createElement('style');
    style.textContent = `
      .scww-radio-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin: 0;
        padding: 1px 0 8px;
        cursor: pointer;
        user-select: none;
      }

      .scww-radio-title:focus-visible {
        outline: 1px solid #ffea00;
        outline-offset: 3px;
      }

      .scww-radio-toggle {
        color: #ffea00;
        font-size: 11px;
      }

      .scww-radio-body {
        display: block;
      }

      .scww-radio.is-collapsed {
        width: 190px;
        padding-bottom: 2px;
      }

      .scww-radio.is-collapsed .scww-radio-title {
        padding-bottom: 5px;
      }

      .scww-radio.is-collapsed .scww-radio-body {
        display: none;
      }

      @media (max-width: 1050px) {
        .scww-radio.is-collapsed {
          width: 176px;
        }
      }
    `;
    document.head.append(style);

    const body = document.createElement('div');
    body.className = 'scww-radio-body';

    while (title.nextSibling) {
      body.append(title.nextSibling);
    }

    radio.append(body);

    const label = document.createElement('span');
    label.textContent = 'SCWW RADIO';

    const toggleIcon = document.createElement('span');
    toggleIcon.className = 'scww-radio-toggle';
    toggleIcon.setAttribute('aria-hidden', 'true');

    title.replaceChildren(label, toggleIcon);
    title.setAttribute('role', 'button');
    title.setAttribute('tabindex', '0');
    title.setAttribute('aria-controls', 'scww-radio-body');
    body.id = 'scww-radio-body';

    let isCollapsed = false;

    try {
      isCollapsed = localStorage.getItem(RADIO_COLLAPSE_STORAGE_KEY) === 'true';
    } catch {
      // Collapse still works for the current page without storage.
    }

    const render = () => {
      radio.classList.toggle('is-collapsed', isCollapsed);
      title.setAttribute('aria-expanded', String(!isCollapsed));
      title.setAttribute(
        'aria-label',
        isCollapsed ? 'Expand SCWW radio' : 'Collapse SCWW radio',
      );
      toggleIcon.textContent = isCollapsed ? '▼ OPEN' : '▲ CLOSE';
    };

    const toggle = () => {
      isCollapsed = !isCollapsed;
      render();

      try {
        localStorage.setItem(RADIO_COLLAPSE_STORAGE_KEY, String(isCollapsed));
      } catch {
        // Collapse still works for the current page without storage.
      }
    };

    title.addEventListener('click', toggle);
    title.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    });

    render();
    return true;
  }

  installLanguagePersistence();

  if (!installRadioCollapse()) {
    const observer = new MutationObserver(() => {
      if (installRadioCollapse()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
