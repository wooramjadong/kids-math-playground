/* ───────── 🔊 친근한 목소리 고르기 ─────────
   기기에 설치된 한국어 음성 중 가장 자연스러운 것(신경망·온라인 음성)을 자동으로 고르고,
   ⚙️ 설정에서 직접 들어보고 바꿀 수도 있어요. 별도 비용·API 키 없이 동작해요. */
const VOICE_KEY='mathplay-voice-v1';
const VOX={list:[],chosen:null,
  refresh(){if(!('speechSynthesis'in window))return;
    this.list=speechSynthesis.getVoices().filter(v=>/^ko([-_]|$)/i.test(v.lang)||/ko[-_]?KR/i.test(v.lang));
    const saved=localStorage.getItem(VOICE_KEY);
    this.chosen=(saved&&this.list.some(v=>v.name===saved))?saved:this.best();},
  score(v){const n=v.name.toLowerCase();
    if(/natural|neural/.test(n))return 6;          // Edge 신경망 음성 (가장 자연스러움)
    if(/yuna|유나/.test(n))return 5;               // 아이폰·아이패드·맥
    if(/google/.test(n))return 4;                  // 크롬·안드로이드
    if(/sunhi|injoon|heami|선히|인준|해미/.test(n))return 3; // 윈도우
    return 1;},
  best(){const s=this.list.slice().sort((a,b)=>this.score(b)-this.score(a));return s[0]?s[0].name:null;},
  get(){return this.list.find(v=>v.name===this.chosen)||null;},
  label(v){let n=v.name.replace(/Microsoft /,'').replace(/Online \(Natural\)/,'').replace(/[-–] Korean.*$/,'').replace(/\(Korea\)/,'').trim();
    if(/^google/i.test(v.name))n='구글 음성';
    const s=this.score(v);return n+(s>=6?' ✨ 자연스러움':s>=4?' 👍 좋음':'');},
};
if('speechSynthesis'in window){VOX.refresh();speechSynthesis.onvoiceschanged=()=>{VOX.refresh();if($('#voiceSec'))renderVoiceSec();};}

/* voice.say 교체: 고른 목소리로 자연스럽게
   ※ pitch를 바꾸면 크롬 등 일부 음성에서 기계음/찌그러짐이 생겨서 원래 톤(1.0) 그대로 씁니다. */
let _sayTimer=null;
voice.say=function(t,opt={}){
  if(!this.on||!('speechSynthesis'in window)||!t)return;
  try{
    speechSynthesis.cancel();
    clearTimeout(_sayTimer);
    const u=new SpeechSynthesisUtterance(String(t).replace(/<[^>]+>/g,' '));
    u.lang='ko-KR';
    const v=VOX.get();if(v)u.voice=v;
    u.rate=opt.rate||0.95;   // 살짝 천천히
    u.pitch=1;               // 음정 변형 없음 (변형 시 일부 음성이 기계음처럼 들림)
    u.volume=1;
    // 크롬은 cancel 직후 바로 speak하면 소리가 겹치거나 깨질 수 있어 잠깐 쉬고 말해요
    _sayTimer=setTimeout(()=>{try{speechSynthesis.speak(u);}catch(e){}},60);
  }catch(e){}
};

function renderVoiceSec(){
  const sec=$('#voiceSec');if(!sec)return;
  if(!('speechSynthesis'in window)){sec.innerHTML='<div class="voicehead">🔊 목소리</div><p style="font-size:13px;color:var(--ink-soft);margin:4px 0 0">이 브라우저는 읽어주기를 지원하지 않아요.</p>';return;}
  if(!VOX.list.length){sec.innerHTML='<div class="voicehead">🔊 목소리 고르기</div><p style="font-size:13px;color:var(--ink-soft);margin:4px 0 0">한국어 음성을 찾는 중이에요… 잠시 뒤 다시 열어 보세요.</p>';return;}
  const opts=VOX.list.slice().sort((a,b)=>VOX.score(b)-VOX.score(a))
    .map(v=>`<option value="${v.name.replace(/"/g,'&quot;')}" ${v.name===VOX.chosen?'selected':''}>${VOX.label(v)}</option>`).join('');
  sec.innerHTML=`<div class="voicehead">🔊 목소리 고르기</div>
    <div style="display:flex;gap:8px;margin-top:8px">
      <select id="voxSel" style="flex:1;font-size:14px;font-weight:700;border:3px solid var(--line);border-radius:12px;padding:10px;font-family:inherit;background:#fff;min-width:0">${opts}</select>
      <button class="btn green" id="voxTry" style="padding:10px 16px;font-size:15px">▶ 들어보기</button>
    </div>
    <p style="font-size:12px;color:var(--ink-soft);margin:8px 0 0">💡 더 자연스러운 목소리를 원하면 — 아이패드·아이폰은 <b>유나</b>, 컴퓨터는 <b>엣지(Edge) 브라우저</b>로 열면 ✨ 신경망 목소리가 나와요. 안드로이드는 <b>Google 음성</b>이 좋아요.</p>`;
  $('#voxSel').onchange=()=>{VOX.chosen=$('#voxSel').value;localStorage.setItem(VOICE_KEY,VOX.chosen);
    const was=voice.on;voice.on=true;voice.say('안녕! 이 목소리로 바꿨어요.');voice.on=was;};
  $('#voxTry').onclick=()=>{VOX.chosen=$('#voxSel').value;localStorage.setItem(VOICE_KEY,VOX.chosen);
    const was=voice.on;voice.on=true;voice.say(pick(['안녕! 나랑 같이 수학 놀이 하자!','참 잘했어요! 오늘도 별을 모아 볼까요?','셋 더하기 넷은 얼마일까요?']));voice.on=was;};
}
/* 설정 모달에 섹션 추가 */
(function(){const m=$('#setup .modalbox');if(!m)return;
  const sec=document.createElement('div');sec.id='voiceSec';sec.className='voicesec';
  m.insertBefore(sec,$('#cloudSec')||$('#setupClose'));
  const _rs=renderSetup;renderSetup=function(f){_rs(f);renderVoiceSec();};
  renderVoiceSec();})();
