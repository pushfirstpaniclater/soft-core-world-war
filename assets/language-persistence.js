(() => {
  'use strict';

  const STORAGE_KEY = 'scwwLanguageV1';
  const languageButton = document.getElementById('languageSwitch');

  if (!languageButton || typeof renderLanguage !== 'function') {
    return;
  }

  try {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);

    if (savedLanguage === 'en' || savedLanguage === 'fr') {
      language = savedLanguage;
      renderLanguage();
    }
  } catch {
    // Local storage may be unavailable in privacy-restricted browsers.
  }

  languageButton.addEventListener('click', () => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // The language switch still works for the current page without storage.
    }
  });
})();
