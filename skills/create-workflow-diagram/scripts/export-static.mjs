// A second rendering target for the same geometry: HTML/CSS, with no screenshot conversion.
import fs from 'node:fs/promises';
import path from 'node:path';
const [modelFile,dir]=process.argv.slice(2);
const model=JSON.parse(await fs.readFile(modelFile,'utf8'));
const layout=JSON.parse(await fs.readFile(path.join(dir,'layout.json'),'utf8'));
const original=await fs.readFile(path.join(dir,'index.html'),'utf8');
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const px=x=>`${x/layout.width*100}%`, py=y=>`${y/layout.height*100}%`;
const colors={main:'#21684b',support:'#4b7193',return:'#a16b2b'};
function lines(t,w,f){let out=[];for(const line of t.split('\n')){let s='';for(const word of line.split(/\s+/)){if(s&&`${s} ${word}`.length>Math.floor(w/(f*.57))){out.push(s);s=word;}else s=s?`${s} ${word}`:word;}out.push(s);}return out;}
function label(t,x,y,w,f,anchor='middle',color='#213d30',weight=400){
 const text=lines(t,w,f).map(esc).join('<br>');
 const shift=anchor==='end'?'-100%':anchor==='middle'?'-50%':'0';
 return `<div class="d-label" style="left:${px(x)};top:${py(y-f*.86)};width:${px(w)};font-size:${f/layout.width*100}cqw;transform:translateX(${shift});text-align:${anchor==='end'?'right':anchor==='middle'?'center':'left'};color:${color};font-weight:${weight}">${text}</div>`;
}
let drawing=`<section class="diagram" aria-label="${esc(model.title)}"><div class="html-diagram" style="aspect-ratio:${layout.width}/${layout.height}">`;
const map=new Map(model.nodes.map(n=>[n.id,n]));
const phases=[];
for(const id of model.primaryPath){const n=layout.nodes.find(n=>n.id===id),g=map.get(id).group,last=phases.at(-1);if(last?.group===g)last.last=n;else phases.push({group:g,first:n,last:n});}
for(const p of phases){const g=model.groups?.find(g=>g.id===p.group);if(!g)continue;const x1=p.first.x,x2=p.last.x+p.last.width;drawing+=`<div style="position:absolute;left:${px(x1)};top:${py(51)};width:${px(x2-x1)};border-top:2px solid #c3cec1"></div>`+label(g.label,(x1+x2)/2,35,x2-x1,12,'middle','#213d30',700);}
for(const e of layout.edges){
 const c=colors[e.role],w=e.role==='main'?2.8:2;
 for(let i=1;i<e.points.length;i++){
  const [x1,y1]=e.points[i-1],[x2,y2]=e.points[i];
  drawing+=`<div class="d-line" style="left:${px(Math.min(x1,x2))};top:${py(Math.min(y1,y2))};width:${px(Math.abs(x2-x1))};height:${py(Math.abs(y2-y1))};border-${y1===y2?'top':'left'}:${w}px ${e.role==='return'?'dashed':'solid'} ${c}"></div>`;
 }
 const end=e.points.at(-1),before=e.points.at(-2),angle=Math.atan2(end[1]-before[1],end[0]-before[0])*180/Math.PI;
 drawing+=`<div class="d-arrow" style="left:${px(end[0])};top:${py(end[1])};background:${c};width:${px(12)};height:${py(12)};transform:translate(-90%,-50%) rotate(${angle}deg);transform-origin:90% 50%"></div>`;
 const l=e.labelPosition;drawing+=label(e.label,l.x,l.y,l.maxWidth,15,l.anchor??'middle',c);
}
for(const n of layout.nodes){
 const d=map.get(n.id),c={actor:['#eee7d7','#8c7959'],service:['#fff','#648671'],queue:['#e2eddf','#648671'],store:['#e8eff5','#65849e']}[d.role];
 const ls=lines(d.label,n.width-24,18);
 drawing+=`<div class="d-node" style="left:${px(n.x)};top:${py(n.y)};width:${px(n.width)};height:${py(n.height)};border:1.6px solid ${c[1]};border-radius:${d.role==='actor'?24:10}px;background:${c[0]}">${d.role==='store'?`<div style="position:absolute;left:9%;right:9%;top:8%;border-top:2px solid ${c[1]};opacity:.55"></div>`:''}</div>`;
 drawing+=label(d.label,n.x+n.width/2,n.y+n.height/2-(ls.length-1)*11+6,n.width-24,18,'middle','#213d30',600);
}
drawing+='</div></section>';
const css=`.html-diagram{position:relative;width:100%;container-type:inline-size}.d-node,.d-line,.d-arrow,.d-label{position:absolute;box-sizing:border-box}.d-label{line-height:1.24;white-space:nowrap;text-shadow:0 0 3px #faf9f4}.d-arrow{clip-path:polygon(0 0,100% 50%,0 100%)}.d-node{box-shadow:none}`;
const start=original.indexOf('<section class="diagram"'),end=original.indexOf('</section>',start)+10;
if(start<0||end<10)throw new Error('Missing generated diagram section');
const html=(original.slice(0,start)+drawing+original.slice(end)).replace('</style>',css+'</style>').replace('Recipe-generated · native SVG','Recipe-generated · HTML / CSS');
await fs.writeFile(path.join(dir,'share.html'),html);
console.log(JSON.stringify({file:path.join(dir,'share.html'),sameGeometry:true,images:0,scripts:0,svg:0}));
