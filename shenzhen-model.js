// 教学情景代理模型：标签来自公开的假设公式，不是深圳历史观测。
export const SZ_BASE = 350.61;
export const SZ_PRESETS = [
 {name:'审慎',d:.12,c:.35,r:.55,color:'#607b9b'},
 {name:'中性',d:.22,c:.60,r:.30,color:'#245b4d'},
 {name:'积极',d:.32,c:.80,r:.15,color:'#cf7938'}
];
export function szRng(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
export function scenarioRule(d,c,r){return .04+.45*d+.10*c+.12*d*c-.12*r;}
export function szInput(d,c,r){return [d/.2-1,2*c-1,2*r-1];}
export function syntheticScenarios(n,seed){const random=szRng(seed);return Array.from({length:n},()=>{const d=.4*random(),c=random(),r=random();return {x:szInput(d,c,r),y:scenarioRule(d,c,r)/.3};});}
export class ScenarioMLP{
 constructor(seed=19){this.h=8;const r=szRng(seed);this.p=Array.from({length:41},(_,i)=>i<24?(2*r()-1)*Math.sqrt(6/11):i<32?0:i<40?(2*r()-1)*Math.sqrt(6/9):0);}
 forward(x){const a=Array.from({length:8},(_,j)=>Math.tanh(this.p[32-8+j]+x.reduce((s,v,k)=>s+v*this.p[3*j+k],0)));return {a,y:a.reduce((s,v,j)=>s+v*this.p[32+j],this.p[40])};}
 loss(data){return data.reduce((s,d)=>s+(this.forward(d.x).y-d.y)**2,0)/data.length;}
 gradient(data){const g=Array(41).fill(0);for(const d of data){const f=this.forward(d.x),dz=2*(f.y-d.y)/data.length;g[40]+=dz;for(let j=0;j<8;j++){g[32+j]+=dz*f.a[j];const dh=dz*this.p[32+j]*(1-f.a[j]**2);g[24+j]+=dh;for(let k=0;k<3;k++)g[3*j+k]+=dh*d.x[k];}}return g;}
 step(data,lr){const g=this.gradient(data);this.p=this.p.map((v,i)=>v-lr*g[i]);}
 growth(d,c,r){return .3*this.forward(szInput(d,c,r)).y;}
}
export function projectGrowth(g,base=SZ_BASE){return Array.from({length:6},(_,i)=>({year:2025+i,value:base*(1+g)**i,kind:i?'scenario':'observed'}));}
