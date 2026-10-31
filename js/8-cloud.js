/* ───────── ☁️ 가족 코드 — 여러 기기에서 이어서 하기 ─────────
   코드 하나를 폰·컴퓨터·태블릿에 입력하면 별·스티커·오늘 기록이 자동으로 같이 움직여요. (api/state.js)

   [안전장치 2026-10-31] 모은 기록이 줄어드는 덮어쓰기는 하지 않아요.
   - "모은 기록" = 지금까지 모은 별(남은 별 + 카드놀이에 쓴 별) · 카드놀이 횟수 · 스티커 · 단원 기록 · 졸업 · 단계 진도
   - 서버가 비어 있으면 코드를 가진 기기가 자기 기록을 먼저 올려요.
   - 서버 기록이 이 기기보다 적으면 받지 않고, 이 기기 기록을 다시 올려요.
   - 두 기기에 서로 다른 진도가 있으면 합쳐요. (모은 별은 많은 쪽, 카드놀이 사용은 많은 쪽, 스티커·단원 기록은 모두)
   - 이 기기 기록을 바꾸기 전에는 항상 이 기기 안에 백업을 남겨요. (⚙️ → 🛟 백업)
   - 서버(api/state.js)도 같은 규칙으로, 모은 기록이 줄어드는 저장을 거절해요. */

/* 모은 기록 재기 — 서버(api/state.js)와 같은 규칙 */
function cloudProgress(s){
  s=s||{};const n=v=>Number(v)||0;
  let doneN=0,doneBest=0;const d=s.done||{};
  for(const g in d){const u=d[g]||{};for(const k in u){doneN++;doneBest+=n(u[k]&&u[k].best);}}
  let stage=0;const sem=(s.stageProgress&&s.stageProgress.semesters)||{};
  for(const g in sem){const st=(sem[g]&&sem[g].steps)||{};for(const k in st){const x=st[k]||{};stage+=(x.training?1:0)+n(x.passes)+(x.complete?1:0);}}
  return {earned:n(s.wallet)+5*n(s.cardPlays),cards:n(s.cardPlays),stickers:(s.stickers||[]).length,doneN,doneBest,grad:Object.keys(s.grad||{}).length,stage};
}
/* a가 b보다 'ahead'(더 많음) / 'behind'(더 적음) / 'equal' / 'diverged'(서로 다른 진도) */
function cloudCompare(a,b){
  const pa=cloudProgress(a),pb=cloudProgress(b);let more=false,less=false;
  for(const k in pa){if(pa[k]>pb[k])more=true;else if(pa[k]<pb[k])less=true;}
  return more&&less?'diverged':more?'ahead':less?'behind':'equal';
}
const cloudHasProgress=s=>Object.values(cloudProgress(s)).some(v=>v>0);
const cloudClone=o=>o==null?o:JSON.parse(JSON.stringify(o));

/* 두 기록 합치기: 설정은 최근 쪽, 모은 기록은 양쪽 모두 살림 */
function cloudMergeStage(a,b){
  if(!a)return cloudClone(b);if(!b)return cloudClone(a);
  const m=cloudClone(a);m.semesters=m.semesters||{};
  const sc=x=>x?((x.training?1:0)+(Number(x.passes)||0)+(x.complete?1:0)):-1;
  for(const g in (b.semesters||{})){
    const rb=b.semesters[g];let ra=m.semesters[g];
    if(!ra){m.semesters[g]=cloudClone(rb);continue;}
    ra.steps=ra.steps||{};
    for(const k in (rb.steps||{})){
      const sa=ra.steps[k],sb=rb.steps[k];
      if(sc(sb)>sc(sa))ra.steps[k]=cloudClone(sb);
      else if(sa&&sb){sa.best=Math.max(Number(sa.best)||0,Number(sb.best)||0);sa.rounds=Math.max(Number(sa.rounds)||0,Number(sb.rounds)||0);}
    }
    let lv=1;while(lv<=12&&ra.steps[lv]&&ra.steps[lv].complete===true)lv++;ra.level=lv;
    if((rb.recent||[]).length>(ra.recent||[]).length)ra.recent=cloudClone(rb.recent);
  }
  return m;
}
function cloudMerge(L,R){
  const base=(R.t||0)>=(L.t||0)?R:L,other=base===R?L:R;
  const m=cloudClone(base),n=v=>Number(v)||0;
  const cp=Math.max(n(L.cardPlays),n(R.cardPlays));
  const earned=Math.max(cloudProgress(L).earned,cloudProgress(R).earned);
  m.cardPlays=cp;m.wallet=Math.max(0,earned-5*cp);
  // 스티커: 양쪽에 있는 것을 모두 (같은 스티커는 많은 쪽 개수만큼)
  const have={};m.stickers=(base.stickers||[]).slice();m.stickers.forEach(x=>have[x]=(have[x]||0)+1);
  const seen={};(other.stickers||[]).forEach(x=>{seen[x]=(seen[x]||0)+1;if(seen[x]>(have[x]||0)){m.stickers.push(x);have[x]=(have[x]||0)+1;}});
  // 단원 기록: 단원마다 더 좋은 기록
  m.done=m.done||{};const od=other.done||{};
  for(const g in od){m.done[g]=m.done[g]||{};for(const k in od[g]){const a=m.done[g][k],b=od[g][k];
    if(!a||n(b&&b.best)>n(a.best)||(n(b&&b.best)===n(a.best)&&n(b&&b.stars)>n(a.stars)))m.done[g][k]=cloudClone(b);}}
  m.grad=Object.assign({},cloudClone(other.grad)||{},m.grad||{});
  // 오늘 기록: 같은 날이면 많이 받은 쪽 기준으로 합치고, 다른 날이면 최근 날짜
  if(L.daily&&R.daily){
    if(L.daily.d===R.daily.d){const a=L.daily,b=R.daily;const big=n(a.earned)>=n(b.earned)?a:b;
      m.daily=cloudClone(big);m.daily.earned=Math.max(n(a.earned),n(b.earned));
      m.daily.got=Object.assign({},a.got||{},b.got||{});
      const pl={};[a.plays||{},b.plays||{}].forEach(p=>{for(const k in p)pl[k]=Math.max(n(pl[k]),n(p[k]));});m.daily.plays=pl;}
    else m.daily=cloudClone(L.daily.d>R.daily.d?L.daily:R.daily);
  }
  if(L.stageProgress||R.stageProgress)m.stageProgress=cloudMergeStage(base.stageProgress,other.stageProgress);
  m.t=Math.max(Date.now(),n(L.t)+1,n(R.t)+1);
  return m;
}

/* 이 기기 안 백업 (최근 10개) */
const CLOUD_BACKUP_KEY='mathplay-backup-v1';
function cloudBackups(){try{const l=JSON.parse(localStorage.getItem(CLOUD_BACKUP_KEY)||'[]');return Array.isArray(l)?l:[];}catch(e){return [];}}
function cloudBackup(reason,state){
  try{
    const snap=cloudClone(state||CLOUD.pack());if(!cloudHasProgress(snap))return;
    const list=cloudBackups();const sig=JSON.stringify(cloudProgress(snap))+'|'+(snap.myGroup||'');
    if(list.length&&list[list.length-1].sig===sig)return; // 같은 기록은 한 번만
    list.push({at:Date.now(),reason,sig,state:snap});while(list.length>10)list.shift();
    localStorage.setItem(CLOUD_BACKUP_KEY,JSON.stringify(list));
  }catch(e){}
}

const CLOUD={api:'api/state',pushTimer:null,pulling:false,status:'',last:0,remoteT:0,depth:0,note:'',
  code(){return P.family||'';},
  on(){return !!P.family;},
  pack(){const o={};SYNC_KEYS.forEach(k=>{if(P[k]!==undefined)o[k]=cloudClone(P[k]);});o.stickers=(P.stickers||[]).slice();o.t=P.t||Date.now();return o;},
  setNote(t){this.note=t?`${new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})} ${t}`:'';},
  /* 서버 기록 s와 이 기기 기록을 비교해서 안전하게 맞추기 */
  async reconcile(s){
    if(!s)return;this.remoteT=Math.max(this.remoteT,Number(s.t)||0);
    const local=this.pack();const c=cloudCompare(local,s);
    if(c==='behind'){cloudBackup('다른 기기 기록을 받기 전',local);this.applyRemote(s);this.setNote('다른 기기의 새 기록을 받았어요');return c;}
    if(c==='ahead'){cloudBackup('서버에 있던 더 적은 기록',s);this.setNote('서버 기록이 더 적어서 이 기기 기록을 다시 올렸어요');await this.push(true);return c;}
    if(c==='diverged'){cloudBackup('두 기록을 합치기 전',local);cloudBackup('합치기 전 서버 기록',s);
      this.applyRemote(cloudMerge(local,s));this.setNote('두 기기 기록을 합쳤어요');await this.push(true);return c;}
    // 모은 기록이 같으면 설정(학년 등)만 최근 것으로
    if((Number(s.t)||0)>(P.t||0))this.applyRemote(s);else if((Number(s.t)||0)<(P.t||0))this.schedulePush();
    return c;
  },
  async pull(){
    if(!this.on()||this.pulling)return;this.pulling=true;const code=this.code();
    try{const r=await fetch(`${this.api}?code=${code}&_=${Date.now()}`,{cache:'no-store'});
      if(r.status===503){this.status='nostore';return;}
      const j=await r.json();this.status='ok';this.last=Date.now();
      if(this.code()!==code)return; // 확인하는 사이에 연결을 끊거나 코드를 바꾼 경우
      if(!j.state){await this.push(true);return;} // 서버가 비어 있으면 이 기기 기록을 먼저 올려요
      await this.reconcile(j.state);
    }catch(e){this.status='offline';}finally{this.pulling=false;renderCloudBadge();}
  },
  applyRemote(s){const fam=P.family;SYNC_KEYS.forEach(k=>{if(s[k]!==undefined)P[k]=cloudClone(s[k]);});P.t=s.t||Date.now();P.family=fam;
    fixGroups(P);const stale=s.resetV!==RESET_V;if(stale){P.resetV=null;applyReset(P);P.news=false;}
    if(stale)store.save(P);else _storeSaveRaw(P);voice.on=GROUPS[P.group].voice;$('#voiceBtn').classList.toggle('off',!voice.on);
    if(!$('#home').classList.contains('hidden'))renderHome();},
  schedulePush(){if(!this.on())return;clearTimeout(this.pushTimer);this.pushTimer=setTimeout(()=>this.push(),700);},
  /* bump: 서버보다 늦은 시각으로 올리기 (서버에 더 적은 기록이 있을 때) */
  async push(bump){
    if(!this.on())return;
    if(bump){P.t=Math.max(Date.now(),this.remoteT+1,P.t||0);_storeSaveRaw(P);}
    const code=this.code();
    try{const r=await fetch(`${this.api}?code=${code}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(this.pack())});
      if(r.status===503){this.status='nostore';return;}
      const j=await r.json();this.status='ok';this.last=Date.now();
      if(this.code()!==code)return; // 올리는 사이에 연결을 끊거나 코드를 바꾼 경우
      if(j.ok)this.remoteT=Math.max(this.remoteT,P.t||0);
      if(j.stale&&j.state&&this.depth<2){this.depth++;try{await this.reconcile(j.state);}finally{this.depth--;}}
    }catch(e){this.status='offline';}finally{renderCloudBadge();}
  },
};
/* 저장할 때마다 시각을 기록하고 클라우드로 보내기 */
const _storeSaveRaw=store.save.bind(store);
store.save=function(d){d.t=Date.now();_storeSaveRaw(d);CLOUD.schedulePush();};

const CODE_CHARS='ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const newCode=()=>Array.from({length:8},()=>CODE_CHARS[Math.floor(Math.random()*CODE_CHARS.length)]).join('');
const fmtCode=c=>c?c.slice(0,4)+'-'+c.slice(4):'';
const cloudDesc=x=>`별 ${Number(x&&x.wallet)||0}개 · 스티커 ${((x&&x.stickers)||[]).length}개 · 카드놀이 ${Number(x&&x.cardPlays)||0}판`;
const cloudTime=t=>{const d=new Date(t);return `${d.getMonth()+1}/${d.getDate()} ${d.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})}`;};

function renderCloudBadge(){
  const el=$('#cloudBadge');if(!el)return;
  if(!CLOUD.on()){el.innerHTML='';return;}
  const st=CLOUD.status==='ok'?'☁️':CLOUD.status==='nostore'?'⚠️':CLOUD.status==='offline'?'📴':'☁️';
  el.innerHTML=`<span class="cloudpill" title="가족 코드 ${fmtCode(CLOUD.code())}">${st} ${fmtCode(CLOUD.code())}</span>`;
}
/* 🛟 백업에서 되살리기: 지금 기록과 합쳐서 되살려요 (모은 기록이 줄어들지 않아요) */
function cloudBackupHtml(){
  const list=cloudBackups();if(!list.length)return '';
  const rows=list.map((b,i)=>({b,i})).reverse().map(({b,i})=>`<div class="row" style="align-items:center;gap:8px;margin-top:6px;font-size:13px">
      <div style="flex:1;min-width:0">${cloudTime(b.at)} · ${cloudDesc(b.state)}<br><span style="color:var(--ink-soft);font-size:12px">${b.reason||''}</span></div>
      <button class="btn ghost" data-bak="${i}" style="padding:6px 10px;font-size:13px">되살리기</button></div>`).join('');
  return `<details style="margin-top:10px"><summary style="cursor:pointer;font-size:13px;color:var(--ink-soft)">🛟 이 기기 백업 (${list.length}개)</summary>
    <p style="font-size:12px;color:var(--ink-soft);margin:6px 0 0">기록이 바뀌기 전 모습이에요. 되살리면 지금 기록과 합쳐져서, 모은 별·스티커는 줄어들지 않아요.</p>${rows}</details>`;
}
function cloudRestore(i){
  const b=cloudBackups()[i];if(!b)return;
  const cur=CLOUD.pack();const c=cloudCompare(b.state,cur);
  if(c==='behind'||c==='equal')return alert('지금 기록이 이미 이 백업보다 많거나 같아요. 되살릴 것이 없어요.');
  if(!confirm(`${cloudTime(b.at)} 백업을 되살릴까요?\n\n백업: ${cloudDesc(b.state)}\n지금: ${cloudDesc(cur)}\n\n지금 기록과 합쳐서, 모은 별·스티커는 줄어들지 않아요.`))return;
  cloudBackup('되살리기 전',cur);
  const m=c==='ahead'?Object.assign(cloudClone(b.state),{t:Math.max(Date.now(),(cur.t||0)+1)}):cloudMerge(cur,b.state);
  ['myGroup','group','setupDone','resetV'].forEach(k=>{if(cur[k]!==undefined)m[k]=cur[k];}); // 학년 설정은 지금 것 유지
  CLOUD.applyRemote(m);if(CLOUD.on())CLOUD.push(true);
  renderHome();renderCloudSection();audio.win();
}
function renderCloudSection(){
  const sec=$('#cloudSec');if(!sec)return;
  if(CLOUD.on()){
    const st=CLOUD.status==='nostore'?'<div class="cloudwarn">⚠️ 서버 저장소가 아직 연결되지 않았어요. 지금은 이 기기에만 저장돼요.</div>':CLOUD.status==='offline'?'<div class="cloudwarn">📴 인터넷에 연결되면 자동으로 이어져요.</div>':'<div class="cloudok">✅ 이 코드를 넣은 모든 기기에서 이어서 해요</div>';
    sec.innerHTML=`<div class="cloudhead">☁️ 가족 코드</div><div class="familycode">${fmtCode(CLOUD.code())}</div>
      <p style="font-size:13px;color:var(--ink-soft);margin:4px 0 8px">다른 기기에서 ⚙️ → "코드 입력"에 이 코드를 넣으면 별·스티커가 그대로 이어져요.</p>${st}
      ${CLOUD.note?`<div style="font-size:12px;color:var(--ink-soft);margin-top:6px">🔄 ${CLOUD.note}</div>`:''}
      <div class="row" style="margin-top:8px"><button class="btn ghost" id="cloudCopy" style="flex:1">📋 코드 복사</button><button class="btn ghost" id="cloudOff" style="flex:1">연결 끊기</button></div>${cloudBackupHtml()}`;
    $('#cloudCopy').onclick=async()=>{try{await navigator.clipboard.writeText(fmtCode(CLOUD.code()));$('#cloudCopy').textContent='✅ 복사됐어요';}catch(e){prompt('가족 코드',fmtCode(CLOUD.code()));}};
    $('#cloudOff').onclick=()=>{if(confirm('이 기기를 가족 코드에서 끊을까요? (기록은 이 기기에 남아요)')){P.family='';_storeSaveRaw(P);renderCloudSection();renderCloudBadge();}};
  }else{
    sec.innerHTML=`<div class="cloudhead">☁️ 여러 기기에서 이어서 하기</div>
      <p style="font-size:13px;color:var(--ink-soft);margin:4px 0 10px">가족 코드를 만들면 폰·컴퓨터·태블릿 어디서든 같은 별과 스티커로 이어서 할 수 있어요.<br><b>기록이 있는 기기</b>에서 코드를 만들고, 다른 기기에서 그 코드를 넣어 주세요.</p>
      <button class="btn purple" id="cloudNew" style="width:100%">✨ 새 가족 코드 만들기 (이 기기 기록으로 시작)</button>
      <div style="display:flex;gap:8px;margin-top:8px"><input id="cloudIn" placeholder="코드 입력 (예: K7QM-4XZ2)" style="flex:1;font-size:18px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border:3px solid var(--line);border-radius:12px;padding:10px;font-family:inherit;min-width:0"><button class="btn green" id="cloudJoin">연결</button></div>
      <div id="cloudMsg" style="font-size:13px;margin-top:6px;color:#92400E"></div>${cloudBackupHtml()}`;
    $('#cloudNew').onclick=async()=>{P.family=newCode();CLOUD.remoteT=0;$('#cloudNew').textContent='만드는 중…';await CLOUD.push(true);renderCloudSection();renderCloudBadge();};
    $('#cloudJoin').onclick=async()=>{const code=String($('#cloudIn').value||'').toUpperCase().replace(/[^A-Z0-9]/g,'');const msg=$('#cloudMsg');
      if(code.length<6)return msg.textContent='코드를 다시 확인해 주세요.';msg.textContent='확인 중…';
      try{const r=await fetch(`${CLOUD.api}?code=${code}&_=${Date.now()}`,{cache:'no-store'});
        if(r.status===503)return msg.textContent='서버 저장소가 아직 연결되지 않았어요. (Vercel에서 Upstash Redis 연결 필요)';
        const j=await r.json();const local=CLOUD.pack();
        if(!j.state){
          if(!confirm(`이 코드에는 아직 서버에 올라간 기록이 없어요.\n이 기기 기록(${cloudDesc(local)})으로 시작할까요?\n\n※ 다른 기기에 이미 기록이 있다면 '취소'를 누르고, 그 기기에서 먼저 수학 놀이터를 열어 주세요. 그 기기 기록이 자동으로 올라가요.`))return msg.textContent='';
          P.family=code;CLOUD.remoteT=0;await CLOUD.push(true);
        }else{
          const s=j.state;const c=cloudCompare(local,s);
          const head=c==='ahead'?'이 기기 기록이 서버보다 더 많아요. 이 기기 기록을 올려서 이어갈까요?'
            :c==='diverged'?'두 기록이 서로 달라요. 두 기록을 합쳐서 이어갈까요?\n(모은 별·스티커는 줄어들지 않아요)'
            :`가족 코드 ${fmtCode(code)}의 기록으로 이어서 할까요?`;
          if(!confirm(`${head}\n\n서버: ${cloudDesc(s)}\n이 기기: ${cloudDesc(local)}\n\n바뀌기 전 기록은 이 기기에 백업해 둬요.`))return msg.textContent='';
          P.family=code;CLOUD.remoteT=0;await CLOUD.reconcile(s);
        }
        CLOUD.status='ok';renderCloudSection();renderCloudBadge();renderHome();audio.win();
      }catch(e){msg.textContent='연결할 수 없어요. 인터넷을 확인해 주세요.';}};
  }
  sec.querySelectorAll('[data-bak]').forEach(b=>b.onclick=()=>cloudRestore(Number(b.dataset.bak)));
}
/* 설정 모달에 섹션 추가 + 헤더 배지 */
(function(){const m=$('#setup .modalbox');if(!m)return;const sec=document.createElement('div');sec.id='cloudSec';sec.className='cloudsec';m.insertBefore(sec,m.querySelector('.btn.ghost')||$('#setupClose'));
  const badge=document.createElement('span');badge.id='cloudBadge';$('#gearBtn').before(badge);
  const _rs=renderSetup;renderSetup=function(first){_rs(first);renderCloudSection();};
  renderCloudBadge();})();
/* 켤 때·화면으로 돌아올 때·주기적으로 최신 기록 가져오기 */
CLOUD.pull();
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')CLOUD.pull();});
window.addEventListener('focus',()=>CLOUD.pull());
setInterval(()=>{if(document.visibilityState==='visible')CLOUD.pull();},45000);
window.addEventListener('pagehide',()=>{if(CLOUD.on()&&CLOUD.pushTimer){clearTimeout(CLOUD.pushTimer);try{fetch(`${CLOUD.api}?code=${CLOUD.code()}`,{method:'PUT',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify(CLOUD.pack())});}catch(e){}}});
