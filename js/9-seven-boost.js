/* ───────── 7세 난이도 +반학기 패치 ─────────
   입학 준비(9까지) → 1학년 1학기 초반 수준(20까지의 수, 10 가르기, 합이 10 이하 덧뺄셈, 30분 시계).
   8세 문제는 그대로 두고 7세 분기만 바꿔치기해요. 원래대로 되돌리려면 index.html에서 이 파일 한 줄만 빼면 됩니다. */
(function(){
const G={...GENY},H={...HARDY};   // 원본 보관 (8세는 그대로 위임)

/* 단원 설명도 새 범위로 */
GROUPS['7'].sub='1학년 준비';
GROUPS['7'].desc='20까지의 수, 10 가르기, 합이 10까지의 덧셈과 뺄셈. 글을 몰라도 🔊가 읽어 줘요. 8문제를 풀면 별과 스티커, 별 5개로 카드놀이 1판!';
MODES_Y.forEach(m=>{const t={count:'20까지의 수',order:'19까지 순서 · 사이의 수',ten:'10 가르기와 모으기',addsub:'합이 10까지',compare:'세 가지 비교',clock:'몇 시 · 몇 시 30분'}[m.id];if(t)m.s7=t;});

GENY.count=function(){if(age()!=='7')return G.count();
  const e=pick(EMO);
  if(Math.random()<.5){const n=rnd(5,12);return {prompt:`${e} 모두 몇 개일까요?`,visual:emojiRow(e,n),options:around(n,3,15),ans:String(n),explain:n>10?`다섯씩 묶어 세면 빨라요. 열보다 ${n-10} 더 많으니 ${n}!`:`하나, 둘, 셋… 세어 보면 ${n}개예요.`};}
  const n=rnd(8,15);return {prompt:'점은 모두 몇 개일까요?',visual:tenFrame(n),options:around(n,6,18),ans:String(n),explain:n>10?`한 판이 가득 차면 10개! 10하고 ${n-10}개 더 있으니 ${n}이에요.`:`빈칸 없이 세면 ${n}개예요.`};};

GENY.order=function(){if(age()!=='7')return G.order();
  const max=19;const t=pick(['blank','bigger','one','between']);
  if(t==='blank'){const s=rnd(1,max-3),miss=rnd(1,2);const seq=[0,1,2,3].map(k=>s+k);
    return {prompt:'빈칸에 들어갈 수는?',visual:`<div class="eq">${seq.map((v,k)=>k===miss?'<span class="q">?</span>':v).join(' · ')}</div>`,options:around(seq[miss],1,max),ans:String(seq[miss]),explain:'수는 1씩 커져요.'};}
  if(t==='bigger'){let a=rnd(1,max),b=rnd(1,max);while(a===b)b=rnd(1,max);const ans=Math.max(a,b);
    return {prompt:'더 큰 수는 어느 것일까요?',options:shuffle([num(a),num(b)]),ans:String(ans),explain:'10이 넘는 수는 십의 자리부터 비교해요. 뒤에 세는 수가 더 커요.'};}
  if(t==='one'){const n=rnd(2,max-1),big=Math.random()<.5;return {prompt:`${n}보다 1 ${big?'큰':'작은'} 수는?`,visual:`<div class="eq">${n}</div>`,options:around(big?n+1:n-1,1,max),ans:String(big?n+1:n-1),explain:`${n} 바로 ${big?'다음':'앞'} 수예요.`};}
  const n=rnd(2,max-1);return {prompt:`${n-1}과 ${n+1} 사이에 있는 수는?`,visual:`<div class="eq">${n-1} · <span class="q">?</span> · ${n+1}</div>`,options:around(n,1,max),ans:String(n),explain:`${n-1} 다음, ${n+1} 앞의 수는 ${n}이에요.`};};

GENY.ten=function(){if(age()!=='7')return G.ten();
  const e=pick(EMO);const r=Math.random();
  if(r<.4){const t=rnd(5,10),a=rnd(1,t-1);return {prompt:`${t}은(는) ${a}와(과) 얼마로 가를 수 있을까요?`,visual:twoColorFrame(a,t-a),options:around(t-a,1,9),ans:String(t-a),explain:`주황 ${a}개, 파랑 ${t-a}개. ${a}와 ${t-a}를 모으면 ${t}이에요.`};}
  if(r<.7){const a=rnd(2,9);return {prompt:`${a}에 얼마를 더하면 10이 될까요?`,visual:tenFrame(a),options:around(10-a,1,9),ans:String(10-a),explain:`빈칸이 ${10-a}개 남았어요. ${a} + ${10-a} = 10`};}
  const a=rnd(2,6),b=rnd(1,10-a);return {prompt:`${a}와(과) ${b}를 모으면 얼마일까요?`,visual:`<div class="grp">${emojiRow(e,a)}<span class="sign">+</span>${emojiRow(e,b)}</div>`,options:around(a+b,2,10),ans:String(a+b),explain:`${a}개와 ${b}개를 모두 세면 ${a+b}개예요.`};};

GENY.addsub=function(){if(age()!=='7')return G.addsub();
  const e=pick(EMO);const bare=Math.random()<.25; // 25%는 그림 없이 식만
  if(Math.random()<.5){const a=rnd(2,8),b=rnd(1,10-a);
    return {prompt:`${a} 더하기 ${b}는?`,visual:(bare?'':`<div class="grp">${emojiRow(e,a)}<span class="sign">+</span>${emojiRow(e,b)}</div>`)+`<div class="eq">${a} + ${b} = <span class="q">?</span></div>`,options:around(a+b,2,10),ans:String(a+b),explain:`모두 세면 ${a+b}이에요.`};}
  const a=rnd(3,10),b=rnd(1,a-1);
  return {prompt:`${a} 빼기 ${b}는?`,visual:(bare?'':emojiRow(e,a,b))+`<div class="eq">${a} − ${b} = <span class="q">?</span></div>`,options:around(a-b,0,9),ans:String(a-b),explain:`${a}개에서 ${b}개를 지우면 ${a-b}개 남아요.`};};

GENY.compare=function(){if(age()!=='7')return G.compare();
  const colors=['#FB923C','#60A5FA','#F472B6'];
  const t=pick(['len3','weight','cup3','tall']);
  if(t==='len3'){const lens=shuffle([90,150,210]);const most=Math.random()<.5;const ans=most?210:90;
    return {prompt:`가장 ${most?'긴':'짧은'} 것은 어느 것일까요?`,options:lens.map((l,i)=>({v:String(l),html:lenBar(l,colors[i])})),ans:String(ans),explain:'끝을 맞추고 세 개를 한꺼번에 비교해요.'};}
  if(t==='cup3'){const lv=shuffle([.3,.6,.9]);const most=Math.random()<.5;const ans=most?.9:.3;
    return {prompt:`물이 가장 ${most?'많이':'적게'} 담긴 것은?`,options:lv.map(l=>({v:String(l),html:cupSVG(l)})),ans:String(ans),explain:'같은 컵이면 물의 높이가 높을수록 많아요.'};}
  if(t==='weight'){const pairs=[['🐘','🐭'],['🚌','🚲'],['🐻','🐇'],['📚','🪶'],['🍉','🍇']];const [h,l]=pick(pairs);const left=Math.random()<.5;const heavy=Math.random()<.5;
    return {prompt:`더 ${heavy?'무거운':'가벼운'} 것은 어느 것일까요?`,visual:seesawSVG(left?h:l,left?l:h,left),options:shuffle([{v:h,html:h},{v:l,html:l}]),ans:heavy?h:l,explain:'시소에서 내려간 쪽이 더 무거워요.'};}
  const pairs=[['🦒','🐈'],['🌳','🌱'],['🏢','🏠'],['👨','👶']];const [t1,s1]=pick(pairs);const tall=Math.random()<.5;
  return {prompt:`키가 더 ${tall?'큰':'작은'} 것은?`,options:shuffle([{v:t1,html:`<span style="font-size:64px">${t1}</span>`},{v:s1,html:`<span style="font-size:36px">${s1}</span>`}]),ans:tall?t1:s1,explain:'아래를 맞추고 위쪽 끝을 비교해요.'};};

GENY.pattern=function(){if(age()!=='7')return G.pattern();
  const s=pick([['🔴','🔵','🟡'],['🍎','🍌','🍇'],['⭐','🌙','☀️'],['🐶','🐱','🐭']]);
  const unit=Math.random()<.5?[s[0],s[1]]:[s[0],s[1],s[1]];
  const len=unit.length===2?6:7;const seq=Array.from({length:len},(_,i)=>unit[i%unit.length]);
  return {prompt:'규칙을 찾아 다음에 올 것을 고르세요.',visual:`<div style="font-size:44px;letter-spacing:6px">${seq.join('')}<span class="q" style="color:var(--red);font-weight:700">?</span></div>`,options:s.slice(0,3).map(x=>({v:x,html:x})),ans:unit[len%unit.length],explain:`${unit.join(' ')} 이(가) 반복돼요.`};};

GENY.clock=function(){if(age()!=='7')return G.clock();
  const h=rnd(1,12);const half=Math.random()<.35;const m=half?30:0;const lab=`${h}시${half?' 30분':''}`;
  const others=new Set();while(others.size<2){const o=rnd(1,12);if(o!==h)others.add(Math.random()<.4?`${o}시${half?'':' 30분'}`:`${o}시${half?' 30분':''}`);}
  return {prompt:'시계가 몇 시를 가리키고 있을까요?',visual:clockSVG(h,m),...words([lab,...others],lab),explain:half?`긴바늘이 6을 가리키면 30분이에요. 짧은바늘은 ${h}와 ${h%12+1} 사이에 있어요.`:`긴바늘이 12를 가리키면 정각, 짧은바늘이 ${h}를 가리켜요.`};};

/* ── 7세 심화도 같이 상향 ── */
HARDY.count=function(){if(age()!=='7')return H.count();
  const n=rnd(13,19);return {prompt:'점은 모두 몇 개일까요? 10을 먼저 찾아보세요.',visual:tenFrame(n),options:around(n,11,20,4),ans:String(n),explain:`가득 찬 판이 10개, 남은 판에 ${n-10}개 → ${n}!`};};
HARDY.order=function(){if(age()!=='7')return H.order();
  if(Math.random()<.5){const s=rnd(12,17);const seq=[s,s-1,null,s-3];return {prompt:'거꾸로 세었어요. 빈칸에 들어갈 수는?',visual:`<div class="eq">${seq.map(v=>v==null?'<span class="q">?</span>':v).join(' · ')}</div>`,options:around(s-2,5,19),ans:String(s-2),explain:'거꾸로 세면 수가 1씩 작아져요.'};}
  const a=rnd(5,17);return {prompt:`${a}와 ${a+3} 사이에 있는 수를 모두 세면 몇 개일까요?`,visual:`<div class="eq">${a} · <span class="q">?</span> · <span class="q">?</span> · ${a+3}</div>`,options:around(2,1,4),ans:'2',explain:`${a+1}과 ${a+2}, 두 개예요. 양 끝 수는 넣지 않아요.`};};
HARDY.ten=function(){if(age()!=='7')return H.ten();
  if(Math.random()<.5){const t=rnd(7,10);const a=rnd(1,t-1);const ok=`${a}와 ${t-a}`;const wrong=[`${a}와 ${t-a+1}`,`${a+1}와 ${t-a+1}`];
    return {prompt:`모으면 ${t}이 되는 것은 어느 것일까요?`,options:shuffle([ok,...wrong]).map(x=>({v:x,html:x,text:true})),ans:ok,explain:`${a} + ${t-a} = ${t}`};}
  const a=rnd(2,8);return {prompt:`□ + ${a} = 10. □는 얼마일까요?`,visual:`<div class="eq"><span class="q">?</span> + ${a} = 10</div>`,options:around(10-a,1,9),ans:String(10-a),explain:`10에서 ${a}를 빼면 ${10-a}이에요.`};};
HARDY.addsub=function(){if(age()!=='7')return H.addsub();
  const e=pick(EMO);const t=pick(['three','blank','sub0']);
  if(t==='three'){const a=rnd(2,5),b=rnd(1,4),c=rnd(1,10-a-b);return {prompt:`${a} + ${b} + ${c}는?`,visual:`<div class="grp">${emojiRow(e,a)}<span class="sign">+</span>${emojiRow(e,b)}<span class="sign">+</span>${emojiRow(e,c)}</div>`,options:around(a+b+c,4,10),ans:String(a+b+c),explain:`앞에서부터 차례로: ${a} + ${b} = ${a+b}, ${a+b} + ${c} = ${a+b+c}`};}
  if(t==='blank'){const a=rnd(1,7),s=rnd(a+1,10);return {prompt:`${a} + □ = ${s}. □는 얼마일까요?`,visual:`<div class="eq">${a} + <span class="q">?</span> = ${s}</div>`,options:around(s-a,1,9),ans:String(s-a),explain:`${s}에서 ${a}를 빼면 ${s-a}`};}
  const b=rnd(2,8);return {prompt:`10 − □ = ${10-b}. □는 얼마일까요?`,visual:`<div class="eq">10 − <span class="q">?</span> = ${10-b}</div>`,options:around(b,1,9),ans:String(b),explain:`10에서 ${b}를 빼면 ${10-b}이 돼요.`};};
HARDY.pattern=function(){if(age()!=='7')return H.pattern();
  const s=pick([['🔴','🔵','🟡'],['🍎','🍌','🍇'],['⭐','🌙','☀️']]);
  if(Math.random()<.5){const unit=[s[0],s[1],s[1],s[2]];const seq=Array.from({length:9},(_,i)=>unit[i%4]);return {prompt:'규칙을 찾아 다음에 올 것을 고르세요.',visual:`<div style="font-size:40px;letter-spacing:4px">${seq.join('')}<span style="color:var(--red);font-weight:700">?</span></div>`,options:s.map(x=>({v:x,html:x})),ans:unit[9%4],explain:`${unit.join(' ')} 네 개씩 반복돼요.`};}
  const st=rnd(1,4),d=pick([1,2]);const seq=[0,1,2,3].map(k=>st+d*k);return {prompt:'규칙을 찾아 다음 수를 고르세요.',visual:`<div class="eq">${seq.join(', ')}, <span class="q">?</span></div>`,options:around(st+d*4,1,15),ans:String(st+d*4),explain:`${d}씩 커지는 규칙이에요.`};};
HARDY.clock=function(){if(age()!=='7')return H.clock();
  const h=rnd(1,10);
  if(Math.random()<.5){const lab=`${h}시 30분`;const others=[`${h}시`,`${h+1}시 30분`];return {prompt:'시계가 몇 시를 가리키고 있을까요?',visual:clockSVG(h,30),...words([lab,...others],lab),explain:`긴바늘이 6이면 30분, 짧은바늘은 ${h}와 ${h+1} 사이에 있어요.`};}
  const lab=`${h+1}시`;const others=[`${h}시`,`${h+2}시`];return {prompt:`지금 ${h}시예요. 1시간 뒤는 몇 시일까요?`,visual:clockSVG(h,0),...words([lab,...others],lab),explain:`짧은바늘이 한 칸 더 가요. ${h} + 1 = ${h+1}`};};

if(!$('#home').classList.contains('hidden'))renderHome();
})();
