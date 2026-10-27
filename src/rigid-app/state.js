import {create} from '../rigid/index.js';
import {$,setupCanvas} from '../shared/dom.js';
export const P=create();
export const {W,H}=P;
export const SPK=4;
const {cv,ctx,dpr,lite}=setupCanvas('c',W,H);
export {$,cv,ctx};
export const S={dpr,lite,aimKind:'orb',aim:null,sparks:[],paused:false,ts:1,clock:0,stepReq:false};

