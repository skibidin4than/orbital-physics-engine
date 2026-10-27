import {$,B,H,S,SPK,STAR_M,W,ctx,rad,sim,vr} from './state.js';
import {cam} from './camera.js';
import {drawBackdrop} from './backdrop.js';
function preview(){const p=sim.predict(S.aim.x,S.aim.y,(S.mx-S.aim.x)*SPK,(S.my-S.aim.y)*SPK,+$('mass').value),d=2/cam.z;ctx.fillStyle='rgba(251,191,36,.8)';
 for(let i=0;i<p.length;i+=2)ctx.fillRect(p[i]-d/2,p[i+1]-d/2,d,d);}
function drawTrails(z){
 if(S.showTrail)for(const b of B){const t=b.tr,n=t.length;if(n<4)continue;ctx.lineWidth=1.3/z;ctx.lineCap='round';
  if(S.lite){ctx.strokeStyle='hsla('+b.hue+',90%,65%,.28)';ctx.beginPath();ctx.moveTo(t[0],t[1]);for(let i=2;i<n;i+=2)ctx.lineTo(t[i],t[i+1]);ctx.stroke();continue;}
  for(let seg=0;seg<3;seg++){const a=Math.floor(n/3/2)*2*seg,e=seg===2?n:Math.floor(n/3/2)*2*(seg+1)+2;
   ctx.strokeStyle='hsla('+b.hue+',90%,65%,'+(.12+.2*seg)+')';ctx.beginPath();ctx.moveTo(t[a],t[a+1]);for(let i=a+2;i<e;i+=2)ctx.lineTo(t[i],t[i+1]);ctx.stroke();}}
}
function drawBodies(z){
 for(const b of B){const r=vr(b),sun=b.m>=STAR_M;ctx.save();
  if(sun){const pu=1+.06*Math.sin(S.clock*1.6);ctx.globalCompositeOperation='lighter';
   const c=ctx.createRadialGradient(b.x,b.y,r*.5,b.x,b.y,r*4.8*pu);c.addColorStop(0,'hsla('+b.hue+',100%,60%,.6)');c.addColorStop(1,'hsla('+b.hue+',100%,50%,0)');ctx.fillStyle=c;ctx.beginPath();ctx.arc(b.x,b.y,r*4.8*pu,0,7);ctx.fill();
   ctx.lineWidth=1.2/z;for(let k=0;k<12;k++){const a=S.clock*.15+k*.5236,l=r*(.7+.3*Math.sin(S.clock*2.2+k*1.7));ctx.strokeStyle='hsla('+b.hue+',100%,70%,.14)';ctx.beginPath();ctx.moveTo(b.x+Math.cos(a)*r,b.y+Math.sin(a)*r);ctx.lineTo(b.x+Math.cos(a)*(r+l),b.y+Math.sin(a)*(r+l));ctx.stroke();}
   ctx.globalCompositeOperation='source-over';}
  else if(!S.lite){ctx.shadowColor='hsl('+b.hue+',100%,60%)';ctx.shadowBlur=10;}
  const q=ctx.createRadialGradient(b.x-r*.35,b.y-r*.35,r*.1,b.x,b.y,r);q.addColorStop(0,'hsl('+b.hue+',95%,85%)');q.addColorStop(.7,'hsl('+b.hue+',80%,'+(sun?55:42)+'%)');q.addColorStop(1,'hsl('+b.hue+',70%,'+(sun?45:16)+'%)');
  ctx.fillStyle=q;ctx.beginPath();ctx.arc(b.x,b.y,r,0,7);ctx.fill();ctx.shadowBlur=0;
  if(!sun&&b.m>=5){ctx.strokeStyle='hsla('+b.hue+',90%,78%,.75)';ctx.lineWidth=1.4/z;ctx.beginPath();ctx.ellipse(b.x,b.y,r*1.9,r*.5,-.4,0,7);ctx.stroke();}
  ctx.restore();}
}
function drawSelection(z){
 if(S.sel){const r=vr(S.sel)+6/z;ctx.save();ctx.strokeStyle='#fbbf24';ctx.lineWidth=1.4/z;ctx.setLineDash([4/z,4/z]);ctx.beginPath();ctx.arc(S.sel.x,S.sel.y,r,0,7);ctx.stroke();ctx.restore();}
}
function drawSparks(z){
 ctx.globalCompositeOperation='lighter';for(const p of S.sparks){ctx.fillStyle='hsla('+p.h+',100%,65%,'+Math.max(0,p.l)+')';ctx.fillRect(p.x-1/z,p.y-1/z,2/z,2/z);}ctx.globalCompositeOperation='source-over';
}
function drawAim(z){
 if(S.aim){preview();ctx.save();ctx.strokeStyle=ctx.fillStyle='#fbbf24';ctx.lineWidth=2/z;ctx.setLineDash([6/z,5/z]);ctx.beginPath();ctx.moveTo(S.aim.x,S.aim.y);ctx.lineTo(S.mx,S.my);ctx.stroke();ctx.setLineDash([]);
  const an=Math.atan2(S.my-S.aim.y,S.mx-S.aim.x),s=10/z;ctx.beginPath();ctx.moveTo(S.mx,S.my);ctx.lineTo(S.mx-s*Math.cos(an-.4),S.my-s*Math.sin(an-.4));ctx.lineTo(S.mx-s*Math.cos(an+.4),S.my-s*Math.sin(an+.4));ctx.fill();
  ctx.beginPath();ctx.arc(S.aim.x,S.aim.y,rad(+$('mass').value),0,7);ctx.fill();ctx.restore();}
}
export function draw(){
drawBackdrop();
const z=cam.z;ctx.setTransform(S.dpr*z,0,0,S.dpr*z,S.dpr*(W/2-cam.x*z),S.dpr*(H/2-cam.y*z));
drawTrails(z);drawBodies(z);drawSelection(z);drawSparks(z);drawAim(z);
}
