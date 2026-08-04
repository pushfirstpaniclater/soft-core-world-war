(() => {
  'use strict';

  const LANGUAGE_STORAGE_KEY = 'scwwLanguageV1';
  const RADIO_COLLAPSE_STORAGE_KEY = 'scwwRadioCollapsedV1';

  function installLanguagePersistence() {
    const button = document.getElementById('languageSwitch');
    if (!button || typeof renderLanguage !== 'function') return;

    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'en' || saved === 'fr') {
        language = saved;
        renderLanguage();
      }
    } catch {}

    button.addEventListener('click', () => {
      try { localStorage.setItem(LANGUAGE_STORAGE_KEY, language); } catch {}
    });
  }

  function installSecretMagazineLabel() {
    const label = document.getElementById('sunCycleLabel');
    const languageButton = document.getElementById('languageSwitch');
    if (!label) return;

    const render = () => {
      label.textContent = '↑ SECRET MAGAZINE';
      label.setAttribute('aria-label', 'Secret magazine above');
    };

    render();

    if (!document.querySelector('a[href="merch.html"]')) {
      const link = document.createElement('a');
      link.href = 'merch.html';
      link.textContent = 'MERCH!';
      link.className = 'news-link';
      label.insertAdjacentElement('afterend', link);
    }

    if (languageButton) languageButton.addEventListener('click', render);
  }

  function installSecretMagazineLink() {
    const portal = document.getElementById('sunPortal');
    if (!portal || portal.tagName === 'A') return;

    const link = document.createElement('a');
    link.id = portal.id;
    link.className = portal.className;
    link.href = '/gate.html';
    link.setAttribute('aria-label', 'Open the password-gated secret magazine');
    link.innerHTML = portal.innerHTML;
    portal.replaceWith(link);
  }

  function installArchiveLink() {
    const footer = document.getElementById('footerLinks');
    const languageButton = document.getElementById('languageSwitch');
    if (!footer) return;

    const style = document.createElement('style');
    style.textContent = `
      #footerLinks .scww-archive-link{color:inherit;text-decoration:none;cursor:pointer;position:relative;z-index:50;pointer-events:auto}
      #footerLinks .scww-archive-link:hover,#footerLinks .scww-archive-link:focus-visible{color:#ffe900;text-decoration:underline;outline:none}
    `;
    document.head.append(style);

    const render = () => {
      const label = footer.textContent || '';
      const marker = 'ARCHIVES';
      const index = label.toUpperCase().indexOf(marker);
      if (index === -1) return;

      const link = document.createElement('a');
      link.className = 'scww-archive-link';
      link.href = 'news-archive.html';
      link.textContent = label.slice(index, index + marker.length);
      link.setAttribute('aria-label', 'Open news archives');
      footer.replaceChildren(
        document.createTextNode(label.slice(0, index)),
        link,
        document.createTextNode(label.slice(index + marker.length)),
      );
    };

    render();
    if (languageButton) languageButton.addEventListener('click', () => setTimeout(render, 0));
  }

  function installPortalButtons() {
    const links = [
      document.querySelector('a[href="news.html"]'),
      document.querySelector('a[href="visual-signal.html"]'),
      document.querySelector('a[href="merch.html"]'),
    ].filter(Boolean);
    if (!links.length) return;

    const palette = ['#ff2929', '#ff46ff', '#ffe900', '#26ecff', '#54ff3d'];
    const selected = palette[Math.floor(Math.random() * palette.length)];
    const style = document.createElement('style');
    style.textContent = `
      .button-92{--c:#fff;--button-color:${selected};display:inline-block;margin:18px 10px;padding:.1em .3em;border:none;color:#0000;background:linear-gradient(90deg,#0000 33%,#fff5,#0000 67%) var(--_p,100%)/300% no-repeat,var(--button-color);font:bold 2rem/1.25 "Lucida Console",Monaco,"Courier New",monospace;text-decoration:none;text-shadow:calc(var(--_i,-1)*.08em) -.01em 0 var(--c),calc(var(--_i,-1)*-.08em) .01em 2px #0004;cursor:pointer;transform:perspective(500px) rotateY(calc(20deg*var(--_i,-1)));outline-offset:.1em;transition:.3s}
      .button-92:hover,.button-92:focus-visible{--_p:0%;--_i:1}.button-92:active{color:var(--c);text-shadow:none;box-shadow:inset 0 0 0 999px #0005;transition:0s}
      @media(max-width:620px){.button-92{font-size:1.45rem;margin:14px 6px}}
    `;
    document.head.append(style);

    links.forEach((link) => {
      link.classList.remove('news-link', 'scww-physical-button');
      link.classList.add('button-92');
    });
  }

  function installCurrentConditions() {
    const heading = document.getElementById('phaseHeading');
    const phases = document.querySelector('.phases');
    const mantra = document.getElementById('mantra');
    const frequency = document.getElementById('frequencyLabel')?.parentElement;
    const languageButton = document.getElementById('languageSwitch');
    if (!heading || !phases) return;

    const style = document.createElement('style');
    style.textContent = `
      .current-conditions{max-width:760px;margin:8px auto 4px;border:1px solid #54ff3d;background:rgba(0,0,0,.58);padding:9px 12px;box-shadow:6px 6px 0 rgba(255,46,255,.12);text-align:left}
      .current-condition-row{display:grid;grid-template-columns:minmax(190px,38%) 1fr;gap:8px;border-bottom:1px dotted rgba(84,255,61,.42);padding:5px 0;font-size:15px;line-height:1.25}
      .current-condition-row:last-child{border-bottom:0}.current-condition-name{color:#54ff3d}.current-condition-value{color:#fff}
      @media(max-width:620px){.current-condition-row{grid-template-columns:1fr;gap:1px}}
    `;
    document.head.append(style);

    const render = () => {
      heading.textContent = 'CURRENT CONDITIONS';
      heading.className = 'green section';
      phases.className = 'current-conditions';
      phases.innerHTML = `
        <div class="current-condition-row"><span class="current-condition-name">OBJECT OF DESIRE</span><span class="current-condition-value">BALENCIAGA KNIGHT BOOTS</span></div>
        <div class="current-condition-row"><span class="current-condition-name">MOST IMPORTANT IMAGE</span><span class="current-condition-value">GOLD CHAIN</span></div>
        <div class="current-condition-row"><span class="current-condition-name">MARKET MOOD</span><span class="current-condition-value">PRIVACY</span></div>
        <div class="current-condition-row"><span class="current-condition-name">INTERNET WEATHER</span><span class="current-condition-value">HUMID</span></div>
        <div class="current-condition-row"><span class="current-condition-name">JAMES SALAMANDER STATUS</span><span class="current-condition-value">ON ASSIGNMENT</span></div>
      `;
      if (mantra) mantra.hidden = true;
      if (frequency) frequency.hidden = true;
    };

    render();
    if (languageButton) languageButton.addEventListener('click', () => setTimeout(render, 0));
  }

  function installRadioCollapse() {
    const radio = document.querySelector('.scww-radio');
    if (!radio || radio.dataset.collapseReady === 'true') return false;
    const title = radio.querySelector('.scww-radio-title');
    if (!title) return false;

    radio.dataset.collapseReady = 'true';
    const style = document.createElement('style');
    style.textContent = `
      .scww-radio-title{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0;padding:1px 0 8px;cursor:pointer;user-select:none}.scww-radio-title:focus-visible{outline:1px solid #ffea00;outline-offset:3px}.scww-radio-toggle{color:#ffea00;font-size:11px}.scww-radio-body{display:block}.scww-radio.is-collapsed{width:190px;padding-bottom:2px}.scww-radio.is-collapsed .scww-radio-title{padding-bottom:5px}.scww-radio.is-collapsed .scww-radio-body{display:none}@media(max-width:1050px){.scww-radio.is-collapsed{width:176px}}
    `;
    document.head.append(style);

    const body = document.createElement('div');
    body.className = 'scww-radio-body';
    while (title.nextSibling) body.append(title.nextSibling);
    radio.append(body);

    const label = document.createElement('span');
    label.textContent = 'SCWW RADIO';
    const icon = document.createElement('span');
    icon.className = 'scww-radio-toggle';
    icon.setAttribute('aria-hidden', 'true');
    title.replaceChildren(label, icon);
    title.setAttribute('role', 'button');
    title.setAttribute('tabindex', '0');
    title.setAttribute('aria-controls', 'scww-radio-body');
    body.id = 'scww-radio-body';

    let collapsed = false;
    try { collapsed = localStorage.getItem(RADIO_COLLAPSE_STORAGE_KEY) === 'true'; } catch {}

    const render = () => {
      radio.classList.toggle('is-collapsed', collapsed);
      title.setAttribute('aria-expanded', String(!collapsed));
      title.setAttribute('aria-label', collapsed ? 'Expand SCWW radio' : 'Collapse SCWW radio');
      icon.textContent = collapsed ? '▼ OPEN' : '▲ CLOSE';
    };

    const toggle = () => {
      collapsed = !collapsed;
      render();
      try { localStorage.setItem(RADIO_COLLAPSE_STORAGE_KEY, String(collapsed)); } catch {}
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
  installSecretMagazineLabel();
  installSecretMagazineLink();
  installArchiveLink();
  installPortalButtons();
  installCurrentConditions();

  if (!installRadioCollapse()) {
    const observer = new MutationObserver(() => {
      if (installRadioCollapse()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
