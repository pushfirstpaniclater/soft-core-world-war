(() => {
  'use strict';

  const SOUND_KEY = 'scwwMasterSoundV1';
  const getSoundOn = () => localStorage.getItem(SOUND_KEY) !== 'off';
  const saveSound = (on) => localStorage.setItem(SOUND_KEY, on ? 'on' : 'off');

  const audio = document.createElement('audio');
  audio.src = 'assets/music/audio0.6dbd17bd.mp3';
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0.55;
  audio.setAttribute('aria-hidden', 'true');
  document.body.append(audio);

  const style = document.createElement('style');
  style.textContent = `
    .scww-sound-toggle {
      position: fixed;
      left: 50%;
      bottom: 14px;
      transform: translateX(-50%);
      z-index: 10001;
      border: 2px solid #ffe900;
      background: #050505;
      color: #ffe900;
      padding: 9px 12px;
      font: 700 10px/1 "Courier New", monospace;
      letter-spacing: .08em;
      cursor: pointer;
      box-shadow: 0 0 14px rgba(255, 233, 0, .3);
      white-space: nowrap;
    }

    .scww-sound-toggle:hover,
    .scww-sound-toggle:focus-visible {
      background: #ffe900;
      color: #050505;
      outline: none;
    }
  `;
  document.head.append(style);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'scww-sound-toggle';
  document.body.append(button);

  const setMediaMuted = (muted) => {
    document.querySelectorAll('audio, video').forEach((media) => {
      media.muted = muted;
    });
  };

  const stopRadio = () => {
    const stopButton = document.querySelector('.scww-radio .stop');
    if (stopButton) stopButton.click();
  };

  const render = () => {
    const on = getSoundOn();
    button.textContent = on ? 'SOUND: ON' : 'SOUND: OFF';
    button.setAttribute('aria-label', on ? 'Mute site sound' : 'Turn on site sound');
    button.setAttribute('aria-pressed', String(!on));
  };

  const attemptPlayback = () => {
    if (!getSoundOn()) return;
    audio.muted = false;
    audio.play().catch(() => {
      // Browser autoplay policies may require the visitor to press SOUND: ON.
    });
  };

  const applySoundState = () => {
    const on = getSoundOn();
    setMediaMuted(!on);

    if (on) {
      attemptPlayback();
    } else {
      audio.pause();
      stopRadio();
    }

    render();
    window.dispatchEvent(new CustomEvent('scww:soundchange', { detail: { on } }));
  };

  button.addEventListener('click', () => {
    saveSound(!getSoundOn());
    applySoundState();
  });

  const observer = new MutationObserver(() => {
    setMediaMuted(!getSoundOn());
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('storage', (event) => {
    if (event.key === SOUND_KEY) applySoundState();
  });

  applySoundState();
})();
