export function createIntegrator(S,B,forces){
const {P,ens,accel}=forces;let accN=-1;
function integrate(h){const n=B.length;if(ens(n))accN=-1;
 const{X,Y,VX,VY,M,A1,B1,AX2,AY2,AX3,AY3,AX4,AY4,X2,Y2,X3,Y3,X4,Y4,V2X,V2Y,V3X,V3Y,V4X,V4Y}=P;

 let reuse=S.method==='verlet'&&accN===n;
 if(reuse)for(let i=0;i<n;i++){const b=B[i];if(X[i]!==b.x||Y[i]!==b.y||M[i]!==b.m){reuse=false;break;}}
 if(reuse){A1.set(AX2.subarray(0,n));B1.set(AY2.subarray(0,n));}
 for(let i=0;i<n;i++){const b=B[i];X[i]=b.x;Y[i]=b.y;VX[i]=b.vx;VY[i]=b.vy;M[i]=b.m;}
 if(!reuse)accel(X,Y,M,A1,B1,n);
 if(S.method==='euler'){for(let i=0;i<n;i++){X[i]+=VX[i]*h;Y[i]+=VY[i]*h;VX[i]+=A1[i]*h;VY[i]+=B1[i]*h;}}
 else if(S.method==='verlet'){for(let i=0;i<n;i++){X[i]+=VX[i]*h+.5*A1[i]*h*h;Y[i]+=VY[i]*h+.5*B1[i]*h*h;}
  accel(X,Y,M,AX2,AY2,n);for(let i=0;i<n;i++){VX[i]+=.5*(A1[i]+AX2[i])*h;VY[i]+=.5*(B1[i]+AY2[i])*h;}}
 else{for(let i=0;i<n;i++){V2X[i]=VX[i]+A1[i]*h/2;V2Y[i]=VY[i]+B1[i]*h/2;X2[i]=X[i]+VX[i]*h/2;Y2[i]=Y[i]+VY[i]*h/2;}
  accel(X2,Y2,M,AX2,AY2,n);
  for(let i=0;i<n;i++){V3X[i]=VX[i]+AX2[i]*h/2;V3Y[i]=VY[i]+AY2[i]*h/2;X3[i]=X[i]+V2X[i]*h/2;Y3[i]=Y[i]+V2Y[i]*h/2;}
  accel(X3,Y3,M,AX3,AY3,n);
  for(let i=0;i<n;i++){V4X[i]=VX[i]+AX3[i]*h;V4Y[i]=VY[i]+AY3[i]*h;X4[i]=X[i]+V3X[i]*h;Y4[i]=Y[i]+V3Y[i]*h;}
  accel(X4,Y4,M,AX4,AY4,n);
  for(let i=0;i<n;i++){X[i]+=h/6*(VX[i]+2*V2X[i]+2*V3X[i]+V4X[i]);Y[i]+=h/6*(VY[i]+2*V2Y[i]+2*V3Y[i]+V4Y[i]);
   VX[i]+=h/6*(A1[i]+2*AX2[i]+2*AX3[i]+AX4[i]);VY[i]+=h/6*(B1[i]+2*AY2[i]+2*AY3[i]+AY4[i]);}}
 for(let i=0;i<n;i++){const b=B[i];b.x=X[i];b.y=Y[i];b.vx=VX[i];b.vy=VY[i];}
 accN=S.method==='verlet'?n:-1;}
return {integrate,resetAccelCache(){accN=-1;}};
}
