import {create} from '../orbital/index.js';
import {$,setupCanvas} from '../shared/dom.js';
export const W=800,H=560,CX=W/2,CY=H/2,SPK=.03,MAXSTEPS=4000,BUDGET_MS=14,SIMRATE=48;
export const sim=create(),B=sim.B,{G,rad,STAR_M}=sim;
const {cv,ctx,dpr,lite}=setupCanvas('o',W,H);
export {$,cv,ctx};
export const hist=[];
export const vr=b=>b.r;
export const S={dpr,lite,sel:null,sparks:[],paused:false,ts:1,eff:1,reqT:0,doneT:0,aim:null,pan:null,sx:0,sy:0,mx:0,my:0,showTrail:true,preTs:1,clock:0};

