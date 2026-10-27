(function(){const r=[...document.querySelectorAll('input[type=range]')];
const paint=i=>{const p=(i.value-i.min)/(i.max-i.min)*100;i.style.setProperty('--p',p+'%');};

const d=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value');
r.forEach(i=>{Object.defineProperty(i,'value',{configurable:true,get(){return d.get.call(this);},set(v){d.set.call(this,v);paint(this);}});
 i.addEventListener('input',()=>paint(i));paint(i);});})();

document.addEventListener('pointerup',e=>{const t=e.target.closest&&e.target.closest('button,input');if(t)setTimeout(()=>t.blur(),0);});
