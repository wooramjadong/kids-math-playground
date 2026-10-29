/* ───────── 📚 1학년 · 2학년 단원 (2022 개정 교육과정) ─────────
   단원마다 low(하) · mid(중) · high(상) 문제 만들기를 둡니다.
   한 판 10문제 = 하 1 · 중 5 · 상 4 (5-engine.js의 LV_COUNT) */

/* 공통 도우미 */
const Q_='<span class="q">?</span>', BOX='<span class="q">□</span>';
const eqV=s=>`<div class="eq">${s}</div>`;
const bigEmo=(arr,size=44)=>`<div style="font-size:${size}px;letter-spacing:6px;line-height:1.3">${arr.join('')}</div>`;
const optsWith=(ans,cands,k=3)=>{const s=[String(ans)];for(const c of shuffle(cands.map(String)))if(s.length<k&&!s.includes(c))s.push(c);return shuffle(s);};
const numOpts=(ans,cands,k=3)=>optsWith(ans,cands,k).map(num);
const CH=(opts,ans,o)=>Object.assign({input:{type:'choice',options:opts},check:v=>v===String(ans),sol:String(ans)},o);
const NUM=(ans,o={})=>Object.assign({input:{type:'num',unit:o.unit,decimal:o.decimal},ans},o);
const PAIR=(f1,f2,a,b,o)=>Object.assign({input:{type:'pair',fields:[['a',f1],['b',f2]]},check:v=>v.a===a&&v.b===b,sol:`${a}${f1} ${b}${f2}`},o);
const oneOf=(...fs)=>pick(fs)();
const ANIM=['🐶','🐱','🐰','🐻','🐼','🐸','🐵','🐯','🦊','🐷','🐮','🐔'];
const ORDK=['첫째','둘째','셋째','넷째','다섯째','여섯째','일곱째','여덟째','아홉째'];
const KIDS=['시원이','민준이','서연이','지우','하준이','수아','도윤이','예은이'];
const noCarry2=()=>{const a1=rnd(1,8),b1=rnd(1,9-a1),a0=rnd(0,9),b0=rnd(0,9-a0);return [a1*10+a0,b1*10+b0];};
const digitsOf=n=>String(n).split('').map(Number);
function permsOf(arr){if(arr.length<=1)return [arr];const out=[];arr.forEach((x,i)=>permsOf(arr.slice(0,i).concat(arr.slice(i+1))).forEach(p=>out.push([x,...p])));return out;}
function cardNumber(digits,big){ // 숫자 카드로 만드는 가장 큰/작은 수 (0은 맨 앞에 못 옴)
  const s=digits.slice().sort((x,y)=>big?y-x:x-y);if(!big&&s[0]===0){const k=s.findIndex(x=>x>0);[s[0],s[k]]=[s[k],s[0]];}return +s.join('');}
const cardsHTML=d=>d.map(x=>`<span style="display:inline-block;border:3px solid #2B2A33;border-radius:8px;padding:2px 10px;margin:0 3px;background:#fff">${x}</span>`).join('');

/* 그림 도우미 */
function rectSVG(w,h,color){return `<svg width="${w+8}" height="${h+8}" viewBox="0 0 ${w+8} ${h+8}"><rect x="4" y="4" width="${w}" height="${h}" rx="4" fill="${color}" stroke="#2B2A33" stroke-width="3"/></svg>`;}
function rulerSVG(start,len,color='#FB923C',max=10){const u=24,x0=14,W=x0*2+max*u;
  let s=`<rect x="${x0+start*u}" y="6" width="${(len*u).toFixed(1)}" height="18" rx="4" fill="${color}" stroke="#2B2A33" stroke-width="2"/>`;
  s+=`<rect x="4" y="30" width="${W-8}" height="34" rx="4" fill="#FEF3C7" stroke="#2B2A33" stroke-width="2"/>`;
  for(let k=0;k<=max;k++){const x=x0+k*u;s+=`<line x1="${x}" y1="30" x2="${x}" y2="44" stroke="#2B2A33" stroke-width="2"/><text x="${x}" y="58" font-size="11" text-anchor="middle">${k}</text>`;
    if(k<max)s+=`<line x1="${x+u/2}" y1="30" x2="${x+u/2}" y2="37" stroke="#2B2A33" stroke-width="1"/>`;}
  return `<svg width="${W}" height="68" viewBox="0 0 ${W} 68">${s}</svg>`;}
const CCOL={'빨간색':'#EF4444','파란색':'#3B82F6','노란색':'#FACC15'};
const SNAME={'원':'동그라미','세모':'세모','네모':'네모'};
function itemsSVG(items){const cols=5,s=50;let out='';
  items.forEach((it,i)=>{const x=(i%cols)*s+4,y=Math.floor(i/cols)*s+4,c=CCOL[it.c];
    if(it.s==='원')out+=`<circle cx="${x+22}" cy="${y+22}" r="18" fill="${c}" stroke="#2B2A33" stroke-width="2.5"/>`;
    else if(it.s==='세모')out+=`<polygon points="${x+22},${y+3} ${x+41},${y+40} ${x+3},${y+40}" fill="${c}" stroke="#2B2A33" stroke-width="2.5" stroke-linejoin="round"/>`;
    else out+=`<rect x="${x+4}" y="${y+4}" width="36" height="36" rx="3" fill="${c}" stroke="#2B2A33" stroke-width="2.5"/>`;});
  const rows=Math.ceil(items.length/cols);return `<svg width="${cols*s+8}" height="${rows*s+8}" viewBox="0 0 ${cols*s+8} ${rows*s+8}">${out}</svg>`;}
function groupsHTML(e,per,cnt){return `<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:420px;margin:auto">${Array.from({length:cnt},()=>`<span style="border:2px dashed #B8B3A3;border-radius:12px;padding:2px 6px;font-size:24px;line-height:1.2">${e.repeat(per)}</span>`).join('')}</div>`;}
function splitTri(k){ // 꼭짓점에서 밑변으로 선 k개를 그은 삼각형
  let s=`<polygon points="110,10 210,130 10,130" fill="#FDE68A" stroke="#2B2A33" stroke-width="3" stroke-linejoin="round"/>`;
  for(let j=1;j<=k;j++){const x=10+200*j/(k+1);s+=`<line x1="110" y1="10" x2="${x.toFixed(1)}" y2="130" stroke="#2B2A33" stroke-width="3"/>`;}
  return `<svg width="220" height="140" viewBox="0 0 220 140">${s}</svg>`;}
const TH=s=>`<th style="border:2px solid #26282F;padding:5px 10px;background:#F6F4EA;font-size:14px">${s}</th>`;
const TD=s=>`<td style="border:2px solid #26282F;padding:5px 12px;text-align:center;font-weight:700">${s}</td>`;
function dataTable(head,unit,names,vals,o={}){const sum=vals.reduce((a,b)=>a+b,0);const cells=vals.map((v,k)=>k===o.hide?Q_:v);
  return `<table style="border-collapse:collapse;margin:auto"><tr>${TH(head)}${names.map(TH).join('')}${o.total?TH('합계'):''}</tr><tr>${TH(unit)}${cells.map(TD).join('')}${o.total?TD(sum):''}</tr></table>`;}
function circleGraph(names,vals){const m=Math.max(...vals);let rows='';
  for(let r=m;r>=1;r--)rows+=`<tr><td style="font-size:11px;color:#888;padding:0 6px;text-align:right">${r}</td>${vals.map(v=>`<td style="border:1px solid #D6D2C4;width:48px;height:24px;text-align:center;font-size:19px;line-height:1;color:#2563EB;font-weight:700">${v>=r?'○':''}</td>`).join('')}</tr>`;
  rows+=`<tr><td></td>${names.map(n=>`<td style="text-align:center;font-weight:700;font-size:13px;padding-top:4px">${n}</td>`).join('')}</tr>`;
  return `<table style="border-collapse:collapse;margin:auto">${rows}</table>`;}
function gridTable(op,rows,cols,hr,hc){ // 덧셈표·곱셈표 일부
  const f=(a,b)=>op==='+'?a+b:a*b;
  return `<table style="border-collapse:collapse;margin:auto"><tr>${TH(op==='+'?'+':'×')}${cols.map(TH).join('')}</tr>${rows.map((r,i)=>`<tr>${TH(r)}${cols.map((c,j)=>TD(i===hr&&j===hc?Q_:f(r,c))).join('')}</tr>`).join('')}</table>`;}
const DATASETS=[['좋아하는 과일',['사과','바나나','포도','딸기']],['좋아하는 계절',['봄','여름','가을','겨울']],['좋아하는 동물',['강아지','고양이','토끼','햄스터']],['좋아하는 색깔',['빨강','파랑','노랑','초록']]];
const pickData=(lo=1,hi=8)=>{const [head,names]=pick(DATASETS);const vals=shuffle(Array.from({length:hi-lo+1},(_,k)=>lo+k)).slice(0,4);return {head,names,vals};};
const WEEK=['월','화','수','목','금','토','일'];

/* ════════════ 1학년 1학기 ════════════ */
const SOLIDS={'상자 모양':['🎁','📦','🧱','📕','🧃'],'둥근 기둥 모양':['🥫','🔋','🧯','🥁','🧻'],'공 모양':['⚽','🎾','🏀','🍊','🎱']};
const SOLID_K=Object.keys(SOLIDS);
const solidOpts=()=>shuffle(SOLID_K).map(kk=>({v:kk,html:`<div style="font-size:40px">${SOLIDS[kk][0]}</div><div style="font-size:14px">${kk}</div>`,col:true}));
const G11={
  n9:{
    low(){const e=pick(EMO),n=rnd(1,5);return {tag:'세어 보기',prompt:`${e} 모두 몇 개일까요?`,visual:emojiRow(e,n),options:around(n,1,9),ans:String(n),explain:`하나, 둘, 셋… 세어 보면 ${n}개예요.`};},
    mid(){return oneOf(
      ()=>{const e=pick(EMO),n=rnd(6,9);return {tag:'세어 보기',prompt:`${e} 모두 몇 개일까요?`,visual:emojiRow(e,n),options:around(n,1,9),ans:String(n),explain:`하나씩 짚으며 세면 ${n}개예요.`};},
      ()=>{const big=Math.random()<.5,n=big?rnd(1,8):rnd(1,9),a=big?n+1:n-1;return {tag:'1 큰 수 · 1 작은 수',prompt:`${n}보다 1 ${big?'큰':'작은'} 수는?`,visual:eqV(n),options:around(a,0,9),ans:String(a),explain:`${n} 바로 ${big?'뒤':'앞'}의 수는 ${a}예요.`};},
      ()=>{const s=rnd(0,5),miss=rnd(1,3),seq=[0,1,2,3,4].map(k=>s+k);return {tag:'수의 순서',prompt:'빈칸에 들어갈 수는?',visual:eqV(seq.map((v,k)=>k===miss?Q_:v).join(' · ')),options:around(seq[miss],0,9),ans:String(seq[miss]),explain:'수를 순서대로 세면 1씩 커져요.'};},
      ()=>{const row=shuffle(ANIM).slice(0,5),k=rnd(1,5),ans=row[k-1];return {tag:'몇째',prompt:`왼쪽에서 ${ORDK[k-1]}에 있는 동물은?`,visual:bigEmo(row),options:shuffle([ans,...shuffle(row.filter(x=>x!==ans)).slice(0,2)]).map(x=>({v:x,html:x})),ans,explain:`왼쪽부터 하나씩 세면 ${ORDK[k-1]}는 ${ans}예요.`};},
      ()=>{const e=pick(EMO),n=rnd(2,5);return {tag:'0 알아보기',prompt:`접시에 ${e} ${n}개가 있었는데 모두 먹었어요. 남은 것은 몇 개일까요?`,visual:emojiRow(e,n,n),options:around(0,0,9),ans:'0',explain:'하나도 없으면 0(영)이라고 해요.'};});},
    high(){return oneOf(
      ()=>{const s=rnd(5,9),seq=[s,s-1,null,s-3];return {tag:'거꾸로 세기',prompt:'거꾸로 세었어요. 빈칸에 들어갈 수는?',visual:eqV(seq.map(v=>v==null?Q_:v).join(' · ')),options:around(s-2,0,9),ans:String(s-2),explain:'거꾸로 세면 1씩 작아져요.'};},
      ()=>{const n=rnd(2,9);return {tag:'어떤 수 구하기',prompt:`어떤 수보다 1 큰 수가 ${n}이에요. 어떤 수는 얼마일까요?`,options:around(n-1,0,9),ans:String(n-1),explain:`${n}보다 1 작은 수가 어떤 수예요. 답은 ${n-1}!`};},
      ()=>{const ns=shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,3),small=Math.random()<.5,ans=small?Math.min(...ns):Math.max(...ns);return {tag:'크기 비교',prompt:`세 수 중에서 가장 ${small?'작은':'큰'} 수는?`,options:ns.map(num),ans:String(ans),explain:'수를 순서대로 세었을 때 뒤에 나올수록 큰 수예요.'};},
      ()=>{const row=shuffle(ANIM).slice(0,6),k=rnd(2,5),ans=ORDK[6-k];return CH(optsWith(ans,ORDK.slice(0,6)),ans,{tag:'몇째',prompt:`왼쪽에서 ${ORDK[k-1]}에 있는 ${row[k-1]}는 오른쪽에서 몇째일까요?`,visual:bigEmo(row),explain:`모두 6마리예요. 오른쪽부터 세면 ${row[k-1]}는 ${ans}예요.`});},
      ()=>{const a=rnd(0,5),b=a+rnd(3,4);return {tag:'사이의 수',prompt:`${a}와(과) ${b} 사이에 있는 수는 모두 몇 개일까요?`,visual:eqV(`${a} · … · ${b}`),options:around(b-a-1,0,9),ans:String(b-a-1),explain:`${Array.from({length:b-a-1},(_,k)=>a+1+k).join(', ')} → ${b-a-1}개예요. 양 끝의 수는 세지 않아요.`};});},
  },
  shape:{
    low(){const k=pick(SOLID_K),em=pick(SOLIDS[k]);return {tag:'여러 가지 모양',prompt:'이 물건은 어떤 모양일까요?',visual:`<div style="font-size:80px;line-height:1">${em}</div>`,...words(SOLID_K,k),explain:`${em}은(는) ${k}이에요.`};},
    mid(){return oneOf(
      ()=>{const k=pick(SOLID_K),em=pick(SOLIDS[k]);return {tag:'같은 모양 찾기',prompt:'이것과 같은 모양은 어느 것일까요?',visual:`<div style="font-size:80px;line-height:1">${em}</div>`,options:shuffle(SOLID_K).map(kk=>({v:kk,html:`<span style="font-size:48px">${pick(SOLIDS[kk].filter(x=>x!==em))}</span>`})),ans:k,explain:`${em}은(는) ${k}이에요.`};},
      ()=>{const s=pick([{q:'잘 굴러가고, 세우면 위에 쌓을 수도 있는 모양은?',a:'둥근 기둥 모양'},{q:'어느 쪽으로도 잘 굴러가는 모양은?',a:'공 모양'},{q:'평평해서 잘 쌓을 수 있고 굴러가지 않는 모양은?',a:'상자 모양'}]);return {tag:'모양의 특징',prompt:s.q,options:solidOpts(),ans:s.a,explain:`${s.a}이 맞아요.`};});},
    high(){return oneOf(
      ()=>{const cnt={};SOLID_K.forEach(k=>cnt[k]=rnd(1,4));const list=shuffle(SOLID_K.flatMap(k=>Array.from({length:cnt[k]},()=>pick(SOLIDS[k]))));const k=pick(SOLID_K);
        return {tag:'모양 세기',prompt:`${k}은 모두 몇 개일까요?`,visual:bigEmo(list,38),options:around(cnt[k],1,9),ans:String(cnt[k]),explain:`${k}만 골라 세면 ${cnt[k]}개예요.`};},
      ()=>{const c=shuffle([2,3,4]),cnt={};SOLID_K.forEach((k,i)=>cnt[k]=c[i]);const list=shuffle(SOLID_K.flatMap(k=>Array.from({length:cnt[k]},()=>pick(SOLIDS[k]))));const most=Math.random()<.5;const ans=SOLID_K.reduce((m,k)=>most?(cnt[k]>cnt[m]?k:m):(cnt[k]<cnt[m]?k:m));
        return {tag:'모양 세기',prompt:`가장 ${most?'많은':'적은'} 모양은 어느 것일까요?`,visual:bigEmo(list,38),options:solidOpts(),ans,explain:SOLID_K.map(k=>`${k} ${cnt[k]}개`).join(', ')};},
      ()=>{const s=pick([{q:'평평한 부분과 둥근 부분이 모두 있는 모양은?',a:'둥근 기둥 모양'},{q:'뾰족한 부분이 있는 모양은?',a:'상자 모양'},{q:'평평한 부분이 하나도 없는 모양은?',a:'공 모양'},{q:'어떻게 놓아도 위에 쌓을 수 없는 모양은?',a:'공 모양'}]);return {tag:'모양의 특징',prompt:s.q,options:solidOpts(),ans:s.a,explain:`${s.a}이 맞아요.`};});},
  },
  addsub:{
    low(){const e=pick(EMO),a=rnd(1,3),b=rnd(1,5-a);return {tag:'모으기',prompt:`${a} 더하기 ${b}는?`,visual:`<div class="grp">${emojiRow(e,a)}<span class="sign">+</span>${emojiRow(e,b)}</div>`+eqV(`${a} + ${b} = ${Q_}`),options:around(a+b,1,9),ans:String(a+b),explain:`모두 세면 ${a+b}개예요.`};},
    mid(){return oneOf(
      ()=>{const t=rnd(4,9),a=rnd(1,t-1);return {tag:'가르기',prompt:`${t}은(는) ${a}와(과) 몇으로 가를 수 있을까요?`,visual:twoColorFrame(a,t-a),options:around(t-a,1,9),ans:String(t-a),explain:`${a}와(과) ${t-a}를 모으면 ${t}이 돼요.`};},
      ()=>{const e=pick(EMO),a=rnd(2,6),b=rnd(1,9-a);return {tag:'덧셈',prompt:`${a} + ${b}는?`,visual:`<div class="grp">${emojiRow(e,a)}<span class="sign">+</span>${emojiRow(e,b)}</div>`+eqV(`${a} + ${b} = ${Q_}`),options:around(a+b,1,9),ans:String(a+b),explain:`${a}에서 ${b}만큼 이어 세면 ${a+b}`};},
      ()=>{const e=pick(EMO),a=rnd(4,9),b=rnd(1,a-1);return {tag:'뺄셈',prompt:`${a} − ${b}는?`,visual:emojiRow(e,a,b)+eqV(`${a} − ${b} = ${Q_}`),options:around(a-b,0,9),ans:String(a-b),explain:`${a}개에서 ${b}개를 지우면 ${a-b}개 남아요.`};},
      ()=>{const n=rnd(1,9),t=pick(['+0','-0','-n']);const ans=t==='-n'?0:n;const ex=t==='+0'?`${n} + 0`:t==='-0'?`${n} − 0`:`${n} − ${n}`;return {tag:'0이 있는 계산',prompt:`${ex}는?`,visual:eqV(`${ex} = ${Q_}`),options:around(ans,0,9),ans:String(ans),explain:t==='-n'?'같은 수를 빼면 0이에요.':'0을 더하거나 빼도 수는 그대로예요.'};});},
    high(){return oneOf(
      ()=>{const a=rnd(1,6),s=rnd(a+1,9);return {tag:'□ 구하기',prompt:`${a} + □ = ${s}. □는 얼마일까요?`,visual:eqV(`${a} + ${BOX} = ${s}`),options:around(s-a,1,9),ans:String(s-a),explain:`${s}에서 ${a}를 빼면 ${s-a}예요.`};},
      ()=>{const b=rnd(1,5),c=rnd(1,9-b);return {tag:'□ 구하기',prompt:`□ − ${b} = ${c}. □는 얼마일까요?`,visual:eqV(`${BOX} − ${b} = ${c}`),options:around(b+c,2,9),ans:String(b+c),explain:`${c}에 ${b}를 더하면 ${b+c}예요.`};},
      ()=>{const s=rnd(5,9),a=rnd(1,s-1);const ok=`${a} + ${s-a}`;const b1=rnd(1,s),b2=rnd(1,s-2);const w1=`${b1} + ${s+1-b1}`,w2=`${b2} + ${s-1-b2}`;
        return CH(shuffle([ok,w1,w2]),ok,{tag:'덧셈식 찾기',prompt:`합이 ${s}인 덧셈식은 어느 것일까요?`,explain:`${a} + ${s-a} = ${s}`});},
      ()=>{const bird=pick(['참새','오리','병아리','나비']),n=rnd(5,9),m=rnd(1,n-1);return {tag:'이야기 뺄셈',prompt:`${bird} ${n}마리가 있었는데 몇 마리가 날아가서 ${m}마리가 남았어요. 날아간 ${bird}는 몇 마리일까요?`,options:around(n-m,1,9),ans:String(n-m),explain:`${n} − ${m} = ${n-m}`};});},
  },
  compare:{
    low(){return oneOf(
      ()=>{const lens=shuffle([90,190]);const long=Math.random()<.5;const ans=long?190:90;return {tag:'길이 비교',prompt:`더 ${long?'긴':'짧은'} 것은 어느 것일까요?`,options:lens.map((l,i)=>({v:String(l),html:lenBar(l,['#FB923C','#60A5FA'][i])})),ans:String(ans),explain:'한쪽 끝을 맞추고 다른 쪽 끝을 비교해요.'};},
      ()=>{const [t1,s1]=pick([['🦒','🐈'],['🌳','🌱'],['🏢','🏠'],['👨','👶']]);const tall=Math.random()<.5;return {tag:'키 비교',prompt:`키가 더 ${tall?'큰':'작은'} 것은?`,options:shuffle([{v:t1,html:`<span style="font-size:64px">${t1}</span>`},{v:s1,html:`<span style="font-size:36px">${s1}</span>`}]),ans:tall?t1:s1,explain:'아래를 맞추고 위쪽 끝을 비교해요.'};});},
    mid(){const colors=['#FB923C','#60A5FA','#F472B6'];return oneOf(
      ()=>{const lens=shuffle([90,150,210]);const long=Math.random()<.5;const ans=long?210:90;return {tag:'길이 비교',prompt:`가장 ${long?'긴':'짧은'} 것은 어느 것일까요?`,options:lens.map((l,i)=>({v:String(l),html:lenBar(l,colors[i])})),ans:String(ans),explain:'끝을 맞추고 세 개를 한꺼번에 비교해요.'};},
      ()=>{const lv=shuffle([.3,.6,.9]);const most=Math.random()<.5;const ans=most?.9:.3;return {tag:'담긴 양 비교',prompt:`물이 가장 ${most?'많이':'적게'} 담긴 것은?`,options:lv.map(l=>({v:String(l),html:cupSVG(l)})),ans:String(ans),explain:'같은 컵이면 물의 높이가 높을수록 많아요.'};},
      ()=>{const [h,l]=pick([['🐘','🐭'],['🚌','🚲'],['🐻','🐇'],['📚','🪶'],['🍉','🍇']]);const left=Math.random()<.5,heavy=Math.random()<.5;return {tag:'무게 비교',prompt:`더 ${heavy?'무거운':'가벼운'} 것은 어느 것일까요?`,visual:seesawSVG(left?h:l,left?l:h,left),options:shuffle([{v:h,html:h},{v:l,html:l}]),ans:heavy?h:l,explain:'시소에서 내려간 쪽이 더 무거워요.'};},
      ()=>{const sz=shuffle([[46,34],[76,52],[108,70]]);const wide=Math.random()<.5;const ans=wide?'108':'46';return {tag:'넓이 비교',prompt:`가장 ${wide?'넓은':'좁은'} 것은 어느 것일까요?`,options:sz.map((s,i)=>({v:String(s[0]),html:rectSVG(s[0],s[1],colors[i])})),ans,explain:'겹쳐 보았을 때 남는 쪽이 더 넓어요.'};});},
    high(){return oneOf(
      ()=>{const [a,b,c]=shuffle(KIDS).slice(0,3);const small=Math.random()<.5;const ans=small?c:a;return CH(shuffle([a,b,c]),ans,{tag:'키 비교 추리',prompt:`${a}는 ${b}보다 키가 크고, ${b}는 ${c}보다 키가 커요. 키가 가장 ${small?'작은':'큰'} 사람은?`,explain:`큰 순서대로: ${a} → ${b} → ${c}`});},
      ()=>{const n=rnd(3,7);let m=rnd(3,8);if(m===n)m=n+1;const ans=n>m?'가 그릇':'나 그릇';return CH(['가 그릇','나 그릇'],ans,{tag:'담을 수 있는 양',prompt:`같은 컵으로 물을 부었더니 가 그릇에는 ${n}컵, 나 그릇에는 ${m}컵이 들어갔어요. 더 많이 담을 수 있는 그릇은?`,explain:'같은 컵으로 더 많이 부을 수 있는 그릇이 더 많이 담을 수 있어요.'});},
      ()=>{const n=rnd(2,4),m=n+rnd(2,3);return CH(['가 막대','나 막대'],'가 막대',{tag:'길이 비교 추리',prompt:`같은 끈의 길이를 가 막대로 재면 ${n}번, 나 막대로 재면 ${m}번이에요. 더 긴 막대는?`,explain:'긴 막대로 재면 더 적은 번수로 잴 수 있어요. 그래서 가 막대가 더 길어요.'});},
      ()=>{const [a,b,c]=shuffle(KIDS).slice(0,3);const heavy=Math.random()<.5;const ans=heavy?b:c;return CH(shuffle([a,b,c]),ans,{tag:'무게 비교 추리',prompt:`시소를 타면 ${a}보다 ${b}가 내려가고, ${a}가 ${c}보다 내려가요. 가장 ${heavy?'무거운':'가벼운'} 사람은?`,explain:`무거운 순서: ${b} → ${a} → ${c}`});});},
  },
  n50:{
    low(){return oneOf(
      ()=>{const t=rnd(1,4);return {tag:'10개씩 묶음',prompt:`10개씩 묶음 ${t}개는 얼마일까요?`,visual:sticks(t,0),options:numOpts(t*10,[t*10-10,t*10+10,t].filter(x=>x>0)),ans:String(t*10),explain:`10이 ${t}개면 ${t*10}이에요.`};},
      ()=>({tag:'10 알아보기',prompt:'9보다 1 큰 수는?',visual:tenFrame(9),options:numOpts(10,[8,11,9]),ans:'10',explain:'9 다음 수는 10(십)이에요.'}));},
    mid(){return oneOf(
      ()=>{const t=rnd(1,4),o=rnd(1,9),n=t*10+o;return {tag:'몇십몇',prompt:'모두 얼마일까요?',visual:sticks(t,o),options:around(n,10,50,3),ans:String(n),explain:`10개씩 묶음 ${t}개와 낱개 ${o}개 → ${n}`};},
      ()=>{const o=rnd(1,9);return {tag:'십몇',prompt:`10과 ${o}을(를) 모으면 얼마일까요?`,visual:tenFrame(10+o),options:around(10+o,10,20),ans:String(10+o),explain:`10하고 ${o} 더 → ${10+o}`};},
      ()=>{const s=rnd(11,46),miss=rnd(1,2),seq=[0,1,2,3].map(k=>s+k);return {tag:'수의 순서',prompt:'빈칸에 들어갈 수는?',visual:eqV(seq.map((v,k)=>k===miss?Q_:v).join(' · ')),options:around(seq[miss],10,50),ans:String(seq[miss]),explain:'1씩 커져요.'};},
      ()=>{let a=rnd(11,50),b=rnd(11,50);while(a===b)b=rnd(11,50);return {tag:'크기 비교',prompt:'더 큰 수는 어느 것일까요?',options:shuffle([num(a),num(b)]),ans:String(Math.max(a,b)),explain:'10개씩 묶음의 수가 많은 쪽이 커요. 같으면 낱개를 비교해요.'};});},
    high(){return oneOf(
      ()=>{const t=rnd(1,3),o=rnd(11,19),n=t*10+o;return {tag:'묶음 다시 세기',prompt:`10개씩 묶음 ${t}개와 낱개 ${o}개는 모두 얼마일까요?`,visual:sticks(t,0)+tenFrame(o),options:around(n,20,50,4),ans:String(n),explain:`낱개 ${o}개는 10개씩 묶음 1개와 낱개 ${o-10}개! 그래서 ${t+1}묶음과 ${o-10}개 → ${n}`};},
      ()=>{const ns=shuffle(Array.from({length:40},(_,k)=>k+11)).slice(0,3),small=Math.random()<.5,ans=small?Math.min(...ns):Math.max(...ns);return {tag:'크기 비교',prompt:`세 수 중에서 가장 ${small?'작은':'큰'} 수는?`,options:ns.map(num),ans:String(ans),explain:'10개씩 묶음의 수부터 비교해요.'};},
      ()=>{const n=rnd(12,50);return {tag:'어떤 수 구하기',prompt:`어떤 수보다 1 작은 수가 ${n-1}이에요. 어떤 수는?`,options:around(n,10,50),ans:String(n),explain:`${n-1}보다 1 큰 수가 어떤 수예요 → ${n}`};},
      ()=>{const t=rnd(1,4),o=rnd(1,9),n=t*10+o;return {tag:'묶음과 낱개',prompt:`${n}은(는) 10개씩 묶음 □개와 낱개 ${o}개예요. □는?`,options:numOpts(t,[t+1,t-1,o].filter(x=>x>0)),ans:String(t),explain:`${n} = ${t*10} + ${o} → 10개씩 묶음 ${t}개`};},
      ()=>{const a=rnd(11,40),b=a+rnd(4,6);return {tag:'사이의 수',prompt:`${a}와(과) ${b} 사이에 있는 수는 모두 몇 개일까요?`,options:around(b-a-1,1,9),ans:String(b-a-1),explain:`${a+1}부터 ${b-1}까지 세면 ${b-a-1}개예요.`};});},
  },
};

/* ════════════ 1학년 2학기 ════════════ */
const G12={
  count:{
    low(){const t=rnd(5,9);return {tag:'몇십',prompt:`10개씩 묶음 ${t}개는 얼마일까요?`,visual:sticks(t,0),options:numOpts(t*10,[t*10-10,t*10+10,t]),ans:String(t*10),explain:`10이 ${t}개면 ${t*10}이에요.`};},
    mid:i=>GEN82.count(i,false),
    high(i){return oneOf(()=>GEN82.count(i,true),()=>GEN82.count(i,true),
      ()=>{const n=rnd(35,99);return NUM(n-10,{tag:'어떤 수 구하기',prompt:`어떤 수보다 10 큰 수가 ${n}이에요. 어떤 수는?`,explain:`${n}보다 10 작은 수 → ${n-10}`});},
      ()=>{const t=rnd(4,8),o=rnd(11,19),n=t*10+o;return NUM(n,{tag:'묶음 다시 세기',prompt:`10개씩 묶음 ${t}개와 낱개 ${o}개는 모두 얼마일까요?`,explain:`낱개 ${o}개 = 10개씩 묶음 1개와 낱개 ${o-10}개 → ${n}`});});},
  },
  three:{
    low(){const a=rnd(1,9);return {tag:'10이 되는 더하기',prompt:`${a}에 얼마를 더하면 10이 될까요?`,visual:tenFrame(a),options:around(10-a,1,9),ans:String(10-a),explain:`빈칸이 ${10-a}개 남았어요. ${a} + ${10-a} = 10`};},
    mid(i){return oneOf(()=>GEN82.three(i,false),()=>GEN82.three(i,false),
      ()=>{const a=rnd(1,9);return NUM(10-a,{tag:'10에서 빼기',prompt:'계산해 보세요.',eqHTML:`10 − ${a} =`,explain:`10 = ${a} + ${10-a} 이니까 10 − ${a} = ${10-a}`});},
      ()=>{const b=rnd(1,9);return NUM(10-b,{tag:'10이 되는 더하기',prompt:'□ 안에 알맞은 수를 쓰세요.',eqHTML:`${BOX} + ${b} = 10`,explain:`10 − ${b} = ${10-b}`});});},
    high(i){return oneOf(()=>GEN82.three(i,true),
      ()=>{const b=rnd(2,8),c=10-b,a=rnd(2,9);return NUM(a+10,{tag:'10 만들어 더하기',prompt:'10이 되는 두 수를 찾아 먼저 더해 보세요.',eqHTML:`${b} + ${a} + ${c} =`,explain:`${b} + ${c} = 10, 10 + ${a} = ${a+10}`});},
      ()=>{const a=rnd(1,5),b=rnd(1,9-a);return NUM(10-a-b,{tag:'10에서 두 번 빼기',prompt:'계산해 보세요.',eqHTML:`10 − ${a} − ${b} =`,explain:`10 − ${a} = ${10-a}, ${10-a} − ${b} = ${10-a-b}`});});},
  },
  shapeclock:{
    low(){return oneOf(
      ()=>{const colors=['#FB923C','#60A5FA','#F472B6','#4ADE80'];const k=pick(['세모','네모','원']);return {tag:'모양 찾기',prompt:`${SNAME[k]} 모양은 어느 것일까요?`,options:shuffle(['세모','네모','원']).map(f=>({v:f,html:shapeSVG(f,pick(colors))})),ans:k,explain:k==='세모'?'뾰족한 곳이 3군데예요.':k==='네모'?'뾰족한 곳이 4군데예요.':'뾰족한 곳 없이 둥글어요.'};},
      ()=>{const h=rnd(1,12),lab=`${h}시`;return CH(shuffle([lab,`${h%12+1}시`,`${(h+5)%12+1}시`]),lab,{tag:'몇 시',prompt:'시계가 몇 시를 가리키고 있을까요?',visual:clockSVG(h,0),explain:`긴바늘이 12, 짧은바늘이 ${h}를 가리키면 ${h}시예요.`});});},
    mid(i){return oneOf(()=>GEN82.shape(i,false),
      ()=>{const h=rnd(1,12),lab=`${h}시 30분`;return CH(shuffle([lab,`${h}시`,`${h%12+1}시 30분`]),lab,{tag:'몇 시 30분',prompt:'시계가 몇 시 몇 분을 가리키고 있을까요?',visual:clockSVG(h,30),explain:`긴바늘이 6이면 30분! 짧은바늘은 ${h}와 ${h%12+1} 사이에 있어요.`});},
      ()=>{const s=pick([{q:'뾰족한 곳이 3군데인 모양은?',a:'세모'},{q:'뾰족한 곳이 4군데인 모양은?',a:'네모'},{q:'뾰족한 곳이 없는 모양은?',a:'원'}]);return {tag:'모양의 특징',prompt:s.q,options:shuffle(['세모','네모','원']).map(f=>({v:f,html:shapeSVG(f,'#FDE68A',70)})),ans:s.a,explain:`${SNAME[s.a]} 모양이에요.`};});},
    high(i){return oneOf(()=>GEN82.shape(i,true),
      ()=>{const h=rnd(1,11),lab=`${h+1}시`;return CH(shuffle([lab,`${h}시`,`${h+1}시 30분`]),lab,{tag:'시각 구하기',prompt:`지금 ${h}시 30분이에요. 30분 뒤는 몇 시일까요?`,visual:clockSVG(h,30),explain:`30분이 지나면 긴바늘이 12로 가서 ${h+1}시 정각이 돼요.`});},
      ()=>{const h=rnd(1,11),lab=`${h+1}시 30분`;return CH(shuffle([lab,`${h}시 30분`,`${h+1}시`]),lab,{tag:'시각 구하기',prompt:`${h}시 30분에서 긴바늘이 한 바퀴 돌면 몇 시 몇 분일까요?`,visual:clockSVG(h,30),explain:`긴바늘이 한 바퀴 돌면 1시간이 지나요. → ${h+1}시 30분`});},
      ()=>{const cnt={세모:rnd(1,3),네모:rnd(1,3),원:rnd(1,3)};const k=pick(['세모','네모']);const ans=k==='세모'?cnt.세모*3:cnt.네모*4;return NUM(ans,{tag:'뾰족한 곳 세기',prompt:`그림에서 ${SNAME[k]} 모양의 뾰족한 곳은 모두 몇 군데일까요?`,visual:shapeScene(cnt),unit:'군데',explain:`${SNAME[k]} ${cnt[k]}개 × ${k==='세모'?3:4}군데 = ${ans}군데`});});},
  },
  addsub2:{
    low(){return oneOf(
      ()=>{const o=rnd(1,9);return NUM(10+o,{tag:'10 + 몇',prompt:'계산해 보세요.',eqHTML:`10 + ${o} =`,explain:`10과 ${o}을(를) 모으면 ${10+o}`});},
      ()=>{const o=rnd(1,9);return NUM(10,{tag:'십몇 − 몇',prompt:'계산해 보세요.',eqHTML:`${10+o} − ${o} =`,explain:`낱개 ${o}개를 모두 빼면 10이 남아요.`});});},
    mid(i){return Math.random()<.5?GEN82.carry(i,false):GEN82.borrow(i,false);},
    high(i){return oneOf(()=>GEN82.carry(i,true),()=>GEN82.borrow(i,true),
      ()=>{const a=rnd(5,9),b=rnd(11-a,9),s=a+b;return CH(numOpts(a,[b,s,a+1]).map(o=>o.v),a,{tag:'덧셈과 뺄셈의 관계',prompt:`${a} + ${b} = ${s} 이에요. 그럼 ${s} − ${b}는?`,explain:`덧셈식을 뺄셈식으로 바꾸면 ${s} − ${b} = ${a}`});},
      ()=>{const mk=()=>{const a=rnd(5,9),b=rnd(11-a,9);return [a,b];};let es=[mk(),mk(),mk()];while(new Set(es.map(e=>e[0]+e[1])).size<3)es=[mk(),mk(),mk()];const best=es.reduce((m,e)=>e[0]+e[1]>m[0]+m[1]?e:m);const lab=e=>`${e[0]} + ${e[1]}`;
        return CH(es.map(lab),lab(best),{tag:'합 비교',prompt:'합이 가장 큰 덧셈식은?',explain:es.map(e=>`${lab(e)} = ${e[0]+e[1]}`).join(', ')});});},
  },
  pattern:{
    low(){const s=pick([['🔴','🔵','🟡'],['🍎','🍌','🍇'],['⭐','🌙','☀️'],['🐶','🐱','🐭']]);const unit=[s[0],s[1]];const seq=Array.from({length:6},(_,i)=>unit[i%2]);
      return {tag:'규칙 찾기',prompt:'규칙을 찾아 다음에 올 것을 고르세요.',visual:`<div style="font-size:42px;letter-spacing:6px">${seq.join('')}<span class="q" style="color:var(--red);font-weight:700">?</span></div>`,options:s.map(x=>({v:x,html:x})),ans:unit[0],explain:`${unit.join(' ')} 이(가) 반복돼요.`};},
    mid(){return oneOf(
      ()=>{const s=pick([['🔴','🔵','🟡'],['🍎','🍌','🍇'],['⭐','🌙','☀️'],['🟥','🟩','🟦']]);const unit=Math.random()<.5?[s[0],s[1],s[1]]:[s[0],s[1],s[2]];const seq=Array.from({length:7},(_,i)=>unit[i%3]);
        return {tag:'규칙 찾기',prompt:'규칙을 찾아 다음에 올 것을 고르세요.',visual:`<div style="font-size:40px;letter-spacing:5px">${seq.join('')}<span class="q" style="color:var(--red);font-weight:700">?</span></div>`,options:s.map(x=>({v:x,html:x})),ans:unit[7%3],explain:`${unit.join(' ')} 이(가) 반복돼요.`};},
      ()=>{const d=pick([2,5,10]),st=rnd(1,d===10?9:20),seq=[0,1,2,3].map(k=>st+d*k);return NUM(st+d*4,{tag:'수의 규칙',prompt:'규칙을 찾아 다음 수를 쓰세요.',eqHTML:`${seq.join(', ')}, ${BOX}`,explain:`${d}씩 커지는 규칙이에요.`});});},
    high(){return oneOf(
      ()=>{const s=pick([['🔴','🔵','🟡'],['🍎','🍌','🍇'],['⭐','🌙','☀️']]);const unit=[s[0],s[1],s[1],s[2]];const seq=Array.from({length:9},(_,i)=>unit[i%4]);
        return {tag:'규칙 찾기',prompt:'규칙을 찾아 다음에 올 것을 고르세요.',visual:`<div style="font-size:36px;letter-spacing:4px">${seq.join('')}<span class="q" style="color:var(--red);font-weight:700">?</span></div>`,options:s.map(x=>({v:x,html:x})),ans:unit[9%4],explain:`${unit.join(' ')} 네 개씩 반복돼요.`};},
      ()=>{const d=pick([3,4,5]),st=rnd(30,60),seq=[0,1,2,3].map(k=>st-d*k);return NUM(st-d*4,{tag:'수의 규칙',prompt:'규칙을 찾아 다음 수를 쓰세요.',eqHTML:`${seq.join(', ')}, ${BOX}`,explain:`${d}씩 작아지는 규칙이에요.`});},
      ()=>{const r0=rnd(1,7),c0=rnd(1,6),hr=rnd(0,2),hc=rnd(0,3);const val=(r,c)=>(r0+r)*10+c0+c;
        const tb=`<table style="border-collapse:collapse;margin:auto">${[0,1,2].map(r=>`<tr>${[0,1,2,3].map(c=>TD(r===hr&&c===hc?Q_:val(r,c))).join('')}</tr>`).join('')}</table>`;
        return NUM(val(hr,hc),{tag:'수 배열표',prompt:'100까지의 수 배열표의 일부예요. ? 에 알맞은 수는?',visual:tb,explain:'오른쪽으로 1씩, 아래로 10씩 커져요.'});});},
  },
  addsub3:{
    low(){return oneOf(
      ()=>{const a=rnd(1,8),b=rnd(1,9-a);return NUM((a+b)*10,{tag:'몇십 + 몇십',prompt:'계산해 보세요.',eqHTML:`${a*10} + ${b*10} =`,explain:`${a} + ${b} = ${a+b} 이니까 ${(a+b)*10}`});},
      ()=>{const a=rnd(3,9),b=rnd(1,a-1);return NUM((a-b)*10,{tag:'몇십 − 몇십',prompt:'계산해 보세요.',eqHTML:`${a*10} − ${b*10} =`,explain:`${a} − ${b} = ${a-b} 이니까 ${(a-b)*10}`});});},
    mid(){return oneOf(
      ()=>{const a=rnd(11,95),b=rnd(1,9-(a%10));return b<1?NUM(a+0,{tag:'두 자리 수 덧셈',prompt:'계산해 보세요.',eqHTML:`${a} + 0 =`,explain:'0을 더하면 그대로예요.'}):NUM(a+b,{tag:'두 자리 수 덧셈',prompt:'계산해 보세요.',eqHTML:`${a} + ${b} =`,explain:'낱개끼리 더해요.'});},
      ()=>{const [a,b]=noCarry2();return NUM(a+b,{tag:'두 자리 수 덧셈',prompt:'계산해 보세요.',eqHTML:`${a} + ${b} =`,explain:'낱개끼리, 10개씩 묶음끼리 더해요.'});},
      ()=>{const a=rnd(21,99);const b=rnd(1,Math.max(1,a%10));return NUM(a-b,{tag:'두 자리 수 뺄셈',prompt:'계산해 보세요.',eqHTML:`${a} − ${b} =`,explain:'낱개끼리 빼요.'});},
      ()=>{const [x,y]=noCarry2();const a=x+y,b=y;return NUM(a-b,{tag:'두 자리 수 뺄셈',prompt:'계산해 보세요.',eqHTML:`${a} − ${b} =`,explain:'낱개끼리, 10개씩 묶음끼리 빼요.'});});},
    high(){return oneOf(
      ()=>{const [a,b]=noCarry2();return NUM(a,{tag:'□ 구하기',prompt:'□ 안에 알맞은 수를 쓰세요.',eqHTML:`${BOX} + ${b} = ${a+b}`,explain:`${a+b} − ${b} = ${a}`});},
      ()=>{const [x,y]=noCarry2();const a=x+y;return NUM(y,{tag:'□ 구하기',prompt:'□ 안에 알맞은 수를 쓰세요.',eqHTML:`${a} − ${BOX} = ${x}`,explain:`${a} − ${x} = ${y}`});},
      ()=>{const a1=rnd(1,4),b1=rnd(1,4),a0=rnd(0,4),b0=rnd(0,4),a=a1*10+a0,b=b1*10+b0;const c=rnd(1,Math.min(a1+b1,9))*10+rnd(0,a0+b0);const s=a+b-c;return NUM(s,{tag:'세 수의 계산',prompt:'앞에서부터 차례로 계산하세요.',eqHTML:`${a} + ${b} − ${c} =`,explain:`${a} + ${b} = ${a+b}, ${a+b} − ${c} = ${s}`});},
      ()=>{const [a,b]=noCarry2();const who=pick(KIDS);return NUM(a+b,{tag:'이야기 덧셈',prompt:`${who}는 줄넘기를 어제 ${a}번, 오늘 ${b}번 했어요. 모두 몇 번 했을까요?`,unit:'번',explain:`${a} + ${b} = ${a+b}`});});},
  },
};

/* ════════════ 2학년 1학기 ════════════ */
const G21={
  n3:{
    low(){return oneOf(
      ()=>{const n=rnd(2,9);return NUM(n*100,{tag:'몇백',prompt:`100이 ${n}개인 수는?`,explain:`100이 ${n}개면 ${n}00이에요.`});},
      ()=>pick([NUM(100,{tag:'백',prompt:'99보다 1 큰 수는?',explain:'99 다음 수는 100(백)이에요.'}),NUM(100,{tag:'백',prompt:'10이 10개인 수는?',explain:'10이 10개면 100이에요.'}),NUM(100,{tag:'백',prompt:'90보다 10 큰 수는?',explain:'90 다음 몇십은 100이에요.'})]));},
    mid(){return oneOf(
      ()=>{const a=rnd(1,9),b=rnd(0,9),c=rnd(0,9);return NUM(a*100+b*10+c,{tag:'세 자리 수',prompt:`100이 ${a}개, 10이 ${b}개, 1이 ${c}개인 수는?`,explain:`${a}00 + ${b}0 + ${c} = ${a*100+b*10+c}`});},
      ()=>{const n=rnd(111,999),s=String(n);let i=rnd(0,2);while(s[i]==='0')i=rnd(0,2);const val=+s[i]*[100,10,1][i];return NUM(val,{tag:'자릿값',prompt:`${n}에서 밑줄 친 숫자 <b>${s[i]}</b>이(가) 나타내는 값은?`,eqHTML:s.split('').map((c,k)=>k===i?`<u style="color:var(--red)">${c}</u>`:c).join(''),explain:`${s[i]}은(는) ${['백','십','일'][i]}의 자리 숫자라서 ${val}을 나타내요.`});},
      ()=>{let a=rnd(100,999),b=rnd(100,999);while(a===b)b=rnd(100,999);const ans=cmpAns(a,b);return CH(['>','<'],ans,{input:{type:'choice',options:['>','<'],big:true},tag:'크기 비교',prompt:'○ 안에 알맞은 것을 고르세요.',eqHTML:`${a} <span class="op">○</span> ${b}`,explain:'백의 자리부터 차례로 비교해요.'});},
      ()=>{const d=pick([10,100]),st=d===100?rnd(1,5)*100+rnd(0,99):rnd(100,900),seq=[0,1,2,3].map(k=>st+d*k);return NUM(st+d*4,{tag:'뛰어 세기',prompt:`${d}씩 뛰어 세었어요. 다음 수는?`,eqHTML:`<span class="small">${seq.join(' → ')} → ${BOX}</span>`,explain:`${d===100?'백':'십'}의 자리 숫자가 1씩 커져요.`});});},
    high(){return oneOf(
      ()=>{const a=rnd(1,7),b=rnd(11,19),c=rnd(0,9),n=a*100+b*10+c;return NUM(n,{tag:'묶음 다시 세기',prompt:`100이 ${a}개, 10이 ${b}개, 1이 ${c}개인 수는?`,explain:`10이 ${b}개 = ${b*10} = 100이 1개와 10이 ${b-10}개 → ${n}`});},
      ()=>{let d=shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,3);if(d.filter(x=>x>0).length<2)d=[1,5,8];const big=Math.random()<.5;const ans=cardNumber(d,big);return NUM(ans,{tag:'숫자 카드',prompt:`숫자 카드 3장을 한 번씩 써서 만들 수 있는 가장 ${big?'큰':'작은'} 세 자리 수는?`,visual:`<div style="font-size:28px;font-weight:700">${cardsHTML(d)}</div>`,explain:big?'큰 숫자부터 백의 자리에 놓아요.':'작은 숫자부터 놓되, 0은 맨 앞에 올 수 없어요.'});},
      ()=>{for(let g=0;g<30;g++){const h=rnd(1,9),o=rnd(0,9),T=rnd(h*100+20,h*100+89);const ok=[];for(let x=0;x<=9;x++)if(h*100+x*10+o<T)ok.push(x);if(ok.length>=1&&ok.length<=9){const ans=Math.max(...ok);return NUM(ans,{tag:'□ 안의 숫자',prompt:`0부터 9까지의 숫자 중 □ 안에 들어갈 수 있는 가장 큰 숫자는?`,eqHTML:`${h}${BOX}${o} &lt; ${T}`,explain:`□에 ${ans}를 넣으면 ${h}${ans}${o} &lt; ${T}, ${ans+1}을 넣으면 ${T}보다 커지거나 같아져요.`});}}return NUM(5,{tag:'□ 안의 숫자',prompt:'□ 안에 들어갈 수 있는 가장 큰 숫자는?',eqHTML:`4${BOX}2 &lt; 462`,explain:'5를 넣으면 452 < 462, 6을 넣으면 462는 같아서 안 돼요.'});},
      ()=>{const st=rnd(2,9)*100+rnd(1,3)*10+rnd(0,9),seq=[0,1,2,3].map(k=>st-10*k);return NUM(st-40,{tag:'거꾸로 뛰어 세기',prompt:'10씩 거꾸로 뛰어 세었어요. 다음 수는?',eqHTML:`<span class="small">${seq.join(' → ')} → ${BOX}</span>`,explain:'십의 자리 숫자가 1씩 작아져요. 0 다음은 백의 자리에서 받아내림!'});},
      ()=>{const n=rnd(250,999);return NUM(n-100,{tag:'어떤 수 구하기',prompt:`어떤 수보다 100 큰 수가 ${n}이에요. 어떤 수는?`,explain:`${n} − 100 = ${n-100}`});});},
  },
  shape2:{
    low(){const colors=['#FDE68A','#BFDBFE','#FBCFE8','#BBF7D0'];const k=pick(['삼각형','사각형','원']);return {tag:'여러 가지 도형',prompt:`${k}은 어느 것일까요?`,options:shuffle(['삼각형','사각형','원']).map(o=>({v:o,html:polySVG(o,pick(colors))})),ans:k,explain:k==='삼각형'?'곧은 선 3개로 둘러싸인 도형이에요.':k==='사각형'?'곧은 선 4개로 둘러싸인 도형이에요.':'어느 쪽에서 봐도 똑같이 동그란 모양이에요.'};},
    mid(){return oneOf(
      ()=>{const q=pick([['삼각형의 꼭짓점은 몇 개일까요?',3],['삼각형의 변은 몇 개일까요?',3],['사각형의 꼭짓점은 몇 개일까요?',4],['사각형의 변은 몇 개일까요?',4],['원의 꼭짓점은 몇 개일까요?',0]]);return {tag:'변과 꼭짓점',prompt:q[0],visual:polySVG(q[0].slice(0,3)==='삼각형'?'삼각형':q[0][0]==='원'?'원':'사각형'),options:numOpts(q[1],[0,2,3,4,5]),ans:String(q[1]),explain:q[1]===0?'원은 곧은 선도 뾰족한 곳도 없어요.':`곧은 선(변)과 뾰족한 점(꼭짓점)을 세어 보세요: ${q[1]}개`};},
      ()=>{const cnt={세모:rnd(1,4),네모:rnd(1,4),원:rnd(1,4)};const k=pick(['세모','네모','원']);const nm={세모:'삼각형',네모:'사각형',원:'원'}[k];return NUM(cnt[k],{tag:'도형 세기',prompt:`${nm}은 모두 몇 개일까요?`,visual:shapeScene(cnt),unit:'개',explain:`${nm}만 골라 세면 ${cnt[k]}개예요.`});},
      ()=>CH(['삼각형','사각형','원'],'사각형',{tag:'도형의 특징',prompt:'곧은 선 4개로 둘러싸여 있고 꼭짓점이 4개인 도형은?',explain:'변 4개, 꼭짓점 4개 → 사각형'}));},
    high(){return oneOf(
      ()=>{const a=rnd(2,5),b=rnd(2,5);return NUM(3*a+4*b,{tag:'꼭짓점 세기',prompt:`삼각형 ${a}개와 사각형 ${b}개의 꼭짓점은 모두 몇 개일까요?`,unit:'개',explain:`3 × ${a} = ${3*a}, 4 × ${b} = ${4*b} → ${3*a+4*b}개`});},
      ()=>{const k=rnd(1,2);return NUM(k===1?3:6,{tag:'크고 작은 삼각형',prompt:'그림에서 찾을 수 있는 크고 작은 삼각형은 모두 몇 개일까요?',visual:splitTri(k),unit:'개',explain:k===1?'작은 삼각형 2개 + 큰 삼각형 1개 = 3개':'작은 삼각형 3개 + 두 개가 붙은 삼각형 2개 + 큰 삼각형 1개 = 6개'});},
      ()=>{const q=pick([['칠교판 조각 7개 중 삼각형은 몇 개일까요?',5],['칠교판 조각 7개 중 사각형은 몇 개일까요?',2]]);return NUM(q[1],{tag:'칠교판',prompt:q[0],unit:'개',explain:'칠교판은 삼각형 5개, 사각형 2개(정사각형 1개 + 평행사변형 1개)로 되어 있어요.'});},
      ()=>{const a=rnd(2,5),b=rnd(1,Math.floor((4*a-1)/3));return NUM(4*a-3*b,{tag:'변의 수 비교',prompt:`사각형 ${a}개의 변의 수는 삼각형 ${b}개의 변의 수보다 몇 개 더 많을까요?`,unit:'개',explain:`4 × ${a} = ${4*a}, 3 × ${b} = ${3*b} → ${4*a} − ${3*b} = ${4*a-3*b}`});});},
  },
  addsub:{
    low(){return oneOf(
      ()=>{const a=rnd(11,89),b=rnd(1,9-(a%10)||1);return NUM(a+b,{tag:'두 자리 수 + 한 자리 수',prompt:'계산해 보세요.',eqHTML:`${a} + ${b} =`,explain:'일의 자리끼리 더해요.'});},
      ()=>{const [a,b]=noCarry2();return NUM(a+b,{tag:'받아올림 없는 덧셈',prompt:'계산해 보세요.',eqHTML:`${a} + ${b} =`,explain:'일의 자리끼리, 십의 자리끼리 더해요.'});},
      ()=>{const a=rnd(21,99);const b=rnd(1,Math.max(1,a%10));return NUM(a-b,{tag:'받아내림 없는 뺄셈',prompt:'계산해 보세요.',eqHTML:`${a} − ${b} =`,explain:'일의 자리끼리 빼요.'});});},
    mid(){return oneOf(
      ()=>{const a0=rnd(2,9),b0=rnd(11-a0,9),a=rnd(1,6)*10+a0,b=rnd(1,8-Math.floor(a/10))*10+b0;return NUM(a+b,{tag:'받아올림 있는 덧셈',prompt:'계산해 보세요.',eqHTML:`${a} + ${b} =`,explain:`일의 자리 ${a0} + ${b0} = ${a0+b0} → 10을 십의 자리로 받아올림해요.`});},
      ()=>{const a=rnd(45,95),b=rnd(105-a,99);return NUM(a+b,{tag:'합이 세 자리 수인 덧셈',prompt:'계산해 보세요.',eqHTML:`${a} + ${b} =`,explain:'십의 자리에서 10이 넘으면 백의 자리로 받아올림해요.'});},
      ()=>{const a1=rnd(3,9),a0=rnd(0,7),b0=rnd(a0+1,9),b1=rnd(1,a1-1),a=a1*10+a0,b=b1*10+b0;return NUM(a-b,{tag:'받아내림 있는 뺄셈',prompt:'계산해 보세요.',eqHTML:`${a} − ${b} =`,explain:`일의 자리 ${a0}에서 ${b0}을(를) 뺄 수 없으니 십의 자리에서 10을 받아내림해요.`});},
      ()=>{const a=rnd(2,9)*10+rnd(0,4),b=rnd((a%10)+1,9);return NUM(a-b,{tag:'(두 자리 수) − (한 자리 수)',prompt:'계산해 보세요.',eqHTML:`${a} − ${b} =`,explain:'일의 자리에서 뺄 수 없으면 받아내림해요.'});});},
    high(){return oneOf(
      ()=>{const a=rnd(15,68),b=rnd(15,30);return NUM(a,{tag:'□ 구하기',prompt:'□ 안에 알맞은 수를 쓰세요.',eqHTML:`${BOX} + ${b} = ${a+b}`,explain:`${a+b} − ${b} = ${a}`});},
      ()=>{const d=rnd(15,45),b=rnd(16,49),a=d+b;return NUM(b,{tag:'□ 구하기',prompt:'□ 안에 알맞은 수를 쓰세요.',eqHTML:`${a} − ${BOX} = ${d}`,explain:`${a} − ${d} = ${b}`});},
      ()=>{const a=rnd(25,58),b=rnd(17,39),c=rnd(12,Math.min(60,a+b-10));return NUM(a+b-c,{tag:'세 수의 계산',prompt:'앞에서부터 차례로 계산하세요.',eqHTML:`${a} + ${b} − ${c} =`,explain:`${a} + ${b} = ${a+b}, ${a+b} − ${c} = ${a+b-c}`});},
      ()=>{const x=rnd(30,70),k=rnd(12,29),r=x-k;return NUM(x+k,{tag:'잘못 계산한 문제',prompt:`어떤 수에 ${k}를 더해야 할 것을 잘못하여 뺐더니 ${r}이 되었어요. 바르게 계산하면 얼마일까요?`,explain:`어떤 수 = ${r} + ${k} = ${x}. 바른 계산: ${x} + ${k} = ${x+k}`});},
      ()=>{const a=rnd(18,59),b=rnd(17,39),s=a+b;const ok=`${s} − ${a} = ${b}`;return CH(shuffle([ok,`${a} − ${b} = ${s}`,`${b} − ${s} = ${a}`]),ok,{tag:'덧셈과 뺄셈의 관계',prompt:`${a} + ${b} = ${s} 를 뺄셈식으로 바르게 나타낸 것은?`,explain:'큰 수(합)에서 한 수를 빼면 다른 수가 나와요.'});});},
  },
  len:{
    low(){const L=rnd(2,9);return NUM(L,{tag:'자로 재기',prompt:'색칠한 막대의 길이는 몇 cm일까요?',visual:rulerSVG(0,L),unit:'cm',explain:`0에서 시작해 ${L}까지 → ${L} cm`});},
    mid(){return oneOf(
      ()=>{const st=rnd(1,4),L=rnd(2,10-st);return NUM(L,{tag:'자로 재기',prompt:'색칠한 막대의 길이는 몇 cm일까요?',visual:rulerSVG(st,L),unit:'cm',explain:`${st}에서 ${st+L}까지 1 cm가 ${L}번 → ${L} cm. 0에서 시작하지 않으면 칸 수를 세요!`});},
      ()=>{const n=rnd(3,12);return NUM(n,{tag:'1 cm',prompt:`1 cm가 ${n}번이면 몇 cm일까요?`,unit:'cm',explain:`1 cm가 ${n}번 → ${n} cm`});},
      ()=>{const n=rnd(3,8),c=pick([2,3]);return NUM(n*c,{tag:'단위 길이',prompt:`길이가 ${c} cm인 클립으로 재었더니 ${n}번이었어요. 몇 cm일까요?`,unit:'cm',explain:`${c} cm가 ${n}번 → ${c*n} cm`});});},
    high(){return oneOf(
      ()=>{const it=pick([['지우개','연필'],['클립','풀'],['손가락','뼘']]);const n=rnd(5,9),m=rnd(2,n-2);return CH(it,it[1],{tag:'단위 길이 비교',prompt:`같은 길이를 ${it[0]}로 재면 ${n}번, ${it[1]}로 재면 ${m}번이에요. 더 긴 것은?`,explain:'더 긴 것으로 재면 더 적은 번수로 잴 수 있어요.'});},
      ()=>{const st=rnd(0,3),L=rnd(3,6)+pick([.3,.7]);const ans=Math.round(L);return CH(optsWith(`약 ${ans} cm`,[`약 ${ans-1} cm`,`약 ${ans+1} cm`]),`약 ${ans} cm`,{tag:'길이 어림',prompt:'막대의 길이는 약 몇 cm일까요? (가까운 눈금으로 읽어요)',visual:rulerSVG(st,L),explain:`막대 끝이 ${st+ans} 눈금에 더 가까우니까 약 ${ans} cm예요.`});},
      ()=>{const a=rnd(3,6),b=rnd(2,5),sa=rnd(0,10-a),sb=rnd(1,10-b);return NUM(a+b,{tag:'길이의 합',prompt:'두 막대의 길이를 더하면 몇 cm일까요?',visual:rulerSVG(sa,a,'#FB923C')+rulerSVG(sb,b,'#60A5FA'),unit:'cm',explain:`주황 ${a} cm + 파랑 ${b} cm = ${a+b} cm`});},
      ()=>{const n=rnd(4,7),c=pick([2,3]),m=n*c-rnd(1,3);return CH(['색연필','붓'],'색연필',{tag:'길이 비교',prompt:`색연필은 ${c} cm 클립으로 ${n}번, 붓은 1 cm로 ${m}번 잰 길이예요. 더 긴 것은?`,explain:`색연필 = ${c} × ${n} = ${c*n} cm, 붓 = ${m} cm → 색연필이 더 길어요.`});});},
  },
  classify:{
    low(){const sets=[['🐶','🐱','🐰','🐻'],['🍎','🍌','🍇','🍓'],['🚗','🚌','🚲','🚂'],['⚽','🏀','🎾','🏐']];const [A,B]=shuffle(sets).slice(0,2);const odd=pick(B);const items=shuffle([...shuffle(A).slice(0,3),odd]);
      return {tag:'분류하기',prompt:'종류가 다른 하나는 어느 것일까요?',options:items.map(x=>({v:x,html:x})),ans:odd,explain:`나머지 셋과 종류가 다른 것은 ${odd}예요.`};},
    mid(){const mk=n=>Array.from({length:n},()=>({c:pick(Object.keys(CCOL)),s:pick(['원','세모','네모'])}));return oneOf(
      ()=>{let it=mk(rnd(8,10));const c=pick(Object.keys(CCOL));if(!it.some(x=>x.c===c))it[0].c=c;const n=it.filter(x=>x.c===c).length;return NUM(n,{tag:'색깔로 분류',prompt:`${c}은 모두 몇 개일까요?`,visual:itemsSVG(it),unit:'개',explain:`${c}만 골라 세면 ${n}개예요.`});},
      ()=>{let it=mk(rnd(8,10));const s=pick(['원','세모','네모']);if(!it.some(x=>x.s===s))it[0].s=s;const n=it.filter(x=>x.s===s).length;return NUM(n,{tag:'모양으로 분류',prompt:`${SNAME[s]} 모양은 모두 몇 개일까요?`,visual:itemsSVG(it),unit:'개',explain:`${SNAME[s]}만 골라 세면 ${n}개예요.`});},
      ()=>CH(shuffle(['색깔','모양','예쁜 것과 예쁘지 않은 것']),'예쁜 것과 예쁘지 않은 것',{tag:'분류 기준',prompt:'분류하는 기준으로 알맞지 <b>않은</b> 것은?',explain:'예쁜지는 사람마다 다르게 생각해요. 누가 해도 결과가 같은 기준으로 분류해야 해요.'}));},
    high(){const cols=Object.keys(CCOL);return oneOf(
      ()=>{const it=Array.from({length:rnd(9,10)},()=>({c:pick(cols),s:pick(['원','세모','네모'])}));const c=pick(cols),s=pick(['원','세모','네모']);it[rnd(0,it.length-1)]={c,s};const n=it.filter(x=>x.c===c&&x.s===s).length;
        return NUM(n,{tag:'두 가지 기준',prompt:`${c}이면서 ${SNAME[s]} 모양인 것은 몇 개일까요?`,visual:itemsSVG(it),unit:'개',explain:`색깔과 모양을 모두 확인하며 세면 ${n}개예요.`});},
      ()=>{const cnt=shuffle([2,3,4,5,6]).slice(0,3);const it=shuffle(cols.flatMap((c,k)=>Array.from({length:cnt[k]},()=>({c,s:pick(['원','세모','네모'])}))));const d=Math.max(...cnt)-Math.min(...cnt);
        return NUM(d,{tag:'분류하고 비교하기',prompt:'색깔로 분류했을 때, 가장 많은 색깔은 가장 적은 색깔보다 몇 개 더 많을까요?',visual:itemsSVG(it),unit:'개',explain:cols.map((c,k)=>`${c} ${cnt[k]}개`).join(', ')+` → ${Math.max(...cnt)} − ${Math.min(...cnt)} = ${d}`});},
      ()=>{const kinds=Math.random()<.5?['원','네모']:['원','세모','네모'];const it=shuffle(Array.from({length:rnd(7,9)},(_,k)=>({c:pick(cols),s:k<kinds.length?kinds[k]:pick(kinds)})));return NUM(kinds.length,{tag:'분류하기',prompt:'모양에 따라 분류하면 몇 가지로 나눌 수 있을까요?',visual:itemsSVG(it),unit:'가지',explain:`${kinds.map(k=>SNAME[k]).join(', ')} → ${kinds.length}가지`});});},
  },
  mul:{
    low(){const e=pick(EMO),per=rnd(2,3),cnt=rnd(2,4);return {tag:'묶어 세기',prompt:`${per}씩 ${cnt}묶음은 모두 몇 개일까요?`,visual:groupsHTML(e,per,cnt),options:around(per*cnt,2,20),ans:String(per*cnt),explain:`${Array(cnt).fill(per).join(' + ')} = ${per*cnt}`};},
    mid(){return oneOf(
      ()=>{const a=rnd(2,5),b=rnd(2,5);return NUM(a*b,{tag:'몇의 몇 배',prompt:`${a}의 ${b}배는 얼마일까요?`,explain:`${a}의 ${b}배 = ${Array(b).fill(a).join(' + ')} = ${a*b}`});},
      ()=>{const a=rnd(2,5),b=rnd(3,5);const ok=`${a} × ${b}`;return CH(optsWith(ok,[`${a} + ${b}`,`${b} × ${b}`,`${a} × ${a}`]),ok,{tag:'곱셈식',prompt:`${Array(b).fill(a).join(' + ')} 를 곱셈식으로 바르게 나타낸 것은?`,explain:`${a}를 ${b}번 더한 것은 ${a} × ${b}`});},
      ()=>{const e=pick(EMO),per=rnd(2,5),cnt=rnd(3,5);return NUM(per*cnt,{tag:'곱셈',prompt:'모두 몇 개일까요? 곱셈식으로 생각해 보세요.',visual:groupsHTML(e,per,cnt),unit:'개',explain:`${per} × ${cnt} = ${per*cnt}`});});},
    high(){return oneOf(
      ()=>{const a=rnd(2,5),b=rnd(2,4),c=rnd(2,5),d=rnd(2,4);return NUM(a*b+c*d,{tag:'두 번 묶어 세기',prompt:`${a}씩 ${b}묶음과 ${c}씩 ${d}묶음을 합하면 모두 몇 개일까요?`,unit:'개',explain:`${a} × ${b} = ${a*b}, ${c} × ${d} = ${c*d} → ${a*b+c*d}`});},
      ()=>{const a=rnd(2,6),b=rnd(2,5);return NUM(a,{tag:'몇의 몇 배',prompt:`어떤 수의 ${b}배는 ${a*b}이에요. 어떤 수는?`,explain:`${a} × ${b} = ${a*b} 이니까 어떤 수는 ${a}`});},
      ()=>{const a=rnd(2,5),b=rnd(2,6);return NUM(b,{tag:'몇 배일까',prompt:`${a*b}은(는) ${a}의 몇 배일까요?`,unit:'배',explain:`${a}를 ${b}번 더하면 ${a*b} → ${b}배`});},
      ()=>{const a=rnd(3,5),b=rnd(3,5),c=rnd(2,a*b-3);return NUM(a*b-c,{tag:'이야기 곱셈',prompt:`사탕을 한 봉지에 ${a}개씩 ${b}봉지 샀어요. 그중 ${c}개를 먹었다면 남은 사탕은 몇 개일까요?`,unit:'개',explain:`${a} × ${b} = ${a*b}, ${a*b} − ${c} = ${a*b-c}`});});},
  },
};

/* ════════════ 2학년 2학기 ════════════ */
const G22={
  n4:{
    low(){return oneOf(
      ()=>{const n=rnd(2,9);return NUM(n*1000,{tag:'몇천',prompt:`1000이 ${n}개인 수는?`,explain:`1000이 ${n}개면 ${n}000이에요.`});},
      ()=>pick([NUM(1000,{tag:'천',prompt:'900보다 100 큰 수는?',explain:'900 다음 몇백은 1000(천)이에요.'}),NUM(1000,{tag:'천',prompt:'999보다 1 큰 수는?',explain:'999 다음 수는 1000(천)이에요.'}),NUM(1000,{tag:'천',prompt:'100이 10개인 수는?',explain:'100이 10개면 1000이에요.'})]));},
    mid(){return oneOf(
      ()=>{const a=rnd(1,9),b=rnd(0,9),c=rnd(0,9),d=rnd(0,9);return NUM(a*1000+b*100+c*10+d,{tag:'네 자리 수',prompt:`1000이 ${a}개, 100이 ${b}개, 10이 ${c}개, 1이 ${d}개인 수는?`,explain:`${a}000 + ${b}00 + ${c}0 + ${d}`});},
      ()=>{const n=rnd(1111,9999),s=String(n);let i=rnd(0,3);while(s[i]==='0')i=rnd(0,3);const val=+s[i]*[1000,100,10,1][i];return NUM(val,{tag:'자릿값',prompt:`${n}에서 밑줄 친 숫자 <b>${s[i]}</b>이(가) 나타내는 값은?`,eqHTML:s.split('').map((c,k)=>k===i?`<u style="color:var(--red)">${c}</u>`:c).join(''),explain:`${['천','백','십','일'][i]}의 자리 숫자라서 ${val}`});},
      ()=>{let a=rnd(1000,9999),b=a+pick([-1,1])*pick([1,10,100,1000])*rnd(1,3);if(b<1000||b>9999)b=a+1;const ans=cmpAns(a,b);return CH(['>','<'],ans,{input:{type:'choice',options:['>','<'],big:true},tag:'크기 비교',prompt:'○ 안에 알맞은 것을 고르세요.',eqHTML:`${a} <span class="op">○</span> ${b}`,explain:'천의 자리부터 차례로 비교해요.'});},
      ()=>{const d=pick([100,1000]),st=d===1000?rnd(1,4)*1000+rnd(0,999):rnd(1000,8500),seq=[0,1,2,3].map(k=>st+d*k);return NUM(st+d*4,{tag:'뛰어 세기',prompt:`${d}씩 뛰어 세었어요. 다음 수는?`,eqHTML:`<span class="small">${seq.join(' → ')} → ${BOX}</span>`,explain:`${d===1000?'천':'백'}의 자리 숫자가 1씩 커져요.`});});},
    high(){return oneOf(
      ()=>{const a=rnd(1,7),b=rnd(11,19),c=rnd(0,9),n=a*1000+b*100+c*10;return NUM(n,{tag:'묶음 다시 세기',prompt:`1000이 ${a}개, 100이 ${b}개, 10이 ${c}개인 수는?`,explain:`100이 ${b}개 = ${b*100} → ${a*1000} + ${b*100} + ${c*10} = ${n}`});},
      ()=>{let d=shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,4);const big=Math.random()<.5;const ans=cardNumber(d,big);return NUM(ans,{tag:'숫자 카드',prompt:`숫자 카드 4장을 한 번씩 써서 만들 수 있는 가장 ${big?'큰':'작은'} 네 자리 수는?`,visual:`<div style="font-size:28px;font-weight:700">${cardsHTML(d)}</div>`,explain:big?'큰 숫자부터 천의 자리에 놓아요.':'작은 숫자부터 놓되, 0은 맨 앞에 올 수 없어요.'});},
      ()=>{for(let g=0;g<30;g++){const a=rnd(1,9),b=rnd(0,9),o=rnd(0,9),T=a*1000+b*100+rnd(20,89);const ok=[];for(let x=0;x<=9;x++)if(a*1000+b*100+x*10+o<T)ok.push(x);if(ok.length>=1&&ok.length<=9){const ans=Math.max(...ok);return NUM(ans,{tag:'□ 안의 숫자',prompt:'0부터 9까지의 숫자 중 □ 안에 들어갈 수 있는 가장 큰 숫자는?',eqHTML:`${a}${b}${BOX}${o} &lt; ${T}`,explain:`□에 ${ans}를 넣으면 ${a}${b}${ans}${o} &lt; ${T}이고, 더 큰 숫자는 안 돼요.`});}}return NUM(4,{tag:'□ 안의 숫자',prompt:'□ 안에 들어갈 수 있는 가장 큰 숫자는?',eqHTML:`35${BOX}8 &lt; 3550`,explain:'4를 넣으면 3548 < 3550이에요.'});},
      ()=>{const st=rnd(2,9)*1000+rnd(1,2)*100+rnd(0,99),seq=[0,1,2,3].map(k=>st-100*k);return NUM(st-400,{tag:'거꾸로 뛰어 세기',prompt:'100씩 거꾸로 뛰어 세었어요. 다음 수는?',eqHTML:`<span class="small">${seq.join(' → ')} → ${BOX}</span>`,explain:'백의 자리 숫자가 1씩 작아져요. 0 다음은 천의 자리에서 받아내림!'});},
      ()=>{const t=rnd(2,4),n=rnd(2000,9800);return NUM(n-100*t,{tag:'어떤 수 구하기',prompt:`어떤 수에서 100씩 ${t}번 뛰어 세었더니 ${n}이 되었어요. 어떤 수는?`,explain:`${n}에서 100씩 ${t}번 거꾸로 세면 ${n-100*t}`});});},
  },
  times:{
    low(){const a=pick([2,5]),b=rnd(1,9);return NUM(a*b,{tag:`${a}단`,prompt:'계산해 보세요.',eqHTML:`${a} × ${b} =`,explain:`${a}단: ${a} × ${b} = ${a*b}`});},
    mid(){return oneOf(
      ()=>{const a=pick([3,4,6,7,8,9]),b=rnd(2,9);return NUM(a*b,{tag:`${a}단`,prompt:'계산해 보세요.',eqHTML:`${a} × ${b} =`,explain:`${a} × ${b} = ${a*b}`});},
      ()=>{const a=pick([3,4,6,7,8,9]),b=rnd(2,9);return NUM(a*b,{tag:`${a}단`,prompt:'계산해 보세요.',eqHTML:`${a} × ${b} =`,explain:`${a} × ${b} = ${a*b}`});},
      ()=>{const n=rnd(2,9),t=pick(['1x','x1','0x','x0']);const ex=t==='1x'?`1 × ${n}`:t==='x1'?`${n} × 1`:t==='0x'?`0 × ${n}`:`${n} × 0`;const ans=t.includes('0')?0:n;return NUM(ans,{tag:'1의 곱 · 0의 곱',prompt:'계산해 보세요.',eqHTML:`${ex} =`,explain:t.includes('0')?'어떤 수와 0의 곱은 항상 0이에요.':'1과 어떤 수의 곱은 그 수 그대로예요.'});});},
    high(){return oneOf(
      ()=>{const a=rnd(3,9),b=rnd(3,9);return Math.random()<.5?NUM(a,{tag:'□ 구하기',prompt:'□ 안에 알맞은 수를 쓰세요.',eqHTML:`${BOX} × ${b} = ${a*b}`,explain:`${b}단에서 ${a*b}를 찾으면 ${a} × ${b}`}):NUM(b,{tag:'□ 구하기',prompt:'□ 안에 알맞은 수를 쓰세요.',eqHTML:`${a} × ${BOX} = ${a*b}`,explain:`${a}단에서 ${a*b}를 찾으면 ${a} × ${b}`});},
      ()=>{const n=pick([6,8,12,16,18,24,36]);let c=0;for(let x=1;x<=9;x++)for(let y=1;y<=9;y++)if(x*y===n)c++;return NUM(c,{tag:'곱셈표',prompt:`곱셈표(1~9단)에서 곱이 ${n}인 칸은 모두 몇 개일까요?`,unit:'개',explain:(()=>{const l=[];for(let x=1;x<=9;x++)for(let y=1;y<=9;y++)if(x*y===n)l.push(`${x}×${y}`);return l.join(', ')+` → ${c}개`;})()});},
      ()=>{const a=rnd(3,9),b=rnd(5,9),c=rnd(2,b-2);return NUM(a*(b-c),{tag:'곱 비교',prompt:`${a} × ${b}는 ${a} × ${c}보다 얼마나 더 클까요?`,explain:`${a}를 ${b-c}번 더 더한 것 → ${a} × ${b-c} = ${a*(b-c)}`});},
      ()=>{const a=rnd(4,9),b=rnd(4,9),c=rnd(1,9);return NUM(a*b+c,{tag:'이야기 곱셈',prompt:`구슬이 한 상자에 ${a}개씩 ${b}상자 있고, 낱개로 ${c}개가 더 있어요. 구슬은 모두 몇 개일까요?`,unit:'개',explain:`${a} × ${b} = ${a*b}, ${a*b} + ${c} = ${a*b+c}`});},
      ()=>{const mk=()=>[rnd(3,9),rnd(3,9)];let es=[mk(),mk(),mk()];while(new Set(es.map(e=>e[0]*e[1])).size<3)es=[mk(),mk(),mk()];const best=es.reduce((m,e)=>e[0]*e[1]>m[0]*m[1]?e:m);const lab=e=>`${e[0]} × ${e[1]}`;return CH(es.map(lab),lab(best),{tag:'곱 비교',prompt:'곱이 가장 큰 것은?',explain:es.map(e=>`${lab(e)} = ${e[0]*e[1]}`).join(', ')});});},
  },
  len2:{
    low(){return oneOf(
      ()=>NUM(100,{tag:'1 m',prompt:'1 m는 몇 cm일까요?',unit:'cm',explain:'1 m = 100 cm'}),
      ()=>{const n=rnd(2,9);return NUM(n*100,{tag:'m와 cm',prompt:`${n} m는 몇 cm일까요?`,unit:'cm',explain:`1 m = 100 cm → ${n} m = ${n*100} cm`});},
      ()=>{const n=rnd(2,9);return NUM(n,{tag:'m와 cm',prompt:`${n*100} cm는 몇 m일까요?`,unit:'m',explain:`100 cm = 1 m → ${n*100} cm = ${n} m`});});},
    mid(){return oneOf(
      ()=>{const a=rnd(1,8),b=rnd(1,99);return NUM(a*100+b,{tag:'m와 cm',prompt:'빈칸에 알맞은 수를 쓰세요.',eqHTML:`${a} m ${b} cm = ${BOX} cm`,unit:'cm',explain:`${a} m = ${a*100} cm → ${a*100} + ${b} = ${a*100+b}`});},
      ()=>{const a=rnd(1,8),b=rnd(1,99);return PAIR(' m',' cm',a,b,{tag:'m와 cm',prompt:'빈칸에 알맞은 수를 쓰세요.',eqHTML:`${a*100+b} cm = ${BOX} m ${BOX} cm`,explain:`100 cm가 ${a}번 → ${a} m, 남은 ${b} cm`});},
      ()=>{const a=rnd(1,5),b=rnd(10,50),c=rnd(1,3),d=rnd(5,99-b);return PAIR(' m',' cm',a+c,b+d,{tag:'길이의 합',prompt:'계산해 보세요.',eqHTML:`<span class="small">${a} m ${b} cm + ${c} m ${d} cm =</span>`,explain:'m끼리, cm끼리 더해요.'});},
      ()=>{const c=rnd(1,4),a=c+rnd(1,4),d=rnd(5,60),b=rnd(d,99);return PAIR(' m',' cm',a-c,b-d,{tag:'길이의 차',prompt:'계산해 보세요.',eqHTML:`<span class="small">${a} m ${b} cm − ${c} m ${d} cm =</span>`,explain:'m끼리, cm끼리 빼요.'});});},
    high(){return oneOf(
      ()=>{const a=rnd(1,5),b=rnd(40,95),c=rnd(1,3),d=rnd(100-b+1,99);const t=(a+c)*100+b+d;return PAIR(' m',' cm',Math.floor(t/100),t%100,{tag:'받아올림 있는 길이의 합',prompt:'계산해 보세요.',eqHTML:`<span class="small">${a} m ${b} cm + ${c} m ${d} cm =</span>`,explain:`cm끼리 더하면 ${b+d} cm → 100 cm는 1 m로 받아올림!`});},
      ()=>{const c=rnd(1,3),a=c+rnd(2,4),b=rnd(5,50),d=rnd(b+1,95);const t=a*100+b-(c*100+d);return PAIR(' m',' cm',Math.floor(t/100),t%100,{tag:'받아내림 있는 길이의 차',prompt:'계산해 보세요.',eqHTML:`<span class="small">${a} m ${b} cm − ${c} m ${d} cm =</span>`,explain:`${b} cm에서 ${d} cm를 뺄 수 없으니 1 m를 100 cm로 받아내림해요.`});},
      ()=>{const it=pick([{q:'교실 문의 높이',a:'약 2 m',w:['약 20 cm','약 20 m']},{q:'버스의 길이',a:'약 10 m',w:['약 10 cm','약 100 m']},{q:'연필의 길이',a:'약 15 cm',w:['약 15 m','약 1 cm']},{q:'내 키',a:'약 130 cm',w:['약 13 cm','약 13 m']},{q:'칠판 긴 쪽의 길이',a:'약 4 m',w:['약 40 cm','약 40 m']}]);return CH(shuffle([it.a,...it.w]),it.a,{tag:'길이 어림하기',prompt:`${it.q}로 알맞은 것은?`,explain:`${it.q}는 ${it.a} 정도예요. 1 m는 어른 한 걸음, 1 cm는 손톱 너비쯤이에요.`});},
      ()=>{const v=shuffle([rnd(301,399),rnd(301,399),rnd(301,399)]);if(new Set(v).size<3)return NUM(245,{tag:'길이 비교',prompt:'2 m 45 cm는 몇 cm일까요?',unit:'cm',explain:'200 + 45 = 245'});const show=(x,k)=>k===1?`${x} cm`:`${Math.floor(x/100)} m ${x%100} cm`;const labs=v.map(show);const long=Math.random()<.5;const ans=labs[v.indexOf(long?Math.max(...v):Math.min(...v))];
        return CH(labs,ans,{tag:'길이 비교',prompt:`가장 ${long?'긴':'짧은'} 길이는?`,explain:'모두 cm로 바꿔서 비교해요: '+v.map(x=>`${x} cm`).join(', ')});});},
  },
  time:{
    low(){return oneOf(
      ()=>{const h=rnd(1,12),m=rnd(1,11)*5;const lab=`${h}시 ${m}분`;return CH(optsWith(lab,[`${h}시 ${m/5}분`,`${h%12+1}시 ${m}분`,`${h}시 ${(m+30)%60||5}분`]),lab,{tag:'몇 시 몇 분',prompt:'시계가 몇 시 몇 분을 가리키고 있을까요?',visual:clockSVG(h,m),explain:`긴바늘이 숫자 ${m/5}을(를) 가리키면 ${m}분이에요. (숫자 한 칸 = 5분)`});},
      ()=>{const q=pick([['1시간은 몇 분일까요?',60,'분'],['하루는 몇 시간일까요?',24,'시간'],['1주일은 며칠일까요?',7,'일'],['1년은 몇 개월일까요?',12,'개월']]);return NUM(q[1],{tag:'시간 단위',prompt:q[0],unit:q[2],explain:`${q[0].replace('일까요?','')} → ${q[1]}${q[2]}`});});},
    mid(){return oneOf(
      ()=>{const b=rnd(1,11)*5;return NUM(60+b,{tag:'시간과 분',prompt:'빈칸에 알맞은 수를 쓰세요.',eqHTML:`1시간 ${b}분 = ${BOX}분`,unit:'분',explain:`1시간 = 60분 → 60 + ${b} = ${60+b}`});},
      ()=>{const n=rnd(13,34)*5;return PAIR('시간','분',Math.floor(n/60),n%60,{tag:'시간과 분',prompt:'빈칸에 알맞은 수를 쓰세요.',eqHTML:`${n}분 = ${BOX}시간 ${BOX}분`,explain:`60분 = 1시간 → ${n}분 = ${Math.floor(n/60)}시간 ${n%60}분`});},
      ()=>{const h=rnd(1,11),m=pick([45,50,55]);const lab=`${h+1}시 ${60-m}분 전`;return CH(optsWith(lab,[`${h}시 ${60-m}분 전`,`${h+1}시 ${m}분 전`,`${h-1||12}시 ${60-m}분 전`]),lab,{tag:'몇 분 전',prompt:`${h}시 ${m}분을 다르게 말하면?`,visual:clockSVG(h,m),explain:`${60-m}분 더 지나면 ${h+1}시 → ${h+1}시 ${60-m}분 전`});},
      ()=>{const a=rnd(8,11),b=rnd(1,5);return NUM(12-a+b,{tag:'오전과 오후',prompt:`오전 ${a}시부터 오후 ${b}시까지는 몇 시간일까요?`,unit:'시간',explain:`오전 ${a}시 → 낮 12시: ${12-a}시간, 12시 → 오후 ${b}시: ${b}시간 → ${12-a+b}시간`});});},
    high(){return oneOf(
      ()=>{const h=rnd(1,9),m1=rnd(0,5)*10,dur=rnd(5,15)*10;const t2=h*60+m1+dur;const tl=(a,b)=>b?`${a}시 ${b}분`:`${a}시`;return NUM(dur,{tag:'걸린 시간',prompt:`${tl(h,m1)}에 시작해서 ${tl(Math.floor(t2/60),t2%60)}에 끝났어요. 걸린 시간은 몇 분일까요?`,unit:'분',explain:`${dur>=60?`${Math.floor(dur/60)}시간 ${dur%60}분 = `:''}${dur}분`});},
      ()=>{const h=rnd(1,8),m=rnd(2,11)*5,ah=rnd(1,2),am=rnd(2,10)*5;const t=(h+ah)*60+m+am;return PAIR('시','분',Math.floor(t/60),t%60,{tag:'시각 구하기',prompt:`${h}시 ${m}분에서 ${ah}시간 ${am}분이 지난 시각은?`,visual:clockSVG(h,m),explain:m+am>=60?`분끼리 더하면 ${m+am}분 → 60분은 1시간으로! ${Math.floor(t/60)}시 ${t%60}분`:`시간끼리, 분끼리 더해요 → ${Math.floor(t/60)}시 ${t%60}분`});},
      ()=>{const d=rnd(1,8),w=rnd(0,6),add=rnd(2,3)*7+rnd(1,6);const ans=WEEK[(w+add)%7]+'요일';return CH(optsWith(ans,WEEK.map(x=>x+'요일')),ans,{tag:'달력',prompt:`어느 달의 ${d}일이 ${WEEK[w]}요일이에요. 같은 달 ${d+add}일은 무슨 요일일까요?`,explain:`7일마다 같은 요일이 돌아와요. ${add}일 = 7 × ${Math.floor(add/7)} + ${add%7} → ${WEEK[w]}요일에서 ${add%7}일 뒤 = ${ans}`});},
      ()=>{const d=rnd(1,3),h=rnd(1,12);return NUM(d*24+h,{tag:'일과 시간',prompt:'빈칸에 알맞은 수를 쓰세요.',eqHTML:`${d}일 ${h}시간 = ${BOX}시간`,unit:'시간',explain:`하루 = 24시간 → ${d*24} + ${h} = ${d*24+h}`});});},
  },
  table:{
    low(){const {head,names,vals}=pickData();const k=rnd(0,3);return NUM(vals[k],{tag:'표 읽기',prompt:`${head}을(를) 조사했어요. ${names[k]}을(를) 좋아하는 학생은 몇 명일까요?`,visual:dataTable(head,'학생 수(명)',names,vals),unit:'명',explain:`표에서 ${names[k]} 칸을 읽으면 ${vals[k]}명`});},
    mid(){return oneOf(
      ()=>{const {head,names,vals}=pickData();const s=vals.reduce((a,b)=>a+b,0);return NUM(s,{tag:'표 정리하기',prompt:'조사한 학생은 모두 몇 명일까요?',visual:dataTable(head,'학생 수(명)',names,vals),unit:'명',explain:vals.join(' + ')+` = ${s}`});},
      ()=>{const {head,names,vals}=pickData();const most=Math.random()<.5;const ans=names[vals.indexOf(most?Math.max(...vals):Math.min(...vals))];return CH(names,ans,{tag:'○ 그래프',prompt:`${head}을(를) 조사한 그래프예요. 가장 ${most?'많은':'적은'} 학생이 좋아하는 것은?`,visual:circleGraph(names,vals),explain:`○가 가장 ${most?'높이':'낮게'} 쌓인 것: ${ans}`});},
      ()=>{const {head,names,vals}=pickData();const k=rnd(0,3);return NUM(vals[k],{tag:'○ 그래프',prompt:`${names[k]}을(를) 좋아하는 학생은 몇 명일까요?`,visual:circleGraph(names,vals),unit:'명',explain:`${names[k]} 위의 ○를 세면 ${vals[k]}개`});});},
    high(){return oneOf(
      ()=>{const {head,names,vals}=pickData();const h=rnd(0,3);return NUM(vals[h],{tag:'빈칸 구하기',prompt:`합계를 보고 ${names[h]}의 학생 수를 구하세요.`,visual:dataTable(head,'학생 수(명)',names,vals,{total:true,hide:h}),unit:'명',explain:`합계에서 나머지를 빼요: ${vals.reduce((a,b)=>a+b,0)} − ${vals.filter((_,k)=>k!==h).join(' − ')} = ${vals[h]}`});},
      ()=>{const {head,names,vals}=pickData();const d=Math.max(...vals)-Math.min(...vals);return NUM(d,{tag:'그래프 비교',prompt:'가장 많은 것은 가장 적은 것보다 몇 명 더 많을까요?',visual:circleGraph(names,vals),unit:'명',explain:`${Math.max(...vals)} − ${Math.min(...vals)} = ${d}`});},
      ()=>{const {head,names,vals}=pickData(1,8);const t=rnd(3,5);const c=vals.filter(v=>v>t).length;return NUM(c,{tag:'그래프 읽기',prompt:`좋아하는 학생이 ${t}명보다 많은 것은 몇 가지일까요?`,visual:circleGraph(names,vals),unit:'가지',explain:`${t}명보다 많은 것: ${names.filter((_,k)=>vals[k]>t).join(', ')||'없음'} → ${c}가지`});},
      ()=>{const {head,names,vals}=pickData();const s=vals.slice().sort((a,b)=>b-a);return NUM(s[0]-s[1],{tag:'표 비교',prompt:'가장 많은 것과 두 번째로 많은 것은 몇 명 차이일까요?',visual:dataTable(head,'학생 수(명)',names,vals),unit:'명',explain:`${s[0]} − ${s[1]} = ${s[0]-s[1]}`});});},
  },
  pattern2:{
    low(){return oneOf(
      ()=>{const s=pick([['🔴','🔵','🟡'],['🍎','🍌','🍇'],['🟥','🟩','🟦']]);const unit=[s[0],s[1],s[2]];const seq=Array.from({length:7},(_,i)=>unit[i%3]);return {tag:'무늬의 규칙',prompt:'규칙을 찾아 다음에 올 것을 고르세요.',visual:`<div style="font-size:40px;letter-spacing:5px">${seq.join('')}<span class="q" style="color:var(--red);font-weight:700">?</span></div>`,options:s.map(x=>({v:x,html:x})),ans:unit[7%3],explain:`${unit.join(' ')} 이(가) 반복돼요.`};},
      ()=>{const st=rnd(1,20),seq=[0,1,2,3].map(k=>st+2*k);return NUM(st+8,{tag:'수의 규칙',prompt:'규칙을 찾아 다음 수를 쓰세요.',eqHTML:`${seq.join(', ')}, ${BOX}`,explain:'2씩 커져요.'});});},
    mid(){return oneOf(
      ()=>{const r0=rnd(1,6),c0=rnd(1,6),rows=[r0,r0+1,r0+2],cols=[c0,c0+1,c0+2],hr=rnd(0,2),hc=rnd(0,2);return NUM(rows[hr]+cols[hc],{tag:'덧셈표',prompt:'덧셈표의 일부예요. ? 에 알맞은 수는?',visual:gridTable('+',rows,cols,hr,hc),explain:`${rows[hr]} + ${cols[hc]} = ${rows[hr]+cols[hc]}`});},
      ()=>{const r0=rnd(2,7),c0=rnd(2,7),rows=[r0,r0+1,r0+2].filter(x=>x<=9),cols=[c0,c0+1,c0+2].filter(x=>x<=9),hr=rnd(0,rows.length-1),hc=rnd(0,cols.length-1);return NUM(rows[hr]*cols[hc],{tag:'곱셈표',prompt:'곱셈표의 일부예요. ? 에 알맞은 수는?',visual:gridTable('×',rows,cols,hr,hc),explain:`${rows[hr]} × ${cols[hc]} = ${rows[hr]*cols[hc]}`});},
      ()=>{const d=pick([3,4,5,6]),st=rnd(1,30),seq=[0,1,2,3].map(k=>st+d*k);return NUM(st+d*4,{tag:'수의 규칙',prompt:'규칙을 찾아 다음 수를 쓰세요.',eqHTML:`${seq.join(', ')}, ${BOX}`,explain:`${d}씩 커지는 규칙이에요.`});},
      ()=>{const st=rnd(1,3),d=2,n=5;return NUM(st+d*(n-1),{tag:'쌓기 규칙',prompt:`블록을 ${st}개, ${st+d}개, ${st+2*d}개, ${st+3*d}개… 로 쌓아요. 다섯째에는 몇 개를 쌓을까요?`,unit:'개',explain:`${d}개씩 늘어나요 → ${st+3*d} + ${d} = ${st+4*d}`});});},
    high(){return oneOf(
      ()=>{const a=rnd(1,4);const seq=[a];for(let k=1;k<5;k++)seq.push(seq[k-1]+k);return NUM(seq[4]+5,{tag:'늘어나는 규칙',prompt:'규칙을 찾아 다음 수를 쓰세요.',eqHTML:`${seq.join(', ')}, ${BOX}`,explain:'더하는 수가 1, 2, 3, 4…로 하나씩 커져요. 다음은 +5!'});},
      ()=>{const dir=pick([['↘',8],['↙',6],['↓',7]]);return NUM(dir[1],{tag:'달력의 규칙',prompt:`달력에서 ${dir[0]} 방향으로 한 칸 가면 날짜가 몇씩 커질까요?`,visual:`<table style="border-collapse:collapse;margin:auto">${[0,1,2].map(r=>`<tr>${[0,1,2,3,4,5,6].map(c=>TD(r*7+c+1)).join('')}</tr>`).join('')}</table>`,explain:dir[0]==='↓'?'한 주는 7일 → 아래로 7씩':dir[0]==='↘'?'아래로 7 + 오른쪽으로 1 → 8씩':'아래로 7 − 왼쪽으로 1 → 6씩'});},
      ()=>{const a=rnd(1,3);const seq=[0,1,2,3].map(k=>a*Math.pow(2,k));return NUM(a*16,{tag:'곱하는 규칙',prompt:'규칙을 찾아 다음 수를 쓰세요.',eqHTML:`${seq.join(', ')}, ${BOX}`,explain:'앞의 수에 2를 곱해요.'});},
      ()=>{const n=pick([3,4,5,6]);return NUM(n*n,{tag:'쌓기 규칙',prompt:`정사각형 모양으로 1개, 4개, 9개, 16개… 바둑돌을 놓아요. ${n}째에는 몇 개일까요?`,unit:'개',explain:`${n}째는 한 줄에 ${n}개씩 ${n}줄 → ${n} × ${n} = ${n*n}`});},
      ()=>{const r0=rnd(2,6),c0=rnd(2,6);return NUM(2,{tag:'덧셈표의 규칙',prompt:'덧셈표에서 ↘ 방향(오른쪽 아래)으로 한 칸 가면 수가 몇씩 커질까요?',visual:gridTable('+',[r0,r0+1,r0+2],[c0,c0+1,c0+2],-1,-1),explain:'오른쪽으로 1, 아래로 1 커지니까 ↘ 방향은 2씩 커져요.'});});},
  },
};
