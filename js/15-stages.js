/* 학기별 12단계. 한 판은 현재 범위 15 + 이전 범위 응용 5.
   기존 wallet/done/grad/stickers는 지우지 않고 stageProgress만 별도로 추가한다. */
const STAGE_SYSTEM=(()=>{
 const order=['11','12','21','22','31','32','41','42'];
 const version='12-stage-20q-v1';
 const mix={low:2,mid:10,high:8};
 const clamp=n=>Math.max(1,Math.min(12,Math.trunc(Number(n))||1));
 const sh=(a,rng=Math.random)=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 const dateNow=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
 function record(p,g){
  if(!p.stageProgress || typeof p.stageProgress!=='object')p.stageProgress={version,semesters:{}};
  const root=p.stageProgress;root.version=version;
  if(!root.semesters||typeof root.semesters!=='object')root.semesters={};
  let r=root.semesters[g];if(!r||typeof r!=='object')r=root.semesters[g]={level:1,steps:{},recent:[]};
  if(!r.steps||typeof r.steps!=='object')r.steps={};
  if(!Array.isArray(r.recent))r.recent=[];
  // 정식으로 완료한 단계만 순서대로 인정한다. 예전 단원 만점은 새 단계의 통과로 오인하지 않는다.
  let level=1;while(level<=12&&r.steps[level]?.complete===true)level++;
  r.level=level;return r;
 }
 function step(p,g,n){const r=record(p,g);n=clamp(n);let s=r.steps[n];if(!s||typeof s!=='object')s=r.steps[n]={training:false,passes:0,rounds:0,best:0};s.passes=Math.max(0,Math.min(2,Number(s.passes)||0));return s;}
 function meta(g,n){
  n=clamp(n);const modes=CUR[g].modes;
  let title,core,kind;
  if(n<=modes.length){core=[modes[n-1].id];title=modes[n-1].title;kind='교과 익히기';}
  else if(n===6){core=modes.map(m=>m.id);title='교과 다지기';kind='단원 연결';}
  else if(n===7){core=modes.slice(0,Math.ceil(modes.length/2)).map(m=>m.id);title='앞 단원 응용';kind='응용';}
  else if(n===8){core=modes.slice(Math.floor(modes.length/2)).map(m=>m.id);title='뒤 단원 응용';kind='응용';}
  else if(n===9){core=modes.map(m=>m.id);title='여러 단원 연결';kind='종합 응용';}
  else if(n===10){core=modes.map(m=>m.id);title='조건을 연결해 추리하기';kind='사고력';}
  else if(n===11){core=modes.map(m=>m.id);title='거꾸로 생각해 해결하기';kind='사고력 심화';}
  else{core=modes.map(m=>m.id);title='학기 종합 관문';kind='졸업 평가';}
  return {number:n,title,core,kind,passScore:n===12?90:80,highRequired:6};
 }
 function previous(g,n){
  const modes=CUR[g].modes;
  const earlier=modes.slice(0,Math.min(n-1,modes.length)).map(m=>({group:g,mode:m.id}));
  if(earlier.length)return earlier;
  const pg=order[order.indexOf(g)-1];
  if(pg)return CUR[pg].modes.map(m=>({group:pg,mode:m.id}));
  // 입학 첫 단계는 아직 앞 단원이 없으므로 9까지의 수의 기초 응용을 쓴다. 선행 단원을 끌어오지 않는다.
  return [{group:g,mode:modes[0].id,baseline:true}];
 }
 function plan(g,n,rng=Math.random,onlyMode=null){
  const info=meta(g,n),core=onlyMode?[onlyMode]:info.core;
  let earlier=previous(g,n);
  if(onlyMode){const index=CUR[g].modes.findIndex(m=>m.id===onlyMode);earlier=previous(g,index+1);}
  const modeCycle=sh(core,rng);let ci=0;
  const currentLevels=['low','low',...sh([...Array(7).fill('mid'),...Array(6).fill('high')],rng)];
  const current=currentLevels.map(lv=>({lv,source:'current',group:g,mode:modeCycle[(ci++)%modeCycle.length],stage:clamp(n)}));
  const recent=earlier.at(-1),oldCycle=sh(earlier,rng);let ri=0;
  const reviewLevels=sh(['mid','mid','mid','high','high'],rng);
  const review=reviewLevels.map((lv,i)=>{const src=i<2?recent:oldCycle[(ri++)%oldCycle.length];return {...src,lv,source:'review',stage:Math.min(clamp(n),6)};});
  const result=[];let c=0,r=0;
  for(let i=0;i<20;i++)result.push([3,7,11,15,19].includes(i)?review[r++]:current[c++]);
  return result;
 }
 function applied(g,mode,lv,n){
  const banks={...APPLIED_1,...APPLIED_2,...APPLIED_3,...APPLIED_4};
  const fn=banks[g]?.[mode];if(typeof fn!=='function')throw new Error(`응용 문제 없음: ${g}/${mode}`);
  return fn(lv,n);
 }
 function hash(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(36);}
 function fingerprint(q){return hash([q.prompt,q.eq,q.eqHTML,q.visual,q.ans,q.sol].join('|'));}
 function generate(entry,seen=new Set(),recent=[]){
  let q,usedApplied;
  for(let tries=0;tries<70;tries++){
   usedApplied=entry.lv==='high'||entry.source==='review'||entry.lv==='mid'&&(entry.stage>=7||Math.random()<.32);
   if(usedApplied)q=applied(entry.group,entry.mode,entry.lv,entry.stage);
   else q=CUR[entry.group].gen[entry.mode][entry.lv]();
   if(!q || !q.input&&!q.options)throw new Error('문제 형식 오류');
   const fp=fingerprint(q);if(tries<69&&(seen.has(fp)||recent.includes(fp)))continue;
   q._fingerprint=fp;q._family=q._family||`${entry.group}:${entry.mode}:${q.tag||entry.lv}`;seen.add(fp);break;
  }
  q._applied=usedApplied;q.lv=entry.lv;q.hard=entry.lv==='high';q._source=entry.source;q._originGroup=entry.group;q._originMode=entry.mode;q._baseline=!!entry.baseline;
  q._originTitle=CUR[entry.group].modes.find(m=>m.id===entry.mode).title;
  return q;
 }
 function phase(p,g,n){const s=step(p,g,n);return s.complete?'완료 복습':!s.training?'연습 1판':`도전 ${s.passes+1}/2`;}
 function finish(p,g,n,stats){
  const info=meta(g,n),r=record(p,g),s=step(p,g,n);
  const out={progressed:false,stageClear:false,semesterClear:false,training:false,passed:false,nextGroup:null};
  if(!stats.official || n!==r.level || s.complete)return {...out,practiceOnly:true};
  s.rounds=(Number(s.rounds)||0)+1;s.best=Math.max(Number(s.best)||0,stats.correct*5);
  s.last={score:stats.correct*5,highOk:stats.highOk,reviewCorrect:stats.reviewCorrect,date:stats.date||dateNow()};
  r.recent=[...r.recent,...(stats.fingerprints||[])].slice(-120);
  if(!s.training){s.training=true;out.training=true;out.progressed=true;}
  else{
   out.passed=stats.correct*5>=info.passScore&&stats.highOk>=info.highRequired;
   if(out.passed){s.passes++;out.progressed=true;}
   if(s.passes>=2){s.complete=true;s.date=stats.date||dateNow();out.stageClear=true;r.level=n+1;}
  }
  if(out.stageClear&&n===12){
   r.completed=s.date;out.semesterClear=true;
   p.grad=p.grad||{};if(!p.grad[g])p.grad[g]=s.date;
   const next=order[order.indexOf(g)+1];out.nextGroup=next||null;
   if(next&&p.myGroup===g){p.myGroup=next;p.group=next;record(p,next);}
  }
  return out;
 }
 return {order,version,mix,record,step,meta,previous,plan,generate,finish,phase,fingerprint};
})();
