/* ───────── 학기 정의 : 초등 1학년 1학기 ~ 4학년 2학기 (2022 개정 교육과정) ───────── */
const GROUPS={
  '11':{label:'1-1',sub:'1학년 1학기',title:'1학년 1학기, 수와 친해져요!',desc:'9까지의 수, 여러 가지 모양, 덧셈과 뺄셈, 비교하기, 50까지의 수. 🔊를 누르면 문제를 읽어 줘요.',voice:true},
  '12':{label:'1-2',sub:'1학년 2학기',title:'1학년 2학기, 받아올림 정복!',desc:'100까지의 수, 덧셈과 뺄셈(1)(2)(3), 모양과 시각, 규칙 찾기.',voice:true},
  '21':{label:'2-1',sub:'2학년 1학기',title:'2학년 1학기, 세 자리 수의 세계로!',desc:'세 자리 수, 여러 가지 도형, 덧셈과 뺄셈, 길이 재기, 분류하기, 곱셈.',voice:false},
  '22':{label:'2-2',sub:'2학년 2학기',title:'2학년 2학기, 곱셈구구 마스터!',desc:'네 자리 수, 곱셈구구, 길이 재기(m), 시각과 시간, 표와 그래프, 규칙 찾기.',voice:false},
  '31':{label:'3-1',sub:'3학년 1학기',title:'3학년 1학기, 기초를 탄탄하게.',desc:'덧셈과 뺄셈, 평면도형, 나눗셈, 곱셈, 길이와 시간, 분수와 소수.',voice:false},
  '32':{label:'3-2',sub:'3학년 2학기',title:'3학년 2학기, 한 칸씩 차근차근.',desc:'곱셈, 나눗셈, 원, 분수, 들이와 무게, 그림그래프.',voice:false},
  '41':{label:'4-1',sub:'4학년 1학기',title:'4학년 1학기, 더 큰 세계로.',desc:'큰 수, 각도, 곱셈과 나눗셈, 평면도형의 이동, 막대그래프, 규칙 찾기.',voice:false},
  '42':{label:'4-2',sub:'4학년 2학기',title:'4학년 2학기, 마지막 관문!',desc:'분수의 덧셈과 뺄셈, 삼각형, 소수의 덧셈과 뺄셈, 사각형, 꺾은선그래프, 다각형.',voice:false},
};
const ORDER=['11','12','21','22','31','32','41','42'];
/* 한 판 10문제 = 하 1(10%) · 중 5(50%) · 상 4(40%) */
const TOTAL=10, LV_COUNT={low:1,mid:5,high:4};
const LV={low:{t:'하',cls:'lv-low'},mid:{t:'중',cls:'lv-mid'},high:{t:'상 🔥',cls:'lv-high'}};
const STAR_RULE='80·90점 ⭐1 · 100점 ⭐2 · 🔥상 문제 4개 모두 맞히면 +1';
const nextGroup=g=>ORDER[ORDER.indexOf(g)+1]||null;
const isY=()=>P.group==='11'||P.group==='12';
const modesNow=()=>CUR[P.group].modes;
const eligibleNow=()=>P.group===P.myGroup;
const modeInfo=id=>modesNow().find(m=>m.id===id);
const STICKERS=['🦁','🐼','🦊','🐰','🐨','🦄','🐙','🦖','🐳','🦋','🌈','🍩','🚀','🎸','🏆','🎁','🐯','🐧','🦉','🍭'];
function makePlan(){return ['low',...shuffle([...Array(LV_COUNT.mid).fill('mid'),...Array(LV_COUNT.high).fill('high')])];}
function roundStars(correct,highOk,highTotal){const score=correct*10;let s=score>=100?2:score>=80?1:0;if(highTotal&&highOk>=highTotal)s+=1;return s;}

/* ───────── 화면 ───────── */
const SCREENS=['home','play','result'];
function show(id){SCREENS.forEach(s=>$('#'+s).classList.toggle('hidden',s!==id));window.scrollTo({top:0});}
function goHome(){stopTimer();if(window.speechSynthesis)speechSynthesis.cancel();renderHome();show('home');}
function confirmHome(){if(!S.answeredCount||S.answeredCount<2||confirm('지금 그만두면 이번 별은 받지 못해요. 그만둘까요?'))goHome();}

function renderHome(){
  const g=GROUPS[P.group];
  $('#groupTog').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.g===P.group));
  $('#heroTitle').textContent=g.title;$('#heroDesc').textContent=g.desc;
  $('#legend').innerHTML=`<span class="badge g">${g.label} · ${g.sub}</span><span class="lvline">한 판 10문제 = <b class="lvc lv-low">하 1</b> <b class="lvc lv-mid">중 5</b> <b class="lvc lv-high">상 4</b></span>`;
  const done=P.done[P.group]||{};
  $('#modes').innerHTML=modesNow().map(m=>{const p=done[m.id]||{};
    const stars=[1,2,3].map(k=>`<span class="${(p.stars||0)>=k?'':'off'}">⭐</span>`).join('');
    const best=p.best!=null?`<span class="best">최고 ${p.best}점</span>`:'';
    return `<button class="mode" onclick="startMode('${m.id}')"><span class="badge g">${g.label}</span><span class="icon">${m.icon}</span><span class="t display">${m.title}</span><span class="s">${m.sub}</span><span class="stars">${stars}</span>${best}</button>`;}).join('');
  $('#totalStars').textContent=P.wallet;renderCard();
  const d=daily();const mine=eligibleNow();
  const gp=gradProgress(P.group);
  const gtxt=P.grad&&P.grad[P.group]?`<span class="grad">🎓 졸업! ${nextGroup(P.group)?`다음: ${GROUPS[nextGroup(P.group)].label}`:'모든 과정 완료 👑'}</span>`:`<span class="hint">🎓 100점(⭐3) 단원 <b>${gp.n}</b>/${gp.total}</span>`;
  $('#eligible').innerHTML=(mine?`<span class="ok">⭐ 내 학년 · 오늘 별 <b>${d.earned}</b> / ${DAILY_CAP}</span> <span class="hint">${STAR_RULE} · 같은 단원은 하루 1번만 별</span>`
    :`<span class="warn">✏️ 연습 모드 — 내 학년(${GROUPS[P.myGroup].label})이 아니라 별은 받지 않아요</span>`)+' '+gtxt;
  $('#stickers').innerHTML=`<span class="lbl">내 스티커판 (${P.stickers.length}개)</span>`+(P.stickers.length?P.stickers.map(s=>`<span class="st">${s}</span>`).join(''):'<span class="empty">문제를 풀고 첫 스티커를 받아 보세요!</span>');
}
function gradProgress(g){const modes=CUR[g].modes;const d=P.done[g]||{};let n=0;for(const m of modes)if((d[m.id]||{}).stars>=3)n++;return {n,total:modes.length};}
function showGrad(g){
  const nx=nextGroup(g);let box=$('#gradbox');
  if(!box){box=document.createElement('div');box.id='gradbox';box.className='modal';document.body.appendChild(box);}else box.classList.remove('hidden');
  box.innerHTML=`<div class="modalbox card" style="text-align:center">
    <div style="font-size:64px;line-height:1">🎓🏆</div>
    <div class="stamp" style="animation-delay:.2s">참<br>잘했어요<small>${GROUPS[g].label} 전 단원 100점</small></div>
    <h2 class="display" style="font-size:34px;margin:6px 0 2px">${GROUPS[g].sub} 과정 졸업!</h2>
    <p style="color:var(--ink-soft);font-size:14px;margin:0">모든 단원에서 100점(⭐3)을 받았어요 · ${today()}</p>
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
function startMode(id){startRound(id);}

/* ───────── 라운드 ───────── */
let S={};
function startRound(mode){
  stopTimer();
  S={group:P.group,mode,i:0,total:TOTAL,plan:makePlan(),correct:0,answeredCount:0,combo:0,maxCombo:0,q:null,answered:false,fields:{},active:null,cells:new Set(),log:[],highOk:0};
  nextQuestion();show('play');
}
function stopTimer(){if(S.timer){clearInterval(S.timer);S.timer=null;}clearTimeout(S.autoTimer);}

function normalize(q){
  if(q.options){ // 보기 그림형 → 공통 형식
    const ans=String(q.ans);q.input={type:'choice',options:q.options};q.check=v=>v===ans;
    const o=q.options.find(x=>x.v===ans);q.solHTML=o?o.html:ans;
  } else if(q.input.type==='choice'){
    const big=q.input.big;q.input.options=q.input.options.map(o=>typeof o==='string'?{v:o,html:esc(o),text:!big,big}:o);
  }
  return q;
}
/* 문제 만들기 (생성 중 오류가 나면 다시 시도 → 그래도 안 되면 '중' 문제) */
function genQ(group,mode,lv,i){
  const g=CUR[group].gen[mode];
  for(let t=0;t<6;t++){try{const q=g[lv](i);if(q&&(q.input||q.options))return q;}catch(e){console.warn('문제 생성 오류',group,mode,lv,e);}}
  return g.mid(i);
}
function renderQuestion(q){
  S.q=q;S.answered=false;S.fields={};S.active=null;S.cells=new Set();
  renderProgress();
  const m=modeInfo(S.mode);const lv=LV[q.lv]||LV.mid;
  $('#tagline').innerHTML=`<span class="tag lvchip ${lv.cls}">${lv.t}</span> <span class="tag ${q.hard?'hard':''}">${m.icon} ${q.tag||m.title}</span>`;
  $('#qcard').classList.toggle('hardcard',!!q.hard);
  $('#prompt').innerHTML=q.prompt||'';
  $('#visual').innerHTML=(q.eq?`<div class="eq">${q.eq}</div>`:'')+(q.eqHTML?`<div class="eq">${q.eqHTML}</div>`:'')+(q.visual||'');
  $('#visual').style.display=$('#visual').innerHTML?'':'none';
  $('#feedback').innerHTML='';
  renderInput(q.input);
  if(q.prompt&&!/</.test(q.prompt))voice.say(q.prompt);
}
function nextQuestion(){
  if(S.i>=S.total)return endRound();
  const lv=S.plan[S.i];
  const q=normalize(genQ(S.group,S.mode,lv,S.i));q.lv=lv;q.hard=lv==='high';
  renderQuestion(q);
}
function renderProgress(){
  const p=$('#progress');
  p.innerHTML=Array.from({length:S.total},(_,k)=>`<i class="${S.log[k]===true?'ok':S.log[k]===false?'no':k===S.i?'cur':''}"></i>`).join('');
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
  else if(e.key==='.'&&inp.decimal)keyPress('.');
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
  if(ok){S.correct++;S.combo++;S.maxCombo=Math.max(S.maxCombo,S.combo);audio.ok();if(q.hard)S.highOk++;}else{S.combo=0;audio.no();}
  S.log[S.i]=ok;
  const A=$('#answer');
  if(q.input.type==='choice'){
    const solV=q.options?String(q.ans):String(q.sol);
    A.querySelectorAll('.choice').forEach(b=>{if(b.dataset.v===solV)b.classList.add('correct');});
    if(btn){btn.classList.add(ok?'correct':'wrong');btn.insertAdjacentHTML('beforeend',ok?MARK_O:MARK_X);}
  } else if(q.input.type!=='area'){
    const target=q.input.type==='num'?A.querySelector('.field'):A;target.style.position='relative';target.insertAdjacentHTML('beforeend',ok?MARK_O:MARK_X);
  }
  const solText=q.solHTML||q.solText||(q.sol!=null?q.sol:q.ans);
  const praise=pick(['정답!','맞았어요!','딩동댕!','참 잘했어요!','최고예요!']);
  const fb=$('#feedback');
  const stamp=ok&&S.combo%3===0?`<div class="stamp tiny">참<br>잘했어요<small>${S.combo}콤보</small></div>`:'';
  const solBox=`<b style="display:inline-flex;align-items:center;vertical-align:middle;max-height:60px;overflow:hidden">${solText}</b>`;
  fb.innerHTML=ok?`<div class="feedback ok"><span class="fx">${praise}</span><span class="sol">${q.explain||''}</span><button class="btn green" onclick="advance()">다음 →</button>${stamp}</div>`
    :`<div class="feedback no"><span class="fx">${isY()?'괜찮아요!':'다시 한번!'}</span><span class="sol">정답은 ${solBox}<br>${q.explain||''}</span><button class="btn" onclick="advance()">다음 →</button></div>`;
  voice.say(ok?praise:'괜찮아요. '+(q.explain||''),{rate:1});
  renderProgress();
  if(ok)S.autoTimer=setTimeout(advance,isY()?1700:1600);
}
function advance(){clearTimeout(S.autoTimer);if(!S.answered)return;S.i++;nextQuestion();}

/* 결과 + 별 규칙 */
function endRound(){
  stopTimer();
  const score=S.correct*10,highTotal=S.plan.filter(x=>x==='high').length,allHigh=S.highOk>=highTotal;
  const stars=roundStars(S.correct,S.highOk,highTotal);
  const d=P.done[S.group]=P.done[S.group]||{};const p=d[S.mode]=d[S.mode]||{};
  p.stars=Math.max(p.stars||0,stars);p.best=Math.max(p.best||0,score);
  let newSt='';if(stars>=1){newSt=pick(STICKERS);P.stickers.push(newSt);if(P.stickers.length>80)P.stickers.shift();}
  // ── 별 지급 ──
  const dy=daily();const key=`${S.group}:${S.mode}`;dy.plays[key]=(dy.plays[key]||0)+1;dy.got=dy.got||{};
  let earn=stars,why='';const parts=[];
  if(score>=80)parts.push(`${score}점 ⭐${score>=100?2:1}`);if(allHigh)parts.push('🔥상 모두 정답 +1');
  if(S.group!==P.myGroup){earn=0;why=`연습 모드 — 내 학년(${GROUPS[P.myGroup].label})이 아니에요`;}
  else if(stars===0){why='80점 이상이거나 🔥상 문제 4개를 모두 맞히면 별을 받아요';}
  else if(dy.got[key]){earn=0;why='이 단원은 오늘 이미 별을 받았어요. 다른 단원에 도전해요! (같은 단원은 하루 1번)';}
  else if(dy.earned>=DAILY_CAP){earn=0;why=`오늘 별 ${DAILY_CAP}개를 다 모았어요! 내일 또 만나요`;}
  else if(dy.earned+earn>DAILY_CAP){earn=DAILY_CAP-dy.earned;why=`하루 최대 ${DAILY_CAP}개에 맞춰 ${earn}개만 받았어요`;}
  if(earn>0)dy.got[key]=true;
  dy.earned+=earn;P.wallet+=earn;
  // ── 졸업: 이 학기 모든 단원 ⭐3 ──
  P.grad=P.grad||{};
  const gp=gradProgress(S.group);
  const gradNow=gp.n===gp.total&&!P.grad[S.group];
  if(gradNow)P.grad[S.group]=today();
  store.save(P);
  const m=modeInfo(S.mode);const g=GROUPS[S.group];
  const title=stars===3?'완벽해요!':stars===2?'참 잘했어요!':stars===1?'좋아요!':'다시 도전해 볼까요?';
  $('#resultCard').innerHTML=`<div style="font-size:14px;color:var(--ink-soft);font-weight:700;margin-bottom:8px">${m.icon} ${m.title} · ${g.label}</div>
    ${stars>=2?'<div class="stamp">참<br>잘했어요<small>2026 · 수학 놀이터</small></div>':'<div style="font-size:60px">💪</div>'}
    <h2 class="display">${title}</h2>
    <div class="bigstars">${[1,2,3].map(k=>`<span class="${stars>=k?'':'off'}">⭐</span>`).join('')}</div>
    ${newSt?`<div class="newst">새 스티커를 받았어요!<b>${newSt}</b></div>`:''}
    <div class="walletline">${earn?`⭐ 별 <b>${earn}</b>개 획득! `:''}${parts.length&&earn?`<span class="bonus">${parts.join(' · ')}</span> `:''}${why?`<span class="why">${why}</span> `:''}<br>모은 별 <b>${P.wallet}</b>개 · 오늘 ${dy.earned}/${DAILY_CAP} · 카드놀이 <b>${cardPlays()}</b>판 가능${cardPlays()?' 🎟️':''}</div>
    <div class="gradline">${P.grad[S.group]?`🎓 ${g.sub} 졸업!`:`🎓 100점(⭐3) 단원 <b>${gp.n}</b> / ${gp.total} — 모두 채우면 졸업장!`}</div>
    <div class="stat"><span>점수<b>${score}점</b></span><span>🔥상 문제<b>${S.highOk} / ${highTotal}</b></span><span>최고 기록<b>${p.best}점</b></span></div>
    <div class="row" style="justify-content:center"><button class="btn ghost" onclick="goHome()">홈으로</button><button class="btn blue" onclick="startRound('${S.mode}')">다시 하기</button></div>`;
  if(stars>=2)audio.win();voice.say(title+(newSt?' 새 스티커를 받았어요!':''));
  show('result');
  if(gradNow)setTimeout(()=>showGrad(S.group),900);
}

/* 새 과정 안내 (별 초기화 직후 한 번) */
function showNews(){
  let box=document.createElement('div');box.className='modal';document.body.appendChild(box);
  box.innerHTML=`<div class="modalbox card" style="text-align:center">
    <div style="font-size:52px;line-height:1">✨📚</div>
    <h2 class="display" style="font-size:30px;margin:8px 0 4px">새 수학 놀이터!</h2>
    <p style="font-size:15px;margin:6px 0">이제 <b>1학년 1학기 ~ 4학년 2학기</b> 과정이에요.<br>한 판 10문제: <b>하 1 · 중 5 · 상 4</b></p>
    <div style="text-align:left;background:#FFF8E1;border-radius:12px;padding:10px 14px;font-size:14px;line-height:1.7;margin:8px 0">
      ⭐ 80·90점 → 별 1개<br>⭐⭐ 100점 → 별 2개<br>🔥 상 문제 4개를 모두 맞히면 +1<br>📅 하루 최대 ${DAILY_CAP}개 · 같은 단원은 하루 1번<br>🃏 별 ${CARD_COST}개 = 카드놀이 1판</div>
    <p style="font-size:13px;color:var(--ink-soft);margin:4px 0 10px">모은 별은 0개부터 새로 시작해요. 스티커는 그대로예요.</p>
    <button class="btn purple" style="width:100%" id="newsOk">시작하기</button></div>`;
  $('#newsOk').onclick=()=>{box.remove();P.news=false;store.save(P);if(!P.setupDone){renderSetup(true);P.setupDone=true;store.save(P);}};
}

/* 초기화 */
$('#groupTog').querySelectorAll('button').forEach(b=>b.onclick=()=>setGroup(b.dataset.g));
fixGroups(P);
voice.on=GROUPS[P.group].voice;$('#voiceBtn').classList.toggle('off',!voice.on);
renderHome();
if(P.news)showNews();
else if(!P.setupDone){renderSetup(true);P.setupDone=true;store.save(P);}
