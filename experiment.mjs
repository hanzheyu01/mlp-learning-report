import {writeFileSync} from 'node:fs';
import {MLP,dataset,linearBaseline} from './mlp.js';
const train=dataset(400,42),test=dataset(400,2026),runs=[];
for(const lr of [.03,.3,1]){const model=new MLP(8,7),history=[];for(let epoch=0;epoch<=3000;epoch++){if(epoch%50===0)history.push({epoch,...model.evaluate(train)});if(epoch<3000)model.step(train,lr);}runs.push({lr,train:model.evaluate(train),test:model.evaluate(test),parameters:model.p,history});}
const result={configuration:{train:400,test:400,trainSeed:42,testSeed:2026,modelSeed:7,hidden:8,epochs:3000},baseline:linearBaseline(train,test),runs};
writeFileSync(new URL('./results.json',import.meta.url),JSON.stringify(result,null,2));console.log(JSON.stringify(result.runs.map(({lr,train,test})=>({lr,train,test})),null,2));
