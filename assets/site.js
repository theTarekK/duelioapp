/* ============================================================
   Duelio — duelioapp.com
   Vanilla JS. No dependencies, no build step.
   ============================================================ */
(() => {
  "use strict";

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- games catalog ---------------- */
  // cat: board | sports | words | cards | racing | party
  const GAMES = [
    { n: "Chess",            e: "♟️", c: "board" },
    { n: "Checkers",         e: "🔴", c: "board" },
    { n: "Backgammon",       e: "🎲", c: "board" },
    { n: "Tic Tac Toe",      e: "❌", c: "board" },
    { n: "Dots & Boxes",     e: "🟦", c: "board" },
    { n: "Four in a Row",    e: "🟡", c: "board" },
    { n: "Word Tiles",       e: "🅰️", c: "board" },
    { n: "Pool",             e: "🎱", c: "sports" },
    { n: "Bowling",          e: "🎳", c: "sports" },
    { n: "Darts",            e: "🎯", c: "sports" },
    { n: "Ring Toss",        e: "🍾", c: "sports" },
    { n: "Word Hunt",        e: "🔍", c: "words" },
    { n: "Word Hunt Plus",   e: "🔎", c: "words" },
    { n: "Anagrams",         e: "🔀", c: "words" },
    { n: "Word Shift",       e: "🧩", c: "words" },
    { n: "Word Bomb",        e: "💣", c: "words", live: true },
    { n: "Spelling Bee",     e: "🐝", c: "words", live: true },
    { n: "Showdown",         e: "🃏", c: "cards", live: true },
    { n: "Perfect 21",       e: "♠️", c: "cards", live: true },
    { n: "Go Fish",          e: "🐟", c: "cards", live: true },
    { n: "Road Rush",        e: "🏎️", c: "racing" },
    { n: "Drift",            e: "🏁", c: "racing" },
    { n: "Draw",             e: "🎨", c: "party", live: true },
    { n: "Trivia Rush",      e: "🧠", c: "party", live: true },
    { n: "Insider",          e: "🕵️", c: "party", live: true },
    { n: "2 Truths & 1 Lie", e: "🤥", c: "party", live: true },
    { n: "Landmark",         e: "🗺️", c: "party", live: true },
    { n: "Party Games",      e: "🎉", c: "party", live: true, soon: true },
  ];

  /* ---------------- games grid + filters ---------------- */
  const grid = document.getElementById("games-grid");
  if (grid) {
    grid.innerHTML = GAMES.map(g => `
      <div class="game-tile" data-cat="${g.c}">
        ${g.soon ? '<span class="badge-soon">SOON</span>' : g.live ? '<span class="badge-live">LIVE</span>' : ""}
        <span class="g-emoji">${g.e}</span>
        <span class="g-name">${g.n}</span>
      </div>`).join("");

    const filters = document.getElementById("filters");
    filters.addEventListener("click", (ev) => {
      const btn = ev.target.closest(".chip");
      if (!btn) return;
      filters.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === btn));
      const f = btn.dataset.filter;
      grid.querySelectorAll(".game-tile").forEach(t => {
        const show = f === "all" || t.dataset.cat === f;
        t.classList.toggle("hidden", !show);
        if (show) { // retrigger pop-in
          t.style.animation = "none";
          void t.offsetWidth;
          t.style.animation = "";
        }
      });
    });
  }

  /* ---------------- marquee ---------------- */
  const track = document.getElementById("marquee-track");
  if (track) {
    const pills = GAMES.filter(g => !g.soon)
      .map(g => `<span class="pill">${g.e} <b>${g.n}</b></span>`).join("");
    track.innerHTML = pills + pills; // duplicated for a seamless -50% loop
  }

  /* ---------------- nav scroll state ---------------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", scrollY > 24);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- scroll reveals ---------------- */
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  /* ---------------- animated counters ---------------- */
  const cio = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      cio.unobserve(en.target);
      const el = en.target, target = +el.dataset.count, t0 = performance.now();
      if (reduceMotion) { el.textContent = target; continue; }
      const tick = (t) => {
        const p = Math.min((t - t0) / 900, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.6 });
  document.querySelectorAll(".count").forEach(el => cio.observe(el));

  /* ---------------- tilt cards ---------------- */
  if (!reduceMotion && matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".tilt").forEach(card => {
      card.addEventListener("pointermove", (ev) => {
        const r = card.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
        card.style.setProperty("--ry", ((px - 0.5) * 10).toFixed(2) + "deg");
        card.style.setProperty("--rx", ((0.5 - py) * 10).toFixed(2) + "deg");
        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });

    /* magnetic buttons */
    document.querySelectorAll(".magnetic").forEach(btn => {
      btn.addEventListener("pointermove", (ev) => {
        const r = btn.getBoundingClientRect();
        const dx = ev.clientX - (r.left + r.width / 2);
        const dy = ev.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${dx * 0.12}px, ${dy * 0.22}px)`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------------- iMessage chat loop ---------------- */
  const thread = document.getElementById("thread");
  if (thread) {
    const bubbles = [...thread.querySelectorAll(".bubble")];
    const typing = thread.querySelector(".typing");
    const SCRIPT = [
      [1, 600], [2, 900],   // friend talks, then "me" starts typing…
      [3, 1400],            // …typing resolves into the reply
      [4, 1100], [5, 1200], // game invite card, then the comeback
    ];
    let timer;
    const reset = () => {
      // instant clear — a slow fade-out here reads as a glitch, not a reset
      bubbles.forEach(b => {
        b.style.transition = "none";
        b.classList.remove("on");
      });
      typing.classList.remove("done");
      void thread.offsetWidth;
      bubbles.forEach(b => { b.style.transition = ""; });
    };
    const play = () => {
      reset();
      let t = 400;
      for (const [step, dur] of SCRIPT) {
        const el = thread.querySelector(`[data-step="${step}"]`);
        timer = setTimeout(() => {
          if (step === 3) typing.classList.add("done"); // typing dots swap for the text
          el.classList.add("on");
        }, t);
        t += dur;
      }
      timer = setTimeout(play, t + 3200); // linger, then loop
    };
    if (reduceMotion) {
      bubbles.forEach(b => b.classList.add("on"));
      typing.classList.add("done");
    } else {
      play();
      document.addEventListener("visibilitychange", () => {
        clearTimeout(timer);
        if (!document.hidden) play(); else reset();
      });
    }
  }

  /* ---------------- hero canvas: drifting glyphs + flickable 8-ball ---------------- */
  const canvas = document.getElementById("fx");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(devicePixelRatio || 1, 2);
    let W = 0, H = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    // background glyphs, drifting with depth-based parallax
    const GLYPHS = ["🎱", "🎳", "🎯", "♟️", "🃏", "💣", "🐝", "🏎️", "🎨", "🎲", "🅰️", "🐟"];
    const rand = (a, b) => a + Math.random() * (b - a);
    const glyphs = GLYPHS.map((g) => ({
      g,
      x: Math.random(), y: Math.random(),
      z: rand(0.25, 1),                       // depth: size, speed, opacity
      vx: rand(-0.012, 0.012), vy: rand(-0.009, 0.009),
      rot: rand(-0.5, 0.5), vr: rand(-0.1, 0.1),
    }));

    // sparkle dust
    const dust = Array.from({ length: 70 }, () => ({
      x: Math.random(), y: Math.random(),
      z: rand(0.2, 1), tw: rand(0, Math.PI * 2),
    }));

    // the flickable 8-ball
    const ball = {
      x: W * 0.62, y: H * 0.3, r: 26,
      vx: 40, vy: 25,
      grabbed: false, gx: 0, gy: 0,
      px: 0, py: 0, pt: 0, // previous pointer sample for flick velocity
    };

    const mouse = { x: 0.5, y: 0.5 };
    canvas.parentElement.addEventListener("pointermove", (ev) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (ev.clientX - r.left) / W;
      mouse.y = (ev.clientY - r.top) / H;
    }, { passive: true });

    // grab / flick — listeners on the hero so text stays selectable elsewhere
    const hitBall = (ev) => {
      const r = canvas.getBoundingClientRect();
      const x = ev.clientX - r.left, y = ev.clientY - r.top;
      return Math.hypot(x - ball.x, y - ball.y) < ball.r + 14 ? { x, y } : null;
    };
    const hero = canvas.parentElement;
    hero.addEventListener("pointerdown", (ev) => {
      const p = hitBall(ev);
      if (!p) return;
      ball.grabbed = true;
      ball.gx = p.x - ball.x; ball.gy = p.y - ball.y;
      ball.px = p.x; ball.py = p.y; ball.pt = performance.now();
      ball.vx = ball.vy = 0;
      hero.style.cursor = "grabbing";
      ev.preventDefault();
    });
    addEventListener("pointermove", (ev) => {
      if (!ball.grabbed) {
        hero.style.cursor = hitBall(ev) ? "grab" : "";
        return;
      }
      const r = canvas.getBoundingClientRect();
      const x = ev.clientX - r.left, y = ev.clientY - r.top;
      const now = performance.now(), dt = Math.max(now - ball.pt, 1) / 1000;
      ball.vx = (x - ball.px) / dt; ball.vy = (y - ball.py) / dt;
      ball.px = x; ball.py = y; ball.pt = now;
      ball.x = x - ball.gx; ball.y = y - ball.gy;
    });
    addEventListener("pointerup", () => {
      if (!ball.grabbed) return;
      ball.grabbed = false;
      hero.style.cursor = "";
      // cap flick speed so it stays classy
      const s = Math.hypot(ball.vx, ball.vy), MAX = 1400;
      if (s > MAX) { ball.vx *= MAX / s; ball.vy *= MAX / s; }
    });

    const drawBall = () => {
      const { x, y, r } = ball;
      ctx.save();
      // shadowy glow
      ctx.beginPath(); ctx.arc(x, y + 4, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.filter = "blur(6px)"; ctx.fill();
      ctx.filter = "none";
      // body
      const g = ctx.createRadialGradient(x - r * 0.4, y - r * 0.45, r * 0.1, x, y, r);
      g.addColorStop(0, "#3d4568");
      g.addColorStop(0.55, "#151827");
      g.addColorStop(1, "#0a0c16");
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = "rgba(120,140,255,0.5)"; ctx.lineWidth = 1.2; ctx.stroke();
      // number patch
      ctx.beginPath(); ctx.arc(x, y, r * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = "#e8ebff"; ctx.fill();
      ctx.fillStyle = "#0a0c16";
      ctx.font = `700 ${r * 0.55}px ${getComputedStyle(document.body).fontFamily}`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("8", x, y + r * 0.03);
      // specular highlight
      ctx.beginPath(); ctx.ellipse(x - r * 0.38, y - r * 0.45, r * 0.16, r * 0.1, -0.6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.fill();
      ctx.restore();
    };

    let last = performance.now();
    let running = true;
    const frame = (now) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, W, H);

      // dust
      for (const d of dust) {
        d.tw += dt * 2;
        const px = (mouse.x - 0.5) * 20 * d.z, py = (mouse.y - 0.5) * 14 * d.z;
        const a = 0.12 + 0.1 * Math.sin(d.tw);
        ctx.globalAlpha = a * d.z;
        ctx.fillStyle = "#aebbff";
        ctx.fillRect(d.x * W + px, d.y * H + py, 1.6, 1.6);
      }
      ctx.globalAlpha = 1;

      // glyphs
      for (const s of glyphs) {
        s.x += s.vx * dt; s.y += s.vy * dt; s.rot += s.vr * dt;
        if (s.x < -0.08) s.x = 1.08; if (s.x > 1.08) s.x = -0.08;
        if (s.y < -0.08) s.y = 1.08; if (s.y > 1.08) s.y = -0.08;
        const px = (mouse.x - 0.5) * 34 * s.z, py = (mouse.y - 0.5) * 24 * s.z;
        ctx.save();
        ctx.translate(s.x * W + px, s.y * H + py);
        ctx.rotate(s.rot);
        ctx.globalAlpha = 0.1 + 0.16 * s.z;
        ctx.font = `${14 + s.z * 26}px sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(s.g, 0, 0);
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      // 8-ball physics
      if (!ball.grabbed) {
        ball.x += ball.vx * dt; ball.y += ball.vy * dt;
        const damp = Math.pow(0.45, dt); // exponential friction
        ball.vx *= damp; ball.vy *= damp;
        // cushion bounces
        if (ball.x < ball.r) { ball.x = ball.r; ball.vx = Math.abs(ball.vx) * 0.85; }
        if (ball.x > W - ball.r) { ball.x = W - ball.r; ball.vx = -Math.abs(ball.vx) * 0.85; }
        if (ball.y < ball.r) { ball.y = ball.r; ball.vy = Math.abs(ball.vy) * 0.85; }
        if (ball.y > H - ball.r) { ball.y = H - ball.r; ball.vy = -Math.abs(ball.vy) * 0.85; }
        // gentle idle drift so it never fully dies
        if (Math.hypot(ball.vx, ball.vy) < 6) { ball.vx += rand(-4, 4); ball.vy += rand(-3, 3); }
      } else {
        ball.x = Math.max(ball.r, Math.min(W - ball.r, ball.x));
        ball.y = Math.max(ball.r, Math.min(H - ball.r, ball.y));
      }
      drawBall();

      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    // pause when the tab is hidden or the hero is off-screen
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) { last = performance.now(); requestAnimationFrame(frame); }
    });
    new IntersectionObserver(([en]) => {
      const was = running;
      running = en.isIntersecting && !document.hidden;
      if (running && !was) { last = performance.now(); requestAnimationFrame(frame); }
    }).observe(canvas);
  }

  /* ---------------- copy email (support page) ---------------- */
  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        const prev = btn.textContent;
        btn.textContent = "Copied ✓";
        btn.classList.add("copied");
        setTimeout(() => { btn.textContent = prev; btn.classList.remove("copied"); }, 1600);
      } catch { location.href = "mailto:" + btn.dataset.copy; }
    });
  });

  /* ---------------- footer year ---------------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
