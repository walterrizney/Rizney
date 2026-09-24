/* Animal playlist controls, CARDS menu, and Whack-a-Track. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const controls = () => $(".controls");
  const player = () => window.rizneyPlayer || window.player || null;
  const animals = [
    "aardvark", "alligator", "anglefish", "ant", "anteater", "armadillo", "baboon", "badger", "bald-eagle", "bass", "bat", "bear", "beaver", "bee", "blob-fish", "blue-heron", "boar", "buffalo", "bull-skull", "butterfly", "camel", "capuchin-monkey", "capybara", "catepillar", "chameleon", "cheetah (2)", "chihuahua", "chimpanzee", "chupacabra", "clam", "cow", "coyote", "crab", "cricket", "crocodile", "crow", "deer", "desert-fox", "dodo", "dolphin", "donkey", "dove", "duck", "eagle", "earthworm", "eel", "egg", "elephant", "elk", "falcon", "flamingo", "fly", "flying-fox", "fox", "frog", "gazelle", "gekko", "giraffe", "goat", "goldfish", "goose", "gopher", "gorilla", "grouse", "hamster", "hawk", "headless-horseman", "hedgehog", "hippo", "horse", "howler-monkey", "hydra", "hyena", "jellyfish", "kangaroo", "kiwi", "koala", "komodo-dragon", "labubu", "lemming", "lemur", "leopard", "like-an-antelope", "lion", "lizard", "llama", "lynx", "manatee", "mandrill", "mantis", "martian", "medusa", "meercat", "minx", "mole-rat", "mole", "moose", "mountain-lion", "mouse", "mt-goat (2)", "narwhal", "octopus (2)", "orangutan", "ostrich", "otter", "owl", "ox", "panda", "panther", "parrot", "peacock", "peican", "penguin", "pig", "pirate", "platypus", "polar-bear", "porcupine", "puma", "quokka", "rabbit", "raccoon", "ram", "rat", "raven", "red-panda", "rhino", "rooster", "saber-tooth-tiger", "saiga", "salmon", "sasquatch", "satan", "scorpion", "seagull", "seahorse", "seal (2)", "shark", "siamese-twin-turtles", "skull-hyena", "skull", "skunk", "sloth", "snail", "snake", "snapping-turtle", "spider", "squid", "squirrel", "stork", "swan", "t-rex", "tapir", "tazmanian-devil", "toad", "tortoise", "toucan", "turkey", "unicorn", "venus-fly-trap", "vulture", "walrus", "warthog", "weasel", "werewolf", "whale", "wildebeest", "wolf", "wombat", "woodpecker", "wooly-mammoth", "yak", "yeti", "zebra"
  ];
  const animal = (i) => animals[i % animals.length];
  const imageFor = (i) => `assets/animal-icons/${encodeURIComponent(animal(i))}.png`;
  const labelFor = (name) => name.replace(/\s*\(2\)$/, "").replace(/-/g, " ");

  function addStyles() {
    if $("#rizney-animal-styles")) return;
    const style = document.createElement("style");
    style.id = "rizney-animal-styles";
    style.textContent = `
      #song-list .song { grid-template-columns:38px minmax(0,1fr) 52px; }
      #song-list .song .play { grid-column:3; grid-row:1; align-self:stretch; justify-self:end; width:52px; height:52px; min-height:52px; aspect-ratio:1; padding:3px; display:grid; place-items:center; overflow:hidden; background:#000; border:1px solid var(--gold); border-radius:8px; }
      #song-list .song .play:hover { background:#090909; }
      #song-list .song .play img { display:block; width:100%; height:100%; object-fit:contain; pointer-events:none; }
      #song-list .song .song-animal { display:block; width:100%; padding:0; border:0; border-radius:0; color:var(--bright-gold); background:transparent; text-align:left; font:inherit; font-size:.95rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      #song-list .song .song-animal:hover { color:#fff; background:transparent; text-decoration:underline; }
      #song-list .song .song-animal small { pointer-events:none; text-decoration:none; }
      #cards .card { background:#000; }
      #cards .card .symbol { height:96px; display:grid; place-items:center; font-size:0; }
      #cards .card .symbol img { width:96px; height:96px; object-fit:contain; display:block; }
      #cards .card .animal-name { display:block; margin:0 0 8px; color:var(--bright-gold); font-family:sans-serif; font-size:.78rem; overflow-wrap:anywhere; text-transform:capitalize; }
      @media(max-width:500px){
        #song-list .song { grid-template-columns:30px minmax(0,1fr) 46px; }
        #song-list .song .play { width:46px; height:46px; min-height:46px; }
      }
    `;
    document.head.appendChild(style);
  }

  function paintSongs() {
    document.querySelectorAll("#song-list .song").forEach((row, index) => {
      const songIndex = Number(row.dataset.songIndex ?? index);
      const button = row.querySelector("button.play");
      if (!button) return;
      const name = labelFor(animal(songIndex));
      let title = row.querySelector(".song-title");
      if (title && title.tagName !== "BUTTON") {
        const animalButton = document.createElement("button");
        animalButton.type = "button";
        animalButton.className = "song-title song-animal";
        animalButton.setAttribute("aria-label", `Play ${name}`);
        animalButton.innerHTML = `${name}<small>Play this animal</small>`;
        animalButton.addEventListener("click", () => button.click());
        title.replaceWith(animalButton);
        title = animalButton;
      }
      if (title) {
        title.dataset.animalPainted = "true";
        title.title = `Play ${name}`;
      }
      if (button.dataset.animalPainted === "true") return;
      const image = document.createElement("img");
      image.src = imageFor(songIndex); image.alt = `Play ${name}`; image.title = name; image.loading = "lazy";
      button.replaceChildren(image); button.setAttribute("aria-label", image.alt); button.title = name; button.dataset.animalPainted = "true";
      row.dataset.songIndex = String(songIndex);
    });
  }

  function paintCards() {
    const cards = $("#cards");
    if (!cards) return;
    cards.querySelectorAll(".card").forEach((card, position) => {
      const link = card.querySelector("a");
      const match = link?.textContent.match(/Play song\s+(\d+)/i);
      const index = match ? Number(match[1]) - 1 : Number(card.dataset.songIndex ?? position);
      const name = labelFor(animal(index));
      card.querySelector("strong")?.remove();
      const symbol = card.querySelector(".symbol");
      if (symbol && !symbol.querySelector("img")) {
        const image = document.createElement("img");
        image.src = imageFor(index); image.alt = name; image.title = name; image.loading = "lazy";
        symbol.replaceChildren(image);
      }
      let label = card.querySelector(".animal-name");
      if (!label && link) { label = document.createElement("span"); label.className = "animal-name"; link.before(label); }
      if (label) label.textContent = name;
      card.dataset.songIndex = String(index);
    });
  }

  function bindVisuals() {
    addStyles(); paintSongs();
    const list = $("#song-list");
    if (list) new MutationObserver(paintSongs).observe(list, { childList:true, subtree:true });
    const cardsButton = $("#draw-cards");
    const reading = $("#reading");
    if (cardsButton && reading) {
      cardsButton.addEventListener("click", () => {
        const wasOpen = !reading.hidden;
        setTimeout(() => {
          if (wasOpen) reading.hidden = true;
          else { paintCards(); reading.hidden = false; reading.scrollIntoView({ behavior:"smooth", block:"start" }); }
        }, 0);
      }, true);
    }
  }

  let game = null, active = false, health = 24, seconds = 80, moleTimer, hideTimer, gameTimer;
  const setToolbarHidden = (hidden) => controls()?.classList.toggle("toolbar-hidden", hidden);
  const isPlaying = () => { const p = player(); return Boolean(p && window.YT?.PlayerState && p.getPlayerState?.() === window.YT.PlayerState.PLAYING); };

  function createGame() {
    if (game) return game;
    const panel = document.createElement("section");
    panel.id = "whack-a-track-game"; panel.hidden = true;
    panel.innerHTML = `<h2>Whack-a-Track</h2><p id="wat-status" aria-live="polite"></p><p>Time: <span id="wat-time">80</span>s &nbsp; Track health: <span id="wat-health">24</span></p><div id="wat-board" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px"></div><button id="wat-close" type="button">Close game</button>`;
    Object.assign(panel.style, { maxWidth:"min(92vw,620px)", margin:"8px auto 18px", padding:"10px 14px 14px", textAlign:"center", background:"#120b18", border:"2px solid #d4af37", borderRadius:"12px" });
    const board = $("#wat-board", panel);
    for (let i = 0; i < 6; i += 1) {
      const hole = document.createElement("button");
      hole.type = "button"; hole.className = "wat-hole"; hole.textContent = "🕳️"; hole.dataset.active = "false"; hole.style.minHeight = "76px";
      hole.addEventListener("click", () => { if (!active || hole.dataset.active !== "true") return; health -= 1; $("#wat-health", panel).textContent = health; hideMoles(); if (health <= 0) finish(true); });
      board.appendChild(hole);
    }
    $("#wat-close", panel).addEventListener("click", closeGame);
    ($(".player-dock") || $("main") || document.body).after(panel);
    return game = { panel, board, status: $("#wat-status", panel) };
  }
  function hideMoles() { game?.board.querySelectorAll(".wat-hole").forEach((h) => { h.dataset.active = "false"; h.textContent = "🕳️"; }); }
  function spawnMole() {
    if (!active || !game) return;
    const hole = [...game.board.children][Math.floor(Math.random() * game.board.children.length)];
    hideMoles(); hole.dataset.active = "true"; hole.textContent = "🐭"; clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { if (hole.dataset.active !== "true") return; health -= 1; $("#wat-health", game.panel).textContent = health; hole.dataset.active = "false"; hole.textContent = "🕳️"; if (health <= 0) finish(false); }, 1100);
  }
  function finish(won) { active = false; clearTimeout(moleTimer); clearTimeout(hideTimer); clearInterval(gameTimer); hideMoles(); if (game) game.status.textContent = won ? "💥 TRACK WHACKED!" : "The track escaped!"; setToolbarHidden(false); }
  function closeGame() { active = false; clearTimeout(moleTimer); clearTimeout(hideTimer); clearInterval(gameTimer); if (game) game.panel.hidden = true; setToolbarHidden(false); }
  function startGame(event) {
    event.preventDefault(); event.stopPropagation(); const currentGame = createGame(); currentGame.panel.hidden = false; setToolbarHidden(true); health = 24; seconds = 80; active = true;
    $("#wat-health", currentGame.panel).textContent = health; $("#wat-time", currentGame.panel).textContent = seconds; currentGame.status.textContent = isPlaying() ? "Whack the mice before they disappear!" : "Start a song first, then play.";
    if (!isPlaying()) { active = false; setToolbarHidden(false); return; }
    spawnMole(); moleTimer = setInterval(spawnMole, 1400); gameTimer = setInterval(() => { seconds -= 1; $("#wat-time", currentGame.panel).textContent = seconds; if (seconds <= 0) finish(true); }, 1000);
  }

  function init() { bindVisuals(); $("#whack-track")?.addEventListener("click", startGame); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once:true }); else init();
})();
