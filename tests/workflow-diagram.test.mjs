import assert from 'node:assert/strict';
import {mkdtemp, cp, readFile, readdir, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
const source=fileURLToPath(new URL('../skills/create-workflow-diagram/',import.meta.url));
test('a copied workflow package includes the full inert template without executable helpers or remote assets',async()=>{
 const temp=await mkdtemp(path.join(tmpdir(),'workflow-copy-test-'));
 try {
  await cp(source,temp,{recursive:true});
  assert.deepEqual((await readdir(temp)).sort(),['LICENSE','SKILL.md','assets','references']);
  const html=await readFile(path.join(temp,'assets/workflow-template.html'),'utf8');
  assert.doesNotMatch(html,/<(?:script|iframe|form|svg|canvas|img|link|object|embed)\b|\bon\w+\s*=|https?:|@import|url\s*\(/i);
  assert.ok(html.includes('<style>') && html.includes('</style>'));
  assert.ok((await readFile(path.join(temp,'references/authoring.html'),'utf8')).length>0);
 } finally {await rm(temp,{recursive:true,force:true});}
});
test('sample connections resolve to existing slots with separate feedback corridors',async()=>{
 const html=await readFile(path.join(source,'assets/workflow-template.html'),'utf8');
 const columns=Number(html.match(/class="canvas" style="--columns:(\d+)"/)[1]);
 const primary=html.split('<div class="row primary">')[1].split('<div class="row support">')[0];
 assert.equal([...primary.matchAll(/class="node(?: focus)?"/g)].length,columns);
 const supports=new Set([...html.matchAll(/style="--col:(\d+)"/g)].map(m=>Number(m[1])));
 const seenSources=new Set(), seenTargets=new Set(), seenLanes=new Set();
 for(const [,type,vars] of html.matchAll(/class="edge (\w+)" style="([^"]+)"/g)) {
  const values=Object.fromEntries([...vars.matchAll(/--(\w+):(\d+)/g)].map(m=>[m[1],Number(m[2])]));
  assert.ok(values.from>=1 && values.from<=columns);
  if(type==='forward')assert.ok(values.from<columns);
  if(type==='drop')assert.ok(supports.has(values.from));
  if(type==='feedback'){
   assert.ok(values.to>=1 && values.to<values.from);
   assert.ok(values.lane===0||values.lane===1);
   assert.ok(!seenSources.has(values.from)&&!seenTargets.has(values.to)&&!seenLanes.has(values.lane));
   seenSources.add(values.from);seenTargets.add(values.to);seenLanes.add(values.lane);
  }
 }
});
