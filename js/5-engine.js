/* ───────── 그룹/단원 정의 ───────── */
const GROUPS={
  '7':{label:'7세',sub:'입학 준비',title:'하나, 둘, 셋! 놀면서 배워요.',desc:'글을 몰라도 괜찮아요. 🔊를 누르면 문제를 읽어 줘요. 8문제를 풀면 별과 스티커를 받고, 별 5개로 카드놀이를 할 수 있어요!',total:8,voice:true},
  '8':{label:'8세',sub:'1학년 1학기',title:'1학년 수학, 그림으로 척척!',desc:'1학년 1학기 복습과 2학기 미리 배우기. 별 5개를 모으면 카드놀이 1판!',total:8,voice:true},
  '82':{label:'1-2',sub:'1학년 2학기',title:'1학년 2학기, 받아올림 정복!',desc:'100까지의 수, 받아올림 덧셈, 받아내림 뺄셈, 세 수의 계산. 중간에 🔥 심화 문제가 3개 섞여 있어요.',total:8,voice:true},
  '31':{label:'3-1',sub:'3학년 1학기',title:'3학년 1학기, 기초를 탄탄하게.',desc:'세 자리 수 계산, 평면도형, 나눗셈, 곱셈, 길이와 시간, 분수와 소수. 중간에 🔥 심화 문제가 2개 섞여 있어요.',total:10,voice:false},
  '3':{label:'3-2',sub:'3학년 2학기',title:'오늘도 한 칸씩, 차근차근.',desc:'초록은 3학년 2학기 단원, 보라는 4학년 미리 배우기예요. 중간에 🔥 심화 문제가 2개 섞여 있어요.',total:10,voice:false},
  '41':{label:'4-1',sub:'4학년 1학기',title:'4학년 1학기, 더 큰 세계로.',desc:'만·억·조 큰 수, 각도, (세 자리)×(두 자리), 도형 뒤집기와 돌리기, 막대그래프. 중간에 🔥 심화 문제가 3개 섞여 있어요.',total:10,voice:false},
  '42':{label:'4-2',sub:'4학년 2학기',title:'4학년 2학기, 마지막 관문!',desc:'분수·소수의 덧셈과 뺄셈, 삼각형과 사각형 분류, 꺾은선그래프, 다각형. 중간에 🔥 심화 문제가 3개 섞여 있어요.',total:10,voice:false},
};
const ORDER=['7','8','82','31','3','41','42'];
const nextGroup=g=>ORDER[ORDER.indexOf(g)+1]||null;
const MODES_31=[
  {id:'addsub',icon:'➕',title:'덧셈과 뺄셈',sub:'세 자리 수 · 받아올림 · 받아내림',badge:'3-1',cls:'g'},
  {id:'shape',icon:'📐',title:'평면도형',sub:'직각 · 직각삼각형 · 직사각형 · 정사각형',badge:'3-1',cls:'g'},
  {id:'div',icon:'➗',title:'나눗셈',sub:'곱셈구구로 몫 구하기',badge:'3-1',cls:'g'},
  {id:'mul',icon:'✖️',title:'곱셈',sub:'(두 자리)×(한 자리)',badge:'3-1',cls:'g'},
  {id:'lentime',icon:'📏',title:'길이와 시간',sub:'mm · km · 초 · 시각 계산',badge:'3-1',cls:'g'},
  {id:'fracdec',icon:'🍰',title:'분수와 소수',sub:'분수 · 단위분수 · 0.1',badge:'3-1',cls:'g'},
];
const MODES_Y=[
  {id:'count',icon:'🍎',title:'수 세기',s7:'9까지의 수',s8:'20까지 · 50까지의 수'},
  {id:'order',icon:'🔢',title:'수의 순서',s7:'빈칸 · 1 큰 수',s8:'100까지 · 10 큰 수 · 크기 비교'},
  {id:'ten',icon:'🖐️',title:'가르기와 모으기',s7:'9까지 가르기',s8:'10 만들기'},
  {id:'addsub',icon:'➕',title:'덧셈과 뺄셈',s7:'9까지 그림으로',s8:'20까지 · 두 자리 수'},
  {id:'shape',icon:'🔺',title:'여러 가지 모양',s7:'세모 · 네모 · 동그라미',s8:'상자 · 둥근 기둥 · 공 모양'},
  {id:'compare',icon:'📏',title:'비교하기',s7:'길다 · 무겁다 · 많다',s8:'가장 긴 것 · 가장 많은 것'},
  {id:'pattern',icon:'🎨',title:'규칙 찾기',s7:'두 가지가 반복',s8:'세 가지 반복 · 수의 규칙'},
  {id:'clock',icon:'🕐',title:'시계 보기',s7:'몇 시',s8:'몇 시 30분'},
];
const MODES_3=[
  {id:'speed',icon:'⚡',title:'스피드 연산',sub:'곱셈 · 나눗셈 · 80초 도전',badge:'3-2',cls:'g'},
  {id:'frac',icon:'🍕',title:'분수 실험실',sub:'진분수 · 가분수 · 대분수',badge:'3-2',cls:'g'},
  {id:'unit',icon:'⚖️',title:'들이와 무게',sub:'L · mL · kg · g',badge:'3-2',cls:'g'},
  {id:'bignum',icon:'🔢',title:'큰 수 읽기',sub:'만 · 억 · 조 · 자릿값',badge:'4-1 선행',cls:'p'},
  {id:'angle',icon:'📐',title:'각도 탐험',sub:'예각 · 둔각 · 삼각형의 세 각',badge:'4-1 선행',cls:'p'},
  {id:'pattern',icon:'🧩',title:'규칙 찾기',sub:'수 배열 · 계산식의 규칙',badge:'4-1 선행',cls:'p'},
  {id:'area',icon:'🧱',title:'모눈 도형 빌더',sub:'넓이 · 둘레 만들기',badge:'선행',cls:'p'},
];
const LEVELS={
  speed:[{id:'easy',t:'복습',s:'(두 자리)×(한 자리), 곱셈구구 나눗셈',d:'●○○'},
         {id:'normal',t:'이번 학기',s:'(세 자리)×(한 자리), (두 자리)×(두 자리), 나머지가 있는 나눗셈',d:'●●○'},
         {id:'hard',t:'4학년 선행',s:'(세 자리)×(두 자리), (세 자리)÷(두 자리)',d:'●●●'}],
  frac:[{id:'lab',t:'직접 만들기',s:'분모·분자를 바꾸며 조각을 살펴보기',d:'탐구'},
        {id:'quiz',t:'문제 풀기',s:'그림 보고 분수 쓰기 · 가분수↔대분수 · 크기 비교 · 전체의 분수',d:'10문제'}],
};
const STICKERS=['🦁','🐼','🦊','🐰','🐨','🦄','🐙','🦖','🐳','🦋','🌈','🍩','🚀','🎸','🏆','🎁','🐯','🐧','🦉','🍭'];
const isY=()=>P.group==='7'||P.group==='8';
const MODES_MAP={'7':()=>MODES_Y,'8':()=>MODES_Y,'82':()=>MODES_82,'31':()=>MODES_31,'3':()=>MODES_3,'41':()=>MODES_41,'42':()=>MODES_42};
const modesNow=()=>MODES_MAP[P.group]();
const GEN_EXT={'82':()=>GEN82,'31':()=>GEN31,'41':()=>GEN41,'42':()=>GEN42};
const HARD_IDX={8:[2,4,6],10:[3,6,8]}; // 8문제 판 3개(37.5%) · 10문제 판 3개(30%)
const isHardIdx=(i,total)=>(HARD_IDX[total]||[]).includes(i);
const eligibleNow=()=>P.group===P.myGroup;
const modeInfo=id=>modesNow().find(m=>m.id===id);

/* ───────── 화면 ───────── */
const SCREENS=['home','levels','play','result','lab'];
function show(id){SCREENS.forEach(s=>$('#'+s).classList.toggle('hidden',s!==id));window.scrollTo({top:0});}
function goHome(){stopTimer();if(window.speechSynthesis)speechSynthesis.cancel();renderHome();show('home');}
function confirmHome(){if(!S.answeredCount||S.answeredCount<2||confirm('지금 그만두면 이번 별은 받지 못해요. 그만둘까요?'))goHome();}

function renderHome(){
  const g=GROUPS[P.group];
  $('#groupTog').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.g===P.group));
  $('#heroTitle').textContent=g.title;$('#heroDesc').textContent=g.desc;
  $('#legend').innerHTML=P.group==='3'?'<span class="badge g">3-2 · 이번 학기</span><span class="badge p">4-1 · 선행</span>':'';
  const done=P.done[P.group]||{};
  $('#modes').innerHTML=modesNow().map(m=>{const p=done[m.id]||{};
    const stars=[1,2,3].map(k=>`<span class="${(p.stars||0)>=k?'':'off'}">⭐</span>`).join('');
    const sub=isY()?(P.group==='7'?m.s7:m.s8):m.sub;
    const best=p.best!=null?`<span class="best">최고 ${p.best}${m.id==='speed'?'문제':isY()?'개':'점'}</span>`:'';
    return `<button class="mode" onclick="startMode('${m.id}')">${m.badge?`<span class="badge ${m.cls}">${m.badge}</span>`:''}<span class="icon">${m.icon}</span><span class="t display">${m.title}</span><span class="s">${sub}</span><span class="stars">${stars}</span>${best}</button>`;}).join('');
  $('#totalStars').textContent=P.wallet;renderCard();
  const d=daily();const mine=eligibleNow();
  const gp=gradProgress(P.group);
  const gtxt=P.grad&&P.grad[P.group]?`<span class="grad">🎓 졸업! ${nextGroup(P.group)?`다음: ${GROUPS[nextGroup(P.group)].label}`:'모든 과정 완료 👑'}</span>`:`<span class="hint">🎓 별 3개 단원 <b>${gp.n}</b>/${gp.total}</span>`;
  $('#eligible').innerHTML=(mine?`<span class="ok">⭐ 내 학년 · 오늘 별 <b>${d.earned}</b> / ${DAILY_CAP}</span> <span class="hint">같은 단원은 하루 2번까지 별을 받아요</span>`
    :`<span class="warn">✏️ 연습 모드 — 내 학년(${GROUPS[P.myGroup].label})이 아니라 별은 받지 않아요</span>`)+' '+gtxt;
  $('#stickers').innerHTML=`<span class="lbl">내 스티커판 (${P.stickers.length}개)</span>`+(P.stickers.length?P.stickers.map(s=>`<span class="st">${s}</span>`).join(''):'<span class="empty">문제를 풀고 첫 스티커를 받아 보세요!</span>');
}
function gradProgress(g){const modes=MODES_MAP[g]();const d=P.done[g]||{};let n=0;for(const m of modes)if((d[m.id]||{}).stars>=3)n++;return {n,total:modes.length};}
function showGrad(g){
  const nx=nextGroup(g);let box=$('#gradbox');
  if(!box){box=document.createElement('div');box.id='gradbox';box.className='modal';document.body.appendChild(box);}else box.classList.remove('hidden');
  box.innerHTML=`<div class="modalbox card" style="text-align:center">
    <div style="font-size:64px;line-height:1">🎓🏆</div>
    <div class="stamp" style="animation-delay:.2s">참<br>잘했어요<small>${GROUPS[g].label} 전 단원 ⭐3</small></div>
    <h2 class="display" style="font-size:34px;margin:6px 0 2px">${GROUPS[g].sub} 과정 졸업!</h2>
    <p style="color:var(--ink-soft);font-size:14px;margin:0">모든 단원에서 별 3개를 모았어요 · ${today()}</p>
    ${nx?`<p style="font-size:16px;margin:14px 0 8px">다음 단계는 <b>${GROUPS[nx].label} · ${GROUPS[nx].sub}</b>이에요!</p>
      <button class="btn purple" style="width:100%" id="gradNext">🚀 다음 단계 시작하기 (내 학년도 바뀌어요)</button>`
      :`<p style="font-size:17px;margin:14px 0 8px"><b>모든 과정을 마쳤어요! 👑 진짜 수학왕이에요!</b></p>`}
    <button class="btn ghost" style="width:100%;margin-top:10px" id="gradClose">홈으로</button>
  </div>`;
  audio.win();voice.say('축하해요! '+GROUPS[g].sub+' 과정을 졸업했어요!');
  $('#gradClose').onclick=()=>{box.classList.add('hidden');goHome();};
  const nb=$('#gradNext');if(nb)nb.onclick=()=>{P.myGroup=nx;P.group=nx;store.save(P);box.classList.add('hidden');voice.on=GROUPS[nx].voice;$('#voiceBtn').classList.toggle('off',!voice.on);goHome();};
}
function renderSetup(first){
  $('#setup').classList.remove('hidden');$('#setupTitle').textContent=first?'누가 할까요?':'내 학년 바꾸기';
  $('#setupList').innerHTML=ORDER.map(g=>`<button class="level ${g===P.myGroup?'on':''}" data-g="${g}"><div><div class="lt display">${GROUPS[g].label}</div><div class="ls">${GROUPS[g].sub}</div></div><div class="dots">${g===P.myGroup?'✔':''}</div></button>`).join('');
  $('#setupList').querySelectorAll('button').forEach(b=>b.onclick=()=>{P.myGroup=b.dataset.g;P.group=b.dataset.g;store.save(P);$('#setup').classList.add('hidden');voice.on=GROUPS[P.group].voice;$('#voiceBtn').classList.toggle('off',!voice.on);renderHome();audio.tap();});
  $('#setupClose').classList.toggle('hidden',first);
}
$('#setupClose').onclick=()=>$('#setup').classList.add('hidden');
$('#gearBtn').onclick=()=>renderSetup(false);
function renderCard(){
  const plays=cardPlays(),need=CARD_COST-(P.wallet%CARD_COST);
  const tickets=plays?Array.from({length:Math.min(plays,10)},()=>'🎟️').join('')+(plays>10?` +${plays-10}`:''):'';
  $('#cardplay').innerHTML=`<div class="cp-head"><div class="cp-title display">🃏 카드놀이</div><div class="cp-rule">별 ${CARD_COST}개 = 카드놀이 1판</div></div>
    <div class="cp-body"><div class="cp-stat">지금 별 <b>${P.wallet}</b>개 → <b class="${plays?'ok':''}">${plays}판</b> 할 수 있어요 ${tickets?`<span class="tickets">${tickets}</span>`:''}</div>
    ${plays?`<a class="btn purple" id="cardGo" href="${CARD_URL}" target="_blank" rel="noopener">카드놀이 하러 가기 <span class="cost">⭐ ${CARD_COST} 사용</span></a>`
      :`<button class="btn locked" disabled>🔒 별 ${need}개 더 모으면 열려요</button>`}
    ${P.cardPlays?`<div class="cp-hist">지금까지 카드놀이 ${P.cardPlays}판 했어요</div>`:''}</div>`;
  const a=$('#cardGo');if(a)a.onclick=e=>{if(P.wallet<CARD_COST){e.preventDefault();return;}
    if(!confirm(`별 ${CARD_COST}개를 사용해서 카드놀이를 한 판 할까요?\n(남는 별: ${P.wallet-CARD_COST}개)`)){e.preventDefault();return;}
    P.wallet-=CARD_COST;P.cardPlays++;store.save(P);audio.win();setTimeout(renderHome,300);};
}
function setGroup(g){P.group=g;voice.on=GROUPS[g].voice;$('#voiceBtn').classList.toggle('off',!voice.on);store.save(P);renderHome();audio.tap();}
function startMode(id){if(!isY()&&LEVELS[id]&&!GEN_EXT[P.group])return showLevels(id);startRound(id,null);}
function showLevels(id){const m=modeInfo(id);$('#levelTitle').textContent=m.icon+' '+m.title;
  $('#levelDesc').textContent=id==='speed'?'80초 동안 몇 문제를 맞힐 수 있을까요? 5문제=별 1개, 10문제=별 2개, 15문제=별 3개':'먼저 직접 만들어 본 다음 문제를 풀면 더 쉬워요.';
  $('#levelList').innerHTML=LEVELS[id].map(l=>`<button class="level" onclick="pickLevel('${id}','${l.id}')"><div><div class="lt display">${l.t}</div><div class="ls">${l.s}</div></div><div class="dots">${l.d}</div></button>`).join('');
  show('levels');}
function pickLevel(id,lv){if(id==='frac'&&lv==='lab')return openLab();startRound(id,lv);}

/* ───────── 라운드 ───────── */
let S={};
function startRound(mode,level){
  stopTimer();
  S={group:P.group,mode,level,i:0,total:mode==='speed'?Infinity:GROUPS[P.group].total,correct:0,answeredCount:0,combo:0,maxCombo:0,q:null,answered:false,fields:{},active:null,cells:new Set(),timeLeft:80,log:[],hardOk:0};
  $('#timer').classList.toggle('hidden',mode!=='speed');
  if(mode==='speed')startTimer();
  nextQuestion();show('play');
}
function startTimer(){S.timeLeft=80;$('#timer').textContent=80;$('#timer').classList.remove('hurry');
  S.timer=setInterval(()=>{S.timeLeft--;$('#timer').textContent=S.timeLeft;if(S.timeLeft<=10)$('#timer').classList.add('hurry');if(S.timeLeft<=0){stopTimer();endRound();}},1000);}
function stopTimer(){if(S.timer){clearInterval(S.timer);S.timer=null;}clearTimeout(S.autoTimer);}

function normalize(q){
  if(q.options){ // 7·8세 형식 → 공통 형식
    const ans=q.ans;q.input={type:'choice',options:q.options};q.check=v=>v===ans;
    const o=q.options.find(x=>x.v===ans);q.solHTML=o?o.html:ans;
  } else if(q.input.type==='choice'){
    const big=q.input.big;q.input.options=q.input.options.map(o=>typeof o==='string'?{v:o,html:esc(o),text:!big,big}:o);
  }
  return q;
}
function nextQuestion(){
  if(S.i>=S.total)return endRound();
  const hard=S.mode!=='speed'&&isHardIdx(S.i,S.total);
  let q;
  if(isY())q=hard&&HARDY[S.mode]?HARDY[S.mode]():GENY[S.mode]();
  else if(GEN_EXT[S.group])q=GEN_EXT[S.group]()[S.mode](S.i,hard);
  else q=hard&&HARD3[S.mode]?HARD3[S.mode](S.i):GEN3[S.mode](S.level,S.i);
  q=normalize(q);q.hard=hard;
  S.q=q;S.answered=false;S.fields={};S.active=null;S.cells=new Set();
  renderProgress();
  const m=modeInfo(S.mode);
  $('#tagline').innerHTML=`<span class="tag ${q.hard?'hard':''}">${q.hard?'🔥 심화 · ':''}${m.icon} ${q.tag||m.title}</span>`;
  $('#qcard').classList.toggle('hardcard',!!q.hard);
  $('#prompt').innerHTML=q.prompt||'';
  $('#visual').innerHTML=(q.eq?`<div class="eq">${q.eq}</div>`:'')+(q.eqHTML?`<div class="eq">${q.eqHTML}</div>`:'')+(q.visual||'');
  $('#visual').style.display=$('#visual').innerHTML?'':'none';
  $('#feedback').innerHTML='';
  renderInput(q.input);
  if(q.prompt&&!/</.test(q.prompt))voice.say(q.prompt);
}
function renderProgress(){
  const p=$('#progress');
  if(S.mode==='speed')p.innerHTML=`<span style="font-weight:700">맞힌 문제 ${S.correct}</span>`;
  else p.innerHTML=Array.from({length:S.total},(_,k)=>`<i class="${S.log[k]===true?'ok':S.log[k]===false?'no':k===S.i?'cur':''}"></i>`).join('');
  $('#combo').textContent=S.combo>=2?`🔥 ${S.combo}콤보`:'';
}
function renderInput(inp){
  const A=$('#answer');A.innerHTML='';$('#numpad').classList.add('hidden');
  if(inp.type==='choice'){
    const n=inp.options.length;
    A.innerHTML=`<div class="choices c${n}">${inp.options.map(o=>`<button class="choice ${o.text?'text':''} ${o.big?'big':''}" data-v="${String(o.v).replace(/"/g,'&quot;')}" style="${o.col?'flex-direction:column;gap:4px':''}">${o.html}</button>`).join('')}</div>`;
    A.querySelectorAll('.choice').forEach(b=>b.onclick=()=>submit(b.dataset.v,b));
  } else if(inp.type==='num'){
    A.innerHTML=`<div class="field active" data-key="v" tabindex="0"></div>${inp.unit?`<span class="unitlabel">${inp.unit}</span>`:''}`;S.active='v';showNumpad(false,!!inp.decimal);
  } else if(inp.type==='pair'){
    A.innerHTML=inp.fields.map(([k,u])=>`<div class="field" data-key="${k}" tabindex="0"></div><span class="unitlabel">${u}</span>`).join('');S.active=inp.fields[0][0];showNumpad(true);
  } else if(inp.type==='frac'){
    const hasW=inp.fields.includes('w');
    A.innerHTML=`<div class="fracin">${hasW?'<div class="field" data-key="w" tabindex="0"></div>':''}<div class="stack"><div class="field" data-key="n" tabindex="0"></div><div class="bar"></div><div class="field" data-key="d" tabindex="0"></div></div></div>`;S.active=inp.fields[0];showNumpad(true);
  } else if(inp.type==='area'){renderArea(inp);}
  A.querySelectorAll('.field:not(.fixed)').forEach(f=>{f.onclick=()=>setActive(f.dataset.key);});
  highlightActive();
}
function setActive(k){S.active=k;highlightActive();audio.tap();}
function highlightActive(){$('#answer').querySelectorAll('.field').forEach(f=>f.classList.toggle('active',f.dataset.key===S.active));}
function showNumpad(multi,dec){
  const keys=['1','2','3','4','5','6','7','8','9','←','0',multi?'→':dec?'.':''];
  $('#numpad').innerHTML=keys.map(k=>k===''?'<span></span>':`<button class="key ${/[←→]/.test(k)?'act':''}" data-k="${k}">${k}</button>`).join('')+`<button class="key go" data-k="go">확인</button>`;
  $('#numpad').classList.remove('hidden');
  $('#numpad').querySelectorAll('.key').forEach(b=>b.onclick=()=>keyPress(b.dataset.k));
}
function keyPress(k){
  if(S.answered||!S.q)return;
  if(k==='go')return submitFields();
  if(k==='→')return moveField(1);
  const el=$(`#answer .field[data-key="${S.active}"]`);if(!el)return;
  let v=S.fields[S.active]||'';
  if(k==='←')v=v.slice(0,-1);else if(k==='.'){if(!v.includes('.'))v=(v||'0')+'.';}else if(v.length<10)v+=k;
  S.fields[S.active]=v;el.textContent=v;audio.tap();
}
function moveField(dir){const keys=[...$('#answer').querySelectorAll('.field:not(.fixed)')].map(f=>f.dataset.key);const i=keys.indexOf(S.active);S.active=keys[(i+dir+keys.length)%keys.length];highlightActive();}
function submitFields(){
  const inp=S.q.input;
  if(inp.type==='num'){if(S.fields.v==null||S.fields.v==='')return shake();return submit(+S.fields.v);}
  const keys=[...$('#answer').querySelectorAll('.field:not(.fixed)')].map(f=>f.dataset.key);
  if(keys.some(k=>!S.fields[k]))return shake();
  const o={};keys.forEach(k=>o[k]=+S.fields[k]);submit(o);
}
function shake(){const el=$(`#answer .field[data-key="${S.active}"]`);if(!el)return;el.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:220});}
window.addEventListener('keydown',e=>{
  if($('#play').classList.contains('hidden'))return;
  if(S.answered){if(e.key==='Enter'){const b=$('#feedback .btn');if(b)b.click();}return;}
  const inp=S.q&&S.q.input;if(!inp)return;
  if(inp.type==='choice'){const n=+e.key;const cs=$('#answer').querySelectorAll('.choice');if(n>=1&&n<=cs.length)cs[n-1].click();return;}
  if(inp.type==='area'){if(e.key==='Enter'){const b=$('#areaGo');if(b)b.click();}return;}
  if(/^[0-9]$/.test(e.key))keyPress(e.key);
  else if(e.key==='Backspace')keyPress('←');
  else if(e.key==='Enter')keyPress('go');
  else if(e.key==='Tab'||e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();moveField(1);}
  else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();moveField(-1);}
});

/* 모눈 도형 */
function renderArea(inp){
  const A=$('#answer');
  A.innerHTML=`<div style="width:100%;text-align:center"><div class="gridbox" id="grid" role="grid">${Array.from({length:36},(_,k)=>`<div class="cell" data-x="${k%6}" data-y="${Math.floor(k/6)}" tabindex="0" role="gridcell"></div>`).join('')}</div>
    <div class="livestat"><span>넓이 <b id="lvA">0</b>칸 <span style="color:var(--ink-soft)">/ ${inp.area}</span></span>${inp.per?`<span>둘레 <b id="lvP">0</b> <span style="color:var(--ink-soft)">/ ${inp.per}</span></span>`:''}</div>
    <div class="row" style="justify-content:center"><button class="btn ghost" id="areaClear">지우기</button><button class="btn" id="areaGo">확인</button></div></div>`;
  const toggle=c=>{if(S.answered)return;const k=c.dataset.x+','+c.dataset.y;S.cells.has(k)?S.cells.delete(k):S.cells.add(k);c.classList.toggle('on');audio.tap();updateLive(inp);};
  A.querySelectorAll('.cell').forEach(c=>{c.onclick=()=>toggle(c);c.onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();toggle(c);}};});
  $('#areaClear').onclick=()=>{if(S.answered)return;S.cells.clear();A.querySelectorAll('.cell').forEach(c=>c.classList.remove('on'));updateLive(inp);};
  $('#areaGo').onclick=()=>{if(S.answered||!S.cells.size)return;
    if(!connected(S.cells)){$('#feedback').innerHTML=`<div class="feedback no"><span class="fx">잠깐!</span><span class="sol">칸들이 서로 붙어 있어야 하나의 도형이에요.</span></div>`;audio.no();return;}
    submit({a:S.cells.size,p:perimeter(S.cells)});};
}
function updateLive(inp){const a=S.cells.size,p=perimeter(S.cells);const ea=$('#lvA'),ep=$('#lvP');ea.textContent=a;ea.className=a===inp.area?'hit':'';if(ep){ep.textContent=p;ep.className=p===inp.per?'hit':'';}}

/* 채점 */
function isCorrect(v){const q=S.q;
  if(q.input.type==='area')return v.a===q.input.area&&(q.input.per==null||v.p===q.input.per);
  if(q.check)return q.check(v);if(typeof q.ans==='number'&&typeof v==='number')return Math.abs(v-q.ans)<1e-9;return v===q.ans;}
const MARK_O=`<svg class="mark" viewBox="0 0 100 100" preserveAspectRatio="none"><circle cx="50" cy="50" r="44" vector-effect="non-scaling-stroke"/></svg>`;
const MARK_X=`<svg class="mark" viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="22" y1="82" x2="78" y2="18" vector-effect="non-scaling-stroke"/></svg>`;
function submit(v,btn){
  if(S.answered)return;S.answered=true;S.answeredCount++;
  const q=S.q,ok=isCorrect(v);
  if(ok){S.correct++;S.combo++;S.maxCombo=Math.max(S.maxCombo,S.combo);audio.ok();if(q.hard)S.hardOk=(S.hardOk||0)+1;}else{S.combo=0;audio.no();}
  if(S.mode!=='speed')S.log[S.i]=ok;
  const A=$('#answer');
  if(q.input.type==='choice'){
    const solV=q.options?q.ans:String(q.sol);
    A.querySelectorAll('.choice').forEach(b=>{if(b.dataset.v===String(solV))b.classList.add('correct');});
    if(btn){btn.classList.add(ok?'correct':'wrong');btn.insertAdjacentHTML('beforeend',ok?MARK_O:MARK_X);}
  } else if(q.input.type!=='area'){
    const target=q.input.type==='num'?A.querySelector('.field'):A;target.style.position='relative';target.insertAdjacentHTML('beforeend',ok?MARK_O:MARK_X);
  }
  const solText=q.solHTML||q.solText||(q.sol!=null?q.sol:q.ans);
  const praise=pick(['정답!','맞았어요!','딩동댕!','참 잘했어요!','최고예요!']);
  const fb=$('#feedback');
  if(S.mode==='speed'){
    fb.innerHTML=ok?`<div class="feedback ok"><span class="fx">${praise}</span></div>`:`<div class="feedback no"><span class="fx">아쉬워요</span><span class="sol">정답은 <b>${solText}</b></span></div>`;
    setTimeout(()=>{S.i++;if(S.timer)nextQuestion();},ok?500:1200);return;
  }
  const stamp=ok&&S.combo%3===0?`<div class="stamp tiny">참<br>잘했어요<small>${S.combo}콤보</small></div>`:'';
  const solBox=`<b style="display:inline-flex;align-items:center;vertical-align:middle;max-height:60px;overflow:hidden">${solText}</b>`;
  fb.innerHTML=ok?`<div class="feedback ok"><span class="fx">${praise}</span><span class="sol">${q.explain||''}</span><button class="btn green" onclick="advance()">다음 →</button>${stamp}</div>`
    :`<div class="feedback no"><span class="fx">${isY()?'괜찮아요!':'다시 한번!'}</span><span class="sol">정답은 ${solBox}<br>${q.explain||''}</span><button class="btn" onclick="advance()">다음 →</button></div>`;
  voice.say(ok?praise:'괜찮아요. '+(q.explain||''),{rate:1});
  renderProgress();
  if(ok)S.autoTimer=setTimeout(advance,isY()?1700:1600);
}
function advance(){clearTimeout(S.autoTimer);if(!S.answered)return;S.i++;nextQuestion();}

/* 결과 */
function endRound(){
  stopTimer();
  const speed=S.mode==='speed',young=GROUPS[S.group].total===8;
  const score=speed?S.correct:young?S.correct:S.correct*10;
  const stars=speed?(S.correct>=15?3:S.correct>=10?2:S.correct>=5?1:0):young?(score>=8?3:score>=6?2:score>=4?1:0):(score>=90?3:score>=70?2:score>=40?1:0);
  const d=P.done[S.group]=P.done[S.group]||{};const p=d[S.mode]=d[S.mode]||{};
  const prevBest=p.best;const newRecord=prevBest!=null&&score>prevBest;
  p.stars=Math.max(p.stars||0,stars);p.best=Math.max(p.best||0,score);
  let newSt='';if(stars>=1){newSt=pick(STICKERS);P.stickers.push(newSt);if(P.stickers.length>80)P.stickers.shift();}
  // ── 별 지급 규칙 ──
  const dy=daily();const key=`${S.group}:${S.mode}:${S.level||''}`;const played=dy.plays[key]||0;dy.plays[key]=played+1;
  const finished=speed?S.timeLeft<=0:S.i>=S.total;
  let earn=stars;const bonus=[];
  if(finished&&earn<1){earn=1;bonus.push('끝까지 풀기 +1');}
  if(S.hardOk>=2){earn+=1;bonus.push(`심화 ${S.hardOk}문제 성공 +1`);}
  if(newRecord){earn+=1;bonus.push('최고 기록 갱신 +1');}
  let why='';
  if(S.group!==P.myGroup){earn=0;why=`연습 모드 — 내 학년(${GROUPS[P.myGroup].label})이 아니에요`;}
  else if(played>=SAME_LIMIT){earn=0;why=`오늘 이 단원을 ${played+1}번째 해서 별은 없어요 (하루 ${SAME_LIMIT}번까지)`;}
  else if(dy.earned>=DAILY_CAP){earn=0;why=`오늘 별 ${DAILY_CAP}개를 다 모았어요! 내일 또 만나요`;}
  else if(dy.earned+earn>DAILY_CAP){earn=DAILY_CAP-dy.earned;why=`하루 상한 ${DAILY_CAP}개에 맞춰 ${earn}개만 받았어요`;}
  dy.earned+=earn;P.wallet+=earn;
  // ── 졸업 판정: 이 학년 모든 단원 ⭐3 ──
  P.grad=P.grad||{};
  const gp=gradProgress(S.group);
  const gradNow=gp.n===gp.total&&!P.grad[S.group];
  if(gradNow)P.grad[S.group]=today();
  store.save(P);
  const m=modeInfo(S.mode);const g=GROUPS[S.group];
  const title=stars===3?'참 잘했어요!':stars===2?'잘했어요!':stars===1?'좋아요, 조금만 더!':'다시 해 볼까요?';
  const unit=speed?'문제':young?'개':'점';
  $('#resultCard').innerHTML=`<div style="font-size:14px;color:var(--ink-soft);font-weight:700;margin-bottom:8px">${m.icon} ${m.title} · ${g.label}</div>
    ${stars>=2?'<div class="stamp">참<br>잘했어요<small>2026 · 수학 놀이터</small></div>':'<div style="font-size:60px">💪</div>'}
    <h2 class="display">${title}</h2>
    <div class="bigstars">${[1,2,3].map(k=>`<span class="${stars>=k?'':'off'}">⭐</span>`).join('')}</div>
    ${newSt?`<div class="newst">새 스티커를 받았어요!<b>${newSt}</b></div>`:''}
    <div class="walletline">${earn?`⭐ 별 <b>${earn}</b>개 획득! `:''}${bonus.length&&earn?`<span class="bonus">${bonus.join(' · ')}</span> `:''}${why?`<span class="why">${why}</span> `:''}<br>모은 별 <b>${P.wallet}</b>개 · 오늘 ${dy.earned}/${DAILY_CAP} · 카드놀이 <b>${cardPlays()}</b>판 가능${cardPlays()?' 🎟️':''}</div>
    <div class="gradline">${P.grad[S.group]?`🎓 ${GROUPS[S.group].sub} 졸업!`:`🎓 별 3개 단원 <b>${gp.n}</b> / ${gp.total} — 모두 채우면 졸업장!`}</div>
    <div class="stat"><span>${speed?'맞힌 문제':young?'맞힌 문제':'점수'}<b>${speed?S.correct+'문제':young?S.correct+' / '+S.total:score+'점'}</b></span><span>최고 콤보<b>${S.maxCombo}</b></span><span>최고 기록<b>${p.best}${unit}</b></span></div>
    <div class="row" style="justify-content:center"><button class="btn ghost" onclick="goHome()">홈으로</button><button class="btn blue" onclick="startRound('${S.mode}',${S.level?`'${S.level}'`:'null'})">다시 하기</button></div>`;
  if(stars>=2)audio.win();voice.say(title+(newSt?' 새 스티커를 받았어요!':''));
  show('result');
  if(gradNow)setTimeout(()=>showGrad(S.group),900);
}

/* ───────── 분수 실험실 ───────── */
let labShape='pie';
function openLab(){show('lab');updateLab();}
$('#labD').oninput=updateLab;$('#labN').oninput=updateLab;
document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.seg button').forEach(x=>x.classList.remove('on'));b.classList.add('on');labShape=b.dataset.shape;updateLab();});
function updateLab(){
  const d=+$('#labD').value;$('#labN').max=d*4;let n=Math.min(+$('#labN').value,d*4);$('#labN').value=n;
  $('#labDv').textContent=d;$('#labNv').textContent=n;
  $('#labVisual').innerHTML=labShape==='pie'?pieSVG(n,d,110):barSVG(n,d,280);
  const w=Math.floor(n/d),r=n%d,g=gcd(n||1,d);
  const kind=n===0?'0':n<d?'진분수':n===d?'자연수 1':n%d===0?`자연수 ${n/d}`:'가분수';
  const rep=[{k:'분수의 종류',v:kind},{k:'가분수 / 진분수',v:fracHTML(n,d)},{k:'대분수',v:n>=d?fracHTML(r,d,w)+(r===0?` = ${w}`:''):'—'},
    {k:'같은 크기의 분수',v:g>1&&n>0?fracHTML(n,d)+' = '+fracHTML(n/g,d/g):(n>0?fracHTML(n,d)+' = '+fracHTML(n*2,d*2):'—')}];
  $('#labRep').innerHTML=rep.map(x=>`<div><div class="k">${x.k}</div><div class="v">${x.v}</div></div>`).join('');
  $('#labRead').innerHTML=n===0?'아직 색칠한 조각이 없어요':`읽기: <b>${w>0&&r>0?fracRead(w,r,d):r===0?readSmall(w):fracRead(0,n,d)}</b> &nbsp;·&nbsp; 전체를 ${d}칸으로 나눈 것 중 ${n}칸`;
}

/* 초기화 */
$('#groupTog').querySelectorAll('button').forEach(b=>b.onclick=()=>setGroup(b.dataset.g));
if(!P.myGroup||!GROUPS[P.myGroup]){P.myGroup=P.group;store.save(P);}
voice.on=GROUPS[P.group].voice;$('#voiceBtn').classList.toggle('off',!voice.on);
renderHome();
if(!P.setupDone){renderSetup(true);P.setupDone=true;store.save(P);}
