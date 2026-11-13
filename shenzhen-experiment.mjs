import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {ScenarioMLP,syntheticScenarios,SZ_PRESETS,scenarioRule,projectGrowth} from './shenzhen-model.js';
const train=syntheticScenarios(600,101),test=syntheticScenarios(200,202),model=new ScenarioMLP(19);
const probe=train.slice(0,12),g=model.gradient(probe),eps=1e-5;let maxError=0;
for(let i=0;i<41;i++){const v=model.p[i];model.p[i]=v+eps;const plus=model.loss(probe);model.p[i]=v-eps;const minus=model.loss(probe);model.p[i]=v;maxError=Math.max(maxError,Math.abs((plus-minus)/(2*eps)-g[i]));}assert(maxError<1e-7);
const history=[];for(let epoch=0;epoch<=3500;epoch++){if(epoch%100===0)history.push({epoch,mse:model.loss(train)});if(epoch<3500)model.step(train,.05);}
const testMAEpp=test.reduce((s,d)=>s+Math.abs(model.forward(d.x).y-d.y)*30,0)/test.length;
const mean=train.reduce((s,d)=>s+d.y,0)/train.length;
const baselineMAEpp=test.reduce((s,d)=>s+Math.abs(mean-d.y)*30,0)/test.length;
assert(testMAEpp<1);assert(testMAEpp<baselineMAEpp);assert(model.loss(train)<history[0].mse);
const scenarios=SZ_PRESETS.map(s=>{const growth=model.growth(s.d,s.c,s.r);return {...s,growth,ruleGrowth:scenarioRule(s.d,s.c,s.r),projection:projectGrowth(growth)};});
assert(scenarios[0].growth<scenarios[1].growth&&scenarios[1].growth<scenarios[2].growth);
const result={kind:'synthetic_scenario_surrogate_NOT_empirical_forecast',asOf:'2026-11-13',base:{year:2025,value:350.61,unit:'亿元',metric:'深圳低空经济与空天产业集群增加值',source:'https://www.sz.gov.cn/cn/xxgk/zfxxgj/zwdt/content/post_12657458.html',published:'2026-02-27'},config:{architecture:[3,8,1],parameters:41,train:600,test:200,trainSeed:101,testSeed:202,modelSeed:19,epochs:3500,learningRate:.05,targetScaling:.3,rule:'g = 0.04 + 0.45*d + 0.10*c + 0.12*d*c - 0.12*r'},metrics:{gradientMaxAbsoluteError:maxError,trainMSE:model.loss(train),testMSE:model.loss(test),testMAEPercentagePoints:testMAEpp,constantBaselineMAEPercentagePoints:baselineMAEpp},parameters:model.p,history,scenarios};
writeFileSync(new URL('./shenzhen-results.json',import.meta.url),JSON.stringify(result,null,2));console.log(JSON.stringify({metrics:result.metrics,scenarios:scenarios.map(s=>({name:s.name,growth:s.growth,value2030:s.projection.at(-1).value}))},null,2));
