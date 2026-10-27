import {rad} from './constants.js';
export function createMerger(S,B){
let DEAD=new Uint8Array(0),NXT=new Int32Array(0);const HEAD=new Map();
function tryMerge(i,j){if(DEAD[i]||DEAD[j])return false;const a=B[i],b=B[j],dx=b.x-a.x,dy=b.y-a.y,rr=a.r+b.r;
 if(dx*dx+dy*dy>=rr*rr)return false;
 const m=a.m+b.m,big=a.m>=b.m?a:b,x=(a.x*a.m+b.x*b.m)/m,y=(a.y*a.m+b.y*b.m)/m,
  vx=(a.vx*a.m+b.vx*b.m)/m,vy=(a.vy*a.m+b.vy*b.m)/m;

 big.x=x;big.y=y;big.vx=vx;big.vy=vy;big.m=m;big.r=rad(m);
 B[i]=big;DEAD[j]=1;if(S.onMerge)S.onMerge(x,y,big.hue,Math.log(m+1));return true;}
const cellKey=(cx,cy)=>(cx+4096)*8192+(cy+4096);
function mergePass(){const n=B.length;if(n<2)return false;
 if(DEAD.length<n){DEAD=new Uint8Array(n*2);NXT=new Int32Array(n*2);}
 DEAD.fill(0,0,n);let merged=false;
 if(n<=48){for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(tryMerge(i,j))merged=true;}
 else{
  let maxR=0;for(let i=0;i<n;i++)if(B[i].r>maxR)maxR=B[i].r;const cs=2*maxR;HEAD.clear();
  for(let i=0;i<n;i++){const k=cellKey(Math.floor(B[i].x/cs),Math.floor(B[i].y/cs)),h=HEAD.get(k);NXT[i]=h===undefined?-1:h;HEAD.set(k,i);}
  for(let i=0;i<n;i++){const cx=Math.floor(B[i].x/cs),cy=Math.floor(B[i].y/cs);
   for(let gx=cx-1;gx<=cx+1;gx++)for(let gy=cy-1;gy<=cy+1;gy++){let j=HEAD.get(cellKey(gx,gy));if(j===undefined)continue;
    for(;j>=0;j=NXT[j])if(j>i&&tryMerge(i,j))merged=true;}}}
 if(merged){let w=0;for(let i=0;i<n;i++)if(!DEAD[i])B[w++]=B[i];B.length=w;}
 return merged;}
function merge(){let did=false;for(let p=0;p<8&&mergePass();p++)did=true;if(did)S.E0=null;}
return merge;
}
