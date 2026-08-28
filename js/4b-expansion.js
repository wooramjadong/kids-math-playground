/* ───────── 확장 과정: 1학년 2학기(82) · 4학년 1학기(41) · 4학년 2학기(42) ───────── */

/* 그림 도우미 */
function barChartSVG(items,unit){ // items:[{l,v}] unit=눈금 한 칸
  const u=unit||1,maxV=Math.max(...items.map(x=>x.v)),rows=Math.ceil(maxV/u);
  const bw=44,gap=18,H=130,W=items.length*(bw+gap)+46;const colors=['#FB923C','#60A5FA','#F472B6','#4ADE80','#FACC15'];
  let s='';for(let r=0;r<=rows;r++){const y=H-8-r*(110/rows);s+=`<line x1="34" y1="${y}" x2="${W-4}" y2="${y}" stroke="#E6E1D3" stroke-width="1.5"/><text x="28" y="${y+4}" font-size="11" text-anchor="end">${r*u}</text>`;}
  items.forEach((it,k)=>{const h=it.v/(rows*u)*110,x=40+k*(bw+gap);
    s+=`<rect x="${x}" y="${H-8-h}" width="${bw}" height="${h}" fill="${colors[k%5]}" stroke="#2B2A33" stroke-width="2.5"/><text x="${x+bw/2}" y="${H+8}" font-size="12" font-weight="700" text-anchor="middle">${it.l}</text>`;});
  return `<svg width="${W}" height="${H+16}" viewBox="0 0 ${W} ${H+16}">${s}</svg>`;}
function lineChartSVG(labels,values,unit){
  const u=unit||1,maxV=Math.max(...values),rows=Math.ceil(maxV/u);
  const step=58,H=130,W=labels.length*step+40;let s='';
  for(let r=0;r<=rows;r++){const y=H-10-r*(105/rows);s+=`<line x1="34" y1="${y}" x2="${W-4}" y2="${y}" stroke="#E6E1D3" stroke-width="1.5"/><text x="28" y="${y+4}" font-size="11" text-anchor="end">${r*u}</text>`;}
  const pts=values.map((v,k)=>[42+k*step,H-10-v/(rows*u)*105]);
  s+=`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#3B82F6" stroke-width="3"/>`;
  pts.forEach((p,k)=>{s+=`<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="#3B82F6" stroke="#fff" stroke-width="2"/><text x="${p[0]}" y="${H+8}" font-size="12" font-weight="700" text-anchor="middle">${labels[k]}</text>`;});
  return `<svg width="${W}" height="${H+16}" viewBox="0 0 ${W} ${H+16}">${s}</svg>`;}
const MOVE_T={orig:'',flipH:'translate(100,0) scale(-1,1)',flipV:'translate(0,100) scale(1,-1)',rot90:'rotate(90 50 50)',rot180:'rotate(180 50 50)',rot270:'rotate(270 50 50)'};
function moveSVG(t,color='#FDBA74'){ // 비대칭 ㄱ+발 모양
  return `<svg width="96" height="96" viewBox="-4 -4 108 108"><g transform="${MOVE_T[t]}"><polygon points="20,10 70,10 70,32 42,32 42,58 60,58 60,80 20,80" fill="${color}" stroke="#2B2A33" stroke-width="3" stroke-linejoin="round"/></g></svg>`;}
function quadSVG(kind,color='#BFDBFE'){
  const st='stroke="#2B2A33" stroke-width="3" stroke-linejoin="round"';
  const m={'사다리꼴':`<polygon points="20,82 38,28 76,28 96,82" fill="${color}" ${st}/>`,
    '평행사변형':`<polygon points="8,82 34,28 98,28 72,82" fill="${color}" ${st}/>`,
    '마름모':`<polygon points="55,12 94,55 55,98 16,55" fill="${color}" ${st}/>`,
    '직사각형':`<rect x="12" y="30" width="86" height="50" fill="${color}" ${st}/>`,
    '정사각형':`<rect x="26" y="26" width="58" height="58" fill="${color}" ${st}/>`};
  return `<svg width="110" height="110" viewBox="0 0 110 110">${m[kind]}</svg>`;}
function regPolySVG(n,color='#BBF7D0'){let p=[];for(let k=0;k<n;k++){const a=-Math.PI/2+k*2*Math.PI/n;p.push(`${(55+42*Math.cos(a)).toFixed(1)},${(55+42*Math.sin(a)).toFixed(1)}`);}
  return `<svg width="110" height="110" viewBox="0 0 110 110"><polygon points="${p.join(' ')}" fill="${color}" stroke="#2B2A33" stroke-width="3" stroke-linejoin="round"/></svg>`;}
function triSVG(kind,color='#FDE68A'){
  const st='stroke="#2B2A33" stroke-width="3" stroke-linejoin="round"';
  const m={'이등변삼각형':`<polygon points="55,12 92,92 18,92" fill="${color}" ${st}/>`,
    '정삼각형':`<polygon points="55,14 94,88 16,88" fill="${color}" ${st}/>`,
    '직각삼각형':`<polygon points="18,92 18,18 88,92" fill="${color}" ${st}/>`,
    '둔각삼각형':`<polygon points="10,88 58,60 100,88" fill="${color}" ${st}/>`,
    '예각삼각형':`<polygon points="48,16 92,86 14,80" fill="${color}" ${st}/>`};
  return `<svg width="110" height="110" viewBox="0 0 110 110">${m[kind]}</svg>`;}

/* ── 단원 정의 ── */
const MODES_82=[
  {id:'count',icon:'💯',title:'100까지의 수',sub:'십 묶음 · 순서 · 짝수와 홀수',badge:'1-2',cls:'g'},
  {id:'carry',icon:'➕',title:'받아올림 덧셈',sub:'8+7 · 10 만들어 더하기',badge:'1-2',cls:'g'},
  {id:'borrow',icon:'➖',title:'받아내림 뺄셈',sub:'13−7 · 10에서 빼기',badge:'1-2',cls:'g'},
  {id:'three',icon:'🧮',title:'세 수의 계산',sub:'10 만들기 · 이어 계산',badge:'1-2',cls:'g'},
  {id:'shape',icon:'🔷',title:'여러 가지 모양',sub:'모양 찾기와 세기',badge:'1-2',cls:'g'},
  {id:'clockrule',icon:'🕒',title:'시계와 규칙',sub:'몇 시 30분 · 뛰어 세기',badge:'1-2',cls:'g'},
];
const MODES_41=[
  {id:'bignum',icon:'🔢',title:'큰 수',sub:'만 · 억 · 조 · 자릿값',badge:'4-1',cls:'g'},
  {id:'angle',icon:'📐',title:'각도',sub:'예각 · 둔각 · 세 각의 합',badge:'4-1',cls:'g'},
  {id:'muldiv',icon:'✖️',title:'곱셈과 나눗셈',sub:'(세 자리)×(두 자리) · 몫과 나머지',badge:'4-1',cls:'g'},
  {id:'move',icon:'🔄',title:'평면도형의 이동',sub:'밀기 · 뒤집기 · 돌리기',badge:'4-1',cls:'g'},
  {id:'graph',icon:'📊',title:'막대그래프',sub:'그래프 읽고 비교하기',badge:'4-1',cls:'g'},
  {id:'pattern',icon:'🧩',title:'규칙 찾기',sub:'수 배열 · 계산식의 규칙',badge:'4-1',cls:'g'},
];
const MODES_42=[
  {id:'fracadd',icon:'🍰',title:'분수의 덧셈과 뺄셈',sub:'분모가 같은 분수',badge:'4-2',cls:'g'},
  {id:'tri',icon:'🔺',title:'삼각형',sub:'이등변 · 정삼각형 · 예각과 둔각',badge:'4-2',cls:'g'},
  {id:'dec',icon:'🔟',title:'소수의 덧셈과 뺄셈',sub:'소수 두 자리 · 자릿값',badge:'4-2',cls:'g'},
  {id:'quad',icon:'⏹️',title:'사각형',sub:'수직과 평행 · 사다리꼴 · 마름모',badge:'4-2',cls:'g'},
  {id:'lgraph',icon:'📈',title:'꺾은선그래프',sub:'변화 읽기',badge:'4-2',cls:'g'},
  {id:'poly',icon:'🔷',title:'다각형',sub:'이름 · 대각선 · 정다각형',badge:'4-2',cls:'g'},
];

/* ── 1학년 2학기 ── */
const GEN82={
  count(i,hard){
    if(hard){const t=pick(['jump','big','oddset']);
      if(t==='jump'){const st=rnd(5,9)*10;const seq=[st,st-10,null,st-30];return {tag:'뛰어 세기',prompt:'10씩 거꾸로 세었어요. 빈칸은?',eqHTML:`${seq.map(v=>v==null?'<span class="q">□</span>':v).join(' · ')}`,input:{type:'choice',options:shuffle([String(st-20),String(st-10),String(st-25)])},check:v=>v===String(st-20),sol:String(st-20),explain:'십의 자리가 1씩 작아져요.'};}
      if(t==='big'){const n=rnd(25,89);const big=Math.random()<.5;const ans=big?n+10:n-10;return {tag:'10 큰 수·작은 수',prompt:`${n}보다 10 ${big?'큰':'작은'} 수는?`,input:{type:'num'},ans,explain:'십의 자리 숫자만 1 바뀌어요.'};}
      const odd=Math.random()<.5;let a=rnd(10,49)*2;if(odd)a++;let w1=a+1,w2=a+3;return {tag:'짝수와 홀수',prompt:`${odd?'홀수':'짝수'}는 어느 것일까요?`,input:{type:'choice',options:shuffle([String(a),String(w1),String(w2)].map(x=>x)).filter((v,i,arr)=>arr.indexOf(v)===i)},check:v=>+v%2===(odd?1:0),sol:String(a),explain:odd?'둘씩 짝을 지으면 하나가 남는 수가 홀수예요. 일의 자리가 1,3,5,7,9!':'둘씩 짝이 딱 맞는 수가 짝수예요. 일의 자리가 0,2,4,6,8!'};}
    const t=pick(['sticks','between','bigger']);
    if(t==='sticks'){const tn=rnd(5,9),o=rnd(0,9);return {tag:'100까지의 수',prompt:'십 묶음과 낱개는 모두 얼마일까요?',visual:sticks(tn,o),input:{type:'num'},ans:tn*10+o,explain:`십 묶음 ${tn}개는 ${tn*10}, 낱개 ${o}개를 더하면 ${tn*10+o}`};}
    if(t==='between'){const n=rnd(51,98);return {tag:'수의 순서',prompt:`${n-1}과 ${n+1} 사이의 수는?`,eqHTML:`${n-1} · <span class="q">□</span> · ${n+1}`,input:{type:'num'},ans:n,explain:`${n-1} 다음 수는 ${n}이에요.`};}
    let a=rnd(51,99),b=rnd(51,99);while(a===b)b=rnd(51,99);return {tag:'크기 비교',prompt:'더 큰 수는?',input:{type:'choice',options:shuffle([String(a),String(b)]),big:true},check:v=>v===String(Math.max(a,b)),sol:String(Math.max(a,b)),explain:'십의 자리부터 비교하고, 같으면 일의 자리를 비교해요.'};},
  carry(i,hard){
    if(hard){if(Math.random()<.5){const a=rnd(6,9),b=10-a,c=rnd(2,7);return {tag:'10 만들어 더하기',prompt:'10을 먼저 만들어 계산하세요.',eqHTML:`${a} + ${b} + ${c} =`,input:{type:'num'},ans:10+c,explain:`${a} + ${b} = 10, 10 + ${c} = ${10+c}`};}
      const a=rnd(5,9),b=rnd(11-a,9);return {tag:'빈칸 찾기',prompt:'□ 안에 알맞은 수를 쓰세요.',eqHTML:`${a} + <span class="q">□</span> = ${a+b}`,input:{type:'num'},ans:b,explain:`${a+b}에서 ${a}를 빼면 ${b}`};}
    if(Math.random()<.6){const a=rnd(5,9),b=rnd(11-a,9);return {tag:'받아올림 덧셈',prompt:'계산해 보세요.',visual:tenFrame(a+b),eqHTML:`${a} + ${b} =`,input:{type:'num'},ans:a+b,explain:`${a}에 ${10-a}를 더해 10을 만들고, 남은 ${b-(10-a)}을 더하면 ${a+b}`};}
    const a=rnd(11,16),b=rnd(1,19-a);return {tag:'십몇 + 몇',prompt:'계산해 보세요.',eqHTML:`${a} + ${b} =`,input:{type:'num'},ans:a+b,explain:`일의 자리끼리: ${a-10} + ${b} = ${a-10+b}, 그래서 ${a+b}`};},
  borrow(i,hard){
    if(hard){if(Math.random()<.5){const a=rnd(11,18),b=rnd(a-9,9);return {tag:'빈칸 찾기',prompt:'□ 안에 알맞은 수를 쓰세요.',eqHTML:`${a} − <span class="q">□</span> = ${a-b}`,input:{type:'num'},ans:b,explain:`${a}에서 ${a-b}까지 얼마나 빼야 하는지 생각해요: ${b}`};}
      const b=rnd(2,9),q=rnd(11,18);return {tag:'빈칸 찾기',prompt:'□ 안에 알맞은 수를 쓰세요.',eqHTML:`<span class="q">□</span> − ${b} = ${q-b}`,input:{type:'num'},ans:q,explain:`${q-b}에 ${b}를 더하면 ${q}`};}
    const a=rnd(11,18),b=rnd(a-9,9);return {tag:'받아내림 뺄셈',prompt:'계산해 보세요.',visual:tenFrame(a),eqHTML:`${a} − ${b} =`,input:{type:'num'},ans:a-b,explain:`${a}에서 먼저 ${a-10}을 빼 10을 만들고, 10에서 ${b-(a-10)}을 더 빼면 ${a-b}`};},
  three(i,hard){
    if(hard){const t=pick(['mix','blank']);
      if(t==='mix'){const a=rnd(11,15),b=rnd(1,a-10),c=rnd(2,8);return {tag:'세 수의 계산',prompt:'앞에서부터 차례로 계산하세요.',eqHTML:`${a} − ${b} + ${c} =`,input:{type:'num'},ans:a-b+c,explain:`${a} − ${b} = ${a-b}, ${a-b} + ${c} = ${a-b+c}`};}
      const a=rnd(2,6),c=rnd(2,6),s=a+c+rnd(2,6);return {tag:'빈칸 찾기',prompt:'□ 안에 알맞은 수를 쓰세요.',eqHTML:`${a} + <span class="q">□</span> + ${c} = ${s}`,input:{type:'num'},ans:s-a-c,explain:`${a} + ${c} = ${a+c}, ${s}이 되려면 ${s-a-c}이 더 필요해요.`};}
    if(Math.random()<.5){const b=rnd(2,8),a=10-b,c=rnd(2,8);return {tag:'10 만들어 계산',prompt:'10이 되는 두 수를 먼저 더하세요.',eqHTML:`${a} + ${b} + ${c} =`,input:{type:'num'},ans:10+c,explain:`${a} + ${b} = 10 → 10 + ${c} = ${10+c}`};}
    const a=rnd(3,8),b=rnd(2,6),c=rnd(1,Math.min(5,a+b-1));return {tag:'세 수의 계산',prompt:'앞에서부터 차례로 계산하세요.',eqHTML:`${a} + ${b} − ${c} =`,input:{type:'num'},ans:a+b-c,explain:`${a} + ${b} = ${a+b}, ${a+b} − ${c} = ${a+b-c}`};},
  shape(i,hard){
    const cnt={세모:rnd(2,5),네모:rnd(2,5),원:rnd(2,5)};while(new Set(Object.values(cnt)).size<3){cnt.네모=rnd(2,5);cnt.원=rnd(2,5);}
    if(hard){const most=Math.random()<.5;const vals=Object.entries(cnt);const ans=vals.reduce((m,x)=>most?(x[1]>m[1]?x:m):(x[1]<m[1]?x:m));const name=k=>k==='원'?'동그라미':k;
      return {tag:'모양 세기',prompt:`가장 ${most?'많은':'적은'} 모양은 어느 것일까요?`,visual:shapeScene(cnt),input:{type:'choice',options:['세모','네모','동그라미']},check:v=>v===name(ans[0]),sol:name(ans[0]),explain:`세모 ${cnt.세모}, 네모 ${cnt.네모}, 동그라미 ${cnt.원}개 — ${name(ans[0])}가 가장 ${most?'많아요':'적어요'}.`};}
    const k=pick(['세모','네모','원']);const name=k==='원'?'동그라미':k;
    return {tag:'모양 세기',prompt:`${name} 모양은 몇 개일까요?`,visual:shapeScene(cnt),input:{type:'num',unit:'개'},ans:cnt[k],explain:`하나씩 짚으며 세면 ${name}는 ${cnt[k]}개예요.`};},
  clockrule(i,hard){
    if(hard){if(Math.random()<.5){const h=rnd(1,10);const lab=`${h+1}시`;return {tag:'시각 구하기',prompt:`지금 ${h}시 30분이에요. 30분 뒤는?`,visual:clockSVG(h,30),input:{type:'choice',options:shuffle([lab,`${h}시`,`${h+1}시 30분`])},check:v=>v===lab,sol:lab,explain:`30분에서 30분이 더 지나면 딱 ${h+1}시 정각이에요.`};}
      const st=rnd(40,90),d=pick([5,10]);const seq=[st,st-d,st-2*d,null];return {tag:'규칙 찾기',prompt:`${d}씩 작아져요. 빈칸은?`,eqHTML:`${seq.map(v=>v==null?'<span class="q">□</span>':v).join(' · ')}`,input:{type:'num'},ans:st-3*d,explain:`${d}씩 빼면서 세어 보세요.`};}
    if(Math.random()<.5){const h=rnd(1,12);const lab=`${h}시 30분`;const others=[`${h}시`,`${h%12+1}시 30분`];return {tag:'시계 보기',prompt:'몇 시 몇 분일까요?',visual:clockSVG(h,30),input:{type:'choice',options:shuffle([lab,...others])},check:v=>v===lab,sol:lab,explain:`긴바늘이 6이면 30분! 짧은바늘은 ${h}와 ${h%12+1} 사이에 있어요.`};}
    const st=rnd(2,9),d=pick([2,5,10]);const seq=[0,1,2,3].map(k=>st+d*k);return {tag:'규칙 찾기',prompt:'규칙을 찾아 다음 수를 쓰세요.',eqHTML:`${seq.join(', ')}, <span class="q">□</span>`,input:{type:'num'},ans:st+d*4,explain:`${d}씩 커지는 규칙이에요.`};},
};

/* ── 4학년 1학기 ── */
const GEN41={
  bignum:(i,hard)=>hard?HARD3.bignum():GEN3.bignum(null,i),
  angle:(i,hard)=>hard?HARD3.angle():GEN3.angle(null,Math.max(i,3)),
  pattern:(i,hard)=>hard?HARD3.pattern():GEN3.pattern(),
  muldiv(i,hard){
    if(hard){const t=pick(['blank','rem','check']);
      if(t==='blank'){const a=rnd(12,40),b=rnd(12,30);return {tag:'곱셈 심화',prompt:'□ 안에 알맞은 수를 쓰세요.',eqHTML:`${a} × <span class="q">□</span> = ${a*b}`,input:{type:'num'},ans:b,explain:`${a*b} ÷ ${a} = ${b}`};}
      if(t==='rem'){const b=rnd(12,29),q=rnd(4,29),r=rnd(1,b-1);return {tag:'몫과 나머지',prompt:'몫과 나머지를 구하세요.',eqHTML:`${b*q+r} ÷ ${b} =`,input:{type:'pair',fields:[['a','몫'],['b','나머지']]},check:v=>v.a===q&&v.b===r,sol:`몫 ${q}, 나머지 ${r}`,explain:`${b} × ${q} = ${b*q}, 남는 수는 ${r}. 나머지는 나누는 수보다 작아야 해요.`};}
      const b=rnd(13,28),q=rnd(5,24);let r=rnd(1,b-1);while(r===q)r=rnd(1,b-1);const n=b*q+r;const ok=`${b} × ${q} + ${r} = ${n}`;
      return {tag:'검산',prompt:`${n} ÷ ${b} = ${q} … ${r} 를 바르게 검산한 식은?`,input:{type:'choice',options:shuffle([ok,`${b} × ${r} + ${q} = ${n}`,`${b} + ${q} × ${r} = ${n}`])},check:v=>v===ok,sol:ok,explain:'(나누는 수) × (몫) + (나머지) = (나누어지는 수)'};}
    const t=pick(['m32','d2','word']);
    if(t==='m32'){const a=rnd(120,480),b=rnd(12,39);return {tag:'(세 자리)×(두 자리)',prompt:'계산해 보세요.',eqHTML:`${a} × ${b} =`,input:{type:'num'},ans:a*b,explain:`${a} × ${b%10} 과 ${a} × ${Math.floor(b/10)}0 을 더해요.`};}
    if(t==='d2'){const b=rnd(12,29),q=rnd(4,29);return {tag:'(두·세 자리)÷(두 자리)',prompt:'몫을 구하세요.',eqHTML:`${b*q} ÷ ${b} =`,input:{type:'num'},ans:q,explain:`${b} × ${q} = ${b*q} 이므로 몫은 ${q}`};}
    const a=rnd(24,48),b=rnd(12,25);return {tag:'문장제',prompt:`학생 ${a*b}명이 버스 한 대에 ${a}명씩 타면 버스는 몇 대 필요할까요?`,input:{type:'num',unit:'대'},ans:b,explain:`${a*b} ÷ ${a} = ${b}`};},
  move(i,hard){
    const asks=hard?[['시계 방향으로 90° 돌리면?','rot90'],['시계 반대 방향으로 90° 돌리면?','rot270'],['오른쪽으로 뒤집고, 다시 아래로 뒤집으면?','rot180']]
      :[['오른쪽으로 뒤집으면?','flipH'],['아래로 뒤집으면?','flipV'],['반 바퀴(180°) 돌리면?','rot180']];
    const [q,ans]=pick(asks);const opts=shuffle([ans,...shuffle(Object.keys(MOVE_T).filter(k=>k!==ans&&k!=='orig')).slice(0,2)]);
    return {tag:hard?'이동 심화':'평면도형의 이동',prompt:`왼쪽 도형을 ${q}`,visual:moveSVG('orig'),input:{type:'choice',options:opts.map(o=>({v:o,html:moveSVG(o,'#93C5FD')}))},check:v=>v===ans,sol:ans,solHTML:moveSVG(ans,'#93C5FD'),explain:q.includes('뒤집')?'뒤집으면 좌우(또는 위아래)가 거울처럼 바뀌어요.':'돌리면 도형이 통째로 회전해요. 뒤집기와 달리 거울상이 되지 않아요.'};},
  graph(i,hard){
    const names=pick([['봄','여름','가을','겨울'],['사과','포도','귤','배'],['월','화','수','목']]);
    const unit=hard?2:1;let vals=shuffle([2,3,5,7,4]).slice(0,4).map(v=>v*unit);while(new Set(vals).size<4)vals=shuffle([2,3,5,6,8,4]).slice(0,4).map(v=>v*unit);
    const items=names.map((l,k)=>({l,v:vals[k]}));const vis=barChartSVG(items,unit);
    if(hard){const t=pick(['diff','sum']);
      if(t==='diff'){const s=shuffle(items).slice(0,2);const big=s[0].v>s[1].v?s[0]:s[1],small=s[0].v>s[1].v?s[1]:s[0];
        return {tag:'막대그래프 심화',prompt:`눈금 한 칸은 ${unit}이에요. ${big.l}는 ${small.l}보다 얼마나 더 많을까요?`,visual:vis,input:{type:'num'},ans:big.v-small.v,explain:`${big.l} ${big.v} − ${small.l} ${small.v} = ${big.v-small.v}. 눈금 한 칸이 ${unit}인 것을 잊지 마세요!`};}
      return {tag:'막대그래프 심화',prompt:`눈금 한 칸은 ${unit}이에요. 네 가지를 모두 더하면 얼마일까요?`,visual:vis,input:{type:'num'},ans:items.reduce((a,x)=>a+x.v,0),explain:items.map(x=>x.v).join(' + ')+` = ${items.reduce((a,x)=>a+x.v,0)}`};}
    const t=pick(['most','read']);
    if(t==='most'){const most=Math.random()<.5;const ans=items.reduce((m,x)=>most?(x.v>m.v?x:m):(x.v<m.v?x:m));
      return {tag:'막대그래프',prompt:`가장 ${most?'많은':'적은'} 것은 어느 것일까요?`,visual:vis,input:{type:'choice',options:names},check:v=>v===ans.l,sol:ans.l,explain:`막대가 가장 ${most?'높은':'낮은'} 것을 찾으면 ${ans.l}이에요.`};}
    const p=pick(items);return {tag:'막대그래프',prompt:`${p.l}의 막대는 얼마를 나타낼까요?`,visual:vis,input:{type:'num'},ans:p.v,explain:`${p.l}의 막대 끝 눈금을 읽으면 ${p.v}예요.`};},
};

/* ── 4학년 2학기 ── */
const GEN42={
  fracadd(i,hard){
    if(hard){const t=pick(['improper','mixsub']);
      if(t==='improper'){const d=rnd(4,9),a=rnd(2,d-1),b=rnd(d-a+1,d-1);const n=a+b;return {tag:'분수 덧셈 심화',prompt:'계산 결과를 <b>대분수</b>로 쓰세요.',eqHTML:`${fracHTML(a,d)} + ${fracHTML(b,d)} =`,input:{type:'frac',fields:['w','n','d']},check:v=>v.d>0&&v.n<v.d&&(v.w*v.d+v.n)*d===n*v.d,solHTML:fracHTML(n-d,d,1),explain:`분자끼리 더하면 ${n}/${d}. ${d}/${d} = 1 이니까 1과 ${n-d}/${d}이에요.`};}
      const d=rnd(4,9),n=rnd(1,d-1);return {tag:'분수 뺄셈 심화',prompt:'계산해 보세요.',eqHTML:`2 − ${fracHTML(n,d)} =`,input:{type:'frac',fields:['w','n','d']},check:v=>v.d>0&&v.n<v.d&&(v.w*v.d+v.n)*d===(2*d-n)*v.d,solHTML:fracHTML(d-n,d,1),explain:`2에서 1을 ${d}/${d}로 바꾸면 1과 ${d}/${d}. 여기서 ${n}/${d}를 빼면 1과 ${d-n}/${d}`};}
    const d=rnd(4,9);
    if(Math.random()<.5){const a=rnd(1,d-2),b=rnd(1,d-a-1);return {tag:'분수의 덧셈',prompt:'계산해 보세요.',eqHTML:`${fracHTML(a,d)} + ${fracHTML(b,d)} =`,input:{type:'frac',fields:['n','d']},check:v=>v.d>0&&v.n*d===(a+b)*v.d,solHTML:fracHTML(a+b,d),explain:'분모가 같으면 분자끼리 더해요.'};}
    const a=rnd(2,d-1),b=rnd(1,a-1);return {tag:'분수의 뺄셈',prompt:'계산해 보세요.',eqHTML:`${fracHTML(a,d)} − ${fracHTML(b,d)} =`,input:{type:'frac',fields:['n','d']},check:v=>v.d>0&&v.n*d===(a-b)*v.d,solHTML:fracHTML(a-b,d),explain:'분모가 같으면 분자끼리 빼요.'};},
  tri(i,hard){
    if(hard){if(Math.random()<.5){const top=rnd(20,100);const base=(180-top)/2;if(base%1)return GEN42.tri(i,true);
        return {tag:'이등변삼각형 심화',prompt:`이등변삼각형의 꼭지각이 ${top}°예요. 밑에 있는 두 각은 각각 몇 도일까요?`,visual:triSVG('이등변삼각형'),input:{type:'num',unit:'°'},ans:base,explain:`두 밑각은 크기가 같아요. (180 − ${top}) ÷ 2 = ${base}`};}
      return {tag:'정삼각형 심화',prompt:'정삼각형의 한 각의 크기는 몇 도일까요?',visual:triSVG('정삼각형'),input:{type:'num',unit:'°'},ans:60,explain:'세 각이 모두 같으니 180 ÷ 3 = 60'};}
    if(Math.random()<.5){const sides=pick([[[5,5,7],'이등변삼각형'],[[6,6,6],'정삼각형'],[[3,5,7],'삼각형']]);const [s,ans]=sides;
      return {tag:'변으로 분류',prompt:`세 변이 ${s.join(' cm, ')} cm인 삼각형의 이름으로 가장 알맞은 것은?`,input:{type:'choice',options:['이등변삼각형','정삼각형','삼각형']},check:v=>v===ans,sol:ans,explain:ans==='정삼각형'?'세 변이 모두 같으면 정삼각형!':ans==='이등변삼각형'?'두 변의 길이가 같으면 이등변삼각형!':'세 변이 모두 다르면 그냥 삼각형이에요.'};}
    const k=pick(['예각삼각형','직각삼각형','둔각삼각형']);
    return {tag:'각으로 분류',prompt:'이 삼각형의 이름은?',visual:triSVG(k),input:{type:'choice',options:['예각삼각형','직각삼각형','둔각삼각형']},check:v=>v===k,sol:k,explain:k==='예각삼각형'?'세 각이 모두 예각이에요.':k==='직각삼각형'?'한 각이 직각(90°)이에요.':'한 각이 둔각(90°보다 큼)이에요.'};},
  dec(i,hard){
    const f=x=>Math.round(x*100)/100;
    if(hard){const t=pick(['two','blank','tenth']);
      if(t==='two'){const a=f(rnd(100,899)/100),b=f(rnd(100,899)/100);const add=Math.random()<.5;const ans=add?f(a+b):f(Math.max(a,b)-Math.min(a,b));
        return {tag:'소수 두 자리 계산',prompt:'계산해 보세요.',eqHTML:add?`${a} + ${b} =`:`${Math.max(a,b)} − ${Math.min(a,b)} =`,input:{type:'num',decimal:true},ans,solText:String(ans),explain:'소수점의 자리를 맞추고 자연수처럼 계산해요.'};}
      if(t==='blank'){const a=f(rnd(10,60)/10),b=f(rnd(10,60)/10);return {tag:'빈칸 찾기',prompt:'□ 안에 알맞은 수를 쓰세요.',eqHTML:`<span class="q">□</span> + ${a} = ${f(a+b)}`,input:{type:'num',decimal:true},ans:b,solText:String(b),explain:`${f(a+b)} − ${a} = ${b}`};}
      const n=f(rnd(11,99)/10);const ten=Math.random()<.5;const ans=ten?f(n*10):f(n/10);
      return {tag:'10배와 1/10',prompt:`${n}의 ${ten?'10배':'1/10'}은 얼마일까요?`,input:{type:'num',decimal:true},ans,solText:String(ans),explain:ten?'10배 하면 소수점이 오른쪽으로 한 칸!':'1/10 하면 소수점이 왼쪽으로 한 칸!'};}
    const t=pick(['add','sub','place']);
    if(t==='place'){const s=`${rnd(1,9)}.${rnd(1,9)}${rnd(1,9)}`;const idx=pick([0,2,3]);const names={0:'일의 자리',2:'소수 첫째 자리',3:'소수 둘째 자리'};
      return {tag:'자릿값',prompt:`${s}에서 숫자 <b>${s[idx]}</b>${idx===0?'은(는)':'은(는)'} 어느 자리 숫자일까요?`,input:{type:'choice',options:['일의 자리','소수 첫째 자리','소수 둘째 자리']},check:v=>v===names[idx],sol:names[idx],explain:'소수점 바로 오른쪽이 소수 첫째 자리, 그다음이 둘째 자리예요.'};}
    const a=f(rnd(10,89)/10),b=f(rnd(10,89)/10);
    if(t==='add')return {tag:'소수의 덧셈',prompt:'계산해 보세요.',eqHTML:`${a} + ${b} =`,input:{type:'num',decimal:true},ans:f(a+b),solText:String(f(a+b)),explain:'소수점끼리 줄을 맞추고 더해요.'};
    return {tag:'소수의 뺄셈',prompt:'계산해 보세요.',eqHTML:`${Math.max(a,b)} − ${Math.min(a,b)} =`,input:{type:'num',decimal:true},ans:f(Math.max(a,b)-Math.min(a,b)),solText:String(f(Math.max(a,b)-Math.min(a,b))),explain:'소수점끼리 줄을 맞추고 빼요.'};},
  quad(i,hard){
    if(hard){if(Math.random()<.5){const a=rnd(40,140);return {tag:'평행사변형 심화',prompt:`평행사변형에서 한 각이 ${a}°예요. 이웃한 각은 몇 도일까요?`,visual:quadSVG('평행사변형'),input:{type:'num',unit:'°'},ans:180-a,explain:`이웃한 두 각의 합은 180°. 180 − ${a} = ${180-a}`};}
      const ok='마름모';return {tag:'사각형 심화',prompt:'네 변의 길이가 모두 같은 사각형을 <b>모두</b> 고르면? (하나만 골라도 돼요)',input:{type:'choice',options:shuffle(['마름모','정사각형','사다리꼴'])},check:v=>v!=='사다리꼴',sol:'마름모',explain:'마름모와 정사각형은 네 변이 모두 같아요. 사다리꼴은 아니에요.'};}
    if(Math.random()<.5){const k=pick(['사다리꼴','평행사변형','마름모']);const opts=shuffle(['사다리꼴','평행사변형','마름모']);
      return {tag:'사각형',prompt:'이 사각형의 이름으로 가장 알맞은 것은?',visual:quadSVG(k),input:{type:'choice',options:opts},check:v=>v===k,sol:k,explain:k==='사다리꼴'?'평행한 변이 한 쌍이라도 있으면 사다리꼴이에요.':k==='평행사변형'?'마주 보는 두 쌍의 변이 서로 평행해요.':'네 변의 길이가 모두 같아요.'};}
    const q=pick([{q:'한 직선에 수직으로 만나는 두 직선이 이루는 각은?',o:['90°','45°','180°'],a:'90°',e:'수직으로 만나면 직각(90°)을 이뤄요.'},
      {q:'아무리 늘여도 서로 만나지 않는 두 직선을 무엇이라고 할까요?',o:['평행하다','수직이다','겹친다'],a:'평행하다',e:'서로 만나지 않는 두 직선은 평행해요. 기찻길처럼요!'}]);
    return {tag:'수직과 평행',prompt:q.q,input:{type:'choice',options:q.o},check:v=>v===q.a,sol:q.a,explain:q.e};},
  lgraph(i,hard){
    const labs=['3월','4월','5월','6월','7월'];const unit=hard?2:1;
    let vals=[rnd(2,4)];for(let k=1;k<5;k++){let nv=vals[k-1]+pick([-2,-1,1,2,3]);nv=Math.max(1,Math.min(9,nv));if(nv===vals[k-1])nv++;vals.push(nv);}
    vals=vals.map(v=>v*unit);const vis=lineChartSVG(labs,vals,unit);
    if(hard){let bi=1,bd=0;for(let k=1;k<5;k++){const d=vals[k]-vals[k-1];if(d>bd){bd=d;bi=k;}}
      if(bd<=0)return GEN42.lgraph(i,true);const ans=`${labs[bi-1]}~${labs[bi]}`;const opts=[];for(let k=1;k<5;k++)opts.push(`${labs[k-1]}~${labs[k]}`);
      return {tag:'꺾은선 심화',prompt:'가장 많이 <b>늘어난</b> 때는 언제일까요?',visual:vis,input:{type:'choice',options:opts},check:v=>v===ans,sol:ans,explain:`선이 가장 가파르게 올라간 곳이 ${ans} 사이예요. (+${bd})`};}
    const k=rnd(0,4);return {tag:'꺾은선그래프',prompt:`${labs[k]}의 값은 얼마일까요?`,visual:vis,input:{type:'num'},ans:vals[k],explain:`${labs[k]} 위의 점이 가리키는 눈금을 읽으면 ${vals[k]}예요.`};},
  poly(i,hard){
    const NAME={3:'삼각형',4:'사각형',5:'오각형',6:'육각형',7:'칠각형',8:'팔각형'};
    if(hard){if(Math.random()<.5){const n=pick([4,5,6]);return {tag:'대각선',prompt:`${NAME[n]}의 대각선은 모두 몇 개일까요?`,visual:regPolySVG(n),input:{type:'num',unit:'개'},ans:n*(n-3)/2,explain:`한 꼭짓점에서 ${n-3}개씩 그을 수 있어요. ${n} × ${n-3} ÷ 2 = ${n*(n-3)/2}`};}
      return {tag:'정다각형 심화',prompt:'정육각형의 한 각의 크기는 몇 도일까요?',visual:regPolySVG(6),input:{type:'choice',options:shuffle(['120°','108°','135°','90°'])},check:v=>v==='120°',sol:'120°',explain:'육각형 안쪽 각의 합은 720°. 720 ÷ 6 = 120'};}
    if(Math.random()<.5){const n=pick([5,6,7,8]);return {tag:'다각형의 이름',prompt:'이 도형의 이름은?',visual:regPolySVG(n),input:{type:'choice',options:shuffle([NAME[n],NAME[n===8?5:n+1],NAME[n===5?7:n-1]])},check:v=>v===NAME[n],sol:NAME[n],explain:`변이 ${n}개인 다각형은 ${NAME[n]}이에요.`};}
    const ok='모든 변의 길이와 모든 각의 크기가 같다';
    return {tag:'정다각형',prompt:'정다각형에 대한 설명으로 옳은 것은?',input:{type:'choice',options:shuffle([ok,'변의 개수가 항상 4개다','각이 모두 직각이다'])},check:v=>v===ok,sol:ok,explain:'변과 각이 모두 똑같아야 정다각형이에요. 정삼각형, 정사각형, 정오각형…'};},
};
