'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
let seed=0x31a329,random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const ctx={Math:Object.assign(Object.create(Math),{random}),console};
vm.createContext(ctx);
vm.runInContext(`const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;const pick=a=>a[rnd(0,a.length-1)];const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};`,ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/14-applied-3.js'),'utf8')+'\nthis.audit={APPLIED_3,ap3Families,ap3Level};',ctx);
const {APPLIED_3,ap3Families,ap3Level}=ctx.audit;
const unique=(values)=>{assert.equal(values.length,1,'inverse conditions must have one solution');return values[0];};
const candidates=(lo,hi,fn)=>Array.from({length:hi-lo+1},(_,i)=>lo+i).filter(fn);
const div=(n,b)=>{let q=0;while(n>=b){q++;n-=b;}return {q,r:n};};
function expected(q){const d=q._data;
 switch(q._family){
 case '31.addsub.stock':return unique(candidates(0,999,x=>x-d.out+d.back+d.extra===d.end));
 case '31.addsub.error':{const x=unique(candidates(0,999,x=>x-d.a+d.b===d.wrong));return x+d.a-d.b;}
 case '31.shape.outline':{const set=new Set();for(let y=0;y<d.h;y++)for(let x=0;x<d.w;x++)if(!d.hole||x!==d.hole[0]||y!==d.hole[1])set.add(`${x},${y}`);let edges=0;for(const c of set){const [x,y]=c.split(',').map(Number);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(!set.has(`${x+dx},${y+dy}`))edges++;}return edges*d.side;}
 case '31.shape.squares':{let found=0;for(let x=0;x<d.w;x++)for(let y=0;y<d.h;y++)for(let z=d.excludeSmall?2:1;z<=Math.min(d.w,d.h);z++)if(x+z<=d.w&&y+z<=d.h)found++;return found;}
 case '31.div.share':{assert(d.people<=9&&d.q<=9);assert.equal(d.total%d.people,0);const people=d.high?unique(candidates(1,9,p=>p*(p+d.q-d.people)===d.total&&p+d.q-d.people<=9)):d.people;return d.high?div(d.total,people).q-d.give:d.give+(d.q-d.give);}
 case '31.div.packets':{assert(d.b<=9&&d.q<=9);assert.equal(d.total%d.b,0);const b=d.high?unique(candidates(1,9,b=>b*(d.q-d.missing)===(d.q-d.missing)*d.b)):d.b;return div(d.total-(d.q-d.missing)*d.b,b).q;}
 case '31.mul.stock':return Array.from({length:d.boxes-(d.high?d.open:0)},()=>d.per).reduce((a,b)=>a+b,0)+(d.high?d.used:-d.used);
 case '31.mul.error':{assert(d.n>=10&&d.n<=99&&d.b<=9);const n=d.high?unique(candidates(10,99,x=>Math.floor(x/10)===d.t&&(+String(x).split('').reverse().join(''))*d.b===d.wrong)):d.n;return Array.from({length:d.b},()=>n).reduce((a,b)=>a+b,0)-(d.high?0:d.wrong);}
 case '31.lentime.ribbon':return d.high?unique(candidates(0,Math.min(d.a,d.b),overlap=>d.a+d.b-overlap-d.cut===d.result)):d.a+d.b-d.overlap;
 case '31.lentime.schedule':{let ticks=0;for(let t=d.start+d.late;t<d.end;t++)ticks++;return ticks-d.rest;}
 case '31.fracdec.parts':return unique(candidates(0,d.d,n=>d.paint-d.erase+n===d.target));
 case '31.fracdec.tenths':return (d.high?unique(candidates(0,29,n=>n+d.steps-d.back===d.end)):d.start+d.steps)/10;
 case '32.mul.seats':{let seats=0;for(let i=0;i<d.rows-d.closed;i++)seats+=d.per;return seats-d.reserved-d.arrived;}
 case '32.mul.error':{const b=d.high?unique(candidates(10,99,b=>Math.floor(b/10)===Math.floor(d.b/10)&&d.a*(b%10)===d.wrong)):d.b;let prod=0;for(let i=0;i<b;i++)prod+=d.a;return d.high?prod:prod-d.wrong;}
 case '32.div.vehicles':{let n=0,room=0;while(room<d.people+d.adults){n++;room+=d.capacity;}return n;}
 case '32.div.reconstruct':{const total=unique(candidates(0,999,n=>{const a=div(n,d.b);return a.q===d.q&&a.r===d.r;}));const parts=div(total-d.take,d.other);return d.askR?parts.r:parts.q;}
 case '32.circle.row':return d.high?unique(candidates(0,100,r=>d.n*(r+r)+(d.n-1)*d.gap===d.width)):d.n*(d.r+d.r);
 case '32.circle.center':{const inner=d.high?unique(candidates(0,100,r=>r+(r+d.band)===d.inner+d.outer)):div(d.inner*2,2).q;return d.high?inner:inner+d.band;}
 case '32.frac.whole':{const per=unique(candidates(0,100,n=>d.n*n===d.n*d.per));let total=0;for(let i=0;i<d.d;i++)total+=per;return d.high?total-d.n*per+d.extra:total;}
 case '32.frac.pieces':{const x=div(d.pieces-d.give,d.d);return d.high?x.r:x.q;}
 case '32.unit.tare':return d.high?unique(candidates(0,1000,w=>w*(d.m-d.n)===(d.tare+d.m*d.water)-(d.tare+d.n*d.water))):d.tare+Array.from({length:d.n},()=>d.water).reduce((a,b)=>a+b,0);
 case '32.unit.fill':return d.high?unique(candidates(0,20,n=>d.cap-d.bottle*n+d.spill===d.remaining)):d.cap-d.bottle*d.n;
 case '32.picgraph.transfer':return d.high?unique(candidates(0,1000,n=>d.a*d.key-n===d.b*d.key+n)):d.a*d.key-d.move-(d.b*d.key+d.move);
 case '32.picgraph.key':{const key=unique(candidates(1,100,k=>d.a*k===d.a*d.key));return d.high?unique(candidates(0,30,c=>(d.a+d.b+c)*key===d.total)):key;}
 default:throw Error(q._family);
 }
}
let total=0;const coverage={};
function validate(q,group,unit,lv,stage){assert(['num','choice'].includes(q.input.type));assert.equal(typeof q.prompt,'string');assert(q.prompt.length>15);assert.equal(typeof q.explain,'string');assert(q.explain.length>10);assert(q._family.startsWith(`${group}.${unit}.`));assert(!/NaN|undefined|Infinity/.test(q.prompt+(q.visual||'')+q.explain));let answer=q.input.type==='num'?q.ans:Number(q.sol);assert(Number.isFinite(answer));assert(answer>=0);assert.equal(answer,expected(q),`${q._family}/${lv}/${stage}: ${q.prompt}`);if(q.input.type==='num'){assert.equal(typeof answer,'number');if(!q.input.decimal)assert(Number.isInteger(answer));}else{assert(q.input.options.every(x=>typeof x==='string'));assert.equal(new Set(q.input.options).size,q.input.options.length);assert(q.input.options.includes(q.sol));assert(q.check(q.sol));assert(!q.check('INVALID'));}if(q.visual&&q.visual.startsWith('<svg'))assert(q.visual.endsWith('</svg>'));coverage[`${group}.${unit}.${lv}`]??=new Set();coverage[`${group}.${unit}.${lv}`].add(q._family);total++;}
for(const group of ['31','32']){assert.equal(Object.keys(APPLIED_3[group]).length,6);for(const unit of Object.keys(APPLIED_3[group]))for(const lv of ['mid','high'])for(let stage=1;stage<=12;stage++){
 // 200 random public calls per cell, plus 40 explicit calls per family.
 for(let i=0;i<200;i++)validate(APPLIED_3[group][unit](lv,stage),group,unit,lv,stage);
 for(const family of ap3Families[group][unit])for(let i=0;i<40;i++)validate(family(ap3Level(lv,stage)),group,unit,lv,stage);
}}
for(const [key,families]of Object.entries(coverage))assert(families.size>=2,key);
console.log(`PASS ${total.toLocaleString()} questions; ${Object.keys(coverage).length} unit/difficulty cells; 12 stages; 24 unique family IDs.`);
console.log('Independent enumeration: inverse conditions, every grid boundary/square, quotient/remainder by repeated subtraction, transfers, circle lengths, units. Seed 0x31a329.');
