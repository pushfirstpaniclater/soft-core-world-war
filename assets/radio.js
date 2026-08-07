(() => {
  'use strict';

  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.append(favicon);
  }
  favicon.type = 'image/svg+xml';
  favicon.href = '/favicon.svg?v=20260806-james';

  const languageScript = document.createElement('script');
  languageScript.src = '/assets/language-persistence.js?v=20260806-2244';
  languageScript.async = true;
  document.head.append(languageScript);

  const oldPlayer = document.querySelector('.player');
  if (oldPlayer) {
    oldPlayer.querySelector('audio')?.pause();
    oldPlayer.remove();
  }
  document.querySelector('.scww-radio')?.remove();
  document.querySelector('#scww-webamp-shell')?.remove();

  const tracks = [
    { url: '/assets/music/Evanescent Feelings.mp3', metaData: { title: 'EVANESCENT FEELINGS' } },
    { url: '/assets/music/protect-ight.mp3', metaData: { artist: 'PROTECT', title: 'IGHT' } },
    { url: '/assets/music/I_Miss_You_KLICKAUD.mp3', metaData: { title: 'I MISS YOU KLICKAUD' } },
    { url: "/assets/music/i don't know when i'm supposed to stop.mp3", metaData: { title: "I DON'T KNOW WHEN I'M SUPPOSED TO STOP" } },
    { url: '/assets/music/i wish i could sleep forever.mp3', metaData: { title: 'I WISH I COULD SLEEP FOREVER' } },
    { url: '/assets/music/onlymp3.to - Jesh Freestyle-pIUFgBGltZY-256k-1659953062993.mp3', metaData: { title: 'JESH FREESTYLE' } },
    { url: "/assets/music/Sharc & Pi'erre Bourne - _Yes Sir_ OFFICIAL VERSION.mp3", metaData: { artist: "SHARC & PI'ERRE BOURNE", title: 'YES SIR' } },
    { url: '/assets/music/SpongeBob Production Music Twelfth Street Rag.mp3', metaData: { title: 'TWELFTH STREET RAG' } },
    { url: '/assets/music/yeat - if we being real (𝙎𝙡𝙤𝙬𝙚𝙙  𝙧𝙚𝙫𝙚𝙧𝙗).mp3', metaData: { artist: 'YEAT', title: 'IF WE BEING REAL (SLOWED + REVERB)' } },
    { url: '/assets/music/The End Of It - Kanye West (prod. Kid Cudi).mp3', metaData: { artist: 'KANYE WEST', title: 'THE END OF IT' } },
    { url: '/assets/music/glokk40spaz on earl sweatshirt production.mp3', metaData: { title: 'GLOKK40SPAZ ON EARL SWEATSHIRT PRODUCTION' } },
    { url: '/assets/music/Migos - Fly With A Fish (Streets On Lock 2).mp3', metaData: { artist: 'MIGOS', title: 'FLY WITH A FISH' } },
    { url: '/assets/music/FOUR - FLEXOfficial music Video.mp3', metaData: { artist: 'FOUR', title: 'FLEX' } },
  ];

  const style = document.createElement('style');
  style.textContent = `
    #scww-webamp-shell{position:fixed;inset:0;z-index:9998;pointer-events:none;overflow:visible}
    #scww-webamp-anchor{position:fixed;top:42px;right:14px;width:275px;height:620px;pointer-events:none;visibility:hidden}
    #scww-webamp-toggle{position:fixed;right:12px;top:12px;z-index:10001;pointer-events:auto;border:1px solid #54ff3d;background:#050505;color:#54ff3d;padding:6px 9px;font:11px/1 "Lucida Console",Monaco,"Courier New",monospace;letter-spacing:.05em;cursor:pointer;box-shadow:2px 2px #000}
    #scww-webamp-toggle:hover,#scww-webamp-toggle:focus-visible{background:#54ff3d;color:#000;outline:none}
    .scww-jet-milkdrop{overflow:visible!important;box-shadow:0 0 0 1px #0b0d10,0 0 0 3px #57616f,0 8px 24px rgba(0,0,0,.48)!important}
    .scww-jet-milkdrop::before{content:'JET VISUALIZER';position:absolute;left:-3px;right:-3px;top:-24px;height:22px;display:flex;align-items:center;padding-left:9px;box-sizing:border-box;background:linear-gradient(90deg,#39414e 0%,#202632 72%,#151921 100%);border:1px solid #697487;border-bottom-color:#252a33;color:#d5d8df;font:700 9px/1 Tahoma,Arial,sans-serif;letter-spacing:.12em;text-shadow:1px 1px #000;pointer-events:none;z-index:2147483646}
    .scww-jet-milkdrop::after{content:'SCWW SIGNAL';position:absolute;right:6px;top:-18px;color:#d2ad43;font:700 8px/1 Tahoma,Arial,sans-serif;letter-spacing:.08em;text-shadow:1px 1px #000;pointer-events:none;z-index:2147483647}
    @media(max-width:900px){#scww-webamp-anchor{top:40px;right:8px}#scww-webamp-toggle{top:8px;right:8px}}
  `;
  document.head.append(style);

  const shell = document.createElement('div');
  shell.id = 'scww-webamp-shell';
  shell.innerHTML = '<div id="scww-webamp-anchor" aria-hidden="true"></div><button id="scww-webamp-toggle" type="button" aria-expanded="true">RADIO — HIDE</button>';
  document.body.append(shell);

  const anchor = document.getElementById('scww-webamp-anchor');
  const toggle = document.getElementById('scww-webamp-toggle');
  let webampRoot = null;
  let minimized = window.innerWidth < 900;

  try {
    const savedMinimized = localStorage.getItem('scwwWebampMinimizedV1');
    if (savedMinimized === 'true' || savedMinimized === 'false') minimized = savedMinimized === 'true';
  } catch {}

  function renderMinimized() {
    toggle.textContent = minimized ? 'RADIO + SHOW' : 'RADIO — HIDE';
    toggle.setAttribute('aria-expanded', String(!minimized));
    if (webampRoot) webampRoot.style.display = minimized ? 'none' : '';
  }

  toggle.addEventListener('click', () => {
    minimized = !minimized;
    renderMinimized();
    try { localStorage.setItem('scwwWebampMinimizedV1', String(minimized)); } catch {}
  });
  renderMinimized();

  let previousBodyUserSelect = '';
  const releaseSelectionLock = () => {
    document.body.style.userSelect = previousBodyUserSelect;
    document.body.style.webkitUserSelect = previousBodyUserSelect;
    window.removeEventListener('pointerup', releaseSelectionLock, true);
    window.removeEventListener('pointercancel', releaseSelectionLock, true);
  };

  const lockSelectionDuringDrag = () => {
    previousBodyUserSelect = document.body.style.userSelect || '';
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    window.addEventListener('pointerup', releaseSelectionLock, true);
    window.addEventListener('pointercancel', releaseSelectionLock, true);
  };

  function decorateMilkdrop() {
    if (!webampRoot) return false;
    if (webampRoot.querySelector('.scww-jet-milkdrop')) return true;

    const direct = webampRoot.querySelector('[data-window-id="milkdrop"], [data-window="milkdrop"], #milkdrop, [id*="milkdrop" i]');
    if (direct) {
      const rect = direct.getBoundingClientRect();
      let target = direct;
      if (rect.width < 200 || rect.height < 100) {
        let node = direct.parentElement;
        while (node && node !== webampRoot) {
          const r = node.getBoundingClientRect();
          if (r.width >= 240 && r.height >= 120) { target = node; break; }
          node = node.parentElement;
        }
      }
      target.classList.add('scww-jet-milkdrop');
      return true;
    }

    const canvases = [...webampRoot.querySelectorAll('canvas')];
    for (const canvas of canvases.reverse()) {
      let node = canvas.parentElement;
      while (node && node !== webampRoot) {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        if (rect.width >= 240 && rect.height >= 120 && (style.position === 'absolute' || style.position === 'fixed')) {
          node.classList.add('scww-jet-milkdrop');
          return true;
        }
        node = node.parentElement;
      }
    }

    const textNodes = [...webampRoot.querySelectorAll('*')].filter((node) => /milk\s*drop/i.test(node.textContent || ''));
    for (const label of textNodes) {
      let node = label;
      while (node && node !== webampRoot) {
        const rect = node.getBoundingClientRect();
        if (rect.width >= 240 && rect.height >= 120) {
          node.classList.add('scww-jet-milkdrop');
          return true;
        }
        node = node.parentElement;
      }
    }
    return false;
  }

  (async () => {
    try {
      const mod = await import('https://unpkg.com/webamp@2.3.1/butterchurn');
      const Webamp = mod.default;
      if (!Webamp?.browserIsSupported?.()) {
        toggle.textContent = 'RADIO // UNSUPPORTED';
        toggle.disabled = true;
        return;
      }

      const webamp = new Webamp({
        initialTracks: tracks,
        initialSkin: {
          url: '/assets/Cowboy_Bebop_-_Jet_Black.wsz',
        },
        enableMediaSession: true,
        enableHotkeys: true,
        zIndex: 9999,
        windowLayout: {
          main: {
            position: { top: 0, left: 0 },
            closed: false,
          },
          equalizer: {
            position: { top: 116, left: 0 },
            closed: false,
          },
          playlist: {
            position: { top: 232, left: 0 },
            size: { extraHeight: 1, extraWidth: 0 },
            closed: false,
          },
          milkdrop: {
            position: { top: 392, left: 0 },
            size: { extraHeight: 2, extraWidth: 0 },
            closed: false,
          },
        },
      });

      window.scwwWebamp = webamp;

      const bodyChildrenBeforeRender = new Set(document.body.children);
      await webamp.renderWhenReady(anchor);

      webampRoot = [...document.body.children].find((node) =>
        !bodyChildrenBeforeRender.has(node) && node !== shell && node.tagName !== 'SCRIPT'
      ) || document.getElementById('webamp');

      if (webampRoot) {
        webampRoot.addEventListener('pointerdown', lockSelectionDuringDrag, true);
        decorateMilkdrop();
        requestAnimationFrame(decorateMilkdrop);
        setTimeout(decorateMilkdrop, 250);
        setTimeout(decorateMilkdrop, 1000);
        const observer = new MutationObserver(() => decorateMilkdrop());
        observer.observe(webampRoot, { childList: true, subtree: true });
      }

      renderMinimized();
    } catch (error) {
      console.error('SCWW Webamp failed to initialize', error);
      toggle.textContent = 'RADIO // SIGNAL FAILED';
      toggle.disabled = true;
    }
  })();
})();