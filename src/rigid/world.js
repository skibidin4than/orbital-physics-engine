import {W,H,G,h,ITER,BETA,SLOP,REST_T,PITER,PCAP,HUES} from './constants.js';
import {makeBody} from './body.js';
import {verts,normals,inPoly,inb,collide} from './collision.js';
import {rv,ap,app} from './contact.js';
export function create(){
let idc=0,prevImp=new Map(),bodies=[],contacts=[],grab=null,mx=0,my=0;
const rh=()=>HUES[Math.floor(Math.random()*HUES.length)];
function mk(o){const b=makeBody(o,idc++);bodies.push(b);return b;}
function walls(){
 mk({x:W/2,y:H-24+40,hw:W/2+200,hh:40,st:true,kind:'ground'});
 mk({x:-40,y:H/2,hw:40,hh:H,st:true,kind:'wall'});
 mk({x:W+40,y:H/2,hw:40,hh:H,st:true,kind:'wall'});
}
function addBox(x,y){const k=14+Math.random()*16;return mk({x,y,hw:k*(0.8+Math.random()*0.8),hh:k,a:Math.random()*3,hue:rh()});}
function addOrb(x,y){return mk({x,y,circ:true,r:14+Math.random()*16,hue:rh(),ring:Math.random()<0.35});}
function addPoly(n,x,y){return mk({x,y,n,R:17+Math.random()*13,a:Math.random()*6.28,hue:rh()});}
function pyramid(){const n=5,s=18;
 for(let r=0;r<n;r++)for(let i=0;i<n-r;i++)
  mk({x:W/2+(i-(n-r-1)/2)*(2*s+1),y:H-24-s-r*(2*s+1),hw:s,hh:s,hue:HUES[r%HUES.length]});}
function reset(){bodies=[];walls();pyramid();addOrb(160,100);addOrb(640,60);addBox(250,40);addBox(560,120);}
let REST=0.35,MU=0.5,GS=1,onImpact=null;
function step(){
 for(const b of bodies){if(b.st)continue;b.vy+=G*GS*h;b.w*=1-0.5*h;b.vx*=1-0.02*h;b.vy*=1-0.02*h;}
 if(grab){const b=grab.b,co=Math.cos(b.a),si=Math.sin(b.a),
  rx=grab.lx*co-grab.ly*si,ry=grab.lx*si+grab.ly*co,ax=b.x+rx,ay=b.y+ry,
  vx=b.vx-b.w*ry,vy=b.vy+b.w*rx;
  let fx=b.m*(300*(mx-ax)-30*vx),fy=b.m*(300*(my-ay)-30*vy);
  const mag=Math.hypot(fx,fy),cap=b.m*20000;if(mag>cap){fx*=cap/mag;fy*=cap/mag;}
  b.vx+=fx*b.im*h;b.vy+=fy*b.im*h;b.w+=(rx*fy-ry*fx)*b.iI*h;}
 contacts=[];
 const CS=64,grid=new Map(),seen=new Set(),pairs=[],sts=[],dyn=[];
 for(const b of bodies){if(b.st){sts.push(b);continue;}dyn.push(b);
  const x0=Math.floor((b.x-b.rad)/CS),x1=Math.floor((b.x+b.rad)/CS),y0=Math.floor((b.y-b.rad)/CS),y1=Math.floor((b.y+b.rad)/CS);
  for(let gx=x0;gx<=x1;gx++)for(let gy=y0;gy<=y1;gy++){const k=gx*100003+gy;let l=grid.get(k);if(!l)grid.set(k,l=[]);l.push(b);}}
 for(const l of grid.values())for(let i=0;i<l.length;i++)for(let j=i+1;j<l.length;j++){
  let A=l[i],B=l[j];if(A.id>B.id){const t=A;A=B;B=t;}const k=A.id*4294967296+B.id;if(seen.has(k))continue;seen.add(k);pairs.push([A,B]);}
 for(const d of dyn)for(const s2 of sts)pairs.push([s2,d]);
 const imp=new Map();
 for(const [A,B] of pairs){
  const dx=B.x-A.x,dy=B.y-A.y,rr=A.rad+B.rad;if(dx*dx+dy*dy>rr*rr)continue;
  const m=collide(A,B);if(!m)continue;
  let pi=0;
  for(const p of m.pts){
   const c={A,B,nx:m.nx,ny:m.ny,tx:-m.ny,ty:m.nx,rax:p.x-A.x,ray:p.y-A.y,rbx:p.x-B.x,rby:p.y-B.y,x:p.x,y:p.y,jn:0,jt:0,pj:0};
   const n1=c.rax*c.ny-c.ray*c.nx,n2=c.rbx*c.ny-c.rby*c.nx,t1=c.rax*c.ty-c.ray*c.tx,t2=c.rbx*c.ty-c.rby*c.tx;
   c.kn=A.im+B.im+A.iI*n1*n1+B.iI*n2*n2;c.kt=A.im+B.im+A.iI*t1*t1+B.iI*t2*t2;
   const v=rv(c),vn=v[0]*c.nx+v[1]*c.ny;if(vn<-220&&onImpact)onImpact(c,-vn);
   c.pen=Math.min(PCAP,BETA/h*Math.max(p.d-SLOP,0));
   c.bias=vn<-REST_T?-REST*vn:0;
   c.key=A.id*67108864+B.id*16+(pi++);const w=prevImp.get(c.key);if(w){c.jn=w[0]*0.9;c.jt=w[1]*0.9;ap(c,c.nx*c.jn+c.tx*c.jt,c.ny*c.jn+c.ty*c.jt);}
   contacts.push(c);}}
 for(let it=0;it<ITER;it++)for(const c of contacts){
  let v=rv(c),vn=v[0]*c.nx+v[1]*c.ny;
  let l=(c.bias-vn)/c.kn,nj=Math.max(c.jn+l,0);l=nj-c.jn;c.jn=nj;ap(c,c.nx*l,c.ny*l);
  v=rv(c);const vt=v[0]*c.tx+v[1]*c.ty,mx2=MU*c.jn;
  l=-vt/c.kt;nj=Math.max(-mx2,Math.min(mx2,c.jt+l));l=nj-c.jt;c.jt=nj;ap(c,c.tx*l,c.ty*l);}
 prevImp=new Map();for(const c of contacts)prevImp.set(c.key,[c.jn,c.jt]);
 for(const b of bodies){b.pvx=b.pvy=b.pw=0;}
 for(let it=0;it<PITER;it++)for(const c of contacts){if(!c.pen)continue;const A=c.A,B=c.B,
  vn=((B.pvx-B.pw*c.rby)-(A.pvx-A.pw*c.ray))*c.nx+((B.pvy+B.pw*c.rbx)-(A.pvy+A.pw*c.rax))*c.ny;
  let l=(c.pen-vn)/c.kn;const nj=Math.max(c.pj+l,0);l=nj-c.pj;c.pj=nj;app(c,c.nx*l,c.ny*l);}
 for(const b of bodies){if(b.st)continue;b.x+=(b.vx+b.pvx)*h;b.y+=(b.vy+b.pvy)*h;b.a+=(b.w+b.pw)*h;}
}
return {W,H,G,h,HUES,mk,walls,addBox,addOrb,addPoly,pyramid,reset,verts,normals,inPoly,inb,collide,rv,step,
 get bodies(){return bodies;},set bodies(v){bodies=v;},
 get contacts(){return contacts;},
 get grab(){return grab;},set grab(v){grab=v;},
 get mx(){return mx;},set mx(v){mx=v;},
 get my(){return my;},set my(v){my=v;},
 get REST(){return REST;},set REST(v){REST=v;},
 get MU(){return MU;},set MU(v){MU=v;},
 get GS(){return GS;},set GS(v){GS=v;},
 get onImpact(){return onImpact;},set onImpact(v){onImpact=v;}};
}
