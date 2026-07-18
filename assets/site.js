/* ============================================================
   Duelio — duelioapp.com
   Catalog recreation, tips key, gameplay phone chat, honeycomb
   backdrop. Vanilla JS, no dependencies.
   ============================================================ */
(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const V = "/assets/videos/";
  const vid = (base) => V + base + ".mp4?v=3";

  /* ---------------- reusable config fragments ---------------- */
  const LANGS = { label: "Language", type: "seg", options: ["English", "Spanish", "French", "Italian"] };
  const wordConfig = (sizes) => [
    { label: "Board Size", type: "seg", options: sizes },
    { label: "Generation Quality", type: "seg", options: ["High", "Random", "Low"] },
    LANGS,
    { label: "Board Source", type: "seg", options: ["Random", "Set Seed"] },
  ];
  const jumpIn = { blurb: "No setup for this one — jump straight in." };

  /* ---------------- the real Duelio catalog ---------------- */
  // cat tint keys map to --cat-* CSS vars. live = server-backed realtime game.
  // pass = Pass & Play offered (Strategy + Sports only). modes[] = forced
  // mode-select step (Pool/Darts) with per-mode preview clips.
  const SECTIONS = [
    {
      title: "Strategy", tint: "strategy",
      games: [
        { n: "Tic Tac Toe", k: "tictactoe", players: "2", pass: true, config: jumpIn },
        { n: "Dots & Boxes", k: "dotsandboxes", players: "2", pass: true, config: jumpIn },
        { n: "Chess", k: "chess", players: "2", pass: true, config: [
          { label: "Variant", type: "modes", options: [
            { label: "Classic", desc: "Classic chess rules." },
            { label: "Fog of War", desc: "You only see your own pieces and the squares they can reach." },
            { label: "Setup", desc: "Place your own back rank, then play it out." },
            { label: "Horde", desc: "A wall of white pawns takes on the full black army." },
          ]},
          { label: "Clock", type: "toggle", tt: "Timed game", td: "Off = untimed. On enables a chess clock." },
          { label: "Time Control", type: "seg", def: 2, options: ["Bullet", "Blitz", "Rapid", "No Clock"] },
        ]},
        { n: "Checkers", k: "checkers", players: "2", pass: true, config: [
          { label: "Board Size", type: "seg", options: ["8 × 8", "10 × 10", "Custom"] },
          { label: "Your Color", type: "seg", options: ["Red", "Black"] },
          { label: "Mandatory Capture", type: "toggle", tt: "Must capture", td: "Forces a capture when one is available.", on: true },
          { label: "Time Control", type: "seg", def: 2, options: ["Bullet", "Blitz", "Rapid", "No Clock"] },
        ]},
        { n: "Word Tiles", k: "scrabble", players: "2–4", pass: true, config: [
          { label: "Board Size", type: "seg", options: ["11 × 11", "13 × 13"] },
          { label: "Rack", type: "seg", options: ["7 Tiles", "10 Tiles"] },
          LANGS,
          { label: "Max Players", type: "seg", options: ["2", "3", "4"] },
        ]},
        { n: "Backgammon", k: "backgammon", players: "2", pass: true, config: jumpIn },
        { n: "Four in a Row", k: "connect4", players: "2", pass: true, config: [
          { label: "Mode", type: "modes", options: [
            { label: "Classic", desc: "Drop discs, connect four in a row to win." },
            { label: "Sum Rush", desc: "Every disc carries a number — race to a target sum." },
            { label: "Cyclone Spin", desc: "Spin the whole grid and let gravity rearrange it." },
          ]},
        ]},
      ],
      builders: [],
    },
    {
      title: "Sports", tint: "sports",
      games: [
        { n: "Bowling", k: "bowling", players: "2–4", pass: true, config: [
          { label: "Mode", type: "modes", options: [
            { label: "10 Pin", desc: "Standard ten-pin bowling with official scoring." },
            { label: "21 Pin", desc: "A taller rack — bowl for 21." },
          ]},
        ]},
        { n: "Ring Toss", k: "ringtoss", players: "2–4", pass: true, config: [
          { label: "Mode", type: "modes", options: [
            { label: "Classic", desc: "Land rings on the bottles across a set number of throws." },
            { label: "Race", desc: "Both players toss at once — highest score when the clock runs out." },
          ]},
        ]},
        // Pool & Darts: forced mode-select step (real per-mode preview clips)
        { n: "Pool", k: "8ballreboot", players: "2", pass: true,
          modes: [
            { id: "classic", label: "8 Ball", desc: "Standard 8 ball rules — pot your group, then sink the 8 to win.", video: "PoolModePreview-classic" },
            { id: "nineBall", label: "9 Ball", desc: "Balls 1–9 in a diamond. Always hit the lowest first; pot the 9 to win.", video: "PoolModePreview-nineBall" },
            { id: "powers", label: "Powers", desc: "8 ball where every turn grants one random power.", video: "PoolModePreview-powers" },
            { id: "snooker", label: "Snooker", desc: "Snooker balls and spacing on the full snooker table.", video: "PoolModePreview-snooker" },
            { id: "runout", label: "Runout", desc: "Every object ball matches — clear the table; fastest time wins, fewest shots breaks ties.", video: "PoolModePreview-runoutChallenge" },
          ],
          config: [{ label: "Hard Mode", type: "toggle", tt: "Hard Mode", td: "Removes the aim guide lines on any game mode." }] },
        { n: "Darts", k: "darts", players: "2–4", pass: true,
          modes: [
            { id: "classic", label: "Classic", desc: "Race your score down from 301 to exactly zero.", video: "DartsModePreview-classic" },
            { id: "championship", label: "Championship", desc: "A 501 countdown on the championship stage.", pro: true, video: "DartsModePreview-championship" },
            { id: "aroundWorld", label: "Around the World", desc: "Hit the numbers in order around the board — first to finish the lap wins.", video: "DartsModePreview-aroundWorld" },
            { id: "powers", label: "Powers", desc: "A 901 countdown with a random power on every throw.", video: "DartsModePreview-powers" },
            { id: "combo", label: "Combo", desc: "A 501 with the combo power always on, chaining hits into bonus points.", video: "DartsModePreview-combo" },
          ],
          config: null },
      ],
      builders: [{ n: "Table Builder", k: "tablebuilder", sub: "POOL", players: "2" }],
    },
    {
      title: "Word Games", tint: "words",
      games: [
        { n: "Word Hunt", k: "wordhunt", players: "2–8", pass: true, config: wordConfig(["3 × 3", "4 × 4", "5 × 5", "6 × 6"]) },
        { n: "Word Hunt Plus", k: "wordhuntplus", players: "2–8", pass: true, config: wordConfig(["4 × 4", "5 × 5", "6 × 6"]) },
        { n: "Anagrams", k: "anagrams", players: "2–8", pass: true, config: [{ label: "Word Length", type: "seg", options: ["5", "6", "7"] }, LANGS, { label: "Board Source", type: "seg", options: ["Random", "Set Seed"] }] },
        { n: "Word Shift", k: "wordshift", players: "2–8", pass: true, config: wordConfig(["4 × 4", "5 × 5", "6 × 6"]) },
      ],
      builders: [{ n: "Board Builder", k: "boardbuilder", sub: "WORDS", players: "2–8" }],
    },
    {
      title: "Multiplayer", tint: "multi",
      games: [
        { n: "Word Bomb", k: "bombparty", live: true, players: "2–8", config: [{ label: "Timer", type: "seg", options: ["Fast", "Normal", "Relaxed"] }, LANGS] },
        { n: "Trivia Rush", k: "trivia", live: true, players: "2–8", config: [
          { label: "Players", type: "seg", options: ["2", "3", "4", "5", "6"] },
          { label: "Seconds / Question", type: "seg", def: 2, options: ["10s", "15s", "20s"] },
          { label: "Hard Mode", type: "toggle", tt: "Hard Mode", td: "5 categories, 15s timer, no second chance." },
          { label: "Second Chance", type: "toggle", tt: "2nd chance", td: "A shot at redemption on a miss.", on: true },
        ]},
        { n: "Insider", k: "insider", live: true, players: "3–8", config: jumpIn },
        { n: "Landmark", k: "maps", live: true, players: "2–8", config: [{ label: "Difficulty", type: "seg", options: ["Easy", "Normal", "Hard"] }] },
        { n: "Spelling Bee", k: "spellingbee", live: true, players: "2–8", config: [LANGS] },
        { n: "2 Truths & 1 Lie", k: "twotruths", live: true, players: "2–8", config: jumpIn },
        { n: "Draw", k: "drawing", live: true, players: "2–8", config: [
          { label: "Mode", type: "modes", options: [
            { label: "Classic", desc: "Write a secret prompt, then draw another player's." },
            { label: "Telephone", desc: "Write a prompt, draw it, then describe the next — watch it morph." },
            { label: "Corpse Collage", desc: "Draw a body part; only see a small hint from the previous one." },
            { label: "Add-On Art", desc: "Build on the previous drawing." },
            { label: "Guessing Game", desc: "One player draws live; everyone else guesses for points." },
          ]},
          { label: "Fast Mode", type: "toggle", tt: "Fast Mode", td: "Quick-fire 25s rounds." },
        ]},
        { n: "Party Games", k: "partygames", live: true, players: "2–8", soon: true },
      ],
      builders: [],
    },
    {
      title: "Card Games", tint: "cards",
      games: [
        { n: "Poker", k: "poker", live: true, players: "2–7", config: jumpIn },
        { n: "Blackjack", k: "blackjack", live: true, players: "2–7", config: jumpIn },
        { n: "Go Fish", k: "gofish", live: true, players: "2–6", config: jumpIn },
        { n: "Spades", k: "spades", live: true, players: "4", soon: true, noVideo: true },
      ],
      builders: [],
    },
    {
      title: "Racing", tint: "racing",
      games: [
        { n: "Road Rush", k: "roadracer", players: "2–4", pass: true, config: jumpIn },
        { n: "Drift", k: "toprace", players: "2–4", pass: true, config: jumpIn },
      ],
      builders: [],
    },
  ];

  const ALL_GAMES = SECTIONS.flatMap(s => s.games);

  /* ---------------- tile videos: decoder-friendly, every visible tile plays ----------------
     Bytes are fetched as blobs (fetch is never media-throttled), but a
     <video> only HOLDS a decoder while it is near the viewport — 30 parallel
     load() calls exhaust the browser's media decoders and the losers die
     with SRC_NOT_SUPPORTED (this is why most tiles showed nothing). So,
     exactly like the app's catalog: attach on approach, tear down when far
     offscreen, and kick any player that lost the decoder race until it runs.
     The fetch happens on approach too, NOT at boot: these are the app's
     full-length clips (up to 17s, ~43MB across the catalog), so warming them
     all up front would download the whole set before a visitor scrolls. */
  const vidCache = new Map();
  const videoURL = (base) => {
    if (!vidCache.has(base)) {
      vidCache.set(base, fetch(vid(base)).then(r => { if (!r.ok) throw new Error(r.status); return r.blob(); }).then(b => URL.createObjectURL(b)));
    }
    return vidCache.get(base);
  };

  function attach(v) {
    videoURL(v.dataset.base).then(u => {
      if (!v.dataset.on) return;         // scrolled away while fetching
      if (v.src !== u) { v.src = u; v.load(); }
      v.play?.().catch(() => {});
    });
  }
  function detach(v) {
    v.pause?.();
    if (v.src) { v.removeAttribute("src"); v.load(); } // releases the decoder
    v.classList.remove("ready");
  }

  const videoIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target;
      if (e.isIntersecting) { v.dataset.on = "1"; attach(v); }
      else { delete v.dataset.on; detach(v); }
    }
  }, { rootMargin: "300px 0px" });

  function makeTileVideo(base) {
    const wrap = document.createElement("div");
    wrap.className = "tile-face";
    const v = document.createElement("video");
    v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
    v.dataset.base = base;
    const markReady = () => { v.classList.add("ready"); v.play?.().catch(() => {}); };
    v.addEventListener("loadeddata", markReady);
    v.addEventListener("canplay", markReady);
    v.addEventListener("playing", () => v.classList.add("ready"));
    wrap.appendChild(v);
    const gloss = document.createElement("div"); gloss.className = "gloss"; wrap.appendChild(gloss);
    videoIO.observe(v);
    return wrap;
  }

  /* ---------------- Pool & Darts: the app's mode-cycling tile ----------------
     These two are the only catalog games with a forced mode-select step, so in
     the app their tile plays every mode's clip back to back and the caption
     under the square becomes the current MODE name instead of the game name,
     letter-faded on each change (DuelioMessagesTileVideoView + LetterFadeLabel).
     Same here: an ordered playlist that advances when a clip ENDS — never on a
     timer, so the caption can never drift out of sync with the picture — with a
     standby <video> holding the next clip so the handoff is a cut rather than a
     flash of empty tile. Only these two tiles carry a second decoder, and only
     while they are near the viewport. */
  const modeTiles = [];

  function makeModeTile(modes, label) {
    const wrap = document.createElement("div");
    wrap.className = "tile-face";
    let cur, next, idx = 0, on = false;

    const clear = (v) => {
      v.pause?.();
      if (v.src) { v.removeAttribute("src"); v.load(); } // releases the decoder
      v.classList.remove("ready");
    };
    const load = (v, i, autoplay) => videoURL(modes[i].video).then(u => {
      if (!on) return;                                  // scrolled away mid-fetch
      if (v.src !== u) { v.src = u; v.load(); }
      if (autoplay) v.play?.().catch(() => {});
    }).catch(() => {});

    const advance = () => {
      const spent = cur;
      idx = (idx + 1) % modes.length;
      cur = next; next = spent;                         // standby takes the stage
      spent.classList.remove("ready");
      cur.classList.add("ready");
      cur.play?.().catch(() => {});
      label.set(modes[idx].label);
      clear(next);                                      // recycle as the next standby
      load(next, (idx + 1) % modes.length, false);
    };

    const mk = () => {
      const v = document.createElement("video");
      v.className = "pv";                               // excluded from the generic kicker
      v.muted = true; v.playsInline = true; v.preload = "auto";
      v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
      v.addEventListener("ended", () => { if (v === cur) advance(); });
      v.addEventListener("playing", () => { if (v === cur) v.classList.add("ready"); });
      wrap.appendChild(v);
      return v;
    };
    cur = mk(); next = mk();
    wrap.appendChild(Object.assign(document.createElement("div"), { className: "gloss" }));
    label.init(modes[0].label);
    // nothing is fetched until the tile is approached; from there the standby
    // pulls one clip ahead, so a mode tile never costs more than two clips

    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (on) return;
        on = true;
        load(cur, idx, true);
        load(next, (idx + 1) % modes.length, false);
      } else { on = false; clear(cur); clear(next); }
    }, { rootMargin: "300px 0px" }).observe(wrap);

    // a clip that will not decode must not park the tile on one mode forever
    modeTiles.push(() => {
      if (!on) return;
      if (cur.error) advance();
      else if (cur.readyState >= 2 && cur.paused) cur.play?.().catch(() => {});
      else if (!cur.src) load(cur, idx, true);
    });
    return wrap;
  }

  /* the app's LetterFadeLabel: the whole caption fades out letter by letter,
     then the new mode name fades back in on the same left-to-right stagger */
  function letterLabel(el) {
    let gen = 0;
    // per-letter layout rules out a scale-to-fit, so the size steps down on the
    // app's own length thresholds instead
    const size = (text) => {
      el.classList.remove("m-sm", "m-xs");
      if (text.length > 12) el.classList.add("m-xs");
      else if (text.length > 8) el.classList.add("m-sm");
    };
    const plain = (text) => { size(text); el.textContent = text; };
    const render = (text) => {
      size(text);
      el.textContent = "";
      [...text].forEach((ch, i) => {
        const s = document.createElement("span");
        s.className = "lt";
        s.textContent = ch === " " ? " " : ch;
        s.style.transitionDelay = (i * 0.03).toFixed(2) + "s";
        el.appendChild(s);
      });
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("shown")));
    };
    return {
      init: (text) => reduce ? plain(text) : render(text),
      set(text) {
        if (reduce) { plain(text); return; }
        const g = ++gen;
        const out = Math.min(200 + Math.max(el.childElementCount - 1, 0) * 30, 750) + 50;
        el.classList.remove("shown");
        setTimeout(() => { if (g === gen) render(text); }, out);
      },
    };
  }

  // the kicker: rebuild any near-viewport player that stalled or lost the
  // decoder race (error) — mirrors the app's kick-until-the-loop-runs logic
  setInterval(() => {
    if (document.hidden) return;
    document.querySelectorAll(".tile-face video:not(.pv)").forEach(v => {
      if (!v.dataset.on) return;
      if (v.error) { detach(v); v.dataset.on = "1"; attach(v); }
      else if (v.readyState >= 2 && v.paused) v.play?.().catch(() => {});
      else if (v.readyState === 0 && !v.src) attach(v);
    });
    modeTiles.forEach(tick => tick());
  }, 2500);

  /* ---------------- render catalog (always grouped by category) ---------------- */
  const scroll = document.getElementById("catalog-scroll");
  function renderCatalog() {
    if (!scroll) return;
    scroll.innerHTML = "";
    SECTIONS.forEach(s => {
      const sec = document.createElement("div"); sec.className = "cat-section reveal";
      const count = s.games.length + s.builders.length;
      sec.innerHTML = `<div class="cat-header"><span class="t">${s.title}</span><span class="rule"></span><span class="count">${count}</span></div>`;
      const grid = document.createElement("div"); grid.className = "tile-grid";
      s.games.concat(s.builders.map(b => ({ ...b, builder: true }))).forEach(g => {
        const tile = document.createElement("button");
        tile.className = "tile" + (g.builder ? " builder" : "") + (g.soon ? " soon" : "");
        const name = document.createElement("div");
        name.className = "tile-name" + (g.builder ? " gold" : "");
        if (g.modes) {
          // Pool / Darts: the square cycles the modes and the caption rides it,
          // exactly as in the app — the game's own name is not shown
          name.classList.add("mode");
          tile.appendChild(makeModeTile(g.modes, letterLabel(name)));
        } else if (g.noVideo) {
          // no preview clip exists (e.g. a not-yet-built game) — bare graphite face
          const face = document.createElement("div"); face.className = "tile-face";
          face.appendChild(Object.assign(document.createElement("div"), { className: "gloss" }));
          tile.appendChild(face);
          name.textContent = g.n;
        } else {
          tile.appendChild(makeTileVideo(g.tileVideo || ("MessageTilePreview-" + g.k)));
          name.textContent = g.n;
        }
        if (g.live) tile.querySelector(".tile-face").insertAdjacentHTML("beforeend", `<span class="live-pip">LIVE</span>`);
        if (g.builder) tile.querySelector(".tile-face").insertAdjacentHTML("beforeend", `<img class="pro-seal" src="/assets/img/pro-icon.png" alt="Pro" width="160" height="109">`);
        if (g.soon) tile.querySelector(".tile-face").insertAdjacentHTML("beforeend", `<div class="soon-badge"><span>Coming Soon</span></div>`);
        tile.appendChild(name);
        grid.appendChild(tile);
      });
      sec.appendChild(grid);
      scroll.appendChild(sec);
    });
    revealObserve(scroll.querySelectorAll(".reveal"));
  }

  /* ---------------- tip key: the app's rotating gameplay-tip ticker ----------------
     The same tips the catalog footer cycles in the app, on the same 3D
     pressable key: game name over the hint, auto-advancing every 6s, and a
     tap presses the face down and deals a fresh tip (never the same twice). */
  const TIPS = [
    ["Road Rush", "If you are still air-born during the cooldown of the supernova, you keep your speed"],
    ["Road Rush", "Level up your powers for a bigger speed boost"],
    ["Road Rush", "Riding the ideal line powers you up, not just for show"],
    ["Chess", "Stuck on a move? Tap the hint for a suggestion"],
    ["Word Bomb", "Use a hint when you cannot find a word"],
    ["Word Bomb", "Go for short safe words over risky long ones"],
    ["Word Games", "Every valid word needs at least 3 letters"],
    ["Word Games", "The longest word in the dictionary runs 45 letters"],
    ["Spelling", "Repeat the word when you are stuck"],
    ["Spelling", "Ask for the origin when you are stuck"],
    ["Spelling", "Ask for the definition when you are stuck"],
    ["Landmark", "Voting early cuts the timer down fast"],
    ["Landmark", "Your vote counts as long as your pin is on the map"],
    ["Landmark", "A rough pin in the right region beats a precise pin in the wrong one"],
    ["Insider", "The letter count is a free clue, so count before you guess"],
    ["Snooker", "The aim guide reads your spin, so set your English first"],
    ["Bowling", "A little spin curves into the pocket for more strikes"],
    ["Bowling", "If you miss enough, gutters may help"],
    ["Blackjack", "Standing early on a solid hand beats chasing a bust"],
    ["Go Fish", "Track what was asked, a card asked twice is likely gone"],
    ["Telephone", "Simpler drawings survive the chain better"],
    ["Corpse Collage", "Draw your part to connect at the seams, not the center"],
    ["Add On Art", "Build on what is there instead of starting fresh"],
    ["Ring Toss", "Aim for a flat arc that drops onto the neck"],
    ["Characters", "Level up your tier to unlock new characters for free"],
    ["Tiers", "Reaching a new tier lets you pick a few unlocks"],
    ["Badges", "Equipping a rarer badge plays a bigger unlock flourish"],
    ["Pro", "Pro turns your player name gold in matches"],
    ["Pro", "Pro includes exclusive characters and game cosmetics"],
    ["Stats", "Your stats track across games and feed achievements"],
    ["Ready Rooms", "Set the vibe on the jukebox before the match starts"],
    ["Shop", "The shop is where all cosmetics and extra games live"],
    ["Shop", "Car bundles unlock the same rides in Road Rush and Drift"],
  ];
  const tipKey = document.getElementById("tip-key");
  if (tipKey) {
    const tg = document.getElementById("tip-game"), th = document.getElementById("tip-hint");
    const face = tipKey.querySelector(".tip-face");
    let tipIdx = -1, tipTimer = null;
    const dealTip = () => {
      let i; do { i = Math.floor(Math.random() * TIPS.length); } while (i === tipIdx);
      tipIdx = i;
      face.classList.add("swap");
      setTimeout(() => {
        tg.textContent = TIPS[i][0];
        th.textContent = TIPS[i][1];
        face.classList.remove("swap");
      }, 180);
    };
    const armTip = () => { clearInterval(tipTimer); tipTimer = setInterval(dealTip, 6000); };
    tipKey.addEventListener("click", () => { dealTip(); armTip(); });
    tg.textContent = TIPS[0][0]; th.textContent = TIPS[0][1]; tipIdx = 0;
    if (!reduce) armTip();
  }

  /* ---------------- hero phone: iMessage thread with real invite bubbles ----------------
     The invite bubble carries a REAL image of the game — the composed cover
     art where one exists, an actual gameplay frame where the app renders the
     bubble in code — framed like an MSMessage with the app icon + caption.
     Every cycle picks a fresh game and a fresh exchange; clicking the phone
     skips straight to the next matchup. */
  const phoneScreen = document.getElementById("phone-screen");
  if (phoneScreen) {
    // {g} in a line is replaced with the game's name
    const BANTER = [
      { open: "quick game of {g}?",           reply: "always",                   close: "loading up" },
      { open: "loser buys lunch",             reply: "hope you're hungry",       close: "for victory, sure" },
      { open: "winner picks the movie",       reply: "fine. but no horror",      close: "we'll see" },
      { open: "best of three?",               reply: "best of one. i'm busy",    close: "scared. noted" },
      { open: "i've been practicing",         reply: "practicing losing?",       close: "rude. get in here" },
      { open: "you. me. {g}. now",            reply: "say less",                 close: "it begins" },
      { open: "settle it in {g}?",            reply: "gladly",                   close: "no take backs" },
    ];
    const GAMES = [
      { cover: "bowling.webp",  game: "Bowling",   lines: [
        { open: "loser buys coffee",               reply: "you're on",                close: "oh it's ON" },
        { open: "strike incoming. watch",          reply: "your gutter says otherwise", close: "RUDE" },
      ]},
      { cover: "darts.webp",    game: "Darts",     lines: [
        { open: "rematch. right now",              reply: "you sure about that",      close: "bring it" },
        { open: "bullseye first try. calling it",  reply: "sure you are",             close: "watch me" },
      ]},
      { cover: "ringtoss.webp", game: "Ring Toss", lines: [
        { open: "winner picks dinner",             reply: "easy money",               close: "we'll see" },
        { open: "ring toss. best arc wins",        reply: "physics is on my side",    close: "physics can't save you" },
      ]},
      { cover: "roadrush.webp", game: "Road Rush", lines: [
        { open: "race me. right now",              reply: "don't cry when you lose",  close: "GO GO GO" },
        { open: "my lap record still stands",      reply: "not for long",             close: "eat my dust" },
      ]},
      { cover: "cards.webp", game: "Poker",     lines: [
        { open: "poker night. bring your chips",   reply: "dealing you in",           close: "all in first hand. watch" },
        { open: "i can read your bluffs from here", reply: "no you can't",            close: "we'll see about that" },
      ]},
      { cover: "cards.webp", game: "Blackjack", lines: [
        { open: "hit me. i dare you",              reply: "dealer says bust",         close: "twenty one. count it" },
        { open: "blackjack. quick hands",          reply: "i always stand on 17",     close: "coward" },
      ]},
      { cover: "landmark.webp", game: "Landmark",  lines: [
        { open: "bet you can't find this place",   reply: "watch me",                 close: "no maps allowed!!" },
        { open: "geography duel. loser admits it", reply: "i never lose this",        close: "prove it" },
      ]},
      { cover: "cards.webp", game: "Go Fish",   lines: [
        { open: "go fish. childhood rules",        reply: "got any threes?",          close: "GO FISH" },
        { open: "one easy game before dinner",     reply: "nothing about me is easy", close: "it's go fish" },
      ]},
    ];

    phoneScreen.innerHTML = `
      <div class="thread-head">
        <div class="avatar">A</div>
        <div class="thread-name">Ayla<br><small>iMessage</small></div>
      </div>
      <div class="thread" id="thread"></div>
      <div class="thread-field"><span>iMessage</span><em>↑</em></div>`;
    const thread = document.getElementById("thread");
    let lastGame = -1, chatTimers = [];

    const pickChat = () => {
      let i; do { i = Math.floor(Math.random() * GAMES.length); } while (i === lastGame);
      lastGame = i;
      const g = GAMES[i];
      const pool = g.lines.concat(BANTER);
      const c = pool[Math.floor(Math.random() * pool.length)];
      const fill = (s) => s.replace("{g}", g.game);
      return { cover: g.cover, game: g.game, caption: `Let's play ${g.game}!`, open: fill(c.open), reply: fill(c.reply), close: fill(c.close) };
    };

    const buildChat = (c) => {
      thread.innerHTML = `
        <div class="bubble them msg" data-step="1">${c.open}</div>
        <div class="bubble me typing" data-step="2"><i></i><i></i><i></i></div>
        <div class="bubble me msg" data-step="3">${c.reply}</div>
        <div class="bubble me invite" data-step="4">
          <img class="inv-img" src="/assets/img/covers/${c.cover}" alt="${c.game} invite">
          <div class="inv-bar"><img src="/assets/img/duelio-logo.png" alt=""><div><b>Duelio</b><span>${c.caption}</span></div></div>
        </div>
        <div class="bubble them msg" data-step="5">${c.close}</div>`;
    };

    const playChat = () => {
      chatTimers.forEach(clearTimeout); chatTimers = [];
      buildChat(pickChat());
      const typing = thread.querySelector(".typing");
      // [step, delay-before-next]
      const SCRIPT = [[1, 700], [2, 1200], [3, 1300], [4, 1500], [5, 1400]];
      let t = 400;
      for (const [step, dur] of SCRIPT) {
        const el = thread.querySelector(`[data-step="${step}"]`);
        chatTimers.push(setTimeout(() => {
          if (step === 3) typing.classList.add("done"); // dots resolve into the reply
          el.classList.add("on");
        }, t));
        t += dur;
      }
      chatTimers.push(setTimeout(playChat, t + 3400)); // linger, then a new duel
    };

    if (reduce) {
      buildChat(pickChat());
      thread.querySelectorAll(".bubble").forEach(b => b.classList.add("on"));
      thread.querySelector(".typing").classList.add("done");
    } else {
      playChat();
      // tap the phone to skip to the next matchup
      phoneScreen.closest(".hero-phone")?.addEventListener("click", playChat);
      document.addEventListener("visibilitychange", () => {
        chatTimers.forEach(clearTimeout);
        if (!document.hidden) playChat();
      });
    }
  }

  /* ---------------- reveals + counters + nav ---------------- */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  const inView = (n) => { const r = n.getBoundingClientRect(); return r.top < innerHeight * 0.98 && r.bottom > 0; };
  function revealObserve(nodes) {
    nodes.forEach(n => {
      // reveal anything already on screen on the very next frame (never wait on
      // IO's async first callback for above-the-fold content), observe the rest
      if (inView(n)) requestAnimationFrame(() => n.classList.add("in"));
      else io.observe(n);
    });
  }
  revealObserve(document.querySelectorAll(".reveal"));
  // last-resort net: if anything scrolled into view is still hidden, show it
  const sweep = () => document.querySelectorAll(".reveal:not(.in)").forEach(n => { if (inView(n)) n.classList.add("in"); });
  addEventListener("load", () => setTimeout(sweep, 400));

  const cio = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue; cio.unobserve(e.target);
      const el = e.target, target = +el.dataset.count, t0 = performance.now();
      if (reduce) { el.textContent = target; continue; }
      const tick = (t) => { const p = Math.min((t - t0) / 900, 1); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.6 });
  document.querySelectorAll(".count").forEach(el => cio.observe(el));

  const nav = document.getElementById("nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", scrollY > 24);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------------- copy email ---------------- */
  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        const prev = btn.textContent; btn.textContent = "Copied ✓"; btn.classList.add("copied");
        setTimeout(() => { btn.textContent = prev; btn.classList.remove("copied"); }, 1600);
      } catch { location.href = "mailto:" + btn.dataset.copy; }
    });
  });

  const yr = document.getElementById("year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------------- tech backdrop: a clean glowing honeycomb ----------------
     One properly-tiled pointy-top hex lattice (horizontal step √3·R, vertical
     step 1.5·R, odd rows offset by √3·R/2 — shared edges line up exactly),
     stroked in steel with per-cell breathing, a slow travelling light sweep,
     and two soft glow fields drifting behind it. Nothing else. */
  function initTech(canvas, opts) {
    if (!canvas || reduce) return;
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(devicePixelRatio || 1, 1.75);
    let W = 0, H = 0, running = true, t0 = performance.now();
    const R = opts.r || 26;
    const colStep = R * 1.7320508, rowStep = R * 1.5;
    const hash = (a, b) => { let h = (a * 374761393 + b * 668265263) ^ 0x5bd1e995; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
    const mouse = { x: 0.5, y: 0.5 };
    if (opts.parallax) addEventListener("pointermove", (e) => { mouse.x = e.clientX / innerWidth; mouse.y = e.clientY / innerHeight; }, { passive: true });

    function size() {
      const r = canvas.getBoundingClientRect(); W = r.width; H = r.height;
      canvas.width = Math.max(1, W * DPR); canvas.height = Math.max(1, H * DPR); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    function hexPath(cx, cy, rad) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * (60 * i - 30); const x = cx + rad * Math.cos(a), y = cy + rad * Math.sin(a); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.closePath();
    }

    function frame(now) {
      if (!running) return;
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      const px = (mouse.x - 0.5) * 14, py = (mouse.y - 0.5) * 10;

      // two soft glow fields drifting slowly behind the lattice (page wall only —
      // the catalog slab stays calm, its colour comes from the tiles' own tint)
      if (opts.style !== "grid") {
        const g1x = W * (0.28 + 0.14 * Math.sin(t * 0.11)), g1y = H * (0.30 + 0.12 * Math.cos(t * 0.09));
        const g2x = W * (0.74 + 0.12 * Math.cos(t * 0.08)), g2y = H * (0.68 + 0.13 * Math.sin(t * 0.10));
        let g = ctx.createRadialGradient(g1x, g1y, 0, g1x, g1y, Math.max(W, H) * 0.38);
        g.addColorStop(0, "rgba(46,110,190,0.075)"); g.addColorStop(1, "rgba(46,110,190,0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        g = ctx.createRadialGradient(g2x, g2y, 0, g2x, g2y, Math.max(W, H) * 0.34);
        g.addColorStop(0, "rgba(150,110,40,0.055)"); g.addColorStop(1, "rgba(150,110,40,0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }

      if (opts.style === "grid") {
        // the catalog slab's own look: a wall of square TECH TILES — the same
        // physical treatment as the page's hex plates (grout seams, top-left
        // light, per-tile pulse, bevelled edges) but on a square grid, with a
        // faint duel tint: bluer plates toward the left, warmer toward the
        // right. Calm — no flying particles, the tiles themselves breathe.
        const step = 42, gap = 3;
        const nx = Math.ceil(W / step) + 1, ny = Math.ceil(H / step) + 1;
        for (let j = 0; j <= ny; j++) {
          for (let i = 0; i <= nx; i++) {
            const x = i * step + px * 0.5, y = j * step + py * 0.5;
            const h = hash(i, j), h2 = hash(i + 57, j + 13);
            const pulse = 0.78 + 0.22 * Math.sin(t * 0.5 + h * 6.28);
            const lightFall = 1.05 - (x + y) / (W + H) * 0.85;
            let lum = lightFall * (0.45 + 0.75 * h2 * h2) * pulse;
            if (h2 < 0.13) lum *= 0.35;                        // the odd dark tile
            const sd = Math.abs((x + y) / (W + H) - (t / 12) % 1);
            if (sd < 0.08) lum += (0.08 - sd) * 1.6;           // slow passing sheen
            lum = Math.min(lum, 1.1);

            // duel tint: blue bias on the left half, warm bias on the right
            const wx = x / W;
            const r = Math.round((105 + 130 * wx) * lum);
            const g = Math.round((122 - 6 * wx) * lum);
            const b = Math.round((175 - 105 * wx) * lum);

            const s = step - gap;
            ctx.fillStyle = `rgba(${r},${g},${b},${0.12 + Math.min(lum, 1) * 0.34})`;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(x, y, s, s, 4); else ctx.rect(x, y, s, s);
            ctx.fill();

            // bevel: lit top edge, shadowed bottom edge — same as the hex wall
            ctx.lineWidth = 1;
            ctx.strokeStyle = `rgba(255,255,255,${0.035 + 0.08 * Math.min(lum, 1)})`;
            ctx.beginPath(); ctx.moveTo(x + 1, y + 0.5); ctx.lineTo(x + s - 1, y + 0.5); ctx.stroke();
            ctx.strokeStyle = "rgba(0,0,0,0.28)";
            ctx.beginPath(); ctx.moveTo(x + 1, y + s - 0.5); ctx.lineTo(x + s - 1, y + s - 0.5); ctx.stroke();
          }
        }
        requestAnimationFrame(frame);
        return;
      }

      const sweep = (t / 10) % 1;
      const cols = Math.ceil(W / colStep) + 2, rows = Math.ceil(H / rowStep) + 2;
      const pr = R - 2.4; // plate radius, leaving a grout seam
      for (let rr = -1; rr <= rows; rr++) {
        const rowOffset = (rr % 2 !== 0) ? colStep * 0.5 : 0;
        for (let c = -1; c <= cols; c++) {
          const cx = c * colStep + rowOffset + px;
          const cy = rr * rowStep + py;
          const h = hash(c, rr), h2 = hash(c + 57, rr + 13);
          const pulse = 0.78 + 0.22 * Math.sin(t * 0.6 + h * 6.28);
          const lightFall = 1.05 - (cx + cy) / (W + H) * 0.9; // top-left lit
          let lum = lightFall * (0.45 + 0.75 * h2 * h2) * pulse;
          if (h2 < 0.14) lum *= 0.35;                          // the odd dark tile
          const sd = Math.abs((cx + cy) / (W + H) - sweep);
          if (sd < 0.09) lum += (0.09 - sd) * 3.2 * opts.sweep; // passing sheen
          lum = Math.min(lum, 1.15);

          // the page wall: filled hex PLATES with seams, lit from the top-left,
          // bevelled with a light top edge and a shadowed bottom edge
          const v = [];
          for (let i = 0; i < 6; i++) {
            const a = Math.PI / 180 * (60 * i - 30);
            v.push([cx + pr * Math.cos(a), cy + pr * Math.sin(a)]);
          }
          ctx.beginPath();
          v.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
          ctx.closePath();
          ctx.fillStyle = `rgba(${Math.round(118 * lum)},${Math.round(128 * lum)},${Math.round(146 * lum)},${0.16 + Math.min(lum, 1) * 0.42})`;
          ctx.fill();

          // bevel: light catches the two upper edges, shadow pools on the lower
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = `rgba(255,255,255,${0.04 + 0.09 * Math.min(lum, 1)})`;
          ctx.beginPath();
          ctx.moveTo(v[4][0], v[4][1]); ctx.lineTo(v[5][0], v[5][1]); ctx.lineTo(v[0][0], v[0][1]);
          ctx.stroke();
          ctx.strokeStyle = "rgba(0,0,0,0.30)";
          ctx.beginPath();
          ctx.moveTo(v[1][0], v[1][1]); ctx.lineTo(v[2][0], v[2][1]); ctx.lineTo(v[3][0], v[3][1]);
          ctx.stroke();
        }
      }
      requestAnimationFrame(frame);
    }
    size(); addEventListener("resize", size);
    new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting && !document.hidden; if (running && !was) requestAnimationFrame(frame); }).observe(canvas);
    document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) requestAnimationFrame(frame); });
    requestAnimationFrame(frame);
  }

  /* ---------------- boot ---------------- */
  renderCatalog();
  initTech(document.getElementById("hexfx"), { r: 30, sweep: 0.7, parallax: true });
  initTech(document.querySelector(".catalog-hexfx"), { sweep: 1.0, style: "grid" });
})();
