import {$,P,S} from './state.js';
import {clearAll,spawnBox,spawnOrb,spawnPoly,spawnPyr,spawnRain} from './spawn.js';
export function initPanel(){
function badge(){const t=S.paused?'PAUSED':S.ts!==1?'TIME '+S.ts.toFixed(2)+'x':'';$('badge').textContent=t;$('badge').classList.toggle('show',!!t);}
function togglePause(){S.paused=!S.paused;$('bPause').setAttribute('aria-pressed',S.paused);$('bPause').querySelector('span').textContent=S.paused?'Resume':'Pause';badge();}
function setTS(v){S.ts=v;$('tsl').value=v;$('tv').textContent=v.toFixed(2)+'x';$('bSlow').setAttribute('aria-pressed',v<1);badge();}
function toggleSlow(){setTS(S.ts<1?1:.25);}
$('tsl').oninput=e=>setTS(+e.target.value);
function setG(v){P.GS=v;$('grav').value=v;$('gv').textContent=v.toFixed(2)+' g';
 document.querySelectorAll('#seg button').forEach(b=>b.classList.toggle('on',Math.abs(+b.dataset.g-v)<.005));}
$('bBox').onclick=spawnBox;$('bOrb').onclick=spawnOrb;$('bPyr').onclick=spawnPyr;$('bTri').onclick=()=>spawnPoly(3,'tri');$('bPen').onclick=()=>spawnPoly(5,'pen');$('bHex').onclick=()=>spawnPoly(6,'hex');$('bRain').onclick=spawnRain;$('bClr').onclick=clearAll;
$('bStep').onclick=()=>{if(!S.paused)togglePause();S.stepReq=true;};$('bPause').onclick=togglePause;$('bSlow').onclick=toggleSlow;
document.querySelectorAll('#seg button').forEach(b=>b.onclick=()=>setG(+b.dataset.g));
$('grav').oninput=e=>setG(+e.target.value);
$('rest').oninput=e=>{P.REST=+e.target.value;$('rv').textContent=P.REST.toFixed(2);};
$('fric').oninput=e=>{P.MU=+e.target.value;$('fv').textContent=P.MU.toFixed(2);};
window.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.metaKey||e.ctrlKey)return;
 const k=e.key.toLowerCase();
 if(k==='b')spawnBox();else if(k==='o')spawnOrb();else if(k==='p')spawnPyr();else if(k==='t')spawnPoly(3,'tri');else if(k==='g')spawnPoly(5,'pen');else if(k==='h')spawnPoly(6,'hex');else if(k==='r')spawnRain();else if(k==='c')clearAll();
 else if(k==='s')toggleSlow();else if(k==='n'){if(!S.paused)togglePause();S.stepReq=true;}else if(k===' '&&e.target.tagName!=='BUTTON'){e.preventDefault();togglePause();}});
}
