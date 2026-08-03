(() => {
  'use strict';

  // Load the language preference helper on every page that includes the radio.
  const languageScript = document.createElement('script');
  languageScript.src = 'assets/language-persistence.js';
  languageScript.async = true;
  document.head.append(languageScript);

  const STATE_KEY = 'scwwRadioStateV1';

  const tracks = [
    { title: 'MENTAL INFRASTRUCTURE DRONE', type: 'portal' },
    {
      title: 'PROTECT — IGHT',
      type: 'audio',
      src: 'assets/music/protect-ight.mp3',
    },
    {
      title: 'I MISS YOU KLICKAUD',
      type: 'audio',
      src: 'assets/music/I_Miss_You_KLICKAUD.mp3',
    },
    {
      title: "I DON'T KNOW WHEN I'M SUPPOSED TO STOP",
      type: 'audio',
      src: "assets/music/i don't know when i'm supposed to stop.mp3",
    },
    {
      title: 'I WISH I COULD SLEEP FOREVER',
      type: 'audio',
      src: 'assets/music/i wish i could sleep forever.mp3',
    },
    {
      title: 'JESH FREESTYLE',
      type: 'audio',
      src: 'assets/music/onlymp3.to - Jesh Freestyle-pIUFgBGltZY-256k-1659953062993.mp3',
    },
    {
      title: "SHARC & PI'ERRE BOURNE — YES SIR",
      type: 'audio',
      src: "assets/music/Sharc & Pi'erre Bourne - _Yes Sir_ OFFICIAL VERSION.mp3",
    },
    {
      title: 'TWELFTH STREET RAG',
      type: 'audio',
      src: 'assets/music/SpongeBob Production Music Twelfth Street Rag.mp3',
    },
    {
      title: 'YEAT — IF WE BEING REAL (SLOWED + REVERB)',
      type: 'audio',
      src: 'assets/music/yeat - if we being real (𝙎𝙡𝙤𝙬𝙚𝙙  𝙧𝙚𝙫𝙚𝙧𝙗).mp3',
    },
    {
      title: 'KANYE WEST — THE END OF IT',
      type: 'audio',
      src: 'assets/music/The End Of It - Kanye West (prod. Kid Cudi).mp3',
    },
  ];

  // Shared player styles are injected once so every static page can use the same UI.
  const style = document.createElement('style');
  style.textContent = `
    .scww-radio {
      position: fixed;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 9999;
      width: 190px;
      border: 2px solid #00eaff;
      background: rgba(0, 0, 0, 0.93);
      box-shadow: 0 0 16px rgba(0, 234, 255, 0.45);
      padding: 10px;
      color: #00eaff;
      font: 12px/1.35 "Lucida Console", Monaco, "Courier New", monospace;
      text-shadow: none;
    }

    .scww-radio * {
      box-sizing: border-box;
    }

    .scww-radio-title {
      color: #ff2cff;
      text-align: center;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .scww-radio-screen {
      border: 1px solid #00eaff;
      background: #020705;
      padding: 7px;
      margin-bottom: 8px;
    }

    .scww-radio-track {
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .scww-radio-count {
      color: #ffea00;
      margin-top: 3px;
    }

    .scww-radio-time,
    .scww-radio-volume-label {
      display: flex;
      justify-content: space-between;
      font-variant-numeric: tabular-nums;
    }

    .scww-radio-time {
      color: #7fff6a;
      margin-top: 4px;
    }

    .scww-radio-meter {
      height: 8px;
      border: 1px solid #ffea00;
      margin: 7px 0;
      overflow: hidden;
    }

    .scww-radio-meter span {
      display: block;
      width: 5%;
      height: 100%;
      background: #ffea00;
    }

    .scww-radio-transport,
    .scww-radio-controls {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      margin-bottom: 6px;
    }

    .scww-radio-controls {
      grid-template-columns: 1fr 1fr;
    }

    .scww-radio button {
      font: inherit;
      color: #ffea00;
      background: #111;
      border: 1px solid #ffea00;
      padding: 7px 3px;
      cursor: pointer;
    }

    .scww-radio button.active {
      background: #ffea00;
      color: #000;
      box-shadow: 0 0 9px rgba(255, 234, 0, 0.55);
    }

    .scww-radio-volume-label {
      color: #ff2cff;
      margin-top: 8px;
    }

    .scww-radio-volume {
      width: 100%;
      accent-color: #ff2cff;
      margin-top: 3px;
    }

    .scww-radio-hint {
      margin-top: 6px;
      color: #7fff6a;
      font-size: 10px;
      text-align: center;
    }

    .scww-radio-resume {
      display: none;
      color: #ff46ff;
      margin-top: 4px;
    }

    @media (max-width: 1050px) {
      .scww-radio {
        position: fixed;
        right: 8px;
        top: auto;
        bottom: 8px;
        transform: none;
        width: 176px;
      }
    }
  `;
  document.head.append(style);

  // Remove the original homepage-only player before creating the shared version.
  const oldPlayer = document.querySelector('.player');
  if (oldPlayer) {
    const oldAudio = oldPlayer.querySelector('audio');
    if (oldAudio) {
      oldAudio.pause();
    }
    oldPlayer.remove();
  }

  const player = document.createElement('aside');
  player.className = 'scww-radio';
  player.innerHTML = `
    <div class="scww-radio-title">SCWW RADIO</div>
    <div class="scww-radio-screen">
      <div>NOW PLAYING:</div>
      <div class="scww-radio-track"></div>
      <div class="scww-radio-count"></div>
      <div class="scww-radio-time">
        <span class="elapsed">0:00</span>
        <span class="duration">∞</span>
      </div>
      <div class="scww-radio-meter"><span></span></div>
      <div class="status">SIGNAL: DORMANT</div>
      <div class="scww-radio-resume">PRESS PLAY TO RESUME</div>
    </div>
    <div class="scww-radio-transport">
      <button class="prev">◀</button>
      <button class="play">▶</button>
      <button class="next">▶▶</button>
    </div>
    <div class="scww-radio-controls">
      <button class="stop">■ STOP</button>
      <button class="loop">↻ OFF</button>
    </div>
    <div class="scww-radio-volume-label">
      <span>VOLUME</span>
      <span class="volume-value">27%</span>
    </div>
    <input
      class="scww-radio-volume"
      type="range"
      min="0"
      max="1"
      step="0.01"
      value="0.27"
      aria-label="Radio volume"
    >
    <div class="scww-radio-hint">SITE-WIDE PORTAL PLAYLIST</div>
    <audio preload="metadata"></audio>
  `;
  document.body.append(player);

  const query = (selector) => player.querySelector(selector);
  const audio = query('audio');
  const playButton = query('.play');
  const status = query('.status');
  const resumeMessage = query('.scww-radio-resume');
  const meter = query('.scww-radio-meter span');
  const volume = query('.scww-radio-volume');
  const volumeValue = query('.volume-value');
  const title = query('.scww-radio-track');
  const count = query('.scww-radio-count');
  const elapsed = query('.elapsed');
  const duration = query('.duration');
  const loopButton = query('.loop');

  let state = {
    current: 0,
    time: 0,
    volume: 0.27,
    loop: false,
    playing: false,
    updatedAt: Date.now(),
  };

  try {
    state = {
      ...state,
      ...JSON.parse(localStorage.getItem(STATE_KEY) || '{}'),
    };
  } catch {
    // Invalid or unavailable storage falls back to the defaults above.
  }

  state.current = Math.max(
    0,
    Math.min(tracks.length - 1, Number(state.current) || 0),
  );
  state.volume = Math.max(0, Math.min(1, Number(state.volume) || 0));
  state.loop = Boolean(state.loop);

  let audioContext = null;
  let audioNodes = [];
  let masterGain = null;
  let meterTimer = null;
  let droneTimer = null;
  let droneBase = Number(state.time) || 0;
  let droneStart = 0;
  let isPlaying = false;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return '0:00';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = String(Math.floor(seconds % 60)).padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  }

  function getCurrentTime() {
    if (tracks[state.current].type === 'portal') {
      return droneBase + (isPlaying ? (Date.now() - droneStart) / 1000 : 0);
    }

    return Number(audio.currentTime) || state.time || 0;
  }

  function saveState() {
    state.time = getCurrentTime();
    state.volume = Number(volume.value);
    state.playing = isPlaying;
    state.updatedAt = Date.now();
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  function renderPlayer() {
    title.textContent = tracks[state.current].title;
    count.textContent = `${String(state.current + 1).padStart(2, '0')} / ${String(
      tracks.length,
    ).padStart(2, '0')}`;
    loopButton.textContent = state.loop ? '↻ ON' : '↻ OFF';
    loopButton.classList.toggle('active', state.loop);
    loopButton.setAttribute('aria-pressed', String(state.loop));
    audio.loop = state.loop;
    volume.value = state.volume;
    volumeValue.textContent = `${Math.round(state.volume * 100)}%`;
    elapsed.textContent = formatTime(state.time);
    duration.textContent = tracks[state.current].type === 'portal' ? '∞' : '--:--';
  }

  function stopDrone() {
    clearInterval(droneTimer);
    droneTimer = null;

    if (!audioContext) {
      return;
    }

    audioNodes.forEach((node) => {
      try {
        if (node.stop) {
          node.stop();
        }
      } catch {
        // Nodes may already be stopped.
      }
    });

    audioContext.close();
    audioContext = null;
    audioNodes = [];
    masterGain = null;
  }

  function stopMedia(reset = false) {
    stopDrone();
    audio.pause();
    clearInterval(meterTimer);
    meterTimer = null;
    meter.style.width = '5%';

    if (reset) {
      state.time = 0;
      droneBase = 0;

      try {
        audio.currentTime = 0;
      } catch {
        // Audio may not have loaded metadata yet.
      }
    }
  }

  function setVolume() {
    state.volume = Number(volume.value);
    audio.volume = state.volume;
    volumeValue.textContent = `${Math.round(state.volume * 100)}%`;

    if (masterGain && audioContext) {
      masterGain.gain.setTargetAtTime(
        state.volume * 0.3,
        audioContext.currentTime,
        0.015,
      );
    }

    saveState();
  }

  function startDrone() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    masterGain.gain.value = state.volume * 0.3;
    masterGain.connect(audioContext.destination);

    [55, 82.41, 110].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = index === 1 ? 'triangle' : 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.value = index ? 0.18 : 0.42;
      oscillator.connect(gain).connect(masterGain);
      oscillator.start();
      audioNodes.push(oscillator, gain);
    });

    droneBase = Number(state.time) || 0;
    droneStart = Date.now();
    droneTimer = setInterval(() => {
      state.time = getCurrentTime();
      elapsed.textContent = formatTime(state.time);
    }, 250);
  }

  async function start(fromRestore = false) {
    stopMedia(false);
    renderPlayer();
    isPlaying = true;
    state.playing = true;
    status.textContent = 'SIGNAL: RECEIVING';
    resumeMessage.style.display = 'none';
    playButton.textContent = '❚❚';
    meterTimer = setInterval(() => {
      meter.style.width = `${15 + Math.random() * 80}%`;
    }, 120);

    if (tracks[state.current].type === 'portal') {
      startDrone();
      saveState();
      return;
    }

    audio.src = tracks[state.current].src;
    audio.loop = state.loop;
    audio.volume = state.volume;

    const seek = () => {
      let time = Number(state.time) || 0;

      if (fromRestore && state.updatedAt) {
        time += (Date.now() - state.updatedAt) / 1000;
      }

      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        time %= audio.duration;
      }

      try {
        audio.currentTime = time;
      } catch {
        // Seeking can fail until the browser has enough metadata.
      }
    };

    audio.addEventListener('loadedmetadata', seek, { once: true });

    try {
      await audio.play();
      saveState();
    } catch {
      isPlaying = false;
      state.playing = false;
      playButton.textContent = '▶';
      status.textContent = 'SIGNAL: PAUSED';
      resumeMessage.style.display = 'block';
      clearInterval(meterTimer);
      meter.style.width = '5%';
      saveState();
    }
  }

  function pause() {
    state.time = getCurrentTime();
    stopMedia(false);
    isPlaying = false;
    state.playing = false;
    playButton.textContent = '▶';
    status.textContent = 'SIGNAL: PAUSED';
    elapsed.textContent = formatTime(state.time);
    saveState();
  }

  function changeTrack(offset) {
    const shouldResume = isPlaying;
    state.time = 0;
    state.current = (state.current + offset + tracks.length) % tracks.length;
    stopMedia(true);
    isPlaying = false;
    renderPlayer();
    saveState();

    if (shouldResume) {
      start(false);
    }
  }

  volume.addEventListener('input', setVolume);
  playButton.addEventListener('click', () => {
    if (isPlaying) {
      pause();
    } else {
      start(false);
    }
  });

  query('.stop').addEventListener('click', () => {
    stopMedia(true);
    isPlaying = false;
    state.playing = false;
    state.time = 0;
    playButton.textContent = '▶';
    status.textContent = 'SIGNAL: DORMANT';
    elapsed.textContent = '0:00';
    saveState();
  });

  query('.prev').addEventListener('click', () => changeTrack(-1));
  query('.next').addEventListener('click', () => changeTrack(1));

  loopButton.addEventListener('click', () => {
    state.loop = !state.loop;
    audio.loop = state.loop;
    renderPlayer();
    saveState();
  });

  audio.addEventListener('loadedmetadata', () => {
    duration.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    state.time = audio.currentTime;
    elapsed.textContent = formatTime(audio.currentTime);

    if (Number.isFinite(audio.duration)) {
      duration.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener('ended', () => {
    if (state.loop) {
      return;
    }

    if (state.current < tracks.length - 1) {
      state.current += 1;
      state.time = 0;
      start(false);
      return;
    }

    isPlaying = false;
    state.playing = false;
    playButton.textContent = '▶';
    status.textContent = 'SIGNAL: COMPLETE';
    saveState();
  });

  window.addEventListener('pagehide', saveState);
  window.addEventListener('beforeunload', saveState);

  setInterval(() => {
    if (isPlaying) {
      saveState();
    }
  }, 1000);

  renderPlayer();
  setVolume();

  if (state.playing) {
    start(true);
  }
})();
