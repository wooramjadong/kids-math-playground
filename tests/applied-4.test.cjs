'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
let seed=0x4a202610;
function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
const ctx=vm.createContext({Math:Object.assign(Object.create(Math),{random}),console});
vm.runInContext('const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a; const pick=a=>a[rnd(0,a.length-1)]; const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(0,i);[a[i],a[j]]=[a[j],a[i]];}return a};',ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/14-applied-4.js'),'utf8')+';globalThis.AP4=APPLIED_4;',ctx);
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
function unique(candidates,pred){const found=candidates.filter(pred);assert.equal(found.length,1,'constraint must have exactly one solution: '+JSON.stringify(found));return found[0];}
function expected(q){const d=q._data,h=d.h,f=q._family.split('.').slice(0,-1).join('.');
 switch(f){
  case '41.bignum.fund':return h?unique(range(0,200),v=>d.n*v+d.extra===d.total):d.n*d.per+d.extra;
  case '41.bignum.counter':return h?unique(range(0,100),v=>d.base+v*d.step===d.end):d.base+d.k*d.step;
  case '41.angle.straight':assert.equal(d.a+d.b+d.c,180);assert.ok([d.a,d.b,d.c].every(v=>v>0&&v<180));return h?unique(range(1,179),v=>v+(v+d.d)+d.c===180):180-d.a-d.b;
  case '41.angle.turn':return h?unique(range(0,180),v=>v+v+d.diff===d.total):90-d.small-d.big;
  case '41.muldiv.pack':assert.ok(d.left>0&&d.left<d.per);return h?unique(range(d.left+1,99),v=>v*d.n+d.left===d.all):unique(range(1,100),v=>v*d.per>=d.all&&(v-1)*d.per<d.all);
  case '41.muldiv.twoTeams':return h?unique(range(0,100),v=>d.groups*v+d.groups*(v+d.diff)===d.total):d.groups*d.base+d.groups*(d.base+d.diff);
  case '41.move.mirror':{
   const transform=(x,y)=>d.vertical?[6-x,y]:[x,6-y];
   const [tx,ty]=transform(d.x,d.y);assert.equal(tx,d.tx);assert.equal(ty,d.ty);
   if(!h)return d.vertical?tx:ty;
   const candidates=[];for(const x of range(0,6))for(const y of range(0,6)){const p=transform(x,y);if(p[0]-d.slide===d.bx&&p[1]===d.ty)candidates.push([x,y]);}assert.equal(candidates.length,1);return candidates[0][0];
  }
  case '41.move.quarterTurn':{
   function rotate(x,y){const dx=x-3,dy=y-3;return d.cw?[3+dy,3-dx]:[3-dy,3+dx];}
   const p=rotate(d.x,d.y);assert.equal(p[0],d.rx);assert.equal(p[1],d.ry);
   if(!h)return p[1];
   const candidates=[];for(const x of range(0,6))for(const y of range(0,6)){const p=rotate(x,y);if(6-p[0]===d.finalX&&p[1]===d.ry)candidates.push([x,y]);}assert.equal(candidates.length,1);return candidates[0][0];
  }
  case '41.graph.missing':{const sum=d.vals.reduce((a,b)=>a+b,0);return h?unique(range(0,200),v=>d.vals.reduce((a,b,i)=>a+(i===d.k?v:b),0)===d.total):unique(range(1,100),v=>v*30>=sum&&(v-1)*30<sum);}
  case '41.graph.balance':return h?unique(range(0,d.vals[0]),v=>d.vals[0]-v===d.vals[1]+v):d.vals[0]-d.vals[1];
  case '41.pattern.row':{const rows=range(1,100).map(n=>d.a+(n-1)*d.inc);return h?unique(range(1,100),n=>rows[n-1]===d.target):rows[d.n-1];}
  case '41.pattern.beads':{
   const beads=range(0,500).map(i=>i%(d.a+d.b)<d.a?'R':'B');const count=n=>beads.slice(0,n).filter(v=>v==='R').length;
   if(!h)return count(d.pos);const target=d.cycles*d.a+d.offset;return unique(range(1,500),n=>count(n)===target&&count(n-1)===target-1);
  }
  case '42.fracadd.ribbon':return h?unique(range(0,3*d.d),v=>d.a+v+d.remain===3*d.d):3*d.d-d.a-d.b;
  case '42.fracadd.twoCups':return (h?unique(range(0,d.sum),v=>v+(v+d.diff)===d.sum):d.small+d.big)+'/'+d.d;
  case '42.tri.fence':assert.ok(d.base>0&&d.base<2*d.side);return h?unique(range(1,100),v=>2*v+(v+(d.base>d.side?1:-1)*Math.abs(d.base-d.side))===d.per):2*d.side+d.base;
  case '42.tri.foldAngle':{assert.ok(d.vertex>0&&d.base>0&&d.base!==d.vertex);const sign=d.vertex>d.base?1:-1;return h?unique(range(1,89),v=>v+v+(v+sign*d.diff)===180):180-2*d.base;}
  case '42.dec.rope':return (h?unique(range(0,d.a),v=>d.a-v-d.c===d.remain):d.a-d.b-d.c)/100;
  case '42.dec.water':return (h?unique(range(0,d.big),v=>d.big-v===d.small+v):d.small+d.big)/100;
  case '42.quad.frame':return h?unique(range(1,100),v=>2*v+2*(v+d.diff)===d.per):2*d.short+2*d.long;
  case '42.quad.parallelogram':return h?unique(range(1,90),v=>v+(v+d.b-d.a)===180):180-d.a;
  case '42.lgraph.growth':return h?unique(range(0,100),v=>v-d.vals[1]===d.vals[1]-d.vals[0]&&d.vals[3]-v===v-d.vals[1]):d.vals[1]-d.vals[0];
  case '42.lgraph.tank':{const refill=d.vals[3]-d.vals[1],gap=Math.abs(d.drop-refill),sign=d.drop>=refill?1:-1;return h?unique(range(0,200),v=>v-d.vals[1]===refill+sign*gap):(d.vals[2]-d.vals[1])+(d.vals[3]-d.vals[2]);}
  case '42.poly.border':return h?unique(range(1,100),v=>d.n*v-d.remove===d.total-d.remove):d.n*d.side-d.remove;
  case '42.poly.vertex':{
   const countDiagonals=n=>range(1,n-1).filter(vertex=>vertex!==1&&vertex!==n-1).length;
   if(!h)return countDiagonals(d.n);const sides=unique(range(3,12),n=>countDiagonals(n)===d.diagonals);return unique(range(1,100),v=>sides*v===d.n*d.side);
  }
  default:throw Error('unknown family '+f);
 }
}
let total=0;const families=new Map(),coverage={};
for(const sem of ['41','42'])for(const unit of Object.keys(ctx.AP4[sem]))for(const lv of ['mid','high']){
 const seen=new Set(),variants=new Set();
 for(let stage=1;stage<=12;stage++)for(let i=0;i<200;i++){
  const q=ctx.AP4[sem][unit](lv,stage),label=sem+'.'+unit+'.'+lv+' stage '+stage;
  try{
   assert.ok(q.prompt&&q.explain&&q.tag&&q._family);assert.equal(q._data.h,lv==='high');
   const want=expected(q);seen.add(q._family);variants.add(q.prompt+(q.visual||''));families.set(q._family,(families.get(q._family)||0)+1);
   if(q.input.type==='num'){
    assert.equal(q.ans,want);assert.ok(Number.isFinite(q.ans)&&q.ans>=0);assert.ok(Math.abs(q.ans)<=1e13);
    assert.ok(String(q.ans).length<=10,'keypad limit');if(!Number.isInteger(q.ans))assert.equal(q.input.decimal,true);
    if(!q.input.decimal)assert.ok(Number.isSafeInteger(q.ans));
   }else{
    assert.equal(q.input.type,'choice');assert.ok(q.input.options.every(x=>typeof x==='string'));assert.equal(new Set(q.input.options).size,q.input.options.length);
    assert.ok(q.input.options.length>=2);assert.equal(q.sol,String(want));assert.ok(q.check(String(want)));assert.equal(q.input.options.filter(v=>q.check(v)).length,1);
    assert.ok(q.input.options.includes(q.sol));assert.ok(!q.check('definitely wrong'));
    const vals=q.input.options.map(s=>{const [a,b]=s.split('/').map(Number);return a/b;});assert.equal(new Set(vals).size,vals.length,'no equivalent fraction distractors');
   }
   for(const v of Object.values(q._data)){if(typeof v==='number')assert.ok(Number.isFinite(v)&&Number.isSafeInteger(v)&&v>=0&&v<=1e13);}
   if(q.visual){assert.ok(!/NaN|undefined|https?:|<script/.test(q.visual));assert.ok(q.visual.includes('<svg'));}
  }catch(e){e.message=label+' / '+q._family+' '+JSON.stringify(q._data)+' : '+e.message;throw e;}
  total++;
 }
 assert.equal(seen.size,2,sem+'.'+unit+'.'+lv+' must have 2 distinct families');assert.ok(variants.size>20,sem+'.'+unit+'.'+lv+' randomized variants: '+variants.size);coverage[sem+'.'+unit+'.'+lv]={families:[...seen],variants:variants.size,questions:2400};
}
assert.equal(families.size,48);
console.log(JSON.stringify({ok:true,total,distinctFamilies:families.size,coverage},null,2));
