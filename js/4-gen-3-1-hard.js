/* ───────── 추가 그림 ───────── */
function shapeScene(counts){ // {세모:n,네모:n,원:n} 을 섞어 배치
  const colors=['#FB923C','#60A5FA','#F472B6','#4ADE80','#FACC15','#A78BFA'];
  const items=[];for(const k in counts)for(let i=0;i<counts[k];i++)items.push(k);
  const list=shuffle(items),cols=4,s=54;let out='';
  list.forEach((k,i)=>{const x=(i%cols)*s+4,y=Math.floor(i/cols)*s+4,c=pick(colors);
    if(k==='원')out+=`<circle cx="${x+22}" cy="${y+22}" r="19" fill="${c}" stroke="#2B2A33" stroke-width="2.5"/>`;
    else if(k==='세모')out+=`<polygon points="${x+22},${y+3} ${x+42},${y+41} ${x+2},${y+41}" fill="${c}" stroke="#2B2A33" stroke-width="2.5" stroke-linejoin="round"/>`;
    else out+=`<rect x="${x+3}" y="${y+7}" width="38" height="30" rx="3" fill="${c}" stroke="#2B2A33" stroke-width="2.5"/>`;});
  const rows=Math.ceil(list.length/cols);return `<svg width="${cols*s+8}" height="${rows*s+8}" viewBox="0 0 ${cols*s+8} ${rows*s+8}">${out}</svg>`;}
function polySVG(kind,color='#FDE68A'){ // 3-1 평면도형
  const st='stroke="#2B2A33" stroke-width="3" stroke-linejoin="round"';
  const m={'직각삼각형':`<polygon points="14,96 14,20 96,96" fill="${color}" ${st}/><path d="M14 80 L30 80 L30 96" fill="none" stroke="#3B82F6" stroke-width="3"/>`,
    '직사각형':`<rect x="10" y="30" width="90" height="52" fill="${color}" ${st}/>`,
    '정사각형':`<rect x="22" y="22" width="66" height="66" fill="${color}" ${st}/>`,
    '삼각형':`<polygon points="55,14 98,96 12,96" fill="${color}" ${st}/>`,
    '원':`<circle cx="55" cy="55" r="40" fill="${color}" ${st}/>`,
    '사각형':`<polygon points="20,30 96,20 84,92 10,80" fill="${color}" ${st}/>`,
    '선분':`<line x1="12" y1="55" x2="98" y2="55" stroke="#2B2A33" stroke-width="4"/><circle cx="12" cy="55" r="5" fill="#2B2A33"/><circle cx="98" cy="55" r="5" fill="#2B2A33"/>`,
    '반직선':`<line x1="12" y1="55" x2="104" y2="55" stroke="#2B2A33" stroke-width="4"/><circle cx="12" cy="55" r="5" fill="#2B2A33"/><polygon points="104,55 92,48 92,62" fill="#2B2A33"/>`,
    '직선':`<line x1="6" y1="55" x2="104" y2="55" stroke="#2B2A33" stroke-width="4"/><polygon points="6,55 18,48 18,62" fill="#2B2A33"/><polygon points="104,55 92,48 92,62" fill="#2B2A33"/>`};
  return `<svg width="110" height="110" viewBox="0 0 110 110">${m[kind]}</svg>`;}
function decGrid(n){ // 0.1 단위 소수 그림 (10칸 막대, n칸 색칠, n≤10)
  let r='';for(let i=0;i<10;i++)r+=`<rect x="${4+i*24}" y="4" width="24" height="40" fill="${i<n?'#F472B6':'#fff'}" stroke="#2B2A33" stroke-width="2"/>`;
  return `<svg width="248" height="48" viewBox="0 0 248 48">${r}</svg>`;}

/* ───────── 3학년 1학기 ───────── */
const GEN31={
  addsub(i,hard){
    if(hard){const t=pick(['blank','three']);
      if(t==='blank'){const a=rnd(120,480),b=rnd(120,480);const add=Math.random()<.5;
        return add?{tag:'세 자리 수 덧셈',prompt:'□ 안에 알맞은 수를 쓰세요.',eqHTML:`<span class="q">□</span> + ${b} = ${a+b}`,input:{type:'num'},ans:a,explain:`${a+b} − ${b} = ${a}. 덧셈은 뺄셈으로 거꾸로 구해요.`}
          :{tag:'세 자리 수 뺄셈',prompt:'□ 안에 알맞은 수를 쓰세요.',eqHTML:`${a+b} − <span class="q">□</span> = ${a}`,input:{type:'num'},ans:b,explain:`${a+b} − ${a} = ${b}`};}
      const a=rnd(150,400),b=rnd(120,300),c=rnd(100,250);return {tag:'세 수의 계산',prompt:'앞에서부터 차례로 계산하세요.',eqHTML:`<span class="small">${a} + ${b} − ${c} =</span>`,input:{type:'num'},ans:a+b-c,explain:`${a} + ${b} = ${a+b}, ${a+b} − ${c} = ${a+b-c}`};}
    if(Math.random()<.5){const a=rnd(125,689),b=rnd(125,689);return {tag:'세 자리 수 덧셈',prompt:'계산해 보세요.',eqHTML:`${a} + ${b} =`,input:{type:'num'},ans:a+b,explain:'일의 자리부터 더하고, 10이 넘으면 윗자리로 받아올림해요.'};}
    const a=rnd(400,950),b=rnd(125,a-100);return {tag:'세 자리 수 뺄셈',prompt:'계산해 보세요.',eqHTML:`${a} − ${b} =`,input:{type:'num'},ans:a-b,explain:'일의 자리부터 빼고, 모자라면 윗자리에서 받아내림해요.'};},

  shape(i,hard){
    const colors=['#FDE68A','#BFDBFE','#FBCFE8','#BBF7D0'];
    if(hard){const t=pick(['sq','rect','count']);
      if(t==='sq'){const s=rnd(3,12);return {tag:'정사각형',prompt:`한 변이 ${s} cm인 정사각형이에요. 네 변의 길이를 모두 더하면?`,visual:polySVG('정사각형'),input:{type:'num',unit:'cm'},ans:s*4,explain:`정사각형은 네 변이 모두 같아요. ${s} × 4 = ${s*4}`};}
      if(t==='rect'){const a=rnd(3,12),b=rnd(2,a-1);return {tag:'직사각형',prompt:`가로 ${a} cm, 세로 ${b} cm인 직사각형이에요. 네 변의 길이를 모두 더하면?`,visual:polySVG('직사각형'),input:{type:'num',unit:'cm'},ans:2*(a+b),explain:`마주 보는 변은 길이가 같아요. ${a} + ${b} + ${a} + ${b} = ${2*(a+b)}`};}
      return {tag:'직각 찾기',prompt:'이 도형에서 직각은 모두 몇 개일까요?',visual:`<svg width="140" height="120" viewBox="0 0 140 120"><polygon points="20,20 80,20 80,60 120,60 120,100 20,100" fill="#FDE68A" stroke="#2B2A33" stroke-width="3" stroke-linejoin="round"/></svg>`,input:{type:'choice',options:['4개','5개','6개','8개']},check:v=>v==='6개',sol:'6개',explain:'꺾인 곳마다 확인하면 모두 6개의 직각이 있어요. (안쪽으로 꺾인 곳도 직각!)'};}
    const t=pick(['find','line','right']);
    if(t==='find'){const all=['직각삼각형','직사각형','정사각형','원','삼각형'];const k=pick(['직각삼각형','직사각형','정사각형']);const opts=shuffle([k,...shuffle(all.filter(x=>x!==k)).slice(0,2)]);
      return {tag:'평면도형',prompt:`${k}은 어느 것일까요?`,input:{type:'choice',options:opts.map(o=>({v:o,html:polySVG(o,pick(colors))}))},check:v=>v===k,sol:k,explain:k==='직각삼각형'?'한 각이 직각인 삼각형이에요.':k==='정사각형'?'네 각이 모두 직각이고 네 변의 길이가 모두 같아요.':'네 각이 모두 직각인 사각형이에요.'};}
    if(t==='line'){const k=pick(['선분','반직선','직선']);return {tag:'선분·반직선·직선',prompt:'이것의 이름은?',visual:polySVG(k),input:{type:'choice',options:['선분','반직선','직선']},check:v=>v===k,sol:k,explain:k==='선분'?'두 점을 곧게 이은 선이에요.':k==='반직선'?'한 점에서 한쪽으로 끝없이 늘인 선이에요.':'양쪽으로 끝없이 늘인 선이에요.'};}
    const k=pick(['직사각형','정사각형','직각삼각형','삼각형']);const ans=k==='직각삼각형'?'1개':k==='삼각형'?'0개':'4개';
    return {tag:'직각 세기',prompt:'이 도형에는 직각이 몇 개 있을까요?',visual:polySVG(k,pick(colors)),input:{type:'choice',options:['0개','1개','2개','4개']},check:v=>v===ans,sol:ans,explain:`${k}에는 직각이 ${ans} 있어요.`};},

  div(i,hard){
    if(hard){const t=pick(['blank','two','same']);
      if(t==='blank'){const b=rnd(2,9),q=rnd(2,9);return {tag:'나눗셈 심화',prompt:'□ 안에 알맞은 수를 쓰세요.',eqHTML:`<span class="q">□</span> ÷ ${b} = ${q}`,input:{type:'num'},ans:b*q,explain:`${b} × ${q} = ${b*q}. 나눗셈은 곱셈으로 확인해요.`};}
      if(t==='two'){const b=rnd(2,6),c=rnd(2,5),q=rnd(2,6);const n=b*c*q;return {tag:'두 단계 문장제',prompt:`구슬 ${n}개를 ${b}명에게 똑같이 나누어 준 다음, 한 명이 받은 구슬을 다시 ${c}봉지에 똑같이 담았어요. 한 봉지에 몇 개?`,input:{type:'num',unit:'개'},ans:q,explain:`${n} ÷ ${b} = ${n/b}, ${n/b} ÷ ${c} = ${q}`};}
      const q=rnd(2,9);const a=rnd(2,9),b=pick([2,3,4,5,6,7,8,9].filter(x=>x!==a));const wrong=pick([q+1,q-1,q+2].filter(x=>x>=1));const c=rnd(2,9);
      return {tag:'몫이 같은 나눗셈',prompt:`몫이 ${q}인 나눗셈을 모두 고르면? (하나만 골라도 돼요)`,input:{type:'choice',options:shuffle([`${a*q} ÷ ${a}`,`${b*q} ÷ ${b}`,`${c*wrong} ÷ ${c}`])},check:v=>v!==`${c*wrong} ÷ ${c}`,sol:`${a*q} ÷ ${a}`,explain:`${a*q} ÷ ${a} = ${q}, ${b*q} ÷ ${b} = ${q} 두 개 모두 몫이 ${q}이에요.`};}
    const t=pick(['basic','basic','rel','word']);const b=rnd(2,9),q=rnd(2,9);
    if(t==='basic')return {tag:'나눗셈',prompt:'곱셈구구를 이용해 몫을 구하세요.',eqHTML:`${b*q} ÷ ${b} =`,input:{type:'num'},ans:q,explain:`${b} × ${q} = ${b*q} 이므로 몫은 ${q}`};
    if(t==='rel'){const correct=`${b} × ${q} = ${b*q}`;return {tag:'나눗셈과 곱셈',prompt:`${b*q} ÷ ${b} = ${q} 를 곱셈식으로 바르게 나타낸 것은?`,input:{type:'choice',options:shuffle([correct,`${b} × ${b*q} = ${q}`,`${q} + ${b} = ${b*q}`])},check:v=>v===correct,sol:correct,explain:'나눗셈식은 곱셈식으로 바꿀 수 있어요.'};}
    const items=pick(['사탕','연필','색종이','쿠키']);return {tag:'나눗셈 문장제',prompt:`${items} ${b*q}개를 ${b}명이 똑같이 나누어 가지면 한 사람이 몇 개씩 가질까요?`,input:{type:'num',unit:'개'},ans:q,explain:`${b*q} ÷ ${b} = ${q}`};},

  mul(i,hard){
    if(hard){const t=pick(['digit','cmp','two']);
      if(t==='digit'){const a=rnd(2,4),d=rnd(1,9),b=rnd(3,9);const n=a*10+d;return {tag:'곱셈 심화',prompt:'□ 안에 알맞은 숫자를 쓰세요.',eqHTML:`${a}<span class="q">□</span> × ${b} = ${n*b}`,input:{type:'num'},ans:d,explain:`${n*b} ÷ ${b} = ${n} 이므로 □는 ${d}`};}
      if(t==='cmp'){const a=rnd(12,49),b=rnd(2,9);const x=a*b+pick([-20,-5,5,20]);const ans=cmpAns(a*b,x);return {tag:'곱의 크기 비교',prompt:'○ 안에 알맞은 것을 고르세요.',eqHTML:`${a} × ${b} <span class="op">○</span> ${x}`,input:{type:'choice',options:['>','<'],big:true},check:v=>v===ans,sol:ans,explain:`${a} × ${b} = ${a*b}`};}
      const a=rnd(12,30),b=rnd(2,5),c=rnd(10,40);return {tag:'두 단계 문장제',prompt:`한 상자에 사과가 ${a}개씩 ${b}상자 있어요. 그중 ${c}개를 먹었다면 남은 사과는?`,input:{type:'num',unit:'개'},ans:a*b-c,explain:`${a} × ${b} = ${a*b}, ${a*b} − ${c} = ${a*b-c}`};}
    const a=rnd(12,49),b=rnd(2,9);
    if(Math.random()<.6)return {tag:'(두 자리)×(한 자리)',prompt:'계산해 보세요.',eqHTML:`${a} × ${b} =`,input:{type:'num'},ans:a*b,explain:`일의 자리 ${a%10} × ${b} = ${(a%10)*b}, 십의 자리 ${Math.floor(a/10)}0 × ${b} = ${Math.floor(a/10)*10*b}. 더하면 ${a*b}`};
    return {tag:'곱셈 문장제',prompt:`한 줄에 ${a}명씩 ${b}줄로 섰어요. 모두 몇 명일까요?`,input:{type:'num',unit:'명'},ans:a*b,explain:`${a} × ${b} = ${a*b}`};},

  lentime(i,hard){
    if(hard){const t=pick(['tadd','tsub','dist']);
      if(t==='tadd'){const h1=rnd(1,3),m1=rnd(20,55),h2=rnd(1,2),m2=rnd(20,55);const tot=(h1+h2)*60+m1+m2;return {tag:'시간의 덧셈',prompt:'계산해 보세요.',eqHTML:`<span class="small">${h1}시간 ${m1}분 + ${h2}시간 ${m2}분 =</span>`,input:{type:'pair',fields:[['a','시간'],['b','분']]},check:v=>v.a===Math.floor(tot/60)&&v.b===tot%60,sol:`${Math.floor(tot/60)}시간 ${tot%60}분`,explain:m1+m2>=60?`분끼리 더하면 ${m1+m2}분 → 60분은 1시간으로 받아올림!`:'시간끼리, 분끼리 더해요.'};}
      if(t==='tsub'){const m1=rnd(3,8),s1=rnd(5,40),m2=rnd(1,m1-1),s2=rnd(s1+5,59);const tot=(m1*60+s1)-(m2*60+s2);return {tag:'시간의 뺄셈',prompt:'계산해 보세요.',eqHTML:`<span class="small">${m1}분 ${s1}초 − ${m2}분 ${s2}초 =</span>`,input:{type:'pair',fields:[['a','분'],['b','초']]},check:v=>v.a===Math.floor(tot/60)&&v.b===tot%60,sol:`${Math.floor(tot/60)}분 ${tot%60}초`,explain:`${s1}초에서 ${s2}초를 뺄 수 없으니 1분을 60초로 받아내림해요.`};}
      const k1=rnd(1,4),m1=rnd(1,19)*50,k2=rnd(1,3),m2=rnd(1,19)*50;const tot=(k1+k2)*1000+m1+m2;return {tag:'거리의 덧셈',prompt:'집에서 학교까지 ' +`${k1} km ${m1} m, 학교에서 도서관까지 ${k2} km ${m2} m예요. 집에서 도서관까지는?`,input:{type:'pair',fields:[['a','km'],['b','m']]},check:v=>v.a===Math.floor(tot/1000)&&v.b===tot%1000,sol:`${Math.floor(tot/1000)} km ${tot%1000} m`,explain:m1+m2>=1000?'m끼리 더해 1000 m가 넘으면 1 km로 받아올림!':'km끼리, m끼리 더해요.'};}
    const t=pick(['mm','km','sec','clock']);
    if(t==='mm'){const c=rnd(2,9),m=rnd(1,9);return Math.random()<.5?{tag:'길이 단위',prompt:'빈칸에 알맞은 수를 쓰세요.',eqHTML:`${c} cm ${m} mm = <span class="q">□</span> mm`,input:{type:'num'},ans:c*10+m,explain:`1 cm = 10 mm 이므로 ${c*10} + ${m} = ${c*10+m} mm`}
      :{tag:'길이 단위',prompt:'빈칸에 알맞은 수를 쓰세요.',eqHTML:`${c*10+m} mm = <span class="q">□</span> cm <span class="q">□</span> mm`,input:{type:'pair',fields:[['a','cm'],['b','mm']]},check:v=>v.a===c&&v.b===m,sol:`${c} cm ${m} mm`,explain:`${c*10+m}에서 10이 ${c}번 → ${c} cm, 남은 ${m} mm`};}
    if(t==='km'){const k=rnd(1,9),m=rnd(1,19)*50;return {tag:'길이 단위',prompt:'빈칸에 알맞은 수를 쓰세요.',eqHTML:`${k} km ${m} m = <span class="q">□</span> m`,input:{type:'num'},ans:k*1000+m,explain:`1 km = 1000 m 이므로 ${k*1000} + ${m} = ${k*1000+m} m`};}
    if(t==='sec'){const m=rnd(1,5),s=rnd(1,59);return Math.random()<.5?{tag:'시간 단위',prompt:'빈칸에 알맞은 수를 쓰세요.',eqHTML:`${m}분 ${s}초 = <span class="q">□</span>초`,input:{type:'num'},ans:m*60+s,explain:`1분 = 60초 이므로 ${m*60} + ${s} = ${m*60+s}초`}
      :{tag:'시간 단위',prompt:'빈칸에 알맞은 수를 쓰세요.',eqHTML:`${m*60+s}초 = <span class="q">□</span>분 <span class="q">□</span>초`,input:{type:'pair',fields:[['a','분'],['b','초']]},check:v=>v.a===m&&v.b===s,sol:`${m}분 ${s}초`,explain:`${m*60+s}초에서 60초가 ${m}번 → ${m}분, 남은 ${s}초`};}
    const h=rnd(1,10),m1=rnd(5,40),add=rnd(25,55);const tot=h*60+m1+add;return {tag:'시각 구하기',prompt:`${h}시 ${m1}분에서 ${add}분 뒤는 몇 시 몇 분일까요?`,visual:clockSVG(h,m1),input:{type:'pair',fields:[['a','시'],['b','분']]},check:v=>v.a===Math.floor(tot/60)&&v.b===tot%60,sol:`${Math.floor(tot/60)}시 ${tot%60}분`,explain:m1+add>=60?`${m1} + ${add} = ${m1+add}분 → 60분은 1시간! 그래서 ${Math.floor(tot/60)}시 ${tot%60}분`:`분만 더하면 돼요: ${m1} + ${add} = ${m1+add}`};},

  fracdec(i,hard){
    if(hard){const t=pick(['mixdec','cmpmix','tenth']);
      if(t==='mixdec'){const w=rnd(1,9),d=rnd(1,9);return {tag:'소수 심화',prompt:`1이 ${w}개, 0.1이 ${d}개인 수를 소수로 쓰세요.`,input:{type:'num',decimal:true},ans:w+d/10,solText:`${w}.${d}`,explain:`${w}과 0.${d}를 합하면 ${w}.${d}예요.`};}
      if(t==='cmpmix'){const n=rnd(1,9),x=rnd(1,9);while(x===n)return GEN31.fracdec(i,true);const ans=cmpAns(n,x);return {tag:'분수와 소수 비교',prompt:'○ 안에 알맞은 것을 고르세요.',eqHTML:`${fracHTML(n,10)} <span class="op">○</span> 0.${x}`,input:{type:'choice',options:['>','<'],big:true},check:v=>v===ans,sol:ans,explain:`${n}/10 = 0.${n} 이므로 0.${n} ${ans} 0.${x}`};}
      const a=rnd(11,89);return {tag:'소수 심화',prompt:`0.1이 ${a}개인 수는?`,input:{type:'num',decimal:true},ans:a/10,solText:`${Math.floor(a/10)}.${a%10}`,explain:`0.1이 10개면 1이에요. ${a}개면 ${Math.floor(a/10)}.${a%10}`};}
    const t=pick(['pic','unit','dec','f2d','dcmp']);
    if(t==='pic'){const d=rnd(2,8),n=rnd(1,d-1);return {tag:'분수',prompt:'색칠한 부분은 전체의 얼마인가요?',visual:pick([pieSVG,barSVG])(n,d),input:{type:'frac',fields:['n','d']},check:v=>v.d>0&&v.n*d===n*v.d,solHTML:fracHTML(n,d),explain:`전체를 똑같이 ${d}로 나눈 것 중의 ${n}이에요.`};}
    if(t==='unit'){let a=rnd(2,9),b=rnd(2,9);while(a===b)b=rnd(2,9);const ans=cmpAns(1/a,1/b);return {tag:'단위분수 비교',prompt:'○ 안에 알맞은 것을 고르세요.',eqHTML:`${fracHTML(1,a)} <span class="op">○</span> ${fracHTML(1,b)}`,input:{type:'choice',options:['>','<'],big:true},check:v=>v===ans,sol:ans,explain:'단위분수는 분모가 작을수록 커요. 조각 수가 적으면 한 조각이 크니까요.'};}
    if(t==='dec'){const n=rnd(1,9);return {tag:'소수',prompt:'색칠한 부분을 소수로 쓰세요.',visual:decGrid(n),input:{type:'num',decimal:true},ans:n/10,solText:`0.${n}`,explain:`10칸 중 ${n}칸 = ${n}/10 = 0.${n}. "영 점 ${DIG[n]}"이라고 읽어요.`};}
    if(t==='f2d'){const n=rnd(1,9);return {tag:'분수 → 소수',prompt:'분수를 소수로 나타내세요.',eqHTML:`${fracHTML(n,10)} =`,input:{type:'num',decimal:true},ans:n/10,solText:`0.${n}`,explain:`${n}/10 은 0.1이 ${n}개 → 0.${n}`};}
    const a=rnd(1,9),b=rnd(1,9);if(a===b)return GEN31.fracdec(i,false);const wa=rnd(0,2),wb=Math.random()<.5?wa:rnd(0,2);const x=wa+a/10,y=wb+b/10;const ans=cmpAns(x,y);
    return {tag:'소수 크기 비교',prompt:'○ 안에 알맞은 것을 고르세요.',eqHTML:`${wa}.${a} <span class="op">○</span> ${wb}.${b}`,input:{type:'choice',options:['>','<'],big:true},check:v=>v===ans,sol:ans,explain:wa!==wb?'자연수 부분이 크면 더 큰 수예요.':'자연수 부분이 같으면 소수 첫째 자리를 비교해요.'};},
};

/* ───────── 심화 문제 (7·8세) ───────── */
const HARDY={
  count(){const e=pick(EMO);if(age()==='7'){const n=rnd(10,15);return {prompt:`${e} 모두 몇 개일까요? 5개씩 묶어서 세어 보세요.`,visual:emojiRow(e,n),options:around(n,8,16),ans:String(n),explain:`다섯, 열, 그리고 ${n-10}개 더 → ${n}개`};}
    const t=rnd(1,3),o=rnd(11,19);return {prompt:`십 묶음 ${t}개와 낱개 ${o}개는 모두 얼마일까요?`,visual:sticks(t,0)+tenFrame(o),options:around(t*10+o,20,49,4),ans:String(t*10+o),explain:`낱개 ${o}개는 십 묶음 1개와 낱개 ${o-10}개! 그래서 십 묶음 ${t+1}개 낱개 ${o-10}개 = ${t*10+o}`};},
  order(){if(age()==='7'){const s=rnd(4,9);const seq=[s,s-1,null,s-3];return {prompt:'거꾸로 세었어요. 빈칸에 들어갈 수는?',visual:`<div class="eq">${seq.map(v=>v==null?'<span class="q">?</span>':v).join(' · ')}</div>`,options:around(s-2,1,9),ans:String(s-2),explain:'거꾸로 세면 수가 1씩 작아져요.'};}
    const a=rnd(20,90),b=rnd(20,90),c=rnd(20,90);if(new Set([a,b,c]).size<3)return HARDY.order();const small=Math.random()<.5;const ans=small?Math.min(a,b,c):Math.max(a,b,c);
    return {prompt:`세 수 중에서 가장 ${small?'작은':'큰'} 수는?`,options:shuffle([num(a),num(b),num(c)]),ans:String(ans),explain:'십의 자리를 먼저 비교하고, 같으면 일의 자리를 비교해요.'};},
  ten(){if(age()==='7'){const t=rnd(5,9);const a=rnd(1,t-1);const ok=`${a}와 ${t-a}`;const wrong=[`${a}와 ${t-a+1}`,`${a+1}와 ${t-a+1}`];
      return {prompt:`모으면 ${t}이 되는 것은 어느 것일까요?`,options:shuffle([ok,...wrong]).map(x=>({v:x,html:x,text:true})),ans:ok,explain:`${a} + ${t-a} = ${t}`};}
    const a=rnd(1,5),b=rnd(1,4),c=10-a-b;if(c<1)return HARDY.ten();return {prompt:`${a} + ${b} + □ = 10. □는 얼마일까요?`,visual:twoColorFrame(a,b),options:around(c,1,9),ans:String(c),explain:`${a} + ${b} = ${a+b}, 10이 되려면 ${c}이 더 필요해요.`};},
  addsub(){const e=pick(EMO);if(age()==='7'){if(Math.random()<.5){const a=rnd(1,4),b=rnd(1,3),c=rnd(1,9-a-b);return {prompt:`${a} + ${b} + ${c}는?`,visual:`<div class="grp">${emojiRow(e,a)}<span class="sign">+</span>${emojiRow(e,b)}<span class="sign">+</span>${emojiRow(e,c)}</div>`,options:around(a+b+c,3,9),ans:String(a+b+c),explain:`앞에서부터 차례로: ${a} + ${b} = ${a+b}, ${a+b} + ${c} = ${a+b+c}`};}
      const a=rnd(1,5),s=rnd(a+1,9);return {prompt:`${a} + □ = ${s}. □는 얼마일까요?`,visual:`<div class="eq">${a} + <span class="q">?</span> = ${s}</div>`,options:around(s-a,1,8),ans:String(s-a),explain:`${s}에서 ${a}를 빼면 ${s-a}`};}
    const t=pick(['borrow','three','carry2']);
    if(t==='borrow'){const a=rnd(11,17),b=rnd(a-9,9);return {prompt:`${a} 빼기 ${b}는?`,visual:tenFrame(a)+`<div class="eq">${a} − ${b} = <span class="q">?</span></div>`,options:around(a-b,2,9,4),ans:String(a-b),explain:`${a}에서 먼저 ${a-10}을 빼 10을 만들고, 10에서 ${b-(a-10)}을 더 빼면 ${a-b}`};}
    if(t==='three'){const a=rnd(5,9),b=rnd(2,6),c=rnd(1,5);return {prompt:`${a} + ${b} − ${c}는?`,visual:`<div class="eq">${a} + ${b} − ${c} = <span class="q">?</span></div>`,options:around(a+b-c,3,15,4),ans:String(a+b-c),explain:`${a} + ${b} = ${a+b}, ${a+b} − ${c} = ${a+b-c}`};}
    const a=rnd(15,48),b=rnd(10-(a%10)+1,9)+rnd(1,3)*10;return {prompt:`${a} + ${b}는? (2학년 미리 보기)`,visual:`<div class="eq">${a} + ${b} = <span class="q">?</span></div>`,options:around(a+b,20,99,4),ans:String(a+b),explain:`일의 자리 ${a%10} + ${b%10} = ${a%10+b%10} → 10을 십의 자리로 올려요.`};},
  shape(){const cnt={세모:rnd(1,4),네모:rnd(1,4),원:rnd(1,4)};const k=pick(['세모','네모','원']);const name=k==='원'?'동그라미':k;
    return {prompt:`${name} 모양은 모두 몇 개일까요?`,visual:shapeScene(cnt),options:around(cnt[k],1,6),ans:String(cnt[k]),explain:`하나씩 짚으며 세어 보면 ${name}는 ${cnt[k]}개예요.`};},
  compare(){if(age()==='7'){const colors=['#FB923C','#60A5FA','#F472B6'];const lens=shuffle([90,150,210]);const most=Math.random()<.5;const ans=most?210:90;
      return {prompt:`가장 ${most?'긴':'짧은'} 것은 어느 것일까요?`,options:lens.map((l,i)=>({v:String(l),html:lenBar(l,colors[i])})),ans:String(ans),explain:'세 개를 한꺼번에 비교할 땐 끝을 맞추고 봐요.'};}
    const chain=pick([['🐘','🐻','🐭'],['🚌','🚗','🚲'],['🍉','🍎','🍇']]);const [a,b,c]=chain;const light=Math.random()<.5;
    return {prompt:`${a}은(는) ${b}보다 무겁고, ${b}은(는) ${c}보다 무거워요. 가장 ${light?'가벼운':'무거운'} 것은?`,options:shuffle(chain).map(x=>({v:x,html:x})),ans:light?c:a,explain:`${a} > ${b} > ${c} 순서예요.`};},
  pattern(){const s=pick([['🔴','🔵','🟡'],['🍎','🍌','🍇'],['⭐','🌙','☀️']]);
    if(age()==='7'){const unit=[s[0],s[1],s[1]];const seq=Array.from({length:7},(_,i)=>unit[i%3]);return {prompt:'규칙을 찾아 다음에 올 것을 고르세요.',visual:`<div style="font-size:44px;letter-spacing:6px">${seq.join('')}<span style="color:var(--red);font-weight:700">?</span></div>`,options:s.map(x=>({v:x,html:x})),ans:unit[7%3],explain:`${unit.join(' ')} 세 개씩 반복돼요.`};}
    if(Math.random()<.5){const st=rnd(20,30),d=pick([2,3]);const seq=[0,1,2,3].map(k=>st-d*k);return {prompt:'규칙을 찾아 다음 수를 고르세요.',visual:`<div class="eq">${seq.join(', ')}, <span class="q">?</span></div>`,options:around(st-d*4,1,30),ans:String(st-d*4),explain:`${d}씩 작아지는 규칙이에요.`};}
    const unit=[s[0],s[1],s[1],s[2]];const seq=Array.from({length:9},(_,i)=>unit[i%4]);return {prompt:'규칙을 찾아 다음에 올 것을 고르세요.',visual:`<div style="font-size:40px;letter-spacing:4px">${seq.join('')}<span style="color:var(--red);font-weight:700">?</span></div>`,options:s.map(x=>({v:x,html:x})),ans:unit[9%4],explain:`${unit.join(' ')} 네 개씩 반복돼요.`};},
  clock(){const h=rnd(1,11);if(age()==='7'){const lab=`${h}시 30분`;const others=[`${h}시`,`${h%12+1}시 30분`];return {prompt:'시계가 몇 시를 가리키고 있을까요?',visual:clockSVG(h,30),...words([lab,...others],lab),explain:`긴바늘이 6을 가리키면 30분이에요. 짧은바늘은 ${h}와 ${h+1} 사이에 있어요.`};}
    const half=Math.random()<.5;const m=half?30:0;const later=pick([1,2]);const nh=h+later;const lab=`${nh}시${half?' 30분':''}`;const others=[`${nh+1}시${half?' 30분':''}`,`${nh}시${half?'':' 30분'}`];
    return {prompt:`지금 ${h}시${half?' 30분':''}이에요. ${later}시간 뒤는 몇 시일까요?`,visual:clockSVG(h,m),...words([lab,...others],lab),explain:`짧은바늘이 ${later}칸 더 가요. ${h} + ${later} = ${nh}`};},
};

/* ───────── 심화 문제 (3학년 2학기) ───────── */
const HARD3={
  frac(){const t=pick(['whole','cmp3']);
    if(t==='whole'){const d=pick([3,4,5,6]),n=rnd(1,d-1),per=rnd(2,5);const total=d*per;return {tag:'분수 심화',prompt:`어떤 수의 ${fracHTML(n,d)}은 ${n*per}이에요. 어떤 수는 얼마일까요?`,input:{type:'num'},ans:total,explain:`${n}묶음이 ${n*per}이면 한 묶음은 ${per}. 전체 ${d}묶음은 ${per} × ${d} = ${total}`};}
    const d=rnd(3,6);const list=shuffle([[rnd(1,d-1),d,0],[d+rnd(1,d-1),d,0],[rnd(0,d-1),d,rnd(1,2)]]);const val=x=>x[2]+x[0]/d;const big=list.reduce((m,x)=>val(x)>val(m)?x:m);
    const show=x=>x[2]?fracHTML(x[0]||0,d,x[2]):fracHTML(x[0],d);const key=x=>x.join('/');
    return {tag:'분수 심화',prompt:'가장 큰 분수는 어느 것일까요?',input:{type:'choice',options:list.map(x=>({v:key(x),html:show(x)}))},check:v=>v===key(big),sol:key(big),solHTML:show(big),explain:'모두 가분수(또는 대분수)로 바꿔서 비교해요. 분모가 같으니 분자가 클수록 커요.'};},
  unit(){const isL=Math.random()<.5;const [B,S]=isL?['L','mL']:['kg','g'];const a=rnd(2,5),b=rnd(1,19)*50,c=rnd(1,2),d=rnd(1,19)*50,e=rnd(1,2),f=rnd(1,19)*50;const tot=(a+c-e)*1000+b+d-f;if(tot<0)return HARD3.unit();const ra=Math.floor(tot/1000),rb=tot%1000;
    return {tag:`${isL?'들이':'무게'} 심화`,prompt:isL?`물통에 물이 ${a} L ${b} mL 있었어요. ${c} L ${d} mL를 더 붓고, ${e} L ${f} mL를 마셨어요. 남은 물은?`:`상자 무게가 ${a} kg ${b} g이에요. ${c} kg ${d} g을 더 넣고, ${e} kg ${f} g을 꺼냈어요. 지금 무게는?`,input:{type:'pair',fields:[['a',B],['b',S]]},check:v=>v.a===ra&&v.b===rb,sol:`${ra} ${B} ${rb} ${S}`,explain:`더한 다음 빼요: (${a} ${B} ${b} ${S} + ${c} ${B} ${d} ${S}) − ${e} ${B} ${f} ${S}`};},
  bignum(){const t=pick(['cards','jo']);
    if(t==='cards'){let digits=shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,5);const big=Math.random()<.5;const sorted=digits.slice().sort((x,y)=>big?y-x:x-y);if(!big&&sorted[0]===0){[sorted[0],sorted[1]]=[sorted[1],sorted[0]];}const ans=+sorted.join('');
      return {tag:'큰 수 심화',prompt:`숫자 카드 ${digits.map(x=>`[${x}]`).join(' ')}를 한 번씩 모두 사용해 만들 수 있는 가장 ${big?'큰':'작은'} 다섯 자리 수는?`,input:{type:'num'},ans,solText:fmt(ans),explain:big?'큰 숫자부터 앞자리에 놓아요.':'작은 숫자부터 놓되, 0은 맨 앞에 올 수 없어요.'};}
    const n=rnd(1,9)*1000000000000+rnd(1,9999)*100000000+rnd(0,9999)*10000;return {tag:'조 단위 읽기',prompt:'이 수를 바르게 읽은 것은?',eqHTML:`<span class="small">${fmt(n)}</span>`,input:{type:'choice',options:shuffle([readKo(n),readKo(n/10),readKo(n*10)])},check:v=>v===readKo(n),sol:readKo(n),explain:'일·만·억·조: 네 자리씩 끊어서 읽어요.'};},
  angle(){const t=pick(['line','clock']);
    if(t==='line'){const a=rnd(25,150);return {tag:'각도 심화',prompt:`직선 위에 각이 놓여 있어요. ${a}°일 때 나머지 각 ㉠은?`,visual:`<svg width="240" height="120" viewBox="0 0 240 120"><line x1="10" y1="100" x2="230" y2="100" stroke="#26282F" stroke-width="4"/><line x1="120" y1="100" x2="${(120+90*Math.cos(Math.PI*(180-a)/180)).toFixed(1)}" y2="${(100-90*Math.sin(Math.PI*(180-a)/180)).toFixed(1)}" stroke="#26282F" stroke-width="4"/><text x="150" y="86" font-size="16" font-weight="700">${a}°</text><text x="70" y="86" font-size="16" font-weight="700" fill="#E03A2C">㉠</text></svg>`,input:{type:'num',unit:'°'},ans:180-a,explain:`직선이 이루는 각은 180°. 180 − ${a} = ${180-a}`};}
    const h=pick([1,2,3,4,5,6]);return {tag:'시계 각도',prompt:`시계가 ${h}시 정각일 때, 두 바늘이 이루는 작은 쪽 각의 크기는?`,visual:clockSVG(h,0),input:{type:'choice',options:shuffle([`${h*30}°`,`${h*30+30}°`,`${Math.max(h*30-30,15)}°`,`${h*15}°`].filter((v,i,a)=>a.indexOf(v)===i))},check:v=>v===`${h*30}°`,sol:`${h*30}°`,explain:`시계 한 바퀴는 360°, 숫자 한 칸은 30°. ${h}칸이면 ${h*30}°`};},
  pattern(){const t=pick(['tri','mixed']);
    if(t==='tri'){const seq=[1,3,6,10,15];return {tag:'규칙 심화',prompt:'점을 삼각형 모양으로 쌓아요. 다음 수는?',eqHTML:`<span class="small">${seq.join(', ')}, <b>?</b></span>`,input:{type:'num'},ans:21,explain:'더하는 수가 2, 3, 4, 5로 커져요. 15 + 6 = 21'};}
    const a=rnd(1,4);let seq=[a];for(let k=0;k<4;k++)seq.push(seq[k]*2+1);return {tag:'규칙 심화',prompt:'규칙을 찾아 다음 수를 쓰세요. (규칙이 두 가지 섞여 있어요)',eqHTML:`<span class="small">${seq.join(', ')}, <b>?</b></span>`,input:{type:'num'},ans:seq[4]*2+1,explain:'2배 하고 1을 더하는 규칙이에요.'};},
  area(i){const size=rnd(9,12);const cells=new Set(['2,2']);while(cells.size<size){const [x,y]=pick([...cells]).split(',').map(Number);const [dx,dy]=pick([[1,0],[-1,0],[0,1],[0,-1]]);const nx=x+dx,ny=y+dy;if(nx>=0&&nx<6&&ny>=0&&ny<6)cells.add(nx+','+ny);}
    const per=perimeter(cells);return {tag:'도형 심화',prompt:`<b>넓이 ${size}칸</b>, <b>둘레 ${per}</b>인 도형을 만드세요. 칸이 많아서 더 어려워요!`,input:{type:'area',area:size,per},explain:'둘레를 줄이려면 뭉치고, 늘리려면 길게 펼쳐요.'};},
};
/* 3-1 심화는 GEN31 안의 hard 분기 사용 */
