export function rv(c){const A=c.A,B=c.B;
 return[(B.vx-B.w*c.rby)-(A.vx-A.w*c.ray),(B.vy+B.w*c.rbx)-(A.vy+A.w*c.rax)];}
export function app(c,px,py){const A=c.A,B=c.B;
 A.pvx-=px*A.im;A.pvy-=py*A.im;A.pw-=A.iI*(c.rax*py-c.ray*px);
 B.pvx+=px*B.im;B.pvy+=py*B.im;B.pw+=B.iI*(c.rbx*py-c.rby*px);}
export function ap(c,px,py){const A=c.A,B=c.B;
 A.vx-=px*A.im;A.vy-=py*A.im;A.w-=A.iI*(c.rax*py-c.ray*px);
 B.vx+=px*B.im;B.vy+=py*B.im;B.w+=B.iI*(c.rbx*py-c.rby*px);}
