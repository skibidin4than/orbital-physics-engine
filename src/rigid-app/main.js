import {$,H,P,S,W,cv} from './state.js';
import {initEffects,stepSparks} from './effects.js';
import {draw} from './render.js';
import {initPointer} from './pointer.js';
import {initPanel} from './panel.js';
import {createQuality} from '../shared/quality.js';
import '../shared/ui.js';
const tuneQuality=createQuality(S,cv,W,H);
const {h,reset,step}=P;
let last=performance.now(),acc=0,fc=0,ft=0;
function loop(t){
 const dt=Math.max(0,Math.min(.05,(t-last)/1000));last=t;S.clock+=dt;
 if(!S.paused){acc+=dt*S.ts;let n=0;while(acc>=h&&n<48){step();acc-=h;n++;}if(n>=48)acc=0;}
 if(S.paused&&S.stepReq)for(let i=0;i<4;i++)step();S.stepReq=false;
 if(!S.paused)for(const b of P.bodies)if(b.circ&&!b.st){(b.tr||(b.tr=[])).push(b.x,b.y);if(b.tr.length>80)b.tr.splice(0,2);}
 const sd=S.paused?0:dt*S.ts;
 for(const b of P.bodies){b.age+=dt;b.flash=Math.max(0,b.flash-dt*3);}
 stepSparks(sd);
 for(let i=P.bodies.length-1;i>=0;i--)if(P.bodies[i].y>H+600)P.bodies.splice(i,1);
 draw(dt);fc++;ft+=dt;
 if(ft>=.4){const fps=Math.round(fc/ft);$('sf').textContent=fps;tuneQuality(fps);fc=0;ft=0;$('sb').textContent=P.bodies.filter(b=>!b.st).length;$('sc').textContent=P.contacts.length;}
 requestAnimationFrame(loop);
}
initEffects();initPointer();initPanel();reset();requestAnimationFrame(loop);
