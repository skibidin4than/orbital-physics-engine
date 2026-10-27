export function makeBody(o,id){
 const b=Object.assign({x:0,y:0,a:0,vx:0,vy:0,w:0,pvx:0,pvy:0,pw:0,hw:0,hh:0,r:0,n:0,R:0,st:false,circ:false,hue:200,age:0,flash:0,ring:false,kind:''},o);
 if(!b.circ){
  const V=b.V=b.n?Array.from({length:b.n},(_,i)=>{const t=i/b.n*Math.PI*2-Math.PI/2;return[b.R*Math.cos(t),b.R*Math.sin(t)];}):[[-b.hw,-b.hh],[b.hw,-b.hh],[b.hw,b.hh],[-b.hw,b.hh]];
  b.N=V.map((v,i)=>{const q=V[(i+1)%V.length],ex=q[0]-v[0],ey=q[1]-v[1],l=Math.hypot(ex,ey);let nx=ey/l,ny=-ex/l;if(nx*v[0]+ny*v[1]<0){nx=-nx;ny=-ny;}return[nx,ny];});}
 if(b.st){b.im=0;b.iI=0;b.m=0;}
 else if(b.circ){b.m=Math.PI*b.r*b.r*0.002;b.im=1/b.m;b.iI=1/(0.5*b.m*b.r*b.r);}
 else{let A2=0,S=0;const V=b.V;for(let i=0;i<V.length;i++){const p=V[i],q=V[(i+1)%V.length],c=Math.abs(p[0]*q[1]-q[0]*p[1]);
   A2+=c;S+=c*(p[0]*p[0]+p[0]*q[0]+q[0]*q[0]+p[1]*p[1]+p[1]*q[1]+q[1]*q[1]);}
  b.m=A2/2*0.002;b.im=1/b.m;b.iI=1/(b.m*S/(6*A2));}
 b.id=id;b.rad=b.circ?b.r:Math.max(...b.V.map(v=>Math.hypot(v[0],v[1])));return b;
}
