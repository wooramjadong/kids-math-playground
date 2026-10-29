/* ───────── 📚 3학년 · 4학년 단원 + 전체 교육과정 표(CUR) ─────────
   기존 3-1(GEN31) · 4-1(GEN41) · 4-2(GEN42) 문제는 '중'과 '상'으로 쓰고, '하'와 '상' 문제를 더했어요.
   3학년 2학기는 2022 개정 단원(곱셈 · 나눗셈 · 원 · 분수 · 들이와 무게 · 그림그래프)으로 새로 짰어요. */

const FRAC=(n,d,o)=>Object.assign({input:{type:'frac',fields:['n','d']},check:v=>v.d>0&&v.n*d===n*v.d,solHTML:fracHTML(n,d)},o);
const MIXED=(N,d,o)=>{const w=Math.floor(N/d),r=N%d;return Object.assign({input:{type:'frac',fields:['w','n','d']},check:v=>v.d>0&&v.n<v.d&&(v.w*v.d+v.n)*d===N*v.d,solHTML:fracHTML(r,d,w)},o);};
const DEC=(ans,o)=>Object.assign({input:{type:'num',decimal:true},ans,solText:String(ans)},o);
const r2=x=>Math.round(x*100)/100;

/* ════════════ 3학년 1학기 ════════════ */
const G31={
  addsub:{
    low(){const a2=rnd(1,8),b2=rnd(1,9-a2),a1=rnd(0,9),b1=rnd(0,9-a1),a0=rnd(0,9),b0=rnd(0,9-a0);const a=a2*100+a1*10+a0,b=b2*100+b1*10+b0;
      return Math.random()<.5?NUM(a+b,{tag:'세 자리 수 덧셈',prompt:'계산해 보세요.',eqHTML:`${a} + ${b} =`,explain:'같은 자리끼리 더해요.'})
        :NUM(a,{tag:'세 자리 수 뺄셈',prompt:'계산해 보세요.',eqHTML:`${a+b} − ${b} =`,explain:'같은 자리끼리 빼요.'});},
    mid:i=>GEN31.addsub(i,false),
    high(i){return oneOf(()=>GEN31.addsub(i,true),()=>GEN31.addsub(i,true),
      ()=>{const x=rnd(350,700),k=rnd(120,299);return NUM(x+k,{tag:'잘못 계산한 문제',prompt:`어떤 수에 ${k}를 더해야 할 것을 잘못하여 뺐더니 ${x-k}가 되었어요. 바르게 계산하면 얼마일까요?`,explain:`어떤 수 = ${x-k} + ${k} = ${x}. 바른 계산: ${x} + ${k} = ${x+k}`});});},
  },
  shape:{
    low(){const k=pick(['직사각형','정사각형','직각삼각형']);const other=k==='직각삼각형'?pick(['원','사각형']):pick(['원','삼각형']);const colors=['#FDE68A','#BFDBFE','#FBCFE8'];
      return {tag:'평면도형',prompt:`${k}은 어느 것일까요?`,input:{type:'choice',options:shuffle([k,other]).map(o=>({v:o,html:polySVG(o,pick(colors))}))},check:v=>v===k,sol:k,explain:k==='직각삼각형'?'한 각이 직각인 삼각형이에요.':k==='정사각형'?'네 각이 직각이고 네 변의 길이가 모두 같아요.':'네 각이 모두 직각인 사각형이에요.'};},
    mid:i=>GEN31.shape(i,false),
    high(i){return oneOf(()=>GEN31.shape(i,true),()=>GEN31.shape(i,true),
      ()=>{const s=rnd(3,9),a=s+rnd(2,6);return NUM(2*(a+s)-4*s,{tag:'둘레 비교',prompt:`가로 ${a} cm, 세로 ${s} cm인 직사각형과 한 변이 ${s} cm인 정사각형이 있어요. 네 변의 길이의 합은 직사각형이 몇 cm 더 길까요?`,unit:'cm',explain:`직사각형 ${2*(a+s)} cm, 정사각형 ${4*s} cm → ${2*(a+s)-4*s} cm`});});},
  },
  div:{
    low(){const b=pick([2,5]),q=rnd(1,9);return NUM(q,{tag:'나눗셈',prompt:'몫을 구하세요.',eqHTML:`${b*q} ÷ ${b} =`,explain:`${b} × ${q} = ${b*q}`});},
    mid:i=>GEN31.div(i,false),
    high(i){return oneOf(()=>GEN31.div(i,true),()=>GEN31.div(i,true),
      ()=>{const b=rnd(2,5),q=rnd(1,4),x=b*q;return NUM(q,{tag:'잘못 계산한 문제',prompt:`어떤 수를 ${b}로 나누어야 할 것을 잘못하여 ${b}를 곱했더니 ${x*b}이 되었어요. 바르게 계산하면 얼마일까요?`,explain:`어떤 수 = ${x*b} ÷ ${b} = ${x}. 바른 계산: ${x} ÷ ${b} = ${q}`});});},
  },
  mul:{
    low(){return oneOf(
      ()=>{const a=rnd(1,9)*10,b=rnd(2,9);return NUM(a*b,{tag:'(몇십)×(몇)',prompt:'계산해 보세요.',eqHTML:`${a} × ${b} =`,explain:`${a/10} × ${b} = ${a/10*b} 이니까 ${a*b}`});},
      ()=>{const b=rnd(2,4),a1=rnd(1,Math.floor(9/b)),a0=rnd(0,Math.floor(9/b)),a=a1*10+a0;return NUM(a*b,{tag:'올림 없는 곱셈',prompt:'계산해 보세요.',eqHTML:`${a} × ${b} =`,explain:`${a0} × ${b} = ${a0*b}, ${a1}0 × ${b} = ${a1*10*b} → ${a*b}`});});},
    mid:i=>GEN31.mul(i,false),
    high(i){return oneOf(()=>GEN31.mul(i,true),()=>GEN31.mul(i,true),
      ()=>{const d=shuffle([2,3,4,5,6,7,8,9]).slice(0,3);let best=0,bl='';permsOf(d).forEach(p=>{const v=(p[0]*10+p[1])*p[2];if(v>best){best=v;bl=`${p[0]}${p[1]} × ${p[2]}`;}});
        return NUM(best,{tag:'숫자 카드 곱셈',prompt:'숫자 카드 3장을 한 번씩 써서 (두 자리 수) × (한 자리 수)를 만들 때, 가장 큰 곱은?',visual:`<div style="font-size:28px;font-weight:700">${cardsHTML(d)}</div>`,explain:`${bl} = ${best}. 곱하는 한 자리 수에 가장 큰 숫자를 놓는 게 핵심이에요.`});});},
  },
  lentime:{
    low(){const q=pick([['1 cm = □ mm',10,'mm'],['1 km = □ m',1000,'m'],['1분 = □초',60,'초']].concat([(()=>{const n=rnd(2,9);return [`${n} cm = □ mm`,n*10,'mm'];})(),(()=>{const n=rnd(2,9);return [`${n} km = □ m`,n*1000,'m'];})(),(()=>{const n=rnd(2,5);return [`${n}분 = □초`,n*60,'초'];})()]));
      return NUM(q[1],{tag:'단위 알기',prompt:'빈칸에 알맞은 수를 쓰세요.',eqHTML:q[0].replace('□',BOX),unit:q[2],explain:'1 cm = 10 mm, 1 km = 1000 m, 1분 = 60초'});},
    mid:i=>GEN31.lentime(i,false),
    high:i=>GEN31.lentime(i,true),
  },
  fracdec:{
    low(){return oneOf(
      ()=>{const d=rnd(2,4);return FRAC(1,d,{tag:'분수',prompt:'색칠한 부분은 전체의 얼마인가요?',visual:pick([pieSVG,barSVG])(1,d),explain:`똑같이 ${d}로 나눈 것 중의 1 → 1/${d}`});},
      ()=>{const n=rnd(1,9);return DEC(n/10,{tag:'소수',prompt:`0.1이 ${n}개인 수는?`,solText:`0.${n}`,explain:`0.1이 ${n}개 → 0.${n}`});});},
    mid:i=>GEN31.fracdec(i,false),
    high(i){return oneOf(()=>GEN31.fracdec(i,true),()=>GEN31.fracdec(i,true),
      ()=>{const k=rnd(5,9);return NUM(k-2,{tag:'단위분수 심화',prompt:`1보다 큰 자연수 □ 중에서 ${fracHTML(1,'□')} 이 ${fracHTML(1,k)} 보다 큰 것은 모두 몇 개일까요?`,unit:'개',explain:`단위분수는 분모가 작을수록 커요. □ = 2, 3, …, ${k-1} → ${k-2}개`});});},
  },
};

/* ════════════ 3학년 2학기 ════════════ */
function circleParts(mark){const R=60,c=75,red='#E8432F',ink='#2B2A33';
  return `<svg width="150" height="150" viewBox="0 0 150 150"><circle cx="${c}" cy="${c}" r="${R}" fill="#E0F2FE" stroke="${ink}" stroke-width="3"/>`+
    (mark==='diameter'?`<line x1="${c-R}" y1="${c}" x2="${c+R}" y2="${c}" stroke="${red}" stroke-width="4"/>`:'')+
    (mark==='radius'?`<line x1="${c}" y1="${c}" x2="${(c+R*Math.cos(-.8)).toFixed(1)}" y2="${(c+R*Math.sin(-.8)).toFixed(1)}" stroke="${red}" stroke-width="4"/>`:'')+
    `<circle cx="${c}" cy="${c}" r="${mark==='center'?7:4}" fill="${mark==='center'?red:ink}"/></svg>`;}
function rowCircles(n,overlap){const r=22,step=overlap?r:2*r,W=step*(n-1)+2*r+8;let s='';
  for(let k=0;k<n;k++){const cx=4+r+step*k;s+=`<circle cx="${cx}" cy="${r+4}" r="${r}" fill="${overlap?'rgba(147,197,253,.35)':'#E0F2FE'}" stroke="#2B2A33" stroke-width="2.5"/><circle cx="${cx}" cy="${r+4}" r="2.5" fill="#2B2A33"/>`;}
  s+=`<line x1="4" y1="${2*r+16}" x2="${W-4}" y2="${2*r+16}" stroke="#E8432F" stroke-width="2"/><text x="${W/2}" y="${2*r+30}" font-size="13" font-weight="700" text-anchor="middle" fill="#E8432F">? cm</text>`;
  return `<svg width="${W}" height="${2*r+36}" viewBox="0 0 ${W} ${2*r+36}">${s}</svg>`;}
function rectCircles(n){const r=22,W=2*r*n+8;let s=`<rect x="4" y="4" width="${2*r*n}" height="${2*r}" fill="#FEF9C3" stroke="#2B2A33" stroke-width="3"/>`;
  for(let k=0;k<n;k++)s+=`<circle cx="${4+r+2*r*k}" cy="${4+r}" r="${r}" fill="#E0F2FE" stroke="#2B2A33" stroke-width="2.5"/>`;
  return `<svg width="${W}" height="${2*r+8}" viewBox="0 0 ${W} ${2*r+8}">${s}</svg>`;}
function bigTwoCircles(){return `<svg width="150" height="150" viewBox="0 0 150 150"><circle cx="75" cy="75" r="64" fill="#E0F2FE" stroke="#2B2A33" stroke-width="3"/><circle cx="43" cy="75" r="32" fill="#FDE68A" stroke="#2B2A33" stroke-width="2.5"/><circle cx="107" cy="75" r="32" fill="#FDE68A" stroke="#2B2A33" stroke-width="2.5"/><circle cx="75" cy="75" r="3" fill="#2B2A33"/></svg>`;}
const PICSETS=[['마을별 사과 수확량','상자','🍎',['가 마을','나 마을','다 마을','라 마을']],['반별 모은 빈 병','개','🧴',['1반','2반','3반','4반']],['농장별 소의 수','마리','🐮',['가 농장','나 농장','다 농장','라 농장']]];
function picGraph(set,vals,big,small){const [head,u,icon,names]=set;
  const row=(n,v)=>{const b=Math.floor(v/big),s=Math.round((v%big)/small);return `<tr>${TH(n)}<td style="border:2px solid #26282F;padding:4px 8px;text-align:left;line-height:1.1">${`<span style="font-size:28px">${icon}</span>`.repeat(b)}${`<span style="font-size:15px">${icon}</span>`.repeat(s)}</td></tr>`;};
  return `<table style="border-collapse:collapse;margin:auto"><tr>${TH(head.split('별')[0])}${TH(head)}</tr>${names.map((n,k)=>row(n,vals[k])).join('')}</table><div style="font-size:13px;margin-top:6px"><span style="font-size:24px">${icon}</span> ${big}${u} &nbsp; <span style="font-size:14px">${icon}</span> ${small}${u}</div>`;}
const picVals=(big,small)=>{let v;do{v=Array.from({length:4},()=>rnd(1,4)*big+rnd(0,6)*small);}while(new Set(v).size<4);return v;};

const G32={
  mul:{
    low(){return oneOf(
      ()=>{const a=rnd(2,9)*10,b=rnd(2,9);return NUM(a*b,{tag:'(몇십)×(몇)',prompt:'계산해 보세요.',eqHTML:`${a} × ${b} =`,explain:`${a/10} × ${b} = ${a/10*b} → 뒤에 0을 붙여 ${a*b}`});},
      ()=>{const a=rnd(2,9)*10,b=rnd(2,9)*10;return NUM(a*b,{tag:'(몇십)×(몇십)',prompt:'계산해 보세요.',eqHTML:`${a} × ${b} =`,explain:`${a/10} × ${b/10} = ${a*b/100} → 0을 두 개 붙여 ${a*b}`});});},
    mid(){return oneOf(
      ()=>{const a=rnd(102,499),b=rnd(2,9);return NUM(a*b,{tag:'(세 자리)×(한 자리)',prompt:'계산해 보세요.',eqHTML:`${a} × ${b} =`,explain:`일·십·백의 자리 순서로 곱하고 올림한 수를 더해요. ${a} × ${b} = ${a*b}`});},
      ()=>{const a=rnd(12,49),b=rnd(11,39);return NUM(a*b,{tag:'(두 자리)×(두 자리)',prompt:'계산해 보세요.',eqHTML:`${a} × ${b} =`,explain:`${a} × ${b%10} = ${a*(b%10)}, ${a} × ${b-b%10} = ${a*(b-b%10)} → 더하면 ${a*b}`});},
      ()=>{const a=rnd(2,9)*10,b=rnd(11,49);return NUM(a*b,{tag:'(몇십)×(몇십몇)',prompt:'계산해 보세요.',eqHTML:`${a} × ${b} =`,explain:`${a/10} × ${b} = ${a/10*b} → 0을 붙여 ${a*b}`});});},
    high(){return oneOf(
      ()=>{const b=rnd(3,9),a2=rnd(1,3),d=rnd(0,9),a0=rnd(1,9),a=a2*100+d*10+a0;return NUM(d,{tag:'곱셈 빈칸',prompt:'□ 안에 알맞은 숫자를 쓰세요.',eqHTML:`${a2}${BOX}${a0} × ${b} = ${a*b}`,explain:`${a*b} ÷ ${b} = ${a} → □ = ${d}`});},
      ()=>{const x=rnd(21,68),b=rnd(12,29);return NUM(x*b,{tag:'잘못 계산한 문제',prompt:`어떤 수에 ${b}를 곱해야 할 것을 잘못하여 더했더니 ${x+b}가 되었어요. 바르게 계산하면 얼마일까요?`,explain:`어떤 수 = ${x+b} − ${b} = ${x}. 바른 계산: ${x} × ${b} = ${x*b}`});},
      ()=>{const d=shuffle([1,2,3,4,5,6,7,8,9]).slice(0,4);let best=0,bl='';permsOf(d).forEach(p=>{const v=(p[0]*10+p[1])*(p[2]*10+p[3]);if(v>best){best=v;bl=`${p[0]}${p[1]} × ${p[2]}${p[3]}`;}});
        return NUM(best,{tag:'숫자 카드 곱셈',prompt:'숫자 카드 4장을 한 번씩 써서 (두 자리 수) × (두 자리 수)를 만들 때, 가장 큰 곱은?',visual:`<div style="font-size:28px;font-weight:700">${cardsHTML(d)}</div>`,explain:`${bl} = ${best}. 가장 큰 두 숫자를 각각 십의 자리에 놓아요.`});},
      ()=>{const per=rnd(12,30),box=rnd(12,25),give=rnd(20,99);return NUM(per*box-give,{tag:'두 단계 문장제',prompt:`연필이 한 상자에 ${per}자루씩 ${box}상자 있어요. 그중 ${give}자루를 나누어 주면 남는 연필은 몇 자루일까요?`,unit:'자루',explain:`${per} × ${box} = ${per*box}, ${per*box} − ${give} = ${per*box-give}`});});},
  },
  div:{
    low(){return oneOf(
      ()=>{const b=rnd(2,4),q=rnd(1,Math.floor(9/b));return NUM(q*10,{tag:'(몇십)÷(몇)',prompt:'계산해 보세요.',eqHTML:`${b*q*10} ÷ ${b} =`,explain:`${b*q} ÷ ${b} = ${q} → 0을 붙여 ${q*10}`});},
      ()=>{const b=rnd(3,9),q=rnd(2,9);return NUM(q,{tag:'나눗셈',prompt:'몫을 구하세요.',eqHTML:`${b*q} ÷ ${b} =`,explain:`${b} × ${q} = ${b*q}`});});},
    mid(){return oneOf(
      ()=>{const b=rnd(2,6),q=rnd(12,Math.floor(99/b));return NUM(q,{tag:'(두 자리)÷(한 자리)',prompt:'몫을 구하세요.',eqHTML:`${b*q} ÷ ${b} =`,explain:`${b} × ${q} = ${b*q}`});},
      ()=>{const b=rnd(3,9),r=rnd(1,b-1),q=rnd(5,Math.floor((99-r)/b));const n=b*q+r;return Object.assign(PAIR('몫','나머지',q,r),{tag:'몫과 나머지',prompt:'몫과 나머지를 구하세요.',eqHTML:`${n} ÷ ${b} =`,sol:`몫 ${q}, 나머지 ${r}`,explain:`${b} × ${q} = ${b*q}, ${n} − ${b*q} = ${r}. 나머지는 ${b}보다 작아야 해요.`});},
      ()=>{const b=rnd(2,9),q=rnd(Math.ceil(100/b),Math.min(199,Math.floor(999/b)));return NUM(q,{tag:'(세 자리)÷(한 자리)',prompt:'몫을 구하세요.',eqHTML:`${b*q} ÷ ${b} =`,explain:`${b} × ${q} = ${b*q}`});});},
    high(){return oneOf(
      ()=>{const b=rnd(4,9),q=rnd(8,25),r=rnd(1,b-1);return NUM(b*q+r,{tag:'어떤 수 구하기',prompt:`어떤 수를 ${b}로 나누었더니 몫이 ${q}, 나머지가 ${r}이었어요. 어떤 수는?`,explain:`${b} × ${q} + ${r} = ${b*q+r}`});},
      ()=>{const b=rnd(3,9);return NUM(b-1,{tag:'나머지의 크기',prompt:`□ ÷ ${b}의 나머지가 될 수 있는 수 중에서 가장 큰 수는?`,explain:`나머지는 나누는 수(${b})보다 작아야 해요 → ${b-1}`});},
      ()=>{const b=rnd(4,8);let n=rnd(30,70);if(n%b===0)n++;const ans=Math.ceil(n/b);return NUM(ans,{tag:'나머지 생각하기',prompt:`학생 ${n}명이 긴 의자 하나에 ${b}명씩 앉으려고 해요. 모두 앉으려면 긴 의자는 적어도 몇 개 필요할까요?`,unit:'개',explain:`${n} ÷ ${b} = ${Math.floor(n/b)} … ${n%b}. 남은 ${n%b}명도 앉아야 하니까 ${ans}개`});},
      ()=>{const b=rnd(3,9),q=rnd(12,30);let r=rnd(1,b-1);if(r===q)r=1;const n=b*q+r;const ok=`${b} × ${q} + ${r} = ${n}`;return CH(shuffle([ok,`${b} × ${r} + ${q} = ${n}`,`${q} × ${r} + ${b} = ${n}`]),ok,{tag:'검산',prompt:`${n} ÷ ${b} = ${q} … ${r} 를 바르게 검산한 식은?`,explain:'(나누는 수) × (몫) + (나머지) = (나누어지는 수)'});});},
  },
  circle:{
    low(){return oneOf(
      ()=>{const m=pick(['center','radius','diameter']);const ans={center:'원의 중심',radius:'반지름',diameter:'지름'}[m];return CH(['원의 중심','반지름','지름'],ans,{tag:'원의 구성',prompt:'빨간색으로 표시한 것의 이름은?',visual:circleParts(m),explain:m==='center'?'원의 한가운데 점이 원의 중심이에요.':m==='radius'?'원의 중심에서 원 위의 한 점까지 이은 선분이 반지름이에요.':'원의 중심을 지나 원 위의 두 점을 이은 선분이 지름이에요.'});},
      ()=>NUM(2,{tag:'지름과 반지름',prompt:'한 원에서 지름은 반지름의 몇 배일까요?',unit:'배',visual:circleParts('diameter'),explain:'지름 = 반지름 × 2'}));},
    mid(){return oneOf(
      ()=>{const r=rnd(2,15);return NUM(2*r,{tag:'지름 구하기',prompt:`반지름이 ${r} cm인 원의 지름은 몇 cm일까요?`,unit:'cm',visual:circleParts('radius'),explain:`지름 = 반지름 × 2 = ${2*r} cm`});},
      ()=>{const d=rnd(2,15)*2;return NUM(d/2,{tag:'반지름 구하기',prompt:`지름이 ${d} cm인 원의 반지름은 몇 cm일까요?`,unit:'cm',visual:circleParts('diameter'),explain:`반지름 = 지름 ÷ 2 = ${d/2} cm`});},
      ()=>CH(['1개','2개','셀 수 없이 많아요'],'셀 수 없이 많아요',{tag:'원의 성질',prompt:'한 원에서 반지름은 몇 개 그을 수 있을까요?',explain:'원의 중심에서 원 위의 점까지 어디든 그을 수 있어서 셀 수 없이 많아요. 길이는 모두 같아요!'}),
      ()=>CH(['지름','반지름','원의 중심'],'지름',{tag:'원의 성질',prompt:'원 안에 그을 수 있는 가장 긴 선분은?',explain:'원의 중심을 지나는 선분, 지름이 가장 길어요.'}));},
    high(){return oneOf(
      ()=>{const n=rnd(3,5),r=rnd(2,6);return NUM(2*r*n,{tag:'원 늘어놓기',prompt:`반지름이 ${r} cm인 원 ${n}개를 맞닿게 한 줄로 놓았어요. 왼쪽 끝에서 오른쪽 끝까지는 몇 cm일까요?`,visual:rowCircles(n,false),unit:'cm',explain:`원 하나의 지름 = ${2*r} cm. ${2*r} × ${n} = ${2*r*n} cm`});},
      ()=>{const n=rnd(2,4),d=rnd(2,6)*2;return NUM(2*(n*d+d),{tag:'원과 직사각형',prompt:`직사각형 안에 지름이 ${d} cm인 원 ${n}개가 꼭 맞게 들어 있어요. 직사각형의 네 변의 길이의 합은?`,visual:rectCircles(n),unit:'cm',explain:`가로 = ${d} × ${n} = ${n*d} cm, 세로 = ${d} cm → (${n*d} + ${d}) × 2 = ${2*(n*d+d)} cm`});},
      ()=>{const D=rnd(3,10)*4;return NUM(D/4,{tag:'큰 원과 작은 원',prompt:`큰 원 안에 크기가 같은 작은 원 2개가 꼭 맞게 들어 있어요. 큰 원의 지름이 ${D} cm일 때, 작은 원의 반지름은?`,visual:bigTwoCircles(),unit:'cm',explain:`작은 원의 지름 = ${D} ÷ 2 = ${D/2} cm → 반지름 = ${D/4} cm`});},
      ()=>{const n=rnd(3,5),r=rnd(2,6);return NUM(r*(n+1),{tag:'겹쳐 놓은 원',prompt:`반지름이 ${r} cm인 원 ${n}개를 옆 원의 중심을 지나도록 겹쳐 놓았어요. 왼쪽 끝에서 오른쪽 끝까지는 몇 cm일까요?`,visual:rowCircles(n,true),unit:'cm',explain:`반지름이 ${n+1}번 이어져요 → ${r} × ${n+1} = ${r*(n+1)} cm`});});},
  },
  frac:{
    low(){const d=rnd(2,6),n=rnd(1,d-1);return FRAC(n,d,{tag:'그림 보고 분수 쓰기',prompt:'색칠한 부분은 전체의 얼마인가요?',visual:pick([pieSVG,barSVG])(n,d),explain:`전체를 ${d}칸으로 나눈 것 중 ${n}칸이에요.`});},
    mid:()=>GEN3.frac(null,rnd(2,5)),
    high(){return oneOf(()=>HARD3.frac(),()=>HARD3.frac(),
      ()=>{const d=rnd(5,9);return FRAC(d-1,d,{tag:'진분수 심화',prompt:`분모가 ${d}인 진분수 중에서 가장 큰 분수를 쓰세요.`,explain:`진분수는 분자가 분모보다 작아요. 분자가 가장 큰 ${d-1}일 때 → ${d-1}/${d}`});},
      ()=>{const d=rnd(3,9);return NUM(d,{tag:'가분수 심화',prompt:`${fracHTML('□',d)} 가 가분수일 때, □ 안에 들어갈 수 있는 가장 작은 자연수는?`,explain:`가분수는 분자가 분모와 같거나 커요 → ${d}`});},
      ()=>{const d=pick([3,4,5,6]),per=rnd(3,6),n=rnd(1,d-1),T=d*per;return NUM(T-per*n,{tag:'분수만큼 남은 양',prompt:`사탕 ${T}개 중에서 ${fracHTML(n,d)}을 먹었어요. 남은 사탕은 몇 개일까요?`,unit:'개',explain:`${T}의 1/${d} = ${per}개, 먹은 것 ${per*n}개 → ${T} − ${per*n} = ${T-per*n}`});});},
  },
  unit:{
    low(){return oneOf(
      ()=>pick([NUM(1000,{tag:'들이의 단위',prompt:'1 L는 몇 mL일까요?',unit:'mL',explain:'1 L = 1000 mL'}),NUM(1000,{tag:'무게의 단위',prompt:'1 kg은 몇 g일까요?',unit:'g',explain:'1 kg = 1000 g'})]),
      ()=>{const it=pick([['우유갑의 들이는 약 200','mL','L'],['욕조의 들이는 약 200','L','mL'],['수박의 무게는 약 5','kg','g'],['연필 한 자루의 무게는 약 5','g','kg'],['물병의 들이는 약 500','mL','L']]);return CH(shuffle([it[1],it[2]]),it[1],{tag:'알맞은 단위',prompt:`${it[0]} □ 예요. □에 알맞은 단위는?`,explain:`${it[0]} ${it[1]}가 알맞아요.`});});},
    mid:()=>GEN3.unit(),
    high(){return oneOf(()=>HARD3.unit(),()=>HARD3.unit(),
      ()=>{const a=rnd(1,4)*1000+rnd(1,19)*50;let b=rnd(1,4)*1000+rnd(1,19)*50;if(b===a)b+=50;const f=x=>`${Math.floor(x/1000)} L ${x%1000} mL`;return NUM(Math.abs(a-b),{tag:'들이 비교',prompt:`가 물통에는 ${f(a)}, 나 물통에는 ${f(b)}가 들어가요. 두 물통의 들이는 몇 mL 차이가 날까요?`,unit:'mL',explain:`${a} mL와 ${b} mL → ${Math.abs(a-b)} mL 차이`});});},
  },
  picgraph:{
    low(){const set=pick(PICSETS);let v;do{v=Array.from({length:4},()=>rnd(1,3)*10+rnd(0,5));}while(new Set(v).size<4);const k=rnd(0,3);return NUM(v[k],{tag:'그림그래프 읽기',prompt:`${set[3][k]}은(는) 몇 ${set[1]}일까요?`,visual:picGraph(set,v,10,1),unit:set[1],explain:`큰 그림 ${Math.floor(v[k]/10)}개 = ${Math.floor(v[k]/10)*10}, 작은 그림 ${v[k]%10}개 → ${v[k]}`});},
    mid(){const set=pick(PICSETS),v=picVals(10,1);return oneOf(
      ()=>{const k=rnd(0,3);return NUM(v[k],{tag:'그림그래프 읽기',prompt:`${set[3][k]}은(는) 몇 ${set[1]}일까요?`,visual:picGraph(set,v,10,1),unit:set[1],explain:`큰 그림은 10, 작은 그림은 1 → ${v[k]}`});},
      ()=>{const most=Math.random()<.5;const ans=set[3][v.indexOf(most?Math.max(...v):Math.min(...v))];return CH(set[3],ans,{tag:'그림그래프 비교',prompt:`가장 ${most?'많은':'적은'} 곳은 어디일까요?`,visual:picGraph(set,v,10,1),explain:'큰 그림의 수를 먼저 비교하고, 같으면 작은 그림을 비교해요.'});},
      ()=>{const [i,j]=shuffle([0,1,2,3]).slice(0,2);return NUM(v[i]+v[j],{tag:'그림그래프 읽기',prompt:`${set[3][i]}과(와) ${set[3][j]}을(를) 합하면 몇 ${set[1]}일까요?`,visual:picGraph(set,v,10,1),unit:set[1],explain:`${v[i]} + ${v[j]} = ${v[i]+v[j]}`});});},
    high(){const set=pick(PICSETS);return oneOf(
      ()=>{const v=picVals(10,1),s=v.reduce((a,b)=>a+b,0);return NUM(s,{tag:'그림그래프 합계',prompt:`네 곳을 모두 합하면 몇 ${set[1]}일까요?`,visual:picGraph(set,v,10,1),unit:set[1],explain:v.join(' + ')+` = ${s}`});},
      ()=>{const v=picVals(10,1),d=Math.max(...v)-Math.min(...v);return NUM(d,{tag:'그림그래프 비교',prompt:`가장 많은 곳은 가장 적은 곳보다 몇 ${set[1]} 더 많을까요?`,visual:picGraph(set,v,10,1),unit:set[1],explain:`${Math.max(...v)} − ${Math.min(...v)} = ${d}`});},
      ()=>{const v=picVals(100,10),k=rnd(0,3);return NUM(v[k],{tag:'큰 단위 그림그래프',prompt:`큰 그림은 100, 작은 그림은 10을 나타내요. ${set[3][k]}은(는) 몇 ${set[1]}일까요?`,visual:picGraph(set,v,100,10),unit:set[1],explain:`큰 그림 ${Math.floor(v[k]/100)}개 = ${Math.floor(v[k]/100)*100}, 작은 그림 ${(v[k]%100)/10}개 = ${v[k]%100} → ${v[k]}`});},
      ()=>{const n=rnd(2,4)*10+rnd(1,8);return Object.assign(PAIR('개(큰 그림)','개(작은 그림)',Math.floor(n/10),n%10),{tag:'그림그래프로 나타내기',prompt:`큰 그림 = 10${set[1]}, 작은 그림 = 1${set[1]}일 때, ${n}${set[1]}를 나타내려면 큰 그림과 작은 그림이 각각 몇 개 필요할까요? (큰 그림을 최대한 많이)`,sol:`큰 그림 ${Math.floor(n/10)}개, 작은 그림 ${n%10}개`,explain:`${n} = 10 × ${Math.floor(n/10)} + ${n%10}`});});},
  },
};

/* ════════════ 4학년 1학기 ════════════ */
const G41={
  bignum:{
    low(){return oneOf(
      ()=>pick([NUM(10000,{tag:'만',prompt:'9999보다 1 큰 수는?',explain:'9999 다음 수는 10000(만)이에요.'}),NUM(10000,{tag:'만',prompt:'1000이 10개인 수는?',explain:'1000이 10개면 10000(만)'}),NUM(10000,{tag:'만',prompt:'9000보다 1000 큰 수는?',explain:'9000 + 1000 = 10000'})]),
      ()=>{const n=rnd(2,9);const ok=readKo(n*10000);return CH(shuffle([ok,readKo(n*1000),readKo(n*100000)]),ok,{tag:'큰 수 읽기',prompt:`${fmt(n*10000)}을 바르게 읽은 것은?`,explain:'10000이 몇 개인지 세면 몇만이에요.'});},
      ()=>{const a=rnd(1,9),b=rnd(1,9);return NUM(a*10000+b*1000,{tag:'다섯 자리 수',prompt:`10000이 ${a}개, 1000이 ${b}개인 수는?`,solText:fmt(a*10000+b*1000),explain:`${a}0000 + ${b}000 = ${a*10000+b*1000}`});});},
    mid:i=>GEN41.bignum(i,false),
    high(){return oneOf(()=>HARD3.bignum(),()=>HARD3.bignum(),
      ()=>{const k=rnd(3,5),end=rnd(2,9)*100000000+rnd(1,9)*10000000;const st=end-10000000*k;return NUM(st,{tag:'거꾸로 뛰어 세기',prompt:`어떤 수에서 1000만씩 ${k}번 뛰어 세었더니 ${readKo(end)}이 되었어요. 어떤 수를 숫자로 쓰세요.`,solText:fmt(st),explain:`${readKo(end)}에서 1000만씩 ${k}번 거꾸로 세면 ${readKo(st)}`});},
      ()=>{const a=rnd(10,99)*1000000+rnd(0,999999);let b=a+pick([-1,1])*pick([10000,100000,1000000]);const ans=cmpAns(a,b);return CH(['>','<'],ans,{input:{type:'choice',options:['>','<'],big:true},tag:'큰 수 비교',prompt:'○ 안에 알맞은 것을 고르세요.',eqHTML:`<span class="small">${fmt(a)} <span class="op">○</span> ${fmt(b)}</span>`,explain:'자리 수가 같으면 가장 높은 자리부터 차례로 비교해요.'});});},
  },
  angle:{
    low:()=>GEN3.angle(null,0),
    mid:i=>GEN41.angle(i,false),
    high(){return oneOf(()=>HARD3.angle(),()=>HARD3.angle(),
      ()=>{const a=rnd(60,120),b=rnd(60,120),c=rnd(50,Math.min(140,330-a-b));return NUM(360-a-b-c,{tag:'사각형의 네 각',prompt:`사각형의 세 각이 ${a}°, ${b}°, ${c}°예요. 나머지 한 각은?`,unit:'°',explain:`사각형의 네 각의 합은 360°. 360 − ${a} − ${b} − ${c} = ${360-a-b-c}`});},
      ()=>{const a=rnd(35,150),b=rnd(25,a-10);return Math.random()<.5?NUM(a+b,{tag:'각도의 합',prompt:`${a}° + ${b}° 는 몇 도일까요?`,unit:'°',explain:`${a} + ${b} = ${a+b}`}):NUM(a-b,{tag:'각도의 차',prompt:`${a}° − ${b}° 는 몇 도일까요?`,unit:'°',explain:`${a} − ${b} = ${a-b}`});});},
  },
  muldiv:{
    low(){return oneOf(
      ()=>{const a=rnd(2,9)*100,b=rnd(2,9)*10;return NUM(a*b,{tag:'(몇백)×(몇십)',prompt:'계산해 보세요.',eqHTML:`${a} × ${b} =`,explain:`${a/100} × ${b/10} = ${a*b/1000} → 0을 세 개 붙여 ${a*b}`});},
      ()=>{const b=rnd(2,9)*10,q=rnd(2,9);return NUM(q,{tag:'(몇백몇십)÷(몇십)',prompt:'몫을 구하세요.',eqHTML:`${b*q} ÷ ${b} =`,explain:`${b} × ${q} = ${b*q}`});});},
    mid:i=>GEN41.muldiv(i,false),
    high:i=>GEN41.muldiv(i,true),
  },
  move:{
    low(){const opts=shuffle(['orig','flipH','rot90']);return {tag:'평면도형 밀기',prompt:'왼쪽 도형을 오른쪽으로 밀었을 때의 모양은?',visual:moveSVG('orig'),input:{type:'choice',options:opts.map(o=>({v:o,html:moveSVG(o,'#93C5FD')}))},check:v=>v==='orig',sol:'orig',solHTML:moveSVG('orig','#93C5FD'),explain:'밀기는 위치만 바뀌고 모양은 그대로예요.'};},
    mid:i=>GEN41.move(i,false),
    high:i=>GEN41.move(i,true),
  },
  graph:{
    low(){const names=pick([['봄','여름','가을','겨울'],['사과','포도','귤','배']]);let vals=shuffle([1,2,3,4,5,6,7,8]).slice(0,4);const items=names.map((l,k)=>({l,v:vals[k]}));const p=pick(items);
      return NUM(p.v,{tag:'막대그래프 읽기',prompt:`눈금 한 칸은 1이에요. ${p.l}의 막대는 얼마를 나타낼까요?`,visual:barChartSVG(items,1),explain:`${p.l} 막대 끝의 눈금을 읽으면 ${p.v}`});},
    mid:i=>GEN41.graph(i,false),
    high:i=>GEN41.graph(i,true),
  },
  pattern:{
    low(){const d=pick([10,100,1000]),st=rnd(1,9)*d+rnd(1,9),seq=[0,1,2,3].map(k=>st+d*k);return NUM(st+4*d,{tag:'수 배열의 규칙',prompt:'규칙을 찾아 다음 수를 쓰세요.',eqHTML:`<span class="small">${seq.join(', ')}, ${BOX}</span>`,explain:`${d}씩 커져요.`});},
    mid:()=>GEN3.pattern(),
    high(){return oneOf(()=>HARD3.pattern(),()=>HARD3.pattern(),
      ()=>{const k=rnd(4,7);return NUM(201+2*k,{tag:'계산식의 규칙',prompt:`101 + 102 = 203<br>102 + 103 = 205<br>103 + 104 = 207<br>… 규칙에 따라 ${k}째 계산식의 합은?`,explain:`더하는 두 수가 1씩 커지니 합은 2씩 커져요. ${k}째: ${100+k} + ${101+k} = ${201+2*k}`});},
      ()=>{const a=rnd(2,9),d=rnd(3,9),nth=rnd(20,30);return NUM(a+d*(nth-1),{tag:'규칙으로 구하기',prompt:`첫째 수가 ${a}이고 ${d}씩 커지는 수 배열이 있어요. ${nth}째 수는?`,explain:`${a} + ${d} × ${nth-1} = ${a+d*(nth-1)}`});});},
  },
};

/* ════════════ 4학년 2학기 ════════════ */
const G42={
  fracadd:{
    low(){const d=rnd(3,8),a=rnd(1,d-2),b=rnd(1,d-1-a);return FRAC(a+b,d,{tag:'분수의 덧셈',prompt:'계산해 보세요.',eqHTML:`${fracHTML(a,d)} + ${fracHTML(b,d)} =`,explain:`분모는 그대로, 분자끼리 더해요: ${a} + ${b} = ${a+b}`});},
    mid:i=>GEN42.fracadd(i,false),
    high(i){return oneOf(()=>GEN42.fracadd(i,true),
      ()=>{const d=rnd(4,9),w1=rnd(1,3),w2=rnd(1,3),a=rnd(2,d-1),b=rnd(d-a+1,d-1);const N=(w1+w2)*d+a+b;return MIXED(N,d,{tag:'대분수의 덧셈',prompt:'계산 결과를 대분수로 쓰세요.',eqHTML:`${fracHTML(a,d,w1)} + ${fracHTML(b,d,w2)} =`,explain:`자연수끼리 ${w1+w2}, 분수끼리 ${a+b}/${d} = 1과 ${a+b-d}/${d} → ${w1+w2+1}과 ${a+b-d}/${d}`});},
      ()=>{const d=rnd(4,9),w2=rnd(1,2),w1=w2+rnd(2,3),a=rnd(1,d-2),b=rnd(a+1,d-1);const N=(w1*d+a)-(w2*d+b);return MIXED(N,d,{tag:'대분수의 뺄셈',prompt:'계산 결과를 대분수로 쓰세요.',eqHTML:`${fracHTML(a,d,w1)} − ${fracHTML(b,d,w2)} =`,explain:`${a}/${d}에서 ${b}/${d}를 뺄 수 없으니 자연수 1을 ${d}/${d}로 바꿔요 → ${Math.floor(N/d)}과 ${N%d}/${d}`});});},
  },
  tri:{
    low(){return pick([
      CH(shuffle(['정삼각형','직각삼각형','둔각삼각형']),'정삼각형',{tag:'삼각형 분류',prompt:'세 변의 길이가 모두 같은 삼각형을 무엇이라고 할까요?',explain:'세 변이 모두 같으면 정삼각형!'}),
      CH(shuffle(['이등변삼각형','직각삼각형','둔각삼각형']),'이등변삼각형',{tag:'삼각형 분류',prompt:'두 변의 길이가 같은 삼각형을 무엇이라고 할까요?',explain:'두 변의 길이가 같으면 이등변삼각형!'}),
      CH(shuffle(['둔각삼각형','예각삼각형','정삼각형']),'둔각삼각형',{tag:'삼각형 분류',prompt:'한 각이 둔각인 삼각형을 무엇이라고 할까요?',explain:'한 각이 둔각(90°보다 큰 각)이면 둔각삼각형!'})]);},
    mid:i=>GEN42.tri(i,false),
    high(i){return oneOf(()=>GEN42.tri(i,true),
      ()=>{const a=rnd(5,12);let b=rnd(3,2*a-1);if(b===a)b=a-1;return NUM(2*a+b,{tag:'이등변삼각형의 둘레',prompt:`이등변삼각형에서 길이가 같은 두 변이 각각 ${a} cm, 나머지 한 변이 ${b} cm예요. 세 변의 길이의 합은?`,unit:'cm',explain:`${a} + ${a} + ${b} = ${2*a+b}`});},
      ()=>{const s=rnd(4,15);return NUM(s,{tag:'정삼각형의 변',prompt:`정삼각형의 세 변의 길이의 합이 ${3*s} cm예요. 한 변은 몇 cm일까요?`,unit:'cm',explain:`세 변이 모두 같으니 ${3*s} ÷ 3 = ${s}`});},
      ()=>{const b=rnd(25,75);return NUM(180-2*b,{tag:'이등변삼각형의 각',prompt:`이등변삼각형의 한 밑각이 ${b}°예요. 꼭지각은 몇 도일까요?`,unit:'°',visual:triSVG('이등변삼각형'),explain:`두 밑각은 같아요. 180 − ${b} − ${b} = ${180-2*b}`});});},
  },
  dec:{
    low(){return oneOf(
      ()=>{const n=rnd(1,99);return DEC(n/100,{tag:'소수 두 자리 수',prompt:`0.01이 ${n}개인 수는?`,explain:`0.01이 ${n}개 → ${n/100}`});},
      ()=>{const a=rnd(1,8),b=rnd(1,9-a);return DEC((a+b)/10,{tag:'소수의 덧셈',prompt:'계산해 보세요.',eqHTML:`0.${a} + 0.${b} =`,explain:`0.1이 ${a}개 + ${b}개 = ${a+b}개 → 0.${a+b}`});});},
    mid:i=>GEN42.dec(i,false),
    high:i=>GEN42.dec(i,true),
  },
  quad:{
    low(){return pick([
      CH(shuffle(['직사각형','사다리꼴','평행사변형']),'직사각형',{tag:'사각형',prompt:'네 각이 모두 직각인 사각형은?',explain:'네 각이 모두 직각이면 직사각형이에요.'}),
      CH(shuffle(['평행사변형','사다리꼴','삼각형']),'평행사변형',{tag:'사각형',prompt:'마주 보는 두 쌍의 변이 서로 평행한 사각형은?',explain:'두 쌍이 평행하면 평행사변형, 한 쌍만 평행하면 사다리꼴이에요.'})]);},
    mid:i=>GEN42.quad(i,false),
    high(i){return oneOf(()=>GEN42.quad(i,true),
      ()=>{const a=rnd(4,15);return NUM(4*a,{tag:'마름모의 둘레',prompt:`한 변이 ${a} cm인 마름모의 네 변의 길이의 합은?`,visual:quadSVG('마름모'),unit:'cm',explain:`마름모는 네 변의 길이가 모두 같아요. ${a} × 4 = ${4*a}`});},
      ()=>{const a=rnd(6,15),b=rnd(3,a-1);return NUM(2*(a+b),{tag:'평행사변형의 둘레',prompt:`평행사변형의 이웃한 두 변이 ${a} cm, ${b} cm예요. 네 변의 길이의 합은?`,visual:quadSVG('평행사변형'),unit:'cm',explain:`마주 보는 변의 길이가 같아요. (${a} + ${b}) × 2 = ${2*(a+b)}`});});},
  },
  lgraph:{
    low(){const labs=['월','화','수','목'];const vals=labs.map(()=>rnd(1,8));const k=rnd(0,3);return NUM(vals[k],{tag:'꺾은선그래프 읽기',prompt:`${labs[k]}요일의 값은 얼마일까요? (눈금 한 칸 = 1)`,visual:lineChartSVG(labs,vals,1),explain:`${labs[k]} 위의 점을 읽으면 ${vals[k]}`});},
    mid(i){return oneOf(()=>GEN42.lgraph(i,false),
      ()=>{const labs=['3월','4월','5월','6월','7월'];let vals;do{vals=labs.map(()=>rnd(1,9));}while(new Set(vals).size<5);const hi=Math.random()<.5;const ans=labs[vals.indexOf(hi?Math.max(...vals):Math.min(...vals))];return CH(labs,ans,{tag:'꺾은선그래프',prompt:`값이 가장 ${hi?'큰':'작은'} 때는 언제일까요?`,visual:lineChartSVG(labs,vals,1),explain:`점이 가장 ${hi?'높은':'낮은'} 곳: ${ans}`});});},
    high:i=>GEN42.lgraph(i,true),
  },
  poly:{
    low(){const NAME={5:'오각형',6:'육각형',7:'칠각형',8:'팔각형'};const n=pick([5,6,7,8]);return CH(optsWith(NAME[n],Object.values(NAME)),NAME[n],{tag:'다각형의 이름',prompt:`변이 ${n}개인 다각형의 이름은?`,explain:`변이 ${n}개 → ${NAME[n]}`});},
    mid:i=>GEN42.poly(i,false),
    high(i){return oneOf(()=>GEN42.poly(i,true),
      ()=>{const NAME={5:'정오각형',6:'정육각형',8:'정팔각형'};const n=pick([5,6,8]),a=rnd(3,12);return NUM(n*a,{tag:'정다각형의 둘레',prompt:`한 변이 ${a} cm인 ${NAME[n]}의 모든 변의 길이의 합은?`,visual:regPolySVG(n),unit:'cm',explain:`변이 ${n}개, 모두 ${a} cm → ${a} × ${n} = ${n*a}`});},
      ()=>{const NAME={5:'정오각형',6:'정육각형',8:'정팔각형'};const n=pick([5,6,8]),a=rnd(3,12);return NUM(a,{tag:'정다각형의 변',prompt:`${NAME[n]}의 모든 변의 길이의 합이 ${n*a} cm예요. 한 변은 몇 cm일까요?`,visual:regPolySVG(n),unit:'cm',explain:`${n*a} ÷ ${n} = ${a}`});});},
  },
};

/* ════════════ 전체 교육과정 표 ════════════ */
const CUR={
  '11':{gen:G11,modes:[
    {id:'n9',icon:'🍎',title:'9까지의 수',sub:'세기 · 순서 · 0 · 몇째'},
    {id:'shape',icon:'📦',title:'여러 가지 모양',sub:'상자 · 둥근 기둥 · 공 모양'},
    {id:'addsub',icon:'➕',title:'덧셈과 뺄셈',sub:'가르기 · 모으기 · 합이 9까지'},
    {id:'compare',icon:'📏',title:'비교하기',sub:'길이 · 무게 · 넓이 · 담을 수 있는 양'},
    {id:'n50',icon:'🔟',title:'50까지의 수',sub:'10 · 십몇 · 몇십몇'}]},
  '12':{gen:G12,modes:[
    {id:'count',icon:'💯',title:'100까지의 수',sub:'몇십 · 순서 · 짝수와 홀수'},
    {id:'three',icon:'🧮',title:'덧셈과 뺄셈(1)',sub:'세 수 · 10 만들기 · 10에서 빼기'},
    {id:'shapeclock',icon:'🕒',title:'모양과 시각',sub:'세모·네모·동그라미 · 몇 시 30분'},
    {id:'addsub2',icon:'➕',title:'덧셈과 뺄셈(2)',sub:'받아올림 · 받아내림'},
    {id:'pattern',icon:'🎨',title:'규칙 찾기',sub:'무늬 · 수 배열'},
    {id:'addsub3',icon:'🔢',title:'덧셈과 뺄셈(3)',sub:'두 자리 수 계산'}]},
  '21':{gen:G21,modes:[
    {id:'n3',icon:'💯',title:'세 자리 수',sub:'백 · 자릿값 · 뛰어 세기'},
    {id:'shape2',icon:'🔷',title:'여러 가지 도형',sub:'삼각형 · 사각형 · 원 · 칠교'},
    {id:'addsub',icon:'➕',title:'덧셈과 뺄셈',sub:'받아올림 · 받아내림 · □ 구하기'},
    {id:'len',icon:'📏',title:'길이 재기',sub:'cm · 자로 재기 · 어림'},
    {id:'classify',icon:'🗂️',title:'분류하기',sub:'기준 정하기 · 세어 보기'},
    {id:'mul',icon:'✖️',title:'곱셈',sub:'묶어 세기 · 몇의 몇 배'}]},
  '22':{gen:G22,modes:[
    {id:'n4',icon:'🔢',title:'네 자리 수',sub:'천 · 자릿값 · 뛰어 세기'},
    {id:'times',icon:'✖️',title:'곱셈구구',sub:'2~9단 · 1과 0의 곱 · 곱셈표'},
    {id:'len2',icon:'📏',title:'길이 재기',sub:'m와 cm · 길이의 합과 차'},
    {id:'time',icon:'🕰️',title:'시각과 시간',sub:'몇 시 몇 분 · 하루 · 달력'},
    {id:'table',icon:'📊',title:'표와 그래프',sub:'표 · ○ 그래프'},
    {id:'pattern2',icon:'🧩',title:'규칙 찾기',sub:'덧셈표 · 곱셈표 · 쌓기'}]},
  '31':{gen:G31,modes:[
    {id:'addsub',icon:'➕',title:'덧셈과 뺄셈',sub:'세 자리 수 · 받아올림 · 받아내림'},
    {id:'shape',icon:'📐',title:'평면도형',sub:'선분 · 직각 · 직사각형 · 정사각형'},
    {id:'div',icon:'➗',title:'나눗셈',sub:'곱셈구구로 몫 구하기'},
    {id:'mul',icon:'✖️',title:'곱셈',sub:'(두 자리)×(한 자리)'},
    {id:'lentime',icon:'📏',title:'길이와 시간',sub:'mm · km · 초 · 시각 계산'},
    {id:'fracdec',icon:'🍰',title:'분수와 소수',sub:'분수 · 단위분수 · 0.1'}]},
  '32':{gen:G32,modes:[
    {id:'mul',icon:'✖️',title:'곱셈',sub:'(세 자리)×(한 자리) · (두 자리)×(두 자리)'},
    {id:'div',icon:'➗',title:'나눗셈',sub:'나머지 · (세 자리)÷(한 자리)'},
    {id:'circle',icon:'⭕',title:'원',sub:'중심 · 반지름 · 지름'},
    {id:'frac',icon:'🍕',title:'분수',sub:'분수만큼 · 가분수 · 대분수'},
    {id:'unit',icon:'⚖️',title:'들이와 무게',sub:'L · mL · kg · g'},
    {id:'picgraph',icon:'📊',title:'그림그래프',sub:'그림그래프 읽기와 나타내기'}]},
  '41':{gen:G41,modes:MODES_41.map(m=>({id:m.id,icon:m.icon,title:m.title,sub:m.sub}))},
  '42':{gen:G42,modes:MODES_42.map(m=>({id:m.id,icon:m.icon,title:m.title,sub:m.sub}))},
};
