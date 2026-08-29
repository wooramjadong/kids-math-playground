/* ───────── 🎟️ 카드놀이 일회용 티켓 발급 ─────────
   카드놀이 링크를 누를 때마다 주소 끝에 한 번만 쓸 수 있는 티켓 번호(#p=...)를 붙여요.
   카드놀이 쪽에서 티켓 1장 = 게임 1판으로 확인하고, 쓴 번호는 다시 못 써요. */
(function(){
  const _rc=renderCard;
  renderCard=function(){
    _rc();
    const a=$('#cardGo');if(!a)return;
    a.onclick=e=>{
      if(P.wallet<CARD_COST){e.preventDefault();return;}
      if(!confirm(`별 ${CARD_COST}개를 사용해서 카드놀이를 한 판 할까요?\n(남는 별: ${P.wallet-CARD_COST}개)`)){e.preventDefault();return;}
      a.href=CARD_URL+'#p='+Date.now().toString(36)+Math.random().toString(36).slice(2,7); // 일회용 티켓
      P.wallet-=CARD_COST;P.cardPlays++;store.save(P);audio.win();setTimeout(renderHome,300);
    };
  };
  renderCard(); // 지금 홈 화면에도 즉시 적용
})();
