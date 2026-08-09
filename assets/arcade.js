/* ============================================================
   Duelio solo arcade — seven touch-first, one-round game demos.
   Vanilla canvas; no network calls, dependencies, or saved state.
   ============================================================ */
(() => {
  "use strict";

  const root = document.getElementById("solo-arcade");
  const canvas = document.getElementById("arcade-canvas");
  if (!root || !canvas) return;

  const ctx = canvas.getContext("2d", { alpha: false });
  const stage = document.getElementById("arcade-stage");
  const overlay = document.getElementById("arcade-overlay");
  const overlayTitle = document.getElementById("arcade-overlay-title");
  const overlayCopy = document.getElementById("arcade-instruction");
  const overlayTag = document.getElementById("arcade-tag");
  const startButton = document.getElementById("arcade-start");
  const titleEl = document.getElementById("arcade-title");
  const modeEl = document.getElementById("arcade-mode");
  const timeEl = document.getElementById("arcade-time");
  const scoreEl = document.getElementById("arcade-score");
  const helpEl = document.getElementById("arcade-help");
  const statusEl = document.getElementById("arcade-status");
  const tabs = [...root.querySelectorAll("[data-arcade-game]")];
  const driveButtons = [...root.querySelectorAll("[data-drive]")];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const TAU = Math.PI * 2;
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const choice = (a) => a[Math.floor(Math.random() * a.length)];
  const hex = (value, alpha = 1) => {
    const v = value.replace("#", "");
    const full = v.length === 3 ? v.split("").map(c => c + c).join("") : v;
    const n = parseInt(full, 16);
    return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  };
  const rr = (c, x, y, w, h, r) => {
    const q = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + q, y);
    c.arcTo(x + w, y, x + w, y + h, q);
    c.arcTo(x + w, y + h, x, y + h, q);
    c.arcTo(x, y + h, x, y, q);
    c.arcTo(x, y, x + w, y, q);
    c.closePath();
  };
  const poly = (c, points) => {
    c.beginPath();
    points.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    c.closePath();
  };
  const formatClock = (seconds) => {
    const s = Math.max(0, Math.ceil(seconds));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };
  const label = (c, text, x, y, size, color = "#fff", align = "center", font = "Bungee") => {
    c.fillStyle = color;
    c.textAlign = align;
    c.textBaseline = "middle";
    c.font = `${size}px ${font}, sans-serif`;
    c.fillText(text, x, y);
  };

  const GAMES = {
    drift: {
      title: "DRIFT", mode: "ONE RUN", duration: 20,
      instruction: "Steer through the bends and hold the longest drift you can.",
      help: "Drag left and right to steer", drive: true,
    },
    wordhunt: {
      title: "WORD HUNT", mode: "30 SEC BLITZ", duration: 30,
      instruction: "Drag through touching letters. Every valid word scores instantly.",
      help: "Drag across adjacent letters", drive: false,
    },
    pool: {
      title: "POOL RUNOUT", mode: "6-BALL RUNOUT", duration: 45,
      instruction: "Pull back from the cue ball, then release. Clear all six balls.",
      help: "Pull back from the cue ball", drive: false,
    },
    darts: {
      title: "DARTS", mode: "COMBO · ONE DART", duration: 0,
      instruction: "You get one dart. Tap the board and make the shot count.",
      help: "Tap once to throw your dart", drive: false,
    },
    bowling: {
      title: "BOWLING", mode: "ONE THROW", duration: 12,
      instruction: "Line up the ball and swipe toward the pins. One throw only.",
      help: "Drag the ball, then swipe up", drive: false,
    },
    ringtoss: {
      title: "RING TOSS", mode: "THREE RINGS", duration: 0,
      instruction: "Swipe a gold ring onto a bottle. You have three throws.",
      help: "Drag a ring onto a bottle", drive: false,
    },
    roadrush: {
      title: "ROAD RUSH", mode: "ONE RUN", duration: 20,
      instruction: "Stay on the road, dodge traffic, and push your boosted run.",
      help: "Drag or use the arrows to steer", drive: true,
    },
  };

  let gameID = "drift";
  let phase = "ready";
  let gameState = null;
  let startedAt = 0;
  let elapsed = 0;
  let remaining = 0;
  let lastFrame = performance.now();
  let W = 360;
  let H = 460;
  let pointerID = null;
  const steering = { left: false, right: false };

  function resizeCanvas() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    canvas.width = Math.max(1, Math.round(W * dpr));
    canvas.height = Math.max(1, Math.round(H * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (gameID === "pool" && gameState) layoutPool(gameState, true);
  }

  function canvasPoint(event) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - r.left) * W / r.width,
      y: (event.clientY - r.top) * H / r.height,
    };
  }

  function makeState(id) {
    switch (id) {
      case "drift": return { carX: 0, control: 0, speed: 0.52, distance: 0, drift: 0, score: 0, road: 0, dust: [] };
      case "wordhunt": return makeWordState();
      case "pool": return makePoolState();
      case "darts": return { thrown: false, dart: null, score: 0, detail: "ONE DART", hover: { x: W / 2, y: H * 0.45 } };
      case "bowling": return makeBowlingState();
      case "ringtoss": return { ringsLeft: 3, landed: 0, dragging: false, pointer: null, flight: null, landedAt: [], score: 0 };
      case "roadrush": return makeRoadRushState();
      default: return {};
    }
  }

  function showReady() {
    const game = GAMES[gameID];
    phase = "ready";
    elapsed = 0;
    remaining = game.duration;
    gameState = makeState(gameID);
    root.dataset.theme = gameID;
    titleEl.textContent = game.title;
    modeEl.textContent = game.mode;
    helpEl.textContent = game.help;
    overlayTag.textContent = game.mode;
    overlayTitle.textContent = game.title;
    overlayCopy.textContent = game.instruction;
    startButton.textContent = "START";
    overlay.classList.remove("is-hidden");
    stage.classList.toggle("show-drive", game.drive);
    tabs.forEach(tab => {
      const selected = tab.dataset.arcadeGame === gameID;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected) {
        const rail = tab.parentElement;
        rail.scrollTo({
          left: tab.offsetLeft - (rail.clientWidth - tab.offsetWidth) / 2,
          behavior: reduce ? "auto" : "smooth",
        });
      }
    });
    resetControls();
    syncHud();
    statusEl.textContent = `${game.title} selected. Press Start to play.`;
  }

  function startGame() {
    phase = "playing";
    gameState = makeState(gameID);
    startedAt = performance.now();
    elapsed = 0;
    remaining = GAMES[gameID].duration;
    overlay.classList.add("is-hidden");
    resetControls();
    syncHud();
    statusEl.textContent = `${GAMES[gameID].title} started.`;
  }

  function finishGame(score, detail) {
    if (phase !== "playing") return;
    phase = "result";
    resetControls();
    overlayTag.textContent = "ROUND COMPLETE";
    overlayTitle.textContent = "YOUR SCORE";
    overlayCopy.innerHTML = `<span class="arcade-result-score">${score}</span><span class="arcade-result-detail">${detail}</span>`;
    startButton.textContent = "PLAY AGAIN";
    overlay.classList.remove("is-hidden");
    statusEl.textContent = `Round complete. Your score is ${score}. ${detail}.`;
  }

  function finishForTimeout() {
    switch (gameID) {
      case "drift": finishGame(Math.round(gameState.score).toLocaleString(), `${Math.round(gameState.distance)} M · DRIFT RUN`); break;
      case "wordhunt": finishGame(gameState.score.toLocaleString(), `${gameState.found.size} WORD${gameState.found.size === 1 ? "" : "S"}`); break;
      case "pool": finishGame(`${gameState.pocketed}/6`, `${gameState.shots} SHOT${gameState.shots === 1 ? "" : "S"} · TIME UP`); break;
      case "bowling": finishGame("0", "NO THROW"); break;
      case "roadrush": finishGame(`${Math.floor(gameState.distance).toLocaleString()} m`, "RUN COMPLETE"); break;
    }
  }

  function resetControls() {
    pointerID = null;
    steering.left = false;
    steering.right = false;
    driveButtons.forEach(b => b.classList.remove("is-down"));
  }

  function scoreDisplay() {
    if (!gameState) return "0";
    switch (gameID) {
      case "drift": return Math.round(gameState.score).toLocaleString();
      case "wordhunt": return gameState.score.toLocaleString();
      case "pool": return `${gameState.pocketed}/6`;
      case "darts": return String(gameState.score || 0);
      case "bowling": return String(gameState.pinsDown || 0);
      case "ringtoss": return String(gameState.landed || 0);
      case "roadrush": return `${Math.floor(gameState.distance || 0)}m`;
      default: return "0";
    }
  }

  function timeDisplay() {
    if (GAMES[gameID].duration) return formatClock(phase === "ready" ? GAMES[gameID].duration : remaining);
    if (gameID === "darts") return gameState?.thrown ? "THROWN" : "1 DART";
    if (gameID === "ringtoss") return `${gameState?.ringsLeft ?? 3} LEFT`;
    return "—";
  }

  function syncHud() {
    scoreEl.textContent = scoreDisplay();
    timeEl.textContent = timeDisplay();
  }

  function updateGame(dt, t) {
    switch (gameID) {
      case "drift": updateDrift(gameState, dt, t); break;
      case "wordhunt": updateWord(gameState, dt); break;
      case "pool": updatePool(gameState, dt); break;
      case "darts": updateDarts(gameState, dt); break;
      case "bowling": updateBowling(gameState, dt); break;
      case "ringtoss": updateRingToss(gameState, dt); break;
      case "roadrush": updateRoadRush(gameState, dt, t); break;
    }
  }

  function drawGame(t) {
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    switch (gameID) {
      case "drift": drawDrift(gameState, t); break;
      case "wordhunt": drawWordHunt(gameState, t); break;
      case "pool": drawPool(gameState, t); break;
      case "darts": drawDarts(gameState, t); break;
      case "bowling": drawBowling(gameState, t); break;
      case "ringtoss": drawRingToss(gameState, t); break;
      case "roadrush": drawRoadRush(gameState, t); break;
    }
    ctx.restore();
  }

  function loop(now) {
    const dt = Math.min((now - lastFrame) / 1000, 0.033);
    lastFrame = now;
    if (phase === "playing") {
      elapsed = (now - startedAt) / 1000;
      if (GAMES[gameID].duration) {
        remaining = Math.max(0, GAMES[gameID].duration - elapsed);
        if (remaining <= 0) finishForTimeout();
      }
      if (phase === "playing") updateGame(dt, now / 1000);
      syncHud();
    }
    drawGame(now / 1000);
    requestAnimationFrame(loop);
  }

  /* ---------------- shared racer drawing ---------------- */
  function drawCar(c, x, y, scale, color, yaw = 0, boost = false) {
    c.save();
    c.translate(x, y);
    c.rotate(yaw);
    c.scale(scale, scale);
    if (boost) {
      const flame = c.createLinearGradient(0, 24, 0, 61);
      flame.addColorStop(0, "rgba(110,235,255,.95)");
      flame.addColorStop(0.45, "rgba(40,105,255,.82)");
      flame.addColorStop(1, "rgba(35,80,255,0)");
      c.fillStyle = flame;
      poly(c, [[-10, 24], [-3, 57], [1, 27]]); c.fill();
      poly(c, [[10, 24], [3, 57], [-1, 27]]); c.fill();
    }
    c.fillStyle = "rgba(0,0,0,.55)";
    rr(c, -23, -35, 46, 76, 13); c.fill();
    const body = c.createLinearGradient(-20, -30, 21, 32);
    body.addColorStop(0, "#fff"); body.addColorStop(0.16, color); body.addColorStop(0.72, color); body.addColorStop(1, "#26070a");
    c.fillStyle = body;
    poly(c, [[-20,-24],[-13,-36],[13,-36],[20,-24],[24,22],[15,35],[-15,35],[-24,22]]); c.fill();
    c.fillStyle = "#0a1825";
    poly(c, [[-12,-19],[-8,-29],[8,-29],[12,-19],[10,-3],[-10,-3]]); c.fill();
    c.fillStyle = "rgba(95,205,255,.62)";
    poly(c, [[-10,-18],[-7,-26],[7,-26],[10,-18],[8,-11],[-8,-11]]); c.fill();
    c.fillStyle = "#0c0e12";
    c.fillRect(-27, -21, 6, 19); c.fillRect(21, -21, 6, 19); c.fillRect(-27, 14, 6, 18); c.fillRect(21, 14, 6, 18);
    c.fillStyle = "#ffd9a4";
    c.fillRect(-15, -32, 8, 4); c.fillRect(7, -32, 8, 4);
    c.fillStyle = "#ff2a21";
    c.fillRect(-15, 29, 9, 4); c.fillRect(6, 29, 9, 4);
    c.restore();
  }

  function roadEdges(y, horizon, bottom, curve = 0) {
    const p = clamp((y - horizon) / Math.max(1, bottom - horizon), 0, 1);
    const half = lerp(W * 0.12, W * 0.64, Math.pow(p, 0.82));
    const center = W / 2 + curve * (1 - p) * W * 0.14;
    return { left: center - half, right: center + half, center, p };
  }

  function drawPerspectiveRoad(scroll, curve, palette = "desert") {
    const horizon = H * 0.14, bottom = H + 10;
    const sky = ctx.createLinearGradient(0, 0, 0, horizon * 1.8);
    if (palette === "night") { sky.addColorStop(0, "#061329"); sky.addColorStop(1, "#275281"); }
    else { sky.addColorStop(0, "#6bc3e5"); sky.addColorStop(0.72, "#ffd4a0"); sky.addColorStop(1, "#dc8b55"); }
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, horizon + 8);
    if (palette === "night") {
      ctx.fillStyle = "rgba(255,255,255,.55)";
      for (let i = 0; i < 22; i++) ctx.fillRect((i * 83) % W, 10 + (i * 37) % (horizon - 18), 1, 1);
    } else {
      ctx.fillStyle = "rgba(255,232,174,.8)"; ctx.beginPath(); ctx.arc(W * .78, horizon * .42, 20, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = palette === "night" ? "#102719" : "#b86532"; ctx.fillRect(0, horizon, W, H - horizon);
    const far = roadEdges(horizon, horizon, bottom, curve);
    const near = roadEdges(bottom, horizon, bottom, curve);
    ctx.fillStyle = "#20242a"; poly(ctx, [[far.left,horizon],[far.right,horizon],[near.right,bottom],[near.left,bottom]]); ctx.fill();
    ctx.strokeStyle = palette === "night" ? "#7d8b9f" : "#f6d2a7"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(far.left,horizon); ctx.lineTo(near.left,bottom); ctx.moveTo(far.right,horizon); ctx.lineTo(near.right,bottom); ctx.stroke();
    for (let i = 0; i < 20; i++) {
      const z = ((i / 20 + scroll) % 1);
      const y = lerp(horizon, bottom, z * z);
      const e = roadEdges(y, horizon, bottom, curve);
      const nextZ = Math.min(1, z + .045);
      const y2 = lerp(horizon, bottom, nextZ * nextZ);
      const e2 = roadEdges(y2, horizon, bottom, curve);
      if (i % 2 === 0) {
        ctx.fillStyle = "rgba(255,255,255,.82)";
        const w1 = lerp(1, 6, z), w2 = lerp(1, 7, nextZ);
        poly(ctx, [[e.center-w1/2,y],[e.center+w1/2,y],[e2.center+w2/2,y2],[e2.center-w2/2,y2]]); ctx.fill();
      }
    }
    return { horizon, bottom };
  }

  /* ---------------- Drift ---------------- */
  function updateDrift(s, dt, t) {
    const steer = (steering.right ? 1 : 0) - (steering.left ? 1 : 0);
    if (steer) s.control = steer;
    else if (!s.dragging) s.control *= Math.pow(0.05, dt);
    s.road += dt * (0.34 + s.speed * 0.24);
    const curve = Math.sin(t * .74) * .58 + Math.sin(t * .31 + 1.4) * .28;
    s.carX += s.control * dt * 1.45;
    s.carX -= curve * dt * .28;
    s.speed = Math.min(1.18, s.speed + dt * .026);
    s.distance += dt * (68 + s.speed * 42);
    const slide = Math.abs(s.control - curve * .72);
    s.drift += slide * s.speed * dt * 95;
    s.score = s.distance + s.drift * 5;
    if (slide > .55 && Math.random() < dt * 22) s.dust.push({ x: s.carX, life: 1, side: Math.random() < .5 ? -1 : 1 });
    s.dust.forEach(p => p.life -= dt * 1.5);
    s.dust = s.dust.filter(p => p.life > 0);
    if (Math.abs(s.carX) > 1.12) finishGame(Math.round(s.score).toLocaleString(), "OFF TRACK");
  }

  function drawDrift(s, t) {
    const curve = Math.sin(t * .74) * .58 + Math.sin(t * .31 + 1.4) * .28;
    const road = drawPerspectiveRoad(s.road, curve, "desert");
    const carY = H * .8;
    const edge = roadEdges(carY, road.horizon, road.bottom, curve);
    const carX = edge.center + s.carX * (edge.right - edge.left) * .55;
    s.dust.forEach(p => {
      const x = edge.center + p.x * (edge.right-edge.left) * .55 + p.side * 18;
      ctx.fillStyle = `rgba(236,190,137,${p.life * .45})`;
      ctx.beginPath(); ctx.arc(x, carY + (1-p.life)*24, 5 + (1-p.life)*13, 0, TAU); ctx.fill();
    });
    drawCar(ctx, carX, carY, clamp(W / 390, .75, 1), "#ff642d", s.control * .11, false);
    ctx.fillStyle = "rgba(0,0,0,.48)"; rr(ctx, 12, 13, 108, 43, 6); ctx.fill();
    label(ctx, "DRIFT SCORE", 22, 25, 7, "rgba(255,255,255,.56)", "left");
    label(ctx, Math.round(s.score).toLocaleString(), 22, 43, 16, "#ffbe5b", "left");
    ctx.fillStyle = "rgba(0,0,0,.48)"; rr(ctx, W-93, 13, 81, 43, 6); ctx.fill();
    label(ctx, `${Math.round(68+s.speed*42)} MPH`, W-22, 36, 10, "#fff", "right");
  }

  /* ---------------- Word Hunt ---------------- */
  const WORD_BOARD = ["C","A","T","S", "R","E","D","O", "P","I","N","G", "L","O","V","E"];
  const WORDS = new Set([
    "cat","cats","car","care","red","dog","sod","soda","pin","pins","pine","pined","ping","pings",
    "ring","rings","love","line","tone","stone","tar","tared","rat","rats","rate","tea","ten","tend",
    "ore","roe","rod","rode","rid","ride","rip","ripe","pie","pig","gin","goes","gone","song","son",
    "one","done","dove","live","lived","lover","rove","rose","pose","pores","poet","note","notes","date"
  ]);
  function makeWordState() {
    return { letters: WORD_BOARD, selection: [], found: new Set(), score: 0, dragging: false, pointer: null, flash: null, flashLife: 0 };
  }
  function wordLayout() {
    const size = Math.min(W - 38, H * .69);
    const gap = 7;
    const tile = (size - gap * 3) / 4;
    return { size, gap, tile, x: (W-size)/2, y: Math.max(74, H*.15) };
  }
  function wordTileAt(p) {
    const g = wordLayout();
    for (let i = 0; i < 16; i++) {
      const r = Math.floor(i/4), c = i%4;
      const x = g.x+c*(g.tile+g.gap), y=g.y+r*(g.tile+g.gap);
      if (p.x>=x && p.x<=x+g.tile && p.y>=y && p.y<=y+g.tile) return i;
    }
    return -1;
  }
  function wordString(s) { return s.selection.map(i => s.letters[i]).join(""); }
  function wordPoints(n) { return n<3?0:n===3?200:n===4?500:n===5?750:n===6?1250:2000+(n-7)*400; }
  function updateWord(s, dt) { if (s.flashLife > 0) s.flashLife -= dt; }
  function drawWordHunt(s, t) {
    const bg = ctx.createRadialGradient(W*.5,H*.28,10,W*.5,H*.4,H*.72);
    bg.addColorStop(0,"#224337"); bg.addColorStop(.52,"#10231f"); bg.addColorStop(1,"#070c0c");
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    const g=wordLayout();
    ctx.fillStyle="rgba(0,0,0,.34)"; rr(ctx,g.x-10,g.y-10,g.size+20,g.size+20,14); ctx.fill();
    ctx.strokeStyle="rgba(92,214,142,.24)"; ctx.lineWidth=1; rr(ctx,g.x-10,g.y-10,g.size+20,g.size+20,14); ctx.stroke();
    if (s.selection.length>1) {
      ctx.strokeStyle="rgba(255,225,91,.9)"; ctx.lineWidth=Math.max(6,W*.018); ctx.lineCap="round"; ctx.lineJoin="round";
      ctx.beginPath();
      s.selection.forEach((idx,k)=>{const r=Math.floor(idx/4),c=idx%4,x=g.x+c*(g.tile+g.gap)+g.tile/2,y=g.y+r*(g.tile+g.gap)+g.tile/2;k?ctx.lineTo(x,y):ctx.moveTo(x,y);});
      ctx.stroke();
    }
    for(let i=0;i<16;i++){
      const r=Math.floor(i/4),c=i%4,x=g.x+c*(g.tile+g.gap),y=g.y+r*(g.tile+g.gap),selected=s.selection.includes(i);
      ctx.save();
      if(selected){ctx.shadowColor="#ffe35d";ctx.shadowBlur=14;}
      const grad=ctx.createLinearGradient(x,y,x,y+g.tile);
      if(selected){grad.addColorStop(0,"#fff59a");grad.addColorStop(1,"#e4a91d");}
      else{grad.addColorStop(0,"#5b665e");grad.addColorStop(.12,"#3a443e");grad.addColorStop(1,"#1a211e");}
      ctx.fillStyle=grad; rr(ctx,x,y,g.tile,g.tile,9);ctx.fill();
      ctx.strokeStyle=selected?"#fffbd0":"rgba(150,190,165,.3)";ctx.lineWidth=1.2;rr(ctx,x+.8,y+.8,g.tile-1.6,g.tile-1.6,8);ctx.stroke();
      label(ctx,s.letters[i],x+g.tile/2,y+g.tile/2+2,g.tile*.43,selected?"#243011":"#f1f5ed");
      ctx.restore();
    }
    const word=wordString(s), valid=WORDS.has(word.toLowerCase())&&!s.found.has(word.toLowerCase());
    ctx.fillStyle=valid?"rgba(77,230,126,.2)":"rgba(0,0,0,.42)";rr(ctx,W*.19,18,W*.62,42,21);ctx.fill();
    ctx.strokeStyle=valid?"rgba(101,255,142,.75)":"rgba(255,255,255,.12)";rr(ctx,W*.19,18,W*.62,42,21);ctx.stroke();
    label(ctx,word||"FIND A WORD",W/2,40,word?15:9,word?(valid?"#8cff9f":"#fff"):"rgba(255,255,255,.46)");
    const found=[...s.found].slice(-3).reverse();
    found.forEach((w,i)=>label(ctx,w.toUpperCase(),W/2,H-18-i*17,8,`rgba(130,255,164,${.72-i*.17})`));
    if(s.flashLife>0&&s.flash){
      ctx.save();ctx.globalAlpha=clamp(s.flashLife*2,0,1);label(ctx,`+${s.flash.points}`,W/2,g.y+g.size+25,20,"#ffe271");ctx.restore();
    }
  }

  /* ---------------- Pool: 6-ball runout ---------------- */
  function poolTable() { return { x: W*.095, y: 28, w: W*.81, h: H-56, rail: 15 }; }
  function poolPockets(t) { return [
    {x:t.x+4,y:t.y+4},{x:t.x+t.w-4,y:t.y+4},{x:t.x+2,y:t.y+t.h/2},{x:t.x+t.w-2,y:t.y+t.h/2},{x:t.x+4,y:t.y+t.h-4},{x:t.x+t.w-4,y:t.y+t.h-4}
  ]; }
  function makePoolState() {
    const s={ balls:[], pocketed:0, shots:0, dragging:false, aim:null, score:0, layoutW:0, layoutH:0 };
    layoutPool(s,false); return s;
  }
  function layoutPool(s, preserve) {
    if(preserve&&s.layoutW&&s.balls.length){
      const sx=W/s.layoutW, sy=H/s.layoutH; s.balls.forEach(b=>{b.x*=sx;b.y*=sy;});
    } else {
      const t=poolTable(), r=clamp(W*.022,6,9), cx=t.x+t.w/2, top=t.y+t.h*.31;
      s.balls=[{id:0,cue:true,x:cx,y:t.y+t.h*.72,vx:0,vy:0,r,active:true,color:"#f7f2dc"}];
      const colors=["#f5cf33","#3681df","#e64c3d","#7b50bd","#ef8d31","#32a56b"];
      let id=1;
      for(let row=0;row<3;row++)for(let col=0;col<=row;col++){
        if(id>6)break;
        s.balls.push({id,cue:false,x:cx+(col-row/2)*r*2.1,y:top+row*r*1.82,vx:0,vy:0,r,active:true,color:colors[id-1]});id++;
      }
    }
    s.layoutW=W;s.layoutH=H;
  }
  const ballsMoving=s=>s.balls.some(b=>b.active&&Math.hypot(b.vx,b.vy)>4);
  function updatePool(s,dt){
    const t=poolTable(), pockets=poolPockets(t);
    for(const b of s.balls){
      if(!b.active)continue;
      b.x+=b.vx*dt;b.y+=b.vy*dt;
      const f=Math.pow(.982,dt*60);b.vx*=f;b.vy*=f;if(Math.hypot(b.vx,b.vy)<3){b.vx=0;b.vy=0;}
      const pocket=pockets.find(p=>Math.hypot(b.x-p.x,b.y-p.y)<b.r*1.8);
      if(pocket){
        if(b.cue){b.x=t.x+t.w/2;b.y=t.y+t.h*.74;b.vx=b.vy=0;}
        else{b.active=false;b.vx=b.vy=0;s.pocketed++;s.score=s.pocketed*100;}
        continue;
      }
      const left=t.x+t.rail+b.r,right=t.x+t.w-t.rail-b.r,top=t.y+t.rail+b.r,bottom=t.y+t.h-t.rail-b.r;
      if(b.x<left){b.x=left;b.vx=Math.abs(b.vx)*.86;}if(b.x>right){b.x=right;b.vx=-Math.abs(b.vx)*.86;}
      if(b.y<top){b.y=top;b.vy=Math.abs(b.vy)*.86;}if(b.y>bottom){b.y=bottom;b.vy=-Math.abs(b.vy)*.86;}
    }
    const active=s.balls.filter(b=>b.active);
    for(let i=0;i<active.length;i++)for(let j=i+1;j<active.length;j++){
      const a=active[i],b=active[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.01,min=a.r+b.r;
      if(d>=min)continue;
      const nx=dx/d,ny=dy/d,over=min-d;a.x-=nx*over/2;a.y-=ny*over/2;b.x+=nx*over/2;b.y+=ny*over/2;
      const rel=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rel<0){const imp=-rel*.94;a.vx-=imp*nx;a.vy-=imp*ny;b.vx+=imp*nx;b.vy+=imp*ny;}
    }
    if(s.pocketed>=6&&!ballsMoving(s)) finishGame(`${elapsed.toFixed(1)}s`,`CLEARED · ${s.shots} SHOT${s.shots===1?"":"S"}`);
  }
  function drawPool(s,tick){
    ctx.fillStyle="#07100f";ctx.fillRect(0,0,W,H);
    const t=poolTable();
    ctx.shadowColor="rgba(0,0,0,.7)";ctx.shadowBlur=24;
    const wood=ctx.createLinearGradient(t.x,t.y,t.x+t.w,t.y+t.h);wood.addColorStop(0,"#55351e");wood.addColorStop(.5,"#9a6332");wood.addColorStop(1,"#3a2517");
    ctx.fillStyle=wood;rr(ctx,t.x,t.y,t.w,t.h,20);ctx.fill();ctx.shadowBlur=0;
    const felt=ctx.createRadialGradient(t.x+t.w*.42,t.y+t.h*.35,10,t.x+t.w/2,t.y+t.h/2,t.h*.65);felt.addColorStop(0,"#1c9ea1");felt.addColorStop(1,"#07565c");
    ctx.fillStyle=felt;rr(ctx,t.x+t.rail,t.y+t.rail,t.w-t.rail*2,t.h-t.rail*2,11);ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,.12)";ctx.lineWidth=1;rr(ctx,t.x+t.rail+1,t.y+t.rail+1,t.w-t.rail*2-2,t.h-t.rail*2-2,10);ctx.stroke();
    poolPockets(t).forEach(p=>{ctx.fillStyle="#030405";ctx.beginPath();ctx.arc(p.x,p.y,clamp(W*.038,11,15),0,TAU);ctx.fill();ctx.strokeStyle="#bf8750";ctx.lineWidth=2;ctx.stroke();});
    if(s.dragging&&s.aim){
      const cue=s.balls[0],dx=cue.x-s.aim.x,dy=cue.y-s.aim.y,len=Math.hypot(dx,dy)||1,nx=dx/len,ny=dy/len;
      ctx.save();ctx.setLineDash([6,7]);ctx.strokeStyle="rgba(255,255,255,.82)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cue.x,cue.y);ctx.lineTo(cue.x+nx*150,cue.y+ny*150);ctx.stroke();ctx.restore();
      ctx.strokeStyle="#d7bd8b";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(cue.x-nx*(24+Math.min(len,90)),cue.y-ny*(24+Math.min(len,90)));ctx.lineTo(cue.x-nx*(120+Math.min(len,90)),cue.y-ny*(120+Math.min(len,90)));ctx.stroke();
    }
    s.balls.filter(b=>b.active).forEach(b=>{
      ctx.save();ctx.shadowColor="rgba(0,0,0,.55)";ctx.shadowBlur=5;ctx.shadowOffsetY=3;
      const g=ctx.createRadialGradient(b.x-b.r*.35,b.y-b.r*.45,b.r*.1,b.x,b.y,b.r);g.addColorStop(0,"#fff");g.addColorStop(.24,b.color);g.addColorStop(1,hex(b.color,.64));ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,TAU);ctx.fill();ctx.restore();
      if(!b.cue){ctx.fillStyle="#f7f4e7";ctx.beginPath();ctx.arc(b.x,b.y,b.r*.42,0,TAU);ctx.fill();label(ctx,String(b.id),b.x,b.y+.3,b.r*.55,"#141414");}
    });
    ctx.fillStyle="rgba(0,0,0,.42)";rr(ctx,W*.3,7,W*.4,23,12);ctx.fill();label(ctx,`${s.pocketed} / 6 BALLS`,W/2,19,9,"#d9ffff");
  }

  /* ---------------- Darts: combo, one shot ---------------- */
  const DART_NUMBERS=[20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];
  function dartBoard(){return{cx:W/2,cy:H*.49,r:Math.min(W*.405,H*.34)};}
  function dartScore(p){
    const b=dartBoard(),dx=p.x-b.cx,dy=p.y-b.cy,d=Math.hypot(dx,dy),q=d/b.r;
    if(q>.99)return{score:0,detail:"MISS"};if(q<.045)return{score:50,detail:"BULLSEYE"};if(q<.095)return{score:25,detail:"OUTER BULL"};
    const theta=(Math.atan2(dx,-dy)+TAU)%TAU,idx=Math.floor((theta+Math.PI/20)%TAU/(TAU/20)),n=DART_NUMBERS[idx];
    if(q>.87)return{score:n*2,detail:`DOUBLE ${n}`};if(q>.50&&q<.60)return{score:n*3,detail:`TRIPLE ${n}`};return{score:n,detail:`SINGLE ${n}`};
  }
  function updateDarts(s,dt){if(!s.dart)return;s.dart.t+=dt*1.6;if(s.dart.t>=1.35)finishGame(String(s.score),`${s.detail} · ×${s.score?1:0} COMBO`);}
  function drawDarts(s,t){
    const bg=ctx.createRadialGradient(W*.5,H*.45,20,W*.5,H*.5,H*.68);bg.addColorStop(0,"#4a1a33");bg.addColorStop(.55,"#180b17");bg.addColorStop(1,"#070609");ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    const b=dartBoard(),seg=TAU/20;
    ctx.save();ctx.shadowColor="rgba(0,0,0,.8)";ctx.shadowBlur=22;ctx.fillStyle="#0c0d0e";ctx.beginPath();ctx.arc(b.cx,b.cy,b.r*1.16,0,TAU);ctx.fill();ctx.restore();
    for(let i=0;i<20;i++){
      const a=-Math.PI/2+i*seg,start=a-seg/2,end=a+seg/2,light=i%2===0;
      ctx.fillStyle=light?"#e8d9bd":"#202322";ctx.beginPath();ctx.moveTo(b.cx,b.cy);ctx.arc(b.cx,b.cy,b.r*.99,start,end);ctx.closePath();ctx.fill();
      ctx.fillStyle=light?"#b52231":"#258255";ctx.beginPath();ctx.arc(b.cx,b.cy,b.r*.98,start,end);ctx.arc(b.cx,b.cy,b.r*.87,end,start,true);ctx.closePath();ctx.fill();
      ctx.fillStyle=light?"#b52231":"#258255";ctx.beginPath();ctx.arc(b.cx,b.cy,b.r*.60,start,end);ctx.arc(b.cx,b.cy,b.r*.50,end,start,true);ctx.closePath();ctx.fill();
      const nx=b.cx+Math.cos(a)*b.r*1.075,ny=b.cy+Math.sin(a)*b.r*1.075;label(ctx,String(DART_NUMBERS[i]),nx,ny,clamp(b.r*.105,9,14),"#f4f4ee");
    }
    ctx.fillStyle="#218059";ctx.beginPath();ctx.arc(b.cx,b.cy,b.r*.095,0,TAU);ctx.fill();ctx.fillStyle="#c52c37";ctx.beginPath();ctx.arc(b.cx,b.cy,b.r*.045,0,TAU);ctx.fill();
    ctx.strokeStyle="rgba(235,235,220,.45)";ctx.lineWidth=.7;for(let i=0;i<20;i++){const a=-Math.PI/2+(i+.5)*seg;ctx.beginPath();ctx.moveTo(b.cx,b.cy);ctx.lineTo(b.cx+Math.cos(a)*b.r*.99,b.cy+Math.sin(a)*b.r*.99);ctx.stroke();}
    if(!s.thrown&&phase==="playing"){
      const p=s.hover||{x:b.cx,y:b.cy};ctx.strokeStyle="rgba(255,255,255,.78)";ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(p.x,p.y,9,0,TAU);ctx.moveTo(p.x-14,p.y);ctx.lineTo(p.x+14,p.y);ctx.moveTo(p.x,p.y-14);ctx.lineTo(p.x,p.y+14);ctx.stroke();
    }
    if(s.dart){const q=ease(Math.min(s.dart.t,1)),x=lerp(W*.77,s.dart.x,q),y=lerp(H*.95,s.dart.y,q),scale=lerp(1.8,.6,q);ctx.save();ctx.translate(x,y);ctx.rotate(-.55);ctx.scale(scale,scale);ctx.strokeStyle="#dfe7ee";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,18);ctx.lineTo(0,-20);ctx.stroke();ctx.fillStyle="#f1548d";poly(ctx,[[-7,18],[0,9],[7,18],[0,28]]);ctx.fill();ctx.restore();if(s.dart.t>=1){ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(s.dart.x,s.dart.y,2.4,0,TAU);ctx.fill();}}
    ctx.fillStyle="rgba(0,0,0,.5)";rr(ctx,W*.27,12,W*.46,31,16);ctx.fill();label(ctx,s.thrown?s.detail:"ONE DART",W/2,28,10,s.thrown?"#ff7eae":"#fff");
  }

  /* ---------------- Bowling: one throw ---------------- */
  function makeBowlingState(){return{ballX:W/2,dragging:false,pointer:null,thrown:false,throwT:0,targetX:W/2,pinsDown:0,knocked:new Set(),resolved:false};}
  function bowlingPins(){
    const rows=[[0],[-.12,.12],[-.23,0,.23],[-.34,-.11,.11,.34]],out=[];let id=0;
    rows.forEach((row,r)=>row.forEach(x=>out.push({id:id++,nx:x,ny:r})));return out;
  }
  function resolveBowling(s){
    const center=W/2,offset=Math.abs(s.targetX-center)/(W*.30),base=Math.round(10-offset*13+(Math.random()*2-1));s.pinsDown=clamp(base,0,10);
    const pins=bowlingPins().sort((a,b)=>Math.abs((a.nx*W*.35+center)-s.targetX)-Math.abs((b.nx*W*.35+center)-s.targetX));pins.slice(0,s.pinsDown).forEach(p=>s.knocked.add(p.id));s.resolved=true;
  }
  function updateBowling(s,dt){
    if(!s.thrown)return;s.throwT+=dt*.78;if(s.throwT>=.98&&!s.resolved)resolveBowling(s);if(s.throwT>=1.62)finishGame(String(s.pinsDown),s.pinsDown===10?"STRIKE!":s.pinsDown===0?"GUTTER":`${s.pinsDown} PINS`);
  }
  function drawPin(x,y,scale,knocked,fall){
    ctx.save();ctx.translate(x,y);if(knocked){ctx.rotate((.9+((x*17)%8)/10)*Math.min(1,fall*3));ctx.translate(8*fall,8*fall);}
    ctx.scale(scale,scale);ctx.fillStyle="rgba(0,0,0,.35)";ctx.beginPath();ctx.ellipse(0,14,8,3,0,0,TAU);ctx.fill();
    const g=ctx.createLinearGradient(-7,-17,8,18);g.addColorStop(0,"#fff");g.addColorStop(.7,"#e8ecee");g.addColorStop(1,"#aeb4b8");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-4,-17);ctx.quadraticCurveTo(-8,-10,-5,-3);ctx.quadraticCurveTo(-12,12,-5,17);ctx.quadraticCurveTo(0,20,5,17);ctx.quadraticCurveTo(12,12,5,-3);ctx.quadraticCurveTo(8,-10,4,-17);ctx.closePath();ctx.fill();ctx.fillStyle="#dc2834";ctx.fillRect(-5,-8,10,3);ctx.fillRect(-6,-4,12,2);ctx.restore();
  }
  function drawBowling(s,t){
    const wall=ctx.createLinearGradient(0,0,0,H*.3);wall.addColorStop(0,"#241227");wall.addColorStop(1,"#74404f");ctx.fillStyle=wall;ctx.fillRect(0,0,W,H*.34);
    for(let i=0;i<7;i++){ctx.fillStyle=i%2?"rgba(255,255,255,.035)":"rgba(0,0,0,.06)";ctx.fillRect(i*W/7,0,W/7,H*.34);}
    ctx.fillStyle="#160f18";ctx.fillRect(0,H*.29,W,H*.08);
    const topY=H*.26,bottomY=H+10,topL=W*.31,topR=W*.69,botL=W*.055,botR=W*.945;
    const lane=ctx.createLinearGradient(0,topY,0,bottomY);lane.addColorStop(0,"#d3a96c");lane.addColorStop(1,"#f0c583");ctx.fillStyle=lane;poly(ctx,[[topL,topY],[topR,topY],[botR,bottomY],[botL,bottomY]]);ctx.fill();
    ctx.strokeStyle="rgba(92,54,25,.24)";ctx.lineWidth=1;for(let i=0;i<13;i++){const f=i/12;ctx.beginPath();ctx.moveTo(lerp(topL,topR,f),topY);ctx.lineTo(lerp(botL,botR,f),bottomY);ctx.stroke();}
    ctx.fillStyle="#1d2229";poly(ctx,[[topL-16,topY],[topL,topY],[botL,bottomY],[0,bottomY]]);ctx.fill();poly(ctx,[[topR,topY],[topR+16,topY],[W,bottomY],[botR,bottomY]]);ctx.fill();
    const pins=bowlingPins(),fall=Math.max(0,s.throwT-.96);
    pins.slice().reverse().forEach(p=>{const y=H*.235+p.ny*H*.034,x=W/2+p.nx*W*.38,scale=.48+p.ny*.055;drawPin(x,y,scale,s.knocked.has(p.id),fall);});
    let bx=s.ballX,by=H*.84,br=clamp(W*.055,14,21);
    if(s.thrown){const q=ease(Math.min(s.throwT,1));by=lerp(H*.84,H*.285,q);bx=lerp(s.ballX,s.targetX,q);br=lerp(br,br*.38,q);}
    ctx.save();ctx.shadowColor="rgba(0,0,0,.55)";ctx.shadowBlur=9;ctx.shadowOffsetY=5;const ball=ctx.createRadialGradient(bx-br*.35,by-br*.4,2,bx,by,br);ball.addColorStop(0,"#ff8d9b");ball.addColorStop(.35,"#d62c50");ball.addColorStop(1,"#4b0a1e");ctx.fillStyle=ball;ctx.beginPath();ctx.arc(bx,by,br,0,TAU);ctx.fill();ctx.restore();
    ctx.fillStyle="#171118";for(let i=0;i<3;i++){const a=-.8+i*.55;ctx.beginPath();ctx.arc(bx+Math.cos(a)*br*.35,by-br*.18+Math.sin(a)*br*.23,br*.09,0,TAU);ctx.fill();}
    if(!s.thrown&&phase==="playing"){ctx.save();ctx.setLineDash([5,6]);ctx.strokeStyle="rgba(255,255,255,.6)";ctx.beginPath();ctx.moveTo(s.ballX,H*.79);ctx.lineTo(s.pointer?.x??W/2,H*.31);ctx.stroke();ctx.restore();}
    if(s.resolved){label(ctx,s.pinsDown===10?"STRIKE!":`${s.pinsDown} PINS`,W/2,H*.12,19,s.pinsDown===10?"#ffd867":"#fff");}
  }

  /* ---------------- Ring Toss: three-ring round ---------------- */
  function ringBottles(){
    const rows=[3,4,4,4],out=[];let id=0;
    rows.forEach((count,row)=>{const y=H*(.31+row*.095),spread=W*(.12+row*.015);for(let i=0;i<count;i++){const x=W/2+(i-(count-1)/2)*spread;out.push({id:id++,x,y,scale:.58+row*.105});}});return out;
  }
  function drawBottle(b){
    ctx.save();ctx.translate(b.x,b.y);ctx.scale(b.scale,b.scale);ctx.fillStyle="rgba(0,0,0,.34)";ctx.beginPath();ctx.ellipse(0,25,14,4,0,0,TAU);ctx.fill();
    const g=ctx.createLinearGradient(-11,-24,12,28);g.addColorStop(0,"#61a073");g.addColorStop(.25,"#1e6b42");g.addColorStop(1,"#0b3323");ctx.fillStyle=g;rr(ctx,-11,-5,22,31,7);ctx.fill();rr(ctx,-5,-26,10,24,3);ctx.fill();ctx.fillStyle="#d8c08a";rr(ctx,-12,7,24,12,2);ctx.fill();label(ctx,"D",0,13,8,"#275035");ctx.fillStyle="#d8b766";ctx.fillRect(-5,-27,10,3);ctx.restore();
  }
  function updateRingToss(s,dt){
    const f=s.flight;if(!f)return;f.t+=dt*1.35;
    if(f.t>=1&&!f.settled){f.settled=true;const bottles=ringBottles();let best=null,bestD=Infinity;bottles.forEach((b,i)=>{const d=Math.hypot(f.target.x-b.x,f.target.y-b.y);if(d<bestD){bestD=d;best={b,i};}});f.hit=bestD<32;if(f.hit){s.landed++;s.score=s.landed;s.landedAt.push(best.i);}f.wait=0;}
    if(f.settled){f.wait+=dt;if(f.wait>.55){if(s.ringsLeft<=0)finishGame(String(s.landed),`${s.landed}/3 LANDED`);else s.flight=null;}}
  }
  function drawRingToss(s,t){
    const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,"#251b2b");bg.addColorStop(.48,"#5c2734");bg.addColorStop(1,"#161014");ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="rgba(245,180,117,.13)";ctx.lineWidth=1;const bw=44,bh=23;for(let y=0;y<H*.56;y+=bh)for(let x=-(Math.floor(y/bh)%2)*bw/2;x<W;x+=bw)ctx.strokeRect(x,y,bw,bh);
    ctx.fillStyle="#173c2d";poly(ctx,[[0,H*.43],[W,H*.43],[W,H],[0,H]]);ctx.fill();ctx.fillStyle="#2f714d";poly(ctx,[[0,H*.43],[W,H*.43],[W,H*.59],[0,H*.59]]);ctx.fill();
    const bottles=ringBottles();bottles.forEach(drawBottle);
    s.landedAt.forEach(i=>{const b=bottles[i];if(!b)return;ctx.save();ctx.translate(b.x,b.y-b.scale*3);ctx.scale(1,b.scale*.55);ctx.strokeStyle="#ffd54d";ctx.lineWidth=5;ctx.shadowColor="#ffcc39";ctx.shadowBlur=8;ctx.beginPath();ctx.arc(0,0,18*b.scale,0,TAU);ctx.stroke();ctx.restore();});
    let rx=W/2,ry=H*.88,scale=1;
    if(s.dragging&&s.pointer){rx=s.pointer.x;ry=s.pointer.y;}
    if(s.flight){const q=ease(Math.min(s.flight.t,1)),inv=1-q,control={x:(s.flight.start.x+s.flight.target.x)/2,y:Math.min(s.flight.start.y,s.flight.target.y)-H*.22};rx=inv*inv*s.flight.start.x+2*inv*q*control.x+q*q*s.flight.target.x;ry=inv*inv*s.flight.start.y+2*inv*q*control.y+q*q*s.flight.target.y;scale=lerp(1,.55,q);}
    if(!s.flight){ctx.strokeStyle="rgba(255,255,255,.18)";ctx.lineWidth=1;ctx.beginPath();ctx.arc(rx,ry,31,0,TAU);ctx.stroke();}
    ctx.save();ctx.translate(rx,ry);ctx.scale(1,scale*.55);ctx.strokeStyle="#ffd34a";ctx.lineWidth=8*scale;ctx.shadowColor="#ffca31";ctx.shadowBlur=10;ctx.beginPath();ctx.arc(0,0,23*scale,0,TAU);ctx.stroke();ctx.strokeStyle="rgba(255,249,190,.8)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-2,22*scale,Math.PI*1.05,Math.PI*1.8);ctx.stroke();ctx.restore();
    ctx.fillStyle="rgba(0,0,0,.45)";rr(ctx,W*.27,12,W*.46,30,15);ctx.fill();label(ctx,`${s.ringsLeft} RINGS LEFT`,W/2,27,9,"#ffe37d");
  }

  /* ---------------- Road Rush: boosted obstacle run ---------------- */
  function makeRoadRushState(){
    return{carX:0,control:0,road:0,speed:.66,distance:0,score:0,dragging:false,obstacles:[{x:-.62,z:.16,type:0},{x:.62,z:.48,type:1},{x:0,z:.78,type:2}]};
  }
  function updateRoadRush(s,dt,t){
    const steer=(steering.right?1:0)-(steering.left?1:0);if(steer)s.control=steer;else if(!s.dragging)s.control*=Math.pow(.04,dt);
    s.carX=clamp(s.carX+s.control*dt*1.42,-1.02,1.02);s.speed=Math.min(1.18,s.speed+dt*.022);s.road+=dt*(.52+s.speed*.33);s.distance+=dt*(88+s.speed*56);s.score=Math.floor(s.distance);
    s.obstacles.forEach(o=>{o.z+=dt*(.19+s.speed*.13);if(o.z>1.13){o.z-=1.15;o.x=choice([-.68,0,.68]);o.type=Math.floor(Math.random()*3);}if(o.z>.84&&o.z<1.04&&Math.abs(o.x-s.carX)<.28){finishGame(`${Math.floor(s.distance)} m`,"CRASHED");}});
  }
  function drawRoadRush(s,t){
    const curve=Math.sin(t*.38)*.22,road=drawPerspectiveRoad(s.road,curve,"night"),carY=H*.81,edge=roadEdges(carY,road.horizon,road.bottom,curve),laneHalf=(edge.right-edge.left)*.43;
    const trafficColors=["#f4c443","#65c8ed","#be4aef"];
    s.obstacles.slice().sort((a,b)=>a.z-b.z).forEach(o=>{const y=lerp(road.horizon+4,H*.84,o.z*o.z),e=roadEdges(y,road.horizon,road.bottom,curve),x=e.center+o.x*(e.right-e.left)*.47,sc=.22+o.z*.62;drawCar(ctx,x,y,sc,trafficColors[o.type%trafficColors.length],0,false);});
    const carX=edge.center+s.carX*laneHalf;drawCar(ctx,carX,carY,clamp(W/390,.78,1),"#5a7fff",s.control*.08,true);
    ctx.fillStyle="rgba(0,0,0,.5)";rr(ctx,12,13,104,43,6);ctx.fill();label(ctx,"DISTANCE",22,25,7,"rgba(255,255,255,.56)","left");label(ctx,`${Math.floor(s.distance)} m`,22,43,15,"#8eb4ff","left");
    ctx.fillStyle="rgba(25,61,136,.6)";rr(ctx,W-104,14,92,24,12);ctx.fill();label(ctx,"BOOSTING",W-58,26,8,"#9fe9ff");
  }

  /* ---------------- input ---------------- */
  function pointerDown(e){
    if(phase!=="playing")return;
    const p=canvasPoint(e);pointerID=e.pointerId;canvas.setPointerCapture?.(e.pointerId);
    if(gameID==="wordhunt"){
      const i=wordTileAt(p);if(i>=0){gameState.dragging=true;gameState.selection=[i];gameState.pointer=p;}
    } else if(gameID==="pool"){
      const cue=gameState.balls[0];if(cue?.active&&!ballsMoving(gameState)&&dist(p,cue)<Math.max(60,W*.17)){gameState.dragging=true;gameState.aim=p;}
    } else if(gameID==="darts"){
      if(!gameState.thrown)gameState.hover=p;
    } else if(gameID==="bowling"){
      if(!gameState.thrown&&Math.hypot(p.x-gameState.ballX,p.y-H*.84)<70){gameState.dragging=true;gameState.pointer=p;gameState.dragStart={...p};}
    } else if(gameID==="ringtoss"){
      if(!gameState.flight&&gameState.ringsLeft>0&&p.y>H*.68){gameState.dragging=true;gameState.pointer=p;gameState.dragStart={x:W/2,y:H*.88};}
    } else if(gameID==="drift"||gameID==="roadrush"){
      gameState.dragging=true;gameState.lastPointerX=p.x;
    }
  }
  function pointerMove(e){
    const p=canvasPoint(e);
    if(gameID==="darts"&&phase==="playing"&&!gameState.thrown){gameState.hover=p;return;}
    if(phase!=="playing"||pointerID!==e.pointerId)return;
    if(gameID==="wordhunt"&&gameState.dragging){
      gameState.pointer=p;const i=wordTileAt(p),sel=gameState.selection;if(i<0||i===sel[sel.length-1])return;
      if(sel.length>1&&i===sel[sel.length-2]){sel.pop();return;}
      if(sel.includes(i))return;const last=sel[sel.length-1],r1=Math.floor(last/4),c1=last%4,r2=Math.floor(i/4),c2=i%4;if(Math.abs(r1-r2)<=1&&Math.abs(c1-c2)<=1)sel.push(i);
    } else if(gameID==="pool"&&gameState.dragging)gameState.aim=p;
    else if(gameID==="bowling"&&gameState.dragging){gameState.pointer=p;gameState.ballX=clamp(p.x,W*.18,W*.82);}
    else if(gameID==="ringtoss"&&gameState.dragging)gameState.pointer=p;
    else if((gameID==="drift"||gameID==="roadrush")&&gameState.dragging){const dx=(p.x-gameState.lastPointerX)/Math.max(W*.16,1);gameState.control=clamp(dx,-1,1);gameState.carX=clamp(gameState.carX+dx*.17,-1.05,1.05);gameState.lastPointerX=p.x;}
  }
  function pointerUp(e){
    if(phase!=="playing"||pointerID!==e.pointerId)return;const p=canvasPoint(e);pointerID=null;
    if(gameID==="wordhunt"&&gameState.dragging){
      const w=wordString(gameState).toLowerCase();if(WORDS.has(w)&&!gameState.found.has(w)){const points=wordPoints(w.length);gameState.found.add(w);gameState.score+=points;gameState.flash={word:w,points};gameState.flashLife=.8;}gameState.dragging=false;gameState.selection=[];
    } else if(gameID==="pool"&&gameState.dragging){
      const cue=gameState.balls[0],dx=cue.x-p.x,dy=cue.y-p.y,d=Math.hypot(dx,dy);if(d>10){const power=Math.min(d,120)*3.9;cue.vx=dx/d*power;cue.vy=dy/d*power;gameState.shots++;}gameState.dragging=false;gameState.aim=null;
    } else if(gameID==="darts"&&!gameState.thrown){
      const b=dartBoard(),shot={x:clamp(p.x,b.cx-b.r*1.12,b.cx+b.r*1.12),y:clamp(p.y,b.cy-b.r*1.12,b.cy+b.r*1.12)},hit=dartScore(shot);gameState.thrown=true;gameState.dart={...shot,t:0};gameState.score=hit.score;gameState.detail=hit.detail;
    } else if(gameID==="bowling"&&gameState.dragging){
      const dy=p.y-gameState.dragStart.y;if(dy<-24){gameState.thrown=true;gameState.throwT=0;gameState.targetX=clamp(p.x+(p.x-gameState.dragStart.x)*.45,W*.24,W*.76);}gameState.dragging=false;
    } else if(gameID==="ringtoss"&&gameState.dragging){
      if(p.y<H*.72){gameState.ringsLeft--;gameState.flight={start:{x:W/2,y:H*.88},target:{x:clamp(p.x,20,W-20),y:clamp(p.y,H*.18,H*.62)},t:0,settled:false,wait:0,hit:false};}gameState.dragging=false;gameState.pointer=null;
    } else if(gameID==="drift"||gameID==="roadrush"){gameState.dragging=false;gameState.control*=.45;}
    syncHud();
  }

  tabs.forEach((tab,index)=>{
    tab.addEventListener("click",()=>{gameID=tab.dataset.arcadeGame;showReady();});
    tab.addEventListener("keydown",event=>{
      if(event.key!=="ArrowLeft"&&event.key!=="ArrowRight")return;
      event.preventDefault();
      const step=event.key==="ArrowRight"?1:-1;
      const next=tabs[(index+step+tabs.length)%tabs.length];
      gameID=next.dataset.arcadeGame;showReady();next.focus();
    });
  });
  startButton.addEventListener("click",startGame);
  canvas.addEventListener("pointerdown",pointerDown);
  canvas.addEventListener("pointermove",pointerMove);
  canvas.addEventListener("pointerup",pointerUp);
  canvas.addEventListener("pointercancel",pointerUp);

  driveButtons.forEach(button=>{
    const dir=button.dataset.drive;
    const down=e=>{if(phase!=="playing")return;e.preventDefault();steering[dir]=true;button.classList.add("is-down");};
    const up=e=>{e.preventDefault();steering[dir]=false;button.classList.remove("is-down");};
    button.addEventListener("pointerdown",down);button.addEventListener("pointerup",up);button.addEventListener("pointercancel",up);button.addEventListener("pointerleave",up);
  });
  addEventListener("keydown",e=>{
    if(!stage.matches(":hover")&&!root.contains(document.activeElement))return;
    if(e.key==="ArrowLeft"){steering.left=true;e.preventDefault();}
    if(e.key==="ArrowRight"){steering.right=true;e.preventDefault();}
    if((e.key===" "||e.key==="Enter")&&phase!=="playing"){startGame();e.preventDefault();}
  });
  addEventListener("keyup",e=>{if(e.key==="ArrowLeft")steering.left=false;if(e.key==="ArrowRight")steering.right=false;});
  document.addEventListener("visibilitychange",()=>{lastFrame=performance.now();resetControls();});

  new ResizeObserver(resizeCanvas).observe(stage);
  resizeCanvas();
  showReady();
  requestAnimationFrame(loop);
})();
