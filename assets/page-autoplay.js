(() => {
  'use strict';

  const audio = document.createElement('audio');
  audio.src = 'assets/music/audio0.6dbd17bd.mp3';
  audio.loop = true;
  audio.preload = 'auto';
  audio.autoplay = true;
  audio.volume = 0.55;
  audio.setAttribute('aria-hidden', 'true');
  document.body.append(audio);

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'CLICK FOR SOUND';
  button.setAttribute('aria-label', 'Start page soundtrack');
  button.style.cssText = [
    'position:fixed',
    'left:50%',
    'bottom:18px',
    'transform:translateX(-50%)',
    'z-index:9999',
    'border:2px solid #ffe900',
    'background:#050505',
    'color:#ffe900',
    'padding:10px 14px',
    'font:700 12px/1 "Courier New",monospace',
    'letter-spacing:.08em',
    'cursor:pointer',
    'box-shadow:0 0 16px rgba(255,233,0,.35)'
  ].join(';');

  const hideButton = () => button.remove();
  const attemptPlayback = () => audio.play().then(hideButton).catch(() => {
    if (!button.isConnected) document.body.append(button);
  });

  button.addEventListener('click', attemptPlayback);
  audio.addEventListener('playing', hideButton, { once: true });
  attemptPlayback();
})();
