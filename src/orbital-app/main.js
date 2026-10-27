import {$,B,BUDGET_MS,H,MAXSTEPS,S,SIMRATE,W,cv,hist,sim} from './state.js';
import {cam} from './camera.js';
import {loadScn} from './scenario.js';
import {initEffects,stepSparks} from './effects.js';
import {draw} from './render.js';
import {showSel} from './selection.js';
import {drawGraph} from './graph.js';
import {initPointer} from './pointer.js';
import {initPanel,warpText} from './panel.js';
import {createQuality} from '../shared/quality.js';
import '../shared/ui.js';
const tuneQuality=createQuality(S,cv,W,H);
let last=performance.now(),fc=0,ft=0,acc=0,tc=0,drift=0;
function loop(t){const f=Math.max(0,Math.min(.05,(t-last)/1000));last=t;S.clock+=f;
 if(!S.paused){const want=f*SIMRATE*S.ts,t0=performance.now();acc+=want;let n=0;
  while(acc>=sim.dt&&n<MAXSTEPS&&performance.now()-t0<BUDGET_MS){sim.tick();acc-=sim.dt;n++;}
  S.reqT+=want;S.doneT+=n*sim.dt;if(acc>=sim.dt)acc=0;
  if(++tc%2===0)for(const b of B){b.tr.push(b.x,b.y);if(b.tr.length>360)b.tr.splice(0,2);}
  stepSparks(f);}
 if(S.sel&&!B.includes(S.sel))S.sel=null;if(S.sel){cam.x+=(S.sel.x-cam.x)*.12;cam.y+=(S.sel.y-cam.y)*.12;}
 draw();drawGraph();fc++;ft+=f;
 if(ft>=.4){const fps=Math.round(fc/ft);$('sf').textContent=fps;tuneQuality(fps);fc=0;ft=0;$('sb').textContent=B.length;showSel();
  if(!S.paused&&S.reqT>0){S.eff=Math.min(1,S.doneT/S.reqT);warpText();}S.reqT=S.doneT=0;
  if(sim.E0!==null&&B.length>1&&B.length<=400){drift=sim.driftPct();hist.push(drift);if(hist.length>120)hist.shift();$('se').textContent=(drift>=0?'+':'')+drift.toFixed(3)+'%';}
  else if(B.length>400)$('se').textContent='n/a';}
 requestAnimationFrame(loop);}
initEffects();initPointer();initPanel();loadScn('solar');requestAnimationFrame(loop);
