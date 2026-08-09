(() => {
  "use strict";

  const sections = [
    { id: "pro", label: "PRO", title: "DUELIO PRO", tagline: "Everything, one purchase", thumb: "/assets/img/pro-icon.png", thumbClass: "pro" },
    { id: "pool", label: "POOL", title: "POOL", tagline: "Cues, tables & the builder", thumb: "/assets/shop/shopRenderPoolComplete.webp" },
    { id: "bowling", label: "BOWLING", title: "BOWLING", tagline: "Balls & the 21-pin deck", thumb: "/assets/img/covers/bowling.webp" },
    { id: "darts", label: "DARTS", title: "DARTS", tagline: "Throwables", thumb: "/assets/img/covers/darts.webp" },
    { id: "ringtoss", label: "RING TOSS", title: "RING TOSS", tagline: "Rings & bands", thumb: "/assets/img/covers/ringtoss.webp" },
    { id: "racing", label: "RACING", title: "RACING", tagline: "Car bundles for Road Rush & Drift", thumb: "/assets/img/covers/roadrush.webp" },
    { id: "chess", label: "CHESS", title: "CHESS", tagline: "Boards & piece sets", thumb: "/assets/shop/shopRenderChessBoards.webp" },
    { id: "cards", label: "CARDS", title: "CARDS", tagline: "The Pixel deck", thumb: "/assets/img/covers/cards.webp" },
    { id: "perks", label: "PERKS", title: "PERKS", tagline: "Hints, 50/50 & reveals", thumbClass: "perks" },
  ];

  const products = [
    {
      id: "duelio.pro", name: "Duelio Pro", price: "$9.99", category: "pro",
      shelf: "Everything, one purchase", layout: "hero", art: "icon",
      description: "Gold player name, exclusive characters, game builders, cosmetics and Pro-only perks in one permanent upgrade.",
      image: "/assets/img/pro-icon.png",
      features: ["Exclusive characters", "Game builders", "Gold player name", "Pro cosmetics"],
    },

    { id: "pool.complete", name: "Complete Pool Pack", price: "$19.99", category: "pool", shelf: "Bundles", description: "The complete collection of premium Pool customizations.", image: "/assets/shop/shopRenderPoolComplete.webp", meta: "COMPLETE COLLECTION" },
    { id: "pool.beast", name: "Beast Bundle", price: "$4.99", category: "pool", shelf: "Bundles", description: "The Beast table with its matching cue collection.", image: "/assets/shop/shopRenderPoolBeast.webp" },
    { id: "pool.aquatic", name: "Aquatic Bundle", price: "$3.99", category: "pool", shelf: "Bundles", description: "The Aquatic table with its matching cue collection.", image: "/assets/shop/shopRenderPoolAquatic.webp" },
    { id: "pool.overgrown", name: "Overgrown Bundle", price: "$3.99", category: "pool", shelf: "Bundles", description: "The Overgrown table with its matching cue collection.", image: "/assets/shop/shopRenderPoolOvergrown.webp" },
    { id: "pool.icefire", name: "Ice & Fire Bundle", price: "$3.99", category: "pool", shelf: "Bundles", description: "The Ice & Fire table with its matching cue collection.", image: "/assets/shop/shopRenderPoolIceFire.webp" },
    { id: "pool.nebula", name: "Nebula Bundle", price: "$3.99", category: "pool", shelf: "Bundles", description: "The Nebula table with its matching cue collection.", image: "/assets/shop/shopRenderPoolNebula.webp" },
    { id: "pool.voyager", name: "Voyager Bundle", price: "$3.99", category: "pool", shelf: "Bundles", description: "The Voyager table with its matching cue collection.", image: "/assets/shop/shopRenderPoolVoyager.webp" },
    { id: "pool.highroller", name: "High Roller Bundle", price: "$3.99", category: "pool", shelf: "Bundles", description: "The High Roller table with its matching cue collection.", image: "/assets/shop/shopRenderPoolHighRoller.webp" },
    { id: "pool.web", name: "Web Table", price: "$2.99", category: "pool", shelf: "Bundles", description: "Turn the Pool table into a striking web pattern.", image: "/assets/shop/shopRenderPoolWeb.webp" },
    { id: "pool.cuepack", name: "Premium Cue Pack", price: "$4.99", category: "pool", shelf: "Cue Sticks", description: "Expand your cue rack with the complete premium cue collection.", image: "/assets/shop/shopRenderPoolCuePack.webp", meta: "CUE COLLECTION" },
    { id: "cueRobot", name: "Circuit Breaker", price: "$1.99", category: "pool", shelf: "Cue Sticks", description: "The real mechanical cue used in Pool.", image: "/assets/shop/cueRobot.webp", art: "cue" },
    { id: "cueFinger", name: "The Pointer", price: "$1.99", category: "pool", shelf: "Cue Sticks", description: "The real Pointer cue used in Pool.", image: "/assets/shop/cueFinger.webp", art: "cue" },
    { id: "cueLaser", name: "Precision Beam", price: "$1.99", category: "pool", shelf: "Cue Sticks", description: "The real Precision Beam cue used in Pool.", image: "/assets/shop/cueLaser.webp", art: "cue" },
    { id: "cueBoxing", name: "Knockout", price: "$1.99", category: "pool", shelf: "Cue Sticks", description: "The real Knockout cue used in Pool.", image: "/assets/shop/cueBoxing.webp", art: "cue" },

    { id: "ball.ball_toxic.obj", name: "Toxic Swirl", price: "$0.99", category: "bowling", shelf: "Balls", description: "The Toxic Swirl ball from the in-game rack.", image: "/assets/shop/ball-toxic-render.png", art: "ball" },
    { id: "ball.ball_andromeda.obj", name: "Andromeda", price: "$1.99", category: "bowling", shelf: "Balls", description: "The Andromeda ball from the in-game rack.", image: "/assets/shop/ball-andromeda-render.png", art: "ball" },
    { id: "shopRenderBowlingSports", name: "Sports Pack", price: "$3.99", category: "bowling", shelf: "Sports Pack", layout: "hero", description: "Basketball, Soccer, Volleyball and the 8 Ball.", image: "/assets/shop/shopRenderBowlingSports.webp", meta: "4 BALLS" },

    { id: "shopRenderDartShuriken", name: "Shuriken", price: "$1.99", category: "darts", shelf: "Throwables", description: "The Shuriken throwable shown in Duelio's Darts shop.", image: "/assets/shop/shopRenderDartShuriken.webp" },
    { id: "shopRenderDartKunai", name: "Kunai", price: "$1.99", category: "darts", shelf: "Throwables", description: "The Kunai throwable shown in Duelio's Darts shop.", image: "/assets/shop/shopRenderDartKunai.webp" },

    { id: "ring.wideBand", name: "Wide Band", price: "$0.99", category: "ringtoss", shelf: "Rings & Bands", description: "The Wide Band ring finish from Ring Toss.", image: "/assets/shop/ring-wide-render.png", art: "ring" },
    { id: "ring.waveBand", name: "Wave Band", price: "$0.99", category: "ringtoss", shelf: "Rings & Bands", description: "The Wave Band ring finish from Ring Toss.", image: "/assets/shop/ring-wave-render.png", art: "ring" },
    { id: "ring.carvedBand", name: "Carved Band", price: "$0.99", category: "ringtoss", shelf: "Rings & Bands", description: "The Carved Band ring finish from Ring Toss.", image: "/assets/shop/ring-carved-render.png", art: "ring" },

    { id: "bundle.sport", name: "Sports Bundle", price: "$3.99", category: "racing", shelf: "One Garage", layout: "hero", description: "Every sports car in the garage, shared by Road Rush and Drift.", image: "/assets/shop/shopRenderCarsSport.webp", meta: "BOTH GAMES" },
    { id: "bundle.luxury", name: "Luxury Bundle", price: "$3.99", category: "racing", shelf: "One Garage", layout: "hero", description: "The full lineup of styled rides, shared by Road Rush and Drift.", image: "/assets/shop/shopRenderCarsLuxury.webp", meta: "BOTH GAMES" },
    { id: "bundle.offroad", name: "Off-Road Bundle", price: "$3.99", category: "racing", shelf: "One Garage", layout: "hero", description: "The full lineup of rugged 4x4s, shared by Road Rush and Drift.", image: "/assets/shop/shopRenderCarsOffroad.webp", meta: "BOTH GAMES" },

    { id: "shopRenderChessBoards", name: "Board Pack", price: "$3.99", category: "chess", shelf: "Boards", layout: "hero", description: "The Crystal and Plant boards for Chess and Checkers.", image: "/assets/shop/shopRenderChessBoards.webp", meta: "2 BOARDS" },
    { id: "shopRenderChessWaterFire", name: "Water & Fire", price: "$1.99", category: "chess", shelf: "Piece Sets", description: "The Water & Fire piece set shown in the in-game shop.", image: "/assets/shop/shopRenderChessWaterFire.webp" },
    { id: "shopRenderChessPixel", name: "Pixel Pieces", price: "$1.99", category: "chess", shelf: "Piece Sets", description: "The Pixel piece set shown in the in-game shop.", image: "/assets/shop/shopRenderChessPixel.webp" },

    { id: "shopRenderCardsPixelDeck", name: "Pixel Deck", price: "$3.99", category: "cards", shelf: "The Pixel Deck", layout: "hero", description: "Its own card art, sound effects and font across Poker, Blackjack and Go Fish.", image: "/assets/shop/shopRenderCardsPixelDeck.webp", meta: "3 CARD GAMES" },

    { id: "hints.25", name: "25 Hints", price: "$1.99", category: "perks", shelf: "Hint Packs", description: "One hint currency shared across every supported game.", art: "hint" },
    { id: "hints.100", name: "100 Hints", price: "$4.99", category: "perks", shelf: "Hint Packs", description: "The larger-value pack for Duelio's shared hint wallet.", art: "hint", meta: "BEST VALUE" },
  ];

  const filterHost = document.getElementById("shop-filters");
  const grid = document.getElementById("product-grid");
  const resultCount = document.getElementById("shop-result-count");
  const selectorThumb = document.getElementById("selector-thumb");
  const selectorTitle = document.getElementById("selector-title");
  const selectorTagline = document.getElementById("selector-tagline");
  const selectorOpen = document.getElementById("selector-open");
  if (!filterHost || !grid || !resultCount || !selectorThumb || !selectorTitle || !selectorTagline || !selectorOpen) return;

  const sectionMap = new Map(sections.map((section) => [section.id, section]));
  let selectedSection = "pro";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let activeMarquees = [];

  function clearMarquees() {
    activeMarquees.forEach((controller) => controller.destroy());
    activeMarquees = [];
  }

  function makeMarquee(track, motionButton) {
    const originals = [...track.children];
    const abort = new AbortController();
    const { signal } = abort;
    const speed = Number(track.dataset.marqueeSpeed) || 16;
    const direction = Number(track.dataset.marqueeDirection) || 1;
    let cycleWidth = 0;
    let canLoop = false;
    let animationFrame = 0;
    let lastFrame = 0;
    let lastAutoWrite = 0;
    let visible = true;
    let hovered = false;
    let focused = false;
    let pointerActive = false;
    let userPaused = false;
    let resumeAt = 0;
    let rampStartedAt = 0;
    let pointerStartX = 0;
    let pointerStartScroll = 0;
    let mouseDragging = false;
    let suppressClick = false;
    let cloneGroups = 0;

    function appendCloneGroup() {
      originals.forEach((original) => {
        const clone = original.cloneNode(true);
        clone.classList.add("marquee-clone");
        clone.removeAttribute("data-product");
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("a, button, [tabindex]").forEach((control) => { control.tabIndex = -1; });
        track.appendChild(clone);
      });
      cloneGroups += 1;
    }

    appendCloneGroup();

    const firstClone = track.querySelector(".marquee-clone");

    function updateMotionButton() {
      const paused = userPaused || reducedMotion.matches;
      motionButton.textContent = paused ? "PLAY" : "PAUSE";
      motionButton.setAttribute("aria-label", `${paused ? "Start" : "Pause"} automatic ${track.dataset.marqueeShelf} scrolling`);
      motionButton.setAttribute("aria-pressed", String(userPaused));
    }

    function measure() {
      if (!firstClone || !originals[0]) return;
      cycleWidth = firstClone.offsetLeft - originals[0].offsetLeft;
      if (cycleWidth > 0) {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const groupsNeeded = Math.max(1, Math.ceil((track.clientWidth + gap) / cycleWidth));
        while (cloneGroups < groupsNeeded) appendCloneGroup();
      }
      canLoop = originals.length > 1 && cycleWidth > 0;
      motionButton.hidden = !canLoop;
      if (direction < 0 && canLoop && track.scrollLeft < 1) track.scrollLeft = cycleWidth;
    }

    function normalizePosition() {
      if (!cycleWidth) return;
      while (track.scrollLeft >= cycleWidth) track.scrollLeft -= cycleWidth;
      if (direction < 0 && track.scrollLeft <= 0) track.scrollLeft += cycleWidth;
    }

    function holdThenResume() {
      const now = performance.now();
      resumeAt = now + 1000;
      rampStartedAt = resumeAt;
    }

    function rampFactor(now) {
      if (now < resumeAt) return 0;
      if (!rampStartedAt) return 1;
      const u = Math.min(1, (now - rampStartedAt) / 3000);
      if (u >= 1) rampStartedAt = 0;
      return u * u * (3 - 2 * u);
    }

    function shouldMove() {
      return canLoop && visible && !document.hidden && !reducedMotion.matches &&
        !userPaused && !hovered && !focused && !pointerActive;
    }

    function tick(now) {
      if (!lastFrame) lastFrame = now;
      const elapsed = Math.min(64, now - lastFrame) / 1000;
      lastFrame = now;
      if (shouldMove()) {
        const distance = speed * elapsed * rampFactor(now) * direction;
        if (distance) {
          lastAutoWrite = now;
          track.scrollLeft += distance;
          if (direction > 0 && track.scrollLeft >= cycleWidth) track.scrollLeft -= cycleWidth;
          if (direction < 0 && track.scrollLeft <= 0) track.scrollLeft += cycleWidth;
        }
      }
      animationFrame = requestAnimationFrame(tick);
    }

    motionButton.addEventListener("click", () => {
      userPaused = !userPaused;
      if (!userPaused) holdThenResume();
      updateMotionButton();
    }, { signal });

    track.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") hovered = true;
    }, { signal });
    track.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") {
        hovered = false;
        holdThenResume();
      }
    }, { signal });
    track.addEventListener("focusin", () => { focused = true; }, { signal });
    track.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        focused = track.contains(document.activeElement);
        if (!focused) holdThenResume();
      });
    }, { signal });

    track.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
      pointerActive = true;
      pointerStartX = event.clientX;
      pointerStartScroll = track.scrollLeft;
      mouseDragging = false;
    }, { signal });
    track.addEventListener("pointermove", (event) => {
      if (!pointerActive || event.pointerType !== "mouse") return;
      const distance = event.clientX - pointerStartX;
      if (!mouseDragging && Math.abs(distance) < 12) return;
      if (!mouseDragging) {
        mouseDragging = true;
        suppressClick = true;
        track.setPointerCapture?.(event.pointerId);
      }
      track.scrollLeft = pointerStartScroll - distance;
      event.preventDefault();
    }, { signal, passive: false });
    const finishPointer = () => {
      if (!pointerActive) return;
      pointerActive = false;
      mouseDragging = false;
      normalizePosition();
      holdThenResume();
      if (suppressClick) setTimeout(() => { suppressClick = false; }, 0);
    };
    track.addEventListener("pointerup", finishPointer, { signal });
    track.addEventListener("pointercancel", finishPointer, { signal });
    addEventListener("pointerup", finishPointer, { signal });
    addEventListener("pointercancel", finishPointer, { signal });
    track.addEventListener("click", (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    }, { capture: true, signal });
    track.addEventListener("scroll", () => {
      if (performance.now() - lastAutoWrite < 90 || pointerActive) return;
      holdThenResume();
    }, { passive: true, signal });
    track.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const card = originals[0];
      const step = (card?.getBoundingClientRect().width || 160) + 8;
      track.scrollBy({ left: event.key === "ArrowRight" ? step : -step, behavior: "smooth" });
      holdThenResume();
    }, { signal });

    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.05 });
    intersection.observe(track);
    const resize = new ResizeObserver(measure);
    resize.observe(track);
    reducedMotion.addEventListener?.("change", updateMotionButton, { signal });

    requestAnimationFrame(measure);
    updateMotionButton();
    animationFrame = requestAnimationFrame(tick);

    return {
      destroy() {
        cancelAnimationFrame(animationFrame);
        intersection.disconnect();
        resize.disconnect();
        abort.abort();
      },
    };
  }

  function makeOpenMark() {
    const mark = document.createElement("span");
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "↗";
    return mark;
  }

  function makeCard(product) {
    const article = document.createElement("article");
    article.className = "product-card";
    article.dataset.product = product.id;

    const art = document.createElement("div");
    art.className = "product-art" + (product.art ? ` ${product.art}` : "");
    art.style.setProperty("--product-glow", product.category === "racing" ? "rgba(254, 81, 0, 0.23)" : "rgba(29, 137, 233, 0.22)");
    if (product.image) {
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = product.name;
      image.loading = "lazy";
      image.decoding = "async";
      art.appendChild(image);
    }

    const body = document.createElement("div");
    body.className = "product-body";
    const titleRow = document.createElement("div");
    titleRow.className = "product-title-row";
    const title = document.createElement("h3");
    title.className = "product-title";
    title.textContent = product.name;
    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = product.price;
    titleRow.append(title, price);
    body.appendChild(titleRow);

    if (product.meta) {
      const meta = document.createElement("span");
      meta.className = "product-meta";
      meta.textContent = product.meta;
      body.appendChild(meta);
    }

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;
    body.appendChild(description);

    if (product.features) {
      const features = document.createElement("div");
      features.className = "product-features";
      product.features.forEach((feature) => {
        const chip = document.createElement("span");
        chip.textContent = feature;
        features.appendChild(chip);
      });
      body.appendChild(features);
    }

    const open = document.createElement("a");
    open.className = "btn product-open";
    open.href = `duelio://shop?product=${encodeURIComponent(product.id)}`;
    open.dataset.openDuelio = "";
    open.setAttribute("aria-label", `Open ${product.name} in Duelio`);
    open.append(makeOpenMark(), document.createTextNode("View in Duelio"));
    body.appendChild(open);

    article.append(art, body);
    return article;
  }

  function updateSelector(section) {
    selectorTitle.textContent = section.title;
    selectorTagline.textContent = section.tagline.toUpperCase();
    selectorOpen.href = `duelio://shop?section=${encodeURIComponent(section.id)}`;
    selectorThumb.className = "selector-thumb" + (section.thumbClass ? ` ${section.thumbClass}` : "");
    selectorThumb.replaceChildren();
    if (section.thumb) {
      const image = document.createElement("img");
      image.src = section.thumb;
      image.alt = "";
      selectorThumb.appendChild(image);
    }
  }

  function renderSection(sectionID, requestedProduct = null) {
    clearMarquees();
    selectedSection = sectionMap.has(sectionID) ? sectionID : "pro";
    const section = sectionMap.get(selectedSection);
    const sectionProducts = products.filter((product) => product.category === selectedSection);
    updateSelector(section);
    grid.replaceChildren();
    grid.setAttribute("aria-label", `${section.title} products`);
    grid.setAttribute("aria-labelledby", `shop-tab-${selectedSection}`);

    const shelfNames = [...new Set(sectionProducts.map((product) => product.shelf))];
    const marqueeSetups = [];
    shelfNames.forEach((shelfName) => {
      const shelfProducts = sectionProducts.filter((product) => product.shelf === shelfName);
      const shelf = document.createElement("section");
      shelf.className = "product-shelf" + (shelfProducts.every((product) => product.layout === "hero") ? " hero-shelf" : "");
      const shelfTitle = document.createElement("h2");
      shelfTitle.className = "shelf-title";
      const shelfText = document.createElement("span");
      shelfText.textContent = shelfName;
      shelfTitle.appendChild(shelfText);
      const track = document.createElement("div");
      track.className = "shelf-track";
      const isPoolMarquee = selectedSection === "pool" && shelfProducts.length > 1;
      if (isPoolMarquee) {
        const isBundles = shelfName === "Bundles";
        const motion = document.createElement("button");
        motion.type = "button";
        motion.className = "shelf-motion";
        motion.hidden = true;
        shelfTitle.appendChild(motion);
        track.classList.add("is-marquee");
        track.dataset.marqueeShelf = isBundles ? "bundles" : "cues";
        track.dataset.marqueeSpeed = String(isBundles ? 17 : 13);
        track.dataset.marqueeDirection = String(isBundles ? 1 : -1);
        track.tabIndex = 0;
        track.setAttribute("role", "region");
        track.setAttribute("aria-label", `${shelfName} automatic carousel. Hover, focus, drag, or use arrow keys to pause and browse.`);
        marqueeSetups.push([track, motion]);
      }
      shelfProducts.forEach((product) => track.appendChild(makeCard(product)));
      shelf.append(shelfTitle, track);
      grid.appendChild(shelf);
    });
    marqueeSetups.forEach(([track, motion]) => {
      activeMarquees.push(makeMarquee(track, motion));
    });

    filterHost.querySelectorAll(".filter-button").forEach((button) => {
      const active = button.dataset.section === selectedSection;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    resultCount.textContent = `${sectionProducts.length} purchase${sectionProducts.length === 1 ? "" : "s"}`;

    if (requestedProduct) {
      requestAnimationFrame(() => {
        const card = [...grid.querySelectorAll(".product-card")]
          .find((candidate) => candidate.dataset.product === requestedProduct);
        if (!card) return;
        card.classList.add("spotlight");
        card.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      });
    }
  }

  sections.forEach((section) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.dataset.section = section.id;
    button.id = `shop-tab-${section.id}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", "product-grid");
    button.textContent = section.label;
    button.addEventListener("click", () => {
      history.replaceState(null, "", section.id === "pro" ? "/shop/" : `/shop/?section=${encodeURIComponent(section.id)}`);
      renderSection(section.id);
      grid.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    filterHost.appendChild(button);
  });

  filterHost.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const buttons = [...filterHost.querySelectorAll(".filter-button")];
    const current = Math.max(0, buttons.indexOf(document.activeElement));
    let next = current;
    if (event.key === "ArrowLeft") next = (current - 1 + buttons.length) % buttons.length;
    if (event.key === "ArrowRight") next = (current + 1) % buttons.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = buttons.length - 1;
    event.preventDefault();
    buttons[next]?.focus();
    buttons[next]?.click();
  });

  const search = new URLSearchParams(location.search);
  const requestedProduct = search.get("product");
  const matchingProduct = requestedProduct
    ? products.find((product) => product.id === requestedProduct)
    : null;
  const requestedSection = search.get("section");
  renderSection(matchingProduct?.category || (sectionMap.has(requestedSection) ? requestedSection : "pro"), matchingProduct?.id);

  const notice = document.getElementById("open-notice");
  const dismissNotice = document.getElementById("dismiss-open-notice");
  let pageLeft = false;
  addEventListener("pagehide", () => { pageLeft = true; });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pageLeft = true;
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("[data-open-duelio]");
    if (!link) return;
    pageLeft = false;
    if (notice) notice.hidden = true;
    setTimeout(() => {
      if (!pageLeft && document.visibilityState === "visible" && notice) notice.hidden = false;
    }, 1400);
  });

  dismissNotice?.addEventListener("click", () => { notice.hidden = true; });
})();
