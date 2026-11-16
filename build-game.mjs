import {readFileSync,writeFileSync} from 'node:fs';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const js=read('mlp.js')+'\n'+read('game-state.js').replace("import {MLP,dataset} from './mlp.js';",'')+'\n'+read('game.js').replace("import {MapGame} from './game-state.js';",'');
writeFileSync(new URL('game-public.html',import.meta.url),read('game.html').replace('<script type="module" src="game.js"></script>',()=>'<script type="module">'+js+'</script>'));
