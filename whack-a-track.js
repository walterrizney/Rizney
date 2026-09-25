/* Header and footer adjustments, animal visuals, and Whack-a-Track. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const controls = () => $(".controls");
  const player = () => window.rizneyPlayer || window.player || null;
  const animals = ["aardvark","alligator","anglefish","ant","anteater","armadillo","baboon","badger","bald-eagle","bass","bat","bear","beaver","bee","blob-fish","blue-heron","boar","buffalo","butterfly","camel","capybara","chameleon","cheetah","chihuahua","chimpanzee","chupacabra","clam","cow","coyote","crab","cricket","crocodile","crow","deer","dolphin","donkey","dove","duck","eagle","elephant","falcon","flamingo","fox","frog","gazelle","giraffe","goat","goldfish","gorilla","hamster","hawk","hedgehog","hippo","horse","hyena","jellyfish","kangaroo","kiwi","koala","lion","lizard","llama","lynx","manatee","mole","moose","mouse","narwhal","octopus (2)","otter","owl","panda","panther","parrot","peacock","penguin","pig","platypus","polar-bear","porcupine","puma","rabbit","raccoon","ram","rat","raven","red-panda","rhino","rooster","salmon","scorpion","seagull","seahorse","seal","shark","sloth","snail","snake","spider","squid","squirrel","swan","t-rex","tapir","toucan","unicorn","vulture","walrus","warthog","weasel","whale","wolf","wombat","woodpecker","yak","zebra"];
  const animal = i => animals[i % animals.length];
  const imageFor = i => `assets/animal-icons/${encodeURIComponent(animal(i))}.png`;
  const labelFor = name => name.replace(/\s*\(2\)$/, "").replace(/-/g, " ");

  function addHeaderAndFooter() {
    const top = $(".top-area");
    if (top) {
      top.querySelector("h1")?.remove();
      top.querySelector(".tagline")?.remove();
      let logo = top.querySelector(".rizney-logo");
      if (!logo) {
        logo = document.createElement("img");
        logo.className = "rizney-logo";
        logo.src = "assets/rizney.png";
        logo.alt = "Rizney";
        top.appendChild(logo);
      }
      let context = top.querySelector(".context-link");
      if (!context) {
        context = document.createElement("a");
        context.className = "context-link";
        context.href = "./context.html";
        context.textContent = "CONTEXT";
        top.appendChild(context);
      }
    }

    if (!$("#rizney-site-adjustments")) {
      const style = document.createElement("style");
      style.id = "rizney-site-adjustments";
      style.textContent = `
        .top-area{min-height:88px!important;padding:14px 14px 16px!important;text-align:center}
        .top-area .donate,.top-area .context-link{top:16px!important;z-index:2;border:1px solid var(--gold);border-radius:999px;padding:5px 9px;color:var(--bright-gold);background:#160c1a;font:inherit;font-size:.68rem;text-decoration:none}
        .top-area .donate{left:10px!important}.top-area .context-link{left:50%!important;transform:translateX(-50%)!important}
        .top-area .rizney-logo{position:absolute;top:6px;right:10px;width:76px;height:76px;object-fit:contain}
        .top-area .donate:hover,.top-area .context-link:hover{background:#55208a}
        .rizney-footer{margin:22px auto 0;padding:20px 0 34px;text-align:center;border-top:1px solid #3b1d50}
        .rizney-footer img{display:block;width:110px;height:auto;max-height:150px;object-fit:contain;margin:0 auto}
        #cards .card .symbol{height:96px;display:grid;place-items:center;font-size:0}
        #cards .card .symbol img{width:96px;height:96px;object-fit:contain;display:block}
        #cards .card .animal-name{display:block;margin:0 0 8px;color:var(--bright-gold);font-family:sans-serif;font-size:.78rem;text-transform:capitalize}
        #whack-a-track-game{max-width:min(92vw,620px);margin:8px auto 18px;padding:10px 14px 14px;text-align:center;background:#120b18;border:2px solid #d4af37;border-radius:12px}
        #whack-a-track-game[hidden]{display:none!important}
        .wat-board{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:420px;margin:12px auto}
        .wat-hole{min-height:76px;padding:8px;font-size:1.7rem;border:1px solid #d4af37;border-radius:8px;background:#000;color:#fff;cursor:pointer}
        @media(max-width:500px){.top-area{min-height:78px!important;padding:12px 8px 14px!important}.top-area .donate,.top-area .context-link{top:14px!important}.top-area .donate{left:8px!important}.top-area .context-link{left:50%!important}.top-area .rizney-logo{width:66px;height:66px;top:4px;right:8px}.rizney-footer img{width:94px;max-height:130px}.wat-hole{min-height:62px}}
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
      .controls{position:sticky;top:var(--rizney-player-height,0px);z-index:100}
      .controls.toolbar-hidden{visibility:hidden;opacity:0;pointer-events:none}
      #reading[hidden]{display:none!important}
      #song-list .song{grid-template-columns:38px minmax(0,1fr) 52px}
      #song-list .song .play{grid-column:3;grid-row:1;align-self:stretch;justify-self:end;width:52px;height:52px;min-height:52px;padding:3px;display:grid;place-items:center;overflow:hidden;background:transparent;border:0;box-shadow:none}
      #song-list .song .play img{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none}
      #cards .card{background:#000}
      #cards .card .symbol{height:96px;display:grid;place-items:center;font-size:0}
      #cards .card .symbol img{width:96px;height:96px;object-fit:contain;display:block}
      @media(max-width:500px){#song-list .song{grid-template-columns:30px minmax(0,1fr) 46px}#song-list .song .play{width:46px;height:46px;min-height:46px}}
    `;
    document.head.appendChild(style);
  }

  function syncPlayerHeight() {
    const dock = $(".player-dock");
    if (dock) {
      document.documentElement.style.setProperty("--rizney-player-height", `${dock.getBoundingClientRect().height}px`);
    }
  }

  function paintSongs() {
    document.querySelectorAll("#song-list .song").forEach((row, index) => {
      const button = row.querySelector("button.play");
      if (!button || button.dataset.animalPainted === "true") return;
      const img = document.createElement("img");
      img.src = imageFor(index);
      img.alt = labelFor(animal(index));
      img.loading = "lazy";
      button.innerHTML = "";
      button.appendChild(img);
      button.dataset.animalPainted = "true";
    });
  }

  function paintCards() {
    const cards = $("#cards");
    if (!cards) return;
    cards.querySelectorAll(".card").forEach((card, position) => {
      const symbol = card.querySelector(".symbol");
      const animalName = labelFor(animal(position));
      if (symbol && !symbol.querySelector("img")) {
        const img = document.createElement("img");
        img.src = imageFor(position);
        img.alt = animalName;
        img.loading = "lazy";
        symbol.innerHTML = "";
        symbol.appendChild(img);
      }
      if (!card.querySelector(".animal-name")) {
        const label = document.createElement("span");
        label.className = "animal-name";
        label.textContent = animalName;
        const link = card.querySelector("a");
        if (link) {
          link.before(label);
        } else {
          card.appendChild(label);
        }
      }
    });
  }

  function bindVisuals() {
    addHeaderAndFooter();
    addStyles();
    paintSongs();
    paintCards();
    syncPlayerHeight();
    window.addEventListener("resize", syncPlayerHeight);
    const list = $("#song-list");
    if (list) {
      new MutationObserver(() => {
        paintSongs();
        paintCards();
      }).observe(list, { childList: true, subtree: true });
    }
  }

  let game = null;
  let active = false;
  let health = 24;
  let seconds = 80;
  let moleTimer = null;
  let hideTimer = null;
  let gameTimer = null;

  const setToolbarHidden = hidden => controls()?.classList.toggle("toolbar-hidden", hidden);

  function createGame() {
    if (game) return game;

    const panel = document.createElement("section");
    panel.id = "whack-a-track-game";
    panel.hidden = true;
    panel.innerHTML = `
      <h2>Whack-a-Track</h2>
      <p id="wat-status"></p>
      <div class="wat-board"></div>
      <button id="wat-close" type="button">Close game</button>
    `;

    const board = panel.querySelector(".wat-board");
    const status = panel.querySelector("#wat-status");
    const close = panel.querySelector("#wat-close");

    for (let i = 0; i < 9; i++) {
      const hole = document.createElement("button");
      hole.type = "button";
      hole.className = "wat-hole";
      hole.textContent = "🕳️";
      hole.dataset.active = "false";
      hole.addEventListener("click", () => {
        if (!active || hole.dataset.active !== "true") return;
        hole.dataset.active = "false";
        hole.textContent = "✨";
        health = Math.min(24, health + 1);
        status.textContent = `Health: ${health}`;
      });
      board.appendChild(hole);
    }

    close?.addEventListener("click", () => {
      active = false;
      clearTimeout(moleTimer);
      clearTimeout(hideTimer);
      clearInterval(gameTimer);
      panel.hidden = true;
      setToolbarHidden(false);
    });

    ($("main") || document.body).appendChild(panel);
    game = { panel, board, status };
    return game;
  }

  function hideMoles() {
    game?.board.querySelectorAll(".wat-hole").forEach(h => {
      h.dataset.active = "false";
      h.textContent = "🕳️";
    });
  }

  function spawnMole() {
    if (!active || !game) return;

    hideMoles();
    const hole = [...game.board.children][Math.floor(Math.random() * game.board.children.length)];
    if (!hole) return;

    hole.dataset.active = "true";
    hole.textContent = "🐾";

    clearTimeout(moleTimer);
    moleTimer = setTimeout(() => {
      if (!active || hole.dataset.active !== "true") return;
      hole.dataset.active = "false";
      hole.textContent = "🕳️";
      health = Math.max(0, health - 1);
      game.status.textContent = `Health: ${health}`;
      if (health <= 0) finish(false);
    }, 1100);
  }

  function finish(won) {
    active = false;
    clearTimeout(moleTimer);
    clearTimeout(hideTimer);
    clearInterval(gameTimer);
    hideMoles();

    if (game) {
      game.status.textContent = won ? "💥 TRACK WHACKED!" : "The track escaped...";
    }

    setTimeout(() => {
      if (game) game.panel.hidden = true;
      setToolbarHidden(false);
    }, 900);
  }

  function startGame(event) {
    event.preventDefault();
    event.stopPropagation();

    const currentGame = createGame();
    game = currentGame;
    currentGame.panel.hidden = false;
    setToolbarHidden(true);

    health = 24;
    seconds = 80;
    active = true;

    currentGame.status.textContent = `Health: ${health}`;
    clearInterval(gameTimer);
    gameTimer = setInterval(() => {
      if (--seconds <= 0) {
        finish(true);
        return;
      }
      spawnMole();
    }, 1000);

    spawnMole();
  }

  function init() {
    bindVisuals();
    $("#whack-track")?.addEventListener("click", startGame);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
