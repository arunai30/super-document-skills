import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const [modelFile,dir]=process.argv.slice(2);
const model=JSON.parse(await fs.readFile(modelFile,'utf8'));
const layout=JSON.parse(await fs.readFile(path.join(dir,'layout.json'),'utf8'));
assert.equal(layout.nodes.length,model.nodes.length);assert.equal(layout.edges.length,model.edges.length);
for(let i=0;i<layout.nodes.length;i++){
 const a=layout.nodes[i];assert(a.x>=0&&a.y>=0&&a.x+a.width<=layout.width&&a.y+a.height<=layout.height);
 for(const b of layout.nodes.slice(i+1)) assert(!(a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y),`Node overlap ${a.id}/${b.id}`);
}
function through(p,q,n){
 const [x1,y1]=p,[x2,y2]=q;
 if(y1===y2)return y1>n.y+1&&y1<n.y+n.height-1&&Math.max(x1,x2)>n.x+1&&Math.min(x1,x2)<n.x+n.width-1;
 if(x1===x2)return x1>n.x+1&&x1<n.x+n.width-1&&Math.max(y1,y2)>n.y+1&&Math.min(y1,y2)<n.y+n.height-1;
 throw new Error('Route is not orthogonal');
}
for(const e of layout.edges){
 for(const n of layout.nodes.filter(n=>n.id!==e.from&&n.id!==e.to))
  for(let i=1;i<e.points.length;i++)assert(!through(e.points[i-1],e.points[i],n),`Connector ${e.from}/${e.to} crosses ${n.id}`);
}
const html=await fs.readFile(path.join(dir,'index.html'),'utf8');
assert(!/<(?:script|iframe|form|foreignObject)\b/i.test(html),'Unexpected active markup');
assert(html.includes('<svg')&&html.includes('diagram-description'));
console.log(JSON.stringify({pass:true,nodes:layout.nodes.length,edges:layout.edges.length,nodeOverlaps:0,connectorsThroughUnrelatedNodes:0,note:'Checks do not prove label geometry or human understanding'}));
