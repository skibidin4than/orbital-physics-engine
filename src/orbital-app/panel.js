import {$,B,S,hist,sim} from './state.js';
import {resetView,zoom} from './camera.js';
import {clear,loadScn} from './scenario.js';
const capped=()=>!S.paused&&S.eff<.95;
function badge(){const t=S.paused?'PAUSED':(S.ts!==1||capped())?'TIME '+S.ts.toFixed(2)+'x'+(capped()?' \u00b7 capped at '+(S.ts*S.eff).toFixed(2)+'x':''):'';$('badge').textContent=t;$('badge').classList.toggle('show',!!t);}
export function warpText(){$('tv').textContent=S.ts.toFixed(2)+'x'+(capped()?' (running '+(S.ts*S.eff).toFixed(2)+'x)':'');badge();}
export function initPanel(){
function setTS(v){S.ts=v;S.eff=1;S.reqT=S.doneT=0;$('tsl').value=v;warpText();}
function togglePause(){S.paused=!S.paused;$('bPause').setAttribute('aria-pressed',S.paused);$('bPause').querySelector('span').textContent=S.paused?'Resume':'Pause';badge();}
function toggleSlow(){if(S.ts>.3){S.preTs=S.ts;setTS(.25);}else setTS(S.preTs);}
const seg=(id,fn)=>document.querySelectorAll('#'+id+' button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#'+id+' button').forEach(x=>x.classList.toggle('on',x===b));fn(b);});
seg('seg',b=>{sim.method=b.dataset.m;sim.E0=null;hist.length=0;});
seg('pre',b=>loadScn(b.dataset.p));
$('dt').oninput=e=>{sim.dt=+e.target.value;$('dv').textContent=sim.dt.toFixed(2);sim.E0=null;};
$('tsl').oninput=e=>setTS(+e.target.value);
$('mass').oninput=e=>$('mv').textContent=(+e.target.value).toFixed(1);
$('trl').onchange=e=>S.showTrail=e.target.checked;
$('bPause').onclick=togglePause;$('bSlow').onclick=toggleSlow;$('bRst').onclick=()=>{const on=document.querySelector('#pre .on');loadScn(on?on.dataset.p:'solar');};
$('bZi').onclick=()=>zoom(1.3);$('bZo').onclick=()=>zoom(1/1.3);$('bFit').onclick=resetView;
$('bClr').onclick=clear;
$('bDeb').onclick=()=>{const c=B.reduce((a,b)=>b.m>a.m?b:a,B[0]);if(!c)return;for(let i=0;i<200;i++){const r=60+Math.random()*260;
 sim.circ(r,.01+Math.random()*.04,Math.random()*360,Math.random()*6.283,.95+Math.random()*.1,c.m,c.x,c.y,c.vx,c.vy);}};
window.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.metaKey||e.ctrlKey)return;const k=e.key.toLowerCase();
 if(k==='c')clear();else if(k==='s')toggleSlow();else if(k==='+'||k==='=')zoom(1.3);else if(k==='-')zoom(1/1.3);else if(k==='0')resetView();else if(k==='escape')S.sel=null;
 else if(k===' '&&e.target.tagName!=='BUTTON'){e.preventDefault();togglePause();}});
}
