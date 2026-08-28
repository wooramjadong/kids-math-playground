/* ───────── ☁️ 구글 클라우드 목소리 ─────────
   서버(api/tts.js)를 통해 모든 기기·브라우저에서 똑같은 고품질 한국어 목소리를 들려줘요.
   서버가 없거나 인터넷이 느리면 자동으로 기기 목소리로 돌아가요. */
const CT_KEY='mathplay-cloudtts-v1';
const CT_VOICES=[
  {id:'ko-KR-Chirp3-HD-Leda',label:'루나 ✨ (여성 · 최고급)'},
  {id:'ko-KR-Chirp3-HD-Kore',label:'소라 ✨ (여성 · 최고급)'},
  {id:'ko-KR-Chirp3-HD-Charon',label:'큰곰 ✨ (남성 · 최고급)'},
  {id:'ko-KR-Neural2-A',label:'하늘 (여성)'},
  {id:'ko-KR-Neural2-B',label:'구름 (여성)'},
  {id:'ko-KR-Neural2-C',label:'바다 (남성)'},
];
const CTTS={sel:localStorage.getItem(CT_KEY)||'ko-KR-Neural2-A',fail:0,keyOk:null,cache:new Map(),audio:null,
  on(){return this.sel!=='off'&&this.fail<3;},
  save(v){this.sel=v;this.fail=0;localStorage.setItem(CT_KEY,v);},
  stop(){if(this.audio){try{this.audio.pause();}catch(e){}this.audio=null;}},
  async play(txt,rate){
    const key=this.sel+'|'+rate+'|'+txt;
    let url=this.cache.get(key);
    if(!url){
      const r=await fetch(`api/tts?v=${this.sel}&r=${rate}&t=${encodeURIComponent(txt)}`);
      if(r.status===503){this.keyOk=false;throw 'no_key';}
      if(!r.ok)throw 'err';
      const b=await r.blob();if(!/audio/.test(b.type))throw 'type';
      url=URL.createObjectURL(b);this.cache.set(key,url);
      if(this.cache.size>120){const k0=this.cache.keys().next().value;URL.revokeObjectURL(this.cache.get(k0));this.cache.delete(k0);}
    }
    this.keyOk=true;this.fail=0;
    const a=new Audio(url);this.audio=a;await a.play();
  },
};
/* voice.say 확장: 클라우드 우선, 실패하면 기기 목소리 */
const _deviceSay=voice.say.bind(voice);
voice.say=function(t,opt={}){
  if(!this.on||!t)return;
  const txt=String(t).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  if(!txt)return;
  if(!CTTS.on())return _deviceSay(txt,opt);
  CTTS.stop();if('speechSynthesis'in window)try{speechSynthesis.cancel();}catch(e){}
  CTTS.play(txt,opt.rate||0.95).catch(err=>{
    if(err!=='no_key')CTTS.fail++;
    _deviceSay(txt,opt);
  });
};
/* ⚙️ 목소리 섹션에 클라우드 선택 추가 */
function renderCloudTTS(){
  const sec=$('#voiceSec');if(!sec||$('#ctRow'))return;
  const opts=[`<option value="off" ${CTTS.sel==='off'?'selected':''}>사용 안 함 — 아래 기기 목소리 사용</option>`]
    .concat(CT_VOICES.map(v=>`<option value="${v.id}" ${v.id===CTTS.sel?'selected':''}>${v.label}</option>`)).join('');
  const row=document.createElement('div');row.id='ctRow';
  row.innerHTML=`<div style="font-weight:700;font-size:14px;color:#92400E;margin-top:12px;border-top:2px dashed #FCD34D;padding-top:10px">☁️ 구글 클라우드 목소리 <span style="font-weight:400;font-size:12px">— 어느 기기에서나 같은 목소리</span></div>
    <div style="display:flex;gap:8px;margin-top:6px">
      <select id="ctSel" style="flex:1;font-size:14px;font-weight:700;border:3px solid var(--line);border-radius:12px;padding:10px;font-family:inherit;background:#fff;min-width:0">${opts}</select>
      <button class="btn green" id="ctTry" style="padding:10px 16px;font-size:15px">▶ 들어보기</button>
    </div>
    <div id="ctMsg" style="font-size:12px;color:var(--ink-soft);margin-top:6px"></div>`;
  sec.appendChild(row);
  const msg=()=>$('#ctMsg');
  $('#ctSel').onchange=()=>{CTTS.save($('#ctSel').value);msg().textContent=CTTS.sel==='off'?'기기 목소리를 사용해요.':'';
    if(CTTS.sel!=='off'){const was=voice.on;voice.on=true;voice.say('안녕! 이 목소리로 바꿨어요.');voice.on=was;}};
  $('#ctTry').onclick=async()=>{CTTS.save($('#ctSel').value);
    if(CTTS.sel==='off'){msg().textContent='기기 목소리를 사용해요. 위의 ▶ 들어보기로 확인하세요.';return;}
    msg().textContent='불러오는 중…';
    try{await CTTS.play(pick(['안녕! 나랑 같이 수학 놀이 하자!','참 잘했어요! 오늘도 별을 모아 볼까요?','다섯 더하기 셋은 얼마일까요?']),0.95);msg().textContent='✅ 이 목소리로 문제를 읽어 줘요.';}
    catch(e){msg().textContent=e==='no_key'?'⚠️ 서버에 키가 아직 없어요. Vercel 환경변수 GOOGLE_TTS_KEY를 확인하고 Redeploy 해 주세요.':'⚠️ 이 목소리를 불러오지 못했어요. 다른 목소리를 골라 보세요.';}};
}
(function(){const _rvs=renderVoiceSec;renderVoiceSec=function(){_rvs();renderCloudTTS();};if($('#voiceSec'))renderCloudTTS();})();
