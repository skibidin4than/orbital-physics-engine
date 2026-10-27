export const $=id=>document.getElementById(id);
export const COARSE=!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
export function setupCanvas(id,W,H){
const cv=$(id),ctx=cv.getContext('2d'),dpr=Math.min(COARSE?1.25:2,window.devicePixelRatio||1);
cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
return{cv,ctx,dpr,lite:COARSE};
}
