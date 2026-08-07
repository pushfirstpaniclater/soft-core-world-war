(() => {
  'use strict';

  const STORAGE_KEY = 'scwwNewsReadingModeV1';
  const isNewsPage = /(^|\/)(news(?:-archive)?\.html|archive\/[^/]+\.html)$/i.test(
    location.pathname,
  );

  if (!isNewsPage) return;

  const style = document.createElement('style');
  style.textContent = `
    .scww-reading-mode-button,
    .scww-show-radio-tab {
      border: 1px solid #ffe900;
      background: #050505;
      color: #ffe900;
      font: 700 10px/1 "Courier New", monospace;
      letter-spacing: .08em;
      cursor: pointer;
      text-transform: uppercase;
    }

    .scww-reading-mode-button {
      width: 100%;
      margin-top: 7px;
      padding: 8px 6px;
    }

    .scww-reading-mode-button:hover,
    .scww-reading-mode-button:focus-visible,
    .scww-show-radio-tab:hover,
    .scww-show-radio-tab:focus-visible {
      background: #ffe900;
      color: #050505;
      outline: none;
    }

    .scww-radio.scww-reading-hidden {
      display: none !important;
    }

    .scww-show-radio-tab {
      display: none;
      position: fixed;
      right: 0;
      top: 50%;
      z-index: 10002;
      padding: 11px 7px;
      writing-mode: vertical-rl;
      transform: translateY(-50%) rotate(180deg);
      box-shadow: 0 0 12px rgba(255, 233, 0, .28);
    }

    body.scww-reading-mode .scww-show-radio-tab {
      display: block;
    }

    .scww-news-reply-wrap {
      margin: 32px 0 8px;
      text-align: center;
    }

    .scww-news-reply {
      --c:#fff;
      --button-color:#26ecff;
      display:inline-block;
      margin:18px 10px;
      padding:.1em .3em;
      border:none;
      color:#0000;
      background:linear-gradient(90deg,#0000 33%,#fff5,#0000 67%) var(--_p,100%)/300% no-repeat,var(--button-color);
      font:bold 2rem/1.25 "Lucida Console",Monaco,"Courier New",monospace;
      text-decoration:none;
      text-shadow:calc(var(--_i,-1)*.08em) -.01em 0 var(--c),calc(var(--_i,-1)*-.08em) .01em 2px #0004;
      cursor:pointer;
      transform:perspective(500px) rotateY(calc(20deg*var(--_i,-1)));
      outline-offset:.1em;
      transition:.3s;
    }

    .scww-news-reply:hover,
    .scww-news-reply:focus-visible {
      --_p:0%;
      --_i:1;
      outline:none;
    }

    .scww-news-reply:active {
      color:var(--c);
      text-shadow:none;
      box-shadow:inset 0 0 0 999px #0005;
      transition:0s;
    }

    @media (max-width: 1050px) {
      .scww-show-radio-tab {
        top: auto;
        right: 8px;
        bottom: 8px;
        writing-mode: horizontal-tb;
        transform: none;
        padding: 9px 10px;
      }
    }

    @media (max-width: 620px) {
      .scww-news-reply {
        font-size:1.45rem;
        margin:14px 6px;
      }
    }
  `;
  document.head.append(style);

  const archiveMatch = location.pathname.match(/\/archive\/([^/]+)\.html$/i);
  if (archiveMatch) {
    const shell = document.querySelector('.shell') || document.querySelector('main');
    const title = document.querySelector('h1.hero, h1')?.textContent?.trim();
    if (shell && title && !document.querySelector('.scww-news-reply')) {
      const wrap = document.createElement('div');
      wrap.className = 'scww-news-reply-wrap';
      const link = document.createElement('a');
      link.className = 'scww-news-reply';
      link.textContent = 'REPLY TO THIS TRANSMISSION';
      const slug = archiveMatch[1];
      link.href = `../contact.html?view=news&article=${encodeURIComponent(slug)}&subject=${encodeURIComponent(title)}`;
      wrap.append(link);
      const footer = shell.querySelector('.footer');
      if (footer) shell.insertBefore(wrap, footer);
      else shell.append(wrap);
    }
  }

  const showTab = document.createElement('button');
  showTab.type = 'button';
  showTab.className = 'scww-show-radio-tab';
  showTab.textContent = 'SHOW RADIO';
  showTab.setAttribute('aria-label', 'Show SCWW radio');
  document.body.append(showTab);

  let hidden = false;
  try {
    hidden = localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    hidden = false;
  }

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(hidden));
    } catch {
      // Reading mode still works for the current page.
    }
  };

  const apply = (radio) => {
    radio.classList.toggle('scww-reading-hidden', hidden);
    document.body.classList.toggle('scww-reading-mode', hidden);
    showTab.setAttribute('aria-hidden', String(!hidden));
  };

  const install = () => {
    const radio = document.querySelector('.scww-radio');
    if (!radio) return false;

    if (!radio.querySelector('.scww-reading-mode-button')) {
      const body = radio.querySelector('.scww-radio-body') || radio;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'scww-reading-mode-button';
      button.textContent = 'READING MODE';
      button.setAttribute('aria-label', 'Hide radio controls for reading');
      button.addEventListener('click', () => {
        hidden = true;
        save();
        apply(radio);
      });
      body.append(button);
    }

    apply(radio);

    showTab.onclick = () => {
      hidden = false;
      save();
      apply(radio);
    };

    return true;
  };

  if (!install()) {
    const observer = new MutationObserver(() => {
      if (install()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
