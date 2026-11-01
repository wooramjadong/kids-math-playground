const test=require('node:test'),assert=require('node:assert/strict'),load=require('./load-math.cjs');
const {api,cur,run}=load();const groups=['11','12','21','22','31','32','41','42'];
const good={official:true,correct:12,total:12,highOk:4,reviewCorrect:3,date:'2026-10-31',fingerprints:['one']};
test('전체 96단계: 현재9·복습3, 하2·중6·상4 (한 판 12문제), 이전 범위만 복습',()=>{
 for(const g of groups)for(let n=1;n<=12;n++)for(let rep=0;rep<40;rep++){
  const plan=api.plan(g,n);assert.equal(plan.length,12);assert.equal(plan.filter(x=>x.source==='current').length,9);assert.equal(plan.filter(x=>x.source==='review').length,3);assert.deepEqual(['low','mid','high'].map(l=>plan.filter(x=>x.lv===l).length),[2,6,4]);
  for(const [lv,count] of [['low',2],['mid',6],['high',4]])assert.equal(plan.filter(x=>x.lv===lv).length,count);
  const allowed=api.previous(g,n);for(const e of plan.filter(x=>x.source==='review'))assert.ok(allowed.some(a=>a.group===e.group&&a.mode===e.mode));
  assert.ok(plan.slice(0,2).every(e=>e.lv==='low'));assert.equal(plan.filter(e=>e.source==='review'&&e.lv==='low').length,0);
 }
});
test('실제 문제 96단계×12문항×8판: 형식·정답·응용 복습·고난도 새 생성기',()=>{
 let count=0;const family=new Set();
 for(const g of groups)for(let n=1;n<=12;n++)for(let rep=0;rep<8;rep++){
  const seen=new Set();for(const entry of api.plan(g,n)){
   const q=api.generate(entry,seen);count++;family.add(q._family);assert.ok(q.prompt||q.eq||q.eqHTML);assert.ok(q.input||q.options);assert.equal(q._source,entry.source);
   if(entry.source==='review'||entry.lv==='high')assert.equal(q._applied,true);
   if(q.options){assert.ok(q.options.some(o=>o.v===String(q.ans)));}
   else if(q.input.type==='num'){assert.ok(Number.isFinite(q.ans));assert.ok(q.ans>=0);}
   else if(q.input.type==='choice'){const opts=q.input.options.map(o=>typeof o==='string'?o:o.v);assert.ok(opts.length>=2);assert.equal(opts.filter(o=>q.check(o)).length,1);}
   assert.ok(q._fingerprint);
  }
 }
 console.log('Stage integration generated',count,'questions / family count',family.size);
});
test('기존 별·스티커·단원 최고기록·카드 횟수를 보존하며 새 진도만 1부터',()=>{
 const p={group:'11',myGroup:'11',wallet:19,stickers:['a'],cardPlays:4,done:{11:{n9:{stars:3,best:100}}},grad:{11:'old'}};const preserved=JSON.stringify(p);
 assert.equal(api.record(p,'11').level,1);const {stageProgress,...rest}=p;assert.equal(JSON.stringify(rest),preserved);assert.equal(stageProgress.version,'12-stage-20q-v1');
});
test('연습1판+도전2회를 해야 단계 완료, 80점(10/12)·상 3/4 모두 필요',()=>{
 const p={group:'11',myGroup:'11'};assert.equal(api.finish(p,'11',1,{...good,correct:0,highOk:0}).training,true);assert.equal(api.record(p,'11').level,1);
 assert.equal(api.finish(p,'11',1,{...good,correct:10,highOk:2}).passed,false);assert.equal(api.finish(p,'11',1,{...good,correct:9,highOk:4}).passed,false);
 assert.equal(api.finish(p,'11',1,{...good,correct:10,highOk:3}).passed,true);assert.equal(api.record(p,'11').level,1);
 assert.equal(api.finish(p,'11',1,{...good,correct:10,highOk:3}).stageClear,true);assert.equal(api.record(p,'11').level,2);
});
test('[2026-11-01] 단계는 순서 없이 골라도 그 단계 진도를 인정 (현재 단계는 앞에서부터 처음 안 끝난 단계)',()=>{
 const p={group:'11',myGroup:'11'};const r2=api.finish(p,'11',5,good);assert.equal(r2.practiceOnly,undefined);assert.equal(r2.training,true);assert.equal(api.record(p,'11').level,1);
 api.finish(p,'11',5,good);assert.equal(api.finish(p,'11',5,good).stageClear,true);assert.equal(api.step(p,'11',5).complete,true);assert.equal(api.record(p,'11').level,1,'1단계가 아직이면 현재 단계는 1');
 assert.equal(api.finish(p,'11',5,good).practiceOnly,true,'끝낸 단계는 복습');
 for(let k=0;k<3;k++)api.finish(p,'11',1,good);assert.equal(api.record(p,'11').level,2);
 assert.equal(api.finish(p,'11',1,{...good,official:false}).practiceOnly,true,'단원 자유 연습은 진도 없음');
});
test('[2026-11-01] 다른 학기도 골라서 진도를 쌓을 수 있고, 내 학년은 바뀌지 않음(그 학기 12단계를 다 끝내기 전엔)',()=>{
 const p={group:'32',myGroup:'11'};for(let k=0;k<3;k++)api.finish(p,'32',3,good);assert.equal(api.step(p,'32',3).complete,true);assert.equal(p.myGroup,'11');
});
test('[2026-11-01] 12단계를 모두 끝내야 학기 졸업 (12단계만 먼저 끝내면 졸업 아님)',()=>{
 const p={group:'11',myGroup:'11'};for(let k=0;k<3;k++)api.finish(p,'11',12,{...good,correct:11});assert.equal(api.step(p,'11',12).complete,true);assert.ok(!(p.grad&&p.grad['11']));assert.equal(p.myGroup,'11');
 let last;for(let n=1;n<=11;n++)for(let k=0;k<3;k++)last=api.finish(p,'11',n,good);assert.equal(last.semesterClear,true);assert.ok(p.grad['11']);assert.equal(p.myGroup,'12');
});
test('12단계는 90점 기준, 통과 후 다음학기1단계로 자동 진급',()=>{
 for(let gi=0;gi<groups.length;gi++){
  const g=groups[gi],p={group:g,myGroup:g,wallet:7,stickers:['s'],cardPlays:2};
  for(let n=1;n<=11;n++){api.finish(p,g,n,good);api.finish(p,g,n,good);assert.equal(api.finish(p,g,n,good).stageClear,true);}
  api.finish(p,g,12,good);assert.equal(api.finish(p,g,12,{...good,correct:10}).passed,false);assert.equal(api.finish(p,g,12,{...good,correct:11,highOk:3}).passed,true);
  const result=api.finish(p,g,12,{...good,correct:11,highOk:3});assert.equal(result.semesterClear,true);assert.equal(api.record(p,g).level,13);assert.equal(result.nextGroup,groups[gi+1]||null);
  if(gi<groups.length-1){assert.equal(p.myGroup,groups[gi+1]);assert.equal(p.group,groups[gi+1]);assert.equal(api.record(p,p.group).level,1);}assert.equal(p.wallet,7);
 }
});
test('각 학기 최소36판·720문항 이전에는 졸업하지 않음',()=>{
 const p={group:'11',myGroup:'11'};let rounds=0,last;for(let n=1;n<=12;n++)for(let k=0;k<3;k++){last=api.finish(p,'11',n,good);rounds++;if(rounds<36)assert.equal(last.semesterClear,false);}
 assert.equal(rounds,36);assert.equal(rounds*20,720);assert.equal(last.semesterClear,true);
});

test('리셋 표시가 없던 오래된 브라우저도 별·기록을 지우지 않고 시작',()=>{
 const old={wallet:33,done:{11:{n9:{best:90,stars:1}}},grad:{11:'2026-09-01'},stickers:Array.from({length:75},(_,i)=>'s'+i),cardPlays:9,resetV:undefined};
 const legacy=load(old);const state=legacy.run('JSON.parse(JSON.stringify(P))');assert.equal(state.wallet,33);assert.equal(state.cardPlays,9);assert.equal(state.done[11].n9.best,90);assert.equal(state.stickers.length,75);assert.equal(state.grad[11],'2026-09-01');assert.equal(state.resetV,'2026-10-29');
});
test('6단원 학기는 6단원까지 빠짐없이 배우고 5단원 학기는 6단계 교과다지기',()=>{
 for(const g of groups){const n=cur[g].modes.length;if(n===6)assert.equal(api.meta(g,6).core[0],cur[g].modes[5].id);else{assert.equal(n,5);assert.equal(api.meta(g,6).core.length,5);}}
});
