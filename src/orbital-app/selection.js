import {$,B,G,S} from './state.js';
export function showSel(){const el=$('sel');if(!S.sel){el.classList.remove('on');return;}
 const big=B.reduce((a,b)=>b.m>a.m?b:a,B[0]);

 let ref=null,bf=0;for(const o of B){if(o===S.sel)continue;const q=(o.x-S.sel.x)**2+(o.y-S.sel.y)**2+1e-9,f=o.m/q;if(f>bf){bf=f;ref=o;}}
 const star=S.sel===big||!ref,d=ref?Math.hypot(S.sel.x-ref.x,S.sel.y-ref.y):0,sp=ref?Math.hypot(S.sel.vx-ref.vx,S.sel.vy-ref.vy):Math.hypot(S.sel.vx,S.sel.vy);
 el.innerHTML='<b>'+(S.sel===big?'STAR':'BODY')+'</b><span>mass '+S.sel.m.toFixed(2)+'</span><span>speed '+sp.toFixed(2)+'</span>'+(star?'':'<span>dist '+d.toFixed(0)+'</span><span>period '+(6.283*Math.sqrt(d*d*d/(G*(ref.m+S.sel.m)))).toFixed(0)+'</span>')+'<em>following &middot; Esc to release</em>';el.classList.add('on');}
