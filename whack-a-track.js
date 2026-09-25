/* Site visuals and Whack-a-Track enhancements. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const player = () => window.rizneyPlayer || window.player || null;
  const controls = () => $(".controls");
  const animals = ["aardvark","alligator","anglefish","ant","anteater","armadillo","baboon","badger","bald-eagle","bass","bat","bear","beaver","bee","blob-fish","blue-heron","boar","buffalo","butterfly","camel","capybara","chameleon","cheetah","chihuahua","chimpanzee","chupacabra","clam","cow","coyote","crab","cricket","crocodile","crow","deer","dolphin","donkey","dove","duck","eagle","elephant","falcon","flamingo","fox","frog","gazelle","giraffe","goat","goldfish","gorilla","hamster","hawk","hedgehog","hippo","horse","hyena","jellyfish","kangaroo","kiwi","koala","lion","lizard","llama","lynx","manatee","mole","moose","mouse","narwhal","octopus (2)","otter","owl","panda","panther","parrot","peacock","penguin","pig","platypus","polar-bear","porcupine","puma","rabbit","raccoon","ram","rat","raven","red-panda","rhino","rooster","salmon","scorpion","seagull","seahorse","seal","shark","sloth","snail","snake","spider","squid","squirrel","swan","t-rex","tapir","toucan","unicorn","vulture","walrus","warthog","weasel","whale","wolf","wombat","woodpecker","yak","zebra"];
  const animal = i => animals[i % animals.length];
  const label = name => name.replace(/\s*\(2\)$/, "").replace(/-/g, " ");
  const icon = i => `assets/animal-icons/${encodeURIComponent(animal(i))}.png`;

  function addSiteStyles() {
    if ($("#rizney-site-patch")) return;
    const style = document.createElement("style");
    style.id = "rizney-site-patch";
    style.textContent = `
      /* Keep the controls attached directly beneath the sticky player. */
      .player-dock { z-index: 101; }
      .controls { position: sticky; top: var(--player-dock-height, 0px); z-index: 100; }
      .top-area { min-height: 88px !important; padding: 14px 14px 16px !important; }
      .top-area .donate, .top-area .context-link { top: 16px !important; }
      .top-area .context-link { left: 50% !important; transform: translateX(-50%) !important; }
      .top-area .rizney-logo { top: 6px !important; right: 10px !important; width: 76px !important; height: 76px !important; }
      @media (max-width:500px) {
        .top-area { min-height: 78px !important; padding: 12px 8px 14px !important; }
        .top-area .donate, .top-area .context-link { top: 14px !important; }
        .top-area .rizney-logo { top: 4px !important; right: 8px !important; width: 66px !important; height: 66px !important; }
      }
      #song-list .song .play { display:grid; place-items:center; padding:3px; overflow:hidden; }
      #song-list .song .play img { width:100%; height:100%; object-fit:contain; pointer-events:none; }
      #cards .card { background:#000; }
      #cards .card .symbol { height:96px; display:grid; place-items:center; font-size:0; }
      #cards .card .symbol img { width:96px; height:96px; object-fit:contain; }
      #cards .card .animal-name { display:block; margin:0 0 8px; color:var(--bright-gold); text-transform:capitalize; }
    `;
    document.head.appendChild(style);
  }

  function syncStickyOffset() {
    const dock = $(".player-dock");
    if (dock) document.documentElement.style.setProperty("--player-dock-height", `${dock.offsetHeight}px`);
  }

  function addHeaderAndFooter() {
    const top = $(".top-area");
    if (top) {
      top.querySelector("h1")?.remove();
      top.querySelector(".tagline")?.remove();
      if (!top.querySelector(".rizney-logo")) {
        const logo = document.createElement("img"); logo.className = "rizney-logo"; logo.src = "assets/rizney.png"; logo.alt = "Rizney"; top.appendChild(logo);
      }
      if (!top.querySelector(".context-link")) {
        const link = document.createElement("a"); link.className = "context-link"; link.href = "./context.html"; link.textContent = "CONTEXT"; top.appendChild(link);
      }
    }
    if (!(".rizney-footer")) {
      const footer = document.createElement("footer"); footer.className = "rizney-footer";
      const image = document.createElement("img"); image.src = "assets/curse.png"; image.alt = "Curse"; footer.appendChild(image);
      ($( "main") || document.body).appendChild(footer);
    }
  }

  function paintSongs() {
    document.querySelectorAll("#song-list .song").forEach((row, index) => {
      const button = row.querySelector("button.play");
      if (!button || button.dataset.animalPainted === "true") return;
      const name = label(animal(index));
      const image = document.createElement("img"); image.src = icon(index); image.alt = `Play ${name}`; image.title = name; image.loading = "lazy";
      button.replaceChildren(image); button.setAttribute("aria-label", image.alt); button.title = name; button.dataset.animalPainted = "true";
      const title = row.querySelector(".song-title");
      if (title) title.textContent = name;
    });
  }

  function paintCards() {
    $("#cards")?.querySelectorAll(".card").forEach((card, position) => {
      const link = card.querySelector("a");
      const match = link?.textContent.match(/Play song\s+(\d+)/i);
      const index = match ? Number(match[1]) - 1 : position;
      const name = label(animal(index));
      card.querySelector("strong")?.remove();
      const symbol = card.querySelector(".symbol");
      if (symbol && !symbol.querySelector("img")) { const image = document.createElement("img"); image.src = icon(index); image.alt = name; symbol.replaceChildren(image); }
      let title = card.querySelector(".animal-name");
      if (!title && link) { title = document.createElement("span"); title.className = "animal-name"; link.before(title); }
      if (title) title.textContent = name;
    });
  }

  let game = null, active = false, health = 24, seconds = 80, moleTimer, hideTimer, gameTimer;
  const setToolbarHidden = hidden => controls()?.classList.toggle("toolbar-hidden", hidden);
  const playing = () => { const p = player(); return Boolean(p && window.YT?.PlayerState && p.getPlayerState?.() === window.YT.PlayerState.PLAYING); };
  function createGame() {
    if (game) return game;
    const panel = document.createElement("section"); panel.id = "whack-a-track-game"; panel.hidden = true;
    panel.innerHTML = `<h2>Whack-a-Track</h2><p id="wat-status" aria-live="polite"></p><p>Time: <span id="wat-time">80</span>s &nbsp; Track health: <span id="wat-health">24</span></p><div id="wat-board" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:420px;margin:12px auto"></div><button id="wat-close" type="button">Close game</button>`;
    Object.assign(panel.style, {maxWidth:"min(92vw,620px)",margin:"8px auto 18px",padding:"10px 14px 14px",textAlign:"center",background:"#120b18",border:"2px solid #d4af37",borderRadius:"12px"});
    const board = $("#wat-board", panel);
    for (let i = 0; i < 6; i++) { const hole = document.createElement("button"); hole.type = "button"; hole.className = "wat-hole"; hole.textContent = "🕳️"; hole.dataset.active = "false"; hole.style.minHeight = "76px"; hole.onclick = () => { if (!active || hole.dataset.active !== "true") return; health--; $("#wat-health", panel).textContent = health; hideMoles(); if (health <= 0) finish(true); }; board.appendChild(hole); }
    $("#wat-close", panel).onclick = closeGame; ($(".player-dock") || $("main") || document.body).after(panel);
    return game = {panel, board, status: $("#wat-status", panel)};
  }
  function hideMoles() { game?.board.querySelectorAll(".wat-hole").forEach(h => { h.dataset.active = "false"; h.textContent = "🕳️"; }); }
  function spawnMole() { if (!active || !game) return; const hole = [...game.board.children][Math.floor(Math.random() * game.board.children.length)]; hideMoles(); hole.dataset.active = "true"; hole.textContent = "🐭"; clearTimeout(hideTimer); hideTimer = setTimeout(() => { if (hole.dataset.active !== "true") return; health--; $("#wat-health", game.panel).textContent = health; hole.dataset.active = "false"; hole.textContent = "🕳️"; if (health <= 0) finish(false); }, 1100); }
  function finish(won) { active = false; clearTimeout(moleTimer); clearTimeout(hideTimer); clearInterval(gameTimer); hideMoles(); if (game) game.status.textContent = won ? "💥 TRACK WHACKED!" : "The track escaped!"; setToolbarHidden(false); }
  function closeGame() { active = false; clearTimeout(moleTimer); clearTimeout(hideTimer); clearInterval(gameTimer); if (game) game.panel.hidden = true; setToolbarHidden(false); }
  function startGame(event) { event.preventDefault(); event.stopPropagation(); const current = createGame(); current.panel.hidden = false; setToolbarHidden(true); health = 24; seconds = 80; active = true; $("#wat-health", current.panel).textContent = health; $("#wat-time", current.panel).textContent = seconds; current.status.textContent = playing() ? "Whack the mice before they disappear!" : "Start a song first, then play."; if (!playing()) { active = false; setToolbarHidden(false); return; } spawnMole(); moleTimer = setInterval(spawnMole, 1400); gameTimer = setInterval(() => { seconds--; $("#wat-time", current.panel).textContent = seconds; if (seconds <= 0) finish(true); }, 1000); }

  function init() {
    addSiteStyles(); addHeaderAndFooter(); paintSongs(); syncStickyOffset();
    window.addEventListener("resize", syncStickyOffset);
    const list = $("#song-list"); if (list) new MutationObserver(paintSongs).observe(list, {childList:true, subtree:true});
    const cards = $("#cards"); if (cards) new MutationObserver(paintCards).observe(cards, {childList:true, subtree:true});
    $("#whack-track")?.addEventListener("click", startGame);
    setTimeout(syncStickyOffset, 0);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true}); else init();
})();
