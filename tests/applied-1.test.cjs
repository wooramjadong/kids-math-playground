'use strict';
// Deterministic, builtins-only independent solvers. Run: node tests/applied-1.test.cjs
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
let seed=0x14a991;
const math=Object.create(Math);math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const ctx=vm.createContext({Math:math,console});
vm.runInContext(`const rnd=(a,b)=>{if(!Number.isInteger(a)||!Number.isInteger(b)||a>b)throw Error('Bad rnd bounds '+a+','+b);return Math.floor(Math.random()*(b-a+1))+a;};const pick=a=>a[rnd(0,a.length-1)];const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};`,ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/14-applied-1.js'),'utf8')+'\nthis.gen=APPLIED_1;',ctx);
const nums=s=>[...s.matchAll(/\d+/g)].map(m=>+m[0]);
const choices=q=>Array.from(q.input.options||[]);
const row=q=>[...(q.visual||'').matchAll(/<span[^>]*>([^<]+)<\/span>/g)].map(m=>m[1]);
const flat=['동그라미','세모','네모'],solid=['상자 모양','둥근 기둥 모양','공 모양'];
const perms=a=>a.length?a.flatMap((v,i)=>perms(a.filter((_,j)=>i!==j)).map(p=>[v,...p])):[[]];
function unique(a,q){const u=[...new Set(a.map(String))];assert.equal(u.length,1,'Independent solution not unique: '+q.prompt+' / '+u);return u[0];}
function solve(q,lv){const p=q.prompt,n=nums(p),f=q._family;
 switch(f){
 case '11-n9-queue':{const r=p.match(/앞에서부터 (.*?) 순서로/)[1].split(', ');const target=p.match(/(?:번호를 붙여요\. |순서로 서 있어요\. )(\S+?)(?:의 번호|에게)/)[1];return String(lv==='high'?r.length-r.indexOf(target):r.indexOf(target)+1);}
 case '11-n9-seat':{if(lv==='mid'){const a=row(q);return String(+a[a.indexOf('□')-1]+1);}const a=p.match(/인형을 (\d+)번보다 크고 (\d+)번보다 작은/);return unique(Array.from({length:10},(_,i)=>i).filter(x=>x>+a[1]&&x<+a[2]),q);}
 case '11-shape-task':{const entries=p.split('<br>');const task=entries.pop();const props=['잘 쌓이고 어느 쪽으로 놓아도 굴러가지 않음','눕히면 구르고 세우면 쌓을 수 있음','어느 쪽으로도 잘 구르고 쌓을 수 없음'];const type=task.includes('받침')?0:task.includes('세워')?1:2;return unique(entries.filter(e=>e.split(': ')[1]===(lv==='mid'?solid[type]:props[type])).map(e=>e.split(': ')[0]),q);}
 case '11-shape-place':{const target=p.match(/(왼쪽|가운데|오른쪽)에 놓인/)[1],idx=['왼쪽','가운데','오른쪽'].indexOf(target);const re=/(상자 모양|둥근 기둥 모양|공 모양)은 (상자 모양|둥근 기둥 모양|공 모양)보다 (왼쪽|오른쪽)/g;const edges=[...p.matchAll(re)];return unique(perms(solid).filter(r=>lv==='mid'?r[0]===p.match(/왼쪽에는 (.*?), 오른쪽/)[1]&&r[2]===p.match(/오른쪽에는 (.*?)을 놓았/)[1]:edges.every(e=>e[3]==='왼쪽'?r.indexOf(e[1])<r.indexOf(e[2]):r.indexOf(e[1])>r.indexOf(e[2]))).map(r=>r[idx]),q);}
 case '11-addsub-share':return String(n[0]-n[1]);
 case '11-addsub-fill':return String(lv==='high'?n[1]-n[0]:n[0]-n[1]);
 case '11-compare-order':{const edges=[...p.matchAll(/([가나다라] 리본)은 ([가나다라] 리본)보다 길어요/g)];const opts=choices(q);const idx=lv==='high'?1:p.includes('가장 긴')?0:opts.length-1;return unique(perms(opts).filter(r=>edges.every(e=>r.indexOf(e[1])<r.indexOf(e[2]))).map(r=>r[idx]),q);}
 case '11-compare-capacity':{if(lv==='mid'){const m=[...p.matchAll(/([가나다] 물통)에는 (\d+)컵/g)];return m[0][2]>+m[1][2]?m[0][1]:m[1][1];}const names=p.match(/[가나다] 물통/g),edges=[[names[0],names[1]],[names[2],names[3]]];return unique(perms(choices(q)).filter(r=>edges.every(e=>r.indexOf(e[0])<r.indexOf(e[1]))).map(r=>r[1]),q);}
 case '11-n50-pack':case '12-count-pack':{if(lv==='mid')return String(n[0]*n[1]+n[2]);return String(p.includes('몇 묶음')?Math.floor(n[0]/10):n[0]%10);}
 case '11-n50-ticket':case '12-count-ticket':{if(lv==='mid')return String(p.includes('가장 먼저')?Math.min(...n):Math.max(...n));return unique(Array.from({length:101},(_,i)=>i).filter(x=>x>n[0]&&x<n[1]&&x%10===n[2]),q);}
 case '12-three-baskets':{if(lv==='mid')return String(n[0]+n[1]+n[2]);return unique(Array.from({length:20},(_,x)=>x).filter(x=>n[1]+x+n[2]===n[0]),q);}
 case '12-three-bus':{if(lv==='mid')return String(n[0]-n[1]+n[2]);return unique(Array.from({length:20},(_,x)=>x).filter(x=>x>=n[0]&&x-n[0]+n[1]===n[2]),q);}
 case '12-shapeclock-sign':{if(lv==='mid'){const wanted=flat.find(x=>p.includes(x));const v=q.visual;const entries=[...v.matchAll(/([가나다] 꾸미기)<br><svg[^>]+aria-label="왼쪽부터 ([^"]+)"/g)];return unique(entries.filter(e=>e[2]===wanted).map(e=>e[1]),q);}const m=[...p.matchAll(/([가나다] 꾸미기)는 (동그라미|세모|네모)/g)],wanted=p.match(/중 (동그라미|세모|네모)를 쓰는/)[1];return unique(perms(flat).filter(r=>m.every(e=>r[['가 꾸미기','나 꾸미기','다 꾸미기'].indexOf(e[1])]===e[2])).map(r=>['가 꾸미기','나 꾸미기','다 꾸미기'][r.indexOf(wanted)]),q);}
 case '12-shapeclock-schedule':{const m=p.match(/(\d+)시( 30분)?/),given=+m[1]*2+(m[2]?1:0),duration=p.includes('1시간')?2:1,target=given+(lv==='high'?-duration:duration);return unique(choices(q).filter(o=>{const t=o.match(/(\d+)시( 30분)?/);return +t[1]*2+(t[2]?1:0)===target;}),q);}
 case '12-addsub2-gift':return String(lv==='high'?n[0]+n[1]:n[0]-n[1]);
 case '12-addsub2-correct':{if(lv==='mid')return String(n[0]+n[1]);return unique(Array.from({length:20},(_,x)=>x).filter(x=>x-n[1]===n[2]).map(x=>x+n[0]),q);}
 case '12-pattern-beads':{const a=row(q),period=n[0],colors=['빨강','파랑','노랑'];const possibilities=[];function build(x){if(x.length===period){if(a.every((c,i)=>c==='□'||c===x[i%period]))possibilities.push(lv==='high'?x[a.indexOf('□')%period]:x[a.length%period]);return;}for(const c of colors)build([...x,c]);}build([]);return unique(possibilities,q);}
 case '12-pattern-locker':{const seq=p.match(/(?:번호를 붙여요\. |번호를 붙였어요\. )(.*?)(?: 다음|\. 떨어진)/)[1].split(', ');const solutions=[];for(let d=1;d<=100;d++)for(let a=0;a<=100;a++){if(seq.every((x,i)=>x==='□'||+x===a+i*d))solutions.push(lv==='high'?a+seq.indexOf('□')*d:a+seq.length*d);}return unique(solutions,q);}
 case '12-addsub3-supplies':return String(lv==='mid'?n[0]+n[1]:n[1]-n[0]);
 case '12-addsub3-book':{if(lv==='mid')return String(n[0]-n[1]);return unique(Array.from({length:100},(_,x)=>x).filter(x=>x+n[1]+n[2]===n[0]),q);}
 default:throw Error('Missing independent solver '+f);
 }
}
let total=0;const coverage={};const perStage=process.env.AP1_SAMPLES?+process.env.AP1_SAMPLES:300;
for(const g of ['11','12'])for(const [unit,fn]of Object.entries(ctx.gen[g]))for(const lv of ['mid','high']){
 const counts={};for(let stage=1;stage<=12;stage++)for(let i=0;i<perStage;i++){
  const q=fn(lv,stage);try{assert(q&&q._family&&q.prompt&&q.explain);assert(['num','choice'].includes(q.input.type));const ans=q.input.type==='num'?String(q.ans):q.sol;
  if(q.input.type==='num'){assert(Number.isInteger(q.ans)&&q.ans>=0);assert(q.ans<=(unit==='n9'?9:unit==='n50'?50:g==='12'&&['three','addsub2'].includes(unit)?19:100));}
  else{const opts=choices(q);assert(opts.length>=2);assert.equal(new Set(opts).size,opts.length);assert(opts.every(x=>typeof x==='string'));assert.equal(opts.filter(x=>q.check(x)).length,1);assert(q.check(ans));assert(!q.check('__wrong__'));}
  assert.equal(ans,solve(q,lv));counts[q._family]=(counts[q._family]||0)+1;total++;
  }catch(e){console.error({g,unit,lv,stage,q});throw e;}
 }
 assert(Object.keys(counts).length>=2,`${g}/${unit}/${lv} needs two families`);coverage[`${g}/${unit}/${lv}`]=counts;
}
// Range clamps should remain valid and classic-script lexical global should be available.
for(const g of Object.keys(ctx.gen))for(const fn of Object.values(ctx.gen[g]))for(const s of [undefined,0,-1,13,999])assert(fn('high',s)._family);
console.log(JSON.stringify({total,stages:'all 1..12',perUnitDifficulty:12*perStage,families:new Set(Object.values(coverage).flatMap(c=>Object.keys(c))).size,coverage},null,2));
