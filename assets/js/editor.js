const $=s=>document.querySelector(s),fr=$('#fr'),pane=$('#pane');
let S,sel={s:null,b:null},tab='blocks',hist=[],last=0,dev='phone',grid=true,dr=null;
const UP=new Map(),PB=new Map();
const DEV={phone:[390,780],tablet:[768,1024],laptop:[1280,800]};
const PAL=[['n','Беж'],['a','Беж акцент'],['b','Коричневый'],['r','Красный'],['w','Белый']];
const NAMES={heading:'Заголовок',text:'Текст',image:'Картинка',carousel:'Карусель',model:'3D модель',pdf:'PDF-книга',shape:'Шейп',toc:'Оглавление'};
const DEF={heading:{w:8,h:2,text:'Heading',fs:8,f:'d',c:'b'},text:{w:6,h:2,text:'Text',fs:3.2,c:'b'},image:{w:6,h:5},carousel:{w:12,h:5,srcs:[]},model:{w:8,h:7},pdf:{w:8,h:8,pages:[]},shape:{w:4,h:3,k:1,c:'r'},toc:{w:8,h:7,fs:3,c:'b'}};
const AL=['al','Выравнивание','sel',[['left','Лево'],['center','Центр'],['right','Право']]];
const FB={heading:[['text','Текст','area'],['fs','Размер','num'],['f','Шрифт','sel',[['d','Aktiv'],['s','Sloop'],['m','Mono']]],['c','Цвет','col'],AL,['rot','Поворот, градусы','num'],['wg','Wiggle букв','chk'],['fy','Вылет букв при скролле','chk']],
text:[['text','Текст','area'],['fs','Размер','num'],['c','Цвет','col'],['bg','Фон плашки','col0'],AL,['rot','Поворот, градусы','num']],
image:[['src','Файл (assets/img/...)','file'],['pol','Рамка полароид','chk'],['rot','Поворот, градусы','num']],
carousel:[['srcs','Картинки (по одной в строке)','files']],
model:[['src','Файл .glb (assets/models/...)','file']],
pdf:[['pages','Страницы-картинки (assets/pdf/...)','files']],
shape:[['k','Форма 1-5','num'],['c','Цвет','col']],
toc:[['fs','Размер','num'],['c','Цвет','col']]};
const FS=[['c','Фон секции','col'],['bg','Фон-картинка','file'],['ov','Оверлей, %','range'],['tr','Переход сверху','sel','TR'],['group','Подзаголовок (для оглавления)','text'],['rows','Минимум рядов','num'],['full','На весь экран','chk'],['stat','Статичная, остальные наезжают','chk'],['free','Разрешить наложение блоков','chk']];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,8);
const disp=u=>UP.get(u)?.path||u,parse=u=>PB.get(u)||u;
const sec=()=>S.sections.find(s=>s.id==sel.s),blk=()=>sec()?.blocks.find(b=>b.id==sel.b);
const snap=()=>{hist.push(JSON.stringify(S));if(hist.length>80)hist.shift()};
const snapD=()=>{const n=Date.now();if(n-last>900)snap();last=n};
const hit=(a,b)=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;
const free=(s,B,c)=>s.free||!s.blocks.some(o=>o!==B&&hit(c,o));
function place(s,b){if(free(s,b,b))return;for(let y=b.y;y<300;y++)for(let x=0;x+b.w<=12;x++){const c={x,y,w:b.w,h:b.h};if(free(s,b,c)){b.x=x;b.y=y;return}}}
const CSS=`.b{touch-action:none;cursor:grab;outline:1px dashed rgba(232,78,62,.5);outline-offset:-1px}.b *{pointer-events:none}.b.sel{outline:2px solid #e84e3e;z-index:50}.b .rs{pointer-events:auto;position:absolute;right:-7px;bottom:-7px;width:16px;height:16px;background:#e84e3e;cursor:nwse-resize;z-index:99}.ss{box-shadow:inset 0 0 0 3px #f0bd89}.gr .g{background-image:linear-gradient(to right,rgba(232,78,62,.22) 1px,transparent 1px),linear-gradient(to bottom,rgba(232,78,62,.22) 1px,transparent 1px);background-size:calc(100%/12) var(--u)}.gr .full .g{background-size:calc(100%/12) calc(100%/var(--rows))}`;
/* preview */
function size(){const[w,h]=DEV[dev],st=$('#stage'),k=Math.min(1,(st.clientWidth-52)/w,(st.clientHeight-60)/h);fr.style.width=w+'px';fr.style.height=h+'px';$('#dev').style.transform=`scale(${k})`;$('#dev').style.marginBottom=(-(h+28)*(1-k))+'px';document.querySelectorAll('[data-d]').forEach(b=>b.classList.toggle('on',b.dataset.d==dev))}
function mark(){const d=fr.contentDocument;if(!d.body)return;d.body.classList.toggle('gr',grid);d.querySelectorAll('.sel,.ss').forEach(e=>e.classList.remove('sel','ss'));d.querySelectorAll('.rs').forEach(e=>e.remove());
d.querySelector(`[data-s="${sel.s}"]`)?.classList.add('ss');const b=sel.b&&d.querySelector(`[data-b="${sel.b}"]`);if(b){b.classList.add('sel');b.insertAdjacentHTML('beforeend','<i class="rs"></i>')}}
function commit(p){const w=fr.contentWindow;if(!w.SITE)return;w.SITE.render(S);mark();if(p)pane_()}
function met(sc){const g=sc.querySelector('.g'),r=g.getBoundingClientRect(),n=+g.style.getPropertyValue('--rows'),cw=r.width/12;return{cw,ch:sc.classList.contains('full')?r.height/n:cw,r}}
function add(t,sid,x,y){const s=S.sections.find(q=>q.id==sid);if(!s)return;snap();const b={id:uid(),t,...structuredClone(DEF[t]),x:0,y:0};b.x=Math.max(0,Math.min(12-b.w,x));b.y=Math.max(0,y);place(s,b);s.blocks.push(b);sel={s:sid,b:b.id};tab='props';commit(true)}
function delb(){if(!blk())return;snap();const s=sec();s.blocks=s.blocks.filter(x=>x.id!=sel.b);sel.b=null;commit(true)}
function wire(){const d=fr.contentDocument,st=d.createElement('style');st.textContent=CSS;d.head.appendChild(st);
d.addEventListener('click',e=>e.preventDefault(),true);
d.addEventListener('pointerdown',e=>{const bl=e.target.closest('.b'),sc=e.target.closest('.sec');if(!sc)return;
sel={s:sc.dataset.s,b:bl?bl.dataset.b:null};tab='props';mark();pane_();if(!bl)return;e.preventDefault();
const B=blk();snap();bl.setPointerCapture(e.pointerId);dr={bl,rs:!!e.target.closest('.rs'),x:e.clientX,y:e.clientY,o:{x:B.x,y:B.y,w:B.w,h:B.h},sc}});
d.addEventListener('pointermove',e=>{if(!dr)return;const B=blk(),s=sec(),m=met(dr.sc),o=dr.o,dx=Math.round((e.clientX-dr.x)/m.cw),dy=Math.round((e.clientY-dr.y)/m.ch);
const c=dr.rs?{x:o.x,y:o.y,w:Math.max(1,Math.min(12-o.x,o.w+dx)),h:Math.max(1,o.h+dy)}:{x:Math.max(0,Math.min(12-o.w,o.x+dx)),y:Math.max(0,o.y+dy),w:o.w,h:o.h};
if(free(s,B,c)){Object.assign(B,c);dr.bl.style.gridArea=`${B.y+1}/${B.x+1}/span ${B.h}/span ${B.w}`}});
d.addEventListener('pointerup',()=>{if(dr){dr=null;commit(true)}});
d.addEventListener('dragover',e=>e.preventDefault());
d.addEventListener('drop',e=>{e.preventDefault();const t=e.dataTransfer.getData('text/plain'),sc=e.target.closest('.sec');if(!DEF[t]||!sc)return;const m=met(sc);
add(t,sc.dataset.s,Math.round((e.clientX-m.r.left)/m.cw-DEF[t].w/2),Math.round((e.clientY-m.r.top)/m.ch-DEF[t].h/2))});
d.addEventListener('keydown',key)}
function key(e){if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.key=='Delete'||e.key=='Backspace'){e.preventDefault();delb()}if((e.ctrlKey||e.metaKey)&&e.key=='z'){e.preventDefault();undo()}}
addEventListener('keydown',key);
function undo(){if(hist.length){S=JSON.parse(hist.pop());commit(true)}}
/* panels */
function fld(o,[k,l,t,op],sc){const v=o[k],a=`data-k="${k}" data-sc="${sc}"`,dv=['wg','fy','fly'].includes(k);let h;
if(t=='chk')h=`<input type="checkbox" ${a} ${(v===undefined?dv:v)?'checked':''}>`;
else if(t=='area')h=`<textarea rows="3" ${a}>${esc(v)}</textarea>`;
else if(t=='list')h=`<textarea rows="4" data-list ${a}>${esc((v||[]).join('\n'))}</textarea>`;
else if(t=='num')h=`<input type="number" step="any" value="${v??''}" ${a}>`;
else if(t=='range')h=`<input type="range" min="0" max="90" value="${v||0}" ${a}>`;
else if(t=='sel'||t=='col'||t=='col0'){const L=t=='sel'?(op=='TR'?[['','Нет']].concat((S.site.transitions||[]).map(x=>[x,x])):op):(t=='col0'?[['','Нет']]:[]).concat(PAL);h=`<select ${a}>${L.map(([x,n])=>`<option value="${x}"${(v||'')==x?' selected':''}>${n}</option>`).join('')}</select>`}
else if(t=='file')h=`<input type="text" value="${esc(disp(v))}" ${a}><button data-up="${k}" data-sc="${sc}">Загрузить файл</button>`;
else if(t=='files')h=`<textarea rows="4" data-list ${a}>${esc((v||[]).map(disp).join('\n'))}</textarea><button data-up="${k}" data-sc="${sc}" data-m="1">Загрузить файлы</button>`;
else h=`<input type="text" value="${esc(v)}" ${a}>`;
return `<label class="f"><span>${l}</span>${h}</label>`}
function pane_(){document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t==tab));
if(tab=='blocks')pane.innerHTML=`<h4>Блоки: перетащи на превью или нажми</h4><div class="lg">${Object.keys(NAMES).map(t=>`<div class="lib" draggable="true" data-t="${t}">${NAMES[t]}</div>`).join('')}</div><h4>Секции</h4>${S.sections.map((s,i)=>`<div class="row${s.id==sel.s?' on':''}" data-s="${s.id}"><span>${esc(s.group||'Секция '+(i+1))}</span><button data-a="up" data-i="${i}">Вверх</button><button data-a="dn" data-i="${i}">Вниз</button><button data-a="ds" data-i="${i}">Удалить</button></div>`).join('')}<button class="big" data-a="as">Добавить секцию</button>`;
else if(tab=='site')pane.innerHTML=`<h4>Весь сайт</h4>${[['wg','Wiggle букв','chk'],['fly','Вылет букв при скролле','chk'],['str','Сила вылета (1 = обычная)','num'],['contact','Контакты в футере','text'],['transitions','Переходы: имена файлов из assets/transitions','list']].map(f=>fld(S.site,f,'site')).join('')}`;
else{const s=sec(),b=blk();pane.innerHTML=!s?'<p class="hint">Нажми на блок или на фон секции в превью.</p>':!b?`<h4>Секция</h4>${FS.map(f=>fld(s,f,'s')).join('')}`
:`<h4>${NAMES[b.t]}</h4>${FB[b.t].map(f=>fld(b,f,'b')).join('')}${fld(b,['toc','Пункт в оглавлении','text'],'b')}<h4>Положение в сетке</h4><div class="xy">${['x','y','w','h'].map(k=>fld(b,[k,k,'num'],'b')).join('')}</div>${fld(b,['z','Слой','num'],'b')}<button data-a="dup">Дублировать</button><button data-a="del">Удалить блок</button>`}}
pane.addEventListener('dragstart',e=>{const l=e.target.closest('.lib');if(l)e.dataTransfer.setData('text/plain',l.dataset.t)});
pane.addEventListener('input',e=>{const t=e.target,k=t.dataset.k;if(!k)return;snapD();const o=t.dataset.sc=='site'?S.site:t.dataset.sc=='b'?blk():sec();let v;
if(t.type=='checkbox')v=t.checked;else if(t.type=='number'||t.type=='range')v=t.value===''?undefined:+t.value;
else if('list' in t.dataset)v=t.value.split('\n').map(x=>parse(x.trim())).filter(Boolean);else v=parse(t.value);
if(v===undefined||v==='')delete o[k];else o[k]=v;commit()});
pane.addEventListener('click',e=>{const t=e.target,a=t.dataset.a;
if(t.dataset.up)return upload(t.dataset.up,t.dataset.sc,t.dataset.m);
if(a=='up'||a=='dn'){snap();const i=+t.dataset.i,j=a=='up'?i-1:i+1;if(S.sections[j])[S.sections[i],S.sections[j]]=[S.sections[j],S.sections[i]];return commit(true)}
if(a=='ds'){if(confirm('Удалить секцию?')){snap();S.sections.splice(+t.dataset.i,1);sel={s:null,b:null};commit(true)}return}
if(a=='as'){snap();const s={id:uid(),c:'n',rows:6,blocks:[]};S.sections.push(s);sel={s:s.id,b:null};tab='props';return commit(true)}
if(a=='del')return delb();
if(a=='dup'){const b=blk(),s=sec();if(!b)return;snap();const n={...structuredClone(b),id:uid(),y:b.y+b.h};place(s,n);s.blocks.push(n);sel.b=n.id;return commit(true)}
const l=t.closest('.lib');if(l){const s=sec()||S.sections[S.sections.length-1];return s&&add(l.dataset.t,s.id,0,0)}
const r=t.closest('.row');if(r){sel={s:r.dataset.s,b:null};tab='props';mark();pane_();fr.contentDocument.getElementById(sel.s)?.scrollIntoView()}});
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{tab=b.dataset.t;pane_()});
/* files */
async function reg(file,dir0){let blob=file,name=file.name.replace(/[^\w.\-]+/g,'_'),dir=dir0;
if(file.type.startsWith('image/')&&file.type!='image/svg+xml'){const im=await createImageBitmap(file),k=Math.min(1,1600/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);blob=await new Promise(r=>c.toBlob(r,'image/webp',.85));name=name.replace(/\.\w+$/,'')+'.webp'}
else if(!file.type.startsWith('image/'))dir=/\.pdf$/i.test(name)?'assets/pdf':'assets/models';
const u=URL.createObjectURL(blob),path=dir+'/'+name;UP.set(u,{blob,path});PB.set(path,u);return u}
function upload(k,sc,m){const f=document.createElement('input'),b=sc=='b'?blk():null;f.type='file';f.multiple=!!m;f.accept=b&&b.t=='model'?'.glb,.gltf':'image/*';
f.onchange=async()=>{snap();const o=sc=='site'?S.site:b||sec(),dir=b&&b.t=='pdf'?'assets/pdf':'assets/img',us=[];for(const x of f.files)us.push(await reg(x,dir));o[k]=m?(o[k]||[]).concat(us):us[0];commit(true)};f.click()}
/* save */
function out(){const o=JSON.parse(JSON.stringify(S)),q=new Set;(function w(x){for(const k in x){const v=x[k];if(typeof v=='string'&&v.startsWith('blob:')){const f=UP.get(v);if(f){q.add(f);x[k]=f.path}}else if(v&&typeof v=='object')w(v)}})(o);return[o,[...q]]}
const st=m=>{$('#st').textContent=m};
function cfg(){const repo=prompt('Репозиторий (владелец/имя)'),t=prompt('GitHub токен (только этот репозиторий, Contents: read and write)');if(repo&&t)localStorage.gh=JSON.stringify({repo,t,br:'main'})}
async function gh(path,b64){const c=JSON.parse(localStorage.gh),u=`https://api.github.com/repos/${c.repo}/contents/${path}`,h={Authorization:'Bearer '+c.t,Accept:'application/vnd.github+json'};
const g=await fetch(u+'?ref='+c.br,{headers:h}),sha=g.ok?(await g.json()).sha:undefined;
const r=await fetch(u,{method:'PUT',headers:h,body:JSON.stringify({message:'Update '+path,content:b64,branch:c.br,sha})});if(!r.ok)throw new Error(r.status+' '+(await r.text()).slice(0,100))}
const b64=bl=>new Promise(r=>{const f=new FileReader;f.onload=()=>r(f.result.split(',')[1]);f.readAsDataURL(bl)});
async function push(){try{if(!localStorage.gh)cfg();if(!localStorage.gh)return;const[o,q]=out();let n=0;
for(const f of q){st(`Файлы ${++n}/${q.length}...`);await gh(f.path,await b64(f.blob))}
st('content.json...');await gh('content.json',btoa(unescape(encodeURIComponent(JSON.stringify(o,null,1)))));st('Отправлено. Сайт обновится через 1-2 минуты.')}catch(e){st('Ошибка: '+e.message)}}
$('#top').addEventListener('click',e=>{const t=e.target,a=t.dataset.a;if(t.dataset.d){dev=t.dataset.d;return size()}
if(a=='grid'){grid=!grid;t.classList.toggle('on',grid);mark()}if(a=='undo')undo();if(a=='push')push();if(a=='cfg'){localStorage.removeItem('gh');cfg()}
if(a=='open')open('index.html');
if(a=='json'){const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([JSON.stringify(out()[0],null,1)]));l.download='content.json';l.click()}});
addEventListener('resize',size);
fr.onload=()=>{wire();commit()};
fetch('content.json?'+Date.now()).then(r=>r.json()).then(j=>{S=j;S.site=S.site||{};S.site.transitions=S.site.transitions||[];$('[data-a=grid]').classList.add('on');size();pane_();fr.src='index.html?preview'}).catch(()=>st('Открой редактор по адресу сайта (или через локальный сервер), не двойным кликом'));
