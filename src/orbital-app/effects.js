import {S,sim} from './state.js';
function boom(x,y,hue,e){for(let i=0;i<Math.min(24,6+e*4|0);i++){const a=Math.random()*6.283,v=.6+Math.random()*2;S.sparks.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,h:hue+Math.random()*40-20});}}
export function initEffects(){sim.onMerge=boom;}
export function stepSparks(f){for(const p of S.sparks){p.x+=p.vx*f*60*S.ts;p.y+=p.vy*f*60*S.ts;p.l-=f*1.6;}S.sparks=S.sparks.filter(p=>p.l>0);}
