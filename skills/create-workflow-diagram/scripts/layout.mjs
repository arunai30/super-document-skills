// Semantic workflow layout. No system-specific identifiers or per-node coordinates.
export function layoutWorkflow(model) {
  const ids = new Set(model.nodes.map(n=>n.id));
  if(ids.size!==model.nodes.length) throw new Error('Duplicate node IDs');
  const path=model.primaryPath;
  if(!Array.isArray(path)||path.length<3||path.length>7) throw new Error('primaryPath must contain 3–7 nodes');
  if(new Set(path).size!==path.length || path.some(id=>!ids.has(id))) throw new Error('Invalid primary path');
  for(let i=1;i<path.length;i++) if(!model.edges.some(e=>e.from===path[i-1]&&e.to===path[i])) throw new Error('Primary path must follow actual edges');
  const supports=model.nodes.filter(n=>!path.includes(n.id));
  if(supports.length>path.length) throw new Error('Split this view: too many supporting systems');
  const slot=208, left=44, top=148, row=408, nodeWidth=158, nodeHeight=82;
  const positioned=new Map(path.map((id,col)=>[id,{id,col,row:0,x:left+col*slot,y:top,width:nodeWidth,height:nodeHeight}]));
  const taken=new Set();
  const degree=id=>model.edges.filter(e=>e.from===id||e.to===id);
  for(const n of supports) {
    let anchor=degree(n.id).map(e=>path.indexOf(e.from===n.id?e.to:e.from)).find(i=>i>=0);
    if(anchor===undefined) {
      const neighbor=degree(n.id).map(e=>positioned.get(e.from===n.id?e.to:e.from)).find(Boolean);
      anchor=neighbor?.col??Math.floor(path.length/2);
    }
    const candidates=path.map((_,i)=>i).filter(i=>!taken.has(i)).sort((a,b)=>Math.abs(a-anchor)-Math.abs(b-anchor)||b-a);
    const col=candidates[0];taken.add(col);
    positioned.set(n.id,{id:n.id,col,row:1,x:left+col*slot,y:row,width:nodeWidth,height:nodeHeight});
  }
  const routes=[];let crossLane=0,returnLane=0;
  const width=left*2+(path.length-1)*slot+nodeWidth;
  const primaryPairs=new Set(path.slice(1).map((id,i)=>`${path[i]}:${id}`));
  for (const e of model.edges) {
    if(!ids.has(e.from)||!ids.has(e.to)) throw new Error('Edge has unknown endpoint');
    const a=positioned.get(e.from),b=positioned.get(e.to);
    const ac=a.x+a.width/2,bc=b.x+b.width/2;
    let points,label;
    if(primaryPairs.has(`${e.from}:${e.to}`)) {
      points=[[a.x+a.width,a.y+nodeHeight/2],[b.x,b.y+nodeHeight/2]];
      label={x:(a.x+a.width+b.x)/2,y:a.y-38,maxWidth:154};
    } else if(a.row===0&&b.row===1) {
      if(a.col===b.col) {
        points=[[ac,a.y+nodeHeight],[bc,b.y]];
        label={x:ac-15,y:(a.y+nodeHeight+b.y)/2-4,maxWidth:148,anchor:'end'};
      } else {
        const y=282+(crossLane++)*45;
        points=[[ac,a.y+nodeHeight],[ac,y],[bc,y],[bc,b.y]];
        label={x:(ac+bc)/2,y:y-25,maxWidth:164};
      }
    } else if(a.row===1&&b.row===1) {
      const right=b.x>a.x;
      points=[[right?a.x+a.width:a.x,a.y+nodeHeight/2],[right?b.x:b.x+b.width,b.y+nodeHeight/2]];
      label={x:(ac+bc)/2,y:a.y-34,maxWidth:156};
    } else {
      // Feedback returns along a dedicated outside lane, never through a node.
      const y=556+returnLane*42;
      const fromX=a.x+a.width+14,toX=b.x-14;
      points=[[a.x+a.width,a.y+nodeHeight*.78],[fromX,a.y+nodeHeight*.78],[fromX,y],[toX,y],[toX,b.y+nodeHeight*.78],[b.x,b.y+nodeHeight*.78]];
      label={x:(fromX+toX)/2,y:y-20,maxWidth:260};returnLane++;
    }
    routes.push({...e,points,labelPosition:label,primary:primaryPairs.has(`${e.from}:${e.to}`)});
  }
  const height=Math.max(600,590+returnLane*42);
  return {width,height,nodes:[...positioned.values()],edges:routes,primaryPath:path};
}
