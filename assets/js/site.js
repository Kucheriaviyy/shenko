/* Renders content.json. Used by index.html and by the editor preview (?preview). */
window.SITE=(()=>{
let S,NOANIM=false;const app=document.getElementById('app');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const POLY=['polygon(0 12%,62% 0,100% 38%,72% 100%,10% 78%)','polygon(0 30%,80% 0,100% 60%,30% 100%)','polygon(0 60%,100% 0,100% 100%,0 100%)','none','polygon(50% 0,100% 100%,0 100%)'];
const rnd=n=>{const x=Math.sin(n*127.1)*43758.5453;return x-Math.floor(x)};
const hs=s=>[...String(s)].reduce((a,c)=>(a*31+c.charCodeAt(0))|0,7);
const col=k=>`var(--${k})`;
const HEX={n:'#ffebde',a:'#f0bd89',b:'#3c140f',r:'#e84e3e',w:'#ffffff'},cc=s=>s?(s.c||(s.kind=='footer'?'b':'n')):'n';
const TOOLS={ai:['Ai','#330000','#ff9a00','Illustrator'],ps:['Ps','#001e36','#31a8ff','Photoshop'],id:['Id','#49021f','#ff3366','InDesign'],bl:['Bl','#1b1b1b','#f5792a','Blender'],fg:['Fg','#1e1e1e','#a259ff','Figma'],ae:['Ae','#00005b','#d291ff','After Effects']};
/* v2: a transition closes the section it belongs to (v1 stored it on the section below) */
function norm(x){x.site=x.site||{};x.sections.forEach((s,i)=>{if(!s.kind)s.kind=s.stat?'header':s.id=='toc'?'toc':'normal';if(!s.name)s.name=s.group||'Секция '+(i+1);s.blocks=s.blocks||[]});
if(!x.site.v){const t=x.sections.map(s=>s.tr);x.sections.forEach((s,i)=>{delete s.tr;if(t[i+1])s.tr=t[i+1]});x.site.v=2}return x}
/* every letter has its own fixed random offset; scroll progress assembles them. mono = quick, no wiggle layer */
function lt(t,salt,str,mono){let k=0;const N=[...t].filter(c=>c.trim()).length||1,m=mono?.5:1;
return String(t).split('\n').map(line=>line.split(' ').map(w=>`<span class="w">${[...w].map(c=>{const s=salt+k*7,i=k++;
const a=`class="L" data-k="${(i/N).toFixed(3)}" data-x="${((rnd(s)-.5)*90*str*m).toFixed(1)}" data-y="${((rnd(s+1)-.5)*50*str*m).toFixed(1)}" data-a="${((rnd(s+2)-.5)*180).toFixed(0)}"`;
return mono?`<i ${a}>${esc(c)}</i>`:`<i ${a}><u style="--r:${((rnd(s+3)-.5)*5).toFixed(1)}deg;--t:${(rnd(s+4)*.7).toFixed(2)}s">${esc(c)}</u></i>`}).join('')}</span>`).join(' ')).join('<br>')}
const ph='<div class="ph"></div>';
const R={
heading:b=>{const wg=b.wg!==false&&S.site.wg!==false&&!NOANIM,fy=b.fy!==false&&S.site.fly!==false&&!NOANIM;
return `<div class="f-${b.f||'d'}${wg?' wg':''}${fy?' fl':''}" style="font-size:${b.fs||8}cqw;color:${col(b.c||'b')};text-align:${b.al||'left'};transform:rotate(${b.rot||0}deg);--wa:${b.wa??1};${b.ls!=null?`letter-spacing:${b.ls}em;`:''}${b.lh?`line-height:${b.lh};`:''}">${wg||fy?lt(b.text||'',hs(b.id),(S.site.str||1)*(b.str??1)):esc(b.text)}</div>`},
text:b=>{const fy=b.fy!==false&&S.site.fly!==false&&!NOANIM;
return `<p class="f-${b.f||'m'}${b.bg?' bg':''}${fy?' fl':''}" data-f="m" style="font-size:${b.fs||3.2}cqw;color:${col(b.c||'b')};text-align:${b.al||'left'};background:${b.bg?col(b.bg):'none'};transform:rotate(${b.rot||0}deg);${b.ls!=null?`letter-spacing:${b.ls}em;`:''}${b.lh?`line-height:${b.lh};`:''}">${fy?lt(b.text||'',hs(b.id),S.site.str||1,true):esc(b.text)}</p>`},
image:b=>`<div class="${b.pol?'pol':''}" style="height:100%;transform:rotate(${b.rot||0}deg)">${b.src?`<img src="${esc(b.src)}" alt="" loading="lazy" style="object-fit:${b.fit||'cover'}">`:ph}</div>`,
carousel:b=>`<div class="car" style="gap:${b.gap??2}cqw">${(b.srcs&&b.srcs.length?b.srcs.map((u,i)=>`<img src="${esc(u)}" alt="" decoding="async"${i>1?' loading="lazy"':''} style="flex-basis:${b.iw||78}%;object-fit:${b.fit||'cover'}">`):Array(b.n||3).fill(`<div class="ph" style="flex:0 0 ${b.iw||78}%"></div>`)).join('')}</div>`,
model:b=>b.src?`<model-viewer src="${esc(b.src)}" camera-controls auto-rotate shadow-intensity="1" loading="lazy"></model-viewer>`:ph,
pdf:b=>b.pages&&b.pages.length>1?`<div class="pdf"${b.single?' data-single="1"':''} data-pages="${esc(JSON.stringify(b.pages))}"></div>`:ph,
shape:b=>`<div style="width:100%;height:100%;background:${col(b.c||'r')};clip-path:${POLY[(b.k||1)-1]||'none'}"></div>`,
tools:b=>`<div class="tl${b.lab?' lab':''}" style="font-size:${b.fs||8}cqw">${(b.items||[]).map(k=>{const t=TOOLS[k];return t?`<div class="t1"><i style="background:${t[1]};color:${t[2]}"><b>${t[0]}</b></i><em>${t[3]}</em></div>`:''}).join('')}</div>`,
card3d:b=>`<div class="c3"><div class="cd"><div class="fc">${b.front?`<img src="${esc(b.front)}" alt="">`:ph}</div><div class="fc bk">${b.back?`<img src="${esc(b.back)}" alt="">`:ph}</div></div></div>`,
/* contents: group = red heading, section name = brown anchor link with its own number */
toc:b=>{const G=[];S.sections.forEach(s=>{if(s.hidden||s.kind!='normal'||s.intoc===false||!s.group)return;let g=G.find(x=>x.n==s.group);if(!g)G.push(g={n:s.group,i:s.id,l:[]});g.l.push(s)});let n=0;
return `<nav class="toc f-m" style="font-size:${b.fs||3}cqw;color:${col(b.c||'b')}">${G.map(g=>`<a class="l1" href="#${g.i}" style="color:${col(b.gc||'r')}">${esc(g.n)}</a>`+g.l.map(s=>`<a class="l2" href="#${s.id}"><span>${esc(s.name)}</span><s></s><span>/${++n}/</span></a>`).join('')).join('')||'<span>Добавь секции в группы, и они появятся здесь</span>'}</nav>`}};
const blk=b=>`<div class="b b-${b.t}${b.hm?' hm':''}${b.hd?' hd':''}" id="b-${b.id}" data-b="${b.id}" style="grid-area:${b.y+1}/${b.x+1}/span ${b.h}/span ${b.w};${b.z?`z-index:${b.z};`:''}${b.op!=null?`opacity:${b.op};`:''}${b.ox||b.oy?`transform:translate(${b.ox||0}cqw,${b.oy||0}cqw);`:''}">${(R[b.t]||(()=>''))(b)}</div>`;
const LEG='<div class="legal f-m"><a data-lg="p">Privacy Policy</a> &nbsp; <a data-lg="t">Terms of Use</a></div>';
const sec=(s,nx,i)=>{const hd=s.kind=='header',ft=s.kind=='footer',rows=Math.max(s.rows||4,...s.blocks.map(b=>b.y+b.h)),c=cc(s);
return `<section id="${s.id}" data-s="${s.id}" data-n="${esc(s.name)}" class="sec${hd||s.full?' full':''}${s.bleed?' bleed':''}${hd?' stat':''}${s.hidden?' hid':''}${ft?' ftr':''}" style="background:${col(c)};color:${col(c=='b'||c=='r'?'n':'b')};${s.tr&&!hd?`z-index:${60-i};`:''}">${s.bg?`<picture>${s.bgm?`<source media="(max-width:699px)" srcset="${esc(s.bgm)}">`:''}<img class="bgi" src="${esc(s.bg)}" alt="" style="object-fit:${s.bgfit||'cover'};object-position:${s.bgx??50}% 50%"></picture>`:''}${s.ov?`<i class="ov" style="opacity:${s.ov/100}"></i>`:''}<div class="g" style="--rows:${rows}">${s.blocks.map(blk).join('')}</div>${ft?LEG:''}${s.tr?`<div class="tr" data-t="${esc(s.tr)}" data-m="${HEX[c]}" data-c="${HEX[cc(nx)]}"${s.tro?' data-o="1"':''}${s.trin?' data-i="1"':''} data-k="${esc(JSON.stringify([s.tc1,s.tc2,s.tc3,s.tc4]))}"></div>`:''}</section>`};
const LG={p:`<h3 class="f-d">Privacy Policy</h3><p>This site does not use cookies or analytics and does not collect personal data. Messages sent to the contact address are used only to reply.</p>`,
t:`<h3 class="f-d">Terms of Use</h3><p>All works and texts on this site are © 2026 Yehor Shevchenko unless stated otherwise. Reuse requires written permission.</p><p>Fonts made from <a href="http://www.onlinewebfonts.com">Web Fonts</a> are licensed by CC BY 4.0.</p>`};
const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* scroll-linked letters: only elements near the screen are updated, and only when their progress changed */
let FL=[];
function collect(){FL=[...document.querySelectorAll('.fl')].map(e=>({e,L:[...e.querySelectorAll('.L')],m:e.dataset.f=='m',p:-1}))}
function tick(){if(still||NOANIM)return;const h=innerHeight;
for(const o of FL){const r=o.e.getBoundingClientRect();let P;
if(r.bottom<-100)P=1;else if(r.top>h*1.05)P=0;else P=Math.min(1,Math.max(0,(h*.95-r.top)/(h*(o.m?.22:.5))));
P=Math.round(P*200)/200;if(P===o.p)continue;o.p=P;const st=o.m?.3:.6;
for(const l of o.L){const p=Math.min(1,Math.max(0,(P-l.dataset.k*st)/(1-st))),q=Math.pow(1-p,3);
l.style.transform=q?`translate(${l.dataset.x*q}cqw,${l.dataset.y*q}cqw) rotate(${l.dataset.a*q}deg)`:''}}}
function pdf(){document.querySelectorAll('.pdf').forEach(el=>{try{const p=JSON.parse(el.dataset.pages);
if(typeof St=='undefined'){el.innerHTML=`<img src="${esc(p[0])}" alt="" style="width:100%;height:100%;object-fit:contain">`;return}
new St.PageFlip(el,{width:650,height:402,size:'stretch',minWidth:100,maxWidth:1000,minHeight:62,maxHeight:620,showCover:true,usePortrait:!!el.dataset.single,mobileScrollSupport:false}).loadFromImages(p)}catch(e){}})}
/* 3D card: takes the aspect ratio of the attached picture */
function cards(){document.querySelectorAll('.c3').forEach(el=>{const cd=el.firstChild,im=cd.querySelector('img');let ar=210/148,ry=-20,v=0,drag=0,lx=0;
const fit=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;let cw=w,ch=w/ar;if(ch>h){ch=h;cw=h*ar}cd.style.width=cw+'px';cd.style.height=ch+'px'};
if(im){const ld=()=>{if(im.naturalWidth){ar=im.naturalWidth/im.naturalHeight;fit()}};im.complete?ld():im.addEventListener('load',ld)}
fit();if(window.ResizeObserver)new ResizeObserver(fit).observe(el);
const set=()=>cd.style.transform=`rotateY(${ry}deg) rotateX(${Math.sin(ry/40)*3}deg)`,run=()=>{ry+=v;v*=.94;set();if(Math.abs(v)>.02&&!drag)requestAnimationFrame(run)};set();
el.addEventListener('pointerdown',e=>{drag=1;lx=e.clientX;v=0;el.setPointerCapture(e.pointerId)});
el.addEventListener('pointermove',e=>{if(!drag)return;v=(e.clientX-lx)*.6;ry+=v;lx=e.clientX;set()});
const up=()=>{drag=0;run()};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up)})}
/* transition = closing element of its section: main layer takes this section's color, transparent parts show the next section */
const TC={};let TN=0;
async function trs(){for(const e of document.querySelectorAll('.tr[data-t]')){const u='assets/transitions/'+e.dataset.t;let t=TC[u];if(!t){try{t=TC[u]=await(await fetch(u)).text()}catch(x){continue}}
const id='x'+(++TN)+'c';t=t.replace(/cls-(\d+)/g,id+'$1');/* each inline svg gets its own class names, otherwise their <style> rules overwrite each other */
const cl=[...t.matchAll(/\.(x\d+c\d+)\s*\{\s*fill:\s*([^;\s]+)\s*;/g)].map(x=>({n:x[1],f:x[2]})),set=(c,k)=>{t=t.replace(new RegExp('(\\.'+c+'\\s*\\{\\s*fill:\\s*)[^;\\s]+'),'$1'+k)};
const main=cl.find(x=>x.f=='#fff')||cl.find(x=>x.f=='#ffebde'),other=cl.find(x=>x!==main&&x.f=='#ffebde');
if(main&&!e.dataset.o){set(main.n,e.dataset.m);if(other)set(other.n,e.dataset.c)}
let K=[];try{K=JSON.parse(e.dataset.k)}catch(x){}cl.forEach((x,i)=>{if(K[i])set(x.n,K[i])});
const v=t.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);e.innerHTML=t.slice(t.indexOf('<svg'));
const nx=e.parentElement.nextElementSibling;if(v&&nx&&nx.classList.contains('sec')&&!e.dataset.i)nx.style.paddingTop=(v[2]/v[1]*100)+'%'}}
const PREV=/[?&]preview/.test(location.search);
const desk=()=>!PREV&&S.site.qr!==false&&!/[?&]full/.test(location.search)&&matchMedia('(min-width:900px) and (hover:hover) and (pointer:fine)').matches;
function qrl(t,mono){let k=0;const N=[...t].filter(c=>c.trim()).length||1;
return t.split(' ').map(w=>`<span class="w">${[...w].map(c=>{const s=hs(t)+k*7,i=k++,d=(i/N*(mono?.5:.9)).toFixed(2);
return `<i class="L" style="--x:${((rnd(s)-.5)*60).toFixed(0)}vw;--y:${((rnd(s+1)-.5)*50).toFixed(0)}vh;--a:${((rnd(s+2)-.5)*200).toFixed(0)}deg;--d:${d}s">${mono?esc(c):`<u style="--r:${((rnd(s+3)-.5)*5).toFixed(1)}deg;--t:${(rnd(s+4)*.7).toFixed(2)}s">${esc(c)}</u>`}</i>`}).join('')}</span>`).join(' ')}
const QR=()=>`<div class="qr"><img src="assets/img/qr.svg" alt="QR code"><h1 class="f-d wg">${qrl(S.site.qrTitle||'Made for your phone')}</h1><p class="f-m">${qrl(S.site.qrText||'This portfolio is designed as a mobile experience. Scan the code to open it on your phone.',1)}</p></div>`;
/* prev = editor preview: hidden sections stay visible (dimmed); anim = letter animation in preview */
function render(s,prev,anim){S=norm(s);NOANIM=!!prev&&!anim;if(S.site.title)document.title=S.site.title;document.body.classList.toggle('nowg',S.site.wg===false);
if(desk()){app.innerHTML=QR();return}
const L=S.sections.filter(x=>prev||!x.hidden);
app.innerHTML=L.map((x,i)=>sec(x,L[i+1],i)).join('')+(L.some(x=>x.kind=='footer')?'':`<footer class="ft">${LEG}<div>SHENKO — Yehor Shevchenko Digital Solutions. © 2026</div></footer>`);
collect();pdf();cards();trs();tick()}
addEventListener('scroll',tick,{passive:true});addEventListener('resize',tick);
document.addEventListener('click',e=>{const i=e.target.closest('.t1');if(!e.target.closest('[data-lg]')){document.querySelectorAll('.t1.on').forEach(x=>x!==i&&x.classList.remove('on'));if(i)i.classList.toggle('on')}
const a=e.target.closest('[data-lg]');if(!a)return;
const d=document.getElementById('dg')||document.body.appendChild(Object.assign(document.createElement('dialog'),{id:'dg'}));
d.innerHTML=LG[a.dataset.lg]+'<p><a href="#" onclick="dg.close();return false">Close</a></p>';d.showModal()});
if(!PREV)fetch('content.json?'+Date.now()).then(r=>r.json()).then(j=>render(j)).catch(e=>{app.textContent='content.json: '+e.message});
return{render,norm}})();
