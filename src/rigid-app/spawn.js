import {P,S,W,cv} from './state.js';
const {addBox,addOrb,addPoly,pyramid}=P;
export const spawnBox=()=>{S.aimKind='box';addBox(80+Math.random()*(W-160),40);},spawnOrb=()=>{S.aimKind='orb';addOrb(80+Math.random()*(W-160),40);};
export const spawnPoly=(n,kind)=>{S.aimKind=kind;addPoly(n,80+Math.random()*(W-160),40);};
export const spawnRain=()=>{const f=[spawnBox,spawnOrb,()=>spawnPoly(3,'tri'),()=>spawnPoly(5,'pen'),()=>spawnPoly(6,'hex')];for(let i=0;i<8;i++)f[i%5]();};
export const spawnPyr=()=>{P.bodies=P.bodies.filter(b=>b.st);P.grab=null;cv.style.cursor='default';pyramid();},clearAll=()=>{P.bodies=P.bodies.filter(b=>b.st);S.sparks=[];P.grab=null;};
