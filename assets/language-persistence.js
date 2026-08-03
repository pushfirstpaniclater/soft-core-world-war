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
        position: relative !important;
        z-index: 2 !important;
        display: inline-grid !important;
        place-items: center !important;
        min-width: 230px !important;
        min-height: 82px !important;
        margin: 24px 12px 34px !important;
        padding: 18px 30px !important;
        border: 11px solid #232323 !important;
        border-radius: 20px !important;
        color: #fff8dc !important;
        background:
          radial-gradient(circle at 50% 25%, #ffc0b8 0 5%, #ff2f24 22%, #bd0505 58%, #5c0000 100%) !important;
        box-shadow:
          inset 0 6px 8px rgba(255, 255, 255, 0.72),
          inset 0 -13px 15px rgba(45, 0, 0, 0.88),
          0 9px 0 #080808,
          0 14px 0 #4a4a4a,
          0 20px 28px rgba(0, 0, 0, 0.92),
          0 0 34px rgba(255, 0, 0, 0.72) !important;
        font: 900 24px/1 "Arial Black", Impact, sans-serif !important;
        letter-spacing: 0.08em !important;
        text-decoration: none !important;
        text-shadow:
          0 3px 0 #4c0000,
          0 0 8px rgba(255, 255, 255, 0.72) !important;
        cursor: pointer !important;
        transform: translateY(0) !important;
        transition:
          transform 90ms ease,
          box-shadow 90ms ease,
          filter 120ms ease !important;
      }

      .scww-physical-button::before {
        content: '';
        position: absolute;
        inset: -20px;
        z-index: -1;
        border: 3px solid #8a8a8a;
        border-radius: 28px;
        background:
          linear-gradient(145deg, #8d8d8d 0%, #3b3b3b 24%, #0a0a0a 58%, #5a5a5a 100%);
        box-shadow:
          inset 0 2px 1px rgba(255, 255, 255, 0.45),
          inset 0 -3px 3px rgba(0, 0, 0, 0.8),
          0 8px 18px rgba(0, 0, 0, 0.9);
      }

      .scww-physical-button::after {
        content: 'PRESS TO ENTER';
        position: absolute;
        left: 50%;
        bottom: -36px;
        transform: translateX(-50%);
        width: max-content;
        color: #ffe900;
        font: 700 11px/1 "Courier New", monospace;
        letter-spacing: 0.18em;
        text-shadow: 1px 1px #000;
      }

      .scww-physical-button:hover {
        color: #fff !important;
        filter: brightness(1.25) saturate(1.18) !important;
        box-shadow:
          inset 0 6px 8px rgba(255, 255, 255, 0.82),
          inset 0 -13px 15px rgba(45, 0, 0, 0.8),
          0 9px 0 #080808,
          0 14px 0 #4a4a4a,
          0 20px 34px rgba(0, 0, 0, 0.95),
          0 0 48px rgba(255, 35, 35, 1) !important;
      }

      .scww-physical-button:active {
        transform: translateY(9px) !important;
        box-shadow:
          inset 0 4px 12px rgba(55, 0, 0, 0.95),
          inset 0 -4px 7px rgba(255, 255, 255, 0.18),
          0 1px 0 #080808,
          0 5px 0 #4a4a4a,
          0 9px 14px rgba(0, 0, 0, 0.9) !important;
      }

      .scww-physical-button:focus-visible {
        outline: 4px solid #26ecff !important;
        outline-offset: 10px !important;
      }

      @media (max-width: 620px) {
        .scww-physical-button {
          min-width: 198px !important;
          min-height: 72px !important;
          font-size: 20px !important;
        }
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
