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

  function installPortalButtons() {
    const portalLinks = [
      document.querySelector('a[href="news.html"]'),
      document.querySelector('a[href="visual-signal.html"]'),
    ].filter(Boolean);

    if (!portalLinks.length) {
      return;
    }

    const style = document.createElement('style');
    style.textContent = `
      .scww-physical-button {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 152px;
        min-height: 48px;
        margin-top: 12px;
        padding: 11px 18px 9px;
        border: 3px solid #360000;
        border-radius: 8px;
        color: #fff8dc;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.34), transparent 22%),
          radial-gradient(circle at 50% 28%, #ff5a4d 0 14%, #d41414 45%, #780000 100%);
        box-shadow:
          inset 0 2px 2px rgba(255, 255, 255, 0.45),
          inset 0 -7px 8px rgba(65, 0, 0, 0.7),
          0 6px 0 #310000,
          0 9px 13px rgba(0, 0, 0, 0.75),
          0 0 18px rgba(255, 30, 20, 0.35);
        font: 900 15px/1 "Lucida Console", Monaco, "Courier New", monospace;
        letter-spacing: 0.04em;
        text-decoration: none;
        text-shadow: 1px 2px 0 #5c0000;
        cursor: pointer;
        transform: translateY(0);
        transition:
          transform 80ms ease,
          box-shadow 80ms ease,
          filter 120ms ease;
      }

      .scww-physical-button::before {
        content: '';
        position: absolute;
        inset: -8px;
        z-index: -1;
        border: 2px solid #111;
        border-radius: 11px;
        background: linear-gradient(#555, #151515);
        box-shadow: inset 0 1px 0 #8d8d8d;
      }

      .scww-physical-button:hover {
        color: #fff;
        filter: brightness(1.12) saturate(1.12);
      }

      .scww-physical-button:active {
        transform: translateY(5px);
        box-shadow:
          inset 0 2px 2px rgba(255, 255, 255, 0.25),
          inset 0 -3px 5px rgba(65, 0, 0, 0.7),
          0 1px 0 #310000,
          0 4px 7px rgba(0, 0, 0, 0.7),
          0 0 10px rgba(255, 30, 20, 0.25);
      }

      .scww-physical-button:focus-visible {
        outline: 3px solid #ffe900;
        outline-offset: 7px;
      }
    `;
    document.head.append(style);

    portalLinks.forEach((link) => {
      link.classList.add('scww-physical-button');
      link.classList.remove('news-link');
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
  installPortalButtons();

  if (!installRadioCollapse()) {
    const observer = new MutationObserver(() => {
      if (installRadioCollapse()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
