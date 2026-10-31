// 두 기기 + 실제 서버 코드(api/state.js, 메모리 Redis)로 가족 코드 동기화를 재현하는 시험
const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const ROOT=process.env.SYNC_ROOT||path.join(__dirname,'..');
const CLOUD_SRC=fs.readFileSync(path.join(ROOT,'js','8-cloud.js'),'utf8');
const SYNC_KEYS=['wallet','cardPlays','myGroup','daily','done','stickers','setupDone','group','grad','resetV','stageProgress'];
const RESET_V='2026-10-29';

const settle=async()=>{for(let i=0;i<60;i++)await new Promise(r=>setImmediate(r));};
let clock=Date.UTC(2026,9,31,3,0,0);
class FakeDate extends Date{constructor(...a){super(...(a.length?a:[clock]));} static now(){clock+=1000;return clock;}}

function makeServer(){
  const db=new Map();
  global.fetch=async(url,opts)=>{const cmd=JSON.parse(opts.body);if(cmd[0]==='GET')return {ok:true,json:async()=>({result:db.has(cmd[1])?db.get(cmd[1]):null})};
    db.set(cmd[1],cmd[2]);return {ok:true,json:async()=>({result:'OK'})};};
  process.env.KV_REST_API_URL='http://mem';process.env.KV_REST_API_TOKEN='x';
  delete require.cache[require.resolve(path.join(ROOT,'api','state.js'))];
  const handler=require(path.join(ROOT,'api','state.js'));
  const log=[];
  async function call(method,code,body){let status=200,out=null;
    const res={setHeader(){},status(s){status=s;return res;},json(o){out=o;return res;},end(){return res;}};
    await handler({method,query:{code},body},res);log.push(method+' '+status+(out&&out.behind?' behind':'')+(out&&out.stale?' stale':''));return {status,out};}
  return {db,call,log,state:code=>{const v=db.get('mathplay:'+code);return v?JSON.parse(v):null;}};
}
function blank(extra){return Object.assign({wallet:0,cardPlays:0,myGroup:'11',group:'11',setupDone:true,daily:{d:'2026-10-31',earned:0,plays:{},got:{}},done:{},stickers:[],grad:{},resetV:RESET_V,t:clock},extra||{});}

function makeDevice(name,server,init){
  const ls=new Map();const timers=[];
  const el={classList:{toggle(){},contains(){return true;},add(){},remove(){}},textContent:'',before(){},querySelectorAll(){return [];}};
  const ctx={P:JSON.parse(JSON.stringify(init)),SYNC_KEYS,RESET_V,Date:FakeDate,JSON,Math,Number,String,Object,Array,console,
    fixGroups(){},applyReset(){return false;},GROUPS:new Proxy({},{get:()=>({voice:false})}),voice:{on:false},audio:{win(){}},
    renderHome(){},renderSetup(){},alert(){},prompt(){},confirm:()=>true,
    $:sel=>(sel==='#setup .modalbox'||sel==='#cloudBadge'||sel==='#cloudSec')?null:el,
    store:{save(d){ls.set('mathplay-all-v1',JSON.stringify(d));}},
    localStorage:{getItem:k=>ls.has(k)?ls.get(k):null,setItem:(k,v)=>ls.set(k,String(v)),removeItem:k=>ls.delete(k)},
    document:{addEventListener(){},visibilityState:'hidden'},window:{addEventListener(){}},
    setTimeout:(fn)=>{timers.push(fn);return timers.length;},clearTimeout:(id)=>{if(id)timers[id-1]=null;},setInterval(){},
    fetch:async(url,opts)=>{const u=new URL(url,'https://x/');const method=(opts&&opts.method)||'GET';
      const {status,out}=await server.call(method,u.searchParams.get('code'),opts&&opts.body?JSON.parse(opts.body):undefined);
      return {status,json:async()=>out};}};
  vm.createContext(ctx);
  const api=vm.runInContext(CLOUD_SRC+'\n;({CLOUD,cloudBackups:typeof cloudBackups==="function"?cloudBackups:()=>[],cloudMergeStage:typeof cloudMergeStage==="function"?cloudMergeStage:null})',ctx);
  return {name,ctx,api,
    get P(){return ctx.P;},
    save(){ctx.store.save(ctx.P);},          // 게임이 기록을 저장 (store.save = 시각 갱신 + 예약 업로드)
    async flush(){await settle();while(timers.some(Boolean)){const fns=timers.splice(0).filter(Boolean);for(const f of fns)await f();await settle();}},
    async pull(){await settle();await api.CLOUD.pull();await settle();},
    async join(code){await settle(); // 설정의 "코드 입력 → 연결"과 같은 순서 (확인창은 '확인')
      const {out}=await server.call('GET',code);const local=api.CLOUD.pack();
      ctx.P.family=code;api.CLOUD.remoteT=0;
      if(!out.state)await api.CLOUD.push(true);else await api.CLOUD.reconcile(out.state);await settle();
    },
    backups(){return api.cloudBackups();}};
}

test('사고 재현: PC에 별 14개(서버 비어 있음) → 태블릿 빈 기록으로 먼저 연결해도 별 14개가 지켜짐',async()=>{
  const S=makeServer();
  const tab=makeDevice('tab',S,blank());
  await tab.join('JX2KVSKA');                                             // 태블릿이 먼저: 빈 기록이 올라감
  assert.equal(S.state('JX2KVSKA').wallet,0);
  const pc=makeDevice('pc',S,blank({wallet:14,family:'JX2KVSKA'}));      // PC는 코드만 있고 못 올린 별 14개 → 새 코드로 열림
  await pc.pull();                                                        // PC가 서버 확인
  assert.equal(pc.P.wallet,14,'PC 별이 지워지면 안 됨');
  assert.equal(S.state('JX2KVSKA').wallet,14,'PC가 더 많은 기록을 다시 올려야 함');
  await tab.pull();
  assert.equal(tab.P.wallet,14,'태블릿도 14개를 받아야 함');
  assert.ok(tab.backups().length===0,'빈 기록은 백업할 필요 없음');
});

test('서버가 비어 있으면 코드를 가진 기기가 열리자마자 기록을 올림',async()=>{
  const S=makeServer();
  const pc=makeDevice('pc',S,blank({wallet:14,family:'JX2KVSKA'}));
  await pc.pull();
  assert.equal(S.state('JX2KVSKA').wallet,14);
  const tab=makeDevice('tab',S,blank());await tab.join('JX2KVSKA');
  assert.equal(tab.P.wallet,14);
});

test('12:03 경쟁 재현: 서버 14개인데 PC가 확인 전에 0개 기록을 저장해도 서버는 14개 유지, PC도 14개로',async()=>{
  const S=makeServer();
  const pc=makeDevice('pc',S,blank({family:'JX2KVSKA'}));await pc.pull(); // 12:02:27 PC가 본 서버는 0개
  const fix=Object.assign(S.state('JX2KVSKA'),{wallet:14,t:clock+1});  // 12:02:37 서버를 14개로 복원
  assert.equal((await S.call('PUT','JX2KVSKA',fix)).out.ok,true);
  pc.P.daily.plays={x:1};pc.save();await pc.flush();                    // 12:03:03 PC가 확인 전에 0개 기록을 저장·업로드
  assert.equal(S.state('JX2KVSKA').wallet,14,'서버가 더 적은 기록을 받으면 안 됨');
  assert.equal(pc.P.wallet,14,'PC는 서버의 14개를 받아야 함');
  assert.ok(S.log.some(l=>l.includes('behind')),'서버가 거절했어야 함');
});

test('카드놀이에 별 5개 사용은 정상적으로 다른 기기에 전달 (14 → 9)',async()=>{
  const S=makeServer();
  const tab=makeDevice('tab',S,blank({wallet:14,family:'JX2KVSKA'}));await tab.pull();
  const pc=makeDevice('pc',S,blank());await pc.join('JX2KVSKA');assert.equal(pc.P.wallet,14);
  tab.P.wallet-=5;tab.P.cardPlays+=1;tab.save();await tab.flush();
  assert.equal(S.state('JX2KVSKA').wallet,9);
  await pc.pull();assert.equal(pc.P.wallet,9);assert.equal(pc.P.cardPlays,1);
});

test('두 기기가 따로 진행(PC는 별 +2, 태블릿은 카드놀이 5개 사용)해도 합쳐서 9+2-5=6',async()=>{
  const S=makeServer();
  const tab=makeDevice('tab',S,blank({wallet:9,cardPlays:1,family:'JX2KVSKA'}));await tab.pull();
  const pc=makeDevice('pc',S,blank());await pc.join('JX2KVSKA');
  pc.P.wallet+=2;pc.P.daily.earned=2;pc.P.done={11:{n9:{best:100,stars:2}}};  // PC: 문제 풀어 별 2개 (아직 안 올림)
  tab.P.wallet-=5;tab.P.cardPlays+=1;tab.save();await tab.flush();          // 태블릿: 카드놀이 먼저 올림
  pc.save();await pc.flush();                                                // PC: 나중에 올림 → 서버 거절 → 합치기
  const s=S.state('JX2KVSKA');
  assert.equal(s.wallet,6);assert.equal(s.cardPlays,2);assert.equal(s.done[11].n9.best,100);
  assert.equal(pc.P.wallet,6);
  await tab.pull();assert.equal(tab.P.wallet,6);assert.equal(tab.P.done[11].n9.best,100);
  assert.ok(pc.backups().length>=1,'합치기 전 백업');
});

test('학년 설정 같은 변경(모은 기록 동일)은 최근 것이 전달됨',async()=>{
  const S=makeServer();
  const a=makeDevice('a',S,blank({wallet:9,cardPlays:1,family:'JX2KVSKA'}));await a.pull();
  const b=makeDevice('b',S,blank());await b.join('JX2KVSKA');
  a.P.myGroup='32';a.P.group='32';a.save();await a.flush();
  await b.pull();assert.equal(b.P.myGroup,'32');assert.equal(b.P.wallet,9);
});

test('스티커·단원 기록·단계 진도도 줄어드는 저장은 거절',async()=>{
  const S=makeServer();
  const a=makeDevice('a',S,blank({stickers:['🦊','🐼'],done:{32:{u1:{best:90,stars:1}}},stageProgress:{version:1,semesters:{32:{level:2,steps:{1:{training:true,passes:2,rounds:3,best:100,complete:true}},recent:[]}}},family:'ABCDEFGH'}));
  await a.pull();
  for(const bad of [{stickers:['🦊']},{done:{}},{stageProgress:{version:1,semesters:{}}}]){
    const body=Object.assign(JSON.parse(JSON.stringify(S.state('ABCDEFGH'))),bad,{t:clock+99999});
    const {out}=await S.call('PUT','ABCDEFGH',body);
    assert.equal(out.ok,false);assert.equal(out.behind,true);
  }
  assert.equal(S.state('ABCDEFGH').stickers.length,2);
});

test('단계 진도 합치기: 단계마다 더 많이 진행한 쪽, 레벨 다시 계산',async()=>{
  const S=makeServer();const d=makeDevice('d',S,blank());
  const A={version:1,semesters:{32:{level:2,steps:{1:{training:true,passes:2,rounds:3,best:100,complete:true},2:{training:true,passes:0,rounds:1,best:60}},recent:[1]}}};
  const B={version:1,semesters:{32:{level:1,steps:{1:{training:true,passes:1,rounds:2,best:85},2:{training:true,passes:1,rounds:2,best:90}},recent:[]},41:{level:1,steps:{1:{training:true,passes:0,rounds:1,best:40}},recent:[]}}};
  const m=d.api.cloudMergeStage(A,B);
  assert.equal(m.semesters[32].steps[1].complete,true);assert.equal(m.semesters[32].steps[2].passes,1);
  assert.equal(m.semesters[32].steps[2].best,90);assert.equal(m.semesters[32].level,2);assert.ok(m.semesters[41]);
});

test('reset 버전이 다른 저장(학기 초기화 같은 큰 변경)은 기존처럼 허용',async()=>{
  const S=makeServer();
  await S.call('PUT','RESETCODE',blank({wallet:20,resetV:'old',t:1}));
  const {out}=await S.call('PUT','RESETCODE',blank({wallet:0,t:2}));
  assert.equal(out.ok,true);
});

test('서버 확인 중에 연결을 끊으면, 늦게 도착한 서버 기록을 적용하지 않음',async()=>{
  const S=makeServer();
  const a=makeDevice('a',S,blank({wallet:9,cardPlays:1,family:'LATECODE'}));await a.pull();
  const b=makeDevice('b',S,blank({wallet:9,cardPlays:1,family:'LATECODE'}));await b.pull();
  b.P.wallet=20;b.save();await b.flush();                     // 서버는 별 20개
  const p=a.api.CLOUD.pull();                                 // A가 확인 시작 (아직 도착 전)
  a.P.family='';a.P.wallet=2;                                 // 그 사이에 연결 끊고 기록 변경
  await p;await settle();
  assert.equal(a.P.wallet,2,'끊긴 기기에 서버 기록이 덮이면 안 됨');
  assert.equal(a.P.family,'');
});
