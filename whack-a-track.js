/* Header and footer adjustments, animal visuals, and Whack-a-Track. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const controls = () => $(".controls");
  const animals = ["aardvark","alligator","anglefish","ant","anteater","armadillo","baboon","badger","bald-eagle","bass","bat","bear","beaver","bee","blob-fish","blue-heron","boar","buffalo","butterfly","camel","capybara","chameleon","cheetah","chihuahua","chimpanzee","chupacabra","clam","cow","coyote","crab","cricket","crocodile","crow","deer","dolphin","donkey","dove","duck","eagle","elephant","falcon","flamingo","fox","frog","gazelle","giraffe","goat","goldfish","gorilla","hamster","hawk","hedgehog","hippo","horse","hyena","jellyfish","kangaroo","kiwi","koala","lion","lizard","llama","lynx","manatee","mole","moose","mouse","narwhal","octopus (2)","otter","owl","panda","panther","parrot","peacock","penguin","pig","platypus","polar-bear","porcupine","puma","rabbit","raccoon","ram","rat","raven","red-panda","rhino","rooster","salmon","scorpion","seagull","seahorse","seal","shark","sloth","snail","snake","spider","squid","squirrel","swan","t-rex","tapir","toucan","unicorn","vulture","walrus","warthog","weasel","whale","wolf","wombat","woodpecker","yak","zebra"];
  const animal = i => animals[i % animals.length];
  const imageFor = i => `assets/animal-icons/${encodeURIComponent(animal(i))}.png`;
  const labelFor = name => name.replace(/\s*\(2\)$/, "").replace(/-/g, " ");

  function addChrome() {
    const top = $(".top-area");
    if (top) {
      top.querySelector("h1")?.remove();
      top.querySelector(".tagline")?.remove();
      if (!$(".rizney-logo", top)) { const img = document.createElement("img"); img.className = "rizney-logo"; img.src = "assets/rizney.png"; img.alt = "Rizney"; top.appendChild(img); }
      if (!$(".context-link", top)) { const link = document.createElement("a"); link.className = "context-link"; link.href = "./context.html"; link.textContent = "CONTEXT"; top.appendChild(link); }
    }
    if (!$("#rizney-site-adjustments")) {
      const style = document.createElement("style"); style.id = "rizney-site-adjustments"; style.textContent = `
        .top-area{min-height:88px!important;padding:14px!important;text-align:center}
        .top-area .donate,.top-area .context-link{top:16px!important;z-index:2;border:1px solid var(--gold);border-radius:999px;padding:5px 9px;color:var(--bright-gold);background:#160c1a;font:inherit;font-size:.68rem;text-decoration:none}
        .top-area .donate{left:10px!important}.top-area .context-link{left:50%!important;transform:translateX(-50%)!important}
        .top-area .rizney-logo{position:absolute;top:6px;right:10px;width:76px;height:76px;object-fit:contain}
        .top-area .donate:hover,.top-area .context-link:hover{background:#55208a}
        .rizney-footer{margin:22px auto 0;padding:20px 0 34px;text-align:center;border-top:1px solid #3b1d50}
        .rizney-footer img{display:block;width:110px;height:auto;max-height:150px;object-fit:contain;margin:0 auto}
        @media(max-width:500px){.top-area{min-height:78px!important;padding:12px 8px 14px!important}.top-area .donate,.top-area .context-link{top:14px!important}.top-area .donate{left:8px!important}.top-area .rizney-logo{width:66px;height:66px;top:4px;right:8px}.rizney-footer img{width:94px;max-height:130px}}
      `; document.head.appendChild(style);
    }
    if (!$(".rizney-footer")) { const footer = document.createElement("footer"); footer.className = "rizney-footer"; const img = document.createElement("img"); img.src = "assets/curse.png"; img.alt = "Curse"; img.loading = "lazy"; footer.appendChild(img); ($("main") || document.body).appendChild(footer); }
  }

  function addStyles() {
    if ($("#rizney-animal-styles")) return;
    const style = document.createElement("style"); style.id = "rizney-animal-styles"; style.textContent = `
      .player-dock{z-index:101}.controls{position:sticky;top:var(--rizney-player-height,0px);z-index:100}
      #reading[hidden]{display:none!important}
      #song-list .song{grid-template-columns:38px minmax(0,1fr) 52px}
      #song-list .song .play{grid-column:3;grid-row:1;align-self:stretch;justify-self:end;width:52px;height:52px;min-height:52px;padding:3px;display:grid;place-items:center;overflow:hidden;background:transparent;border:0}
      #song-list .song .play img{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none}
      #cards .card{background:#000}.card .symbol{height:96px;display:grid;place-items:center;font-size:0}.card .symbol img{width:96px;height:96px;object-fit:contain;display:block}.card .animal-name{display:block;margin:0 0 8px;color:var(--bright-gold);font-family:sans-serif;font-size:.78rem;text-transform:capitalize}
      #whack-a-track-game{display:block;position:relative;z-index:99;width:min(100%,620px);margin:0 auto 18px;padding:12px 14px 18px;text-align:center;background:#120b18;border:2px solid var(--gold);border-top:0;border-radius:0 0 12px 12px}
      #whack-a-track-game[hidden]{display:none!important}.wat-board{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:480px;margin:14px auto}.wat-hole{min-height:110px;padding:8px;font-size:2.6rem;line-height:1;border:2px solid var(--gold);border-radius:10px;background:#000;color:#fff;cursor:pointer}.wat-hole:hover{background:#21102e}
      @media(max-width:500px){#song-list .song{grid-template-columns:30px minmax(0,1fr) 46px}#song-list .song .play{width:46px;height:46px;min-height:46px}.wat-board{gap:8px}.wat-hole{min-height:86px;font-size:2.1rem}}
    `; document.head.appendChild(style);
  }

  function syncPlayerHeight() { const dock = $(".player-dock"); if (dock) document.documentElement.style.setProperty("--rizney-player-height", `${dock.getBoundingClientRect().height}px`); }
  function paintSongs() { document.querySelectorAll("#song-list .song").forEach((row, i) => { const button = $("button.play", row); if (!button || button.dataset.animalPainted) return; const img = document.createElement("img"); img.src = imageFor(i); img.alt = labelFor(animal(i)); img.title = labelFor(animal(i)); img.loading = "lazy"; button.replaceChildren(img); button.dataset.animalPainted = "true"; }); }
  function paintCards() { $("#cards")?.querySelectorAll(".card").forEach((card, i) => { const link = $("a", card); const match = link?.textContent.match(/Play song\s+(\d+)/i); const index = match ? Number(match[1]) - 1 : i; const name = labelFor(animal(index)); const symbol = $(".symbol", card); if (symbol && !$("img", symbol)) { const img = document.createElement("img"); img.src = imageFor(index); img.alt = name; img.title = name; img.loading = "lazy"; symbol.replaceChildren(img); } if (link && !$(".animal-name", card)) { const label = document.createElement("span"); label.className = "animal-name"; label.textContent = name; link.before(label); } }); }

  let game = null, active = false, health = 24, seconds = 80, moleTimer = null, gameTimer = null;
  function hideMoles() { game?.board.querySelectorAll(".wat-hole").forEach(h => { h.dataset.active = "false"; h.textContent = "🕳️"; }); }
  function closeGame() { active = false; clearTimeout(moleTimer); clearInterval(gameTimer); hideMoles(); if (game) game.panel.hidden = true; }
  function finish(won) { active = false; clearTimeout(moleTimer); clearInterval(gameTimer); hideMoles(); if (game) game.status.textContent = won ? "💥 TRACK WHACKED!" : "The track escaped..."; }
  function spawnMole() { if (!active || !game) return; hideMoles(); const hole = [...game.board.children][Math.floor(Math.random() * game.board.children.length)]; if (!hole) return; hole.dataset.active = "true"; hole.textContent = "🐾"; clearTimeout(moleTimer); moleTimer = setTimeout(() => { if (!active || hole.dataset.active !== "true") return; hole.dataset.active = "false"; hole.textContent = "🕳️"; health = Math.max(0, health - 1); game.status.textContent = `Health: ${health}`; if (!health) finish(false); }, 1200); }
  function createGame() { if (game) return game; const panel = document.createElement("section"); panel.id = "whack-a-track-game"; panel.hidden = true; panel.innerHTML = `<h2>Whack-a-Track</h2><p id="wat-status"></p><div class="wat-board"></div>`; const board = $(".wat-board", panel), status = $("#wat-status", panel); for (let i = 0; i < 9; i++) { const hole = document.createElement("button"); hole.type = "button"; hole.className = "wat-hole"; hole.dataset.active = "false"; hole.textContent = "🕳️"; hole.addEventListener("click", () => { if (!active || hole.dataset.active !== "true") return; hole.dataset.active = "false"; hole.textContent = "✨"; health = Math.min(24, health + 1); status.textContent = `Health: ${health}`; }); board.appendChild(hole); } const parent = controls(); if (parent) parent.insertAdjacentElement("afterend", panel); else ($("main") || document.body).prepend(panel); game = { panel, board, status }; return game; }
  function toggleGame(event) { event.preventDefault(); event.stopPropagation(); if (active || (game && !game.panel.hidden)) { closeGame(); return; } game = createGame(); game.panel.hidden = false; health = 24; seconds = 80; active = true; game.status.textContent = `Health: ${health}`; clearInterval(gameTimer); gameTimer = setInterval(() => { if (--seconds <= 0) finish(true); else spawnMole(); }, 1000); spawnMole(); }

  function init() { addChrome(); addStyles(); paintSongs(); paintCards(); syncPlayerHeight(); window.addEventListener("resize", syncPlayerHeight); const list = $("#song-list"); if (list) new MutationObserver(() => { paintSongs(); paintCards(); }).observe(list, { childList: true, subtree: true }); $("#draw-cards")?.addEventListener("click", () => setTimeout(paintCards, 0)); $("#whack-track")?.addEventListener("click", toggleGame); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
