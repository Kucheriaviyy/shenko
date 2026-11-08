const $=s=>document.querySelector(s),fr=$('#fr'),LEFT=$('#left'),RT=$('#right'),RAIL=$('#rail');
let S,sel={s:null,b:null},ltab='layers',menu=false,hist=[],last=0,dev='phone',grid=true,dr=null,dragS=null;
const UP=new Map(),PB=new Map();
const DEV={phone:[390,780],tablet:[768,1024],laptop:[1280,800]};
const PAL=[['n','Беж'],['a','Беж акцент'],['b','Коричневый'],['r','Красный'],['w','Белый']];
const FONTS=[['d','Aktiv (жирный)'],['s','Sloop (рукописный)'],['m','Mono']];
const NAMES={heading:'Заголовок',text:'Текст',image:'Картинка',carousel:'Карусель',model:'3D модель',pdf:'PDF-книга',shape:'Шейп',toc:'Оглавление'};
const KIND={normal:'Обычная',header:'Хедер',toc:'Содержание',footer:'Футер'};
const DEF={heading:{w:8,h:2,text:'Heading',fs:8,f:'d',c:'b'},text:{w:6,h:2,text:'Text',fs:3.2,c:'b'},image:{w:6,h:5},carousel:{w:12,h:5,srcs:[]},model:{w:8,h:7},pdf:{w:8,h:8,pages:[]},shape:{w:4,h:3,k:1,c:'r'},toc:{w:8,h:7,fs:3,c:'b'}};
const sv=d=>`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${d}</svg>`;
const I={eye:sv('<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>'),off:sv('<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><path d="M3 3l18 18"/>'),trash:sv('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),plus:sv('<path d="M12 5v14M5 12h14"/>'),layers:sv('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),gear:sv('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>')};
const AL=['al','Выравнивание','sel',[['left','Лево'],['center','Центр'],['right','Право']]];
const FB={heading:[['_','Текст'],['text','Текст','area'],['fs','Размер','num'],['f','Шрифт','sel',FONTS],['c','Цвет','col'],AL,['rot','Поворот, град','num'],['_','Анимация'],['fy','Вылет букв при скролле','chk'],['str','Сила вылета (1 = обычная)','num'],['wg','Wiggle букв','chk'],['wa','Сила wiggle (1 = обычная)','num']],
text:[['_','Текст'],['text','Текст','area'],['fs','Размер','num'],['f','Шрифт','sel',FONTS],['c','Цвет','col'],['bg','Фон плашки','col0'],AL,['rot','Поворот, град','num']],
image:[['_','Картинка'],['src','Файл','file'],['pol','Рамка полароид','chk'],['rot','Поворот, град','num']],
carousel:[['_','Карусель'],['srcs','Картинки (по одной в строке)','files']],
model:[['_','3D модель'],['src','Файл .glb','file']],
pdf:[['_','PDF-книга'],['pages','Страницы-картинки','files']],
shape:[['_','Шейп'],['k','Форма 1-5','num'],['c','Цвет','col']],
toc:[['_','Оглавление'],['fs','Размер','num'],['c','Цвет','col']]};
const VIEW=[['_','Вид и показ'],['op','Прозрачность (0-1)','num'],['z','Слой (z)','num'],['hm','Скрыть на телефоне','chk'],['hd','Скрыть на компьютере','chk']];
function secFields(s){const k=s.kind,f=[['_','Секция'],['name','Название','text']];
if(k=='normal')f.push(['group','Группа (заголовок в оглавлении)','text'],['intoc','Показывать в оглавлении','chk']);
f.push(['_','Фон'],['c','Цвет фона','col'],['bg','Картинка фона','file'],['bgm','Картинка фона для телефона','file'],['bgfit','Вписывание','sel',[['cover','Заполнить экран'],['contain','Вписать целиком']]],['bgx','Фокус по горизонтали, %','range'],['ov','Затемнение, %','range'],['_','Размер'],['rows','Минимум рядов сетки','num']);
if(k=='normal')f.push(['full','Высота на весь экран','chk']);
f.push(['_','Поведение']);if(k!='header')f.push(['tr','Переход сверху','sel','TR']);
f.push(['free','Разрешить наложение блоков','chk'],['hidden','Скрыть секцию на сайте','chk']);return f}
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,8);
const disp=u=>UP.get(u)?.path||u,parse=u=>PB.get(u)||u;
const sec=()=>S.sections.find(s=>s.id==sel.s),blk=()=>sec()?.blocks.find(b=>b.id==sel.b);
const snap=()=>{hist.push(JSON.stringify(S));if(hist.length>80)hist.shift()};
const snapD=()=>{const n=Date.now();if(n-last>900)snap();last=n};
const hit=(a,b)=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;
const free=(s,B,c)=>s.free||!s.blocks.some(o=>o!==B&&hit(c,o));
const order=()=>{const r={header:0,footer:2};S.sections.sort((a,b)=>(r[a.kind]??1)-(r[b.kind]??1))};
function place(s,b){if(free(s,b,b))return;for(let y=b.y;y<300;y++)for(let x=0;x+b.w<=12;x++){const c={x,y,w:b.w,h:b.h};if(free(s,b,c)){b.x=x;b.y=y;return}}}
const mk=(t,x,y,o={})=>({id:uid(),t,...structuredClone(DEF[t]),x,y,...o});
const TPL={normal:()=>({name:'Новая секция',c:'n',rows:6,blocks:[]}),
header:()=>({name:'Хедер',c:'n',rows:16,blocks:[mk('heading',0,3,{w:12,h:4,text:'YOUR NAME',fs:20})]}),
toc:()=>({name:'Содержание',c:'n',rows:9,blocks:[mk('heading',0,0,{w:12,text:'Table of Contents',fs:9}),mk('toc',0,2)]}),
footer:()=>({name:'Футер',c:'b',rows:3,blocks:[mk('text',0,0,{w:8,text:'Contact: your@email.com',c:'n'})]})};
function addSection(k){if((k=='header'||k=='footer')&&S.sections.some(s=>s.kind==k)){sel={s:S.sections.find(s=>s.kind==k).id,b:null};st('Такая секция уже есть, она выбрана');return commit(true)}
snap();const s={id:uid(),kind:k,...TPL[k]()},cur=sec();
if(k=='normal'&&cur&&cur.kind=='normal'){if(cur.group)s.group=cur.group;S.sections.splice(S.sections.indexOf(cur)+1,0,s)}else S.sections.push(s);
order();sel={s:s.id,b:null};menu=false;commit(true)}
/* preview */
const CSS=`.b{touch-action:none;cursor:grab;outline:1px dashed rgba(232,78,62,.5);outline-offset:-1px}.b *{pointer-events:none}.b.sel{outline:2px solid #e84e3e;z-index:50}.b .rs{pointer-events:auto;position:absolute;right:-7px;bottom:-7px;width:16px;height:16px;background:#e84e3e;cursor:nwse-resize;z-index:99}.ss{box-shadow:inset 0 0 0 3px #f0bd89}.ss::after{content:attr(data-n);position:absolute;left:0;top:0;background:#e84e3e;color:#fff;font:600 11px system-ui;padding:3px 8px;z-index:200}.gr .g{background-image:linear-gradient(to right,rgba(232,78,62,.22) 1px,transparent 1px),linear-gradient(to bottom,rgba(232,78,62,.22) 1px,transparent 1px);background-size:calc(100%/12) var(--u)}.gr .full .g{background-size:calc(100%/12) calc(100%/var(--rows))}`;
function size(){const[w,h]=DEV[dev],s=$('#stage'),k=Math.min(1,(s.clientWidth-52)/w,(s.clientHeight-60)/h);fr.style.width=w+'px';fr.style.height=h+'px';$('#dev').style.transform=`scale(${k})`;$('#dev').style.marginBottom=(-(h)*(1-k))+'px';document.querySelectorAll('[data-d]').forEach(b=>b.classList.toggle('on',b.dataset.d==dev))}
function mark(){const d=fr.contentDocument;if(!d||!d.body)return;d.body.classList.toggle('gr',grid);d.querySelectorAll('.sel,.ss').forEach(e=>e.classList.remove('sel','ss'));d.querySelectorAll('.rs').forEach(e=>e.remove());
d.querySelector(`[data-s="${sel.s}"]`)?.classList.add('ss');const b=sel.b&&d.querySelector(`[data-b="${sel.b}"]`);if(b){b.classList.add('sel');b.insertAdjacentHTML('beforeend','<i class="rs"></i>')}}
function commit(p){try{const w=fr.contentWindow;if(!w||!w.SITE){st('Превью не загрузилось: на сервере старый index.html или assets/js/site.js. Залей новые файлы и обнови страницу (Ctrl+F5).');return}w.SITE.render(S,true);mark();if(p){left_();right_()}}catch(e){st('Ошибка превью: '+e.message);console.error(e)}}
addEventListener('error',e=>st('Ошибка: '+e.message));
function met(sc){const g=sc.querySelector('.g'),r=g.getBoundingClientRect(),n=+g.style.getPropertyValue('--rows'),cw=r.width/12;return{cw,ch:sc.classList.contains('full')?r.height/n:cw,r}}
function addBlock(t,sid,x,y){const s=S.sections.find(q=>q.id==sid);if(!s)return;snap();const b=mk(t,0,0);b.x=Math.max(0,Math.min(12-b.w,x));b.y=Math.max(0,y);place(s,b);s.blocks.push(b);sel={s:sid,b:b.id};commit(true)}
function delb(){if(!blk())return;snap();sec().blocks=sec().blocks.filter(x=>x.id!=sel.b);sel.b=null;commit(true)}
function wire(){const d=fr.contentDocument,st=d.createElement('style');st.textContent=CSS;d.head.appendChild(st);
d.addEventListener('click',e=>e.preventDefault(),true);
d.addEventListener('pointerdown',e=>{const bl=e.target.closest('.b'),sc=e.target.closest('.sec');if(!sc)return;
sel={s:sc.dataset.s,b:bl?bl.dataset.b:null};mark();left_();right_();if(!bl)return;e.preventDefault();
const B=blk();snap();bl.setPointerCapture(e.pointerId);dr={bl,rs:!!e.target.closest('.rs'),x:e.clientX,y:e.clientY,o:{x:B.x,y:B.y,w:B.w,h:B.h},sc}});
d.addEventListener('pointermove',e=>{if(!dr)return;const B=blk(),s=sec(),m=met(dr.sc),o=dr.o,dx=Math.round((e.clientX-dr.x)/m.cw),dy=Math.round((e.clientY-dr.y)/m.ch);
const c=dr.rs?{x:o.x,y:o.y,w:Math.max(1,Math.min(12-o.x,o.w+dx)),h:Math.max(1,o.h+dy)}:{x:Math.max(0,Math.min(12-o.w,o.x+dx)),y:Math.max(0,o.y+dy),w:o.w,h:o.h};
if(free(s,B,c)){Object.assign(B,c);dr.bl.style.gridArea=`${B.y+1}/${B.x+1}/span ${B.h}/span ${B.w}`}});
d.addEventListener('pointerup',()=>{if(dr){dr=null;commit(true)}});
d.addEventListener('dragover',e=>e.preventDefault());
d.addEventListener('drop',e=>{e.preventDefault();const t=e.dataTransfer.getData('text/plain'),sc=e.target.closest('.sec');if(!DEF[t]||!sc)return;const m=met(sc);
addBlock(t,sc.dataset.s,Math.round((e.clientX-m.r.left)/m.cw-DEF[t].w/2),Math.round((e.clientY-m.r.top)/m.ch-DEF[t].h/2))});
d.addEventListener('keydown',key)}
function key(e){if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.key=='Delete'||e.key=='Backspace'){e.preventDefault();delb()}if((e.ctrlKey||e.metaKey)&&e.key=='z'){e.preventDefault();undo()}}
addEventListener('keydown',key);
function undo(){if(hist.length){S=JSON.parse(hist.pop());commit(true)}}
/* panels */
function fld(o,[k,l,t,op],sc){if(k=='_')return `<h5>${l}</h5>`;const v=o[k],a=`data-k="${k}" data-sc="${sc}"`,dv=['wg','fy','fly','intoc'].includes(k);let h;
if(t=='chk')return `<label class="f ck"><input type="checkbox" ${a} ${(v===undefined?dv:v)?'checked':''}><span>${l}</span></label>`;
if(t=='area')h=`<textarea rows="3" ${a}>${esc(v)}</textarea>`;
else if(t=='list')h=`<textarea rows="4" data-list ${a}>${esc((v||[]).join('\n'))}</textarea>`;
else if(t=='num')h=`<input type="number" step="any" value="${v??''}" ${a}>`;
else if(t=='range')h=`<input type="range" min="0" max="100" value="${v??(k=='bgx'?50:0)}" ${a}>`;
else if(t=='sel'||t=='col'||t=='col0'){const L=t=='sel'?(op=='TR'?[['','Нет']].concat((S.site.transitions||[]).map(x=>[x,x])):op):(t=='col0'?[['','Нет']]:[]).concat(PAL);h=`<select ${a}>${L.map(([x,n])=>`<option value="${x}"${(v||(t=='col'?(o.kind=='footer'?'b':k=='c'&&sc=='s'?'n':'b'):''))==x?' selected':''}>${n}</option>`).join('')}</select>`}
else if(t=='file')h=`<input type="text" value="${esc(disp(v))}" ${a}><button data-up="${k}" data-sc="${sc}">Загрузить файл</button>`;
else if(t=='files')h=`<textarea rows="4" data-list ${a}>${esc((v||[]).map(disp).join('\n'))}</textarea><button data-up="${k}" data-sc="${sc}" data-m="1">Загрузить файлы</button>`;
else h=`<input type="text" value="${esc(v)}" ${a}${k=='group'?' list="gl"':''}>`;
return `<label class="f"><span>${l}</span>${h}</label>`}
function rail_(){RAIL.innerHTML=[['add','Добавить',I.plus],['layers','Слои',I.layers],['site','Сайт',I.gear]].map(([k,n,i])=>`<button data-r="${k}" class="${ltab==k?'on':''}">${i}${n}</button>`).join('')}
function row(s,g){const ed=s.kind=='normal'||s.kind=='toc';return `<div class="row sc${s.id==sel.s?' on':''}${s.hidden?' dim':''}${g?' ind':''}" data-s="${s.id}"${ed?' draggable="true"':''}><span class="nm">${esc(s.name)}</span><span class="tag">${s.kind=='normal'?'':KIND[s.kind]}</span><button data-a="eye" data-s="${s.id}" title="Скрыть или показать">${s.hidden?I.off:I.eye}</button><button data-a="ds" data-s="${s.id}" title="Удалить">${I.trash}</button></div>`}
function left_(){rail_();let h='<div class="fi">';
if(ltab=='add')h+=`<h4>Блоки</h4><p class="hint" style="margin-bottom:10px">Перетащи на превью или нажми, блок попадёт в выбранную секцию.</p><div class="lg">${Object.keys(NAMES).filter(t=>t!='toc').map(t=>`<div class="lib" draggable="true" data-t="${t}">${NAMES[t]}</div>`).join('')}</div>`;
else if(ltab=='site')h+=`<h4>Весь сайт</h4>${[['title','Название сайта (вкладка браузера)','text'],['wg','Wiggle букв','chk'],['fly','Вылет букв при скролле','chk'],['str','Сила вылета (1 = обычная)','num'],['transitions','Переходы: имена файлов из assets/transitions','list']].map(f=>fld(S.site,f,'site')).join('')}`;
else{h+=`<div class="hrow"><h4>Слои</h4><button data-a="menu" class="${menu?'on':''}">+ Секция</button></div>`;
if(menu)h+=`<div class="lg fi">${Object.keys(KIND).map(k=>`<div class="lib" data-k="${k}">${KIND[k]}</div>`).join('')}</div>`;
let lg;S.sections.forEach(s=>{const g=s.group||'';if(g&&g!==lg)h+=`<div class="gh" data-g="${esc(g)}"><span>${esc(g)}</span><button data-a="rg" data-g="${esc(g)}">Переименовать</button></div>`;lg=g;h+=row(s,g);
if(s.id==sel.s)h+=s.blocks.map(b=>`<div class="row blk ind${b.id==sel.b?' on':''}" data-b="${b.id}" data-bs="${s.id}"><span class="nm">${NAMES[b.t]}${b.text?': '+esc(String(b.text).slice(0,18)):''}</span></div>`).join('')});
h+='<button class="wide" data-a="ng">Поместить выбранную секцию в группу</button>'}
LEFT.innerHTML=h+'</div>'}
function right_(){const s=sec(),b=blk();RT.innerHTML='<div class="fi">'+(!s?'<p class="hint">Выбери секцию в слоях или нажми на блок в превью, чтобы увидеть его настройки.</p>':!b?`<h4>${KIND[s.kind]}: ${esc(s.name)}</h4>${secFields(s).map(f=>fld(s,f,'s')).join('')}<datalist id="gl">${[...new Set(S.sections.map(x=>x.group).filter(Boolean))].map(g=>`<option value="${esc(g)}">`).join('')}</datalist>`
:`<h4>${NAMES[b.t]}</h4>${FB[b.t].map(f=>fld(b,f,'b')).join('')}<h5>Положение в сетке</h5><div class="xy">${['x','y','w','h'].map(k=>`<label class="f"><span>${k.toUpperCase()}</span><input type="number" value="${b[k]}" data-k="${k}" data-sc="b"></label>`).join('')}</div>${VIEW.map(f=>fld(b,f,'b')).join('')}<h5>Действия</h5><button data-a="dup">Дублировать</button><button data-a="zu">Выше</button><button data-a="zd">Ниже</button><button data-a="del">Удалить</button>`)+'</div>'}
function onInput(e){const t=e.target,k=t.dataset.k;if(!k)return;snapD();const o=t.dataset.sc=='site'?S.site:t.dataset.sc=='b'?blk():sec();let v;
if(t.type=='checkbox')v=t.checked;else if(t.type=='number'||t.type=='range')v=t.value===''?undefined:+t.value;
else if('list' in t.dataset)v=t.value.split('\n').map(x=>parse(x.trim())).filter(Boolean);else v=parse(t.value);
if(v===undefined||v==='')delete o[k];else o[k]=v;commit();if(['name','group','hidden'].includes(k)&&t.dataset.sc=='s')left_()}
LEFT.addEventListener('input',onInput);RT.addEventListener('input',onInput);
RAIL.addEventListener('click',e=>{const b=e.target.closest('[data-r]');if(b){ltab=b.dataset.r;left_()}});
LEFT.addEventListener('dragstart',e=>{const l=e.target.closest('.lib[data-t]'),r=e.target.closest('.row.sc');if(l)e.dataTransfer.setData('text/plain',l.dataset.t);else if(r){dragS=r.dataset.s;e.dataTransfer.setData('text/plain','sec')}});
const clr=()=>LEFT.querySelectorAll('.dt-b,.dt-a').forEach(e=>e.classList.remove('dt-b','dt-a'));
LEFT.addEventListener('dragover',e=>{if(!dragS)return;const r=e.target.closest('.row.sc,.gh');if(!r)return;e.preventDefault();clr();const c=r.getBoundingClientRect();r.classList.add(r.classList.contains('gh')||e.clientY<c.top+c.height/2?'dt-b':'dt-a')});
LEFT.addEventListener('drop',e=>{if(!dragS)return;const r=e.target.closest('.row.sc,.gh');clr();if(!r){dragS=null;return}e.preventDefault();snap();
const i=S.sections.findIndex(s=>s.id==dragS),s=S.sections[i];S.sections.splice(i,1);let g,j;
if(r.classList.contains('gh')){g=r.dataset.g;j=S.sections.findIndex(x=>x.group==g);if(j<0)j=S.sections.length}
else{const t=S.sections.find(x=>x.id==r.dataset.s),c=r.getBoundingClientRect();g=t.group;j=S.sections.indexOf(t)+(e.clientY<c.top+c.height/2?0:1)}
if(g)s.group=g;else delete s.group;S.sections.splice(j,0,s);dragS=null;order();commit(true)});
LEFT.addEventListener('dragend',()=>{dragS=null;clr()});
LEFT.addEventListener('dblclick',e=>{const r=e.target.closest('.row.sc');if(!r)return;const s=S.sections.find(x=>x.id==r.dataset.s),n=prompt('Название секции',s.name);if(n){snap();s.name=n;commit(true)}});
LEFT.addEventListener('click',e=>{const t=e.target,a=t.closest('[data-a]')?.dataset.a,bt=t.closest('[data-a]');
if(t.closest('[data-up]'))return;
if(a=='menu'){menu=!menu;return left_()}
if(a=='eye'){snap();const s=S.sections.find(x=>x.id==bt.dataset.s);s.hidden=!s.hidden;return commit(true)}
if(a=='ds'){if(confirm('Удалить секцию?')){snap();S.sections=S.sections.filter(x=>x.id!=bt.dataset.s);sel={s:null,b:null};commit(true)}return}
if(a=='rg'){const g=bt.dataset.g,n=prompt('Название группы',g);if(n){snap();S.sections.forEach(s=>{if(s.group==g)s.group=n});commit(true)}return}
if(a=='ng'){const s=sec();if(!s)return st('Сначала выбери секцию');const n=prompt('Название группы',s.group||'');if(n!==null){snap();if(n)s.group=n;else delete s.group;commit(true)}return}
const k=t.closest('.lib[data-k]');if(k)return addSection(k.dataset.k);
const l=t.closest('.lib[data-t]');if(l){const s=sec()||S.sections.find(x=>x.kind=='normal')||S.sections[0];return s&&addBlock(l.dataset.t,s.id,0,0)}
const bl=t.closest('.row.blk');if(bl){sel={s:bl.dataset.bs,b:bl.dataset.b};mark();left_();return right_()}
const r=t.closest('.row.sc');if(r){sel={s:r.dataset.s,b:null};mark();left_();right_();fr.contentDocument.getElementById(sel.s)?.scrollIntoView({behavior:'smooth'})}});
RT.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const a=t.dataset.a;
if(t.dataset.up)return upload(t.dataset.up,t.dataset.sc,t.dataset.m);
const b=blk(),s=sec();if(a=='del')return delb();
if(a=='dup'&&b){snap();const n={...structuredClone(b),id:uid(),y:b.y+b.h};place(s,n);s.blocks.push(n);sel.b=n.id;commit(true)}
if((a=='zu'||a=='zd')&&b){snap();b.z=(b.z||0)+(a=='zu'?1:-1);commit(true)}});
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
$('#top').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const a=t.dataset.a;if(t.dataset.d){dev=t.dataset.d;return size()}
if(a=='grid'){grid=!grid;t.classList.toggle('on',grid);mark()}if(a=='undo')undo();if(a=='push')push();if(a=='cfg'){localStorage.removeItem('gh');cfg()}
if(a=='open')open('index.html');
if(a=='json'){const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([JSON.stringify(out()[0],null,1)]));l.download='content.json';l.click()}});
addEventListener('resize',size);
fr.onload=()=>{try{wire()}catch(e){st('Ошибка: '+e.message)}commit(true)};
fetch('content.json?'+Date.now()).then(r=>r.json()).then(j=>{S=j;S.site=S.site||{};S.site.transitions=S.site.transitions||[];S.sections.forEach((s,i)=>{if(!s.kind)s.kind=s.stat?'header':s.id=='toc'?'toc':'normal';if(!s.name)s.name=s.group||'Секция '+(i+1);s.blocks=s.blocks||[]});
$('[data-a=grid]').classList.add('on');size();left_();right_();fr.src='index.html?preview&v='+Date.now()}).catch(e=>st('Открой редактор по адресу сайта (или через локальный сервер), не двойным кликом: '+e.message));
