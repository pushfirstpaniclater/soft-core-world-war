(()=>{
'use strict';
const STATE_KEY='scwwRadioStateV1';
const tracks=[
 {title:'MENTAL INFRASTRUCTURE DRONE',type:'portal'},
 {title:'PROTECT — IGHT',type:'audio',src:'assets/music/protect-ight.mp3'},
 {title:'I MISS YOU KLICKAUD',type:'audio',src:'assets/music/I_Miss_You_KLICKAUD.mp3'},
 {title:"I DON'T KNOW WHEN I'M SUPPOSED TO STOP",type:'audio',src:"assets/music/i don't know when i'm supposed to stop.mp3"},
 {title:'I WISH I COULD SLEEP FOREVER',type:'audio',src:'assets/music/i wish i could sleep forever.mp3'},
 {title:'JESH FREESTYLE',type:'audio',src:'assets/music/onlymp3.to - Jesh Freestyle-pIUFgBGltZY-256k-1659953062993.mp3'},
 {title:"SHARC & PI'ERRE BOURNE — YES SIR",type:'audio',src:"assets/music/Sharc & Pi'erre Bourne - _Yes Sir_ OFFICIAL VERSION.mp3"},
 {title:'TWELFTH STREET RAG',type:'audio',src:'assets/music/SpongeBob Production Music Twelfth Street Rag.mp3'},
 {title:'YEAT — IF WE BEING REAL (SLOWED + REVERB)',type:'audio',src:'assets/music/yeat - if we being real (𝙎𝙡𝙤𝙬𝙚𝙙  𝙧𝙚𝙫𝙚𝙧𝙗).mp3'},
 {title:'KANYE WEST — THE END OF IT',type:'audio',src:'assets/music/The End Of It - Kanye West (prod. Kid Cudi).mp3'}
];
const style=document.createElement('style');
style.textContent=`
.scww-radio{position:fixed;right:14px;top:50%;transform:translateY(-50%);z-index:9999;width:190px;border:2px solid #00eaff;background:rgba(0,0,0,.93);box-shadow:0 0 16px rgba(0,234,255,.45);padding:10px;color:#00eaff;font:12px/1.35 "Lucida Console",Monaco,"Courier New",monospace;text-shadow:none}
.scww-radio *{box-sizing:border-box}.scww-radio-title{color:#ff2cff;text-align:center;font-weight:bold;margin-bottom:8px}.scww-radio-screen{border:1px solid #00eaff;background:#020705;padding:7px;margin-bottom:8px}.scww-radio-track{color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.scww-radio-count{color:#ffea00;margin-top:3px}.scww-radio-time,.scww-radio-volume-label{display:flex;justify-content:space-between;font-variant-numeric:tabular-nums}.scww-radio-time{color:#7fff6a;margin-top:4px}.scww-radio-meter{height:8px;border:1px solid #ffea00;margin:7px 0;overflow:hidden}.scww-radio-meter span{display:block;width:5%;height:100%;background:#ffea00}.scww-radio-transport,.scww-radio-controls{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:6px}.scww-radio-controls{grid-template-columns:1fr 1fr}.scww-radio button{font:inherit;color:#ffea00;background:#111;border:1px solid #ffea00;padding:7px 3px;cursor:pointer}.scww-radio-volume-label{color:#ff2cff;margin-top:8px}.scww-radio-volume{width:100%;accent-color:#ff2cff;margin-top:3px}.scww-radio-hint{margin-top:6px;color:#7fff6a;font-size:10px;text-align:center}.scww-radio-resume{color:#ff46ff;margin-top:4px;display:none}
@media(max-width:1050px){.scww-radio{position:fixed;right:8px;top:auto;bottom:8px;transform:none;width:176px}}
`;
document.head.append(style);
const old=document.querySelector('.player');
if(old){const oldAudio=old.querySelector('audio');if(oldAudio)oldAudio.pause();old.remove()}
const player=document.createElement('aside');
player.className='scww-radio';
player.innerHTML=`<div class="scww-radio-title">SCWW RADIO</div><div class="scww-radio-screen"><div>NOW PLAYING:</div><div class="scww-radio-track"></div><div class="scww-radio-count"></div><div class="scww-radio-time"><span class="elapsed">0:00</span><span class="duration">∞</span></div><div class="scww-radio-meter"><span></span></div><div class="status">SIGNAL: DORMANT</div><div class="scww-radio-resume">PRESS PLAY TO RESUME</div></div><div class="scww-radio-transport"><button class="prev">◀</button><button class="play">▶</button><button class="next">▶▶</button></div><div class="scww-radio-controls"><button class="stop">■ STOP</button><button class="loop">↻ LOOP</button></div><div class="scww-radio-volume-label"><span>VOLUME</span><span class="volume-value">27%</span></div><input class="scww-radio-volume" type="range" min="0" max="1" step="0.01" value="0.27" aria-label="Radio volume"><div class="scww-radio-hint">SITE-WIDE PORTAL PLAYLIST</div><audio preload="metadata"></audio>`;
document.body.append(player);
const q=s=>player.querySelector(s),audio=q('audio'),playBtn=q('.play'),status=q('.status'),resume=q('.scww-radio-resume'),meter=q('.scww-radio-meter span'),vol=q('.scww-radio-volume'),volText=q('.volume-value'),title=q('.scww-radio-track'),count=q('.scww-radio-count'),elapsed=q('.elapsed'),duration=q('.duration'),loopBtn=q('.loop');
let state={current:0,time:0,volume:.27,loop:true,playing:false,updatedAt:Date.now()};
try{state={...state,...JSON.parse(localStorage.getItem(STATE_KEY)||'{}')}}catch{}
state.current=Math.max(0,Math.min(tracks.length-1,Number(state.current)||0));state.volume=Math.max(0,Math.min(1,Number(state.volume)||0));
let ac=null,nodes=[],master=null,meterTimer=null,droneTimer=null,droneBase=Number(state.time)||0,droneStart=0,isPlaying=false;
function fmt(n){if(!Number.isFinite(n)||n<0)return'0:00';return Math.floor(n/60)+':'+String(Math.floor(n%60)).padStart(2,'0')}
function currentTime(){return tracks[state.current].type==='portal'?(droneBase+(isPlaying?(Date.now()-droneStart)/1000:0)):(Number(audio.currentTime)||state.time||0)}
function save(){state.time=currentTime();state.volume=Number(vol.value);state.playing=isPlaying;state.updatedAt=Date.now();localStorage.setItem(STATE_KEY,JSON.stringify(state))}
function paint(){title.textContent=tracks[state.current].title;count.textContent=String(state.current+1).padStart(2,'0')+' / '+String(tracks.length).padStart(2,'0');loopBtn.textContent=state.loop?'↻ LOOP':'→ ONCE';vol.value=state.volume;volText.textContent=Math.round(state.volume*100)+'%';elapsed.textContent=fmt(state.time);duration.textContent=tracks[state.current].type==='portal'?'∞':'--:--'}
function stopDrone(){clearInterval(droneTimer);droneTimer=null;if(ac){nodes.forEach(n=>{try{n.stop&&n.stop()}catch{}});ac.close();ac=null;nodes=[];master=null}}
function stopMedia(reset=false){stopDrone();audio.pause();clearInterval(meterTimer);meterTimer=null;meter.style.width='5%';if(reset){state.time=0;droneBase=0;audio.currentTime=0}}
function setVolume(){state.volume=Number(vol.value);audio.volume=state.volume;volText.textContent=Math.round(state.volume*100)+'%';if(master&&ac)master.gain.setTargetAtTime(state.volume*.3,ac.currentTime,.015);save()}
function startDrone(){const A=window.AudioContext||window.webkitAudioContext;ac=new A;master=ac.createGain();master.gain.value=state.volume*.3;master.connect(ac.destination);[55,82.41,110].forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type=i===1?'triangle':'sine';o.frequency.value=f;g.gain.value=i?.18:.42;o.connect(g).connect(master);o.start();nodes.push(o,g)});droneBase=Number(state.time)||0;droneStart=Date.now();droneTimer=setInterval(()=>{state.time=currentTime();elapsed.textContent=fmt(state.time)},250)}
async function start(fromRestore=false){stopMedia(false);paint();isPlaying=true;state.playing=true;status.textContent='SIGNAL: RECEIVING';resume.style.display='none';playBtn.textContent='❚❚';meterTimer=setInterval(()=>meter.style.width=15+Math.random()*80+'%',120);if(tracks[state.current].type==='portal'){startDrone();save();return}audio.src=tracks[state.current].src;audio.volume=state.volume;const seek=()=>{let t=Number(state.time)||0;if(fromRestore&&state.updatedAt)t+=(Date.now()-state.updatedAt)/1000;if(Number.isFinite(audio.duration)&&audio.duration>0)t%=audio.duration;try{audio.currentTime=t}catch{}};audio.addEventListener('loadedmetadata',seek,{once:true});try{await audio.play();save()}catch{isPlaying=false;state.playing=false;playBtn.textContent='▶';status.textContent='SIGNAL: PAUSED';resume.style.display='block';clearInterval(meterTimer);meter.style.width='5%';save()}}
function pause(){state.time=currentTime();stopMedia(false);isPlaying=false;state.playing=false;playBtn.textContent='▶';status.textContent='SIGNAL: PAUSED';elapsed.textContent=fmt(state.time);save()}
function change(n){const resumePlay=isPlaying;state.time=0;state.current=(state.current+n+tracks.length)%tracks.length;stopMedia(true);isPlaying=false;paint();save();if(resumePlay)start(false)}
vol.addEventListener('input',setVolume);playBtn.addEventListener('click',()=>isPlaying?pause():start(false));q('.stop').addEventListener('click',()=>{stopMedia(true);isPlaying=false;state.playing=false;state.time=0;playBtn.textContent='▶';status.textContent='SIGNAL: DORMANT';elapsed.textContent='0:00';save()});q('.prev').addEventListener('click',()=>change(-1));q('.next').addEventListener('click',()=>change(1));loopBtn.addEventListener('click',()=>{state.loop=!state.loop;paint();save()});audio.addEventListener('loadedmetadata',()=>duration.textContent=fmt(audio.duration));audio.addEventListener('timeupdate',()=>{state.time=audio.currentTime;elapsed.textContent=fmt(audio.currentTime);if(Number.isFinite(audio.duration))duration.textContent=fmt(audio.duration)});audio.addEventListener('ended',()=>{if(state.current<tracks.length-1||state.loop){state.current=(state.current+1)%tracks.length;state.time=0;start(false)}else{isPlaying=false;state.playing=false;playBtn.textContent='▶';status.textContent='SIGNAL: COMPLETE';save()}});
window.addEventListener('pagehide',save);window.addEventListener('beforeunload',save);setInterval(()=>{if(isPlaying)save()},1000);
paint();setVolume();
if(state.playing){start(true)}
})();