/* ───────── 다른 놀이 허브 (영어 · 키보드 …) ─────────
   여기에 한 줄만 추가하면 홈 화면에 버튼이 생겨요. 별 없이 언제든지 열 수 있어요. */
const HUB=[
  {icon:'🔤',title:'영어 놀이',sub:'언제든지 자유롭게',url:'https://home-dun-zeta.vercel.app/',color:'#DBEAFE',border:'#93C5FD',ink:'#1E3A8A'},
  // {icon:'⌨️',title:'키보드 놀이',sub:'타자 연습',url:'https://…',color:'#DCFCE7',border:'#86EFAC',ink:'#14532D'},
];
function renderHub(){
  const el=$('#hub');if(!el)return;
  el.innerHTML=HUB.map(h=>`<a class="hubcard" href="${h.url}" target="_blank" rel="noopener" style="background:${h.color};border-color:${h.border};color:${h.ink}"><span class="hi">${h.icon}</span><span class="ht display">${h.title}</span><span class="hs">${h.sub}</span><span class="hgo">열기 →</span></a>`).join('');
}
const _renderHomeBase=renderHome;
renderHome=function(){_renderHomeBase();renderHub();};
renderHub();
