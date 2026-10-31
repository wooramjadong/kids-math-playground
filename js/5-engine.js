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
/* 한 판 20문제 = 하 2(10%) · 중 10(50%) · 상 8(40%) */
const TOTAL=20, LV_COUNT={low:2,mid:10,high:8};
const LV={low:{t:'하',cls:'lv-low'},mid:{t:'중',cls:'lv-mid'},high:{t:'상 🔥',cls:'lv-high'}};
const STAR_RULE='80점 이상 별1 · 100점 별2 · 상 8개 모두 정답 +1';
const nextGroup=g=>ORDER[ORDER.indexOf(g)+1]||null;
const isY=()=>P.group==='11'||P.group==='12';
const modesNow=()=>CUR[P.group].modes;
const eligibleNow=()=>P.group===P.myGroup;
const modeInfo=id=>modesNow().find(m=>m.id===id);
const STICKERS=['🦁','🐼','🦊','🐰','🐨','🦄','🐙','🦖','🐳','🦋','🌈','🍩','🚀','🎸','🏆','🎁','🐯','🐧','🦉','🍭'];
function makePlan(){return ['low','low',...shuffle([...Array(LV_COUNT.mid).fill('mid'),...Array(LV_COUNT.high).fill('high')])];}
function roundStars(correct,highOk,highTotal){const score=correct*5;let s=score>=100?2:score>=80?1:0;if(highTotal&&highOk>=highTotal)s+=1;return s;}

/* ───────── 화면 ───────── */
const SCREENS=['home','play','result'];
function show(id){SCREENS.forEach(s=>$('#'+s).classList.toggle('hidden',s!==id));window.scrollTo({top:0});}
function goHome(){stopTimer();if(window.speechSynthesis)speechSynthesis.cancel();renderHome();show('home');}
function confirmHome(){if(!S.answeredCount||S.answeredCount<2||confirm('지금 그만두면 이번 별은 받지 못해요. 그만둘까요?'))goHome();}

function renderHome(){
 const g=GROUPS[P.group],r=STAGE_SYSTEM.record(P,P.group),mine=eligibleNow(),current=Math.min(12,r.level);
 $('#groupTog').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.g===P.group));
 $('#heroTitle').textContent=g.title;$('#heroDesc').textContent='학기마다 12단계 · 단계마다 연습 1판 + 도전 통과 2회';
 $('#legend').innerHTML='<span class="badge g">'+g.sub+'</span><span class="stage-pill">현재 '+(r.level>12?'12단계 모두 완료':current+' / 12단계')+'</span><span class="lvline">한 판 20문제 = 현재 범위 15 + 앞 단원 응용 5<br>하 2 · 중 10 · 상 8 (KMA 중상 목표 사고력)</span>';
 const dy=daily();$('#totalStars').textContent=P.wallet;renderCard();
 const clear=Object.values(r.steps).filter(x=>x.complete).length;
 $('#eligible').innerHTML=(mine?'<span class="ok">내 학기 · 오늘 별 '+dy.earned+' / '+DAILY_CAP+'</span>':'<span class="warn">다른 학기 연습: 별·진도는 바뀌지 않아요</span>')+'<span class="hint">'+STAR_RULE+' · 같은 단계는 하루 1번만 별</span><span class="hint">단계 완료 '+clear+' / 12 · '+(r.level>12?'학기 완료':'연습 후 도전 2회: 80점 이상, 상 6/8 이상 (12단계는 90점)')+'</span>';
 $('#modes').innerHTML=Array.from({length:12},(_,i)=>{
  const n=i+1,info=STAGE_SYSTEM.meta(P.group,n),st=STAGE_SYSTEM.step(P,P.group,n),locked=mine&&n>r.level;
  const state=st.complete?'완료':locked?'앞 단계를 통과하면 열려요':mine&&n===r.level?STAGE_SYSTEM.phase(P,P.group,n):'진도 없는 복습';
  return '<button class="mode stage-card '+(st.complete?'stage-done':mine&&n===r.level?'stage-current':'')+'" '+(locked?'disabled':'')+' onclick="startStage('+n+')"><span class="stage-number">'+n+'단계</span><span class="t display">'+info.title+'</span><span class="s">'+info.kind+'</span><span class="stage-state">'+state+'</span>'+(st.best?'<span class="best">최고 '+st.best+'점</span>':'')+'</button>';
 }).join('');
 const units=$('#practiceUnits');if(units)units.innerHTML='<summary>단원만 따로 연습하기 (별·진도 없음)</summary><div class="practice-list">'+CUR[P.group].modes.map(m=>'<button class="btn ghost" onclick="startMode(\''+m.id+'\')">'+m.title+'</button>').join('')+'</div>';
 $('#stickers').innerHTML='<span class="lbl">내 스티커판 ('+P.stickers.length+'개)</span>'+(P.stickers.length?P.stickers.map(t=>'<span class="st">'+t+'</span>').join(''):'<span class="empty">문제를 풀고 첫 스티커를 받아 보세요!</span>');
}
function gradProgress(g){const r=STAGE_SYSTEM.record(P,g);return {n:Object.values(r.steps).filter(s=>s.complete).length,total:12};}
function renderSetup(first){
  $('#setup').classList.remove('hidden');$('#setupTitle').textContent=first?'누가 할까요?':'내 학년 바꾸기';
  $('#setupList').innerHTML=ORDER.map(g=>`<button class="level ${g===P.myGroup?'on':''}" data-g="${g}"><div><div class="lt display">${GROUPS[g].label}</div><div class="ls">${GROUPS[g].sub}</div></div><div class="dots">${g===P.myGroup?'✔':''}</div></button>`).join('');
  $('#setupList').querySelectorAll('button').forEach(b=>b.onclick=()=>{P.myGroup=b.dataset.g;P.group=b.dataset.g;store.save(P);$('#setup').classList.add('hidden');voice.on=GROUPS[P.group].voice;$('#voiceBtn').classList.toggle('off',!voice.on);goHome();audio.tap();});
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
function setGroup(g){if(!$('#play').classList.contains('hidden')&&!confirm('학기를 바꾸면 이번 판은 종료돼요. 바꿀까요?'))return;P.group=g;voice.on=GROUPS[g].voice;$('#voiceBtn').classList.toggle('off',!voice.on);store.save(P);goHome();audio.tap();}
function startMode(id){const idx=CUR[P.group].modes.findIndex(m=>m.id===id);if(idx<0)return;startRound(id,{stage:idx+1,unitPractice:true});}
function startStage(n){const r=STAGE_SYSTEM.record(P,P.group);if(eligibleNow()&&n>r.level)return;startRound('stage'+n,{stage:n});}

/* ───────── 라운드 ───────── */
let S={};
function startRound(mode,opts={}){
 stopTimer();const stage=Number(opts.stage)||Number(String(mode).replace('stage',''))||Math.min(12,STAGE_SYSTEM.record(P,P.group).level);
 const unitPractice=!!opts.unitPractice,record=STAGE_SYSTEM.record(P,P.group),info=STAGE_SYSTEM.meta(P.group,stage);
 const plan=STAGE_SYSTEM.plan(P.group,stage,Math.random,unitPractice?mode:null);
 S={group:P.group,mode,stage,unitPractice,official:!unitPractice&&eligibleNow()&&stage===record.level,eligible:!unitPractice&&eligibleNow(),phase:unitPractice?'단원 자유 연습':!eligibleNow()?'다른 학기 연습':stage<record.level?'완료 단계 복습':STAGE_SYSTEM.phase(P,P.group,stage),title:unitPractice?CUR[P.group].modes.find(m=>m.id===mode).title:info.title,
 i:0,total:TOTAL,plan,correct:0,answeredCount:0,combo:0,maxCombo:0,q:null,answered:false,fields:{},active:null,cells:new Set(),seen:new Set(),log:[],highOk:0,reviewCorrect:0,currentCorrect:0,fingerprints:[]};
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
  const m={icon:'',title:q._originTitle||S.title};const lv=LV[q.lv]||LV.mid;
  $('#tagline').innerHTML=`<span class="tag lvchip ${lv.cls}">${lv.t}</span> <span class="tag ${q.hard?'hard':''}">${q._source==='review'?(q._baseline?'기초 개념 응용 복습 · ':'앞 단원 응용 복습 · '):''}${q.tag||m.title}</span><span class="tag stage-origin">${GROUPS[q._originGroup||S.group].label} · ${m.title}</span>`;
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
 const entry=S.plan[S.i];
 try{const raw=STAGE_SYSTEM.generate(entry,S.seen,STAGE_SYSTEM.record(P,S.group).recent);const q=normalize(raw);S.fingerprints.push(q._fingerprint);renderQuestion(q);}
 catch(e){console.error(e);$('#feedback').innerHTML='<div class="feedback no">문제를 준비하지 못했어요. 기록은 유지돼요. <button class="btn" onclick="goHome()">홈으로</button></div>';show('play');}
}
function renderProgress(){
  const p=$('#progress');
  p.innerHTML=Array.from({length:S.total},(_,k)=>`<i class="${S.log[k]===true?'ok':S.log[k]===false?'no':k===S.i?'cur':''}"></i>`).join('');
  $('#combo').textContent=S.combo>=2?`🔥 ${S.combo}콤보`:'';
  const counter=$('#roundCounter');if(counter)counter.textContent=S.stage+'단계 · '+S.phase+' · '+Math.min(S.i+1,S.total)+' / '+S.total+'문제 · '+(S.plan[S.i]?.source==='review'?'앞 단원 응용 복습':'현재 학습 범위');
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
  if(ok){S.correct++;S.combo++;S.maxCombo=Math.max(S.maxCombo,S.combo);audio.ok();if(q.hard)S.highOk++;if(q._source==='review')S.reviewCorrect++;else S.currentCorrect++;}else{S.combo=0;audio.no();}
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
  if(ok&&!q.hard&&q._source!=='review'&&!q._applied)S.autoTimer=setTimeout(advance,isY()?1700:1600);
}
function advance(){clearTimeout(S.autoTimer);if(S.finished||!S.answered)return;S.i++;nextQuestion();}

/* 결과 + 별 규칙 */
function endRound(){
 if(S.finished)return;S.finished=true;stopTimer();const score=S.correct*5,highTotal=8,stars=roundStars(S.correct,S.highOk,highTotal),dy=daily(),key=S.group+':stage'+S.stage;
 const currentlyEligible=S.eligible&&P.myGroup===S.group;
 let earn=stars,why='';
 if(!currentlyEligible){earn=0;why='연습 모드: 별·진도는 바뀌지 않아요.';}
 else if(!stars){why='80점 이상이거나 상 8개를 모두 맞히면 별을 받아요.';}
 else if(dy.got[key]){earn=0;why='이 단계는 오늘 이미 별을 받았어요. 진도 도전은 계속할 수 있어요.';}
 else if(dy.earned>=DAILY_CAP){earn=0;why='오늘 별을 모두 모았어요. 진도는 계속 진행할 수 있어요.';}
 else earn=Math.min(earn,DAILY_CAP-dy.earned);
 if(currentlyEligible){dy.plays[key]=(dy.plays[key]||0)+1;if(earn>0)dy.got[key]=true;dy.earned+=earn;P.wallet+=earn;}
 let sticker='';if(currentlyEligible&&stars){sticker=pick(STICKERS);P.stickers.push(sticker);if(P.stickers.length>80)P.stickers.shift();}
 const out=STAGE_SYSTEM.finish(P,S.group,S.stage,{official:S.official&&currentlyEligible,correct:S.correct,highOk:S.highOk,reviewCorrect:S.reviewCorrect,fingerprints:S.fingerprints,date:today()});
 const step=STAGE_SYSTEM.step(P,S.group,S.stage),info=STAGE_SYSTEM.meta(S.group,S.stage);
 let title=out.semesterClear?'학기 졸업!':out.stageClear?'단계를 통과했어요!':out.training?'연습 완료! 이제 도전해요':out.passed?'도전 통과! 한 번 더 확인해요':S.official?'틀린 유형을 살피고 다시 도전해요':'복습을 마쳤어요';
 let message=out.semesterClear?(out.nextGroup?GROUPS[out.nextGroup].sub+' 1단계로 진급했어요.':'1학년 1학기부터 4학년 2학기까지 모두 마쳤어요!'):out.stageClear?(S.stage+1)+'단계가 열렸어요.':out.training?'서로 다른 문제로 도전 두 번을 통과하면 다음 단계가 열려요.':out.practiceOnly?'이 판은 연습이라 단계 진도에는 반영하지 않아요.':info.passScore+'점 이상 + 상 8문제 중 6개 이상 정답 · 도전 통과 '+step.passes+'/2';
 $('#totalStars').textContent=P.wallet;$('#groupTog').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.g===P.group));
 store.save(P);
 const next=out.semesterClear?(out.nextGroup?'<button class="btn purple" onclick="startStage(1)">다음 학기 1단계</button>':''):out.stageClear?'<button class="btn purple" onclick="startStage('+(S.stage+1)+')">다음 단계</button>':'<button class="btn blue" onclick="'+(S.unitPractice?'startMode(\''+S.mode+'\')':'startStage('+S.stage+')')+'">'+(out.training?'도전 시작':'새 문제로 다시 하기')+'</button>';
 $('#resultCard').innerHTML='<div class="stage-result-kicker">'+GROUPS[S.group].sub+' · '+S.stage+'단계 · '+S.title+'</div><h2 class="display">'+title+'</h2><p>'+message+'</p><div class="stat"><span>점수<b>'+score+'점</b></span><span>현재 범위<b>'+S.currentCorrect+' / 15</b></span><span>응용 복습<b>'+S.reviewCorrect+' / 5</b></span><span>상 문제<b>'+S.highOk+' / 8</b></span></div><div class="walletline">'+(earn?'별 '+earn+'개 획득! ':'')+why+'<br>모은 별 '+P.wallet+'개 · 오늘 '+dy.earned+'/'+DAILY_CAP+'</div>'+(sticker?'<div class="newst">새 스티커 <b>'+sticker+'</b></div>':'')+'<p class="stage-note">계산만 반복하지 않고, 틀린 유형의 풀이를 읽고 새 문제로 확인해요.</p><div class="row" style="justify-content:center"><button class="btn ghost" onclick="goHome()">홈으로</button>'+next+'</div>';
 if(out.progressed||stars>=2)audio.win();voice.say(title);show('result');
}

/* 새 과정 안내 (별 초기화 직후 한 번) */
function showNews(){
 const box=document.createElement('div');box.className='modal';document.body.appendChild(box);
 box.innerHTML='<div class="modalbox card"><h2 class="display">학기마다 12단계 수학 여행</h2><p>한 판 20문제: 현재 범위 15 + 앞 단원 응용 5</p><p>단계마다 연습 1판 후 도전 2회 통과. 기존 별·스티커·카드놀이·단원 기록은 유지해요. 새 단계 기록만 1단계부터 시작해요.</p><button class="btn purple" id="newsOk">시작하기</button></div>';
 $('#newsOk').onclick=()=>{box.remove();P.news=false;store.save(P);if(!P.setupDone){renderSetup(true);P.setupDone=true;store.save(P);}};
}

/* 초기화 */
$('#groupTog').querySelectorAll('button').forEach(b=>b.onclick=()=>setGroup(b.dataset.g));
fixGroups(P);
voice.on=GROUPS[P.group].voice;$('#voiceBtn').classList.toggle('off',!voice.on);
renderHome();
if(P.news)showNews();
else if(!P.setupDone){renderSetup(true);P.setupDone=true;store.save(P);}
