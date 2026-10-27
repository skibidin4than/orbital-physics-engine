import {$,hist} from './state.js';
const eg=$('eg'),egx=eg.getContext('2d');eg.width=440;eg.height=160;
export function drawGraph(){const w=440,h=160,m=Math.max(.02,...hist.map(Math.abs));egx.clearRect(0,0,w,h);
 egx.strokeStyle='rgba(255,255,255,.15)';egx.lineWidth=1;egx.beginPath();egx.moveTo(0,h/2);egx.lineTo(w,h/2);egx.stroke();
 egx.fillStyle='rgba(203,213,225,.8)';egx.font='500 22px monospace';egx.fillText('E drift  \u00b1'+m.toFixed(2)+'%',12,28);
 if(hist.length<2)return;egx.strokeStyle=m>1?'#f87171':'#34d399';egx.lineWidth=2.5;egx.beginPath();
 hist.forEach((v,i)=>{const x=i/119*w,y=h/2-v/m*(h/2-38);i?egx.lineTo(x,y):egx.moveTo(x,y);});egx.stroke();}
