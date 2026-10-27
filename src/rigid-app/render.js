import {$,H,P,S,W,ctx} from './state.js';
import {drawSky} from './backdrop.js';
function drawStatic(b){
 if(b.kind==='ground'){const top=b.y-b.hh;
  const g=ctx.createLinearGradient(0,top,0,H);g.addColorStop(0,'#2b2f55');g.addColorStop(1,'#0a0b1e');ctx.fillStyle=g;ctx.fillRect(0,top,W,H-top);
  ctx.save();if(S.lite){ctx.fillStyle='rgba(34,211,238,.22)';ctx.fillRect(0,top-5,W,8);}else{ctx.shadowColor='#22d3ee';ctx.shadowBlur=14;}ctx.fillStyle='#22d3ee';ctx.fillRect(0,top-1,W,2);ctx.restore();
  ctx.fillStyle='rgba(0,0,0,.25)';[[90,10],[300,12],[520,8],[720,11]].forEach(([x,r])=>{ctx.beginPath();ctx.ellipse(x,top+14,r*1.6,r*.35,0,0,7);ctx.fill();});
 }else{const left=b.x<W/2,x=left?0:W,g=ctx.createLinearGradient(x,0,left?x+26:x-26,0);
  g.addColorStop(0,'rgba(34,211,238,.28)');g.addColorStop(1,'rgba(34,211,238,0)');ctx.fillStyle=g;ctx.fillRect(left?0:W-26,0,26,H);}
}
function drawBodies(){
 for(const b of P.bodies){
  if(b.st){drawStatic(b);continue;}
  if(b.circ&&b.tr&&b.tr.length>4){ctx.strokeStyle='hsla('+b.hue+',90%,65%,.25)';ctx.lineWidth=2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(b.tr[0],b.tr[1]);for(let i=2;i<b.tr.length;i+=2)ctx.lineTo(b.tr[i],b.tr[i+1]);ctx.stroke();}
  const t=Math.min(1,b.age/.3),c1=1.70158,sc=1+(c1+1)*Math.pow(t-1,3)+c1*Math.pow(t-1,2);
  const hue=b.hue,L=62+b.flash*28,sp=Math.hypot(b.vx,b.vy);
  if(sp>350){ctx.strokeStyle='hsla('+hue+',100%,70%,'+Math.min(.35,sp/3000)+')';ctx.lineWidth=(b.circ?b.r:Math.min(b.hw,b.hh))*1.4;ctx.lineCap='round';
   ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-b.vx*.04,b.y-b.vy*.04);ctx.stroke();}
  ctx.save();ctx.translate(b.x,b.y);ctx.scale(sc,sc);
  ctx.save();ctx.rotate(b.a);if(!S.lite){ctx.shadowColor='hsl('+hue+',100%,60%)';ctx.shadowBlur=12+b.flash*26;}
  if(b.circ){const r=b.r,g=ctx.createRadialGradient(-r*.35,-r*.4,r*.1,0,0,r);
   g.addColorStop(0,'hsl('+hue+',90%,'+(L+12)+'%)');g.addColorStop(.6,'hsl('+hue+',70%,38%)');g.addColorStop(1,'hsl('+hue+',65%,14%)');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.shadowBlur=0;
   ctx.save();ctx.clip();ctx.fillStyle='rgba(255,255,255,.14)';ctx.fillRect(-r,-r*.3,2*r,r*.22);ctx.fillRect(-r,r*.15,2*r,r*.1);ctx.restore();}
  else if(b.n){ctx.fillStyle='hsla('+hue+',60%,14%,.96)';ctx.strokeStyle='hsl('+hue+',100%,'+L+'%)';ctx.lineWidth=2;ctx.lineJoin='round';
   ctx.beginPath();b.V.forEach((v,i)=>i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;
   ctx.strokeStyle='hsla('+hue+',100%,70%,.28)';ctx.lineWidth=1;ctx.beginPath();b.V.forEach((v,i)=>i?ctx.lineTo(v[0]*.6,v[1]*.6):ctx.moveTo(v[0]*.6,v[1]*.6));ctx.closePath();
   for(const v of b.V){ctx.moveTo(v[0]*.6,v[1]*.6);ctx.lineTo(v[0],v[1]);}ctx.stroke();}
  else{const w=b.hw,q=b.hh;ctx.fillStyle='hsla('+hue+',60%,14%,.96)';ctx.strokeStyle='hsl('+hue+',100%,'+L+'%)';ctx.lineWidth=2;
   ctx.beginPath();ctx.roundRect(-w,-q,2*w,2*q,4);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
   ctx.strokeStyle='hsla('+hue+',100%,70%,.28)';ctx.lineWidth=1;ctx.strokeRect(-w+5,-q+5,2*w-10,2*q-10);
   ctx.beginPath();ctx.moveTo(-w+5,-q+5);ctx.lineTo(w-5,q-5);ctx.moveTo(w-5,-q+5);ctx.lineTo(-w+5,q-5);ctx.stroke();}
  ctx.restore();
  if(b.circ&&b.ring){ctx.strokeStyle='hsla('+hue+',90%,75%,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,b.r*1.7,b.r*.42,-.4,0,7);ctx.stroke();}
  ctx.restore();}
}
function drawSparks(){
 ctx.globalCompositeOperation='lighter';
 for(const p of S.sparks){ctx.strokeStyle='hsla('+p.h+',100%,65%,'+Math.max(0,p.l).toFixed(2)+')';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*.025,p.y-p.vy*.025);ctx.stroke();}
 ctx.globalCompositeOperation='source-over';
}
function drawDebug(){
 if($('dbg').checked){ctx.save();ctx.lineWidth=1.5;
  for(const b of P.bodies){if(b.st)continue;ctx.strokeStyle='rgba(125,211,252,.35)';ctx.setLineDash([3,4]);ctx.beginPath();ctx.arc(b.x,b.y,b.rad,0,7);ctx.stroke();ctx.setLineDash([]);
   ctx.strokeStyle='#34d399';ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x+b.vx*.1,b.y+b.vy*.1);ctx.stroke();}
  for(const c of P.contacts){const L=Math.min(50,c.jn*2+4),hot=Math.min(1,c.jn/40);
   ctx.strokeStyle='hsl('+(300-hot*260)+',100%,65%)';ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(c.x+c.nx*L,c.y+c.ny*L);ctx.stroke();
   ctx.fillStyle='#ff4fa3';ctx.beginPath();ctx.arc(c.x,c.y,3,0,7);ctx.fill();}
  ctx.restore();}
}
function drawAim(){
 if(S.aim){ctx.save();ctx.strokeStyle='#fbbf24';ctx.fillStyle='#fbbf24';ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(S.aim.x,S.aim.y);ctx.lineTo(P.mx,P.my);ctx.stroke();ctx.setLineDash([]);
  const an=Math.atan2(P.my-S.aim.y,P.mx-S.aim.x);ctx.beginPath();ctx.moveTo(P.mx,P.my);ctx.lineTo(P.mx-10*Math.cos(an-.4),P.my-10*Math.sin(an-.4));ctx.lineTo(P.mx-10*Math.cos(an+.4),P.my-10*Math.sin(an+.4));ctx.fill();
  ctx.beginPath();ctx.arc(S.aim.x,S.aim.y,5,0,7);ctx.fill();ctx.restore();}
}
function drawGrab(){
 if(P.grab){const b=P.grab.b,co=Math.cos(b.a),si=Math.sin(b.a),ax=b.x+P.grab.lx*co-P.grab.ly*si,ay=b.y+P.grab.lx*si+P.grab.ly*co;
  ctx.save();ctx.strokeStyle='rgba(125,211,252,.95)';ctx.shadowColor='#38bdf8';ctx.shadowBlur=10;ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.lineDashOffset=-S.clock*30;
  ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(P.mx,P.my);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ax,ay,3,0,7);ctx.fill();ctx.beginPath();ctx.arc(P.mx,P.my,6,0,7);ctx.stroke();ctx.restore();}
}
export function draw(dt){drawSky(dt);drawBodies();drawSparks();drawDebug();drawAim();drawGrab();}
