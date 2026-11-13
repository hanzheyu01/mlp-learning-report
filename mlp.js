// 无第三方依赖：浏览器和 Node.js 使用同一训练实现。
export function rng(seed=42){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
export function dataset(n,seed){const r=rng(seed);return Array.from({length:n},()=>{const x=[2*r()-1,2*r()-1];return {x,y:Number(x[0]*x[1]<0)};});}
export class MLP{
 constructor(h=8,seed=7){this.h=h;const r=rng(seed),scale=Math.sqrt(6/(2+h));this.p=Array.from({length:4*h+1},(_,i)=>i<2*h?(2*r()-1)*scale:i<3*h?0:i<4*h?(2*r()-1)*Math.sqrt(6/(h+1)):0);}
 forward(x){const h=this.h,p=this.p,a=Array.from({length:h},(_,j)=>Math.tanh(x[0]*p[2*j]+x[1]*p[2*j+1]+p[2*h+j]));const z=a.reduce((s,v,j)=>s+v*p[3*h+j],p[4*h]);const y=z>=0?1/(1+Math.exp(-z)):Math.exp(z)/(1+Math.exp(z));return {a,z,y};}
 evaluate(data){let loss=0,correct=0;for(const d of data){const f=this.forward(d.x);loss+=Math.max(f.z,0)-d.y*f.z+Math.log1p(Math.exp(-Math.abs(f.z)));correct+=Number((f.y>=.5)===Boolean(d.y));}return {loss:loss/data.length,accuracy:correct/data.length};}
 gradient(data){const h=this.h,g=this.p.map(()=>0);for(const d of data){const f=this.forward(d.x),dz=(f.y-d.y)/data.length;g[4*h]+=dz;for(let j=0;j<h;j++){g[3*h+j]+=dz*f.a[j];const dh=dz*this.p[3*h+j]*(1-f.a[j]**2);g[2*j]+=dh*d.x[0];g[2*j+1]+=dh*d.x[1];g[2*h+j]+=dh;}}return g;}
 step(data,lr){const g=this.gradient(data);this.p=this.p.map((v,i)=>v-lr*g[i]);}
}
export function linearBaseline(train,test,epochs=3000,lr=.3){let p=[0,0,0];for(let e=0;e<epochs;e++){let g=[0,0,0];for(const d of train){const a=[...d.x,1],z=a.reduce((s,x,i)=>s+x*p[i],0),dy=1/(1+Math.exp(-z))-d.y;g=g.map((v,i)=>v+dy*a[i]/train.length);}p=p.map((v,i)=>v-lr*g[i]);}return {parameters:p,accuracy:test.filter(d=>(p[0]*d.x[0]+p[1]*d.x[1]+p[2]>=0)===Boolean(d.y)).length/test.length};}
