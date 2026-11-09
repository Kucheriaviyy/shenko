const $=s=>document.querySelector(s),fr=$('#fr'),LEFT=$('#left'),RT=$('#right'),RAIL=$('#rail');
let SRV='',anim=false,rs2=null,S,sel={s:null,b:null},ltab='layers',menu=false,hist=[],last=0,dev='phone',grid=true,dr=null,dragS=null;
const UP=new Map(),PB=new Map();
const DEV={phone:[390,780],tablet:[768,1024],laptop:[1280,800]};
const PAL=[['n','Беж'],['a','Беж акцент'],['b','Коричневый'],['r','Красный'],['w','Белый']];
const FONTS=[['d','Aktiv (жирный)'],['s','Sloop (рукописный)'],['m','Mono']];
const NAMES={heading:'Заголовок',text:'Текст',image:'Картинка',carousel:'Карусель',model:'3D модель',pdf:'PDF-книга',shape:'Шейп',toc:'Оглавление',tools:'Программы',card3d:'3D открытка'};
const KIND={normal:'Обычная',header:'Хедер',toc:'Содержание',footer:'Футер'};
const DEF={heading:{w:8,h:2,text:'Heading',fs:8,f:'d',c:'b'},text:{w:6,h:2,text:'Text',fs:3.2,c:'b'},image:{w:6,h:5},carousel:{w:12,h:5,srcs:[]},model:{w:8,h:7},pdf:{w:8,h:8,pages:[]},shape:{w:4,h:3,k:1,c:'r'},toc:{w:8,h:7,fs:3,c:'b'},tools:{w:12,h:2,fs:8,items:['ai','ps']},card3d:{w:10,h:8,front:'',back:''}};
const sv=d=>`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${d}</svg>`;
const I={eye:sv('<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>'),off:sv('<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><path d="M3 3l18 18"/>'),trash:sv('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),plus:sv('<path d="M12 5v14M5 12h14"/>'),layers:sv('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),gear:sv('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>')};
const AL=['al','Выравнивание','sel',[['left','Лево'],['center','Центр'],['right','Право']]];
const FB={heading:[['_','Текст'],['text','Текст','area'],['fs','Размер','num'],['f','Шрифт','sel',FONTS],['c','Цвет','col'],AL,['rot','Поворот, град','num'],['ls','Межбуквенный интервал, em (для Sloop можно -0.05)','num'],['lh','Межстрочный интервал: 1 = обычный, 0.8 = плотнее, 1.3 = свободнее','num'],['_','Анимация'],['fy','Вылет букв при скролле','chk'],['str','Сила вылета (1 = обычная)','num'],['qrTitle','Заголовок на странице с QR','text'],['qrText','Текст на странице с QR','area'],['wg','Wiggle букв','chk'],['wa','Сила wiggle (1 = обычная)','num']],
text:[['_','Текст'],['text','Текст','area'],['fs','Размер','num'],['f','Шрифт','sel',FONTS],['c','Цвет','col'],['bg','Фон плашки','col0'],AL,['fy','Буквы собираются при скролле','chk'],['rot','Поворот, град','num'],['ls','Межбуквенный интервал, em (для Sloop можно -0.05)','num'],['lh','Межстрочный интервал: 1 = обычный, 0.8 = плотнее, 1.3 = свободнее','num']],
image:[['_','Картинка'],['src','Файл','file'],['fit','Вписывание','sel',[['cover','Заполнить'],['contain','Вписать целиком']]],['pol','Рамка полароид','chk'],['rot','Поворот, град','num']],
carousel:[['_','Карусель'],['folder','Папка из репозитория: фото подтянутся сами (например assets/img/other)','text'],['srcs','Фото (первое = титульное)','thumbs'],['iw','Ширина фото, % (меньше 100 = следующее выглядывает)','num'],['gap','Расстояние между фото','num'],['fit','Вписывание','sel',[['cover','Заполнить'],['contain','Вписать целиком']]],['n','Сколько заглушек, пока нет фото','num']],
tools:[['_','Программы'],['items','Ключи: ai, ps, id, bl, fg, ae (по одной в строке)','list'],['fs','Размер иконок','num'],['lab','Названия всегда видны (иначе по нажатию)','chk']],
card3d:[['_','Открытка A5 альбомная (вращается пальцем)'],['front','Лицевая сторона','file'],['back','Обратная сторона','file']],
model:[['_','3D модель'],['src','Файл .glb','file'],['hint','Подсказка на блоке (пусто = по умолчанию)','text']],
pdf:[['_','PDF-книга'],['pages','Страницы-картинки','files'],['hint','Подсказка на блоке (пусто = по умолчанию)','text']],
shape:[['_','Шейп'],['k','Форма 1-5','num'],['c','Цвет','col']],
toc:[['_','Оглавление'],['fs','Размер','num'],['c','Цвет названий секций','col'],['gc','Цвет заголовков групп','col']]};
const VIEW=[['_','Точное положение'],['ox','Сдвиг по X (стрелки на клавиатуре)','num'],['oy','Сдвиг по Y','num'],['_','Вид и показ'],['op','Прозрачность (0-1)','num'],['z','Слой (z)','num'],['hm','Скрыть на телефоне','chk'],['hd','Скрыть на компьютере','chk']];
function secFields(s){const k=s.kind,f=[['_','Секция'],['name','Название','text']];
if(k=='normal')f.push(['group','Группа (заголовок в оглавлении)','text'],['intoc','Показывать в оглавлении','chk']);
f.push(['_','Фон'],['c','Цвет фона','col'],['bg','Картинка фона','file'],['bgm','Картинка фона для телефона','file'],['bgfit','Вписывание','sel',[['cover','Заполнить экран'],['contain','Вписать целиком']]],['bgx','Фокус по горизонтали, %','range'],['ov','Затемнение, %','range'],['_','Размер'],['rows','Минимум рядов сетки','num'],['bleed','Во всю ширину экрана (без полей)','chk']);
if(k=='normal')f.push(['full','Высота на весь экран','chk']);
f.push(['_','Поведение']);if(k!='header')f.push(['tr','Переход в конце секции','sel','TR'],['trin','Накрывает следующую секцию (влёт), не сдвигая её','chk'],['tro','Оригинальные цвета перехода','chk'],['tc1','Цвет слоя 1 (по порядку в SVG)','hex'],['tc2','Цвет слоя 2','hex'],['tc3','Цвет слоя 3','hex'],['tc4','Цвет слоя 4','hex']);
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
const CSS=`.b{touch-action:none;cursor:grab;outline:1px dashed rgba(232,78,62,.5);outline-offset:-1px}.b *{pointer-events:none}.b.sel{outline:2px solid #e84e3e;z-index:50}.b .rs{pointer-events:auto;position:absolute;right:-7px;bottom:-7px;width:16px;height:16px;background:#e84e3e;cursor:nwse-resize;z-index:99}.ss{box-shadow:inset 0 0 0 3px #f0bd89}.ss::after{content:attr(data-n);position:absolute;left:0;top:0;background:#e84e3e;color:#fff;font:600 11px system-ui;padding:3px 8px;z-index:200}.gr .g{background-image:linear-gradient(to right,rgba(232,78,62,.22) 1px,transparent 1px),linear-gradient(to bottom,rgba(232,78,62,.22) 1px,transparent 1px);background-size:calc(100%/12) var(--u)}.rz{display:block;position:absolute;left:0;right:0;bottom:0;height:14px;cursor:ns-resize;z-index:150;transition:background .15s}.rz:hover{background:rgba(232,78,62,.4)}.rz::after{content:attr(data-r);position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font:600 10px system-ui;color:#fff;white-space:nowrap;opacity:0}.rz:hover::after{opacity:1}.gr .full .g{background-size:calc(100%/12) calc(100%/var(--rows))}`;
function size(){const[w,h]=DEV[dev],s=$('#stage'),k=Math.min(1,(s.clientWidth-52)/w,(s.clientHeight-60)/h);fr.style.width=w+'px';fr.style.height=h+'px';$('#dev').style.transform=`scale(${k})`;$('#dev').style.marginBottom=(-(h)*(1-k))+'px';document.querySelectorAll('[data-d]').forEach(b=>b.classList.toggle('on',b.dataset.d==dev))}
function mark(){const d=fr.contentDocument;if(!d||!d.body)return;d.body.classList.toggle('gr',grid);d.querySelectorAll('.sel,.ss').forEach(e=>e.classList.remove('sel','ss'));d.querySelectorAll('.rs,.rz').forEach(e=>e.remove());d.querySelectorAll('.sec:not(.full)').forEach(s=>s.insertAdjacentHTML('beforeend','<i class="rz" data-r="тяни: высота секции"></i>'));
d.querySelector(`[data-s="${sel.s}"]`)?.classList.add('ss');const b=sel.b&&d.querySelector(`[data-b="${sel.b}"]`);if(b){b.classList.add('sel');b.insertAdjacentHTML('beforeend','<i class="rs"></i>')}}
function commit(p){try{const w=fr.contentWindow;if(!w||!w.SITE){st('Превью не загрузилось: на сервере старый index.html или assets/js/site.js. Залей новые файлы и обнови страницу (Ctrl+F5).');return}w.SITE.render(S,true,anim);mark();saveDraft();if(p){left_();right_()}}catch(e){st('Ошибка превью: '+e.message);console.error(e)}}
addEventListener('error',e=>st('Ошибка: '+e.message));
function met(sc){const g=sc.querySelector('.g'),r=g.getBoundingClientRect(),n=+g.style.getPropertyValue('--rows'),cw=r.width/12;return{cw,ch:sc.classList.contains('full')?r.height/n:cw,r}}
function addBlock(t,sid,x,y){const s=S.sections.find(q=>q.id==sid);if(!s)return;snap();const b=mk(t,0,0);b.x=Math.max(0,Math.min(12-b.w,x));b.y=Math.max(0,y);place(s,b);s.blocks.push(b);sel={s:sid,b:b.id};commit(true)}
function delb(){if(!blk())return;snap();sec().blocks=sec().blocks.filter(x=>x.id!=sel.b);sel.b=null;commit(true)}
function wire(){const d=fr.contentDocument,st=d.createElement('style');st.textContent=CSS;d.head.appendChild(st);
d.addEventListener('click',e=>e.preventDefault(),true);
d.addEventListener('pointerdown',e=>{const rz=e.target.closest('.rz');if(rz){const sc=rz.closest('.sec'),s=S.sections.find(x=>x.id==sc.dataset.s),m=met(sc);sel={s:s.id,b:null};snap();rz.setPointerCapture(e.pointerId);rs2={sc,s,y:e.clientY,r0:+sc.querySelector('.g').style.getPropertyValue('--rows'),ch:m.ch,min:1};e.preventDefault();return}
const bl=e.target.closest('.b'),sc=e.target.closest('.sec');if(!sc)return;
sel={s:sc.dataset.s,b:bl?bl.dataset.b:null};mark();left_();right_();if(!bl)return;e.preventDefault();
const B=blk();snap();bl.setPointerCapture(e.pointerId);dr={bl,rs:!!e.target.closest('.rs'),x:e.clientX,y:e.clientY,o:{x:B.x,y:B.y,w:B.w,h:B.h},sc}});
d.addEventListener('pointermove',e=>{if(rs2){const n=Math.max(rs2.min,rs2.r0+Math.round((e.clientY-rs2.y)/rs2.ch));rs2.s.rows=n;rs2.sc.querySelector('.g').style.setProperty('--rows',n);rs2.sc.querySelector('.rz').dataset.r=n+' рядов';const mb=Math.max(0,...rs2.s.blocks.map(b=>b.y+b.h));st(n<mb?'Блоки ниже ряда '+n+' выходят за секцию: подвинь их или подними высоту':'Высота секции: '+n+' рядов');return}if(!dr)return;const B=blk(),s=sec(),m=met(dr.sc),o=dr.o,dx=Math.round((e.clientX-dr.x)/m.cw),dy=Math.round((e.clientY-dr.y)/m.ch);
const c=dr.rs?{x:o.x,y:o.y,w:Math.max(1,Math.min(12-o.x,o.w+dx)),h:Math.max(1,o.h+dy)}:{x:Math.max(0,Math.min(12-o.w,o.x+dx)),y:Math.max(0,o.y+dy),w:o.w,h:o.h};
if(free(s,B,c)){Object.assign(B,c);dr.bl.style.gridArea=`${B.y+1}/${B.x+1}/span ${B.h}/span ${B.w}`}});
d.addEventListener('pointerup',()=>{if(rs2){rs2=null;commit(true)}if(dr){dr=null;commit(true)}});
d.addEventListener('dragover',e=>e.preventDefault());
d.addEventListener('drop',e=>{e.preventDefault();const t=e.dataTransfer.getData('text/plain'),sc=e.target.closest('.sec');if(!DEF[t]||!sc)return;const m=met(sc);
addBlock(t,sc.dataset.s,Math.round((e.clientX-m.r.left)/m.cw-DEF[t].w/2),Math.round((e.clientY-m.r.top)/m.ch-DEF[t].h/2))});
d.addEventListener('keydown',key)}
function key(e){if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
if(e.key.startsWith('Arrow')&&blk()){e.preventDefault();const b=blk(),k=e.shiftKey?2.5:.25;snapD();if(e.altKey||e.ctrlKey){const c={...b};if(e.key=='ArrowLeft')c.x--;if(e.key=='ArrowRight')c.x++;if(e.key=='ArrowUp')c.y--;if(e.key=='ArrowDown')c.y++;if(c.x>=0&&c.x+c.w<=12&&c.y>=0&&free(sec(),b,c)){b.x=c.x;b.y=c.y}}else{const d={ArrowLeft:['ox',-k],ArrowRight:['ox',k],ArrowUp:['oy',-k],ArrowDown:['oy',k]}[e.key];b[d[0]]=Math.round(((b[d[0]]||0)+d[1])*100)/100}return commit(true)}if(e.key=='Delete'||e.key=='Backspace'){e.preventDefault();delb()}if((e.ctrlKey||e.metaKey)&&e.key=='z'){e.preventDefault();undo()}}
addEventListener('keydown',key);
function undo(){if(hist.length){S=JSON.parse(hist.pop());commit(true)}}
/* panels */
function fld(o,[k,l,t,op],sc){if(k=='_')return `<h5>${l}</h5>`;const v=o[k],a=`data-k="${k}" data-sc="${sc}"`,dv=['wg','fy','fly','intoc','qr'].includes(k);let h;
if(t=='chk')return `<label class="f ck"><input type="checkbox" ${a} ${(v===undefined?dv:v)?'checked':''}><span>${l}</span></label>`;
if(t=='area')h=`<textarea rows="3" ${a}>${esc(v)}</textarea>`;
else if(t=='list')h=`<textarea rows="4" data-list ${a}>${esc((v||[]).join('\n'))}</textarea>`;
else if(t=='num')h=`<input type="number" step="any"${k=='lh'?' min="0.5" max="2"':''} value="${v??''}" ${a}>`;
else if(t=='range')h=`<input type="range" min="0" max="100" value="${v??(k=='bgx'?50:0)}" ${a}>`;
else if(t=='sel'||t=='col'||t=='col0'){const L=t=='sel'?(op=='TR'?[['','Нет']].concat((S.site.transitions||[]).map(x=>[x,x])):op):(t=='col0'?[['','Нет']]:[]).concat(PAL);h=`<select ${a}>${L.map(([x,n])=>`<option value="${x}"${(v||(t=='col'?(o.kind=='footer'?'b':k=='gc'?'r':k=='c'&&sc=='s'?'n':'b'):''))==x?' selected':''}>${n}</option>`).join('')}</select>`}
else if(t=='file')h=`<input type="text" value="${esc(disp(v))}" ${a}><button data-up="${k}" data-sc="${sc}">Загрузить файл</button><button data-lib="${k}" data-sc="${sc}">Из репозитория</button>`;
else if(t=='hex')h=`<input type="color" value="${v||'#ffffff'}" ${a}>${v?`<button data-clr="${k}" data-sc="${sc}">Сбросить</button>`:''}`;
else if(t=='thumbs')h=`<div class="th">${(v||[]).map((u,i)=>`<div class="ti"><img src="${esc(u)}" alt=""><div><button data-a="tf" data-i="${i}" data-k="${k}">Первое</button><button data-a="tu" data-i="${i}" data-k="${k}">Выше</button><button data-a="td" data-i="${i}" data-k="${k}">Ниже</button><button data-a="tx" data-i="${i}" data-k="${k}">Удалить</button></div></div>`).join('')}</div><button data-up="${k}" data-sc="${sc}" data-m="1">Добавить фото</button><button data-lib="${k}" data-sc="${sc}" data-m="1">Из репозитория</button>`;
else if(t=='files')h=`<textarea rows="4" data-list ${a}>${esc((v||[]).map(disp).join('\n'))}</textarea><button data-up="${k}" data-sc="${sc}" data-m="1">Загрузить файлы</button><button data-lib="${k}" data-sc="${sc}" data-m="1">Из репозитория</button>`;
else h=`<input type="text" value="${esc(v)}" ${a}${k=='group'?' list="gl"':''}>`;
return `<label class="f"><span>${l}</span>${h}</label>`}
function rail_(){RAIL.innerHTML=[['add','Добавить',I.plus],['layers','Слои',I.layers],['site','Сайт',I.gear]].map(([k,n,i])=>`<button data-r="${k}" class="${ltab==k?'on':''}">${i}${n}</button>`).join('')}
function row(s,g){const ed=s.kind=='normal'||s.kind=='toc';return `<div class="row sc${s.id==sel.s?' on':''}${s.hidden?' dim':''}${g?' ind':''}" data-s="${s.id}"${ed?' draggable="true"':''}><span class="nm">${esc(s.name)}</span><span class="tag">${s.kind=='normal'?'':KIND[s.kind]}</span><button data-a="eye" data-s="${s.id}" title="Скрыть или показать">${s.hidden?I.off:I.eye}</button><button data-a="ds" data-s="${s.id}" title="Удалить">${I.trash}</button></div>`}
function left_(){rail_();let h='<div class="fi">';
if(ltab=='add')h+=`<h4>Блоки</h4><p class="hint" style="margin-bottom:10px">Перетащи на превью или нажми, блок попадёт в выбранную секцию.</p><div class="lg">${Object.keys(NAMES).filter(t=>t!='toc').map(t=>`<div class="lib" draggable="true" data-t="${t}">${NAMES[t]}</div>`).join('')}</div>`;
else if(ltab=='site')h+=`<h4>Весь сайт</h4>${[['title','Название сайта (вкладка браузера)','text'],['repo','Репозиторий владелец/имя (для папок с фото)','text'],['qr','Показывать QR на компьютерах','chk'],['wg','Wiggle букв','chk'],['fly','Вылет букв при скролле','chk'],['str','Сила вылета (1 = обычная)','num'],['transitions','Переходы: имена файлов из assets/transitions','list']].map(f=>fld(S.site,f,'site')).join('')}`;
else{h+=`<div class="hrow"><h4>Слои</h4><button data-a="menu" class="${menu?'on':''}">+ Секция</button></div>`;
if(menu)h+=`<div class="lg fi">${Object.keys(KIND).map(k=>`<div class="lib" data-k="${k}">${KIND[k]}</div>`).join('')}</div>`;
let lg;S.sections.forEach(s=>{const g=s.group||'';if(g&&g!==lg)h+=`<div class="gh" data-g="${esc(g)}"><span>${esc(g)}</span><button data-a="rg" data-g="${esc(g)}">Переименовать</button></div>`;lg=g;h+=row(s,g);
if(s.id==sel.s)h+=s.blocks.map(b=>`<div class="row blk ind${b.id==sel.b?' on':''}" data-b="${b.id}" data-bs="${s.id}"><span class="nm">${NAMES[b.t]}${b.text?': '+esc(String(b.text).slice(0,18)):''}</span></div>`).join('')});
h+='<button class="wide" data-a="ng">Поместить выбранную секцию в группу</button>'}
LEFT.innerHTML=h+'</div>'}
function right_(){const s=sec(),b=blk();RT.innerHTML='<div class="fi">'+(!s?'<p class="hint">Выбери секцию в слоях или нажми на блок в превью, чтобы увидеть его настройки.</p>':!b?`<h4>${KIND[s.kind]}: ${esc(s.name)}</h4>${secFields(s).map(f=>fld(s,f,'s')).join('')}<datalist id="gl">${[...new Set(S.sections.map(x=>x.group).filter(Boolean))].map(g=>`<option value="${esc(g)}">`).join('')}</datalist>`
:`<h4>${NAMES[b.t]}</h4>${FB[b.t].map(f=>fld(b,f,'b')).join('')}<h5>Положение в сетке</h5><div class="xy">${['x','y','w','h'].map(k=>`<label class="f"><span>${k.toUpperCase()}</span><input type="number" value="${b[k]}" data-k="${k}" data-sc="b"></label>`).join('')}</div>${VIEW.map(f=>fld(b,f,'b')).join('')}<h5>Действия</h5><button data-a="dup">Дублировать</button><button data-a="zu">Выше</button><button data-a="zd">Ниже</button><button data-a="del">Удалить</button>`)+'</div>'}
function onInput(e){const t=e.target,k=t.dataset.k;if(!k)return;snapD();const o=t.dataset.sc=='site'?S.site:t.dataset.sc=='b'?blk():sec();if(!o)return;let v;
if(t.type=='checkbox')v=t.checked;else if(t.type=='number'||t.type=='range')v=t.value===''?undefined:+t.value;
else if('list' in t.dataset)v=t.value.split('\n').map(x=>parse(x.trim())).filter(Boolean);else v=parse(t.value);
if(v===undefined||v==='')delete o[k];else o[k]=v;commit();if(['name','group','hidden'].includes(k)&&t.dataset.sc=='s')left_()}
LEFT.addEventListener('input',onInput);RT.addEventListener('input',onInput);
RAIL.addEventListener('click',e=>{const b=e.target.closest('[data-r]');if(b){ltab=b.dataset.r;left_()}});
LEFT.addEventListener('dragstart',e=>{const l=e.target.closest('.lib[data-t]'),r=e.target.closest('.row.sc');if(l)e.dataTransfer.setData('text/plain',l.dataset.t);else if(r){dragS=r.dataset.s;e.dataTransfer.setData('text/plain','sec')}});
const clr=()=>LEFT.querySelectorAll('.dt-b,.dt-a').forEach(e=>e.classList.remove('dt-b','dt-a'));
LEFT.addEventListener('dragover',e=>{if(!dragS)return;const r=e.target.closest('.row.sc,.gh');if(!r)return;e.preventDefault();clr();const c=r.getBoundingClientRect();r.classList.add(r.classList.contains('gh')||e.clientY<c.top+c.height/2?'dt-b':'dt-a')});
LEFT.addEventListener('drop',e=>{if(!dragS)return;const r=e.target.closest('.row.sc,.gh');clr();if(!r||r.dataset.s==dragS){dragS=null;return}e.preventDefault();snap();
const i=S.sections.findIndex(s=>s.id==dragS),s=S.sections[i];S.sections.splice(i,1);let g,j;
if(r.classList.contains('gh')){g=r.dataset.g;j=S.sections.findIndex(x=>x.group==g);if(j<0)j=S.sections.length}
else{const t=S.sections.find(x=>x.id==r.dataset.s)||S.sections[0],c=r.getBoundingClientRect();g=t.group;j=S.sections.indexOf(t)+(e.clientY<c.top+c.height/2?0:1)}
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
if(t.dataset.lib)return openLib(t.dataset.lib,t.dataset.sc,t.dataset.m);
if(t.dataset.up)return upload(t.dataset.up,t.dataset.sc,t.dataset.m);
if(t.dataset.clr){const o=t.dataset.sc=='b'?blk():sec();snap();delete o[t.dataset.clr];return commit(true)}
if(a&&a[0]=='t'&&t.dataset.k){const b=blk();if(!b)return;snap();const L=b[t.dataset.k],i=+t.dataset.i;if(a=='tx')L.splice(i,1);else if(a=='tf')L.unshift(L.splice(i,1)[0]);else if(a=='tu'&&i>0)[L[i-1],L[i]]=[L[i],L[i-1]];else if(a=='td'&&i<L.length-1)[L[i+1],L[i]]=[L[i],L[i+1]];return commit(true)}
const b=blk(),s=sec();if(a=='del')return delb();
if(a=='dup'&&b){snap();const n={...structuredClone(b),id:uid(),y:b.y+b.h};place(s,n);s.blocks.push(n);sel.b=n.id;commit(true)}
if((a=='zu'||a=='zd')&&b){snap();b.z=(b.z||0)+(a=='zu'?1:-1);commit(true)}});
const cfgv=()=>{try{return JSON.parse(localStorage.gh)}catch(e){return null}};
const LIBF=[['assets/img','Картинки'],['assets/models','3D .glb'],['assets/pdf','PDF-страницы']];
async function openLib(k,sc,m){
 let c=cfgv()||{};if(!c.repo){const r=prompt('Репозиторий владелец/имя, например kucheriaviyy/shenko');if(!r)return;c={repo:r.trim(),br:'main'}}
 const dlg=document.getElementById('lib')||document.body.appendChild(Object.assign(document.createElement('dialog'),{id:'lib'}));
 dlg.style.cssText='width:min(94vw,760px);border:0;padding:0;background:#fff;color:#3c140f;font:13px system-ui';
 const b=sc=='b'?blk():null,folder=b&&b.t=='model'?'assets/models':b&&b.t=='pdf'?'assets/pdf':'assets/img';
 const put=p=>{snap();const o=sc=='site'?S.site:sc=='b'?blk():sec();if(m)o[k]=(o[k]||[]).concat([p]);else o[k]=p;commit(true);st('Выбрано: '+p);if(!m)dlg.close()};
 const show=async f=>{
  dlg.innerHTML=`<div style="display:flex;gap:6px;align-items:center;padding:12px 14px;border-bottom:1px solid #e6dcd3;flex-wrap:wrap"><b style="font-family:Aktiv,'Arial Black',sans-serif;font-size:15px;flex:1">Файлы из репозитория</b>${LIBF.map(([p,n])=>`<button data-f="${p}"${p==f?' class="on"':''}>${n}</button>`).join('')}<button data-x>Закрыть</button></div><div id="lg" style="padding:14px;display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;max-height:62vh;overflow:auto;font-size:12px">Загрузка…</div>`;
  const g=dlg.querySelector('#lg');
  try{const h={};
   const r=await fetch(`https://api.github.com/repos/${c.repo}/contents/${f}?ref=${c.br}`,{headers:h});
   if(!r.ok)throw new Error(r.status==404?`в репозитории нет папки ${f}`:'GitHub вернул '+r.status);
   const L=(await r.json()).filter(x=>x.type=='file'&&!x.name.startsWith('.'));
   const raw=p=>p;
   g.innerHTML=L.length?L.map(x=>`<button data-p="${esc(x.path)}" style="display:flex;flex-direction:column;gap:4px;padding:6px;text-align:left;background:#fff">${/\.(png|jpe?g|webp|gif)$/i.test(x.name)?`<img src="${raw(x.path)}" alt="" loading="lazy" style="width:100%;aspect-ratio:1;object-fit:cover;background:#f4efea">`:'<div style="aspect-ratio:1;background:#f4efea;display:flex;align-items:center;justify-content:center">3D / PDF</div>'}<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(x.name)}</span></button>`).join(''):'Папка пустая'}
  catch(e){g.textContent='Не удалось загрузить список: '+e.message}};
 dlg.onclick=e=>{const fb=e.target.closest('[data-f]');if(fb)return show(fb.dataset.f);if(e.target.closest('[data-x]'))return dlg.close();const p=e.target.closest('[data-p]');if(p)put(p.dataset.p)};
 dlg.showModal();show(folder)}
async function checkTr(){const names=[...new Set(S.sections.map(s=>s.tr).filter(Boolean))],miss=[];
 for(const n of names){try{const r=await fetch('assets/transitions/'+n,{method:'HEAD'});if(!r.ok)miss.push(n)}catch(e){miss.push(n)}}
 if(miss.length)st('В репозитории нет файлов переходов: '+miss.join(', ')+'. Залей папку assets/transitions')}
async function diag(){const out=[];
 try{const r=await fetch('https://api.github.com/zen');out.push('GitHub из браузера доступен (код '+r.status+').')}catch(e){out.push('GitHub из браузера НЕ доступен. Значит, мешает VPN, блокировщик, расширение или настройка приватности. Отключи их или используй обходной путь через GitHub Desktop.')}
 const c=cfgv();if(!c)out.push('Токен и репозиторий ещё не введены: нажми GitHub.');
 else if(c.t)try{const r=await fetch('https://api.github.com/repos/'+c.repo,{headers:{Authorization:'Bearer '+c.t}});
  out.push(r.ok?'Репозиторий '+c.repo+' и токен работают.':r.status==404?'Репозиторий '+c.repo+' не найден, или у токена нет к нему доступа.':r.status==401||r.status==403?'GitHub отклонил токен (код '+r.status+'): срок вышел или нет права Contents.':'GitHub вернул код '+r.status+'.')}
 catch(e){out.push('Запрос с токеном не доходит до GitHub (сеть или расширение его блокирует). Публикация из этого браузера здесь невозможна: используй GitHub Desktop или загрузку файлов на github.com.')}
 alert(out.join('\n\n'))}
/* files */
async function reg(file,dir0){let blob=file,name=file.name.replace(/[^\w.\-]+/g,'_'),dir=dir0;
if(file.type.startsWith('image/')&&file.type!='image/svg+xml'){const im=await createImageBitmap(file),k=Math.min(1,1600/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);blob=await new Promise(r=>c.toBlob(r,'image/webp',.85));name=name.replace(/\.\w+$/,'')+'.webp'}
else if(!file.type.startsWith('image/'))dir=/\.pdf$/i.test(name)?'assets/pdf':'assets/models';
let path=dir+'/'+name,n=1;while(PB.has(path))path=dir+'/'+name.replace(/(\.\w+)$/,'-'+(++n)+'$1');
const u=URL.createObjectURL(blob);UP.set(u,{blob,path});PB.set(path,u);idbPut(path,blob);return u}
function upload(k,sc,m){const f=document.createElement('input'),b=sc=='b'?blk():null;f.type='file';f.style.display='none';document.body.appendChild(f);f.multiple=!!m;f.accept=b&&b.t=='model'?'.glb,.gltf':'image/*';
f.onchange=async()=>{snap();const o=sc=='site'?S.site:b||sec(),dir=b&&b.t=='pdf'?'assets/pdf':'assets/img',us=[];let n=0;for(const x of f.files){st(`Обработка ${++n}/${f.files.length}: ${x.name}`);try{us.push(await reg(x,dir))}catch(e){st('Не удалось прочитать '+x.name+': '+e.message)}}f.remove();if(!us.length)return;o[k]=m?(o[k]||[]).concat(us):us[0];st('Добавлено файлов: '+us.length);commit(true)};f.click()}
/* draft: JSON in localStorage, uploaded files in IndexedDB; survives reloads and freezes */
const idb=()=>new Promise((res,rej)=>{const r=indexedDB.open('shenko',1);r.onupgradeneeded=()=>r.result.createObjectStore('f',{keyPath:'path'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const idbPut=async(path,blob)=>{try{(await idb()).transaction('f','readwrite').objectStore('f').put({path,blob})}catch(e){}};
const idbAll=async()=>{try{const d=await idb();return await new Promise(r=>{const q=d.transaction('f').objectStore('f').getAll();q.onsuccess=()=>r(q.result);q.onerror=()=>r([])})}catch(e){return[]}};
const idbClear=async()=>{try{(await idb()).transaction('f','readwrite').objectStore('f').clear()}catch(e){}};
let saveT;const saveDraft=()=>{clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.draft=JSON.stringify({t:Date.now(),s:out()[0]});$('#sv').textContent=JSON.stringify(out()[0])===SRV?'Сайт актуален':'Не опубликовано: на сайте старая версия, нужен Push'}catch(e){$('#sv').textContent='Черновик не сохранён: '+e.message}},500)};
/* save */
function out(){const o=JSON.parse(JSON.stringify(S)),q=new Set;(function w(x){for(const k in x){const v=x[k];if(typeof v=='string'&&v.startsWith('blob:')){const f=UP.get(v);if(f){q.add(f);x[k]=f.path}}else if(v&&typeof v=='object')w(v)}})(o);return[o,[...q]]}
const st=m=>{$('#st').textContent=m};
function cfg(){let repo=(prompt('Репозиторий в формате владелец/имя, например kucheriaviyy/shenko')||'').trim().replace(/^https?:\/\/github\.com\//,'').replace(/\.git$|\/+$/g,''),t=(prompt('GitHub токен (только этот репозиторий, Contents: read and write)')||'').trim();if(repo&&t)localStorage.gh=JSON.stringify({repo,t,br:'main'})}
async function gh(path,b64){const c=JSON.parse(localStorage.gh),u=`https://api.github.com/repos/${c.repo}/contents/${path}`,h={Authorization:'Bearer '+c.t};
const net=(x)=>{throw new Error(`нет связи с GitHub при отправке «${path}». Нажми «Связь» в шапке, там будет видно, что мешает. Обходной путь: «content.json» скачать, заменить файл в папке репозитория на компьютере и отправить через GitHub Desktop. Исходная ошибка: ${x.message}`)};
let g,sha;try{g=await fetch(u+'?ref='+c.br,{headers:h})}catch(x){net(x)}
if(g.status==401||g.status==403)throw new Error(`GitHub отклонил токен (${g.status}). Проверь, что токен не просрочен и у него есть Contents: Read and write для репозитория ${c.repo}`);
if(g.status==404)throw new Error(`Репозиторий «${c.repo}» или ветка «${c.br}» не найдены. Нажми GitHub в шапке и введи владелец/имя`);
if(g.ok)sha=(await g.json()).sha;
let r;try{r=await fetch(u,{method:'PUT',headers:h,body:JSON.stringify({message:'Update '+path,content:b64,branch:c.br,sha})})}catch(x){net(x)}
if(!r.ok)throw new Error(`GitHub вернул ${r.status} при отправке «${path}»: ${(await r.text()).slice(0,120)}`)}
const b64=bl=>new Promise(r=>{const f=new FileReader;f.onload=()=>r(f.result.split(',')[1]);f.readAsDataURL(bl)});
async function push(){try{if(!localStorage.gh)cfg();if(!localStorage.gh)return;const[o,q]=out();let n=0;
for(const f of q){st(`Файлы ${++n}/${q.length}...`);await gh(f.path,await b64(f.blob))}
st('content.json...');await gh('content.json',btoa(unescape(encodeURIComponent(JSON.stringify(o,null,1)))));st('Отправлено. Сайт обновится через 1-2 минуты.');localStorage.removeItem('draft');idbClear();SRV=JSON.stringify(out()[0]);$('#sv').textContent='Опубликовано'}catch(e){st('Ошибка: '+e.message)}}
$('#top').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const a=t.dataset.a;if(t.dataset.d){dev=t.dataset.d;return size()}
if(a=='anim'){anim=!anim;t.classList.toggle('on',anim);return commit()}
if(a=='grid'){grid=!grid;t.classList.toggle('on',grid);mark()}if(a=='undo')undo();if(a=='push')push();if(a=='cfg'){localStorage.removeItem('gh');cfg()}
if(a=='open')open('index.html');
if(a=='diag')return diag();
if(a=='json'){const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([JSON.stringify(out()[0],null,1)]));l.download='content.json';l.click()}});
addEventListener('resize',size);
fr.onload=()=>{try{wire()}catch(e){st('Ошибка: '+e.message)}commit(true)};
fetch('content.json?'+Date.now()).then(r=>r.json()).then(async j=>{S=j;S.site=S.site||{};S.site.transitions=S.site.transitions||[];S.sections.forEach((s,i)=>{if(!s.kind)s.kind=s.stat?'header':s.id=='toc'?'toc':'normal';if(!s.name)s.name=s.group||'Секция '+(i+1);s.blocks=s.blocks||[]});
if(!S.site.v){const t=S.sections.map(s=>s.tr);S.sections.forEach((s,i)=>{delete s.tr;if(t[i+1])s.tr=t[i+1]});S.site.v=2}
SRV=JSON.stringify(S);
try{const D=JSON.parse(localStorage.draft||'null');if(D&&JSON.stringify(D.s)!==JSON.stringify(S)&&confirm('Найден несохранённый черновик от '+new Date(D.t).toLocaleString()+'. Восстановить?')){S=D.s;for(const f of await idbAll()){const u=URL.createObjectURL(f.blob);UP.set(u,{blob:f.blob,path:f.path});PB.set(f.path,u)}(function w(x){for(const k in x){const v=x[k];if(typeof v=='string'&&PB.has(v))x[k]=PB.get(v);else if(v&&typeof v=='object')w(v)}})(S)}}catch(e){}
$('[data-a=grid]').classList.add('on');size();left_();right_();fr.src='index.html?preview&v='+Date.now();checkTr()}).catch(e=>st('Не удалось загрузить content.json. Открой редактор по адресу сайта (...github.io/shenko/editor.html), а не файлом с компьютера. Причина: '+e.message));
