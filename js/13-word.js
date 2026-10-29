/* ───────── 📖 서술형(문장제) 문제 ─────────
   요즘 교과 추세에 맞춰, 계산 위주 단원 중 '일부'를 이야기가 있는 문장제로 바꿔 내요.
   - 전체가 아니라 확률(WORD_RATE)로 섞여요.
   - 7·8세는 아주 짧고 쉬운 문장(그림 상황) 위주, 학년이 올라갈수록 문장이 길어져요.
   - 기존 생성기를 감싸는 방식이라, 문장제가 안 나오면 원래 문제가 그대로 나와요. */
const WORD_RATE = { '11':0.3, '12':0.3, '21':0.3, '22':0.3, '31':0.3, '32':0.3, '41':0.3, '42':0.3 }; // '중' 문제 중 이 비율만큼 문장제로

/* 소재(주어·물건·단위) 풀 — 아이에게 친숙한 것들 */
const WN = {
  who: ['시원이','민준이','서연이','지우','하준이','예은이','도윤이','수아','언니','형','동생','친구'],
  fruit: [['사과','개'],['귤','개'],['딸기','개'],['바나나','개'],['포도','송이'],['방울토마토','개']],
  thing: [['연필','자루'],['색종이','장'],['구슬','개'],['스티커','장'],['사탕','개'],['블록','개'],['쿠키','개'],['공','개']],
  animal: [['병아리','마리'],['강아지','마리'],['오리','마리'],['토끼','마리'],['금붕어','마리'],['참새','마리']],
  place: ['바구니','상자','접시','필통','가방','서랍'],
};
const wWho = () => pick(WN.who);
const wItem = () => pick([].concat(WN.fruit, WN.thing));         // 셀 수 있는 물건
const EDIBLE = ['사과','귤','딸기','바나나','포도','방울토마토','사탕','쿠키'];
const isEd = it => EDIBLE.indexOf(it) !== -1;
const otherWho = self => { let w=wWho(); let g=0; while(w===self && g++<10) w=wWho(); return w; };
const useVerb = (it,self) => isEd(it) ? '먹었어요' : pick(['잃어버렸어요', otherWho(self)+'에게 주었어요']);
const josa = (w, a, b) => { // 받침에 따라 조사 선택 (a=받침있을때, b=없을때)
  const c = w.charCodeAt(w.length-1); if (c < 0xAC00 || c > 0xD7A3) return a;
  return (c - 0xAC00) % 28 ? a : b;
};
const eun = w => w + josa(w,'은','는');
const iga = w => w + josa(w,'이','가');
const eul = w => w + josa(w,'을','를');
const gwa = w => w + josa(w,'과','와');

/* 공통: 숫자 답 문장제를 표준 문제 객체로 */
function wq(tag, prompt, ans, unit, explain) {
  return { tag: '📖 '+tag, prompt, input: { type:'num', unit }, ans, explain, _word:true };
}

/* ── 학년군별 문장제 생성기 ── (계산 결과가 딱 떨어지도록 숫자를 만든 뒤 이야기로 감쌈) */
const WORD = {
  // 7·8세: 덧셈/뺄셈, 아주 짧게
  addsub(g){
    const who=wWho(), [it,u]=wItem(), big = g==='8';
    if (Math.random()<0.5){ // 더하기
      const a=rnd(big?3:1,big?9:5), b=rnd(big?2:1,big?8:4);
      return wq('이야기 덧셈',
        `${iga(who)} ${it} ${a}${u}를 가지고 있었어요. ${b}${u}를 더 받았어요. 모두 몇 ${u}일까요?`,
        a+b, u, `${a} + ${b} = ${a+b}`);
    }
    const a=rnd(big?5:3,big?9:6), b=rnd(1,a-1);
    return wq('이야기 뺄셈',
      `${iga(who)} ${it} ${a}${u} 중에서 ${b}${u}를 ${useVerb(it,who)}. 몇 ${u} 남았을까요?`,
      a-b, u, `${a} − ${b} = ${a-b}`);
  },
  // 1학년 2학기: 받아올림/받아내림
  carry(){ const who=wWho(), [it,u]=wItem(); const a=rnd(5,9), b=rnd(11-a,9);
    return wq('이야기 덧셈', `${iga(who)} ${eul(it)} 어제 ${a}${u}, 오늘 ${b}${u} 모았어요. 모두 몇 ${u}일까요?`, a+b, u, `${a} + ${b} = ${a+b}`); },
  borrow(){ const who=wWho(), [it,u]=wItem(); const a=rnd(11,18), b=rnd(a-9,9);
    return wq('이야기 뺄셈', `${who}에게 ${it} ${a}${u}가 있었는데 ${b}${u}를 친구에게 주었어요. 몇 ${u} 남았을까요?`, a-b, u, `${a} − ${b} = ${a-b}`); },
  // 3-1 · 3-2 이하 덧셈뺄셈(세 자리)
  add3(){ const who=wWho(); const a=rnd(120,480), b=rnd(110,320);
    return wq('이야기 덧셈', `놀이공원에 오전에 ${a}명, 오후에 ${b}명이 왔어요. 하루 동안 모두 몇 명이 왔을까요?`, a+b, '명', `${a} + ${b} = ${a+b}`); },
  sub3(){ const a=rnd(300,850), b=rnd(120,Math.min(299,a-50));
    return wq('이야기 뺄셈', `색종이 ${a}장 중에서 ${b}장을 사용했어요. 남은 색종이는 몇 장일까요?`, a-b, '장', `${a} − ${b} = ${a-b}`); },
  // 곱셈
  mul(g){ const who=wWho(), [it,u]=wItem(); const box=pick(WN.place);
    const per = g==='31'||g==='3' ? rnd(2,9) : rnd(3,9);
    const cnt = g==='31'||g==='3' ? rnd(2,9) : rnd(4,9);
    return wq('이야기 곱셈',
      `한 ${box}에 ${it} ${per}${u}씩 들어 있어요. ${box} ${cnt}개에는 ${eun(it)} 모두 몇 ${u}일까요?`,
      per*cnt, u, `${per} × ${cnt} = ${per*cnt}`); },
  // 나눗셈 (나누어떨어지게)
  div(){ const who=wWho(), [it,u]=wItem(); const ppl=rnd(2,6), each=rnd(2,8); const tot=ppl*each;
    return wq('이야기 나눗셈',
      `${it} ${tot}${u}를 친구 ${ppl}명에게 똑같이 나누어 주려고 해요. 한 명이 몇 ${u}씩 받을까요?`,
      each, u, `${tot} ÷ ${ppl} = ${each}`); },
  // 4-1 곱셈/나눗셈 (조금 큰 수)
  muldiv(){ if (Math.random()<0.5){ const per=rnd(12,40), cnt=rnd(11,25);
      return wq('이야기 곱셈', `공책이 한 상자에 ${per}권씩 들어 있어요. ${cnt}상자에는 공책이 모두 몇 권 있을까요?`, per*cnt, '권', `${per} × ${cnt} = ${per*cnt}`); }
    const each=rnd(12,24), ppl=rnd(3,9); const tot=each*ppl;
    return wq('이야기 나눗셈', `사탕 ${tot}개를 ${ppl}봉지에 똑같이 나누어 담으면 한 봉지에 몇 개씩 담길까요?`, each, '개', `${tot} ÷ ${ppl} = ${each}`); },
  // 4-2 소수 덧셈뺄셈
  // 2학년: 받아올림·받아내림 있는 두 자리 수, 묶어 세기
  add2(){ const a=rnd(25,68), b=rnd(15,39);
    return wq('이야기 덧셈', `도서관에 동화책이 ${a}권, 위인전이 ${b}권 있어요. 책은 모두 몇 권일까요?`, a+b, '권', `${a} + ${b} = ${a+b}`); },
  sub2(){ const a=rnd(42,95), b=rnd(15,a-10);
    return wq('이야기 뺄셈', `색종이 ${a}장 중에서 ${b}장을 사용했어요. 남은 색종이는 몇 장일까요?`, a-b, '장', `${a} − ${b} = ${a-b}`); },
  two(){ const a1=rnd(1,5),b1=rnd(1,9-a1-1),a0=rnd(0,5),b0=rnd(0,9-a0),a=a1*10+a0,b=b1*10+b0;
    return wq('이야기 덧셈', `${iga(wWho())} 구슬을 ${a}개 가지고 있었는데 ${b}개를 더 받았어요. 구슬은 모두 몇 개일까요?`, a+b, '개', `${a} + ${b} = ${a+b}`); },
  mulSmall(){ const per=rnd(2,5), cnt=rnd(2,5);
    return wq('이야기 곱셈', `한 접시에 쿠키가 ${per}개씩 ${cnt}접시 있어요. 쿠키는 모두 몇 개일까요?`, per*cnt, '개', `${per} × ${cnt} = ${per*cnt}`); },
  // 3학년: (두 자리)×(한 자리), (세 자리)×(한 자리), (두 자리)÷(한 자리)
  mul21(){ const per=rnd(12,48), cnt=rnd(2,9);
    return wq('이야기 곱셈', `한 상자에 귤이 ${per}개씩 들어 있어요. ${cnt}상자에 든 귤은 모두 몇 개일까요?`, per*cnt, '개', `${per} × ${cnt} = ${per*cnt}`); },
  mul31(){ const per=rnd(105,399), cnt=rnd(2,9);
    return wq('이야기 곱셈', `${iga(wWho())} 하루에 ${per}걸음씩 ${cnt}일 동안 걸었어요. 모두 몇 걸음을 걸었을까요?`, per*cnt, '걸음', `${per} × ${cnt} = ${per*cnt}`); },
  div2(){ const ppl=rnd(2,6), each=rnd(12,Math.floor(96/ppl)); const tot=ppl*each;
    return wq('이야기 나눗셈', `색연필 ${tot}자루를 ${ppl}명에게 똑같이 나누어 주면 한 명이 몇 자루씩 받을까요?`, each, '자루', `${tot} ÷ ${ppl} = ${each}`); },
  // 4학년: 분모가 같은 분수의 덧셈
  frac(){ const d=rnd(5,9), a=rnd(1,d-3), b=rnd(1,d-1-a);
    return { tag:'📖 이야기 분수', prompt:`피자 한 판을 똑같이 ${d}조각으로 나누었어요. 형이 ${a}조각, 동생이 ${b}조각을 먹었다면 두 사람이 먹은 피자는 전체의 얼마일까요?`, input:{type:'frac',fields:['n','d']}, check:v=>v.d>0&&v.n*d===(a+b)*v.d, solHTML:fracHTML(a+b,d), explain:`${a}/${d} + ${b}/${d} = ${a+b}/${d}`, _word:true }; },
  dec(){ const f=x=>Math.round(x*10)/10; const a=f(rnd(15,89)/10), b=f(rnd(10,Math.round(a*10)-5)/10);
    if (Math.random()<0.5) return { tag:'📖 이야기 소수', prompt:`끈이 ${a} m 있었는데 ${b} m를 사용했어요. 남은 끈은 몇 m일까요?`, input:{type:'num',decimal:true}, ans:f(a-b), solText:String(f(a-b)), explain:`${a} − ${b} = ${f(a-b)}`, _word:true };
    const c=f(rnd(10,70)/10); return { tag:'📖 이야기 소수', prompt:`물을 아침에 ${a} L, 저녁에 ${c} L 마셨어요. 하루 동안 마신 물은 모두 몇 L일까요?`, input:{type:'num',decimal:true}, ans:f(a+c), solText:String(f(a+c)), explain:`${a} + ${c} = ${f(a+c)}`, _word:true };
  },
};

/* 어떤 단원에 어떤 문장제를 쓸지 (학기별) */
const WORD_MAP = {
  '11': { addsub:()=>WORD.addsub('7') },
  '12': { three:()=>WORD.addsub('8'), addsub2:()=>Math.random()<.5?WORD.carry():WORD.borrow(), addsub3:()=>WORD.two() },
  '21': { addsub:()=>Math.random()<.5?WORD.add2():WORD.sub2(), mul:()=>WORD.mulSmall() },
  '22': { times:()=>WORD.mul('3') },
  '31': { addsub:()=>Math.random()<.5?WORD.add3():WORD.sub3(), mul:()=>WORD.mul21(), div:()=>WORD.div() },
  '32': { mul:()=>WORD.mul31(), div:()=>WORD.div2() },
  '41': { muldiv:()=>WORD.muldiv() },
  '42': { dec:()=>WORD.dec(), fracadd:()=>WORD.frac() },
};

/* nextQuestion을 감싸서, '중' 문제 일부를 서술형으로 바꿔요 ('하'·'상'은 그대로) */
(function(){
  if (typeof nextQuestion !== 'function') return;
  const _next = nextQuestion;
  nextQuestion = function(){
    _next(); // 원래 문제 먼저 생성 (S.q 세팅)
    try{
      if (!S || !S.q || S.q.lv !== 'mid') return;
      const map = WORD_MAP[S.group]; if (!map) return;
      const maker = map[S.mode]; if (!maker) return;
      if (Math.random() >= (WORD_RATE[S.group] || 0)) return;
      const wqObj = maker(); if (!wqObj) return;
      const q = normalize(wqObj); q.lv = 'mid'; q.hard = false;
      renderQuestion(q);
    }catch(e){/* 문제가 있으면 원래 문제 그대로 둠 */}
  };
})();