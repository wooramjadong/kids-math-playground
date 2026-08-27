/* ───────── ☁️ 가족 코드 — 여러 기기에서 이어서 하기 ─────────
   코드 하나를 폰·컴퓨터·태블릿에 입력하면 별·스티커·오늘 기록이 자동으로 같이 움직여요. (api/state.js) */
const CLOUD={api:'api/state',pushTimer:null,pulling:false,status:'',last:0,
  code(){return P.family||'';},
  on(){return !!P.family;},
  pack(){const o={};SYNC_KEYS.forEach(k=>{if(P[k]!==undefined)o[k]=P[k];});o.stickers=(P.stickers||[]).slice(-60);o.t=P.t||Date.now();return o;},
  async pull(force){
    if(!this.on()||this.pulling)return;this.pulling=true;
    try{const r=await fetch(`${this.api}?code=${this.code()}&_=${Date.now()}`,{cache:'no-store'});
      if(r.status===503){this.status='nostore';return;}
      const j=await r.json();this.status='ok';this.last=Date.now();
      const s=j.state;if(!s)return;
      if(force||(typeof s.t==='number'&&s.t>(P.t||0))){this.applyRemote(s);}
    }catch(e){this.status='offline';}finally{this.pulling=false;renderCloudBadge();}
  },
  applyRemote(s){const fam=P.family;SYNC_KEYS.forEach(k=>{if(s[k]!==undefined)P[k]=s[k];});P.t=s.t||Date.now();P.family=fam;
    if(!GROUPS[P.group])P.group='7';if(!GROUPS[P.myGroup])P.myGroup=P.group;
    _storeSaveRaw(P);voice.on=GROUPS[P.group].voice;$('#voiceBtn').classList.toggle('off',!voice.on);
    if(!$('#home').classList.contains('hidden'))renderHome();},
  schedulePush(){if(!this.on())return;clearTimeout(this.pushTimer);this.pushTimer=setTimeout(()=>this.push(),700);},
  async push(){
    if(!this.on())return;
    try{const r=await fetch(`${this.api}?code=${this.code()}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(this.pack())});
      if(r.status===503){this.status='nostore';return;}
      const j=await r.json();this.status='ok';this.last=Date.now();
      if(j.stale&&j.state)this.applyRemote(j.state);
    }catch(e){this.status='offline';}finally{renderCloudBadge();}
  },
};
/* 저장할 때마다 시각을 기록하고 클라우드로 보내기 */
const _storeSaveRaw=store.save.bind(store);
store.save=function(d){d.t=Date.now();_storeSaveRaw(d);CLOUD.schedulePush();};

const CODE_CHARS='ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const newCode=()=>Array.from({length:8},()=>CODE_CHARS[Math.floor(Math.random()*CODE_CHARS.length)]).join('');
const fmtCode=c=>c?c.slice(0,4)+'-'+c.slice(4):'';

function renderCloudBadge(){
  const el=$('#cloudBadge');if(!el)return;
  if(!CLOUD.on()){el.innerHTML='';return;}
  const st=CLOUD.status==='ok'?'☁️':CLOUD.status==='nostore'?'⚠️':CLOUD.status==='offline'?'📴':'☁️';
  el.innerHTML=`<span class="cloudpill" title="가족 코드 ${fmtCode(CLOUD.code())}">${st} ${fmtCode(CLOUD.code())}</span>`;
}
function renderCloudSection(){
  const sec=$('#cloudSec');if(!sec)return;
  if(CLOUD.on()){
    const st=CLOUD.status==='nostore'?'<div class="cloudwarn">⚠️ 서버 저장소가 아직 연결되지 않았어요. 지금은 이 기기에만 저장돼요.</div>':CLOUD.status==='offline'?'<div class="cloudwarn">📴 인터넷에 연결되면 자동으로 이어져요.</div>':'<div class="cloudok">✅ 이 코드를 넣은 모든 기기에서 이어서 해요</div>';
    sec.innerHTML=`<div class="cloudhead">☁️ 가족 코드</div><div class="familycode">${fmtCode(CLOUD.code())}</div>
      <p style="font-size:13px;color:var(--ink-soft);margin:4px 0 8px">다른 기기에서 ⚙️ → "코드 입력"에 이 코드를 넣으면 별·스티커가 그대로 이어져요.</p>${st}
      <div class="row" style="margin-top:8px"><button class="btn ghost" id="cloudCopy" style="flex:1">📋 코드 복사</button><button class="btn ghost" id="cloudOff" style="flex:1">연결 끊기</button></div>`;
    $('#cloudCopy').onclick=async()=>{try{await navigator.clipboard.writeText(fmtCode(CLOUD.code()));$('#cloudCopy').textContent='✅ 복사됐어요';}catch(e){prompt('가족 코드',fmtCode(CLOUD.code()));}};
    $('#cloudOff').onclick=()=>{if(confirm('이 기기를 가족 코드에서 끊을까요? (기록은 이 기기에 남아요)')){P.family='';_storeSaveRaw(P);renderCloudSection();renderCloudBadge();}};
  }else{
    sec.innerHTML=`<div class="cloudhead">☁️ 여러 기기에서 이어서 하기</div>
      <p style="font-size:13px;color:var(--ink-soft);margin:4px 0 10px">가족 코드를 만들면 폰·컴퓨터·태블릿 어디서든 같은 별과 스티커로 이어서 할 수 있어요.</p>
      <button class="btn purple" id="cloudNew" style="width:100%">✨ 새 가족 코드 만들기 (이 기기 기록으로 시작)</button>
      <div style="display:flex;gap:8px;margin-top:8px"><input id="cloudIn" placeholder="코드 입력 (예: K7QM-4XZ2)" style="flex:1;font-size:18px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border:3px solid var(--line);border-radius:12px;padding:10px;font-family:inherit;min-width:0"><button class="btn green" id="cloudJoin">연결</button></div>
      <div id="cloudMsg" style="font-size:13px;margin-top:6px;color:#92400E"></div>`;
    $('#cloudNew').onclick=async()=>{P.family=newCode();P.t=Date.now();_storeSaveRaw(P);$('#cloudNew').textContent='만드는 중…';await CLOUD.push();renderCloudSection();renderCloudBadge();};
    $('#cloudJoin').onclick=async()=>{const code=String($('#cloudIn').value||'').toUpperCase().replace(/[^A-Z0-9]/g,'');const msg=$('#cloudMsg');
      if(code.length<6)return msg.textContent='코드를 다시 확인해 주세요.';msg.textContent='확인 중…';
      try{const r=await fetch(`${CLOUD.api}?code=${code}&_=${Date.now()}`,{cache:'no-store'});
        if(r.status===503)return msg.textContent='서버 저장소가 아직 연결되지 않았어요. (Vercel에서 Upstash Redis 연결 필요)';
        const j=await r.json();
        if(!j.state){if(!confirm('이 코드에는 아직 기록이 없어요. 이 기기의 기록으로 이 코드를 시작할까요?'))return msg.textContent='';P.family=code;P.t=Date.now();_storeSaveRaw(P);await CLOUD.push();}
        else{if(!confirm(`가족 코드 ${fmtCode(code)}의 기록(별 ${j.state.wallet}개, 스티커 ${(j.state.stickers||[]).length}개)으로 이어서 할까요?\n이 기기의 지금 기록은 덮어써요.`))return msg.textContent='';P.family=code;CLOUD.applyRemote(j.state);CLOUD.status='ok';}
        renderCloudSection();renderCloudBadge();renderHome();audio.win();
      }catch(e){msg.textContent='연결할 수 없어요. 인터넷을 확인해 주세요.';}};
  }
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
window.addEventListener('pagehide',()=>{if(CLOUD.on()&&CLOUD.pushTimer){clearTimeout(CLOUD.pushTimer);try{navigator.sendBeacon&&fetch(`${CLOUD.api}?code=${CLOUD.code()}`,{method:'PUT',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify(CLOUD.pack())});}catch(e){}}});
