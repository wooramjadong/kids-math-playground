// ⭐ 가족 별: 시원이(기본 칸)와 나은이(코드+NE) 별을 합쳐서 보여주고 함께 씀 — 실제 서버 코드(api/state.js)로
const test=require('node:test');const assert=require('node:assert/strict');
const {makeServer,makeDevice,blank}=require('./sync-harness.cjs');
const kidCodeBase=c=>{c=String(c||'');return c.length>8&&c.endsWith('NE')?c.slice(0,-2):c;};
const kid=k=>({KID:k,kidCodeBase});
const BASE='TESTFAM1',NAEUN=BASE+'NE';
async function family(start){
  const S=makeServer();
  const siwon=makeDevice('siwon',S,blank(Object.assign({family:BASE,__ctx:kid('siwon')},start||{})));await siwon.pull();await siwon.flush();
  const naeun=makeDevice('naeun',S,blank({family:NAEUN,group:'11',__ctx:kid('naeun')}));await naeun.pull();await naeun.flush();
  return {S,siwon,naeun};
}
const famW=d=>d.ctx.starWallet();
async function settle(...ds){for(let k=0;k<3;k++)for(const d of ds){await d.flush();await d.pull();await d.flush();}}
function earn(d,n){d.ctx.starEarn(d.ctx.P,n);d.save();}
function spend(d){d.ctx.starSpendCard(d.ctx.P);d.save();}

test('나은이가 받은 별이 가족 별(시원 칸)에 더해져서 두 기기 모두 합계로 보임',async()=>{
  const {S,siwon,naeun}=await family({wallet:2,cardPlays:8});
  assert.equal(famW(naeun),2,'나은 기기도 가족 별 2개를 봄');
  earn(naeun,3);await settle(naeun,siwon);
  assert.equal(S.state(BASE).wallet,5,'서버 가족 별');assert.equal(famW(siwon),5);assert.equal(famW(naeun),5);
  assert.equal(S.state(BASE).cardPlays,8);
});
test('시원(+2)과 나은(+1)이 동시에 받아도 모두 더해짐, 진도·하루 기록은 아이마다 따로',async()=>{
  const {S,siwon,naeun}=await family({wallet:10});
  siwon.P.daily.earned=2;earn(siwon,2);naeun.P.daily.earned=1;earn(naeun,1);
  await siwon.flush();await naeun.flush();await settle(siwon,naeun);
  assert.equal(S.state(BASE).wallet,13);assert.equal(famW(siwon),13);assert.equal(famW(naeun),13);
  assert.equal(siwon.P.daily.earned,2,'시원 하루 기록');assert.equal(naeun.P.daily.earned,1,'나은 하루 기록');
  assert.ok(!S.state(NAEUN)||!(S.state(NAEUN).wallet>0),'나은 칸에는 별이 따로 쌓이지 않음');
});
test('나은 기기에서 카드놀이(별 5개)를 써도 가족 별에서 빠짐',async()=>{
  const {S,siwon,naeun}=await family({wallet:7});
  spend(naeun);await settle(naeun,siwon);
  assert.equal(S.state(BASE).wallet,2);assert.equal(S.state(BASE).cardPlays,1);assert.equal(famW(siwon),2);assert.equal(famW(naeun),2);
});
test('아이별 별 시절에 나은 칸에 쌓인 별(3개)도 가족 별로 한 번만 옮겨짐',async()=>{
  const S=makeServer();
  const siwon=makeDevice('siwon',S,blank({family:BASE,wallet:4,__ctx:kid('siwon')}));await siwon.pull();await siwon.flush();
  const naeun=makeDevice('naeun',S,blank({family:NAEUN,wallet:3,__ctx:kid('naeun')}));await naeun.pull();await naeun.flush();
  const naeun2=makeDevice('naeun2',S,blank({__ctx:kid('naeun')}));await naeun2.join(NAEUN);await naeun2.flush();
  await settle(naeun,naeun2,siwon);await settle(naeun,naeun2,siwon);
  assert.equal(S.state(BASE).wallet,7,'4+3, 두 나은 기기가 옮겨도 한 번만');assert.equal(famW(siwon),7);assert.equal(famW(naeun),7);assert.equal(famW(naeun2),7);
});
test('예전 화면 시원 기기가 가족 별을 받은 뒤 +1 저장해도 정확히 더함',async()=>{
  const {S,naeun}=await family({wallet:2});
  earn(naeun,3);await settle(naeun);
  const seen=S.state(BASE);const old={...seen};delete old.ledger;old.wallet=seen.wallet+1;old.t=Date.now()+60000;
  await S.call('PUT',BASE,old);
  assert.equal(S.state(BASE).wallet,6);await settle(naeun);assert.equal(famW(naeun),6);
});