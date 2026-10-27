import {CX,CY,H,S,W} from './state.js';
export const cam={x:CX,y:CY,z:1};
export const toW=(px,py)=>[(px-W/2)/cam.z+cam.x,(py-H/2)/cam.z+cam.y];
export function resetView(){S.sel=null;cam.x=CX;cam.y=CY;cam.z=1;}
export function zoom(f,atCursor){const[wx,wy]=atCursor?[S.mx,S.my]:[cam.x,cam.y],px=atCursor?S.sx:W/2,py=atCursor?S.sy:H/2;
 cam.z=Math.max(.1,Math.min(8,cam.z*f));cam.x=wx-(px-W/2)/cam.z;cam.y=wy-(py-H/2)/cam.z;}
