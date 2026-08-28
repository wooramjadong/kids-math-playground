// 구글 클라우드 TTS 프록시 — GOOGLE_TTS_KEY 환경변수 필요
// 같은 문장은 CDN에 캐싱되어 구글 호출(과금 글자 수) 없이 바로 재생돼요.
const KEY=process.env.GOOGLE_TTS_KEY;
const VOICES=new Set(['ko-KR-Neural2-A','ko-KR-Neural2-B','ko-KR-Neural2-C','ko-KR-Wavenet-A','ko-KR-Wavenet-D','ko-KR-Chirp3-HD-Kore','ko-KR-Chirp3-HD-Leda','ko-KR-Chirp3-HD-Charon']);
module.exports=async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  if(!KEY)return res.status(503).json({error:'no_key'});
  const t=String(req.query.t||'').slice(0,300).trim();
  const v=VOICES.has(req.query.v)?req.query.v:'ko-KR-Neural2-A';
  let rate=parseFloat(req.query.r);if(!isFinite(rate))rate=0.95;rate=Math.min(1.3,Math.max(0.6,Math.round(rate*100)/100));
  if(!t)return res.status(400).json({error:'no_text'});
  try{
    const g=await fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key='+KEY,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({input:{text:t},voice:{languageCode:'ko-KR',name:v},audioConfig:{audioEncoding:'MP3',speakingRate:rate}})});
    if(!g.ok){const err=await g.text();return res.status(502).json({error:'tts_error',status:g.status,detail:err.slice(0,400)});}
    const j=await g.json();
    if(!j.audioContent)return res.status(502).json({error:'no_audio'});
    const buf=Buffer.from(j.audioContent,'base64');
    res.setHeader('Content-Type','audio/mpeg');
    res.setHeader('Cache-Control','public, max-age=86400, s-maxage=31536000, immutable');
    return res.status(200).send(buf);
  }catch(e){return res.status(502).json({error:'tts_fail',detail:String(e.message||e)});}
};
