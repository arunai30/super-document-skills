import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {layoutWorkflow} from './layout.mjs';
const [inputFile,outputDirectory]=process.argv.slice(2);
if(!inputFile||!outputDirectory) throw new Error('Usage: node render.mjs model.json output-directory');
const raw=await fs.readFile(inputFile,'utf8'), model=JSON.parse(raw);
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash=t=>crypto.createHash('sha256').update(t).digest('hex');
function validSource(source){try {const u=new URL(source?.url);return u.protocol==='https:'&&!!u.hostname&&typeof source.title==='string'&&source.title.length>0;}catch{return false;}}
if(!model.title||!model.subtitle||!validSource(model.source)||(model.sources??[]).some(s=>!validSource(s))) throw new Error('Title, subtitle and HTTPS sources required');
const colors={main:'#21684b',support:'#4b7193',return:'#a16b2b'};
const nodeColors={actor:['#eee7d7','#8c7959'],service:['#ffffff','#648671'],queue:['#e2eddf','#648671'],store:['#e8eff5','#65849e']};
for(const n of model.nodes){
 if(!nodeColors[n.role]||n.label.length>64) throw new Error('Invalid role or long node label');
 if(['x','y','top','left','width','height'].some(k=>k in n)) throw new Error('Per-node geometry is prohibited');
}
for(const e of model.edges) if(!colors[e.role]||!e.label||e.label.length>40) throw new Error('Invalid edge');
const diagram=layoutWorkflow(model);
const defs=model.nodes.reduce((m,n)=>m.set(n.id,n),new Map());
function wrap(text,width,fontSize=18){
 const max=Math.floor(width/(fontSize*.57));
 const result=[];
 for(const line of text.split('\n')){
   let current='';
   for(const word of line.split(/\s+/)){
     if(word.length>max) throw new Error(`Unbreakable label token: ${word}`);
     if(current&&`${current} ${word}`.length>max){result.push(current);current=word;}else current=current?`${current} ${word}`:word;
   }
   result.push(current);
 }
 return result;
}
function textLines(text,x,y,width,fontSize=18,anchor='middle',extra=''){
 const lines=wrap(text,width,fontSize);
 return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${fontSize}" ${extra}>${lines.map((line,i)=>`<tspan x="${x}" dy="${i?fontSize*1.24:0}">${esc(line)}</tspan>`).join('')}</text>`;
}
let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${diagram.width} ${diagram.height}" role="group" aria-labelledby="diagram-title diagram-description"><title id="diagram-title">${esc(model.title)}</title><desc id="diagram-description">${esc(model.subtitle)} Labeled arrows show operations; dashed arrows indicate feedback.</desc><defs>${Object.entries(colors).map(([k,c])=>`<marker id="arrow-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${c}"/></marker>`).join('')}</defs><g font-family="Arial,Helvetica,sans-serif" fill="#213d30">`;
// Phase annotations describe reading order, not containment or trust boundaries.
const phaseRuns=[];
for(const id of model.primaryPath){
 const n=diagram.nodes.find(n=>n.id===id),g=defs.get(id).group;
 const previous=phaseRuns.at(-1);
 if(previous?.group===g) previous.last=n; else phaseRuns.push({group:g,first:n,last:n});
}
for(const run of phaseRuns){
 const group=(model.groups??[]).find(g=>g.id===run.group);
 if(!group)continue;
 const x1=run.first.x,x2=run.last.x+run.last.width;
 svg+=`<path d="M ${x1} 51 H ${x2}" fill="none" stroke="#c3cec1" stroke-width="2"/><text x="${(x1+x2)/2}" y="35" text-anchor="middle" font-size="12" letter-spacing="2" font-weight="700">${esc(group.label)}</text>`;
}
for(const e of diagram.edges){
 svg+=`<g data-edge="${esc(e.from)}:${esc(e.to)}"><path d="${e.points.map((p,i)=>`${i?'L':'M'} ${p[0]} ${p[1]}`).join(' ')}" fill="none" stroke="${colors[e.role]}" stroke-width="${e.role==='main'?2.8:2}" stroke-linejoin="round" ${e.role==='return'?'stroke-dasharray="7 6"':''} marker-end="url(#arrow-${e.role})"/>${textLines(e.label,e.labelPosition.x,e.labelPosition.y,e.labelPosition.maxWidth,15,e.labelPosition.anchor??'middle',`fill="${colors[e.role]}" paint-order="stroke" stroke="#faf9f4" stroke-width="7" stroke-linejoin="round"`)}</g>`;
}
for(const n of diagram.nodes){
 const definition=defs.get(n.id),[fill,stroke]=nodeColors[definition.role],lines=wrap(definition.label,n.width-24,18);
 if(lines.length>3)throw new Error('Shorten label: exceeds three lines');
 const y=n.y+n.height/2-(lines.length-1)*11+6;
 svg+=`<g data-node="${esc(n.id)}"><title>${esc(definition.label)}</title><rect x="${n.x}" y="${n.y}" width="${n.width}" height="${n.height}" rx="${definition.role==='actor'?24:10}" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>${definition.role==='store'?`<path d="M ${n.x+14} ${n.y+8} H ${n.x+n.width-14}" stroke="${stroke}" stroke-width="2" opacity=".55"/>`:''}${textLines(definition.label,n.x+n.width/2,y,n.width-24,18,'middle','font-weight="600"')}</g>`;
}
svg+='</g></svg>';
const sourceLink=`<a href="${esc(model.source.url)}">${esc(model.source.title)}</a>`;
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(model.title)}</title><style>
*{box-sizing:border-box}body{margin:0;background:#faf9f4;color:#213d30;font:17px/1.5 Arial,Helvetica,sans-serif}main{max-width:1380px;margin:auto;padding:28px 40px 48px}.mast{display:flex;justify-content:space-between;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid #bac7bb;padding-bottom:12px}h1{font:44px/1.1 Georgia,serif;margin:25px 0 12px;letter-spacing:-1px}.intro{max-width:1050px;margin:0 0 20px;font-size:18px}.legend{display:flex;gap:24px;font-size:12px;margin-bottom:4px}.legend span{border-bottom:3px solid;padding-bottom:4px}.diagram{background:#faf9f4}.diagram>svg{display:block;width:100%;height:auto}.notes{display:grid;grid-template-columns:1fr 1fr;gap:40px;padding:24px 0;border-top:1px solid #bac7bb}h2{font-size:17px;margin:0 0 6px}.notes p{margin:0;font-size:15px}.caveat{border-left:3px solid #a87439;padding-left:16px;font-size:13px}footer{font-size:12px;color:#51665a;border-top:1px solid #bac7bb;padding-top:14px;margin-top:24px}a{color:#21684b;text-underline-offset:3px}a:focus-visible{outline:3px solid #a87439;outline-offset:3px}
</style></head><body><main><div class="mast"><span>Workflow diagram</span><span>Recipe-generated · native SVG</span></div><h1>${esc(model.title)}</h1><p class="intro">${esc(model.subtitle)}</p><div class="legend">${(model.legend??['Primary path','Supporting operations','Feedback']).map((label,i)=>label?`<span style="border-color:${Object.values(colors)[i]};${i===2?'border-bottom-style:dashed':''}">${esc(label)}</span>`:'').join('')}</div><section class="diagram" aria-label="${esc(model.title)}">${svg}</section><section class="notes">${model.notes.map(n=>`<div><h2>${esc(n.title)}</h2><p>${esc(n.body)}</p></div>`).join('')}</section><p class="caveat">${esc(model.designCaveat)}</p><footer><p>${esc(model.scope)}</p><p>Sources: ${sourceLink}${(model.sources??[]).map(s=>` · <a href="${esc(s.url)}">${esc(s.title)}</a>`).join('')}. Original composition. Generated from a semantic model using the workflow-spine recipe; positions and connectors are computed.</p></footer></main></body></html>`;
await fs.mkdir(outputDirectory,{recursive:true});
await fs.writeFile(path.join(outputDirectory,'index.html'),html);
await fs.writeFile(path.join(outputDirectory,'diagram.svg'),svg);
await fs.writeFile(path.join(outputDirectory,'layout.json'),JSON.stringify(diagram,null,2));
await fs.writeFile(path.join(outputDirectory,'manifest.json'),JSON.stringify({renderer:'workflow-spine-v1',inputSha256:hash(raw),rendererSha256:hash(await fs.readFile(new URL(import.meta.url))),layoutCodeSha256:hash(await fs.readFile(new URL('./layout.mjs',import.meta.url))),htmlSha256:hash(html),svgSha256:hash(svg),nodeCount:model.nodes.length,edgeCount:model.edges.length,manualNodePositions:0},null,2));
console.log(JSON.stringify({outputDirectory,width:diagram.width,height:diagram.height,nodeCount:model.nodes.length,edgeCount:model.edges.length,htmlSha256:hash(html)}));
