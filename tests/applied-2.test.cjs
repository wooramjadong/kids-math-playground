'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
let state=0x21a22026;
const seededMath=Object.create(Math);
seededMath.random=()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296;};
const ctx=vm.createContext({Math:seededMath});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/14-applied-2.js'),'utf8'),ctx);
const bank=vm.runInContext('APPLIED_2',ctx);
const expectedUnits={'21':['n3','shape2','addsub','len','classify','mul'],'22':['n4','times','len2','time','table','pattern2']};
// Independent exhaustive search. Does not call generator helpers or trust ans/sol.
function enumerateCards(d){const result=[];function walk(prefix,left){if(!left.length){if(prefix[0])result.push(Number(prefix.join('')));return;}left.forEach((v,i)=>walk([...prefix,v],left.filter((_,j)=>i!==j)));}walk([],Array.from(d.digits));return result;}
function expect(q){const d=q._data;switch(q._family){
 case 'n3-card':case 'n4-card':{const ns=enumerateCards(d).filter(n=>n>=d.lo&&n<=d.hi&&(!d.high||n%10===d.units)&&(!d.extraRule||Math.floor(n/10)%10>d.units));assert(ns.length);return d.high?ns.length:(d.biggest?Math.max(...ns):Math.min(...ns));}
 case 'n3-bundle':case 'n4-bundle':{let total=d.loose;for(let i=0;i<d.boxes;i++)total+=d.big;for(let i=0;i<d.packs;i++)total+=d.small;assert.equal(total,d.total);if(!d.high)return total;const possible=[];for(let k=0;k<=100;k++)if(d.strict?total+k*d.small<d.target:total+k*d.small<=d.target)possible.push(k);return Math.max(...possible);}
 case 'shape-stick':{if(!d.high)return 3*d.tri+4*d.quad-d.have;const cases=[];for(let t=0;t<=d.n;t++)for(let sq=0;sq<=d.n;sq++)if(t+sq===d.n&&3*t+4*sq===d.total)cases.push(sq);assert.equal(cases.length,1);return cases[0];}
 case 'shape-fan':{let total=0;for(let l=0;l<d.n;l++)for(let r=l+1;r<=d.n;r++)if(!d.high||(l<=d.mark&&d.mark<r))total++;return total;}
 case 'addsub-story':{const candidates=[];if(!d.high)return d.start+d.gain-d.give;for(let a=0;a<=d.total;a++){const b=d.total-a;if(a>=d.give&&a-d.give===b+d.gain)candidates.push(a);}assert.equal(candidates.length,1);return candidates[0];}
 case 'addsub-balance':{if(!d.high)return d.large-d.small;const xs=[];for(let n=0;n<=d.large;n++)if(d.large-n===d.small+n)xs.push(n);assert.equal(xs.length,1);return xs[0];}
 case 'len-ruler':{const len=d.end-d.start;assert.equal(len,d.length);if(!d.high)return d.target-len;const xs=[];for(let k=0;k<Math.min(len,d.other);k++)if(len+d.other-k===d.joined)xs.push(k);assert.equal(xs.length,1);return xs[0];}
 case 'len-unit':{if(d.high){const candidates=[];for(let n=1;n<=60;n++)for(let m=1;m<=60;m++)if(n-m===d.gap&&d.p*n===d.q*m)candidates.push(d.p*n);assert.equal(candidates.length,1);return candidates[0];}let length=0;for(let n=0;n<d.n;n++)length+=d.p;return d.target-length;}
 case 'classify-filter':{let n=0;for(const item of d.items)if(d.high?(item.c!==d.color&&item.s!==d.shape):(item.c!==d.color&&item.s===d.shape))n++;return n;}
 case 'classify-balance':{const counts=d.colors.map(c=>d.items.filter(t=>t.c===c).length);assert.equal(counts[0],d.large);assert.equal(counts[1],d.small);if(!d.high)return counts[0]-counts[1];const triangles=d.items.filter(t=>t.c===d.colors[0]&&t.s===1).length;const xs=[];for(let n=0;n<=triangles;n++)if(counts[0]-n===counts[1]+n)xs.push(n);assert.equal(xs.length,1);return triangles-xs[0];}
 case 'mul-groups':{if(!d.high){let total=d.loose;for(let n=0;n<d.groups;n++)total+=d.per;return total;}const xs=[];for(let n=0;n<=9;n++){let total=d.loose;for(let k=0;k<n;k++)total+=d.per-d.removed;if(total===d.total)xs.push(n);}assert.equal(xs.length,1);return xs[0];}
 case 'mul-reserve':{if(!d.high)return Array(d.groups).fill(d.per-1).reduce((a,b)=>a+b,0);let remaining=d.total-d.reserve,n=0;while(remaining>=d.per){remaining-=d.per;n++;}assert(remaining>=0&&remaining<d.per);return n;}
 case 'times-mixed':{if(!d.high)return d.p*(d.n-d.big)+(d.p+1)*d.big-d.used;const xs=[];for(let n=0;n<=d.n;n++)if(d.p*(d.n-n)+(d.p+1)*n===d.total)xs.push(n);assert.equal(xs.length,1);return xs[0];}
 case 'times-rows':{if(!d.high)return d.rows*d.cols-d.changed*d.take;const xs=[];for(let n=0;n<=d.rows;n++)if(d.cols*(d.rows-n)+(d.cols-d.take)*n===d.remain)xs.push(n);assert.equal(xs.length,1);return xs[0];}
 case 'len2-ribbon':return d.high?d.a+d.b-d.joined:d.stock-d.a-d.b;
 case 'len2-route':{if(!d.high)return Math.max(...d.lengths)-Math.min(...d.lengths);let chosen=-1;for(let i=0;i<d.lengths.length;i++)if(d.lengths[i]+d.margin<=d.stock&&(chosen<0||d.lengths[i]>d.lengths[chosen]))chosen=i;assert(chosen>=0);return d.names[chosen];}
 case 'time-schedule':{const possibilities=[];for(let duration=0;duration<=180;duration++)if(d.start+duration+d.breakTime+d.travel<=d.end)possibilities.push(duration);const max=Math.max(...possibilities);assert.equal(d.start+max+d.breakTime+d.travel,d.end);assert(d.start>=8*60&&d.end<12*60);return max;}
 case 'time-calendar':{if(d.high){let n=0;for(let date=d.begin;date<=d.finish;date++)if((d.first+date-1)%7===d.weekday&&date!==d.skip)n++;assert.equal((d.first+d.skip-1)%7,d.weekday);assert(d.skip>=d.begin&&d.skip<=d.finish);return n;}let first=1;while((d.first+first-1)%7!==d.weekday)first++;const result=first+7*d.after;assert(result<=28);return result;}
 case 'table-supply':{const counts=Array.from(d.vals);if(d.high){counts[(d.which+1)%3]-=d.move;counts[d.which]+=d.move;}assert(counts.every(n=>n>=0));return counts[d.which]-d.have;}
 case 'table-missing':{if(!d.high)return d.total-d.a-d.c;const xs=[];for(let b=0;b<=d.total;b++)for(let c=0;c<=d.total;c++)if(d.a+b+c===d.total&&c-b===d.c-d.b)xs.push(c);assert.equal(xs.length,1);return xs[0];}
 case 'pattern-beads':{if(!d.high){let count=0;for(let i=0;i<d.n;i++)if(d.unit[i%d.unit.length]===d.target)count++;return count;}let cost=0,n=0;while(cost+d.cost[d.unit[n%d.unit.length]]<=d.budget){cost+=d.cost[d.unit[n%d.unit.length]];n++;assert(n<100);}return n;}
 case 'pattern-growing':{if(!d.high){let value=d.first;for(let i=1;i<d.n;i++)value+=d.step;return value;}let row=d.first,total=0,count=0;while(total<d.total){total+=row;row+=d.step;count++;assert(count<30);}assert.equal(total,d.total);return count;}
 default:throw Error('Unknown family '+q._family);
}}
const coverage={},modeCount={mid:0,high:0};
for(const group of Object.keys(expectedUnits)){
 assert.deepEqual(Object.keys(bank[group]),expectedUnits[group]);
 for(const unit of expectedUnits[group])for(const lv of ['mid','high'])for(let stage=1;stage<=12;stage++){
  const families=new Set();
  for(let i=0;i<120;i++){
   const q=bank[group][unit](lv,stage),label=`${group}/${unit}/${lv}/${stage}/${q._family}`;
   assert(q&&typeof q.prompt==='string'&&q.prompt.length>10,label);
   assert(typeof q.explain==='string'&&q.explain.length>10,label);
   assert(typeof q.tag==='string'&&q.tag.length,label);
   assert(!/undefined|NaN|Infinity/.test(q.prompt+q.explain+(q.visual||'')),label);
   assert(!/[÷/]/.test(q.prompt.replace(/<[^>]*>/g,'')),label+' division prerequisite');
   assert(['num','choice'].includes(q.input.type),label);
   const independent=expect(q);
   if(q.input.type==='num'){
    assert(Number.isInteger(q.ans)&&q.ans>=0,label);
    assert.equal(q.ans,independent,label);
   }else{
    assert(q.input.options.length>=3,label);
    assert(q.input.options.every(o=>typeof o==='string'),label);
    assert.equal(new Set(q.input.options).size,q.input.options.length,label);
    assert.equal(q.sol,String(independent),label);
    assert(q.input.options.includes(q.sol),label);
    assert.equal(q.check(q.sol),true,label);
    for(const option of q.input.options)assert.equal(q.check(option),option===q.sol,label);
    assert.equal(q.check('not an answer'),false,label);
   }
   families.add(q._family);coverage[q._family]=(coverage[q._family]||0)+1;modeCount[lv]++;
  }
  assert(families.size>=2,`${group}/${unit}/${lv}/${stage}: insufficient families`);
 }
}
// Missing/out-of-range stage must still produce usable questions.
for(const group of Object.keys(bank))for(const fn of Object.values(bank[group]))for(const s of [undefined,0,-2,13,100,'7'])for(const lv of ['mid','high']){const q=fn(lv,s);assert(['choice','num'].includes(q.input.type));assert.equal(q.input.type==='num'?q.ans:q.sol,expect(q));}
console.log(JSON.stringify({passed:true,total:modeCount.mid+modeCount.high,perMode:modeCount,families:Object.keys(coverage).length,coverage},null,2));
