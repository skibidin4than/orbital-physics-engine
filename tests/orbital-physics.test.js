import assert from 'node:assert';
import {create} from '../src/orbital/index.js';
const OP={create};

(function(){let a=0x9e3779b9;Math.random=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};})();
const run=(name,fn)=>{fn();console.log('ok -',name);};
function sim(method,scn){const s=OP.create();s.method=method;s.load(scn);return s;}

run('Verlet/RK4 conserve energy on figure-8, Euler does not',()=>{
 const d={};for(const m of['euler','verlet','rk4']){const s=sim(m,'figure8');s.tick();const e0=s.energy();for(let i=0;i<6000;i++)s.tick();d[m]=Math.abs((s.energy()-e0)/e0*100);}
 assert(d.verlet<.05&&d.rk4<.05,JSON.stringify(d));assert(d.euler>1,JSON.stringify(d));});

run('merge conserves linear momentum and mass',()=>{
 const s=OP.create();s.add(100,100,1,0,3);s.add(100.5,100,-2,1,1);
 const p0=[3*1+1*-2,0+1*1];s.tick();
 assert.strictEqual(s.B.length,1);const b=s.B[0];
 assert(Math.abs(b.m*b.vx-p0[0])<1e-9&&Math.abs(b.m*b.vy-p0[1])<1e-9&&b.m===4);});

run('Barnes-Hut matches direct summation',()=>{
 const s=sim('verlet','solar');for(let i=0;i<400;i++){const r=60+Math.random()*260,a=Math.random()*6.28;s.add(400+r*Math.cos(a),280+r*Math.sin(a),0,0,.02);}
 const n=s.B.length;s.ens(n);const{X,Y,VX,M,A1,B1}=s.P;s.B.forEach((b,i)=>{X[i]=b.x;Y[i]=b.y;M[i]=b.m;});
 s.accel(X,Y,M,A1,B1,n);let worst=0;
 for(let i=0;i<30;i++){let ax=0;for(let j=0;j<n;j++){if(j===i)continue;const dx=X[j]-X[i],dy=Y[j]-Y[i],d2=dx*dx+dy*dy+s.EPS2;ax+=M[j]*dx/(d2*Math.sqrt(d2));}
  worst=Math.max(worst,Math.abs(ax-A1[i])/(Math.abs(ax)+1e-9));}
 assert(worst<.02,'rel err '+worst);});

run('preset starts with zero net momentum',()=>{
 const s=sim('verlet','solar');let px=0,py=0;for(const b of s.B){px+=b.m*b.vx;py+=b.m*b.vy;}
 assert(Math.abs(px)<1e-9&&Math.abs(py)<1e-9);});

run('belt and moons presets stay finite with zero net momentum',()=>{
 for(const n of['belt','moons']){const s=sim('verlet',n);for(let i=0;i<2000;i++)s.tick();
  assert(s.B.length>2&&s.B.every(b=>isFinite(b.x+b.y+b.vx+b.vy)),n);}});

run('merge keeps the heavier body object (selection stays valid)',()=>{
 const s=OP.create();const big=s.add(100,100,0,0,5),small=s.add(100.5,100,1,0,.1);
 s.tick();assert.strictEqual(s.B.length,1);assert.strictEqual(s.B[0],big);assert(Math.abs(big.m-5.1)<1e-12);
 const s2=OP.create();const small2=s2.add(100,100,1,0,.1),big2=s2.add(100.5,100,0,0,5);
 s2.tick();assert.strictEqual(s2.B.length,1);assert.strictEqual(s2.B[0],big2);assert(!s2.B.includes(small2));});

run('culling an out-of-bounds body rebaselines energy',()=>{
 const s=OP.create();s.load('solar');s.tick();assert(s.E0!==null);
 s.add(9000,9000,0,0,.1);s.E0=s.energy();s.tick();
 assert.strictEqual(s.B.some(b=>b.x===9000),false);assert(Math.abs(s.driftPct())<1e-9);});

run('Verlet acceleration reuse gives identical results and half the force evaluations',()=>{
 const a=OP.create(),b=OP.create();a.load('solar');b.load('solar');
 for(let i=0;i<300;i++){a.tick();b.resetAccelCache();b.tick();}
 for(let i=0;i<a.B.length;i++){assert.strictEqual(a.B[i].x,b.B[i].x);assert.strictEqual(a.B[i].vy,b.B[i].vy);}
 assert(a.accelCalls<=301,'cached: '+a.accelCalls);assert(b.accelCalls>=600,'uncached: '+b.accelCalls);});
run('cache is dropped when bodies change (add / method switch)',()=>{
 const a=OP.create(),b=OP.create();a.load('solar');b.load('solar');
 for(let i=0;i<20;i++){a.tick();b.resetAccelCache();b.tick();}
 for(const s of[a,b]){s.add(500,300,0,1,.5,10);}
 a.method=b.method='rk4';for(let i=0;i<5;i++){a.tick();b.resetAccelCache();b.tick();}
 a.method=b.method='verlet';for(let i=0;i<20;i++){a.tick();b.resetAccelCache();b.tick();}
 for(let i=0;i<a.B.length;i++)assert.strictEqual(a.B[i].x,b.B[i].x);});
run('grid merge (many bodies) conserves mass/momentum and merges every overlapping pair',()=>{
 const s=OP.create();let m0=0,px=0,py=0;
 for(let i=0;i<100;i++){const x=300+(i%10)*40,y=200+Math.floor(i/10)*40;
  s.add(x,y,i%3,-(i%5),1);s.add(x+.5,y,-1,2,.5);}
 for(const b of s.B){m0+=b.m;px+=b.m*b.vx;py+=b.m*b.vy;}
 s.dt=1e-9;s.tick();assert.strictEqual(s.B.length,100);
 let m1=0,qx=0,qy=0;for(const b of s.B){m1+=b.m;qx+=b.m*b.vx;qy+=b.m*b.vy;}
 assert(Math.abs(m1-m0)<1e-9&&Math.abs(qx-px)<1e-6&&Math.abs(qy-py)<1e-6);});
run('grid merge handles a chain of overlaps in one tick',()=>{
 const s=OP.create();for(let i=0;i<60;i++)s.add(400+i*3,300,0,0,1);
 s.dt=1e-9;s.tick();assert(s.B.length<60);for(let i=0;i<s.B.length;i++)for(let j=i+1;j<s.B.length;j++){
  const a=s.B[i],b=s.B[j];assert(Math.hypot(a.x-b.x,a.y-b.y)>=a.r+b.r-1e-9,'still overlapping');}});
run('clear() keeps stars (STAR_M) and removes lighter bodies',()=>{
 const s=OP.create();s.add(0,0,0,0,s.STAR_M);s.add(500,0,0,0,s.STAR_M-1);s.clear();assert.strictEqual(s.B.length,1);});
run('drawn radius equals collision radius, and bodies touching on screen merge',()=>{
 const s=OP.create(),a=s.add(400,300,0,0,12),b=s.add(400+a.r+s.rad(.3)-.5,300,0,0,.3);
 s.dt=1e-9;s.tick();assert.strictEqual(s.B.length,1);});
run('predict() follows the real integrator and stops when the body is absorbed',()=>{
 const s=OP.create();s.load('solar');
 const p=s.predict(400+200,280,0,Math.sqrt(1000/200),.1);assert(p.length>20&&p.every(Number.isFinite));
 const r=Math.hypot(p[p.length-2]-400,p[p.length-1]-280);assert(r>150&&r<260,'near-circular orbit expected, r='+r);
 const q=s.predict(400+60,280,0,0,.1);assert(q.length<p.length,'falling into the sun must end early');
 const n0=s.B.length,x0=s.B[1].x;s.predict(10,10,1,1,5);
 assert.strictEqual(s.B.length,n0);assert.strictEqual(s.B[1].x,x0,'predict must not touch the real simulation');});
