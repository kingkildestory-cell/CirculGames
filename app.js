(() => {
 const $=id=>document.getElementById(id), fmt=n=>Math.floor(n).toLocaleString("ru-RU");
 let balance=Number(localStorage.getItem("cgBalance")||1000), inventory=JSON.parse(localStorage.getItem("cgInventory")||"[]"), active="wheel", busy=false;
 const games={
 wheel:{title:"DRAW WHEEL",desc:"Колесо остановится на одном из секторов. Это демонстрационный раунд.",icon:"wheel",run:()=>Math.random()<.42?{win:true,mult:2}:{win:false}},
 rocket:{title:"ROCKET",desc:"Ракета стартует и набирает скорость. Результат раунда демонстрационный.",icon:"rocket",run:()=>{let m=+(1+Math.random()*3.2).toFixed(2);return Math.random()<.68?{win:true,mult:m}:{win:false}}},
 slots:{title:"NEON SLOTS",desc:"Три неоновых барабана. Три одинаковых символа дают бонус.",icon:"slots",run:()=>{let win=Math.random()<.27;return win?{win:true,mult:3}:{win:false}}},
 dice:{title:"HIGH / LOW",desc:"Бросок кубика: в этом демо раунде проверяется случайный результат.",icon:"dice",run:()=>Math.random()<.5?{win:true,mult:1.8}:{win:false}}
 };
 function toast(s){let t=$("toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
 function render(){let b=fmt(balance);$("balance").textContent=b;$("statBalance").textContent=b;$("profileBalance").textContent=b+" CG";localStorage.setItem("cgBalance",balance);$("inventory").textContent=inventory.length?inventory.join(" · "):"Твои трофеи появятся здесь."}
 function page(p){["games","gifts","profile"].forEach(x=>$(`${x}Page`).classList.toggle("hidden",x!==p));document.querySelectorAll(".nav-link").forEach(x=>x.classList.toggle("active",x.dataset.page===p));window.scrollTo({top:0,behavior:"smooth"})}
 document.querySelectorAll(".nav-link").forEach(x=>x.addEventListener("click",()=>page(x.dataset.page)));
 document.querySelectorAll("[data-scroll]").forEach(x=>x.addEventListener("click",()=>$("gameGrid").scrollIntoView({behavior:"smooth",block:"center"})));
 $("dailyBonus").addEventListener("click",()=>{let day=new Date().toLocaleDateString("sv-SE");if(localStorage.getItem("cgBonusDay")===day){toast("Бонус на сегодня уже получен.");return}localStorage.setItem("cgBonusDay",day);balance+=100;render();toast("+100 CG · ежедневный бонус получен")});
 function stage(type){if(type==="wheel")return '<div class="mini-wheel" id="motion">✦</div>';if(type==="rocket")return '<div class="mini-rocket" id="motion">◆</div>';if(type==="slots")return '<div class="mini-slots" id="motion"><span>✦</span><span>7</span><span>◆</span></div>';return '<div class="mini-die" id="motion">⚄</div>'}
 document.querySelectorAll(".game-card").forEach(c=>c.addEventListener("click",()=>{active=c.dataset.game;let g=games[active];$("modalTitle").textContent=g.title;$("modalDesc").textContent=g.desc;$("gameStage").innerHTML=stage(active);$("gameMessage").textContent="Готов к игре?";$("playButton").disabled=false;$("gameModal").classList.remove("hidden")}));
 function close(){if(!busy)$("gameModal").classList.add("hidden")}
 $("closeModal").addEventListener("click",close);$("gameModal").addEventListener("click",e=>{if(e.target===$("gameModal"))close()});
 $("playButton").addEventListener("click",()=>{if(busy)return;let bet=Number($("bet").value);if(!Number.isInteger(bet)||bet<10||bet>balance){$("gameMessage").textContent="Введи целое число от 10 до доступного баланса.";return}
 busy=true;$("playButton").disabled=true;balance-=bet;render();let motion=$("motion");if(active==="rocket")motion.classList.add("fly");else if(active==="wheel")motion.classList.add("spinning");else if(active==="dice")motion.animate([{transform:"rotate(0) scale(1)"},{transform:"rotate(540deg) scale(1.25)"},{transform:"rotate(720deg) scale(1)"}],{duration:1000,easing:"ease-out"});else motion.animate([{transform:"translateY(0)"},{transform:"translateY(-12px)"},{transform:"translateY(0)"}],{duration:1000,iterations:3});
 $("gameMessage").textContent="РАУНД ИДЁТ…";
 setTimeout(()=>{let r=games[active].run();if(r.win){let prize=Math.floor(bet*r.mult);balance+=prize;$("gameMessage").textContent=`ПОБЕДА · +${fmt(prize)} CG · x${r.mult}`;toast("Раунд завершён: виртуальный выигрыш!")}else{$("gameMessage").textContent="В этот раз без выигрыша. Следующий раунд за тобой.";toast("Раунд завершён")};render();$("playButton").disabled=false;busy=false;$("gameStage").innerHTML=stage(active)},active==="rocket"?1500:1150)});
 document.querySelectorAll(".buy-gift").forEach(b=>b.addEventListener("click",()=>{let cost=Number(b.dataset.cost);if(balance<cost){toast("Недостаточно CG");return}balance-=cost;inventory.push(b.dataset.gift);localStorage.setItem("cgInventory",JSON.stringify(inventory));render();toast("Добавлено в коллекцию: "+b.dataset.gift)}));
 $("copyRef").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("refLink").textContent);toast("Ссылка скопирована")}catch{toast("Выдели и скопируй ссылку вручную")}});
 render();
})();
