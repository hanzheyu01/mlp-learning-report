import {MLP,dataset} from './mlp.js';
export class MapGame {
 constructor(){this.reset(.3,8);}
 reset(lr=.3,h=8){this.lr=lr;this.model=new MLP(h,7);this.train=dataset(400,42);this.test=dataset(400,2026);this.epoch=0;this.inspections=0;this.exam=null;this.history=[{epoch:0,loss:this.model.evaluate(this.train).loss}];}
 inspect(x){this.inspections++;const f=this.model.forward(x);return {x,probability:f.y,predicted:Number(f.y>=.5),truth:Number(x[0]*x[1]<0)};}
 step(n){if(this.exam)return;for(let i=0;i<n&&this.epoch<3000;i++){this.model.step(this.train,this.lr);this.epoch++;if(this.epoch%20===0)this.history.push({epoch:this.epoch,loss:this.model.evaluate(this.train).loss});}}
 examine(){if(this.epoch<500||!this.inspections)return null;this.exam=this.model.evaluate(this.test);return this.exam;}
}
