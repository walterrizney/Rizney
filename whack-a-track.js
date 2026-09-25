/* Header, footer, animal visuals, and Whack-a-Track. */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const controls = () => $(".controls");
  const player = () => window.rizneyPlayer || window.player || null;
  const animals = ["aardvark","alligator","anglefish","ant","anteater","armadillo","baboon","badger","bald-eagle","bass","bat","bear","beaver","bee","blob-fish","blue-heron","boar","buffalo","butterfly","camel","cat","caterpillar","cow","crab","deer","dolphin","donkey","dragonfly","eagle","elephant","falcon","fish","flamingo","fox","frog","giraffe","goat","gorilla","hawk","hedgehog","hippo","horse","jaguar","kangaroo","koala","lemur","leopard","lion","llama","lynx","mole","monkey","moose","narwhal","otter","owl","panda","panther","parrot","peacock","penguin","pigeon","porcupine","rabbit","raccoon","ram","rat","raven","rhino","seal","shark","sheep","skunk","sloth","snake","sparrow","squirrel","stork","tiger","toucan","turtle","vulture","walrus","weasel","whale","wolf","yak","zebra"];
  const animal = index => animals[index % animals.length];
  const imageFor = index => `assets/animal-icons/${encodeURIComponent(animal(index))}.png`;
  const labelFor = name => name.replace(/\s*\(2\)$/, "").replace(/-/g, " ");

  function addHeaderAndFooter() {
    const top = $(".top-area");
    if (top) {
      top.querySelector("h1")?.remove();
      top.querySelector(".tagline")?.remove();
      let logo = $(".rizney-logo", top);
      if (!logo) { logo = document.createElement("img"); logo.className = "rizney-logo"; logo.src = "assets/rizney.png"; logo.alt = "Rizney"; top.appendChild(logo); }
      let context = $(".context-link", top);
      if (!context) { context = document.createElement("a"); context.className = "context-link"; context.href = "./context.html"; context.textContent = "CONTEXT"; top.appendChild(context); }
    }
    if (!$("#rizney-site-adjustments")) {
      const style = document.createElement("style");
      style.id = "rizney-site-adjustments";
      style.textContent = `
        .top-area{min-height:112px!important;padding:20px 14px 22px!important;text-align:center}
        .top-area .donate,.top-area .context-link{top:22px!important;z-index:2;border:1px solid var(--gold);border-radius:999px;padding:7px 12px;color:var(--bright-gold);background:#160c1a;font:inherit;font-size:.78rem;text-decoration:none;line-height:1.2}
        .top-area .donate{left:12px!important}.top-area .context-link{left:50%!important;transform:translateX(-50%)!important}
        .top-area .rizney-logo{position:absolute;top:12px;right:12px;width:88px;height:88px;object-fit:contain}
        .top-area .donate:hover,.top-area .context-link:hover{background:#55208a}
        .rizney-footer{margin:0;padding:0;line-height:0;background:#fff;text-align:center;border-top:1px solid #3b1d50}
        .rizney-footer img{display:block;width:138px;height:auto;max-height:110px;object-fit:contain;margin:0 auto}
        @media(max-width:500px){.top-area{min-height:96px!important;padding:17px 8px 19px!important}.top-area .donate,.top-area .context-link{top:18px!important;padding:6px 10px;font-size:.72rem}.top-area .donate{left:8px!important}.top-area .rizney-logo{top:8px;right:8px;width:76px;height:76px}.rizney-footer img{width:120px;max-height:90px}}
      `;
      document.head.appendChild(style);
    }
    if (!$(".rizney-footer")) {
      const footer = document.createElement("footer");
      footer.className = "rizney-footer";
      const image = document.createElement("img");
      image.src = "assets/curse.png";
      image.alt = "Curse";
      image.loading = "lazy";
      footer.appendChild(image);
      ($("main") || document.body).appendChild(footer);
    }
  }

  function addStyles() {
    if ($("#rizney-animal-styles")) return;
    const style = document.createElement("style");
    style.id = "rizney-animal-styles";
    style.textContent = `
      .player-dock{z-index:101}
      .controls{position:sticky;top:var(--rizney-player-height,0px);z-index:100;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center;padding:12px 10px 14px}
      .controls button{min-height:38px;line-height:1.2}
      #song-list .song{grid-template-columns:38px minmax(0,1fr) 52px;min-height:72px}
      #song-list .song .play{grid-column:3;grid-row:1;align-self:center;justify-self:end;width:52px;height:52px;min-height:52px;padding:3px;display:grid;place-items:center;overflow:hidden}
      #song-list .song .play img{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none}
      #cards .card{background:#000}
      #cards .card .symbol{height:96px;display:grid;place-items:center;font-size:0}
      #cards .card .symbol img{width:96px;height:96px;object-fit:contain;display:block}
      @media(max-width:500px){.controls{gap:6px;padding:10px 8px 12px}.controls button{min-height:34px}#song-list .song{grid-template-columns:30px minmax(0,1fr) 46px;min-height:64px}#song-list .song .play{width:46px;height:46px;min-height:46px}}
    `;
    document.head.appendChild(style);
  }

  function syncPlayerHeight() {
    const dock = $(".player-dock");
    if (dock) document.documentElement.style.setProperty("--rizney-player-height", `${dock.getBoundingClientRect().height}px`);
  }

  function paintSongs() {
    document.querySelectorAll("#song-list .song").forEach((row, index) => {
      const button = $("button.play", row);
      if (!button || button.dataset.animalPainted === "true") return;
      const image = document.createElement("img");
      image.src = imageFor(index); image.alt = labelFor(animal(index)); image.loading = "lazy";
      button.textContent = ""; button.appendChild(image); button.dataset.animalPainted = "true";
    });
  }

  function paintCards() {
    $("#cards")?.querySelectorAll(".card").forEach((card, index) => {
      const symbol = $(".symbol", card);
      if (!symbol || $("img", symbol)) return;
      const image = document.createElement("img");
      image.src = imageFor(index); image.alt = labelFor(animal(index)); image.loading = "lazy";
      symbol.textContent = ""; symbol.appendChild(image);
    });
  }

  function bindVisuals() {
    addHeaderAndFooter(); addStyles(); paintSongs(); paintCards(); syncPlayerHeight();
    window.addEventListener("resize", syncPlayerHeight);
    const list = $("#song-list");
    if (list) new MutationObserver(() => { paintSongs(); paintCards(); }).observe(list, { childList: true, subtree: true });
  }

  let game = null, active = false, health = 24, seconds = 80, moleTimer, gameTimer;
  const setToolbarHidden = hidden => controls()?.classList.toggle("toolbar-hidden", hidden);
  function createGame() {
    if (game) return game;
    const panel = document.createElement("section"); panel.id = "whack-a-track-game"; panel.hidden = true;
    panel.innerHTML = `<h2>Whack-a-Track</h2><p id="wat-status"></p><div class="wat-board"></div>`;
    const board = $(".wat-board", panel); const status = $("#wat-status", panel);
    for (let i = 0; i < 9; i++) { const hole = document.createElement("button"); hole.type = "button"; hole.className = "wat-hole"; hole.textContent = "🕳️"; hole.addEventListener("click", () => { if (active && hole.dataset.active === "true") { hole.dataset.active = "false"; hole.textContent = "✨"; health = Math.min(24, health + 1); status.textContent = `Health: ${health}`; } }); board.appendChild(hole); }
    ($("main") || document.body).appendChild(panel); game = { panel, board, status }; return game;
  }
  function spawnMole() { if (!active || !game) return; game.board.querySelectorAll(".wat-hole").forEach(hole => { hole.dataset.active = "false"; hole.textContent = "🕳️"; }); const holes = [...game.board.children]; const hole = holes[Math.floor(Math.random() * holes.length)]; hole.dataset.active = "true"; hole.textContent = "🐾"; clearTimeout(moleTimer); moleTimer = setTimeout(() => { if (hole.dataset.active === "true") { hole.dataset.active = "false"; hole.textContent = "🕳️"; health--; game.status.textContent = `Health: ${health}`; if (health <= 0) finish(false); } }, 1200); }
  function finish(won) { active = false; clearTimeout(moleTimer); clearInterval(gameTimer); if (game) game.status.textContent = won ? "💥 TRACK WHACKED!" : "The track escaped..."; setTimeout(() => { if (game) game.panel.hidden = true; setToolbarHidden(false); }, 1100); }
  function startGame(event) { event.preventDefault(); event.stopPropagation(); const current = createGame(); current.panel.hidden = false; setToolbarHidden(true); health = 24; seconds = 80; active = true; current.status.textContent = `Health: ${health}`; clearInterval(gameTimer); gameTimer = setInterval(() => { if (--seconds <= 0) finish(true); else spawnMole(); }, 1000); spawnMole(); }
  function init() { bindVisuals(); $("#whack-track")?.addEventListener("click", startGame); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
