// 가족 코드별 기록 저장 API (Upstash Redis REST — Vercel Marketplace에서 연결하면 환경변수가 자동으로 들어와요)
const URL_=process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL;
const TOK=process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN;
async function redis(cmd){
  const r=await fetch(URL_,{method:'POST',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(cmd)});
  if(!r.ok)throw new Error('redis '+r.status);
  return r.json();
}
module.exports=async(req,res)=>{
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
      await redis(['SET',key,s]);return res.status(200).json({ok:true});
    }
    return res.status(405).json({error:'method'});
  }catch(e){return res.status(502).json({error:'store_error',detail:String(e.message||e)});}
};
