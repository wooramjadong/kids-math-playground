const GENY={
  count(){const e=pick(EMO);
    if(age()==='7'||Math.random()<.3){const n=rnd(1,9);return {prompt:`${e} 모두 몇 개일까요?`,visual:emojiRow(e,n),options:around(n,1,9),ans:String(n),explain:`하나, 둘, 셋… 세어 보면 ${n}개예요.`};}
    if(Math.random()<.5){const n=rnd(11,20);return {prompt:'점은 모두 몇 개일까요?',visual:tenFrame(n),options:around(n,10,20),ans:String(n),explain:`한 판이 10개, 나머지가 ${n-10}개 → ${n}이에요.`};}
    const t=rnd(1,4),o=rnd(0,9),n=t*10+o;return {prompt:`십 묶음 ${t}개와 낱개 ${o}개는 모두 얼마일까요?`,visual:sticks(t,o),options:around(n,10,49),ans:String(n),explain:`십 묶음 ${t}개는 ${t*10}, 낱개 ${o}개를 더하면 ${n}이에요.`};},

  order(){const max=age()==='7'?9:Math.random()<.5?50:100;
    const t=pick(age()==='7'?['blank','bigger','one']:['blank','bigger','one','ten','blank10']);
    switch(t){
      case 'blank':{const s=rnd(1,max-3),miss=rnd(1,2);const seq=[0,1,2,3].map(k=>s+k);
        return {prompt:'빈칸에 들어갈 수는?',visual:`<div class="eq">${seq.map((v,k)=>k===miss?'<span class="q">?</span>':v).join(' · ')}</div>`,options:around(seq[miss],1,max),ans:String(seq[miss]),explain:'수는 1씩 커져요.'};}
      case 'bigger':{let a=rnd(1,max),b=rnd(1,max);while(a===b)b=rnd(1,max);const ans=Math.max(a,b);
        return {prompt:'더 큰 수는 어느 것일까요?',options:shuffle([num(a),num(b)]),ans:String(ans),explain:age()==='7'?'뒤에 세는 수가 더 커요.':'십의 자리가 크면 더 큰 수, 같으면 일의 자리를 비교해요.'};}
      case 'one':{const n=rnd(2,max-1),big=Math.random()<.5;return {prompt:`${n}보다 1 ${big?'큰':'작은'} 수는?`,visual:`<div class="eq">${n}</div>`,options:around(big?n+1:n-1,1,max),ans:String(big?n+1:n-1),explain:`${n} 바로 ${big?'다음':'앞'} 수예요.`};}
      case 'ten':{const n=rnd(11,89),big=Math.random()<.5;return {prompt:`${n}보다 10 ${big?'큰':'작은'} 수는?`,visual:`<div class="eq">${n}</div>`,options:around(big?n+10:n-10,1,100),ans:String(big?n+10:n-10),explain:'십의 자리 숫자만 1 바뀌어요.'};}
      case 'blank10':{const s=rnd(1,5)*10,miss=rnd(1,2);const seq=[0,1,2,3].map(k=>s+k*10);
        return {prompt:'10씩 뛰어 세었어요. 빈칸은?',visual:`<div class="eq">${seq.map((v,k)=>k===miss?'<span class="q">?</span>':v).join(' · ')}</div>`,options:shuffle([num(seq[miss]),num(seq[miss]-10+1),num(seq[miss]+10)]),ans:String(seq[miss]),explain:'10, 20, 30… 십의 자리가 1씩 커져요.'};}
    }},

  ten(){const e=pick(EMO);
    if(age()==='7'){if(Math.random()<.5){const t=rnd(3,9),a=rnd(1,t-1);return {prompt:`${t}은(는) ${a}와(과) 얼마로 가를 수 있을까요?`,visual:twoColorFrame(a,t-a),options:around(t-a,1,9),ans:String(t-a),explain:`주황 ${a}개, 파랑 ${t-a}개. ${a}와 ${t-a}를 모으면 ${t}이에요.`};}
      const a=rnd(1,5),b=rnd(1,9-a);return {prompt:`${a}와(과) ${b}를 모으면 얼마일까요?`,visual:`<div class="grp">${emojiRow(e,a)}<span class="sign">+</span>${emojiRow(e,b)}</div>`,options:around(a+b,1,9),ans:String(a+b),explain:`${a}개와 ${b}개를 모두 세면 ${a+b}개예요.`};}
    if(Math.random()<.6){const a=rnd(1,9);return {prompt:`${a}에 얼마를 더하면 10이 될까요?`,visual:tenFrame(a),options:around(10-a,1,9),ans:String(10-a),explain:`빈칸이 ${10-a}개 남았어요. ${a} + ${10-a} = 10`};}
    const a=rnd(1,9);return {prompt:`10은 ${a}와(과) 얼마로 가를 수 있을까요?`,visual:twoColorFrame(a,10-a),options:around(10-a,1,9),ans:String(10-a),explain:`10 = ${a} + ${10-a}`};},

  addsub(){const e=pick(EMO);
    if(age()==='7'){if(Math.random()<.5){const a=rnd(1,6),b=rnd(1,9-a);return {prompt:`${a} 더하기 ${b}는?`,visual:`<div class="grp">${emojiRow(e,a)}<span class="sign">+</span>${emojiRow(e,b)}</div><div class="eq">${a} + ${b} = <span class="q">?</span></div>`,options:around(a+b,1,9),ans:String(a+b),explain:`모두 세면 ${a+b}개예요.`};}
      const a=rnd(2,9),b=rnd(1,a-1);return {prompt:`${a} 빼기 ${b}는?`,visual:`${emojiRow(e,a,b)}<div class="eq">${a} − ${b} = <span class="q">?</span></div>`,options:around(a-b,0,9),ans:String(a-b),explain:`${a}개에서 ${b}개를 지우면 ${a-b}개 남아요.`};}
    const t=pick(['carry','sub20','two','twoSub']);
    switch(t){
      case 'carry':{const a=rnd(6,9),b=rnd(10-a+1,9);return {prompt:`${a} 더하기 ${b}는?`,visual:tenFrame(a+b)+`<div class="eq">${a} + ${b} = <span class="q">?</span></div>`,options:around(a+b,10,18,4),ans:String(a+b),explain:`${a}에 ${10-a}를 더해 10을 만들고, 남은 ${b-(10-a)}을 더하면 ${a+b}이에요.`};}
      case 'sub20':{const a=rnd(11,18),b=rnd(1,a-10);return {prompt:`${a} 빼기 ${b}는?`,visual:`<div class="eq">${a} − ${b} = <span class="q">?</span></div>`,options:around(a-b,10,18,4),ans:String(a-b),explain:`일의 자리끼리 빼요: ${a-10} − ${b} = ${a-b-10}, 그래서 ${a-b}`};}
      case 'two':{const a=rnd(11,50),b=rnd(1,9-(a%10))+rnd(0,3)*10;const s=a+b;return {prompt:`${a} 더하기 ${b}는?`,visual:`<div class="eq">${a} + ${b} = <span class="q">?</span></div>`,options:around(s,10,99,4),ans:String(s),explain:'일의 자리끼리, 십의 자리끼리 더해요.'};}
      case 'twoSub':{const a=rnd(21,89),b=rnd(1,a%10||1)+rnd(0,Math.floor(a/10)-1)*10;const s=a-b;return {prompt:`${a} 빼기 ${b}는?`,visual:`<div class="eq">${a} − ${b} = <span class="q">?</span></div>`,options:around(s,1,99,4),ans:String(s),explain:'일의 자리끼리, 십의 자리끼리 빼요.'};}
    }},

  shape(){const flat=['세모','네모','원'],name={'원':'동그라미','세모':'세모','네모':'네모'};const colors=['#FB923C','#60A5FA','#F472B6','#4ADE80','#FACC15'];
    const solids={'상자 모양':['🎁','📦','🧱','📕','🍫'],'둥근 기둥 모양':['🥫','🔋','🧯','🥁','🪣'],'공 모양':['⚽','🎾','🏀','🍊','🎱']};
    const t=age()==='7'?pick(['find','which','find']):pick(['find','which','solid','solid','roll']);
    switch(t){
      case 'find':{const k=pick(flat);return {prompt:`${name[k]} 모양은 어느 것일까요?`,options:shuffle(flat).map(f=>({v:f,html:shapeSVG(f,pick(colors))})),ans:k,explain:k==='세모'?'뾰족한 부분이 3개면 세모예요.':k==='네모'?'뾰족한 부분이 4개면 네모예요.':'뾰족한 부분이 없고 둥글면 동그라미예요.'};}
      case 'which':{const items={'세모':['🍕','⛺','🔺','🎄'],'네모':['📘','🚪','🧊','🖼️'],'원':['🍪','🪙','🕰️','🍩']};const k=pick(flat),em=pick(items[k]);
        return {prompt:'이 물건은 어떤 모양일까요?',visual:`<div style="font-size:80px;line-height:1">${em}</div>`,...words(['세모','네모','동그라미'],name[k]),explain:`${em}은(는) ${name[k]} 모양이에요.`};}
      case 'solid':{const keys=Object.keys(solids),k=pick(keys),em=pick(solids[k]);
        return {prompt:'이것과 같은 모양은 어느 것일까요?',visual:`<div style="font-size:80px;line-height:1">${em}</div>`,options:shuffle(keys).map(kk=>({v:kk,html:pick(solids[kk].filter(x=>x!==em))})),ans:k,explain:`${em}은(는) ${k}이에요.`};}
      case 'roll':{const qs=[{q:'잘 굴러가고, 위에 쌓을 수도 있는 모양은?',a:'둥근 기둥 모양'},{q:'어느 쪽으로도 잘 굴러가는 모양은?',a:'공 모양'},{q:'평평해서 잘 쌓을 수 있고 굴러가지 않는 모양은?',a:'상자 모양'}];const s=pick(qs);
        return {prompt:s.q,options:shuffle(Object.keys(solids)).map(kk=>({v:kk,html:`<div style="font-size:40px">${solids[kk][0]}</div><div style="font-size:14px">${kk}</div>`,col:true})),ans:s.a,explain:`${s.a}이 맞아요.`};}
    }},

  compare(){const colors=['#FB923C','#60A5FA','#F472B6','#4ADE80'];
    const t=pick(['len','weight','cup','tall']);
    switch(t){
      case 'len':{const n=age()==='7'?2:3;const lens=shuffle([90,150,210]).slice(0,n);const most=Math.random()<.5;const ans=most?Math.max(...lens):Math.min(...lens);
        return {prompt:`${n===3?'가장':'더'} ${most?'긴':'짧은'} 것은 어느 것일까요?`,options:lens.map((l,i)=>({v:String(l),html:lenBar(l,colors[i])})),ans:String(ans),explain:'한쪽 끝을 맞추고 다른 쪽 끝을 비교해요.'};}
      case 'weight':{const pairs=[['🐘','🐭'],['🚌','🚲'],['🐻','🐇'],['📚','🪶'],['🍉','🍇']];const [h,l]=pick(pairs);const left=Math.random()<.5;const heavy=Math.random()<.5;
        return {prompt:`더 ${heavy?'무거운':'가벼운'} 것은 어느 것일까요?`,visual:seesawSVG(left?h:l,left?l:h,left),options:shuffle([{v:h,html:h},{v:l,html:l}]),ans:heavy?h:l,explain:'시소에서 내려간 쪽이 더 무거워요.'};}
      case 'cup':{const n=age()==='7'?2:3;const lv=shuffle([.3,.6,.9]).slice(0,n);const most=Math.random()<.5;const ans=most?Math.max(...lv):Math.min(...lv);
        return {prompt:`물이 ${n===3?'가장':'더'} ${most?'많이':'적게'} 담긴 것은?`,options:lv.map(l=>({v:String(l),html:cupSVG(l)})),ans:String(ans),explain:'같은 컵이면 물의 높이가 높을수록 많아요.'};}
      case 'tall':{const pairs=[['🦒','🐈'],['🌳','🌱'],['🏢','🏠'],['👨','👶']];const [t1,s1]=pick(pairs);const tall=Math.random()<.5;
        return {prompt:`키가 더 ${tall?'큰':'작은'} 것은?`,options:shuffle([{v:t1,html:`<span style="font-size:64px">${t1}</span>`},{v:s1,html:`<span style="font-size:36px">${s1}</span>`}]),ans:tall?t1:s1,explain:'아래를 맞추고 위쪽 끝을 비교해요.'};}
    }},

  pattern(){const sets=[['🔴','🔵','🟡'],['🍎','🍌','🍇'],['⭐','🌙','☀️'],['🐶','🐱','🐭'],['🟥','🟩','🟦']];const s=pick(sets);
    const t=age()==='7'?'ab':pick(['ab','abb','abc','nums']);
    let unit;if(t==='ab')unit=[s[0],s[1]];else if(t==='abb')unit=[s[0],s[1],s[1]];else if(t==='abc')unit=[s[0],s[1],s[2]];
    if(t==='nums'){const st=pick([1,2,5]),d=pick([2,5,10]);const seq=[0,1,2,3,4].map(k=>st+d*k);return {prompt:'규칙을 찾아 다음 수를 고르세요.',visual:`<div class="eq">${seq.join(', ')}, <span class="q">?</span></div>`,options:around(seq[4]+d,1,60),ans:String(seq[4]+d),explain:`${d}씩 커지는 규칙이에요.`};}
    const len=t==='ab'?6:7;const seq=Array.from({length:len},(_,i)=>unit[i%unit.length]);const ans=unit[len%unit.length];
    return {prompt:'규칙을 찾아 다음에 올 것을 고르세요.',visual:`<div style="font-size:44px;letter-spacing:6px">${seq.join('')}<span class="q" style="color:var(--red);font-weight:700">?</span></div>`,options:shuffle(s.slice(0,unit.includes(s[2])?3:3)).map(x=>({v:x,html:x})),ans,explain:`${unit.join(' ')} 이(가) 반복돼요.`};},

  clock(){const h=rnd(1,12);const half=age()==='8'&&Math.random()<.5;const m=half?30:0;const lab=x=>`${x}시${half?' 30분':''}`;
    const ansL=lab(h);const others=new Set();while(others.size<2){const o=rnd(1,12);if(o!==h)others.add(age()==='8'&&Math.random()<.4?`${o}시${half?'':' 30분'}`:lab(o));}
    return {prompt:'시계가 몇 시를 가리키고 있을까요?',visual:clockSVG(h,m),...words([ansL,...others],ansL),explain:half?`긴바늘이 6을 가리키면 30분, 짧은바늘은 ${h}와 ${h%12+1} 사이에 있어요.`:`긴바늘이 12를 가리키면 정각, 짧은바늘이 ${h}를 가리켜요.`};},
};
