import {G,EPS2,BHN,TH2} from './constants.js';
export function createForces(S){
const P={};let cap=0,NC=0,nn=0,NMS,NXS,NYS,NS,NOX,NOY,NCNT,NB,CH,STK=new Int32Array(512);
const NAMES='X Y VX VY M A1 B1 AX2 AY2 AX3 AY3 AX4 AY4 X2 Y2 X3 Y3 X4 Y4 V2X V2Y V3X V3Y V4X V4Y'.split(' ');
function ens(n){if(n<=cap)return false;cap=Math.max(256,n*2);for(const k of NAMES)P[k]=new Float64Array(cap);
 NC=cap*16;NMS=new Float64Array(NC);NXS=new Float64Array(NC);NYS=new Float64Array(NC);NS=new Float64Array(NC);NOX=new Float64Array(NC);NOY=new Float64Array(NC);
 NCNT=new Int32Array(NC);NB=new Int32Array(NC);CH=new Int32Array(NC*4);return true;}
function mkNode(s,ox,oy){const k=nn++;NMS[k]=NXS[k]=NYS[k]=0;NCNT[k]=0;NB[k]=-1;NS[k]=s;NOX[k]=ox;NOY[k]=oy;CH.fill(-1,4*k,4*k+4);return k;}
function child(nd,q){let c=CH[4*nd+q];if(c<0){const h=NS[nd]/2;c=CH[4*nd+q]=mkNode(h,NOX[nd]+(q&1?h:0),NOY[nd]+(q&2?h:0));}return c;}
function quad(nd,X,Y,i){const h=NS[nd]/2;return(X[i]>=NOX[nd]+h?1:0)|(Y[i]>=NOY[nd]+h?2:0);}
function build(X,Y,M,n){let x0=1e18,y0=1e18,x1=-1e18,y1=-1e18;
 for(let i=0;i<n;i++){if(X[i]<x0)x0=X[i];if(X[i]>x1)x1=X[i];if(Y[i]<y0)y0=Y[i];if(Y[i]>y1)y1=Y[i];}
 nn=0;mkNode(Math.max(x1-x0,y1-y0)+1,x0,y0);
 for(let i=0;i<n;i++){let nd=0,d=0;
  for(;;){const empty=NCNT[nd]===0;NCNT[nd]++;NMS[nd]+=M[i];NXS[nd]+=M[i]*X[i];NYS[nd]+=M[i]*Y[i];
   if(empty){NB[nd]=i;break;}
   if(d>40||nn+8>NC){NB[nd]=-1;break;}
   if(NB[nd]>=0){const j=NB[nd];NB[nd]=-1;const c=child(nd,quad(nd,X,Y,j));NCNT[c]=1;NMS[c]=M[j];NXS[c]=M[j]*X[j];NYS[c]=M[j]*Y[j];NB[c]=j;}
   nd=child(nd,quad(nd,X,Y,i));d++;}}}
function accel(X,Y,M,AX,AY,n){S.accelCalls++;
 if(n<=BHN){AX.fill(0,0,n);AY.fill(0,0,n);
  for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const dx=X[j]-X[i],dy=Y[j]-Y[i],d2=dx*dx+dy*dy+EPS2,f=G/(d2*Math.sqrt(d2));
   AX[i]+=f*M[j]*dx;AY[i]+=f*M[j]*dy;AX[j]-=f*M[i]*dx;AY[j]-=f*M[i]*dy;}return;}
 build(X,Y,M,n);
 for(let i=0;i<n;i++){let ax=0,ay=0,sp=0;STK[sp++]=0;
  while(sp){const nd=STK[--sp];if(NB[nd]===i)continue;const dx=NXS[nd]/NMS[nd]-X[i],dy=NYS[nd]/NMS[nd]-Y[i],d2=dx*dx+dy*dy+EPS2;
   const leaf=NB[nd]>=0||(CH[4*nd]<0&&CH[4*nd+1]<0&&CH[4*nd+2]<0&&CH[4*nd+3]<0);
   if(leaf||NS[nd]*NS[nd]<TH2*d2){const f=G*NMS[nd]/(d2*Math.sqrt(d2));ax+=f*dx;ay+=f*dy;}
   else for(let q=0;q<4;q++){const c=CH[4*nd+q];if(c>=0)STK[sp++]=c;}}
  AX[i]=ax;AY[i]=ay;}}
return {P,ens,accel};
}
