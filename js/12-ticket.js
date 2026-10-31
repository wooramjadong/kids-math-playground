/* ───────── 🎟️ 카드놀이 일회용 티켓 발급 + 🔑 초대코드로 대결 참가 ─────────
   카드놀이 링크를 누를 때마다 주소 끝에 한 번만 쓸 수 있는 티켓 번호(#p=...)를 붙여요.
   카드놀이 쪽에서 티켓 1장 = 게임 1판으로 확인하고, 쓴 번호는 다시 못 써요.
   🔑 초대코드 입력: 다른 기기가 만든 대결 방의 4자리 코드를 넣으면 카드놀이 참가 화면(#join=1234)으로 바로 가요.
      참가는 무료라 별을 쓰지 않아요. (별이 5개보다 적어도 참가할 수 있어요) */
(function(){
  const _rc=renderCard;
  const inv={open:false,code:''}; // 화면이 다시 그려져도 입력 중이던 코드 유지
  function openCard(url){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();}
  function addInvite(){
    const body=$('#cardplay .cp-body');if(!body||$('#cardJoin'))return;
    const box=document.createElement('div');box.id='cardJoin';box.style.cssText='margin-top:10px;flex:0 0 100%;width:100%;min-width:0;max-width:100%;box-sizing:border-box'; // 카드 칸(플렉스) 폭에 맞춤
    box.innerHTML=`<button class="btn ghost" id="cardJoinBtn" type="button" style="width:100%">🔑 초대코드 입력 <span class="cost">대결 참가 · 별 안 써요</span></button>
      <div id="cardJoinRow" class="${inv.open?'':'hidden'}" style="margin-top:8px">
        <div style="font-size:13px;color:var(--ink-soft);margin-bottom:6px">다른 기기에서 <b>방 만들기</b>를 하면 나오는 <b>4자리 방 코드</b>를 넣어요.</div>
        <div style="display:flex;gap:8px"><input id="cardJoinCode" inputmode="numeric" pattern="[0-9]*" maxlength="4" placeholder="0000" autocomplete="off" style="flex:1;min-width:0;font-size:24px;font-weight:800;letter-spacing:6px;text-align:center;border:3px solid var(--line);border-radius:12px;padding:8px;font-family:inherit">
        <button class="btn green" id="cardJoinGo" type="button">참가!</button></div>
        <div id="cardJoinMsg" style="font-size:13px;margin-top:6px;color:#92400E;min-height:1em"></div>
      </div>`;
    body.appendChild(box);
    const input=$('#cardJoinCode');input.value=inv.code;
    $('#cardJoinBtn').onclick=()=>{inv.open=!inv.open;$('#cardJoinRow').classList.toggle('hidden',!inv.open);if(inv.open)input.focus();audio.tap();};
    input.oninput=()=>{input.value=input.value.replace(/\D/g,'').slice(0,4);inv.code=input.value;$('#cardJoinMsg').textContent='';};
    const go=()=>{const code=String(input.value||'').replace(/\D/g,'');
      if(code.length!==4){$('#cardJoinMsg').textContent='4자리 숫자를 넣어 주세요.';input.focus();return;}
      $('#cardJoinMsg').textContent='카드놀이 참가 화면을 열었어요. 별은 그대로예요.';
      inv.code='';input.value='';
      openCard(CARD_URL+'#join='+code);
    };
    $('#cardJoinGo').onclick=go;
    input.onkeydown=e=>{if(e.key==='Enter')go();};
  }
  renderCard=function(){
    _rc();
    addInvite();
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
