// 👨 아빠 모드: 비밀번호(처음 0000, 바꾸면 모든 기기에 적용, 해시만 저장) · 가족 별 충전
const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const {makeServer,makeDevice,blank,ROOT}=require('./sync-harness.cjs');
const DAD_SRC=fs.readFileSync(path.join(ROOT,'js','16-dad.js'),'utf8');
const kidCodeBase=c=>{c=String(c||'');return c.length>8&&c.endsWith('NE')?c.slice(0,-2):c;};
const ctx=k=>({KID:k,kidCodeBase,crypto:require('node:crypto').webcrypto,TextEncoder});
const BASE='TESTDAD1',NAEUN=BASE+'NE';
async function family(start){
  const S=makeServer();
  const siwon=makeDevice('siwon',S,blank(Object.assign({family:BASE,__ctx:ctx('siwon')},start||{})));await siwon.pull();await siwon.flush();
  const naeun=makeDevice('naeun',S,blank({family:NAEUN,__ctx:ctx('naeun')}));await naeun.pull();await naeun.flush();
  for(const d of [siwon,naeun])vm.runInContext(DAD_SRC,d.ctx);
  return {S,siwon,naeun};
}
async function settle(...ds){for(let k=0;k<3;k++)for(const d of ds){await d.flush();await d.pull();await d.flush();}}
const check=(d,pin)=>d.ctx.dadCheck(pin);
const fam=d=>d.ctx.starWallet();

test('처음 비밀번호는 0000만 통과',async()=>{
  const {siwon,naeun}=await family();
  assert.equal(await check(siwon,'0000'),true);assert.equal(await check(siwon,'1234'),false);assert.equal(await check(naeun,'0000'),true);
});
test('시원 기기에서 1234로 바꾸면 나은 기기도 1234만 통과, 서버엔 비밀번호 원문이 없음',async()=>{
  const {S,siwon,naeun}=await family();
  await siwon.ctx.dadSetPin('1234');await settle(siwon,naeun);
  assert.equal(await check(siwon,'1234'),true);assert.equal(await check(siwon,'0000'),false);
  assert.equal(await check(naeun,'1234'),true);assert.equal(await check(naeun,'0000'),false);
  const raw=JSON.stringify(S.state(BASE));assert.ok(S.state(BASE).dadPin&&/^[0-9a-f]{64}$/.test(S.state(BASE).dadPin.h));assert.ok(!raw.includes('"1234"'));
});
test('나은 기기에서 5678로 바꾸면 가족 기본 칸에 저장되어 시원 기기도 5678',async()=>{
  const {S,siwon,naeun}=await family();
  await naeun.ctx.dadSetPin('5678');await settle(naeun,siwon);
  assert.ok(S.state(BASE).dadPin,'기본 칸에 저장');assert.equal(await check(siwon,'5678'),true);assert.equal(await check(siwon,'0000'),false);
});
test('예전 기기가 비밀번호 없이(또는 옛 비밀번호로) 저장해도 최신 비밀번호가 남음',async()=>{
  const {S,siwon,naeun}=await family();
  await siwon.ctx.dadSetPin('2468');await settle(siwon);
  const old={...S.state(BASE)};delete old.dadPin;old.t=Date.now()+60000;await S.call('PUT',BASE,old);
  const stale={...S.state(BASE),dadPin:{h:'0'.repeat(64),s:'x',t:1},t:Date.now()+120000};await S.call('PUT',BASE,stale);
  await settle(siwon,naeun);assert.equal(await check(naeun,'2468'),true);assert.equal(await check(siwon,'2468'),true);
});
test('충전: 시원 기기 +10, 나은 기기 +5를 동시에 해도 가족 별에 모두 더해짐 (하루 기록은 그대로)',async()=>{
  const {S,siwon,naeun}=await family({wallet:2});
  siwon.ctx.dadCharge(10);naeun.ctx.dadCharge(5);await siwon.flush();await naeun.flush();await settle(siwon,naeun);
  assert.equal(S.state(BASE).wallet,17);assert.equal(fam(siwon),17);assert.equal(fam(naeun),17);
  assert.equal(siwon.P.daily.earned,0);assert.equal(naeun.P.daily.earned,0);
  assert.equal(siwon.ctx.dadCharge(0),0);assert.equal(siwon.ctx.dadCharge(-3),0);assert.equal(siwon.ctx.dadCharge(5000),1000,'한 번에 최대 1000');
});