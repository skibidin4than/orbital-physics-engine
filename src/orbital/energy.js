import {G,EPS2} from './constants.js';
export function energy(B){let e=0;for(let i=0;i<B.length;i++){const a=B[i];e+=.5*a.m*(a.vx*a.vx+a.vy*a.vy);
 for(let j=i+1;j<B.length;j++){const b=B[j];e-=G*a.m*b.m/Math.sqrt((b.x-a.x)**2+(b.y-a.y)**2+EPS2);}}return e;}
