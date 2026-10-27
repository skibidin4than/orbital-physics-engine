import assert from 'node:assert';
import {create} from '../src/rigid/index.js';
const RP={create};

(function(){let a=0x9e3779b9;Math.random=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};})();
const test=(name,fn)=>{fn();console.log('ok -',name);};
const world=()=>{const P=RP.create();P.walls();return P;};
const sim=(P,sec)=>{for(let i=0;i<Math.round(sec/P.h);i++)P.step();};
const GROUND_TOP=560-24;

test('mass and inertia come from area (box and circle)',()=>{
 const P=RP.create(),b=P.mk({x:0,y:0,hw:10,hh:5}),c=P.mk({x:0,y:0,circ:true,r:10});
 assert(Math.abs(b.m-200*0.002)<1e-12,'box mass '+b.m);
 assert(Math.abs(b.iI-1/(b.m*(20*20+10*10)/12))<1e-9,'box inertia');
 assert(Math.abs(c.m-Math.PI*100*0.002)<1e-12);assert(Math.abs(c.iI-1/(0.5*c.m*100))<1e-12);});

test('static bodies have zero inverse mass and never move',()=>{
 const P=world(),g=P.bodies[0];assert.strictEqual(g.im,0);assert.strictEqual(g.iI,0);
 const y0=g.y;P.addBox(400,300);sim(P,1);assert.strictEqual(g.y,y0);});

test('free fall follows gravity (within light damping)',()=>{
 const P=RP.create();const b=P.mk({x:400,y:-5000,circ:true,r:10});sim(P,0.5);
 assert(Math.abs(b.vy-P.G*0.5)/(P.G*0.5)<0.03,'vy '+b.vy);});

test('zero-G: a body keeps its direction and does not accelerate',()=>{
 const P=RP.create();P.GS=0;const b=P.mk({x:100,y:100,circ:true,r:10,vx:100});sim(P,1);
 assert(Math.abs(b.vy)<1e-9&&b.vx>95&&b.vx<=100,'vx '+b.vx);});

test('box comes to rest on the ground',()=>{
 const P=world(),b=P.addBox(400,300);sim(P,4);
 assert(Math.hypot(b.vx,b.vy)<2,'speed '+Math.hypot(b.vx,b.vy));
 assert(Math.abs(b.y+b.hh-GROUND_TOP)<2,'rest height '+(b.y+b.hh));});

test('box on ground produces two contact points',()=>{
 const P=world(),b=P.mk({x:400,y:GROUND_TOP-20+0.3,hw:20,hh:20});
 const m=P.collide(P.bodies[0],b);assert(m&&m.pts.length===2,'pts '+(m&&m.pts.length));});

test('pyramid settles and then stays standing',()=>{
 const P=world();P.pyramid();const boxes=P.bodies.filter(b=>!b.st);sim(P,2);
 const x0=boxes.map(b=>b.x),y0=boxes.map(b=>b.y);sim(P,2);
 boxes.forEach((b,i)=>{assert(Math.abs(b.x-x0[i])<0.5&&Math.abs(b.y-y0[i])<0.5,'box '+i+' drifted '+(b.x-x0[i])+','+(b.y-y0[i]));assert(Math.abs(b.a)<0.05,'box '+i+' tilted '+b.a);});
 assert(boxes.every(b=>b.y<GROUND_TOP),'a box sank into the ground');});

test('fast body does not tunnel through the ground',()=>{
 const P=world(),b=P.mk({x:400,y:100,circ:true,r:15,vy:3000});sim(P,2);
 assert(b.y+b.r<=GROUND_TOP+2,'y '+b.y);});

test('side walls keep fast bodies inside the world',()=>{
 const P=world(),b=P.mk({x:400,y:300,circ:true,r:15,vx:2000});sim(P,2);
 assert(b.x>0&&b.x<P.W,'x '+b.x);});

test('restitution: higher bounciness gives a higher rebound',()=>{
 const peak=rest=>{const P=world();P.REST=rest;const b=P.mk({x:400,y:100,circ:true,r:15});let hit=false,min=1e9,top=0;
  for(let i=0;i<Math.round(4/P.h);i++){P.step();if(b.vy<0&&!hit){hit=true;}if(hit){top=Math.max(top,GROUND_TOP-(b.y+b.r));}}
  return top;};
 const a=peak(0),c=peak(0.8);assert(c>a+20,'rebound '+a+' vs '+c);});

test('friction: sliding box stops with friction and keeps going without',()=>{
 const slide=mu=>{const P=world();P.MU=mu;const b=P.mk({x:200,y:GROUND_TOP-20,hw:20,hh:20,vx:300});sim(P,1.5);return b.vx;};
 const hi=slide(0.8),lo=slide(0);assert(hi<20,'with friction vx '+hi);assert(lo>200,'no friction vx '+lo);});

test('head-on collision in zero-G conserves momentum',()=>{
 const P=RP.create();P.GS=0;const a=P.mk({x:300,y:280,circ:true,r:20,vx:300}),b=P.mk({x:420,y:280,circ:true,r:20,vx:-200});
 const p0=a.m*a.vx+b.m*b.vx;sim(P,0.6);const p1=a.m*a.vx+b.m*b.vx;
 assert(Math.abs(p1-p0)<Math.abs(p0)*0.05+0.05,'momentum '+p0+' -> '+p1);assert(a.vx<b.vx+1,'bodies separated');});

test('impact hook fires on a hard hit and engine works without a hook',()=>{
 const P=world();let hits=0;P.onImpact=(c,sp)=>{hits++;assert(sp>220);};
 P.mk({x:400,y:100,circ:true,r:15,vy:1500});sim(P,1);assert(hits>0,'no impact callback');
 const Q=world();Q.mk({x:400,y:100,circ:true,r:15,vy:1500});sim(Q,1);});

test('mouse spring drags a body toward the pointer',()=>{
 const P=RP.create();P.GS=0;const b=P.mk({x:200,y:200,hw:15,hh:15});P.grab={b,lx:0,ly:0};P.mx=400;P.my=200;
 const d0=Math.hypot(b.x-400,b.y-200);sim(P,1);assert(Math.hypot(b.x-400,b.y-200)<d0*0.5,'distance '+Math.hypot(b.x-400,b.y-200));});

test('simulation is deterministic for identical input',()=>{
 const run=()=>{const P=world();P.pyramid();const b=P.mk({x:300,y:100,circ:true,r:14,vx:80});sim(P,2);return[b.x,b.y];};
 const a=run(),b=run();assert.deepStrictEqual(a,b);});
