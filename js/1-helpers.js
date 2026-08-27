/* ───────── 기본 도우미 ───────── */
const $=s=>document.querySelector(s);
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[rnd(0,a.length-1)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};
const gcd=(a,b)=>b?gcd(b,a%b):a;
const fmt=n=>Number(n).toLocaleString('ko-KR');
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const cmpAns=(a,b)=>a>b?'>':'<';
const store={load(){try{return JSON.parse(localStorage.getItem('mathplay-all-v1')||'{}')}catch(e){return {}}},save(d){try{localStorage.setItem('mathplay-all-v1',JSON.stringify(d))}catch(e){}}};
let P=store.load();P.group=P.group||'7';P.stickers=P.stickers||[];P.done=P.done||{};P.cardPlays=P.cardPlays||0;
const DAILY_CAP=10,SAME_LIMIT=2; // 하루 별 상한, 같은 단원 보상 횟수(3번째부터 보상 없음)
const today=()=>new Date().toISOString().slice(0,10);
function daily(){if(!P.daily||P.daily.d!==today())P.daily={d:today(),earned:0,plays:{}};return P.daily;}
if(P.wallet==null)P.wallet=Object.values(P.done).reduce((a,o)=>a+Object.values(o).reduce((b,p)=>b+(p.stars||0),0),0);
const CARD_URL='https://siwon-card-nori.vercel.app/',CARD_COST=5;
const cardPlays=()=>Math.floor(P.wallet/CARD_COST);
const age=()=>P.group;

const audio={ctx:null,on:true,
  beep(f,d,type='sine',v=.12){if(!this.on)return;try{this.ctx=this.ctx||new (window.AudioContext||window.webkitAudioContext)();const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(this.ctx.destination);const t=this.ctx.currentTime;o.start(t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.stop(t+d)}catch(e){}},
  ok(){this.beep(660,.12);setTimeout(()=>this.beep(880,.2),110)},no(){this.beep(200,.3,'triangle')},tap(){this.beep(520,.05,'square',.04)},
  win(){[523,659,784,1047].forEach((f,i)=>setTimeout(()=>this.beep(f,.3),i*140))}};
const voice={on:true,
  say(t,opt={}){if(!this.on||!('speechSynthesis'in window)||!t)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(t).replace(/<[^>]+>/g,' '));u.lang='ko-KR';u.rate=opt.rate||.9;u.pitch=1.1;speechSynthesis.speak(u)}catch(e){}}};
$('#voiceBtn').onclick=()=>{voice.on=!voice.on;$('#voiceBtn').classList.toggle('off',!voice.on);if(voice.on)voice.say('읽어주기를 켰어요');else if(window.speechSynthesis)speechSynthesis.cancel()};
$('#speakBtn').onclick=()=>{if(S.q){const was=voice.on;voice.on=true;voice.say(S.q.prompt);voice.on=was;}};

/* ───────── 그림 그리기 ───────── */
const EMO=['🍎','🍓','🐥','⭐','🚗','🐟','🍬','🎈','🍪','🐸','🌸','🧁'];
const emojiRow=(e,n,gone=0)=>`<div class="emojirow" style="grid-template-columns:repeat(${Math.min(n,5)},1fr)">${Array.from({length:n},(_,i)=>`<span class="${i>=n-gone?'gone':''}" style="animation-delay:${i*40}ms">${e}</span>`).join('')}</div>`;
function tenFrame(n,color='#FB923C',color2='#3B82F6'){ // 십 배열판 (n≤20)
  const frames=n>10?2:1;let out='';
  for(let f=0;f<frames;f++){let cells='';
    for(let i=0;i<10;i++){const x=(i%5)*36+4,y=Math.floor(i/5)*36+4,k=f*10+i;
      cells+=`<rect x="${x}" y="${y}" width="34" height="34" fill="#fff" stroke="#2B2A33" stroke-width="2"/>`;
      if(k<n)cells+=`<circle cx="${x+17}" cy="${y+17}" r="12" fill="${f===0?color:color2}" stroke="#2B2A33" stroke-width="2"/>`;}
    out+=`<svg width="184" height="78" viewBox="0 0 184 78">${cells}</svg>`;}
  return out;}
function twoColorFrame(a,b){ // 가르기: 앞 a개는 주황, 뒤 b개는 파랑 (한 판, a+b≤10)
  let cells='';for(let i=0;i<10;i++){const x=(i%5)*36+4,y=Math.floor(i/5)*36+4;
    cells+=`<rect x="${x}" y="${y}" width="34" height="34" fill="#fff" stroke="#2B2A33" stroke-width="2"/>`;
    if(i<a)cells+=`<circle cx="${x+17}" cy="${y+17}" r="12" fill="#FB923C" stroke="#2B2A33" stroke-width="2"/>`;
    else if(i<a+b)cells+=`<circle cx="${x+17}" cy="${y+17}" r="12" fill="#3B82F6" stroke="#2B2A33" stroke-width="2"/>`;}
  return `<svg width="184" height="78" viewBox="0 0 184 78">${cells}</svg>`;}
function sticks(tens,ones){ // 십 묶음 막대 + 낱개
  let out='';const w=tens*30+ (ones?ones*22+20:0)+10;
  for(let t=0;t<tens;t++){out+=`<rect x="${6+t*30}" y="6" width="18" height="110" rx="4" fill="#FB923C" stroke="#2B2A33" stroke-width="2"/>`;
    for(let k=1;k<10;k++)out+=`<line x1="${6+t*30}" y1="${6+k*11}" x2="${24+t*30}" y2="${6+k*11}" stroke="#2B2A33" stroke-width="1.5"/>`;}
  for(let o=0;o<ones;o++)out+=`<rect x="${tens*30+20+o*22}" y="98" width="18" height="18" rx="3" fill="#3B82F6" stroke="#2B2A33" stroke-width="2"/>`;
  return `<svg width="${w}" height="122" viewBox="0 0 ${w} 122">${out}</svg>`;}
function shapeSVG(kind,color='#FB923C',s=90){const c=s/2;
  if(kind==='원')return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><circle cx="${c}" cy="${c}" r="${c-6}" fill="${color}" stroke="#2B2A33" stroke-width="3"/></svg>`;
  if(kind==='세모')return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><polygon points="${c},8 ${s-6},${s-8} 6,${s-8}" fill="${color}" stroke="#2B2A33" stroke-width="3" stroke-linejoin="round"/></svg>`;
  return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><rect x="8" y="${kind==='네모'?16:8}" width="${s-16}" height="${kind==='네모'?s-32:s-16}" rx="4" fill="${color}" stroke="#2B2A33" stroke-width="3"/></svg>`;}
function lenBar(len,color){return `<svg width="220" height="40" viewBox="0 0 220 40"><rect x="4" y="8" width="${len}" height="24" rx="6" fill="${color}" stroke="#2B2A33" stroke-width="3"/></svg>`;}
function cupSVG(level,color='#60A5FA'){const h=Math.round(70*level);return `<svg width="90" height="110" viewBox="0 0 90 110"><path d="M12 10 L18 100 Q45 108 72 100 L78 10 Z" fill="#fff" stroke="#2B2A33" stroke-width="3"/><clipPath id="c${h}"><path d="M12 10 L18 100 Q45 108 72 100 L78 10 Z"/></clipPath><rect x="0" y="${100-h}" width="90" height="${h+10}" fill="${color}" clip-path="url(#c${h})"/><path d="M12 10 L18 100 Q45 108 72 100 L78 10 Z" fill="none" stroke="#2B2A33" stroke-width="3"/></svg>`;}
function seesawSVG(L,R,heavyLeft){const t=heavyLeft?10:-10;return `<svg width="260" height="130" viewBox="0 0 260 130"><polygon points="130,120 112,120 130,80 148,120" fill="#2B2A33"/><g transform="rotate(${t} 130 82)"><rect x="20" y="78" width="220" height="8" rx="4" fill="#A16207"/><text x="45" y="72" font-size="40" text-anchor="middle">${L}</text><text x="215" y="72" font-size="40" text-anchor="middle">${R}</text></g></svg>`;}
function clockSVG(h,m){const c=70,r=62;let t='';for(let i=1;i<=12;i++){const a=(i*30-90)*Math.PI/180;t+=`<text x="${(c+r*.82*Math.cos(a)).toFixed(1)}" y="${(c+r*.82*Math.sin(a)+5).toFixed(1)}" font-size="14" font-weight="700" text-anchor="middle">${i}</text>`;}
  const ha=((h%12)*30+m*.5-90)*Math.PI/180,ma=(m*6-90)*Math.PI/180;
  return `<svg width="150" height="150" viewBox="0 0 140 140"><circle cx="${c}" cy="${c}" r="${r+4}" fill="#FFF6D6" stroke="#2B2A33" stroke-width="4"/>${t}<line x1="${c}" y1="${c}" x2="${(c+34*Math.cos(ha)).toFixed(1)}" y2="${(c+34*Math.sin(ha)).toFixed(1)}" stroke="#2B2A33" stroke-width="7" stroke-linecap="round"/><line x1="${c}" y1="${c}" x2="${(c+50*Math.cos(ma)).toFixed(1)}" y2="${(c+50*Math.sin(ma)).toFixed(1)}" stroke="#E8432F" stroke-width="5" stroke-linecap="round"/><circle cx="${c}" cy="${c}" r="5" fill="#2B2A33"/></svg>`;}

/* 보기 만들기 */
const num=v=>({v:String(v),html:String(v)});
function around(ans,min,max,k=3){const s=new Set([ans]);let g=0;while(s.size<k&&g++<50){const d=rnd(1,3)*(Math.random()<.5?-1:1);const c=ans+d;if(c>=min&&c<=max)s.add(c);}
  g=0;while(s.size<k&&g++<50)s.add(rnd(min,max));return shuffle([...s]).map(num);}
const words=(arr,ans)=>({options:shuffle(arr).map(w=>({v:w,html:w,text:true})),ans});


/* 한글 수 읽기 (4학년 1학기 큰 수) */
const DIG='영일이삼사오육칠팔구';
function read4(g){const u=['','십','백','천'],s=String(g).padStart(4,'0');let r='';
  for(let i=0;i<4;i++){const d=+s[i],un=u[3-i];if(!d)continue;r+=(d===1&&un?'':DIG[d])+un;}return r;}
function readKo(n){n=Math.floor(n);if(n===0)return '영';const big=['','만','억','조'];let parts=[],i=0;
  while(n>0&&i<4){const g=n%10000;if(g){let r=read4(g);if(i===1&&g===1)r='';parts.unshift(r+big[i]);}n=Math.floor(n/10000);i++;}
  return parts.join(' ');}
function readSmall(n){return n===0?'영':read4(n);}   // 100 미만 읽기용
function fracRead(w,n,d){let s='';if(w)s=readSmall(w)+'과 ';return s+readSmall(d)+'분의 '+readSmall(n);}

/* 분수 HTML / 그림 */
const fracHTML=(n,d,w)=>`<span class="frac">${w?`<span>${w}</span>`:''}<span class="stack"><span class="num">${n}</span><span class="den">${d}</span></span></span>`;
function pieSVG(n,d,size=92,color='#FF8A5B'){
  const wholes=Math.max(1,Math.ceil(n/d)),r=size/2-3,c=size/2;let out='';
  for(let w=0;w<wholes;w++){let paths='';
    for(let j=0;j<d;j++){const filled=w*d+j<n;const fill=filled?color:'#fff';
      if(d===1){paths+=`<circle cx="${c}" cy="${c}" r="${r}" fill="${fill}" stroke="#26282F" stroke-width="2"/>`;continue;}
      const a0=-Math.PI/2+j*2*Math.PI/d,a1=a0+2*Math.PI/d;
      const x0=c+r*Math.cos(a0),y0=c+r*Math.sin(a0),x1=c+r*Math.cos(a1),y1=c+r*Math.sin(a1);
      paths+=`<path d="M${c} ${c} L${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${(2*Math.PI/d)>Math.PI?1:0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z" fill="${fill}" stroke="#26282F" stroke-width="2"/>`;}
    out+=`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${paths}</svg>`;}
  return out;}
function barSVG(n,d,w=240,color='#FF8A5B'){
  const wholes=Math.max(1,Math.ceil(n/d)),h=40;let out='';
  for(let k=0;k<wholes;k++){let r='';const cw=(w-4)/d;
    for(let j=0;j<d;j++){r+=`<rect x="${(2+j*cw).toFixed(2)}" y="2" width="${cw.toFixed(2)}" height="${h-4}" fill="${k*d+j<n?color:'#fff'}" stroke="#26282F" stroke-width="2"/>`;}
    out+=`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${r}</svg>`;}
  return out;}
function dotsSVG(total,per,highlight=0){ // 전체의 분수: 묶음으로 보여주기
  const groups=total/per,cols=Math.min(groups,4),size=26,gap=10,gw=per*size+gap;
  const rows=Math.ceil(groups/cols);let out='';
  for(let g=0;g<groups;g++){const gx=(g%cols)*gw,gy=Math.floor(g/cols)*(size+18);
    out+=`<rect x="${gx}" y="${gy}" width="${per*size}" height="${size+8}" rx="8" fill="${g<highlight?'#FFE066':'#F6F4EA'}" stroke="#C9C5B8" stroke-dasharray="4 3"/>`;
    for(let i=0;i<per;i++)out+=`<circle cx="${gx+size/2+i*size}" cy="${gy+size/2+4}" r="9" fill="#FF8A5B" stroke="#26282F" stroke-width="2"/>`;}
  return `<svg width="${cols*gw}" height="${rows*(size+18)}" viewBox="0 0 ${cols*gw} ${rows*(size+18)}">${out}</svg>`;}
function angleSVG(a){const cx=40,cy=120,L=150,rad=a*Math.PI/180,x=cx+L*Math.cos(rad),y=cy-L*Math.sin(rad);
  const ar=34,ax=cx+ar*Math.cos(rad),ay=cy-ar*Math.sin(rad);
  const arc=a===90?`<path d="M${cx+22} ${cy} L${cx+22} ${cy-22} L${cx} ${cy-22}" fill="none" stroke="#2F6FDE" stroke-width="3"/>`
    :`<path d="M${cx+ar} ${cy} A${ar} ${ar} 0 ${a>180?1:0} 0 ${ax.toFixed(1)} ${ay.toFixed(1)}" fill="none" stroke="#2F6FDE" stroke-width="4"/>`;
  return `<svg width="220" height="140" viewBox="0 0 220 140"><line x1="${cx}" y1="${cy}" x2="${cx+L+20}" y2="${cy}" stroke="#26282F" stroke-width="4" stroke-linecap="round"/><line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#26282F" stroke-width="4" stroke-linecap="round"/>${arc}<circle cx="${cx}" cy="${cy}" r="5" fill="#26282F"/></svg>`;}
