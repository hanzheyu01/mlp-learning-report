import assert from 'node:assert/strict';
import {MLP,dataset} from './mlp.js';
const m=new MLP(8,7),data=dataset(20,42),g=m.gradient(data),eps=1e-5;let maxError=0;
for(let i=0;i<m.p.length;i++){const v=m.p[i];m.p[i]=v+eps;const a=m.evaluate(data).loss;m.p[i]=v-eps;const b=m.evaluate(data).loss;m.p[i]=v;maxError=Math.max(maxError,Math.abs((a-b)/(2*eps)-g[i]));}assert(maxError<1e-7);
const train=dataset(400,42),test=dataset(400,2026),initial=m.evaluate(train).loss;for(let i=0;i<3000;i++)m.step(train,.3);assert(m.evaluate(train).loss<initial*.3);assert(m.evaluate(test).accuracy>.9);assert.deepEqual(dataset(4,42),dataset(4,42));console.log({gradientMaxAbsoluteError:maxError,initialLoss:initial,train:m.evaluate(train),test:m.evaluate(test)});
