(() => {
  'use strict';

  const SOUND_KEY = 'scwwAutoplaySoundV1';
  const LEGACY_SOUND_KEY = 'scwwMasterSoundV1';

  const getSoundOn = () => {
    const saved = localStorage.getItem(SOUND_KEY);
    if (saved) return saved !== 'off';

    const legacy = localStorage.getItem(LEGACY_SOUND_KEY);
    return legacy !== 'off';
  };

  const saveSound = (on) => {
    localStorage.setItem(SOUND_KEY, on ? 'on' : 'off');
  };

  const audio = document.createElement('audio');
  audio.src = 'assets/music/audio0.6dbd17bd.mp3';
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0.55;
  audio.setAttribute('aria-hidden', 'true');
  audio.dataset.scwwAutoplay = 'true';
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

  const render = () => {
    const on = getSoundOn();
    button.textContent = on ? 'SOUND: ON' : 'SOUND: OFF';
    button.setAttribute(
      'aria-label',
      on ? 'Mute automatic page soundtrack' : 'Turn on automatic page soundtrack',
    );
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

    if (on) {
      attemptPlayback();
    } else {
      audio.pause();
      audio.muted = true;
    }

    render();
  };

  button.addEventListener('click', () => {
    saveSound(!getSoundOn());
    applySoundState();
  });

  window.addEventListener('storage', (event) => {
    if (event.key === SOUND_KEY) applySoundState();
  });

  applySoundState();
})();
