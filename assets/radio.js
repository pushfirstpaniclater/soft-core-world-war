(() => {
  'use strict';

  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.append(favicon);
  }
  favicon.type = 'image/png';
  favicon.href = '/assets/james%20favacon.png?v=20260807-james-photo';

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
    { url: '/assets/music/yeat - out the way ( slowed reverb ).mp3', metaData: { artist: 'YEAT', title: 'OUT THE WAY (SLOWED + REVERB)' } },
    { url: '/assets/music/yeat - monëy so big (slowed reverb).mp3', metaData: { artist: 'YEAT', title: 'MONËY SO BIG (SLOWED + REVERB)' } },
  ];

  const RADIO_VOLUME_STORAGE_KEY = 'scwwWebampVolumeV1';
  let radioVolume = 55;
  try {
    const savedVolume = Number(localStorage.getItem(RADIO_VOLUME_STORAGE_KEY));
    if (Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 100) radioVolume = savedVolume;
  } catch {}

  const style = document.createElement('style');
  style.textContent = `
    #scww-webamp-shell{position:fixed;inset:0;z-index:9998;pointer-events:none;overflow:visible}
    #scww-webamp-anchor{position:fixed;top:88px;right:14px;width:275px;height:620px;pointer-events:none;visibility:hidden}
    #scww-webamp-toggle{position:fixed;right:12px;top:12px;z-index:10001;pointer-events:auto;border:1px solid #54ff3d;background:#050505;color:#54ff3d;padding:6px 9px;font:11px/1 "Lucida Console",Monaco,"Courier New",monospace;letter-spacing:.05em;cursor:pointer;box-shadow:2px 2px #000}
    #scww-webamp-toggle:hover,#scww-webamp-toggle:focus-visible{background:#54ff3d;color:#000;outline:none}
    #scww-radio-volume{position:fixed;right:12px;top:43px;width:190px;z-index:10001;pointer-events:auto;border:1px solid #54ff3d;background:#050505;color:#54ff3d;padding:7px 8px 8px;box-shadow:2px 2px #000;font:10px/1 "Lucida Console",Monaco,"Courier New",monospace;user-select:none;-webkit-user-select:none}
    #scww-radio-volume-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;letter-spacing:.06em}
    #scww-radio-volume-value{color:#ffe900;min-width:44px;text-align:right}
    #scww-radio-volume-slider{display:block;width:100%;height:20px;margin:0;appearance:none;-webkit-appearance:none;background:transparent;cursor:pointer;touch-action:pan-x}
    #scww-radio-volume-slider::-webkit-slider-runnable-track{height:5px;background:#111;border:1px solid #54ff3d;box-shadow:inset 1px 1px #000}
    #scww-radio-volume-slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;margin-top:-8px;border:1px solid #54ff3d;border-radius:0;background:#050505;box-shadow:2px 2px #000;cursor:grab}
    #scww-radio-volume-slider:active::-webkit-slider-thumb{background:#54ff3d;cursor:grabbing}
    #scww-radio-volume-slider::-moz-range-track{height:5px;background:#111;border:1px solid #54ff3d}
    #scww-radio-volume-slider::-moz-range-thumb{width:20px;height:20px;border:1px solid #54ff3d;border-radius:0;background:#050505;box-shadow:2px 2px #000;cursor:grab}
    #scww-radio-volume-slider:focus-visible{outline:1px dashed #ffe900;outline-offset:3px}
    @media(max-width:900px){
      #scww-webamp-anchor{top:99px;right:8px}
      #scww-webamp-toggle{top:8px;right:8px;padding:8px 11px;font-size:12px}
      #scww-radio-volume{top:46px;right:8px;width:min(230px,calc(100vw - 16px));padding:8px 10px 9px;font-size:11px}
      #scww-radio-volume-slider{height:28px}
      #scww-radio-volume-slider::-webkit-slider-runnable-track{height:7px}
      #scww-radio-volume-slider::-webkit-slider-thumb{width:28px;height:28px;margin-top:-11px}
      #scww-radio-volume-slider::-moz-range-track{height:7px}
      #scww-radio-volume-slider::-moz-range-thumb{width:28px;height:28px}
    }
  `;
  document.head.append(style);

  const shell = document.createElement('div');
  shell.id = 'scww-webamp-shell';
  shell.innerHTML = `<div id="scww-webamp-anchor" aria-hidden="true"></div>
    <button id="scww-webamp-toggle" type="button" aria-expanded="true">RADIO — HIDE</button>
    <label id="scww-radio-volume" for="scww-radio-volume-slider">
      <span id="scww-radio-volume-head"><span>RADIO VOL</span><span id="scww-radio-volume-value">${Math.round(radioVolume)}%</span></span>
      <input id="scww-radio-volume-slider" type="range" min="0" max="100" step="1" value="${radioVolume}" aria-label="Radio volume">
    </label>`;
  document.body.append(shell);

  const anchor = document.getElementById('scww-webamp-anchor');
  const toggle = document.getElementById('scww-webamp-toggle');
  const volumeSlider = document.getElementById('scww-radio-volume-slider');
  const volumeValue = document.getElementById('scww-radio-volume-value');
  let webampRoot = null;
  let webampNodes = [];
  let webampInstance = null;
  let minimized = window.innerWidth < 900;

  try {
    const savedMinimized = localStorage.getItem('scwwWebampMinimizedV1');
    if (savedMinimized === 'true' || savedMinimized === 'false') minimized = savedMinimized === 'true';
  } catch {}

  function renderMinimized() {
    toggle.textContent = minimized ? 'RADIO + SHOW' : 'RADIO — HIDE';
    toggle.setAttribute('aria-expanded', String(!minimized));
    for (const node of webampNodes) {
      if (node && node.isConnected) node.style.display = minimized ? 'none' : '';
    }
  }

  function applyRadioVolume(value, persist = true) {
    radioVolume = Math.max(0, Math.min(100, Number(value) || 0));
    volumeSlider.value = String(radioVolume);
    volumeValue.textContent = Math.round(radioVolume) + '%';
    try { webampInstance?.setVolume?.(radioVolume); } catch (error) { console.warn('SCWW radio volume failed', error); }
    if (persist) {
      try { localStorage.setItem(RADIO_VOLUME_STORAGE_KEY, String(radioVolume)); } catch {}
    }
  }

  toggle.addEventListener('click', () => {
    minimized = !minimized;
    renderMinimized();
    try { localStorage.setItem('scwwWebampMinimizedV1', String(minimized)); } catch {}
  });

  volumeSlider.addEventListener('input', () => applyRadioVolume(volumeSlider.value));
  volumeSlider.addEventListener('change', () => applyRadioVolume(volumeSlider.value));
  volumeSlider.addEventListener('pointerdown', (event) => event.stopPropagation());
  volumeSlider.addEventListener('touchstart', (event) => event.stopPropagation(), { passive: true });

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

      webampInstance = webamp;
      window.scwwWebamp = webamp;
      applyRadioVolume(radioVolume, false);

      const bodyChildrenBeforeRender = new Set(document.body.children);
      const capturedNodes = new Set();
      const renderObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.parentElement === document.body &&
              node !== shell &&
              node.tagName !== 'SCRIPT' &&
              node.tagName !== 'STYLE'
            ) {
              capturedNodes.add(node);
            }
          }
        }
      });
      renderObserver.observe(document.body, { childList: true });

      await webamp.renderWhenReady(anchor);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      renderObserver.disconnect();
      applyRadioVolume(radioVolume, false);

      const diffNodes = [...document.body.children].filter((node) =>
        !bodyChildrenBeforeRender.has(node) &&
        node !== shell &&
        node.tagName !== 'SCRIPT' &&
        node.tagName !== 'STYLE'
      );

      webampNodes = [...new Set([...capturedNodes, ...diffNodes])];

      const webampElement = document.getElementById('webamp');
      webampRoot = webampElement || webampNodes.find((node) =>
        node.id === 'webamp' || node.querySelector?.('#webamp')
      ) || webampNodes[0] || null;

      if (webampRoot) {
        webampRoot.addEventListener('pointerdown', lockSelectionDuringDrag, true);
        const observer = new MutationObserver(() => {
          for (const node of [...document.body.children]) {
            if (
              node !== shell &&
              node.tagName !== 'SCRIPT' &&
              node.tagName !== 'STYLE' &&
              !bodyChildrenBeforeRender.has(node) &&
              !webampNodes.includes(node)
            ) {
              webampNodes.push(node);
              if (minimized) node.style.display = 'none';
            }
          }
        });
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