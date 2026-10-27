export function verts(b){const co=Math.cos(b.a),si=Math.sin(b.a);return b.V.map(([x,y])=>[b.x+x*co-y*si,b.y+x*si+y*co]);}
export function normals(b){const co=Math.cos(b.a),si=Math.sin(b.a);return b.N.map(([x,y])=>[x*co-y*si,x*si+y*co]);}
export function inPoly(b,lx,ly,m){for(let i=0;i<b.V.length;i++){const v=b.V[i],n=b.N[i];if((lx-v[0])*n[0]+(ly-v[1])*n[1]>m)return false;}return true;}
export function inb(b,v){const co=Math.cos(b.a),si=Math.sin(b.a),dx=v[0]-b.x,dy=v[1]-b.y;return inPoly(b,dx*co+dy*si,-dx*si+dy*co,1);}
function cc(A,B){const dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy),s=A.r+B.r;if(d>=s)return null;
 const nx=d>1e-6?dx/d:0,ny=d>1e-6?dy/d:1,dep=s-d;
 return{nx,ny,pts:[{x:A.x+nx*(A.r-dep/2),y:A.y+ny*(A.r-dep/2),d:dep}]};}

function cb(P,c){const co=Math.cos(P.a),si=Math.sin(P.a),dx=c.x-P.x,dy=c.y-P.y,lx=dx*co+dy*si,ly=-dx*si+dy*co,V=P.V,N=P.N;
 let best=-1e9,k=0;
 for(let i=0;i<V.length;i++){const sd=(lx-V[i][0])*N[i][0]+(ly-V[i][1])*N[i][1];if(sd>best){best=sd;k=i;}}
 if(best>c.r)return null;
 let nlx,nly,dep,px,py;
 if(best<=0){nlx=N[k][0];nly=N[k][1];dep=c.r-best;px=lx-nlx*best;py=ly-nly*best;}
 else{const a=V[k],b=V[(k+1)%V.length],ex=b[0]-a[0],ey=b[1]-a[1],t=Math.max(0,Math.min(1,((lx-a[0])*ex+(ly-a[1])*ey)/(ex*ex+ey*ey)));
  px=a[0]+ex*t;py=a[1]+ey*t;const qx=lx-px,qy=ly-py,d=Math.hypot(qx,qy);if(d>c.r)return null;nlx=qx/(d||1);nly=qy/(d||1);dep=c.r-d;}
 return{nx:nlx*co-nly*si,ny:nlx*si+nly*co,pts:[{x:P.x+px*co-py*si,y:P.y+px*si+py*co,d:dep}]};}

function sepPoly(VP,VQ,NP){let best=-1e9,k=0;
 for(let i=0;i<VP.length;i++){const n=NP[i],p=VP[i];let s=1e9;
  for(let j=0;j<VQ.length;j++){const d=(VQ[j][0]-p[0])*n[0]+(VQ[j][1]-p[1])*n[1];if(d<s)s=d;}
  if(s>best){best=s;k=i;}}
 return[best,k];}

function clipSeg(p1,p2,nx,ny,off){const d1=p1[0]*nx+p1[1]*ny-off,d2=p2[0]*nx+p2[1]*ny-off,out=[];
 if(d1>=0)out.push(p1);if(d2>=0)out.push(p2);
 if(d1*d2<0){const t=d1/(d1-d2);out.push([p1[0]+t*(p2[0]-p1[0]),p1[1]+t*(p2[1]-p1[1])]);}
 return out;}

function bb(A,B){const VA=verts(A),VB=verts(B),NA=normals(A),NB=normals(B);
 const[sA,iA]=sepPoly(VA,VB,NA),[sB,iB]=sepPoly(VB,VA,NB);
 if(sA>0||sB>0)return null;
 const flip=sB>sA+0.05,VR=flip?VB:VA,NR=flip?NB:NA,VI=flip?VA:VB,NI=flip?NA:NB,ri=flip?iB:iA;
 const n=NR[ri],r1=VR[ri],r2=VR[(ri+1)%VR.length];
 let j=0,md=1e9;for(let q=0;q<NI.length;q++){const d=NI[q][0]*n[0]+NI[q][1]*n[1];if(d<md){md=d;j=q;}}
 const i1=VI[j],i2=VI[(j+1)%VI.length],ux=(r2[0]-r1[0]),uy=(r2[1]-r1[1]),ul=Math.hypot(ux,uy),tx=ux/ul,ty=uy/ul;
 let seg=clipSeg(i1,i2,tx,ty,tx*r1[0]+ty*r1[1]);
 if(seg.length>=2)seg=clipSeg(seg[0],seg[1],-tx,-ty,-(tx*r2[0]+ty*r2[1]));
 const pts=[];
 for(const p of seg){const dep=-((p[0]-r1[0])*n[0]+(p[1]-r1[1])*n[1]);if(dep>=-1)pts.push({x:p[0],y:p[1],d:Math.max(0,dep)});}
 if(!pts.length){let bd=-1e9,bp=i1;for(const p of VI){const dep=-((p[0]-r1[0])*n[0]+(p[1]-r1[1])*n[1]);if(dep>bd){bd=dep;bp=p;}}
  pts.push({x:bp[0],y:bp[1],d:Math.max(0,bd)});}
 return{nx:flip?-n[0]:n[0],ny:flip?-n[1]:n[1],pts};}
export function collide(A,B){
 if(A.circ&&B.circ)return cc(A,B);
 if(A.circ){const m=cb(B,A);if(m){m.nx=-m.nx;m.ny=-m.ny;}return m;}
 if(B.circ)return cb(A,B);
 return bb(A,B);}
