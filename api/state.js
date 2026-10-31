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
    if(req.method==='PUT'||req.method==='POST'){
      let body=req.body;if(typeof body==='string'){try{body=JSON.parse(body||'{}');}catch(e){body=null;}}
      if(!body||typeof body!=='object'||typeof body.t!=='number')return res.status(400).json({error:'bad_body'});
      const s=JSON.stringify(body);if(s.length>100000)return res.status(413).json({error:'too_big'});
      const cur=await redis(['GET',key]);const prev=cur.result?JSON.parse(cur.result):null;
      if(prev&&typeof prev.t==='number'&&prev.t>body.t)return res.status(200).json({ok:false,stale:true,state:prev});
      // 같은 버전(resetV)끼리는 모은 기록이 줄어드는 저장을 받지 않아요
      if(prev&&prev.resetV===body.resetV&&losesProgress(body,prev))return res.status(200).json({ok:false,stale:true,behind:true,state:prev});
      await redis(['SET',key,s]);return res.status(200).json({ok:true});
    }
    return res.status(405).json({error:'method'});
  }catch(e){return res.status(502).json({error:'store_error',detail:String(e.message||e)});}
};
handler.progressOf=progressOf;handler.losesProgress=losesProgress;
module.exports=handler;
