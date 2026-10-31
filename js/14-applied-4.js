/* Original grade-4 applied/reasoning problems. No registration side effects.
 * APPLIED_4[semester][unit]("mid"|"high", stage 1..12)
 * _data is transparent test evidence, not needed by the player. All helpers use ap4 prefix.
 */
function ap4N(id, ans, prompt, explain, unit, data, visual, decimal) {
  return {input:{type:'num',...(unit?{unit}:{}),...(decimal?{decimal:true}:{})},ans,
    prompt,tag:'응용 · 생각하기',explain,_family:id,_data:data,...(visual?{visual}:{})};
}
function ap4C(id, ans, options, prompt, explain, data, visual) {
  const answer=String(ans), os=shuffle([...new Set(options.map(String))]);
  return {input:{type:'choice',options:os},check:v=>v===answer,sol:answer,
    prompt,tag:'응용 · 조건 찾기',explain,_family:id,_data:data,...(visual?{visual}:{})};
}
function ap4Select(lv,stage,a,b) {return (rnd(0,1)===0?a:b)(lv==='high',Math.max(1,Math.min(12,Number(stage)||1)));}
const ap4F=n=>Number(n).toLocaleString('ko-KR');
const ap4D=n=>String(Math.round(n)/100);
const ap4Id=(u,f,h)=>u+'.'+f+'.'+(h?'high':'mid');
function ap4Table(labels,vals,unit) {
  return '<table style="border-collapse:collapse;margin:auto">'+labels.map((l,i)=>'<tr><th style="border:1px solid;padding:6px">'+l+'</th><td style="border:1px solid;padding:6px">'+vals[i]+' '+unit+'</td></tr>').join('')+'</table>';
}
function ap4Chart(vals,step,line=false,hidden=-1) {
  const max=Math.ceil(Math.max(...vals)/step)+1,W=300,H=180,y=v=>H-30-v/step*(130/max); let s='';
  for(let i=0;i<=max;i++) {const yy=y(i*step);s+='<line x1="35" y1="'+yy+'" x2="285" y2="'+yy+'" stroke="#cbd5e1"/><text x="30" y="'+(yy+4)+'" text-anchor="end" font-size="11">'+i*step+'</text>';}
  if(line) {for(let i=1;i<vals.length;i++) if(i!==hidden&&i-1!==hidden)s+='<line x1="'+(65+(i-1)*65)+'" y1="'+y(vals[i-1])+'" x2="'+(65+i*65)+'" y2="'+y(vals[i])+'" stroke="#2563eb" stroke-width="3"/>';}
  vals.forEach((v,i)=>{const x=65+i*65;
    s+=i===hidden?'<text x="'+x+'" y="95" text-anchor="middle" font-size="24">?</text>':line?'<circle cx="'+x+'" cy="'+y(v)+'" r="5" fill="#2563eb"/>':'<rect x="'+(x-17)+'" y="'+y(v)+'" width="34" height="'+(H-30-y(v))+'" fill="#60a5fa"/>';
    s+='<text x="'+x+'" y="170" text-anchor="middle" font-size="12">'+['가','나','다','라'][i]+'</text>';
  });return '<svg role="img" aria-label="세로 눈금과 가 나 다 라의 값" width="300" height="180" viewBox="0 0 300 180">'+s+'</svg>';
}
function ap4Grid(points,N=6) {
  let s='';for(let i=0;i<=N;i++) {const p=30+i*30;s+='<line x1="30" y1="'+p+'" x2="210" y2="'+p+'" stroke="#cbd5e1"/><line x1="'+p+'" y1="30" x2="'+p+'" y2="210" stroke="#cbd5e1"/><text x="'+p+'" y="228" font-size="11" text-anchor="middle">'+i+'</text><text x="20" y="'+(214-i*30)+'" font-size="11" text-anchor="middle">'+i+'</text>';}
  s+='<line x1="120" y1="30" x2="120" y2="210" stroke="#ef4444" stroke-dasharray="4 3"/><line x1="30" y1="120" x2="210" y2="120" stroke="#ef4444" stroke-dasharray="4 3"/>';
  points.forEach(([x,y,l])=>{s+='<circle cx="'+(30+30*x)+'" cy="'+(210-30*y)+'" r="5" fill="#2563eb"/><text x="'+(37+30*x)+'" y="'+(205-30*y)+'" font-size="14">'+l+'</text>';});
  return '<svg role="img" aria-label="가로 좌표는 오른쪽, 세로 좌표는 위로 커지는 0부터 6 격자. 붉은 선은 가로 3과 세로 3" width="250" height="250" viewBox="0 0 250 250">'+s+'<text x="130" y="246" text-anchor="middle" font-size="12">가로 → / 세로 ↑</text></svg>';
}
function ap4Fan(total,parts) {
  const cx=125,cy=135,R=92;let a=0,s='<line x1="25" y1="135" x2="225" y2="135" stroke="#334155" stroke-width="2"/>';
  const all=[0];parts.forEach(v=>{a+=v;all.push(a);});
  all.forEach(v=>{const t=Math.PI-v*Math.PI/180;s+='<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+R*Math.cos(t))+'" y2="'+(cy-R*Math.sin(t))+'" stroke="#2563eb" stroke-width="2"/>';});
  let c=0;parts.forEach((v,i)=>{const t=Math.PI-(c+v/2)*Math.PI/180;c+=v;s+='<text x="'+(cx+58*Math.cos(t))+'" y="'+(cy-58*Math.sin(t))+'" text-anchor="middle" font-size="13">'+['가','나','다'][i]+'</text>';});
  return '<svg role="img" aria-label="곧은 각을 가 나 다 순서로 나눈 그림" width="250" height="150" viewBox="0 0 250 150">'+s+'</svg>';
}
const APPLIED_4={
 '41':{
  bignum(lv,stage){return ap4Select(lv,stage,(h)=>{
    const n=rnd(3,8),per=rnd(12,59),extra=rnd(1,19),total=n*per+extra,id=ap4Id('41.bignum','fund',h);
    return ap4N(id,h?per:total,h?'모금액은 '+total+'만 원이에요. '+extra+'만 원은 선생님이 냈고, '+n+'반은 나머지를 똑같이 냈어요. 한 반이 낸 돈은 몇 만 원일까요?':n+'반에서 각각 '+per+'만 원을 모았고 선생님이 '+extra+'만 원을 더 냈어요. 모두 몇 만 원일까요?',h?'학생 모금액 '+(total-extra)+'만 원을 '+n+'으로 나누면 '+per+'만 원이에요.':n+' × '+per+' + '+extra+' = '+total+'만 원','만 원',{n,per,extra,total,h});
   },(h)=>{const base=rnd(12,60),step=rnd(2,9),k=rnd(3,9),end=base+step*k,id=ap4Id('41.bignum','counter',h);
    return ap4N(id,h?k:end,h?'전광판의 수가 '+base+'억에서 '+step+'억씩 늘어 '+end+'억이 되었어요. 모두 몇 번 늘었나요?':'전광판에 '+base+'억이 표시되어 있어요. '+step+'억씩 '+k+'번 늘면 몇 억이 표시될까요?',h?'늘어난 '+(end-base)+'억을 한 번에 늘어난 '+step+'억으로 나누면 '+k+'번이에요.':base+' + '+step+' × '+k+' = '+end+'억',h?'번':'억',{base,step,k,end,h});});},
  angle(lv,stage){return ap4Select(lv,stage,(h)=>{
    const b=rnd(25,50),d=pick([10,20,30]),a=b+d,c=180-a-b,id=ap4Id('41.angle','straight',h);
    return ap4N(id,h?b:c,h?'곧은 각을 가, 나, 다로 나눴어요. 다는 '+c+'°, 가는 나보다 '+d+'° 커요. 나는 몇 도일까요?':'곧은 각을 가, 나, 다로 나눴어요. 가는 '+a+'°, 나는 '+b+'°예요. 다는 몇 도일까요?',h?'가와 나의 합은 '+(180-c)+'°. 차 '+d+'°를 빼고 2로 나누면 '+b+'°예요.':'곧은 각은 180°이므로 180 − '+a+' − '+b+' = '+c+'°','°',{a,b,c,d,h},ap4Fan(180,[a,b,c]));
   },(h)=>{const small=rnd(15,25),diff=rnd(10,30),big=small+diff,total=small+big,id=ap4Id('41.angle','turn',h);
    return ap4N(id,h?small:90-total,h?'화살표를 같은 방향으로 두 번 돌렸어요. 모두 '+total+'° 돌았고, 두 번째는 첫 번째보다 '+diff+'° 더 돌았어요. 첫 번째는 몇 도 돌았나요?':'화살표를 오른쪽으로 '+small+'°, 이어 '+big+'° 돌렸어요. 처음 방향에서 직각만큼 돌려면 앞으로 몇 도 더 돌려야 하나요?',h?'합에서 차를 빼면 첫 번째 각의 2배예요. ('+total+' − '+diff+') ÷ 2 = '+small:'직각은 90°. 90 − '+small+' − '+big+' = '+(90-total),'°',{small,big,diff,total,h});});},
  muldiv(lv,stage){return ap4Select(lv,stage,(h)=>{
    const n=rnd(12,26),per=rnd(12,24),left=rnd(1,per-1),all=n*per+left,id=ap4Id('41.muldiv','pack',h);
    return ap4N(id,h?per:n+1,h?'구슬 '+all+'개를 상자 '+n+'개에 똑같이 담았더니 '+left+'개가 남았어요. 상자 하나에 담은 구슬은 몇 개일까요?':'구슬 '+all+'개를 한 상자에 최대 '+per+'개씩 담아요. 모두 담으려면 상자는 적어도 몇 개 필요할까요?',h?'담은 구슬은 '+(all-left)+'개. '+(all-left)+' ÷ '+n+' = '+per:'나눗셈의 몫은 '+n+', 나머지는 '+left+'이므로 상자가 하나 더 필요해요.',h?'개':'상자',{n,per,left,all,h});
   },(h)=>{const groups=rnd(3,7),base=rnd(13,27),diff=rnd(2,8),total=groups*(2*base+diff),id=ap4Id('41.muldiv','twoTeams',h);
    return ap4N(id,h?base:total,h?'가 모둠과 나 모둠에서 각각 '+groups+'봉지씩 만들었어요. 가의 한 봉지보다 나의 한 봉지에 사탕이 '+diff+'개 더 많아요. 총 '+total+'개를 썼다면 가의 한 봉지는 몇 개일까요?':'가 모둠은 사탕을 한 봉지에 '+base+'개씩 '+groups+'봉지, 나 모둠은 한 봉지에 '+(base+diff)+'개씩 '+groups+'봉지 담았어요. 사탕은 모두 몇 개일까요?',h?'가와 나 한 봉지씩은 '+(total/groups)+'개. 차 '+diff+'개를 빼고 2로 나누면 '+base+'개예요.':'('+base+' + '+(base+diff)+') × '+groups+' = '+total,'개',{groups,base,diff,total,h});});},
  move(lv,stage){return ap4Select(lv,stage,(h)=>{
    const x=rnd(0,6),y=rnd(0,6),vertical=rnd(0,1)===0,tx=vertical?6-x:x,ty=vertical?y:6-y,id=ap4Id('41.move','mirror',h),axis=vertical?'가로 좌표 3을 지나는 세로선':'세로 좌표 3을 지나는 가로선';
    const slide=h?rnd(0,tx):0,bx=tx-slide,ans=h?x:(vertical?tx:ty);
    return ap4N(id,ans,h?'처음 점을 '+axis+'을 기준으로 뒤집고 왼쪽으로 '+slide+'칸 밀었더니 B('+bx+', '+ty+')가 되었어요. 처음 점의 가로 좌표는? (좌표 순서는 가로, 세로)':'A('+x+', '+y+')를 '+axis+'을 기준으로 뒤집어요. 옮겨진 점의 '+(vertical?'가로':'세로')+' 좌표는? (좌표 순서는 가로, 세로)',h?'밀기를 되돌리면 가로 좌표는 '+bx+' + '+slide+' = '+tx+'. '+(vertical?'뒤집기 전에는 6 − '+tx+' = '+x:'가로선 기준 뒤집기는 가로 좌표를 바꾸지 않으므로 '+x)+'이에요.':vertical?'선에서 같은 거리로 반대쪽에 놓이므로 가로 좌표의 합은 6이에요.':'가로선 기준으로 뒤집으면 가로 좌표는 그대로, 세로 좌표의 합은 6이에요.','',{x,y,tx,ty,vertical,slide,bx,h},ap4Grid([[h?bx:x,h?ty:y,h?'B':'A']]));
   },(h)=>{const x=rnd(0,6),y=rnd(0,6),cw=rnd(0,1)===0,rx=cw?y:6-y,ry=cw?6-x:x,id=ap4Id('41.move','quarterTurn',h);
    const finalX=6-rx,ans=h?x:ry;
    return ap4N(id,ans,h?'처음 점을 중심 (3, 3) 둘레로 '+(cw?'시계':'시계 반대')+' 방향 90° 돌리고, 가로 좌표 3의 세로선을 기준으로 뒤집었더니 B('+finalX+', '+ry+')예요. 처음 점의 가로 좌표는?':'A('+x+', '+y+')를 중심 (3, 3) 둘레로 '+(cw?'시계':'시계 반대')+' 방향 90° 돌려요. 옮겨진 점의 세로 좌표는? (좌표 순서는 가로, 세로)',h?'뒤집기를 되돌리면 ('+rx+', '+ry+'). 이어 반대 방향으로 90° 돌리면 ('+x+', '+y+')예요.':'중심에서 가로·세로로 떨어진 칸 수가 서로 바뀌어요. 옮겨진 점은 ('+rx+', '+ry+')예요.','',{x,y,cw,rx,ry,finalX,h},ap4Grid([[h?finalX:x,h?ry:y,h?'B':'A'],[3,3,'중심']]));});},
  graph(lv,stage){return ap4Select(lv,stage,(h)=>{
    const step=pick([5,10]),vals=[rnd(3,7),rnd(3,7),rnd(3,7),rnd(3,7)].map(v=>v*step),k=rnd(0,3),total=vals.reduce((a,b)=>a+b,0),id=ap4Id('41.graph','missing',h);
    return ap4N(id,h?vals[k]:Math.ceil(total/30),h?'네 반이 모은 병은 모두 '+total+'개예요. 가려진 '+['가','나','다','라'][k]+' 반은 몇 개를 모았나요?':'네 반이 모은 병을 상자 하나에 최대 30개씩 담아요. 모두 담으려면 상자는 적어도 몇 개 필요할까요?',h?'전체에서 보이는 세 반의 병 수를 빼면 '+vals[k]+'개예요.':'병은 모두 '+total+'개. 30개씩 담고 남은 병도 담아야 해요.','개',{step,vals,k,total,h},ap4Chart(vals,step,false,h?k:-1));
   },(h)=>{const step=pick([5,10]),lo=rnd(2,5)*step,d=pick([2,4])*step,vals=[lo+d,lo,rnd(2,7)*step,rnd(2,7)*step],id=ap4Id('41.graph','balance',h);
    return ap4N(id,h?d/2:d,h?'가 반의 병을 나 반에 몇 개 옮기면 두 반의 수가 같아질까요?':'가 반과 나 반의 병 수 차이는 몇 개인가요? 그 차이를 작은 그림 하나가 1개인 그림그래프에 나타내려면 작은 그림이 몇 개 필요한가요?',h?'한 개 옮기면 차이는 2개 줄어요. 차 '+d+'개의 절반인 '+d/2+'개를 옮겨요.':'막대의 차이는 '+(lo+d)+' − '+lo+' = '+d+'개예요.','개',{step,lo,d,vals,h},ap4Chart(vals,step));});},
  pattern(lv,stage){return ap4Select(lv,stage,(h,s)=>{
    const a=rnd(3,9),inc=rnd(2,6),n=rnd(5,Math.min(10,5+s)),target=a+inc*(n-1),id=ap4Id('41.pattern','row',h);
    return ap4N(id,h?n:target,h?'첫째 줄에 의자 '+a+'개, 둘째 줄에 '+(a+inc)+'개, 셋째 줄에 '+(a+2*inc)+'개를 놓아요. 같은 규칙으로 '+target+'개를 놓는 줄은 몇째 줄일까요?':'첫째 줄에 의자 '+a+'개, 둘째 줄에 '+(a+inc)+'개, 셋째 줄에 '+(a+2*inc)+'개를 놓아요. 같은 규칙으로 '+n+'째 줄에는 몇 개 놓나요?',h?'줄마다 '+inc+'개씩 늘어요. ('+target+' − '+a+') ÷ '+inc+' + 1 = '+n:a+' + '+inc+' × '+(n-1)+' = '+target,h?'째':'개',{a,inc,n,target,h});
   },(h)=>{const a=rnd(2,5),b=rnd(2,5),cycles=rnd(4,9),offset=rnd(1,a),pos=(a+b)*cycles+offset,id=ap4Id('41.pattern','beads',h);
    return ap4N(id,h?pos:cycles*a+offset,h?'빨간 구슬 '+a+'개, 파란 구슬 '+b+'개를 반복해 꿰어요. 빨간 구슬을 '+(cycles*a+offset)+'개 꿰는 순간 바로 멈췄어요. 모두 몇 개 꿰었나요?':'빨간 구슬 '+a+'개, 파란 구슬 '+b+'개를 이 순서로 반복해 꿰어요. 처음부터 '+pos+'번째 구슬까지 빨간 구슬은 모두 몇 개일까요?',h?'완전한 묶음 '+cycles+'개 뒤에 빨강 '+offset+'개가 더 있어요. 전체는 '+(a+b)+' × '+cycles+' + '+offset+' = '+pos+'개':(a+b)+'개가 한 묶음이에요. 완전한 '+cycles+'묶음에 빨강 '+(cycles*a)+'개, 남은 '+offset+'개도 빨강이므로 '+(cycles*a+offset)+'개예요.','개',{a,b,cycles,offset,pos,h});});}
 },
 '42':{
  fracadd(lv,stage){return ap4Select(lv,stage,(h)=>{
    const d=rnd(4,9),a=rnd(1,d-1),b=rnd(1,d-1),used=a+b,total=3*d,id=ap4Id('42.fracadd','ribbon',h),remain=total-used;
    return ap4N(id,h?b:remain,h?'리본 3 m에서 첫날 '+a+'/'+d+' m를 썼어요. 둘째 날에도 쓰고 나니 '+remain+'/'+d+' m가 남았어요. 둘째 날 쓴 길이는 1/'+d+' m가 몇 개인가요?':'리본 3 m에서 '+a+'/'+d+' m와 '+b+'/'+d+' m를 잘랐어요. 남은 길이는 1/'+d+' m가 몇 개인가요?',h?'처음 '+total+'칸 − 첫날 '+a+'칸 − 남은 '+remain+'칸 = '+b+'칸':'3 m는 1/'+d+' m '+total+'개. '+total+' − '+a+' − '+b+' = '+remain,'개',{d,a,b,total,remain,h});
   },(h)=>{const d=rnd(5,9),small=rnd(1,d-2),diff=rnd(1,d-small-1),big=small+diff,sum=small+big,id=ap4Id('42.fracadd','twoCups',h),ans=h?small+'/'+d:sum+'/'+d;
    const nums=h?[small,small+1,Math.max(0,small-1),big]:[sum,sum+1,sum-1,Math.max(0,sum-2)];
    return ap4C(id,ans,[...new Set(nums)].map(n=>n+'/'+d),h?'가 컵과 나 컵의 물은 모두 '+sum+'/'+d+' L예요. 나 컵은 가 컵보다 '+diff+'/'+d+' L 더 많아요. 가 컵에는 몇 L가 있나요?':'가 컵에 '+small+'/'+d+' L, 나 컵에 '+big+'/'+d+' L의 물이 있어요. 두 컵을 합하면 몇 L인가요?',h?'분모가 같으니 분자끼리 생각해요. ('+sum+' − '+diff+') ÷ 2 = '+small+', 따라서 '+small+'/'+d+' L':'같은 크기의 조각 '+small+'개와 '+big+'개를 합하면 '+sum+'개예요.',{d,small,diff,big,sum,h});});},
  tri(lv,stage){return ap4Select(lv,stage,(h)=>{
    const side=rnd(5,12),rawBase=rnd(3,2*side-1),base=rawBase===side?side-1:rawBase,per=2*side+base,id=ap4Id('42.tri','fence',h);
    return ap4N(id,h?side:per,h?'이등변삼각형 화단의 세 변의 길이의 합은 '+per+' m예요. 같은 두 변이 있고, 밑변은 같은 변 하나보다 '+Math.abs(base-side)+' m '+(base>side?'길어요':'짧아요')+'. 같은 변 하나는 몇 m일까요?':'이등변삼각형 화단의 같은 두 변은 각각 '+side+' m, 밑변은 '+base+' m예요. 둘레에 울타리를 치려면 몇 m가 필요할까요?',h?'밑변도 같은 변과 같다고 생각하면 전체에서 '+Math.abs(base-side)+' m를 '+(base>side?'빼요':'더해요')+'. 그러면 '+(3*side)+' m이므로 같은 변은 '+side+' m예요.':'같은 변 두 개와 밑변을 더해요. '+side+' + '+side+' + '+base+' = '+per,'m',{side,base,per,h});
   },(h)=>{const base=pick([35,40,45,50,55,65]),vertex=180-2*base,diff=Math.abs(vertex-base),id=ap4Id('42.tri','foldAngle',h);
    return ap4N(id,h?base:vertex,h?'정삼각형이 아닌 이등변삼각형이에요. 꼭지각은 밑각보다 '+diff+'° '+(vertex>base?'커요':'작아요')+'. 한 밑각은 몇 도일까요?':'이등변삼각형 종이의 한 밑각이 '+base+'°예요. 꼭지각을 정확히 반으로 접기 전의 꼭지각은 몇 도일까요?',h?'밑각을 □라 하면 세 각은 □, □, '+(vertex>base?'□ + ':'□ − ')+diff+'이에요. 세 각의 합 180°를 이용하면 밑각은 '+base+'°':'두 밑각이 같으므로 180 − '+base+' − '+base+' = '+vertex,'°',{base,vertex,diff,h});});},
  dec(lv,stage){return ap4Select(lv,stage,(h)=>{
    const b=rnd(30,120),c=rnd(20,100),remain=rnd(25,160),a=b+c+remain,id=ap4Id('42.dec','rope',h);
    return ap4N(id,(h?b:remain)/100,h?'줄 '+ap4D(a)+' m에서 두 번 잘랐어요. 두 번째에 '+ap4D(c)+' m를 자르고 '+ap4D(remain)+' m가 남았다면 첫 번째에 몇 m를 잘랐나요?':'줄 '+ap4D(a)+' m에서 '+ap4D(b)+' m와 '+ap4D(c)+' m를 잘랐어요. 몇 m가 남았나요?',h?ap4D(a)+' − '+ap4D(c)+' − '+ap4D(remain)+' = '+ap4D(b)+' m':ap4D(a)+' − '+ap4D(b)+' − '+ap4D(c)+' = '+ap4D(remain)+' m','m',{a,b,c,remain,h},'',true);
   },(h)=>{const small=rnd(45,160),diff=rnd(12,90)*2,big=small+diff,total=small+big,id=ap4Id('42.dec','water',h);
    return ap4N(id,(h?diff/2:total)/100,h?'가 물통에 '+ap4D(big)+' L, 나 물통에 '+ap4D(small)+' L가 있어요. 가에서 나로 몇 L를 옮기면 두 물통의 양이 같아질까요?':'가 물통에 '+ap4D(big)+' L, 나 물통에 '+ap4D(small)+' L가 있어요. 합친 양은 몇 L인가요?',h?'차는 '+ap4D(diff)+' L. 0.01 L씩 옮기면 차가 0.02 L씩 줄어 '+ap4D(diff/2)+' L를 옮겨요.':ap4D(big)+' + '+ap4D(small)+' = '+ap4D(total)+' L','L',{small,diff,big,total,h},'',true);});},
  quad(lv,stage){return ap4Select(lv,stage,(h)=>{
    const short=rnd(3,10),diff=rnd(2,8),long=short+diff,per=2*(short+long),id=ap4Id('42.quad','frame',h);
    return ap4N(id,h?short:per,h?'직사각형 액자의 네 변의 길이의 합은 '+per+' cm예요. 긴 변은 짧은 변보다 '+diff+' cm 길어요. 짧은 변은 몇 cm인가요?':'직사각형 액자의 긴 변은 '+long+' cm, 짧은 변은 '+short+' cm예요. 테두리 한 바퀴의 길이는 몇 cm인가요?',h?'이웃한 두 변의 합은 '+per/2+' cm. 차 '+diff+' cm를 빼고 2로 나누면 '+short+' cm':'('+long+' + '+short+') × 2 = '+per+' cm','cm',{short,diff,long,per,h});
   },(h)=>{const a=rnd(40,75),b=180-a,id=ap4Id('42.quad','parallelogram',h);
    return ap4N(id,h?a:b,h?'평행사변형의 이웃한 두 각의 차는 '+(b-a)+'°예요. 작은 각은 몇 도인가요?':'평행사변형의 한 각이 '+a+'°예요. 그 각과 이웃한 각은 몇 도인가요?',h?'이웃한 두 각은 합이 180°. (180 − '+(b-a)+') ÷ 2 = '+a+'°':'이웃한 두 각의 합은 180°이므로 180 − '+a+' = '+b,'°',{a,b,h});});},
  lgraph(lv,stage){return ap4Select(lv,stage,(h)=>{
    const step=pick([2,5]),start=rnd(2,5)*step,inc=rnd(1,3)*step,vals=[start,start+inc,start+2*inc,start+3*inc],id=ap4Id('42.lgraph','growth',h);
    return ap4N(id,h?vals[2]:inc,h?'가, 나, 다, 라는 하루씩 지난 때예요. 하루마다 같은 길이만큼 자랐어요. 가려진 다의 키는 몇 cm인가요?':'가, 나, 다, 라는 하루씩 지난 때예요. 하루마다 같은 길이만큼 자랐어요. 하루에 몇 cm 자랐나요?',h?'하루 증가량은 '+vals[1]+' − '+vals[0]+' = '+inc+'. 다는 '+vals[1]+' + '+inc+' = '+vals[2]:'하루 증가량은 '+vals[1]+' − '+vals[0]+' = '+inc,'cm',{step,start,inc,vals,h},ap4Chart(vals,step,true,h?2:-1));
   },(h)=>{const step=pick([2,5]),a=rnd(5,8)*step,drop=rnd(1,3)*step,rise=rnd(1,3)*step,extra=rnd(1,3)*step,vals=[a,a-drop,a-drop+rise,a-drop+rise+extra],id=ap4Id('42.lgraph','tank',h);
    return ap4N(id,h?a:rise+extra,h?'가에서 나 사이에는 물을 쓰기만 했고, 나부터 라까지는 물을 넣기만 했어요. 쓴 물은 넣은 물보다 '+Math.abs(drop-rise-extra)+' L '+(drop>=rise+extra?'많아요':'적어요')+'. 가에 있던 물은 몇 L인가요?':'가, 나, 다, 라는 차례로 측정한 물의 양이에요. 나 이후로 물을 넣기만 했다면 나부터 라까지 넣은 물은 모두 몇 L인가요?',h?'나부터 라까지 넣은 물은 '+(rise+extra)+' L. 조건에 따라 쓴 물은 '+drop+' L이므로 가의 물은 '+vals[1]+' + '+drop+' = '+a:'늘어난 두 양의 합은 '+rise+' + '+extra+' = '+(rise+extra),'L',{step,a,drop,rise,extra,vals,h},ap4Chart(vals,step,true,h?0:-1));});},
  poly(lv,stage){return ap4Select(lv,stage,(h)=>{
    const n=pick([5,6,8]),side=rnd(4,12),total=n*side,remove=rnd(1,side-1),names={5:'정오각형',6:'정육각형',8:'정팔각형'},id=ap4Id('42.poly','border',h);
    return ap4N(id,h?side:total-remove,h?names[n]+' 모양의 테두리를 끈으로 한 바퀴 둘렀어요. 그중 '+remove+' cm를 떼어 내니 '+(total-remove)+' cm가 남았어요. 한 변은 몇 cm인가요?':'한 변이 '+side+' cm인 '+names[n]+'의 테두리에 끈을 둘러요. 문으로 남길 '+remove+' cm를 빼면 필요한 끈은 몇 cm인가요?',h?'원래 길이는 '+(total-remove)+' + '+remove+' = '+total+' cm. '+n+'개의 같은 변으로 나누면 '+side+' cm':side+' × '+n+' − '+remove+' = '+(total-remove),'cm',{n,side,total,remove,h});
   },(h)=>{const n=pick([5,6,8]),diagonals=n-3,side=rnd(3,10),id=ap4Id('42.poly','vertex',h);
    return ap4N(id,h?side:diagonals,h?'정다각형의 한 꼭짓점에서 그을 수 있는 대각선은 '+diagonals+'개예요. 모든 변의 길이의 합이 '+(n*side)+' cm라면 한 변은 몇 cm인가요?':n+'각형의 한 꼭짓점에서 다른 꼭짓점까지 선분을 모두 그어요. 변인 선분 2개를 빼면 대각선은 몇 개일까요?',h?'자기 자신과 이웃한 꼭짓점을 제외하면 대각선이므로 변은 '+diagonals+' + 3 = '+n+'개. 한 변은 '+(n*side)+' ÷ '+n+' = '+side+' cm':n+'개의 꼭짓점 중 자기 자신과 이웃한 2개를 빼요. '+n+' − 3 = '+diagonals,h?'cm':'개',{n,diagonals,side,h});});}
 }
};
