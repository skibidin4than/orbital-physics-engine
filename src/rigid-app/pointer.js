import {$,H,P,S,SPK,W,cv} from './state.js';
const {addBox,addOrb,addPoly,inPoly}=P;
export function initPointer(){
function pt(e){const r=cv.getBoundingClientRect();P.mx=(e.clientX-r.left)*W/r.width;P.my=(e.clientY-r.top)*H/r.height;}
function pick(){for(let i=P.bodies.length-1;i>=0;i--){const b=P.bodies[i];if(b.st)continue;
 const dx=P.mx-b.x,dy=P.my-b.y,co=Math.cos(b.a),si=Math.sin(b.a),lx=dx*co+dy*si,ly=-dx*si+dy*co;
 if(b.circ?dx*dx+dy*dy<=b.r*b.r:inPoly(b,lx,ly,0))return{b,lx,ly};}return null;}
cv.addEventListener('contextmenu',e=>{e.preventDefault();pt(e);const p=pick();if(p){P.bodies.splice(P.bodies.indexOf(p.b),1);if(P.grab&&P.grab.b===p.b)P.grab=null;}});
cv.addEventListener('pointerdown',e=>{if(e.button!==0)return;pt(e);P.grab=pick();if(!P.grab){S.aim={x:P.mx,y:P.my};cv.setPointerCapture(e.pointerId);$('stage').classList.add('played');}if(P.grab){cv.setPointerCapture(e.pointerId);$('stage').classList.add('played');cv.style.cursor='grabbing';}});
cv.addEventListener('pointermove',e=>{pt(e);if(!P.grab)cv.style.cursor=pick()?'grab':'default';});
const endGrab=()=>{if(S.aim){const k={box:addBox,tri:(x,y)=>addPoly(3,x,y),pen:(x,y)=>addPoly(5,x,y),hex:(x,y)=>addPoly(6,x,y)}[S.aimKind]||addOrb,b=k(S.aim.x,S.aim.y);b.vx=(P.mx-S.aim.x)*SPK;b.vy=(P.my-S.aim.y)*SPK;S.aim=null;}P.grab=null;cv.style.cursor='default';};
cv.addEventListener('pointerup',endGrab);
cv.addEventListener('pointercancel',()=>{S.aim=null;P.grab=null;cv.style.cursor='default';});
}
