// 将两项实验打包成个人网站可直接托管的单文件；保留模块化源码。
import {readFileSync,writeFileSync} from 'node:fs';
const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');
let html=read('index.html').replace('<link rel="stylesheet" href="style.css">',()=>'<style>'+read('style.css')+'</style>');
const xor=read('app.js').replace("import {MLP,dataset} from './mlp.js';",'').replace("fetch('results.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json();})",()=> 'Promise.resolve('+JSON.stringify(JSON.parse(read('results.json')))+')');
const sz=read('shenzhen-app.js').replace("import {ScenarioMLP,SZ_PRESETS,scenarioRule,projectGrowth} from './shenzhen-model.js';",'').replace("fetch('shenzhen-results.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json();})",()=> 'Promise.resolve('+JSON.stringify(JSON.parse(read('shenzhen-results.json')))+')');
html=html.replace('<script type="module" src="app.js"></script>',()=>'<script type="module">'+read('mlp.js')+'\n'+xor+'</script>').replace('<script type="module" src="shenzhen-app.js"></script>',()=>'<script type="module">'+read('shenzhen-model.js')+'\n'+sz+'</script>');
for(const file of ['mlp.js','experiment.mjs','verify.mjs','results.json','README.md','shenzhen-model.js','shenzhen-experiment.mjs','shenzhen-results.json'])html=html.replaceAll('href="'+file+'"','href="https://github.com/hanzheyu01/mlp-learning-report/blob/main/'+file+'"');
writeFileSync(new URL('public-report.html',import.meta.url),html);console.log('Generated public-report.html');
