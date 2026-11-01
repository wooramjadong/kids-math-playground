// 태블릿에서 3학년 2학기를 하는 중에 PC가 1학년 1학기를 골라도 태블릿 학기·학년은 그대로여야 함
const test=require('node:test');const assert=require('node:assert/strict');
const {makeServer,makeDevice,blank}=require('./sync-harness.cjs');
test('PC가 보는 학기(위쪽 학기 버튼)를 1-1로 바꿔도 태블릿의 3-2는 그대로',async()=>{
  const S=makeServer();
  const tab=makeDevice('tab',S,blank({family:'TESTCODE2',group:'32',myGroup:'32',wallet:3}));await tab.pull();await tab.flush();
  const pc=makeDevice('pc',S,blank({group:'32',myGroup:'32'}));await pc.join('TESTCODE2');await pc.flush();
  pc.P.group='11';pc.save();await pc.flush();
  await tab.pull();await tab.flush();
  assert.equal(tab.P.group,'32','태블릿이 보는 학기');
});
test('PC에서 ⚙️ 학년 설정을 1-1로 바꿔도 태블릿 학년(별 기준)은 그대로',async()=>{
  const S=makeServer();
  const tab=makeDevice('tab',S,blank({family:'TESTCODE3',group:'32',myGroup:'32',wallet:3}));await tab.pull();await tab.flush();
  const pc=makeDevice('pc',S,blank({group:'32',myGroup:'32'}));await pc.join('TESTCODE3');await pc.flush();
  pc.P.group='11';pc.P.myGroup='11';pc.save();await pc.flush();
  await tab.pull();await tab.flush();
  assert.equal(tab.P.group,'32','태블릿이 보는 학기');assert.equal(tab.P.myGroup,'32','태블릿 학년');
});