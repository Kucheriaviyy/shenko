/* Renders content.json. Used by index.html and by the editor preview (?preview). */
const SITE=(()=>{
let S;const app=document.getElementById('app');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const POLY=['polygon(0 12%,62% 0,100% 38%,72% 100%,10% 78%)','polygon(0 30%,80% 0,100% 60%,30% 100%)','polygon(0 60%,100% 0,100% 100%,0 100%)','none','polygon(50% 0,100% 100%,0 100%)'];
const rnd=n=>{const x=Math.sin(n*127.1)*43758.5453;return x-Math.floor(x)};
const hs=s=>[...String(s)].reduce((a,c)=>(a*31+c.charCodeAt(0))|0,7);
const col=k=>`var(--${k})`;
/* every letter gets its own fixed random offset; scroll progress assembles them */
function lt(t,salt,str){let k=0;const N=[...t].filter(c=>c.trim()).length||1;
return String(t).split('\n').map(line=>line.split(' ').map(w=>`<span class="w">${[...w].map(c=>{const s=salt+k*7;const i=k++;
return `<i class="L" data-k="${(i/N).toFixed(3)}" data-x="${((rnd(s)-.5)*90*str).toFixed(1)}" data-y="${((rnd(s+1)-.5)*50*str).toFixed(1)}" data-a="${((rnd(s+2)-.5)*180).toFixed(0)}"><u style="--r:${((rnd(s+3)-.5)*5).toFixed(1)}deg;--t:${(rnd(s+4)*.7).toFixed(2)}s">${esc(c)}</u></i>`}).join('')}</span>`).join(' ')).join('<br>')}
const ph='<div class="ph"></div>';
const R={
heading:b=>{const wg=b.wg!==false&&S.site.wg!==false,fy=b.fy!==false&&S.site.fly!==false;
return `<div class="f-${b.f||'d'}${wg?' wg':''}${fy?' fl':''}" style="font-size:${b.fs||8}cqw;color:${col(b.c||'b')};text-align:${b.al||'left'};transform:rotate(${b.rot||0}deg)">${wg||fy?lt(b.text||'',hs(b.id),S.site.str||1):esc(b.text)}</div>`},
text:b=>`<p class="f-${b.f||'m'}${b.bg?' bg':''}" style="font-size:${b.fs||3.2}cqw;color:${col(b.c||'b')};text-align:${b.al||'left'};background:${b.bg?col(b.bg):'none'};transform:rotate(${b.rot||0}deg)">${esc(b.text)}</p>`,
image:b=>`<div class="${b.pol?'pol':''}" style="height:100%;transform:rotate(${b.rot||0}deg)">${b.src?`<img src="${esc(b.src)}" alt="" loading="lazy">`:ph}</div>`,
carousel:b=>`<div class="car">${(b.srcs&&b.srcs.length?b.srcs.map(u=>`<img src="${esc(u)}" alt="" loading="lazy">`):[ph,ph,ph]).join('')}</div>`,
model:b=>b.src?`<model-viewer src="${esc(b.src)}" camera-controls auto-rotate shadow-intensity="1" loading="lazy"></model-viewer>`:ph,
pdf:b=>b.pages&&b.pages.length>1?`<div class="pdf" data-pages="${esc(JSON.stringify(b.pages))}"></div>`:ph,
shape:b=>`<div style="width:100%;height:100%;background:${col(b.c||'r')};clip-path:${POLY[(b.k||1)-1]||'none'}"></div>`,
toc:b=>{let n=0;return `<nav class="toc f-m" style="font-size:${b.fs||3}cqw;color:${col(b.c||'b')}">${S.sections.map(s=>s.group?`<a class="l1" href="#${s.id}"><span>${esc(s.group)}</span><s></s><span>/${++n}/</span></a>`+s.blocks.filter(x=>x.toc).map(x=>`<a class="l2" href="#b-${x.id}">${esc(x.toc)}</a>`).join(''):'').join('')}</nav>`}};
const blk=b=>`<div class="b b-${b.t}" id="b-${b.id}" data-b="${b.id}" style="grid-area:${b.y+1}/${b.x+1}/span ${b.h}/span ${b.w};${b.z?`z-index:${b.z}`:''}">${(R[b.t]||(()=>''))(b)}</div>`;
const sec=s=>{const rows=Math.max(s.rows||4,...s.blocks.map(b=>b.y+b.h));
return `<section id="${s.id}" data-s="${s.id}" class="sec${s.full?' full':''}${s.stat?' stat':''}" style="background:${col(s.c||'n')};color:${col(s.c=='b'||s.c=='r'?'n':'b')}">${s.bg?`<img class="bgi" src="${esc(s.bg)}" alt="">`:''}${s.ov?`<i class="ov" style="opacity:${s.ov/100}"></i>`:''}${s.tr?`<img class="tr" src="assets/transitions/${esc(s.tr)}" alt="">`:''}<div class="g" style="--rows:${rows}">${s.blocks.map(blk).join('')}</div></section>`};
const LG={p:`<h3 class="f-d">Privacy Policy</h3><p>This site does not use cookies or analytics and does not collect personal data. Messages sent to the contact address are used only to reply.</p>`,
t:`<h3 class="f-d">Terms of Use</h3><p>All works and texts on this site are © 2026 Yehor Shevchenko unless stated otherwise. Reuse requires written permission.</p><p>Fonts made from <a href="http://www.onlinewebfonts.com">Web Fonts</a> are licensed by CC BY 4.0.</p>`};
const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
function tick(){if(still)return;const h=innerHeight;
document.querySelectorAll('.fl').forEach(e=>{const r=e.getBoundingClientRect();
const P=Math.min(1,Math.max(0,(h*.95-r.top)/(h*.5)));
e.querySelectorAll('.L').forEach(l=>{const p=Math.min(1,Math.max(0,(P-l.dataset.k*.6)/.4)),q=Math.pow(1-p,3);
l.style.transform=q?`translate(${l.dataset.x*q}cqw,${l.dataset.y*q}cqw) rotate(${l.dataset.a*q}deg)`:''})})}
function pdf(){document.querySelectorAll('.pdf').forEach(el=>{try{const p=JSON.parse(el.dataset.pages);
new St.PageFlip(el,{width:300,height:420,size:'stretch',minWidth:150,maxWidth:700,minHeight:200,maxHeight:980,showCover:true}).loadFromImages(p)}catch(e){}})}
function render(s){S=s;S.site=S.site||{};document.body.classList.toggle('nowg',S.site.wg===false);
app.innerHTML=S.sections.map(sec).join('')+`<footer class="ft"><div>${esc(S.site.contact)}</div><div><a data-lg="p">Privacy Policy</a> &nbsp; <a data-lg="t">Terms of Use</a></div><div>SHENKO — Yehor Shevchenko Digital Solutions. © 2026</div></footer>`;
pdf();tick()}
addEventListener('scroll',tick,{passive:true});addEventListener('resize',tick);
document.addEventListener('click',e=>{const a=e.target.closest('[data-lg]');if(!a)return;
const d=document.getElementById('dg')||document.body.appendChild(Object.assign(document.createElement('dialog'),{id:'dg'}));
d.innerHTML=LG[a.dataset.lg]+'<p><a href="#" onclick="dg.close();return false">Close</a></p>';d.showModal()});
if(!/[?&]preview/.test(location.search))fetch('content.json?'+Date.now()).then(r=>r.json()).then(render).catch(()=>{app.textContent='content.json not found'});
return{render}})();
