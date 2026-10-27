import {CX,CY,SUN} from './constants.js';
export function createPresets(B,add,circ){
function zeroP(){let px=0,py=0,M=0,big=B[0];for(const b of B){px+=b.m*b.vx;py+=b.m*b.vy;M+=b.m;if(b.m>big.m)big=b;}
 for(const b of B){b.vx-=px/M;b.vy-=py/M;}}
const PRESETS={
 solar(){add(CX,CY,0,0,SUN,42);[[70,.5,200],[115,1.5,20],[165,2,205],[225,6,30],[290,12,280]].forEach(([r,m,h],i)=>circ(r,m,h,i*1.7));circ(330,.05,170,4,.75);},
 binary(){add(CX+100,CY,0,1.118,500,40);add(CX-100,CY,0,-1.118,500,200);circ(300,2,300,.5,1,1000);circ(45,.3,150,2,1,500,CX+100,CY,0,1.118);},
 belt(){add(CX,CY,0,0,SUN,42);circ(110,3,200,0);circ(330,20,280,2.5);for(let i=0;i<160;i++)circ(180+Math.random()*60,.004+Math.random()*.01,30+Math.random()*40,Math.random()*6.283,.97+Math.random()*.06);},
 moons(){add(CX,CY,0,0,SUN,42);circ(90,2,190,.5);const p=circ(220,20,30,0),v=Math.sqrt(1000/220);circ(14,.3,200,1,1,20,p.x,p.y,0,v);circ(24,.2,300,3.5,1,20,p.x,p.y,0,v);},
 figure8(){const L=150,k=Math.sqrt(1000/L),v3=[-.93240737*k,-.86473146*k],p=[-.97000436*L,.24308753*L];
  add(CX+p[0],CY+p[1],-v3[0]/2,-v3[1]/2,1000,190);add(CX-p[0],CY-p[1],-v3[0]/2,-v3[1]/2,1000,320);add(CX,CY,v3[0],v3[1],1000,45);}};
return {PRESETS,zeroP};
}
