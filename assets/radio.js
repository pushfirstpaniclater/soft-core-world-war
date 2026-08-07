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
    #scww-webamp-shell{position:fixed;right:12px;top:54px;z-index:9998;width:570px;height:285px;pointer-events:none}
    #scww-webamp-shell>*{pointer-events:auto}
    #scww-webamp-label{position:absolute;right:0;top:-22px;color:#54ff3d;background:#050505;border:1px solid #54ff3d;padding:3px 6px;font:10px/1 "Lucida Console",Monaco,"Courier New",monospace;text-shadow:none;letter-spacing:.05em;pointer-events:none}
    @media(max-width:760px){#scww-webamp-shell{position:absolute;left:50%;right:auto;top:82px;transform:translateX(-50%);width:550px;max-width:100vw;height:285px;transform-origin:top center;scale:.78}#scww-webamp-label{display:none}}
    @media(max-width:470px){#scww-webamp-shell{scale:.62;top:70px}}
  `;
  document.head.append(style);

  const shell = document.createElement('div');
  shell.id = 'scww-webamp-shell';
  shell.innerHTML = '<div id="scww-webamp-label">SCWW RADIO // WEBAMP + MILKDROP</div>';
  document.body.append(shell);

  (async () => {
    try {
      const mod = await import('https://unpkg.com/webamp@2.3.1/butterchurn');
      const Webamp = mod.default;
      if (!Webamp?.browserIsSupported?.()) {
        shell.innerHTML = '<div id="scww-webamp-label">SCWW RADIO // WEBAMP UNSUPPORTED</div>';
        return;
      }

      const webamp = new Webamp({
        initialTracks: tracks,
        enableMediaSession: true,
        enableHotkeys: true,
        zIndex: 9999,
        windowLayout: {
          main: {
            position: { top: 0, left: 0 },
            closed: false,
          },
          playlist: {
            position: { top: 116, left: 0 },
            size: { extraHeight: 1, extraWidth: 0 },
            closed: false,
          },
          milkdrop: {
            position: { top: 0, left: 275 },
            size: { extraHeight: 3, extraWidth: 0 },
            closed: false,
          },
        },
      });

      window.scwwWebamp = webamp;
      await webamp.renderInto(shell);
    } catch (error) {
      console.error('SCWW Webamp failed to initialize', error);
      shell.innerHTML = '<div id="scww-webamp-label">SCWW RADIO // SIGNAL FAILED</div>';
    }
  })();
})();