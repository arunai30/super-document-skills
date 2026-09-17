// Appearance is a separate pass. It never reads or alters geometry.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const [input,output,name]=process.argv.slice(2);
const themes={
 blueprint:{label:'Blueprint',colors:{'#faf9f4':'#10233f','#213d30':'#edf5ff','#21684b':'#82e2ff','#4b7193':'#b2c3e4','#a16b2b':'#ffc875','#eee7d7':'#223c58','#8c7959':'#82e2ff','#ffffff':'#19324f','#fff':'#19324f','#648671':'#729bb9','#e2eddf':'#174656','#e8eff5':'#20334f','#65849e':'#93a8cd','#c3cec1':'#3c5877','#bac7bb':'#3c5877','#51665a':'#b2c3d9','#a87439':'#ffc875'},css:'h1{font-family:Arial,Helvetica,sans-serif;font-weight:700;letter-spacing:-1.5px}.mast{font-family:monospace;letter-spacing:.13em}.diagram{background-image:linear-gradient(#18324d 1px,transparent 1px),linear-gradient(90deg,#18324d 1px,transparent 1px);background-size:24px 24px}.d-node{border-radius:3px!important}.d-label{text-shadow:0 0 4px #10233f,0 0 4px #10233f}.notes{border-top:2px solid #82e2ff}h2{letter-spacing:.02em}'},
 editorial:{label:'Editorial',colors:{'#faf9f4':'#fffdf9','#213d30':'#242426','#21684b':'#a63024','#4b7193':'#4f6478','#a16b2b':'#7c591b','#eee7d7':'#f4dfd4','#8c7959':'#a63024','#ffffff':'#fffdf9','#fff':'#fffdf9','#648671':'#827e75','#e2eddf':'#ede8dc','#e8eff5':'#edf0f2','#65849e':'#7c8791','#c3cec1':'#c9c2b6','#bac7bb':'#c9c2b6','#51665a':'#66605a','#a87439':'#a63024'},css:'h1{font-family:Georgia,serif;font-size:48px;font-weight:400;letter-spacing:-1.7px}.mast{border-top:5px solid #242426;padding-top:12px}.d-node{border-radius:0!important}.d-label{text-shadow:none}.notes{border-top:2px solid #242426}h2{font-family:Georgia,serif;font-size:21px}.caveat{background:#f4ede3;padding:14px 18px}'}
};
const t=themes[name];if(!t)throw new Error('Choose blueprint or editorial');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
await fs.mkdir(output,{recursive:true});
for(const file of ['index.html','share.html','diagram.svg']){
 let text=await fs.readFile(path.join(input,file),'utf8');
 const recolor=value=>value.replace(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g,c=>t.colors[c.toLowerCase()]??c);
 text=text.replace(/<style>([\s\S]*?)<\/style>/g,(_,css)=>`<style>${recolor(css)}</style>`).replace(/ style="([^"]*)"/g,(_,css)=>` style="${recolor(css)}"`).replace(/\b(fill|stroke)="(#[0-9a-fA-F]{3,6})"/g,(_,attr,color)=>`${attr}="${recolor(color)}"`);
 if(file.endsWith('.html'))text=text.replace('</style>',t.css+'</style>').replace('<span>Recipe-generated · HTML / CSS</span>','<span>'+t.label+' · HTML / CSS</span>').replace('<span>Recipe-generated · native SVG</span>','<span>'+t.label+' · native SVG</span>');
 text=text.replace(/rx="(?:24|10)"/g,`rx="${name==='blueprint'?3:0}"`);
 await fs.writeFile(path.join(output,file),text);
}
await fs.copyFile(path.join(input,'layout.json'),path.join(output,'layout.json'));
await fs.writeFile(path.join(output,'manifest.json'),JSON.stringify({theme:name,inputManifest:JSON.parse(await fs.readFile(path.join(input,'manifest.json'))),themeCodeSha256:hash(await fs.readFile(new URL(import.meta.url))),geometrySha256:hash(await fs.readFile(path.join(output,'layout.json'))),htmlSha256:hash(await fs.readFile(path.join(output,'share.html'))),perNodeEdits:0},null,2));
console.log(`${name}: ${output}`);
