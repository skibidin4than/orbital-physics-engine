export function createQuality(S,cv,W,H){
let slow=0,warm=3;
const setDpr=v=>{S.dpr=v;cv.width=Math.round(W*v);cv.height=Math.round(H*v);};
const adapt=fps=>{if(fps>=40){slow=0;return;}if(++slow<2)return;slow=0;if(S.dpr>1.01)setDpr(Math.max(1,S.dpr-.25));else if(!S.lite)S.lite=true;};
return fps=>{if(warm>0)warm--;else adapt(fps);};
}
