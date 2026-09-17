import assert from 'node:assert/strict';
import {mkdtemp,cp,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import test from 'node:test';
const source=fileURLToPath(new URL('../skills/create-workflow-diagram/',import.meta.url));
const run=(skill,model,out,theme='editorial')=>spawnSync(process.execPath,[path.join(skill,'scripts/generate.mjs'),model,out,theme],{encoding:'utf8'});
test('independently copied package renders both models and preserves deterministic style geometry',async()=>{
 const temp=await mkdtemp(path.join(tmpdir(),'workflow-skill-test-'));
 try{
 const skill=path.join(temp,'skill');await cp(source,skill,{recursive:true});
 for(const name of ['url','webhook']){
 const model=path.join(skill,'assets',`${name}.json`);let geometry;
 for(const theme of ['default','blueprint','editorial']){
 const out=path.join(temp,`${name}-${theme}`),repeat=out+'-repeat';
 for(const destination of [out,repeat]){const r=run(skill,model,destination,theme);assert.equal(r.status,0,r.stderr);}
 for(const file of ['share.html','index.html','diagram.svg','layout.json','manifest.json'])assert.equal(await readFile(path.join(out,file),'utf8'),await readFile(path.join(repeat,file),'utf8'));
 const layout=await readFile(path.join(out,'layout.json'),'utf8');if(geometry)assert.equal(layout,geometry);geometry=layout;
 const html=await readFile(path.join(out,'share.html'),'utf8');assert.doesNotMatch(html,/<(?:script|iframe|form|svg|canvas|img)\b/i);
 const vector=await readFile(path.join(out,'diagram.svg'),'utf8'),inline=await readFile(path.join(out,'index.html'),'utf8');
 if(theme!=='default'){const radius=theme==='blueprint'?'3':'0';assert.ok(vector.includes(`rx="${radius}"`));assert.ok(inline.includes(`rx="${radius}"`));}
 }
 }
 }finally{await rm(temp,{recursive:true,force:true});}
});
test('rejects bad references and unsupported crossing geometry; preserves escaped labels',async()=>{
 const temp=await mkdtemp(path.join(tmpdir(),'workflow-model-test-'));
 try{
 const base=JSON.parse(await readFile(path.join(source,'assets/url.json'),'utf8'));
 async function check(model,name,success){const file=path.join(temp,name+'.json');await writeFile(file,JSON.stringify(model));const r=run(source,file,path.join(temp,name));assert.equal(r.status===0,success,r.stderr);return r;}
 await check({...base,sources:[{title:'bad',url:'javascript:alert(1)'}]},'bad-source',false);
 await check({...base,edges:[...base.edges,{from:'missing',to:'resolver',role:'support',label:'bad'}]},'unknown-id',false);
 const dense=structuredClone(base);dense.nodes.splice(5,0,{id:'extra',label:'Extra store',role:'store'});dense.edges.push({from:'edge',to:'extra',role:'support',label:'Inspect'},{from:'extra',to:'db',role:'support',label:'Compare'});
 const failed=await check(dense,'crossing',false);assert.match(failed.stderr,/crosses/);
 const colorsInContent=structuredClone(base);colorsInContent.title='Inspect #21684b';colorsInContent.source.url+='\#21684b';await check(colorsInContent,'content-colors',true);const themed=await readFile(path.join(temp,'content-colors/share.html'),'utf8');assert.ok(themed.includes('Inspect #21684b'));assert.ok(themed.includes('cache-aside/#21684b'));
 const escaped=structuredClone(base);escaped.title='<script>alert(1)</script>';await check(escaped,'escaped',true);const html=await readFile(path.join(temp,'escaped/share.html'),'utf8');assert.ok(html.includes('&lt;script&gt;'));assert.doesNotMatch(html,/<script>/);
 }finally{await rm(temp,{recursive:true,force:true});}
});
