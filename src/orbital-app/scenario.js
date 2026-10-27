import {S,hist,sim} from './state.js';
import {resetView} from './camera.js';
export function loadScn(n){sim.load(n);S.sparks=[];hist.length=0;resetView();}
export const clear=()=>{sim.clear();S.sparks=[];};
