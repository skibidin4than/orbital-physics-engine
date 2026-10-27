export const G=1,EPS2=4,SUN=1000,CX=400,CY=280,BHN=150,TH2=.36;
export const STAR_M=300;
export const rad=m=>m>=STAR_M?1.2+1.5*Math.cbrt(m):Math.max(2.4,1.5*(1.2+1.5*Math.cbrt(m))+(m>=1?2:0));
