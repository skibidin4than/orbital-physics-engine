import {$,B,H,S,SPK,W,cv,sim,vr} from './state.js';
import {cam,resetView,toW,zoom} from './camera.js';
export function initPointer(){
function pt(e){const r=cv.getBoundingClientRect();S.sx=(e.clientX-r.left)*W/r.width;S.sy=(e.clientY-r.top)*H/r.height;[S.mx,S.my]=toW(S.sx,S.sy);}
cv.addEventListener('contextmenu',e=>e.preventDefault());

const tp=new Map();let pinch=null;
const spt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height];};
function pinchStart(){const [p,q]=[...tp.values()],mxs=(p[0]+q[0])/2,mys=(p[1]+q[1])/2;pinch={d:Math.hypot(p[0]-q[0],p[1]-q[1])||1,z:cam.z,w:toW(mxs,mys)};}
function pinchMove(){const [p,q]=[...tp.values()],mxs=(p[0]+q[0])/2,mys=(p[1]+q[1])/2;
 cam.z=Math.max(.1,Math.min(8,pinch.z*(Math.hypot(p[0]-q[0],p[1]-q[1])||1)/pinch.d));
 cam.x=pinch.w[0]-(mxs-W/2)/cam.z;cam.y=pinch.w[1]-(mys-H/2)/cam.z;}
cv.addEventListener('pointerdown',e=>{pt(e);cv.setPointerCapture(e.pointerId);$('stage').classList.add('played');
 if(e.pointerType==='touch'){tp.set(e.pointerId,spt(e));if(tp.size===2){S.aim=null;S.pan=null;S.sel=null;pinchStart();return;}if(tp.size>2)return;}
 if(e.button!==0||e.shiftKey){S.sel=null;S.pan={sx:S.sx,sy:S.sy,cx:cam.x,cy:cam.y};cv.style.cursor='move';}else S.aim={x:S.mx,y:S.my};});
cv.addEventListener('pointermove',e=>{pt(e);if(tp.has(e.pointerId)){tp.set(e.pointerId,spt(e));if(pinch&&tp.size===2){pinchMove();return;}}if(S.pan){cam.x=S.pan.cx-(S.sx-S.pan.sx)/cam.z;cam.y=S.pan.cy-(S.sy-S.pan.sy)/cam.z;[S.mx,S.my]=toW(S.sx,S.sy);}});
const up=e=>{pt(e);const wasPinch=!!pinch;tp.delete(e.pointerId);if(tp.size<2)pinch=null;if(wasPinch){S.aim=null;S.pan=null;return;}if(S.aim&&Math.hypot(S.mx-S.aim.x,S.my-S.aim.y)<5/cam.z){let hit=null,bd=1e9;for(const b of B){const d=Math.hypot(b.x-S.mx,b.y-S.my);if(d<vr(b)+6/cam.z&&d<bd){bd=d;hit=b;}}if(hit){S.sel=hit;S.aim=null;}}
 if(S.aim&&Math.hypot(S.mx-S.aim.x,S.my-S.aim.y)>=5/cam.z)sim.add(S.aim.x,S.aim.y,(S.mx-S.aim.x)*SPK,(S.my-S.aim.y)*SPK,+$('mass').value);
 S.aim=null;S.pan=null;cv.style.cursor='crosshair';};
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',e=>{tp.delete(e.pointerId);pinch=null;S.aim=null;S.pan=null;});
cv.addEventListener('wheel',e=>{e.preventDefault();pt(e);zoom(Math.exp(-e.deltaY*.0015),true);},{passive:false});
cv.addEventListener('dblclick',resetView);cv.style.cursor='crosshair';
}
