/* ───────── 👨 아빠 모드 [2026-11-01] ─────────
   ⚙️ 설정 → "👨 아빠 모드" → 비밀번호(처음 0000) → 가족 별(시원+나은) 충전 · 비밀번호 바꾸기
   - 비밀번호는 그대로 저장하지 않고 해시(SHA-256 + 소금값)만 저장해요. 가족 코드 기본 칸에 함께 저장돼서 모든 기기에 같이 적용돼요.
   - 충전한 별은 별 장부의 'dad:<기기>' 칸에 더해요(아이 하루 상한과 무관, 여러 기기에서 동시에 해도 모두 더해짐).
   - 5번 틀리면 이 기기에서 1분 동안 잠겨요. */
const DAD_LOCAL='mathplay-dadpin',DAD_TRIES='mathplay-dad-tries',DAD_DEFAULT='0000';
async function dadHash(pin,salt){
  const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(salt)+':'+String(pin)));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
const dadValid=r=>!!(r&&typeof r==='object'&&typeof r.h==='string'&&typeof r.s==='string');
/* 가장 최근에 정한 비밀번호 기록 (이 기기 기록 · 가족 기본 칸에서 받아 둔 것 · 이 기기 저장 중 최신) */
function dadPinRec(){
  let local=null;try{local=JSON.parse(localStorage.getItem(DAD_LOCAL)||'null');}catch(e){}
  const bank=typeof STAR!=='undefined'&&STAR.shared()?STAR.get().dadPin:null;
  return [P.dadPin,bank,local].filter(dadValid).sort((a,b)=>(Number(b.t)||0)-(Number(a.t)||0))[0]||null;
}
async function dadCheck(pin){const r=dadPinRec();if(!r)return String(pin)===DAD_DEFAULT;return (await dadHash(pin,r.s))===r.h;}
async function dadSetPin(pin){
  pin=String(pin);if(!/^\d{4,8}$/.test(pin))throw new Error('숫자 4~8자리로 정해 주세요.');
  const s=Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
  const rec={h:await dadHash(pin,s),s,t:Date.now()};
  try{localStorage.setItem(DAD_LOCAL,JSON.stringify(rec));}catch(e){}
  if(typeof STAR!=='undefined'&&STAR.shared()){const b=STAR.get();b.dadPin=rec;b.pending=true;STAR.put(b);await STAR.sync();}  // 나은 기기 → 가족 기본 칸으로
  else{P.dadPin=rec;store.save(P);}                                                                                            // 시원 기기(기본 칸) → 기록과 함께 동기화
  return rec;
}
/* 가족 별 충전 */
function dadCharge(n){
  n=Math.max(0,Math.min(1000,Math.trunc(Number(n))||0));if(!n)return 0;
  const id='dad:'+cloudDeviceId();
  if(typeof STAR!=='undefined'&&STAR.shared()){const b=STAR.get();const d=b.ledger.dev[id]||(b.ledger.dev[id]={e:0,c:0});d.e=ledgerN(d.e)+n;b.pending=true;STAR.put(b);STAR.sync();}
  else{const L=ledgerOf(P);P.ledger=L;const d=L.dev[id]||(L.dev[id]={e:0,c:0});d.e=ledgerN(d.e)+n;ledgerApply(P);store.save(P);}
  return n;
}
/* 틀린 횟수 잠금 */
function dadLockLeft(){try{const t=JSON.parse(localStorage.getItem(DAD_TRIES)||'{}');return Math.max(0,(Number(t.until)||0)-Date.now());}catch(e){return 0;}}
function dadWrong(){try{const t=JSON.parse(localStorage.getItem(DAD_TRIES)||'{}');t.n=(Number(t.n)||0)+1;if(t.n>=5){t.n=0;t.until=Date.now()+60000;}localStorage.setItem(DAD_TRIES,JSON.stringify(t));}catch(e){}}
function dadRight(){try{localStorage.removeItem(DAD_TRIES);}catch(e){}}

/* 화면 */
function openDadMode(){
  const box=document.createElement('div');box.className='modal';box.id='dadModal';document.body.appendChild(box);
  const close=()=>{box.remove();if(typeof renderHome==='function')renderHome();};
  const lockView=()=>{
    box.innerHTML=`<div class="modalbox card dadbox"><h2 class="display" style="margin:0 0 6px">👨 아빠 모드</h2>
      <p class="dadhint">비밀번호를 넣어 주세요.</p>
      <input id="dadPinIn" class="dadinput" type="password" inputmode="numeric" autocomplete="off" maxlength="8" placeholder="••••">
      <div id="dadMsg" class="dadmsg"></div>
      <div class="row" style="gap:8px;margin-top:10px"><button class="btn ghost" id="dadCancel" style="flex:1">닫기</button><button class="btn purple" id="dadEnter" style="flex:1">들어가기</button></div></div>`;
    const inp=box.querySelector('#dadPinIn'),msg=box.querySelector('#dadMsg');
    const go=async()=>{
      const left=dadLockLeft();if(left)return msg.textContent=`여러 번 틀려서 잠겼어요. ${Math.ceil(left/1000)}초 뒤에 다시 해 주세요.`;
      if(await dadCheck(inp.value)){dadRight();openView();}else{dadWrong();inp.value='';msg.textContent=dadLockLeft()?'5번 틀려서 1분 동안 잠겼어요.':'비밀번호가 달라요.';}
    };
    box.querySelector('#dadEnter').onclick=go;inp.onkeydown=e=>{if(e.key==='Enter')go();};
    box.querySelector('#dadCancel').onclick=close;setTimeout(()=>inp.focus(),50);
  };
  const openView=()=>{
    const stars=()=>typeof famStars==='function'?famStars():(Number(P.wallet)||0);
    box.innerHTML=`<div class="modalbox card dadbox"><h2 class="display" style="margin:0 0 6px">👨 아빠 모드</h2>
      <div class="dadstars">⭐ 가족 별(시원+나은) <b id="dadNow">${stars()}</b>개</div>
      <div class="dadsec"><div class="dadhead">별 충전</div>
        <div class="dadquick">${[1,3,5,10].map(n=>`<button class="btn green" data-add="${n}">+${n}</button>`).join('')}</div>
        <div class="row" style="gap:8px;margin-top:8px"><input id="dadAmt" class="dadinput" type="number" inputmode="numeric" min="1" max="1000" placeholder="직접 입력 (개)" style="flex:1"><button class="btn purple" id="dadAdd">충전</button></div>
        <div id="dadAddMsg" class="dadmsg"></div></div>
      <div class="dadsec"><div class="dadhead">비밀번호 바꾸기</div>
        <input id="dadNew1" class="dadinput" type="password" inputmode="numeric" maxlength="8" autocomplete="off" placeholder="새 비밀번호 (숫자 4~8자리)">
        <input id="dadNew2" class="dadinput" type="password" inputmode="numeric" maxlength="8" autocomplete="off" placeholder="한 번 더" style="margin-top:6px">
        <button class="btn blue" id="dadSet" style="width:100%;margin-top:8px">비밀번호 바꾸기</button>
        <div id="dadSetMsg" class="dadmsg"></div></div>
      <button class="btn ghost" id="dadClose" style="width:100%;margin-top:12px">아빠 모드 끝내기</button></div>`;
    const now=box.querySelector('#dadNow'),amsg=box.querySelector('#dadAddMsg');
    const charge=n=>{
      n=Math.trunc(Number(n))||0;if(n<1||n>1000)return amsg.textContent='1~1000개 사이로 넣어 주세요.';
      const before=stars();if(!confirm(`가족 별을 ${n}개 충전할까요?\n지금 ${before}개 → ${before+n}개`))return;
      dadCharge(n);now.textContent=stars();amsg.textContent=`⭐ ${n}개 충전했어요!`;if(typeof audio!=='undefined')audio.win();
      setTimeout(()=>{now.textContent=stars();},1500);
    };
    box.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>charge(b.dataset.add));
    box.querySelector('#dadAdd').onclick=()=>charge(box.querySelector('#dadAmt').value);
    box.querySelector('#dadSet').onclick=async()=>{
      const a=box.querySelector('#dadNew1').value,b2=box.querySelector('#dadNew2').value,m=box.querySelector('#dadSetMsg');
      if(!/^\d{4,8}$/.test(a))return m.textContent='숫자 4~8자리로 정해 주세요.';
      if(a!==b2)return m.textContent='두 번 넣은 비밀번호가 달라요.';
      try{await dadSetPin(a);m.textContent='✅ 비밀번호를 바꿨어요. 다른 기기에도 같이 적용돼요.';box.querySelector('#dadNew1').value='';box.querySelector('#dadNew2').value='';}
      catch(e){m.textContent=e.message||'바꾸지 못했어요.';}
    };
    box.querySelector('#dadClose').onclick=close;
  };
  lockView();
}
/* ⚙️ 설정 창에 "아빠 모드" 버튼 — 아이 선택 바로 아래(휴대폰에서도 내리지 않고 보이게) [2026-11-01 고침] */
function addDadButton(){
  const m=document.querySelector('#setup .modalbox');if(!m||document.getElementById('dadOpen'))return;
  const b=document.createElement('button');b.id='dadOpen';b.className='btn ghost dadopen';b.textContent='👨 아빠 모드 (별 충전)';
  b.onclick=()=>{document.getElementById('setup').classList.add('hidden');openDadMode();};
  const list=document.getElementById('setupList');
  if(list&&list.parentNode===m)m.insertBefore(b,list.nextSibling);else m.insertBefore(b,document.getElementById('setupClose')||null);
}
(function(){
  try{
    if(typeof renderSetup!=='function'||typeof document==='undefined'||!document.getElementById||!document.getElementById('setup'))return;
    const _rsDad=renderSetup;
    renderSetup=function(first){_rsDad(first);addDadButton();};
    addDadButton(); // 처음 여는 기기의 "누가 할까요?" 창에도 (이 파일보다 먼저 열린 경우)
  }catch(e){}
})();
