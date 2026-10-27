import {P,S} from './state.js';
function impact(c,sp){
 if(S.sparks.length>240)return;
 const A=c.A,B=c.B,hue=(A.st?B:A).hue,n=Math.min(8,Math.floor(sp/70));
 for(let i=0;i<n;i++){const an=Math.random()*6.283,v=60+Math.random()*sp*0.5;
  S.sparks.push({x:c.x,y:c.y,vx:Math.cos(an)*v,vy:Math.sin(an)*v-40,l:1,h:hue+Math.random()*30-15});}
 const f=Math.min(1,sp/700);if(!A.st)A.flash=Math.max(A.flash,f);if(!B.st)B.flash=Math.max(B.flash,f);
}
export function initEffects(){P.onImpact=impact;}
export function stepSparks(sd){for(const p of S.sparks){p.x+=p.vx*sd;p.y+=p.vy*sd;p.vy+=400*sd;p.l-=sd*1.8;}S.sparks=S.sparks.filter(p=>p.l>0);}
