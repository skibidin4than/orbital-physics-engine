import {H,S,W,ctx} from './state.js';
import {cam} from './camera.js';
const stars=Array.from({length:160},()=>[Math.random()*W,Math.random()*H,Math.random()*1.4+.3,Math.random()*6.3]);
const BQ=.5,bgc=document.createElement('canvas'),bctx=bgc.getContext('2d');bgc.width=Math.round(W*BQ);bgc.height=Math.round(H*BQ);let bgT=-1;
function paintBg(){const c=bctx;c.setTransform(BQ,0,0,BQ,0,0);c.globalCompositeOperation='source-over';
 const g=c.createRadialGradient(W/2,H/2,0,W/2,H/2,520);g.addColorStop(0,'#17103a');g.addColorStop(1,'#04051a');c.fillStyle=g;c.fillRect(0,0,W,H);
 c.globalCompositeOperation='lighter';
 [[200,160,260,'124,58,237',0],[620,120,220,'14,165,233',2],[420,420,280,'236,72,153',4]].forEach(([x,y,r,col,p])=>{
  const X=x+Math.sin(S.clock*.15+p)*40,Y=y+Math.cos(S.clock*.12+p)*25,n=c.createRadialGradient(X,Y,0,X,Y,r);
  n.addColorStop(0,'rgba('+col+','+(.10+.04*Math.sin(S.clock*.4+p)).toFixed(3)+')');n.addColorStop(1,'rgba('+col+',0)');c.fillStyle=n;c.fillRect(X-r,Y-r,2*r,2*r);});
 c.globalCompositeOperation='source-over';}
export function drawBackdrop(){
 ctx.setTransform(S.dpr,0,0,S.dpr,0,0);if(bgT<0||S.clock-bgT>=1/12){bgT=S.clock;paintBg();}ctx.drawImage(bgc,0,0,W,H);
 ctx.fillStyle='#dce6ff';for(const s of stars){const px=((s[0]-cam.x*.04*s[2])%W+W)%W,py=((s[1]-cam.y*.04*s[2])%H+H)%H;ctx.globalAlpha=.3+.5*Math.abs(Math.sin(S.clock*s[2]+s[3]));ctx.fillRect(px,py,s[2],s[2]);}ctx.globalAlpha=1;
}
