/* ───────── 다른 기기와 연결 (기록 옮기기) ─────────
   서버 없이 동작: 기록 전체를 링크(#sync=…)와 QR 코드로 만들어 다른 기기에서 열면 그대로 복사돼요. */
const SYNC_KEYS=['wallet','cardPlays','myGroup','daily','done','stickers','setupDone','group'];
const b64e=s=>btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const b64d=s=>decodeURIComponent(escape(atob(s.replace(/-/g,'+').replace(/_/g,'/')+'==='.slice((s.length+3)%4))));
function syncPack(){const o={};SYNC_KEYS.forEach(k=>{if(P[k]!==undefined)o[k]=P[k];});o.stickers=(P.stickers||[]).slice(-40);o.t=Date.now();return b64e(JSON.stringify(o));}
function syncLink(){return location.origin+location.pathname+'#sync='+syncPack();}
function syncParse(txt){const m=String(txt||'').trim().match(/#?sync=([A-Za-z0-9_\-]+)/);const code=m?m[1]:String(txt||'').trim();try{const o=JSON.parse(b64d(code));if(typeof o.wallet!=='number')throw 0;return o;}catch(e){return null;}}
function syncApply(o){SYNC_KEYS.forEach(k=>{if(o[k]!==undefined)P[k]=o[k];});if(!GROUPS[P.group])P.group='7';if(!GROUPS[P.myGroup])P.myGroup=P.group;store.save(P);
  voice.on=GROUPS[P.group].voice;$('#voiceBtn').classList.toggle('off',!voice.on);renderHome();audio.win();}

function renderSync(){
  let box=$('#syncbox');
  if(!box){box=document.createElement('div');box.id='syncbox';box.className='modal hidden';document.body.appendChild(box);}
  const link=syncLink();
  box.innerHTML=`<div class="modalbox card">
    <h2 class="display" style="margin:0 0 4px;font-size:30px">💻 다른 기기와 연결</h2>
    <p style="margin:0 0 10px;color:var(--ink-soft);font-size:14px">이 기기의 기록(별 <b>${P.wallet}</b>개 · 스티커 ${P.stickers.length}개 · 오늘 기록)을 다른 기기로 <b>복사</b>해요. 컴퓨터↔폰 번갈아 쓸 땐, 놀기 전에 <b>마지막으로 논 기기</b>에서 보내면 돼요.</p>
    <div class="synctabs"><button class="on" data-t="send">📤 이 기기 기록 보내기</button><button data-t="recv">📥 가져오기</button></div>
    <div id="syncSend">
      <div class="qrwrap"><div id="qr"></div><div class="qrhint">다른 기기 카메라로 QR을 찍으면 바로 열려요</div></div>
      <div class="row" style="justify-content:center;margin-top:10px"><button class="btn blue" id="syncCopy">🔗 링크 복사</button><button class="btn ghost" id="syncShare">📨 공유</button></div>
      <p style="font-size:12px;color:var(--ink-soft);margin:10px 0 0">링크를 카톡 '나에게 보내기'나 메모에 붙여 넣고, 컴퓨터에서 열어도 돼요.</p>
    </div>
    <div id="syncRecv" class="hidden">
      <p style="font-size:14px;margin:0 0 6px">다른 기기에서 복사한 <b>링크</b>를 여기에 붙여 넣으세요.</p>
      <textarea id="syncIn" rows="4" style="width:100%;font-size:13px;border:3px solid var(--line);border-radius:12px;padding:8px;font-family:inherit"></textarea>
      <button class="btn green" id="syncImport" style="width:100%;margin-top:8px">가져오기 (지금 기록은 덮어써요)</button>
    </div>
    <button class="btn ghost" id="syncClose" style="margin-top:12px;width:100%">닫기</button>
  </div>`;
  box.classList.remove('hidden');
  try{new QRCode($('#qr'),{text:link,width:220,height:220,correctLevel:QRCode.CorrectLevel.L});}catch(e){$('#qr').innerHTML='<div style="font-size:13px;color:var(--ink-soft)">QR을 만들 수 없어요. 아래 링크 복사를 이용하세요.</div>';}
  box.querySelectorAll('.synctabs button').forEach(b=>b.onclick=()=>{box.querySelectorAll('.synctabs button').forEach(x=>x.classList.toggle('on',x===b));$('#syncSend').classList.toggle('hidden',b.dataset.t!=='send');$('#syncRecv').classList.toggle('hidden',b.dataset.t!=='recv');});
  $('#syncCopy').onclick=async()=>{try{await navigator.clipboard.writeText(link);$('#syncCopy').textContent='✅ 복사됐어요';}catch(e){prompt('아래 링크를 복사하세요',link);}};
  $('#syncShare').onclick=async()=>{if(navigator.share){try{await navigator.share({title:'수학 놀이터 기록',url:link});}catch(e){}}else{prompt('아래 링크를 복사하세요',link);}};
  $('#syncImport').onclick=()=>{const o=syncParse($('#syncIn').value);if(!o)return alert('링크가 올바르지 않아요. 다른 기기에서 "링크 복사"한 내용을 그대로 붙여 넣어 주세요.');
    if(confirm(`다른 기기의 기록(별 ${o.wallet}개, 스티커 ${(o.stickers||[]).length}개)을 가져올까요?\n지금 이 기기의 기록은 덮어써요.`)){syncApply(o);box.classList.add('hidden');}};
  $('#syncClose').onclick=()=>box.classList.add('hidden');
}
/* 설정 모달에 버튼 추가 */
(function(){const m=$('#setup .modalbox');if(!m)return;const b=document.createElement('button');b.style.cssText='margin-top:12px;width:100%';b.className='btn ghost';b.textContent='🔗 코드 없이 한 번만 옮기기 (QR·링크)';b.onclick=()=>{$('#setup').classList.add('hidden');renderSync();};m.insertBefore(b,$('#setupClose'));})();
/* 링크로 열었을 때 자동 가져오기 */
(function(){const o=syncParse(location.hash);if(!o)return;history.replaceState(null,'',location.pathname);
  $('#setup').classList.add('hidden');
  if(confirm(`다른 기기에서 보낸 기록(별 ${o.wallet}개, 스티커 ${(o.stickers||[]).length}개)을 이 기기로 가져올까요?\n지금 이 기기의 기록은 덮어써요.`)){o.setupDone=true;syncApply(o);}})();
