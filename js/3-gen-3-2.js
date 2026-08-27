const GEN3={
  /* ⚡ 스피드 연산 */
  speed(level){
    let a,b,q,r;
    const t=pick(level==='easy'?['m21','d1','m21','d1']:level==='normal'?['m31','m22','d21','rem']:['m32','d32','add4','m32']);
    switch(t){
      case 'm21':a=rnd(12,49);b=rnd(2,9);return {prompt:'',eq:`${a} <span class="op">×</span> ${b} <span class="op">=</span>`,input:{type:'num'},ans:a*b};
      case 'd1':b=rnd(2,9);q=rnd(2,9);return {prompt:'',eq:`${b*q} <span class="op">÷</span> ${b} <span class="op">=</span>`,input:{type:'num'},ans:q};
      case 'm31':a=rnd(102,499);b=rnd(2,9);return {prompt:'',eq:`${a} <span class="op">×</span> ${b} <span class="op">=</span>`,input:{type:'num'},ans:a*b};
      case 'm22':a=rnd(12,49);b=rnd(11,39);return {prompt:'',eq:`${a} <span class="op">×</span> ${b} <span class="op">=</span>`,input:{type:'num'},ans:a*b};
      case 'd21':b=rnd(2,9);q=rnd(11,49);return {prompt:'',eq:`${b*q} <span class="op">÷</span> ${b} <span class="op">=</span>`,input:{type:'num'},ans:q};
      case 'rem':b=rnd(3,9);q=rnd(5,19);r=rnd(1,b-1);return {prompt:'나머지는?',eq:`${b*q+r} <span class="op">÷</span> ${b}`,input:{type:'num'},ans:r,sol:`몫 ${q}, 나머지 ${r}`};
      case 'm32':a=rnd(102,399);b=rnd(11,29);return {prompt:'',eq:`${a} <span class="op">×</span> ${b} <span class="op">=</span>`,input:{type:'num'},ans:a*b};
      case 'd32':b=rnd(11,29);q=rnd(5,29);return {prompt:'',eq:`${b*q} <span class="op">÷</span> ${b} <span class="op">=</span>`,input:{type:'num'},ans:q};
      case 'add4':a=rnd(1200,8900);b=rnd(1200,8900);return {prompt:'',eq:`${a} <span class="op">+</span> ${b} <span class="op">=</span>`,input:{type:'num'},ans:a+b};
    }
  },

  /* 🍕 분수 */
  frac(_,i){
    const t=i<2?'pic':pick(['pic','imp2mix','mix2imp','cmp','part','pic']);
    let d,n,w;
    switch(t){
      case 'pic':{ d=rnd(2,8);n=rnd(1,2*d);if(n===d)n++;const shape=pick(['pie','bar']);const vis=shape==='pie'?pieSVG(n,d):barSVG(n,d);
        if(n<d)return {tag:'그림 보고 분수 쓰기',prompt:'색칠한 부분은 전체의 얼마인가요?',visual:vis,input:{type:'frac',fields:['n','d']},
          check:v=>v.n*d===n*v.d&&v.d>0,solHTML:fracHTML(n,d),explain:`전체를 ${d}칸으로 나눈 것 중 ${n}칸이에요.`};
        const asMix=Math.random()<.5&&n%d!==0;w=Math.floor(n/d);
        if(asMix)return {tag:'그림 보고 대분수 쓰기',prompt:'색칠한 부분을 <b>대분수</b>로 쓰세요.',visual:vis,input:{type:'frac',fields:['w','n','d']},
          check:v=>v.d>0&&v.n<v.d&&(v.w*v.d+v.n)*d===n*v.d,solHTML:fracHTML(n%d,d,w),explain:`온전한 것 ${w}개와 ${d}칸 중 ${n%d}칸이에요.`};
        return {tag:'그림 보고 가분수 쓰기',prompt:'색칠한 부분을 <b>가분수</b>로 쓰세요.',visual:vis,input:{type:'frac',fields:['n','d']},
          check:v=>v.d>0&&v.n>=v.d&&v.n*d===n*v.d,solHTML:fracHTML(n,d),explain:`${d}칸짜리 조각이 모두 ${n}칸이에요. 분자가 분모보다 크면 가분수!`};}
      case 'imp2mix':{ d=rnd(2,9);w=rnd(1,3);n=w*d+rnd(1,d-1);
        return {tag:'가분수 → 대분수',prompt:'가분수를 대분수로 나타내세요.',eqHTML:fracHTML(n,d)+' <span class="op">=</span>',input:{type:'frac',fields:['w','n','d']},
          check:v=>v.d>0&&v.n<v.d&&(v.w*v.d+v.n)*d===n*v.d,solHTML:fracHTML(n%d,d,w),explain:`${n} ÷ ${d} = ${w} … ${n%d} 이므로 자연수 ${w}, 분자 ${n%d}이에요.`};}
      case 'mix2imp':{ d=rnd(2,9);w=rnd(1,4);const nn=rnd(1,d-1);n=w*d+nn;
        return {tag:'대분수 → 가분수',prompt:'대분수를 가분수로 나타내세요.',eqHTML:fracHTML(nn,d,w)+' <span class="op">=</span>',input:{type:'frac',fields:['n','d']},
          check:v=>v.d>0&&v.n*d===n*v.d,solHTML:fracHTML(n,d),explain:`${w} × ${d} + ${nn} = ${n} 이므로 분자는 ${n}이에요.`};}
      case 'cmp':{ const kind=pick(['sameD','sameN','unit','mix']);let A,B,label;
        if(kind==='sameD'){d=rnd(3,12);let a=rnd(1,d+4),b=rnd(1,d+4);while(a===b)b=rnd(1,d+4);A=[a,d];B=[b,d];label='분모가 같으면 분자가 클수록 커요.';}
        else if(kind==='sameN'){n=rnd(1,5);let a=rnd(2,12),b=rnd(2,12);while(a===b)b=rnd(2,12);A=[n,a];B=[n,b];label='분자가 같으면 분모가 작을수록 커요.';}
        else if(kind==='unit'){let a=rnd(2,12),b=rnd(2,12);while(a===b)b=rnd(2,12);A=[1,a];B=[1,b];label='단위분수는 분모가 작을수록 커요.';}
        else {d=rnd(2,6);const wa=rnd(1,3),wb=rnd(1,3);A=[wa*d+rnd(0,d-1),d];B=[wb*d+rnd(0,d-1),d];if(A[0]===B[0])B[0]+=1;label='대분수와 가분수는 같은 모양으로 바꿔 비교해요.';}
        const va=A[0]/A[1],vb=B[0]/B[1];const ans=cmpAns(va,vb);
        const show=x=>kind==='mix'&&x[0]>=x[1]&&Math.random()<.5?fracHTML(x[0]%x[1],x[1],Math.floor(x[0]/x[1])):fracHTML(x[0],x[1]);
        return {tag:'분수의 크기 비교',prompt:'○ 안에 알맞은 것을 고르세요.',eqHTML:`${show(A)} <span class="op">○</span> ${show(B)}`,input:{type:'choice',options:['>','<'],big:true},
          check:v=>v===ans,sol:ans,explain:label};}
      case 'part':{ d=pick([2,3,4,5,6]);const per=rnd(2,4),total=d*per;n=rnd(1,d-1);
        return {tag:'전체의 분수만큼',prompt:`사탕 ${total}개의 ${fracHTML(n,d)}은 몇 개인가요?`,visual:dotsSVG(total,per),input:{type:'num',unit:'개'},
          ans:per*n,explain:`${total}개를 ${d}묶음으로 나누면 한 묶음이 ${per}개. ${n}묶음이면 ${per*n}개예요.`};}
    }
  },

  /* ⚖️ 들이와 무게 */
  unit(){
    const t=pick(['toSmall','toBig','add','sub','cmp']);const isL=Math.random()<.5;
    const [B,S]=isL?['L','mL']:['kg','g'];
    let a,b,c,d2;
    switch(t){
      case 'toSmall':a=rnd(1,9);b=rnd(1,19)*50;return {tag:'단위 바꾸기',prompt:'빈칸에 알맞은 수를 쓰세요.',eqHTML:`${a} ${B} ${b} ${S} <span class="op">=</span>`,input:{type:'num',unit:S},ans:a*1000+b,explain:`1 ${B} = 1000 ${S} 이므로 ${a}000 + ${b} = ${a*1000+b} ${S}`};
      case 'toBig':a=rnd(1,9);b=rnd(1,19)*50;return {tag:'단위 바꾸기',prompt:'빈칸에 알맞은 수를 쓰세요.',eqHTML:`${a*1000+b} ${S} <span class="op">=</span>`,input:{type:'pair',fields:[['a',B],['b',S]]},check:v=>v.a===a&&v.b===b,sol:`${a} ${B} ${b} ${S}`,explain:`${a*1000+b}에서 1000이 ${a}번 → ${a} ${B}, 남은 ${b} ${S}`};
      case 'add':{a=rnd(1,5);b=rnd(1,19)*50;c=rnd(1,4);d2=rnd(1,19)*50;const tot=(a+c)*1000+b+d2;const ra=Math.floor(tot/1000),rb=tot%1000;
        return {tag:`${isL?'들이':'무게'}의 덧셈`,prompt:'계산해 보세요.',eqHTML:`<span class="small">${a} ${B} ${b} ${S} <span class="op">+</span> ${c} ${B} ${d2} ${S} <span class="op">=</span></span>`,input:{type:'pair',fields:[['a',B],['b',S]]},
          check:v=>v.a===ra&&v.b===rb,sol:`${ra} ${B} ${rb} ${S}`,explain:b+d2>=1000?`${S}끼리 더하면 ${b+d2} → 1000 ${S}는 1 ${B}로 받아올림!`:`${B}끼리, ${S}끼리 더해요.`};}
      case 'sub':{a=rnd(3,9);b=rnd(1,19)*50;c=rnd(1,a-1);d2=rnd(1,19)*50;const tot=(a-c)*1000+b-d2;const ra=Math.floor(tot/1000),rb=tot%1000;
        return {tag:`${isL?'들이':'무게'}의 뺄셈`,prompt:'계산해 보세요.',eqHTML:`<span class="small">${a} ${B} ${b} ${S} <span class="op">−</span> ${c} ${B} ${d2} ${S} <span class="op">=</span></span>`,input:{type:'pair',fields:[['a',B],['b',S]]},
          check:v=>v.a===ra&&v.b===rb,sol:`${ra} ${B} ${rb} ${S}`,explain:b<d2?`${b}에서 ${d2}를 뺄 수 없으니 1 ${B}를 1000 ${S}로 받아내림!`:`${B}끼리, ${S}끼리 빼요.`};}
      case 'cmp':{a=rnd(1,9);b=rnd(1,19)*50;const x=a*1000+b+pick([-300,-50,50,300]);const ans=cmpAns(a*1000+b,x);
        return {tag:`${isL?'들이':'무게'} 비교`,prompt:'○ 안에 알맞은 것을 고르세요.',eqHTML:`<span class="small">${a} ${B} ${b} ${S} <span class="op">○</span> ${x} ${S}</span>`,input:{type:'choice',options:['>','<'],big:true},check:v=>v===ans,sol:ans,explain:`${a} ${B} ${b} ${S} = ${a*1000+b} ${S}로 바꿔서 비교해요.`};}
    }
  },

  /* 🔢 큰 수 (4-1 선행) */
  bignum(_,i){
    const t=i<3?'read':pick(['read','write','place','times','jump']);
    const mk=()=>{const digits=pick([5,6,7,8,9]);let n=rnd(Math.pow(10,digits-1),Math.pow(10,digits)-1);
      // 0이 섞이도록
      const s=String(n).split('');const z=rnd(0,2);for(let k=0;k<z;k++)s[rnd(1,s.length-1)]='0';return +s.join('');};
    switch(t){
      case 'read':{const n=mk();const correct=readKo(n);const opts=new Set([correct]);let guard=0;
        while(opts.size<4&&guard++<40){const s=String(n).split('');const r=rnd(0,2);
          if(r===0){const i1=rnd(0,s.length-1),i2=rnd(0,s.length-1);[s[i1],s[i2]]=[s[i2],s[i1]];}
          else if(r===1){const i1=rnd(0,s.length-1);s[i1]=String((+s[i1]+rnd(1,8))%10);}
          else {Math.random()<.5?s.push('0'):s.pop();}
          const m=+s.join('');if(m>0&&String(m).length>=4)opts.add(readKo(m));}
        return {tag:'큰 수 읽기',prompt:'이 수를 바르게 읽은 것은?',eqHTML:fmt(n),input:{type:'choice',options:shuffle([...opts])},check:v=>v===correct,sol:correct,explain:'네 자리씩 끊어서 만, 억, 조를 붙여 읽어요.'};}
      case 'write':{const n=mk();return {tag:'큰 수 쓰기',prompt:`<span style="font-size:24px">"${readKo(n)}"</span><br>을 숫자로 쓰세요.`,input:{type:'num'},ans:n,solText:fmt(n),explain:'만, 억 앞의 수는 네 자리씩 차지해요. 빈자리는 0으로 채워요.'};}
      case 'place':{const n=mk();const s=String(n);let idx=rnd(0,s.length-1);while(s[idx]==='0')idx=rnd(0,s.length-1);const val=+s[idx]*Math.pow(10,s.length-1-idx);
        return {tag:'자릿값',prompt:`${fmt(n)}에서 밑줄 친 숫자 <b>${s[idx]}</b>이(가) 나타내는 값은?`,eqHTML:s.split('').map((c,k)=>k===idx?`<u style="color:var(--red)">${c}</u>`:c).join(''),input:{type:'num'},ans:val,solText:fmt(val),explain:`${s[idx]}은(는) ${readKo(Math.pow(10,s.length-1-idx))}의 자리에 있어요.`};}
      case 'times':{const base=rnd(12,98)*Math.pow(10,pick([3,4,5]));const k=pick([10,100]);
        return {tag:'10배, 100배',prompt:`${fmt(base)}의 ${k}배는?`,input:{type:'num'},ans:base*k,solText:fmt(base*k),explain:`${k}배 하면 0이 ${String(k).length-1}개 더 붙어요.`};}
      case 'jump':{const step=pick([10000,100000,1000000,10000000]);const start=rnd(3,60)*step+rnd(0,9)*Math.pow(10,pick([2,3]));
        const seq=[0,1,2,3].map(k=>start+step*k);
        return {tag:'뛰어 세기',prompt:`${readKo(step)}씩 뛰어 세었어요. 다음 수는?`,eqHTML:`<span class="small">${seq.map(fmt).join(' → ')} → <b>?</b></span>`,input:{type:'num'},ans:start+step*4,solText:fmt(start+step*4),explain:`${readKo(step)}의 자리 숫자가 1씩 커져요.`};}
    }
  },

  /* 📐 각도 (4-1 선행) */
  angle(_,i){
    const t=i<3?'kind':pick(['kind','est','tri','quad']);
    switch(t){
      case 'kind':{const a=pick([rnd(15,80),rnd(15,80),90,rnd(100,165),rnd(100,165)]);const ans=a<90?'예각':a===90?'직각':'둔각';
        return {tag:'각의 종류',prompt:'이 각은 어떤 각인가요?',visual:angleSVG(a),input:{type:'choice',options:['예각','직각','둔각']},check:v=>v===ans,sol:ans,explain:'직각(90°)보다 작으면 예각, 크면 둔각이에요.'};}
      case 'est':{const list=[30,45,60,90,120,135,150];const a=pick(list);const opts=shuffle([a,...shuffle(list.filter(x=>x!==a)).slice(0,3)]).map(x=>x+'°');
        return {tag:'각도 어림하기',prompt:'이 각의 크기는 약 몇 도일까요?',visual:angleSVG(a),input:{type:'choice',options:opts},check:v=>v===a+'°',sol:a+'°',explain:'직각(90°)을 기준으로 절반이면 45°, 그보다 큰지 작은지 비교해 보세요.'};}
      case 'tri':{const a=rnd(25,90),b=rnd(25,150-a);return {tag:'삼각형의 세 각',prompt:`삼각형의 두 각이 ${a}°, ${b}°예요. 나머지 한 각은?`,visual:`<svg width="200" height="120" viewBox="0 0 200 120"><polygon points="20,105 180,105 120,15" fill="#FFF3C4" stroke="#26282F" stroke-width="3"/><text x="34" y="98" font-size="15" font-weight="700">${a}°</text><text x="140" y="98" font-size="15" font-weight="700">${b}°</text><text x="112" y="40" font-size="18" fill="#E03A2C" font-weight="700">?</text></svg>`,input:{type:'num',unit:'°'},ans:180-a-b,explain:`삼각형의 세 각의 합은 180°. 180 − ${a} − ${b} = ${180-a-b}`};}
      case 'quad':{const a=rnd(50,120),b=rnd(50,120),c=rnd(50,Math.min(140,340-a-b));return {tag:'사각형의 네 각',prompt:`사각형의 세 각이 ${a}°, ${b}°, ${c}°예요. 나머지 한 각은?`,input:{type:'num',unit:'°'},ans:360-a-b-c,explain:`사각형의 네 각의 합은 360°. 360 − ${a} − ${b} − ${c} = ${360-a-b-c}`};}
    }
  },

  /* 🧩 규칙 찾기 (4-1 선행) */
  pattern(){
    const t=pick(['arith','double','grow','calc','table']);
    switch(t){
      case 'arith':{const a=rnd(1,40),d=pick([3,4,5,6,7,8,9,11,12,15,25]);const seq=[0,1,2,3,4].map(k=>a+d*k);
        return {tag:'수 배열의 규칙',prompt:'규칙을 찾아 다음 수를 쓰세요.',eqHTML:`<span class="small">${seq.join(', ')}, <b>?</b></span>`,input:{type:'num'},ans:a+d*5,explain:`${d}씩 커지는 규칙이에요.`};}
      case 'double':{const a=rnd(1,6);const seq=[0,1,2,3].map(k=>a*Math.pow(2,k));
        return {tag:'수 배열의 규칙',prompt:'규칙을 찾아 다음 수를 쓰세요.',eqHTML:`<span class="small">${seq.join(', ')}, <b>?</b></span>`,input:{type:'num'},ans:a*16,explain:'2배씩 커지는 규칙이에요.'};}
      case 'grow':{const a=rnd(1,10),s=pick([1,2]);let seq=[a];for(let k=1;k<5;k++)seq.push(seq[k-1]+s*k);
        return {tag:'커지는 차의 규칙',prompt:'규칙을 찾아 다음 수를 쓰세요.',eqHTML:`<span class="small">${seq.join(', ')}, <b>?</b></span>`,input:{type:'num'},ans:seq[4]+s*5,explain:`더하는 수가 ${s}씩 커져요: +${s}, +${2*s}, +${3*s}…`};}
      case 'calc':{const sets=[
          {lines:['1 × 9 + 2 = 11','12 × 9 + 3 = 111','123 × 9 + 4 = 1111'],q:'1234 × 9 + 5 = ?',ans:'11111',opts:['11111','12345','111111','11110'],why:'1이 하나씩 늘어나요.'},
          {lines:['11 × 11 = 121','111 × 111 = 12321'],q:'1111 × 1111 = ?',ans:'1234321',opts:['1234321','1111111','1233321','12344321'],why:'가운데 수가 1씩 커졌다가 작아져요.'},
          {lines:['9 × 9 = 81','99 × 99 = 9801','999 × 999 = 998001'],q:'9999 × 9999 = ?',ans:'99980001',opts:['99980001','99990001','9998001','99880001'],why:'9와 0이 하나씩 늘어나요.'},
          {lines:['1 + 2 + 1 = 4','1 + 2 + 3 + 2 + 1 = 9','1 + 2 + 3 + 4 + 3 + 2 + 1 = 16'],q:'1 + 2 + 3 + 4 + 5 + 4 + 3 + 2 + 1 = ?',ans:'25',opts:['25','24','20','36'],why:'가장 큰 수를 두 번 곱한 값이에요 (5 × 5).'}];
        const s=pick(sets);return {tag:'계산식의 규칙',prompt:'계산식의 규칙을 찾아 답을 고르세요.',eqHTML:`<span class="small" style="line-height:1.5">${s.lines.join('<br>')}<br><b>${s.q}</b></span>`,input:{type:'choice',options:shuffle(s.opts)},check:v=>v===s.ans,sol:s.ans,explain:s.why};}
      case 'table':{const a=rnd(2,9),d=rnd(2,6);const nth=pick([8,10,12,15]);
        return {tag:'표에서 규칙 찾기',prompt:`순서에 따라 수가 늘어나요. ${nth}번째 수는?`,visual:`<table style="border-collapse:collapse;font-size:16px"><tr>${['순서',1,2,3,4].map(x=>`<th style="border:2px solid #26282F;padding:6px 14px;background:#F6F4EA">${x}</th>`).join('')}</tr><tr>${['수',a,a+d,a+2*d,a+3*d].map(x=>`<td style="border:2px solid #26282F;padding:6px 14px;text-align:center;font-weight:700">${x}</td>`).join('')}</tr></table>`,input:{type:'num'},ans:a+d*(nth-1),explain:`1번째 ${a}에서 ${d}씩 ${nth-1}번 커져요: ${a} + ${d} × ${nth-1} = ${a+d*(nth-1)}`};}
    }
  },

  /* 🧱 모눈 도형 빌더 (Area Builder 방식) */
  area(_,i){
    const size=Math.min(4+Math.floor(i*.9),12);
    const cells=new Set(['2,2']);
    while(cells.size<size){const [x,y]=pick([...cells]).split(',').map(Number);const [dx,dy]=pick([[1,0],[-1,0],[0,1],[0,-1]]);
      const nx=x+dx,ny=y+dy;if(nx>=0&&nx<6&&ny>=0&&ny<6)cells.add(nx+','+ny);}
    const per=perimeter(cells);const onlyArea=i<3;
    return {tag:onlyArea?'넓이 만들기':'넓이와 둘레 만들기',
      prompt:onlyArea?`모눈을 눌러 <b>넓이가 ${size}칸</b>인 도형을 만드세요.`:`<b>넓이 ${size}칸</b>, <b>둘레 ${per}</b>인 도형을 만드세요. (한 칸의 한 변 = 1)`,
      input:{type:'area',area:size,per:onlyArea?null:per},
      explain:onlyArea?'칸 수가 넓이예요.':`둘레는 바깥쪽 변의 개수예요. 뾰족하게 만들수록 둘레가 커지고, 뭉치면 작아져요.`};
  }
};
function perimeter(cells){let p=0;for(const c of cells){const [x,y]=c.split(',').map(Number);
  for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])if(!cells.has((x+dx)+','+(y+dy)))p++;}return p;}
function connected(cells){if(!cells.size)return false;const start=[...cells][0],seen=new Set([start]),st=[start];
  while(st.length){const [x,y]=st.pop().split(',').map(Number);for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const k=(x+dx)+','+(y+dy);if(cells.has(k)&&!seen.has(k)){seen.add(k);st.push(k);}}}
  return seen.size===cells.size;}
