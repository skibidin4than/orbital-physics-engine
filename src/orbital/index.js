import {G,EPS2,SUN,CX,CY,STAR_M,rad} from './constants.js';
import {createPresets} from './presets.js';
import {createForces} from './forces.js';
import {createIntegrator} from './integrators.js';
import {createMerger} from './merge.js';
import {energy} from './energy.js';
export function create(){
const B=[],S={B,method:'verlet',dt:.1,E0:null,onMerge:null,G,EPS2,rad,STAR_M,accelCalls:0};
function add(x,y,vx,vy,m,hue){const b={x,y,vx,vy,m,r:rad(m),hue:hue==null?Math.random()*360:hue,tr:[]};B.push(b);S.E0=null;return b;}
function circ(r,m,hue,ph,k,Mc,cx,cy,bvx,bvy){Mc=Mc||SUN;cx=cx==null?CX:cx;cy=cy==null?CY:cy;const v=Math.sqrt(G*Mc/r)*(k||1);
 return add(cx+r*Math.cos(ph),cy+r*Math.sin(ph),(bvx||0)-v*Math.sin(ph),(bvy||0)+v*Math.cos(ph),m,hue);}
const {PRESETS,zeroP}=createPresets(B,add,circ);
function load(n){B.length=0;PRESETS[n]();zeroP();S.E0=null;}
function clear(){for(let i=B.length-1;i>=0;i--)if(B[i].m<STAR_M)B.splice(i,1);S.E0=null;}
const forces=createForces(S),{P,ens,accel}=forces;
const {integrate,resetAccelCache}=createIntegrator(S,B,forces);
const merge=createMerger(S,B);
function tick(){integrate(S.dt);merge();
 for(let i=B.length-1;i>=0;i--)if(Math.abs(B[i].x-CX)+Math.abs(B[i].y-CY)>6000){B.splice(i,1);S.E0=null;}
 if(S.E0===null&&B.length<=400){S.E0=energy(B);}}
let PV=null;

function predict(x,y,vx,vy,m,horizon,maxBodies){horizon=horizon||60;maxBodies=maxBodies||80;
 const T=PV||(PV=create());T.method=S.method;T.dt=S.dt;T.onMerge=null;T.B.length=0;
 const src=B.length>maxBodies?B.slice().sort((a,b)=>b.m-a.m).slice(0,maxBodies):B;
 for(const b of src)T.add(b.x,b.y,b.vx,b.vy,b.m,b.hue);
 const nb=T.add(x,y,vx,vy,m,0),out=[x,y],steps=Math.min(1200,Math.ceil(horizon/S.dt)),every=Math.max(1,Math.round(.8/S.dt));
 for(let s=1;s<=steps;s++){T.tick();if(!T.B.includes(nb))break;if(s%every===0)out.push(nb.x,nb.y);}
 return out;}
function driftPct(){return S.E0===null||B.length<2?0:(energy(B)-S.E0)/Math.abs(S.E0)*100;}
Object.assign(S,{add,circ,load,clear,tick,energy:()=>energy(B),driftPct,accel,ens,P,predict,resetAccelCache});
return S;
}
