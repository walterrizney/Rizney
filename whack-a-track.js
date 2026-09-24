/* Optional visual enhancements and Whack-a-Track. */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const controls = () => $(".controls");
  const player = () => window.rizneyPlayer || window.player || null;
  const icons = [
    "aardvark", "alligator", "anglefish", "ant", "anteater", "armadillo", "baboon", "badger",
    "bald-eagle", "bass", "bat", "bear", "beaver", "bee", "blob-fish", "blue-heron", "boar",
    "buffalo", "butterfly", "camel", "capybara", "chameleon", "cheetah", "chihuahua", "chimpanzee",
    "chupacabra", "clam", "cow", "coyote", "crab", "cricket", "crocodile", "crow", "deer", "dolphin",
    "donkey", "dove", "duck", "eagle", "elephant", "falcon", "flamingo", "fox", "frog", "gazelle",
    "giraffe", "goat", "goldfish", "gorilla", "hamster", "hawk", "hedgehog", "hippo", "horse", "hyena",
    "jellyfish", "kangaroo", "kiwi", "koala", "lion", "lizard", "llama", "lynx", "manatee", "mole",
    "moose", "mouse", "narwhal", "octopus (2)", "otter", "owl", "panda", "panther", "parrot", "peacock",
    "penguin", "pig", "platypus", "polar-bear", "porcupine", "puma", "rabbit", "raccoon", "ram", "rat",
    "raven", "red-panda", "rhino", "rooster", "salmon", "scorpion", "seagull", "seahorse", "seal", "shark",
    "sloth", "snail", "snake", "spider", "squid", "squirrel", "swan", "t-rex", "tapir", "toucan", "unicorn",
    "vulture", "walrus", "warthog", "weasel", "whale", "wolf", "wombat", "woodpecker", "yak", "zebra"
  ];
  const animalName = (index) => icons[index % icons.length];
  const animalSrc = (index) => `assets/animal-icons/${encodeURIComponent(animalName(index))}.png`;

  function addCardStyles() {
    if ($("#rizney-card-styles")) return;
    const style = document.createElement("style");
    style.id = "rizney-card-styles";
    style.textContent = `
      #cards .card { background:#000; }
      #cards .card .symbol { height:96px; display:grid; place-items:center; font-size:0; }
      #cards .card .symbol img { width:96px; height:96px; object-fit:contain; display:block; }
      #cards .card .animal-name { display:block; margin:0 0 8px; color:var(--bright-gold); font-family:sans-serif; font-size:.78rem; overflow-wrap:anywhere; }
    `;
    document.head.appendChild(style);
  }

  // Decorate cards after the CARDS handler has finished creating them. This is
  // deliberately a one-shot pass; observing #cards while replacing images
  // causes an infinite MutationObserver loop and makes the toolbar appear frozen.
  function paintCards() {
    const cards = $("#cards");
    if (!cards) return;
    cards.querySelectorAll(".card").forEach((card, position) => {
      const link = card.querySelector("a");
      const match = link?.textContent.match(/Play song\s+(\d+)/i);
      const index = match ? Number(match[1]) - 1 : Number(card.dataset.songIndex ?? position);
      const name = animalName(index);
      const symbol = card.querySelector(".symbol");
      if (symbol && !symbol.querySelector("img")) {
        const image = document.createElement("img");
        image.src = animalSrc(index);
        image.alt = name;
        image.title = name;
        image.loading = "lazy";
        symbol.replaceChildren(image);
      }
      let label = card.querySelector(".animal-name");
      if (!label && link) {
        label = document.createElement("span");
        label.className = "animal-name";
        link.before(label);
      }
      if (label) label.textContent = name;
      card.dataset.songIndex = String(index);
    });
  }

  function bindCardVisuals() {
    addCardStyles();
    const button = $("#draw-cards");
    if (!button || button.dataset.cardVisualsBound === "true") return;
    button.dataset.cardVisualsBound = "true";
    button.addEventListener("click", () => {
      // Let index.html create the six cards first, then decorate them without
      // replacing its click handlers or blocking the other controls.
      window.setTimeout(paintCards, 0);
    });
  }

  let game = null;
  let active = false;
  let health = 24;
  let seconds = 80;
  let moleTimer;
  let hideTimer;
  let gameTimer;

  function setToolbarHidden(hidden) {
    controls()?.classList.toggle("toolbar-hidden", hidden);
  }

  function isPlaying() {
    const currentPlayer = player();
    return Boolean(
      currentPlayer && window.YT && window.YT.PlayerState &&
      typeof currentPlayer.getPlayerState === "function" &&
      currentPlayer.getPlayerState() === window.YT.PlayerState.PLAYING
    );
  }

  function createGame() {
    if (game) return game;
    const panel = document.createElement("section");
    panel.id = "whack-a-track-game";
    panel.hidden = true;
    panel.innerHTML = `
      <h2>Whack-a-Track</h2>
      <p id="wat-status" aria-live="polite"></p>
      <p>Time: <span id="wat-time">80</span>s &nbsp; Track health: <span id="wat-health">24</span></p>
      <div id="wat-board" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:420px;margin:12px auto"></div>
      <button id="wat-close" type="button">Close game</button>
    `;
    Object.assign(panel.style, { maxWidth: "min(92vw, 620px)", margin: "8px auto 18px", padding: "10px 14px 14px", textAlign: "center", background: "#120b18", border: "2px solid #d4af37", borderRadius: "12px" });
    const board = $("#wat-board", panel);
    for (let i = 0; i < 6; i += 1) {
      const hole = document.createElement("button");
      hole.type = "button"; hole.className = "wat-hole"; hole.textContent = "🕳️"; hole.dataset.active = "false"; hole.style.minHeight = "76px";
      hole.addEventListener("click", () => {
        if (!active || hole.dataset.active !== "true") return;
        health -= 1; $("#wat-health", panel).textContent = String(health); hideMoles();
        if (health <= 0) finish(true);
      });
      board.appendChild(hole);
    }
    $("#wat-close", panel).addEventListener("click", closeGame);
    ($(".player-dock") || $("main") || document.body).after(panel);
    game = { panel, board, status: $("#wat-status", panel) };
    return game;
  }

  function hideMoles() {
    if (!game) return;
    game.board.querySelectorAll(".wat-hole").forEach((hole) => { hole.dataset.active = "false"; hole.textContent = "🕳️"; });
  }

  function spawnMole() {
    if (!active || !game) return;
    const holes = [...game.board.children];
    const hole = holes[Math.floor(Math.random() * holes.length)];
    hideMoles(); hole.dataset.active = "true"; hole.textContent = "🐭";
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (hole.dataset.active !== "true") return;
      health -= 1; $("#wat-health", game.panel).textContent = String(health); hole.dataset.active = "false"; hole.textContent = "🕳️";
      if (health <= 0) finish(false);
    }, 460);
  }

  function finish(won) {
    active = false; clearTimeout(moleTimer); clearTimeout(hideTimer); clearInterval(gameTimer); hideMoles();
    if (game) game.status.textContent = won ? "💥 TRACK WHACKED!" : "The track survived. Try again.";
    setToolbarHidden(false);
  }

  function closeGame() {
    active = false; clearTimeout(moleTimer); clearTimeout(hideTimer); clearInterval(gameTimer);
    if (game) game.panel.hidden = true;
    setToolbarHidden(false);
  }

  function startGame(event) {
    event.preventDefault(); event.stopPropagation();
    const currentGame = createGame(); currentGame.panel.hidden = false; setToolbarHidden(true);
    health = 24; seconds = 80; active = true;
    $("#wat-health", currentGame.panel).textContent = String(health); $("#wat-time", currentGame.panel).textContent = String(seconds);
    currentGame.status.textContent = isPlaying() ? "Whack the mice before they damage the track!" : "Play a track first, then start again.";
    if (!isPlaying()) { active = false; setToolbarHidden(false); return; }
    spawnMole(); moleTimer = setInterval(spawnMole, 1400);
    gameTimer = setInterval(() => { seconds -= 1; $("#wat-time", currentGame.panel).textContent = String(seconds); if (seconds <= 0) finish(true); }, 1000);
  }

  function init() {
    bindCardVisuals();
    $("#whack-track")?.addEventListener("click", startGame);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
