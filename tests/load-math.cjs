const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
module.exports=function(overrides={}){
 const saved={group:'11',myGroup:'11',wallet:17,stickers:['기존스티커'],cardPlays:3,resetV:'2026-10-29',done:{'11':{n9:{best:100,stars:3}}},grad:{},setupDone:true,...overrides};
 const element={onclick:null};
 const math=Object.create(Math);let seed=75287;math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const ctx=vm.createContext({console,Math:math,Date,JSON,Set,Map,setTimeout,clearTimeout,window:{},document:{querySelector:()=>element},localStorage:{getItem:()=>JSON.stringify(saved),setItem(){}},Intl});
 const files=['1-helpers.js','3-gen-3-2.js','4-gen-3-1-hard.js','4b-expansion.js','4c-cur-12.js','4d-cur-34.js','14-applied-1.js','14-applied-2.js','14-applied-3.js','14-applied-4.js','15-stages.js'];
 for(const file of files)vm.runInContext(fs.readFileSync(path.join(__dirname,'../js',file),'utf8'),ctx,{filename:file});
 return {ctx,run:code=>vm.runInContext(code,ctx),api:vm.runInContext('STAGE_SYSTEM',ctx),cur:vm.runInContext('CUR',ctx),saved};
};
