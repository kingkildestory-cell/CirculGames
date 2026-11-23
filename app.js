
(() => {
  let balance = 1000;
  let inventory = [];
  let lastBonus = localStorage.getItem("cgBonusDate") || "";
  const $ = (id) => document.getElementById(id);
  const fmt = (n) => Math.floor(n).toLocaleString("ru-RU");
  const toast = (msg) => { const el=$("toast"); el.textContent=msg; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),2300); };
  function renderBalance(){ $("balance").textContent=fmt(balance); $("profileBalance").textContent=fmt(balance)+" CG"; }
  function showPage(page){
    ["games","gifts","profile"].forEach(p=>$(`${p}Page`).classList.toggle("hidden",p!==page));
    document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  }
  document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
  document.querySelectorAll("[data-scroll]").forEach(b=>b.addEventListener("click",()=>$("gameGrid").scrollIntoView({behavior:"smooth"})));
  $("dailyBonus").addEventListener("click",()=>{
    const today=new Date().toISOString().slice(0,10);
    if(lastBonus===today){toast("Ежедневный бонус уже получен.");return;}
    lastBonus=today;localStorage.setItem("cgBonusDate",today);balance+=100;renderBalance();toast("+100 CG — ежедневный бонус!");
  });
  const games={
    wheel:{title:"DRAW WHEEL",desc:"Ставка списывается перед раундом. Попади в выигрышный сектор.",play:()=>Math.random()<.42?{win:true,mult:2}:{win:false}},
    rocket:{title:"ROCKET",desc:"Демо-раунд: нажми «Играть» и получи случайный множитель.",play:()=>{const m=+(1+Math.random()*2.5).toFixed(2);return Math.random()<.7?{win:true,mult:m}:{win:false};}},
    slots:{title:"NEON SLOTS",desc:"Три символа крутятся в виртуальном автомате.",play:()=>Math.random()<.28?{win:true,mult:3}:{win:false}},
    dice:{title:"HIGH / LOW",desc:"Угадай, выпадет ли число 4, 5 или 6.",play:()=>Math.random()<.5?{win:true,mult:1.8}:{win:false}}
  };
  let activeGame="wheel";
  document.querySelectorAll(".game-card").forEach(card=>card.addEventListener("click",()=>{
    activeGame=card.dataset.game;const g=games[activeGame];$("modalTitle").textContent=g.title;$("modalDesc").textContent=g.desc;$("gameMessage").textContent="Удачи!";$("gameStage").innerHTML='<div class="mini-wheel" id="miniWheel">'+(activeGame==="rocket"?"↗":activeGame==="slots"?"✦ 7 ✳":activeGame==="dice"?"⚄":"✳")+'</div>';$("gameModal").classList.remove("hidden");
  }));
  $("closeModal").addEventListener("click",()=>$("gameModal").classList.add("hidden"));
  $("gameModal").addEventListener("click",e=>{if(e.target===$("gameModal"))$("gameModal").classList.add("hidden")});
  $("playButton").addEventListener("click",()=>{
    const bet=Number($("bet").value);
    if(!Number.isFinite(bet)||bet<10||bet>balance){$("gameMessage").textContent="Ставка должна быть от 10 CG и не больше баланса.";return;}
    balance-=bet;renderBalance();$("playButton").disabled=true;
    const symbol=$("miniWheel");if(symbol)symbol.classList.add("spinning");
    $("gameMessage").textContent="Раунд идёт…";
    setTimeout(()=>{
      const result=games[activeGame].play();if(symbol)symbol.classList.remove("spinning");
      if(result.win){const prize=Math.floor(bet*result.mult);balance+=prize;$("gameMessage").textContent=`Победа! +${fmt(prize)} CG · x${result.mult}`;}
      else $("gameMessage").textContent="Не повезло в этот раз. Попробуй снова.";
      renderBalance();$("playButton").disabled=false;
    },1100);
  });
  document.querySelectorAll(".buy-gift").forEach(btn=>btn.addEventListener("click",()=>{
    const cost=Number(btn.dataset.cost);if(balance<cost){toast("Недостаточно CG.");return;}
    balance-=cost;inventory.push(btn.dataset.gift);renderBalance();$("inventory").textContent=inventory.join(" · ");toast("Подарок добавлен в инвентарь!");
  }));
  $("copyRef").addEventListener("click",async()=>{
    const value=$("refLink").textContent;
    try{await navigator.clipboard.writeText(value);toast("Ссылка скопирована.");}
    catch{toast("Скопируй ссылку вручную: "+value);}
  });
  renderBalance();
})();
