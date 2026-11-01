// 가족 코드별 기록 저장 API (Upstash Redis REST — Vercel Marketplace에서 연결하면 환경변수가 자동으로 들어와요)
// [안전장치 2026-10-31] 모은 기록(모은 별·카드놀이 횟수·스티커·단원 기록·졸업·단계 진도)이
// 줄어드는 저장은 거절하고, 서버에 있는 기록을 돌려줘요. 기기 쪽(js/8-cloud.js)이 받아서 합쳐요.
const URL_=process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL;
const TOK=process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN;
async function redis(cmd){
  const r=await fetch(URL_,{method:'POST',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(cmd)});
  if(!r.ok)throw new Error('redis '+r.status);
  return r.json();
}
// 기기 쪽 cloudProgress와 같은 규칙
function progressOf(s){
  s=s||{};const n=v=>Number(v)||0;
  let doneN=0,doneBest=0;const d=s.done||{};
  for(const g in d){const u=d[g]||{};for(const k in u){doneN++;doneBest+=n(u[k]&&u[k].best);}}
  let stage=0;const sem=(s.stageProgress&&s.stageProgress.semesters)||{};
  for(const g in sem){const st=(sem[g]&&sem[g].steps)||{};for(const k in st){const x=st[k]||{};stage+=(x.training?1:0)+n(x.passes)+(x.complete?1:0);}}
  return {earned:n(s.wallet)+5*n(s.cardPlays),cards:n(s.cardPlays),stickers:(s.stickers||[]).length,doneN,doneBest,grad:Object.keys(s.grad||{}).length,stage};
}
function losesProgress(next,prev){const a=progressOf(next),b=progressOf(prev);return Object.keys(a).some(k=>a[k]<b[k]);}

// ⭐ 별 장부 [2026-11-01] (js/8-cloud.js와 같은 규칙): 기기별 칸(dev)에 받은 별(e)·카드놀이(c)를 적고
// 저장할 때마다 서버 기록과 기기별로 합쳐서, 두 기기가 동시에 받은 별이 덮어쓰여 사라지지 않게 한다.
// 장부를 모르는 예전 화면이 올린 기록은 늘어난 별만 장부 기준(base)에 반영된다.
const ln=v=>Math.max(0,Number(v)||0);
const lvalid=L=>!!(L&&typeof L==='object'&&L.dev&&typeof L.dev==='object'&&L.base&&typeof L.base==='object');
function ledgerOf(s,other){
  if(s&&lvalid(s.ledger))return s.ledger;
  const E=ln(s&&s.wallet)+5*ln(s&&s.cardPlays),C=ln(s&&s.cardPlays);
  let de=0,dc=0;const o=other&&lvalid(other.ledger)?other.ledger:null;
  if(o)for(const k in o.dev){de+=ln(o.dev[k]&&o.dev[k].e);dc+=ln(o.dev[k]&&o.dev[k].c);}
  return {v:1,base:{e:Math.max(0,E-de),c:Math.max(0,C-dc)},dev:{}};
}
function ledgerMerge(a,b){
  const A=ledgerOf(a,b),B=ledgerOf(b,a);
  const m={v:1,base:{e:Math.max(ln(A.base.e),ln(B.base.e)),c:Math.max(ln(A.base.c),ln(B.base.c))},dev:{}};
  for(const L of [A,B])for(const k in L.dev){const x=L.dev[k]||{},y=m.dev[k]||{e:0,c:0};m.dev[k]={e:Math.max(ln(y.e),ln(x.e)),c:Math.max(ln(y.c),ln(x.c))};}
  return m;
}
function ledgerApply(s,L){let e=ln(L.base.e),c=ln(L.base.c);for(const k in L.dev){e+=ln(L.dev[k].e);c+=ln(L.dev[k].c);}s.ledger=L;s.cardPlays=c;s.wallet=Math.max(0,e-5*c);return s;}

const handler=async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,PUT,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS')return res.status(204).end();
  if(!URL_||!TOK)return res.status(503).json({error:'no_store'});
  const code=String(req.query.code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(code.length<6||code.length>16)return res.status(400).json({error:'bad_code'});
  const key='mathplay:'+code;
  try{
    if(req.method==='GET'){const r=await redis(['GET',key]);return res.status(200).json({state:r.result?JSON.parse(r.result):null});}
    // ⭐ 가족 별(시원+나은) [2026-11-01]: 별 장부만 합치기. 다른 아이 기기가 별을 받거나 쓸 때 기본 칸에 보낸다.
    // 진도·스티커 등 다른 기록은 그대로 두고, 기기별 칸마다 큰 값으로 합쳐서(여러 번 보내도 한 번만 셈) 저장한다.
    if(String(req.query.mode||'')==='stars'&&(req.method==='PUT'||req.method==='POST')){
      let body=req.body;if(typeof body==='string'){try{body=JSON.parse(body||'{}');}catch(e){body=null;}}
      if(!body||!lvalid(body.ledger))return res.status(400).json({error:'bad_body'});
      if(JSON.stringify(body).length>20000)return res.status(413).json({error:'too_big'});
      const cur=await redis(['GET',key]);const prev=cur.result?JSON.parse(cur.result):null;
      const next=prev?Object.assign({},prev):{resetV:body.resetV||null,stickers:[],done:{},grad:{}};
      // 기본 칸에 장부가 아직 없으면 지금 별·카드놀이를 그대로 기준으로 (보낸 칸은 아직 여기에 없는 별)
      const prevL=prev&&lvalid(prev.ledger)?prev.ledger:{v:1,base:{e:ln(prev&&prev.wallet)+5*ln(prev&&prev.cardPlays),c:ln(prev&&prev.cardPlays)},dev:{}};
      ledgerApply(next,ledgerMerge({ledger:prevL},{ledger:body.ledger}));
      next.t=Math.max(Number(prev&&prev.t)||0,Date.now())+1;
      await redis(['SET',key,JSON.stringify(next)]);
      return res.status(200).json({ok:true,ledger:next.ledger,wallet:next.wallet,cardPlays:next.cardPlays});
    }
    if(req.method==='PUT'||req.method==='POST'){
      let body=req.body;if(typeof body==='string'){try{body=JSON.parse(body||'{}');}catch(e){body=null;}}
      if(!body||typeof body!=='object'||typeof body.t!=='number')return res.status(400).json({error:'bad_body'});
      const s=JSON.stringify(body);if(s.length>100000)return res.status(413).json({error:'too_big'});
      const cur=await redis(['GET',key]);const prev=cur.result?JSON.parse(cur.result):null;
      if(prev&&typeof prev.t==='number'&&prev.t>body.t)return res.status(200).json({ok:false,stale:true,state:prev});
      // 별 장부 합치기: 서버에 있던 기기별 별을 모두 살린다(같은 초기화 버전끼리만)
      if(prev&&prev.resetV===body.resetV&&(lvalid(prev.ledger)||lvalid(body.ledger)))ledgerApply(body,ledgerMerge(prev,body));
      // 같은 버전(resetV)끼리는 모은 기록이 줄어드는 저장을 받지 않아요
      if(prev&&prev.resetV===body.resetV&&losesProgress(body,prev))return res.status(200).json({ok:false,stale:true,behind:true,state:prev});
      await redis(['SET',key,JSON.stringify(body)]);return res.status(200).json({ok:true,wallet:body.wallet,cardPlays:body.cardPlays});
    }
    return res.status(405).json({error:'method'});
  }catch(e){return res.status(502).json({error:'store_error',detail:String(e.message||e)});}
};
handler.progressOf=progressOf;handler.losesProgress=losesProgress;handler.ledgerMerge=ledgerMerge;
module.exports=handler;
