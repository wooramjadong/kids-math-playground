// 두 기기가 "동시에" 문제를 풀어 별을 받을 때 별이 모두 쌓이는지 (실제 서버 코드 api/state.js + 메모리 Redis)
const test=require('node:test');const assert=require('node:assert/strict');
const {makeServer,makeDevice,blank}=require('./sync-harness.cjs');

// 게임이 별을 주는 것과 같은 동작: 새 코드면 cloudEarn(장부에 기록), 예전 코드면 wallet만 올림
function earn(dev,n){
  if(typeof dev.ctx.cloudEarn==='function')dev.ctx.cloudEarn(dev.ctx.P,n);
  else dev.P.wallet+=n;
  dev.P.daily.earned=(dev.P.daily.earned||0)+n;
  dev.save();
}
function spendCard(dev){
  if(typeof dev.ctx.cloudSpendCard==='function')dev.ctx.cloudSpendCard(dev.ctx.P);
  else {dev.P.wallet-=5;dev.P.cardPlays++;}
  dev.save();
}
async function twoDevices(start){
  const S=makeServer();
  const pc=makeDevice('pc',S,blank(Object.assign({family:'TESTCODE1'},start||{})));
  await pc.pull();await pc.flush();
  const tab=makeDevice('tab',S,blank());await tab.join('TESTCODE1');await tab.flush();
  return {S,pc,tab};
}
async function settleAll(...devs){for(let k=0;k<3;k++)for(const d of devs){await d.flush();await d.pull();await d.flush();}}

test('동시에 별 받기: PC +2, 태블릿 +1 → 둘 다 쌓여서 19+3=22',async()=>{
  const {S,pc,tab}=await twoDevices({wallet:19,cardPlays:4});
  assert.equal(tab.P.wallet,19);
  earn(pc,2);earn(tab,1);                 // 서로 상대 기록을 받기 전에 각자 별을 받음
  await pc.flush();await tab.flush();     // 각자 서버로 올림 (거의 동시에)
  await settleAll(pc,tab);
  assert.equal(S.state('TESTCODE1').wallet,22,'서버 별');
  assert.equal(pc.P.wallet,22,'PC 별');assert.equal(tab.P.wallet,22,'태블릿 별');
});

test('동시에 별 받기 + 카드놀이: PC 카드놀이(-5), 태블릿 +2 → 19-5+2=16, 카드놀이 5판',async()=>{
  const {S,pc,tab}=await twoDevices({wallet:19,cardPlays:4});
  spendCard(pc);earn(tab,2);
  await pc.flush();await tab.flush();await settleAll(pc,tab);
  assert.equal(S.state('TESTCODE1').wallet,16);assert.equal(S.state('TESTCODE1').cardPlays,5);
  assert.equal(pc.P.wallet,16);assert.equal(tab.P.wallet,16);
});

test('여러 번 번갈아 동시에: 매번 별이 빠짐없이 더해짐 (같은 기록을 여러 번 받아도 두 번 세지 않음)',async()=>{
  const {S,pc,tab}=await twoDevices({wallet:0});
  for(let r=0;r<4;r++){earn(pc,1);earn(tab,2);await tab.flush();await pc.flush();await settleAll(pc,tab);}
  assert.equal(S.state('TESTCODE1').wallet,12);assert.equal(pc.P.wallet,12);assert.equal(tab.P.wallet,12);
  await settleAll(pc,tab);await settleAll(pc,tab);
  assert.equal(pc.P.wallet,12,'여러 번 맞춰도 그대로');
});

test('태블릿 시계가 5분 늦어도 태블릿에서 받은 별이 지켜짐',async()=>{
  const S=makeServer();
  const pc=makeDevice('pc',S,blank({wallet:10,family:'TESTCODE1'}));await pc.pull();await pc.flush();
  const tab=makeDevice('tab',S,blank({__skew:-5*60e3}));await tab.join('TESTCODE1');await tab.flush();
  earn(pc,1);await pc.flush();
  earn(tab,2);await tab.flush();await settleAll(pc,tab);
  assert.equal(S.state('TESTCODE1').wallet,13);assert.equal(tab.P.wallet,13);assert.equal(pc.P.wallet,13);
});

test('서버도 장부를 합침: PC 별(+1)을 모르는 태블릿(+3)이 먼저 덮어써도 서버에 PC 별이 남음',async()=>{
  const {S,pc,tab}=await twoDevices({wallet:10});
  earn(pc,1);await pc.flush();            // 서버 11 (PC 칸 +1)
  earn(tab,3);await tab.flush();          // 태블릿은 PC 별을 모름(13) → 서버가 합쳐서 14
  assert.equal(S.state('TESTCODE1').wallet,14,'PC가 다시 확인하기 전에도 서버에 14');
  await settleAll(pc,tab);assert.equal(pc.P.wallet,14);assert.equal(tab.P.wallet,14);
});

test('예전 화면(장부 모름) 기기: 새 기기 별을 이미 받은 상태에서 +1 → 두 번 세지 않고 정확히 더함',async()=>{
  const {S,pc}=await twoDevices({wallet:10});
  earn(pc,2);await pc.flush();await settleAll(pc);                   // 서버 12 (장부: 기준 10 + PC 2)
  const seen=S.state('TESTCODE1');const old={...seen};delete old.ledger; // 예전 화면은 장부를 모름
  old.wallet=seen.wallet+1;old.t=Date.now()+5000;                       // 그 기기에서 별 +1
  await S.call('PUT','TESTCODE1',old);
  assert.equal(S.state('TESTCODE1').wallet,13);await settleAll(pc);assert.equal(pc.P.wallet,13);
});

test('예전 화면 기기가 새 기기 별을 모른 채 +1 → 별이 부풀지 않음(예전처럼 많은 쪽 유지)',async()=>{
  const {S,pc}=await twoDevices({wallet:10});
  const before=S.state('TESTCODE1');
  earn(pc,2);await pc.flush();                                          // 서버 12
  const old={...before};delete old.ledger;old.wallet=11;old.t=Date.now()+5000; // 예전 기기는 10에서 +1
  await S.call('PUT','TESTCODE1',old);
  const w=S.state('TESTCODE1').wallet;assert.ok(w>=12&&w<=13,'12~13 사이여야 함: '+w);
});

test('장부가 있는 기록끼리 맞춰도 숫자가 커지지 않음 (같은 기록 반복 저장)',async()=>{
  const {S,pc,tab}=await twoDevices({wallet:5,cardPlays:1});
  earn(pc,1);spendCard(tab);await pc.flush();await tab.flush();
  for(let k=0;k<5;k++){await settleAll(pc,tab);pc.save();tab.save();await pc.flush();await tab.flush();}
  assert.equal(S.state('TESTCODE1').wallet,1);assert.equal(S.state('TESTCODE1').cardPlays,2);
  assert.equal(pc.P.wallet,1);assert.equal(tab.P.wallet,1);
});