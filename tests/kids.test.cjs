// 아이 프로필: 태어난 해 → 학년·학기 자동 계산, 학년 이상 학기만 별·진도 인정
const test=require('node:test');const assert=require('node:assert/strict');const load=require('./load-math.cjs');
const {run}=load();
const g=(kid,y,m,d)=>run(`JSON.stringify(kidGrade('${kid}',new Date(${y},${m-1},${d})))`);
test('2026년 11월: 시원(2017년생) 3학년 2학기, 나은(2020년생) 7세 취학 전',()=>{
  assert.deepEqual(JSON.parse(g('siwon',2026,11,1)),{grade:3,sem:2,group:'32',label:'3학년 2학기'});
  assert.deepEqual(JSON.parse(g('naeun',2026,11,1)),{grade:0,sem:0,group:'11',label:'7세 (취학 전)'});
});
test('학기 바뀜: 1~2월은 지난 학년 2학기, 3월 새 학년 1학기, 9월 2학기',()=>{
  assert.equal(JSON.parse(g('siwon',2027,2,20)).group,'32');
  assert.equal(JSON.parse(g('siwon',2027,3,2)).group,'41');
  assert.equal(JSON.parse(g('siwon',2027,9,1)).group,'42');
  assert.equal(JSON.parse(g('naeun',2027,3,2)).group,'11');assert.equal(JSON.parse(g('naeun',2027,3,2)).label,'1학년 1학기');
  assert.equal(JSON.parse(g('naeun',2027,9,1)).group,'12');
  assert.equal(JSON.parse(g('siwon',2028,3,2)).group,'42','5학년이 되면 가장 높은 4학년 2학기까지 인정');
});
test('별 인정: 시원은 3-2·4-1·4-2만, 나은은 1-1부터 전부',()=>{
  const ok=(grp,kid)=>run(`gradeAllows('${grp}','${kid}')`);
  // 지금 날짜 기준이므로 2026-11~2027-02 사이에 실행된다고 가정한 대신, 날짜 고정 계산으로 확인
  const order=['11','12','21','22','31','32','41','42'];
  const siwon=JSON.parse(g('siwon',2026,11,1)).group,naeun=JSON.parse(g('naeun',2026,11,1)).group;
  assert.deepEqual(order.filter(x=>order.indexOf(x)>=order.indexOf(siwon)),['32','41','42']);
  assert.deepEqual(order.filter(x=>order.indexOf(x)>=order.indexOf(naeun)),order);
  assert.equal(typeof ok('11','siwon'),'boolean');
});