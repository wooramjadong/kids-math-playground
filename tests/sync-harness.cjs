// 두 기기 + 실제 서버 코드(api/state.js, 메모리 Redis)로 가족 코드 동기화를 재현하는 시험
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const ROOT=process.env.SYNC_ROOT||path.join(__dirname,'..');
const CLOUD_SRC=fs.readFileSync(path.join(ROOT,'js','8-cloud.js'),'utf8');
// 실제 js/7-sync.js 의 SYNC_KEYS 를 그대로 쓴다(동기화 항목이 바뀌어도 시험이 따라감)
const SYNC_KEYS=JSON.parse(fs.readFileSync(path.join(ROOT,'js','7-sync.js'),'utf8').match(/const SYNC_KEYS=(\[[^\]]*\])/)[1].replace(/'/g,'"'));
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
  async function call(method,code,body,query){let status=200,out=null;
    const res={setHeader(){},status(s){status=s;return res;},json(o){out=o;return res;},end(){return res;}};
    await handler({method,query:Object.assign({},query||{},{code}),body},res);log.push(method+' '+status+(out&&out.behind?' behind':'')+(out&&out.stale?' stale':''));return {status,out};}
  return {db,call,log,state:code=>{const v=db.get('mathplay:'+code);return v?JSON.parse(v):null;}};
}
function blank(extra){return Object.assign({wallet:0,cardPlays:0,myGroup:'11',group:'11',setupDone:true,daily:{d:'2026-10-31',earned:0,plays:{},got:{}},done:{},stickers:[],grad:{},resetV:RESET_V,t:clock},extra||{});}

function makeDevice(name,server,init){
  const ls=new Map();const timers=[];
  const el={classList:{toggle(){},contains(){return true;},add(){},remove(){}},textContent:'',before(){},querySelectorAll(){return [];}};
  const skew=Number(init.__skew)||0;delete init.__skew;const extra=init.__ctx||null;delete init.__ctx;
  class DevDate extends Date{constructor(...a){super(...(a.length?a:[clock+skew]));} static now(){clock+=1000;return clock+skew;}}
  const ctx={P:JSON.parse(JSON.stringify(init)),SYNC_KEYS,RESET_V,Date:DevDate,JSON,Math,Number,String,Object,Array,console,
    fixGroups(){},applyReset(){return false;},GROUPS:new Proxy({},{get:()=>({voice:false})}),voice:{on:false},audio:{win(){}},
    renderHome(){},renderSetup(){},alert(){},prompt(){},confirm:()=>true,
    $:sel=>(sel==='#setup .modalbox'||sel==='#cloudBadge'||sel==='#cloudSec')?null:el,
    store:{save(d){ls.set('mathplay-all-v1',JSON.stringify(d));}},
    localStorage:{getItem:k=>ls.has(k)?ls.get(k):null,setItem:(k,v)=>ls.set(k,String(v)),removeItem:k=>ls.delete(k)},
    document:{addEventListener(){},visibilityState:'hidden'},window:{addEventListener(){}},
    setTimeout:(fn)=>{timers.push(fn);return timers.length;},clearTimeout:(id)=>{if(id)timers[id-1]=null;},setInterval(){},
    fetch:async(url,opts)=>{const u=new URL(url,'https://x/');const method=(opts&&opts.method)||'GET';
      const {status,out}=await server.call(method,u.searchParams.get('code'),opts&&opts.body?JSON.parse(opts.body):undefined,Object.fromEntries(u.searchParams));
      return {status,json:async()=>out};}};
  if(extra)Object.assign(ctx,extra); // 아이 프로필 등 1-helpers.js 쪽 함수 흉내
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

module.exports={makeServer,makeDevice,blank,settle,ROOT};
