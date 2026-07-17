/* ============================================================
   Duelio — duelioapp.com
   Catalog recreation, config popups, gameplay phone, hex-tech
   backdrop. Vanilla JS, no dependencies.
   ============================================================ */
(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const V = "/assets/videos/";
  const vid = (base) => V + base + ".mp4";

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
        { n: "Pool", k: "8ballreboot", tileVideo: "PoolModePreview-classic", players: "2", pass: true,
          modes: [
            { id: "classic", label: "8 Ball", desc: "Standard 8 ball rules — pot your group, then sink the 8 to win.", video: "PoolModePreview-classic" },
            { id: "nineBall", label: "9 Ball", desc: "Balls 1–9 in a diamond. Always hit the lowest first; pot the 9 to win.", video: "PoolModePreview-nineBall" },
            { id: "powers", label: "Powers", desc: "8 ball where every turn grants one random power.", video: "PoolModePreview-powers" },
            { id: "snooker", label: "Snooker", desc: "Snooker balls and spacing on the full snooker table.", video: "PoolModePreview-snooker" },
            { id: "runout", label: "Runout", desc: "Every object ball matches — clear the table; fastest time wins, fewest shots breaks ties.", video: "PoolModePreview-runoutChallenge" },
          ],
          config: [{ label: "Hard Mode", type: "toggle", tt: "Hard Mode", td: "Removes the aim guide lines on any game mode." }] },
        { n: "Darts", k: "darts", tileVideo: "DartsModePreview-classic", players: "2–4", pass: true,
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
        { n: "Showdown", k: "poker", live: true, players: "2–7", config: jumpIn },
        { n: "Perfect 21", k: "blackjack", live: true, players: "2–7", config: jumpIn },
        { n: "Go Fish", k: "gofish", live: true, players: "2–6", config: jumpIn },
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

  /* ---------------- tile videos: load them ALL, every tile plays ----------------
     Clips are fetched as blobs through a small queue, then handed to the
     <video> as an object URL. fetch() is never media-throttled or cancelled
     the way <video preload> is, so every tile reliably reaches playback —
     and a blob src loops with zero network hiccups. One cache serves the
     tiles AND the popup previews. */
  const vidCache = new Map();
  const videoURL = (base) => {
    if (!vidCache.has(base)) {
      vidCache.set(base, fetch(vid(base)).then(r => r.blob()).then(b => URL.createObjectURL(b)));
    }
    return vidCache.get(base);
  };
  const loadQueue = []; let inFlight = 0;
  function attachVideo(v, base) {
    loadQueue.push([v, base]);
    pumpQueue();
  }
  function pumpQueue() {
    while (inFlight < 6 && loadQueue.length) {
      const [v, base] = loadQueue.shift();
      inFlight++;
      videoURL(base)
        .then(u => { v.src = u; v.play?.().catch(() => {}); })
        .catch(() => {})
        .then(() => { inFlight--; pumpQueue(); });
    }
  }

  const videoIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target;
      if (e.isIntersecting) v.play?.().catch(() => {});
      else v.pause?.();
    }
  }, { rootMargin: "400px 0px" });

  function makeTileVideo(base, tint) {
    const wrap = document.createElement("div");
    wrap.className = "tile-face";
    const v = document.createElement("video");
    v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("autoplay", "");
    v.addEventListener("loadeddata", () => { v.classList.add("ready"); v.play?.().catch(() => {}); }, { once: true });
    attachVideo(v, base);
    wrap.appendChild(v);
    const gloss = document.createElement("div"); gloss.className = "gloss"; wrap.appendChild(gloss);
    if (tint) {
      const t = document.createElement("div"); t.className = "tint";
      t.style.background = `var(--cat-${tint})`; wrap.appendChild(t);
    }
    videoIO.observe(v);
    return wrap;
  }

  // gentle sweep: any visible, loaded, paused player gets a fresh play()
  setInterval(() => {
    if (document.hidden) return;
    document.querySelectorAll(".tile-face video").forEach(v => {
      if (v.readyState < 2 || !v.paused) return;
      const r = v.getBoundingClientRect();
      if (r.bottom > -400 && r.top < innerHeight + 400) v.play?.().catch(() => {});
    });
  }, 3000);

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
        tile.appendChild(makeTileVideo(g.tileVideo || g.k, g.builder ? null : s.tint));
        if (g.live) tile.querySelector(".tile-face").insertAdjacentHTML("beforeend", `<span class="live-pip">LIVE</span>`);
        if (g.builder) tile.querySelector(".tile-face").insertAdjacentHTML("beforeend", `<span class="pro-seal">PRO</span>`);
        if (g.soon) tile.querySelector(".tile-face").insertAdjacentHTML("beforeend", `<div class="soon-badge"><span>Coming Soon</span></div>`);
        const name = document.createElement("div");
        name.className = "tile-name" + (g.builder ? " gold" : "");
        name.textContent = g.n;
        tile.appendChild(name);
        if (!g.soon) tile.addEventListener("click", () => openGame(g));
        grid.appendChild(tile);
      });
      sec.appendChild(grid);
      scroll.appendChild(sec);
    });
    revealObserve(scroll.querySelectorAll(".reveal"));
  }

  /* ---------------- popup: the iMessage catalog's config, display-only ----------------
     Mirrors DuelioMessagesConfigPopup: graphite slab, game header, the game's
     real modes/options laid out with their defaults selected, and the gold
     staging SEND button. Nothing inside is interactive — it's a faithful
     look at the setup screen, not a working one. Only close works. */
  const scrim = document.getElementById("popup-scrim");
  const popup = document.getElementById("popup");

  function openGame(g) {
    popup.innerHTML = "";
    const head = document.createElement("div"); head.className = "popup-head";
    const pv = document.createElement("div"); pv.className = "pv";
    const hv = document.createElement("video"); hv.muted = true; hv.loop = true; hv.playsInline = true;
    hv.setAttribute("muted", ""); hv.setAttribute("playsinline", "");
    videoURL(g.tileVideo || g.k).then(u => { hv.src = u; hv.play?.().catch(() => {}); });
    pv.appendChild(hv);
    head.innerHTML = `<button class="popup-x" aria-label="Close">✕</button>`;
    head.appendChild(pv);
    head.insertAdjacentHTML("beforeend", `<div class="meta"><h3>${g.n}</h3><div class="sub">${g.live ? "Live multiplayer" : "Turn-based"}</div></div><span class="players">${g.players} players</span>`);
    popup.appendChild(head);
    head.querySelector(".popup-x").addEventListener("click", closePopup);

    const body = document.createElement("div"); body.className = "popup-body noclick";
    popup.appendChild(body);

    // Pool/Darts: the forced mode picker, all five cards with their real clips
    if (g.modes) {
      const el = document.createElement("div"); el.className = "cfg-group";
      el.insertAdjacentHTML("beforeend", `<span class="lbl">Game Mode</span>`);
      g.modes.forEach((m, i) => {
        const c = document.createElement("div"); c.className = "mode-card" + (i === 0 ? " sel" : "");
        c.innerHTML = `<span class="mv"><video muted loop playsinline></video></span>
          <span class="ol"><span class="mt">${m.label}${m.pro ? '<span class="mini-pro">PRO</span>' : ""}</span><span class="md">${m.desc}</span></span>`;
        const mvv = c.querySelector("video");
        videoURL(m.video).then(u => { mvv.src = u; mvv.play?.().catch(() => {}); });
        el.appendChild(c);
      });
      body.appendChild(el);
    }

    const cfg = g.config;
    if (cfg && cfg.blurb) {
      body.insertAdjacentHTML("beforeend", `<p class="cfg-blurb">${cfg.blurb}</p>`);
    } else if (Array.isArray(cfg)) {
      cfg.forEach(group => body.appendChild(renderGroup(group)));
    }

    body.insertAdjacentHTML("beforeend", `
      <div class="cfg-confirm display"><svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M3.4 20.4 20.85 12 3.4 3.6l.01 6.53L15 12 3.41 13.87z"/></svg> SEND</div>
      <p class="cfg-note">The real setup screen from the iMessage catalog. Sending happens in Messages.</p>`);

    scrim.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function renderGroup(group) {
    const el = document.createElement("div"); el.className = "cfg-group";
    if (group.type === "toggle") {
      el.innerHTML = `<div class="cfg-toggle"><div class="tl"><div class="tt">${group.tt}</div><div class="td">${group.td}</div></div><span class="switch${group.on ? " on" : ""}"></span></div>`;
      return el;
    }
    el.insertAdjacentHTML("beforeend", `<span class="lbl">${group.label}</span>`);
    if (group.type === "modes") {
      group.options.forEach((o, i) => {
        const c = document.createElement("div"); c.className = "mode-card" + (i === 0 ? " sel" : "");
        c.innerHTML = `<span class="ol"><span class="mt">${o.label}${o.pro ? '<span class="mini-pro">PRO</span>' : ""}</span><span class="md">${o.desc}</span></span>`;
        el.appendChild(c);
      });
    } else { // seg / flags — group.def picks the highlighted default (app parity)
      const seg = document.createElement("div"); seg.className = "seg" + (group.type === "flags" ? " flags" : "");
      group.options.forEach((o, i) => {
        const b = document.createElement("span"); b.className = i === (group.def || 0) ? "on" : ""; b.textContent = o;
        seg.appendChild(b);
      });
      el.appendChild(seg);
    }
    return el;
  }

  function closePopup() {
    scrim.classList.remove("open");
    document.body.style.overflow = "";
    popup.querySelectorAll("video").forEach(v => { v.pause(); v.removeAttribute("src"); v.load(); });
  }
  scrim?.addEventListener("click", (e) => { if (e.target === scrim) closePopup(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && scrim?.classList.contains("open")) closePopup(); });

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
      { cover: "pool.png",      game: "8 Ball",    lines: [
        { open: "rack em up",                      reply: "chalk my cue",             close: "corner pocket. called it" },
        { open: "you still owe me a rematch",      reply: "and you'll owe me another", close: "big words" },
      ]},
      { cover: "snooker.png",   game: "Snooker",   lines: [
        { open: "fancy a frame of snooker",        reply: "how sophisticated. yes",   close: "147 incoming" },
        { open: "real table this time. snooker",   reply: "you're getting snookered", close: "we'll see about that" },
      ]},
      { cover: "roadrush.webp", game: "Road Rush", lines: [
        { open: "race me. right now",              reply: "don't cry when you lose",  close: "GO GO GO" },
        { open: "my lap record still stands",      reply: "not for long",             close: "eat my dust" },
      ]},
      { cover: "showdown.png",  game: "Showdown",  lines: [
        { open: "poker night. bring your chips",   reply: "dealing you in",           close: "all in first hand. watch" },
        { open: "i can read your bluffs from here", reply: "no you can't",            close: "we'll see about that" },
      ]},
      { cover: "landmark.webp", game: "Landmark",  lines: [
        { open: "bet you can't find this place",   reply: "watch me",                 close: "no maps allowed!!" },
        { open: "geography duel. loser admits it", reply: "i never lose this",        close: "prove it" },
      ]},
      { cover: "wordtiles.png", game: "Word Tiles", lines: [
        { open: "triple word score. warming up",   reply: "bring a dictionary",       close: "QI. 62 points. sit down" },
        { open: "word tiles rematch",              reply: "i've been reading the dictionary", close: "sure you have" },
      ]},
      { cover: "gofish.png",    game: "Go Fish",   lines: [
        { open: "go fish. childhood rules",        reply: "got any threes?",          close: "GO FISH" },
        { open: "one easy game before dinner",     reply: "nothing about me is easy", close: "it's go fish" },
      ]},
      { cover: "wordhunt.png",  game: "Word Hunt", lines: [
        { open: "found 40 words last round",       reply: "i found 41",               close: "prove it" },
        { open: "word hunt. loser makes coffee",   reply: "hope you like making it",  close: "big talk" },
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

  /* ---------------- tech backdrop: hex wall + circuits + energy ----------------
     A richer take on the app's hex-tech chrome: breathing hex lattice with
     powered accent cells (brand blue/red/gold), energy pulses racing along
     the lattice axes with fading tails, drifting spark dust, a travelling
     light sweep, expanding radar rings, and mouse parallax. */
  function initTech(canvas, opts) {
    if (!canvas || reduce) return;
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(devicePixelRatio || 1, 1.75);
    let W = 0, H = 0, running = true, t0 = performance.now();
    const R = opts.r || 26, colStep = R * 1.5, rowStep = R * 1.7320508;
    const hash = (a, b) => { let h = (a * 374761393 + b * 668265263) ^ 0x5bd1e995; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
    const ACCENTS = [[29, 137, 233], [254, 81, 0], [254, 188, 19]]; // blue, red, gold
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

    // energy pulses racing along the three lattice axes
    const AXES = [0, Math.PI / 3, -Math.PI / 3];
    const rand = (a, b) => a + Math.random() * (b - a);
    const newPulse = () => ({
      x: Math.random(), y: Math.random(),
      a: AXES[Math.floor(Math.random() * 3)] * (Math.random() < 0.5 ? 1 : -1),
      sp: rand(90, 220), life: rand(1.6, 3.4), t: 0,
      c: ACCENTS[Math.floor(Math.random() * 3)],
    });
    const pulses = Array.from({ length: opts.pulses || 7 }, newPulse);

    // spark dust, drifting upward
    const dust = Array.from({ length: opts.dust || 50 }, () => ({
      x: Math.random(), y: Math.random(), z: rand(0.3, 1),
      vy: rand(4, 14), tw: rand(0, 6.28),
    }));

    let last = 0;
    function frame(now) {
      if (!running) return;
      const t = (now - t0) / 1000;
      const dt = Math.min((now - (last || now)) / 1000, 0.05); last = now;
      ctx.clearRect(0, 0, W, H);
      const px = (mouse.x - 0.5) * 18, py = (mouse.y - 0.5) * 12;
      const cols = Math.ceil(W / colStep) + 2, rows = Math.ceil(H / rowStep) + 2;
      const sweep = (t / 8) % 1;

      // radar ring every ~5.5s from a hash-picked origin (like the app's pulse)
      const cyc = t / 5.5, ci = Math.floor(cyc), cp = cyc - ci;
      const ringX = hash(ci, 3) * W, ringY = hash(ci, 91) * H;
      const ringR = cp * Math.hypot(W, H) * 0.6, ringFade = (1 - cp) * (1 - cp);

      // hex lattice
      for (let c = -1; c <= cols; c++) {
        for (let rr = -1; rr <= rows; rr++) {
          const cx = c * colStep + px, cy = rr * rowStep + (c % 2 ? rowStep * 0.5 : 0) + py;
          const diag = (cx + cy) / (W + H);
          const h = hash(c, rr);
          const breathe = 0.5 + 0.5 * Math.sin(t * 0.7 + h * 6.28);
          let v = (1 - diag) * 0.10 + breathe * 0.04;
          const sd = Math.abs(diag - sweep); if (sd < 0.07) v += (0.07 - sd) * 2.2 * opts.sweep;
          const rd = Math.abs(Math.hypot(cx - ringX, cy - ringY) - ringR);
          if (rd < 26) v += (1 - rd / 26) * 0.22 * ringFade;

          if (h < 0.045) {
            // powered accent cell: soft colored glow, breathing
            const [ar, ag, ab] = ACCENTS[Math.floor(h * 1000) % 3];
            const glow = 0.05 + 0.11 * breathe;
            hexPath(cx, cy, R - 2);
            ctx.fillStyle = `rgba(${ar},${ag},${ab},${glow})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(${ar},${ag},${ab},${glow * 2.2})`;
            ctx.lineWidth = 1; ctx.stroke();
          } else {
            hexPath(cx, cy, R - 1.4);
            ctx.fillStyle = `rgba(148,162,188,${Math.min(v * 0.5, 0.14)})`;
            ctx.fill();
            if (h > 0.975) { ctx.strokeStyle = `rgba(163,181,199,${0.22 * breathe})`; ctx.lineWidth = 1; ctx.stroke(); }
          }
        }
      }

      // energy pulses with fading tails
      for (const p of pulses) {
        p.t += dt;
        if (p.t > p.life) Object.assign(p, newPulse(), { t: 0 });
        const dist = p.sp * p.t;
        const hx = p.x * W + Math.cos(p.a) * dist + px;
        const hy = p.y * H + Math.sin(p.a) * dist + py;
        const fade = Math.sin(Math.min(p.t / p.life, 1) * Math.PI); // in-out
        const TAIL = 90;
        const g = ctx.createLinearGradient(hx - Math.cos(p.a) * TAIL, hy - Math.sin(p.a) * TAIL, hx, hy);
        g.addColorStop(0, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},0)`);
        g.addColorStop(1, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${0.55 * fade})`);
        ctx.strokeStyle = g; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(hx - Math.cos(p.a) * TAIL, hy - Math.sin(p.a) * TAIL);
        ctx.lineTo(hx, hy); ctx.stroke();
        // bright head
        ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${0.85 * fade})`;
        ctx.beginPath(); ctx.arc(hx, hy, 1.7, 0, 6.28); ctx.fill();
      }

      // spark dust
      for (const d of dust) {
        d.y -= (d.vy * dt) / H;
        if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); }
        d.tw += dt * 2;
        const a = (0.10 + 0.14 * Math.abs(Math.sin(d.tw))) * d.z;
        ctx.fillStyle = `rgba(190,205,235,${a})`;
        ctx.fillRect(d.x * W + px * d.z, d.y * H + py * d.z, 1.4, 1.4);
      }

      requestAnimationFrame(frame);
    }
    size(); addEventListener("resize", size);
    new IntersectionObserver(([e]) => { const was = running; running = e.isIntersecting && !document.hidden; if (running && !was) { last = 0; requestAnimationFrame(frame); } }).observe(canvas);
    document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) { last = 0; requestAnimationFrame(frame); } });
    requestAnimationFrame(frame);
  }

  /* ---------------- boot ---------------- */
  renderCatalog();
  initTech(document.getElementById("hexfx"), { r: 30, sweep: 0.7, pulses: 9, dust: 60, parallax: true });
  initTech(document.querySelector(".catalog-hexfx"), { r: 22, sweep: 1.0, pulses: 5, dust: 24 });
})();
