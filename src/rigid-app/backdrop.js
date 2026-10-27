import {H,S,W,ctx} from './state.js';
const bg=document.createElement('canvas');
const SQ=.75;
function makeBg(){bg.width=Math.round(W*SQ);bg.height=Math.round(H*SQ);const g=bg.getContext('2d');g.scale(SQ,SQ);
 let r=g.createLinearGradient(0,0,0,H);r.addColorStop(0,'#04051a');r.addColorStop(.7,'#0b0a2a');r.addColorStop(1,'#150f33');g.fillStyle=r;g.fillRect(0,0,W,H);
 [[180,120,260,'rgba(124,58,237,.30)'],[620,320,300,'rgba(14,165,233,.17)'],[420,60,200,'rgba(236,72,153,.15)']].forEach(([x,y,rad,c])=>{
  const q=g.createRadialGradient(x,y,0,x,y,rad);q.addColorStop(0,c);q.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=q;g.fillRect(0,0,W,H);});
 let q;
 g.globalAlpha=.35;q=g.createRadialGradient(512,202,2,520,210,18);q.addColorStop(0,'#e5e7ff');q.addColorStop(1,'#4b4f7a');
 g.fillStyle=q;g.beginPath();g.arc(520,210,16,0,7);g.fill();
}
makeBg();
const stars=Array.from({length:150},()=>({x:Math.random()*W,y:Math.random()*H,z:.25+Math.random()*.75,p:Math.random()*6.3}));
let shoot=null,shootT=3;
function paintSpace(ctx){const t=S.clock;ctx.save();ctx.globalCompositeOperation='lighter';
 [[220,150,240,'124,58,237',0],[560,90,200,'14,165,233',2],[400,230,260,'236,72,153',4]].forEach(([x,y,r,c,p])=>{
  const X=x+Math.sin(t*.15+p)*40,Y=y+Math.cos(t*.12+p)*25,g=ctx.createRadialGradient(X,Y,0,X,Y,r);
  g.addColorStop(0,'rgba('+c+','+(.10+.05*Math.sin(t*.4+p)).toFixed(3)+')');g.addColorStop(1,'rgba('+c+',0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);});
 const x=690,y=95,SC=.28,rot=t*2.4,flash=Math.pow(Math.max(0,Math.sin(rot*2)),10);
 ctx.translate(x,y);ctx.scale(SC,SC);
 for(let i=0;i<3;i++){const r=(t*28+i*45)%135;ctx.strokeStyle='rgba(150,200,255,'+(.16*(1-r/135)).toFixed(3)+')';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,r+12,0,7);ctx.stroke();}
 for(const k of [.55,.85,1.15]){ctx.save();ctx.rotate(rot+Math.PI/2);ctx.strokeStyle='rgba(167,139,250,'+(.34-k*.18).toFixed(3)+')';ctx.lineWidth=3.5;ctx.beginPath();ctx.ellipse(0,0,95*k,36*k,0,0,7);ctx.stroke();ctx.restore();}
 for(let s=0;s<2;s++){ctx.save();ctx.rotate(rot+s*Math.PI);const g=ctx.createLinearGradient(0,0,320,0);g.addColorStop(0,'rgba(200,230,255,.75)');g.addColorStop(1,'rgba(120,170,255,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,-2);ctx.lineTo(320,-24);ctx.lineTo(320,24);ctx.lineTo(0,2);ctx.fill();ctx.restore();}
 const R=30+24*flash,c=ctx.createRadialGradient(0,0,0,0,0,R);c.addColorStop(0,'rgba(255,255,255,1)');c.addColorStop(.25,'rgba(170,215,255,.8)');c.addColorStop(1,'rgba(90,120,255,0)');
 ctx.fillStyle=c;ctx.beginPath();ctx.arc(0,0,R,0,7);ctx.fill();ctx.restore();}
const spc=document.createElement('canvas'),sctx=spc.getContext('2d');spc.width=Math.round(W*SQ);spc.height=Math.round(H*SQ);let spT=-1;
function drawBackdrop(){if(spT<0||S.clock-spT>=1/20){spT=S.clock;sctx.setTransform(1,0,0,1,0,0);sctx.drawImage(bg,0,0);sctx.setTransform(SQ,0,0,SQ,0,0);paintSpace(sctx);}
 ctx.drawImage(spc,0,0,W,H);}
export function drawSky(dt){
 ctx.setTransform(S.dpr,0,0,S.dpr,0,0);drawBackdrop();
 ctx.fillStyle='#dce6ff';for(const s of stars){s.x-=s.z*6*dt;if(s.x<0)s.x+=W;
  ctx.globalAlpha=.35+.65*Math.abs(Math.sin(S.clock*s.z*1.5+s.p));ctx.fillRect(s.x,s.y,s.z*1.8,s.z*1.8);}ctx.globalAlpha=1;
 shootT-=dt;if(shootT<0&&!shoot){shoot={x:100+Math.random()*560,y:Math.random()*150,vx:520,vy:240,l:1};shootT=5+Math.random()*6;}
 if(shoot){ctx.strokeStyle='rgba(180,220,255,'+shoot.l.toFixed(2)+')';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(shoot.x,shoot.y);
  ctx.lineTo(shoot.x-shoot.vx*.12,shoot.y-shoot.vy*.12);ctx.stroke();shoot.x+=shoot.vx*dt;shoot.y+=shoot.vy*dt;shoot.l-=dt*1.1;if(shoot.l<=0)shoot=null;}
}
