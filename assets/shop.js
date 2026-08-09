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

    { id: "ball.ball_toxic.obj", name: "Toxic Swirl", price: "$0.99", category: "bowling", shelf: "Balls", description: "The Toxic Swirl ball from the in-game rack.", image: "/assets/shop/ball-toxic.webp", art: "ball" },
    { id: "ball.ball_andromeda.obj", name: "Andromeda", price: "$1.99", category: "bowling", shelf: "Balls", description: "The Andromeda ball from the in-game rack.", image: "/assets/shop/ball-andromeda.webp", art: "ball" },
    { id: "shopRenderBowlingSports", name: "Sports Pack", price: "$3.99", category: "bowling", shelf: "Sports Pack", layout: "hero", description: "Basketball, Soccer, Volleyball and the 8 Ball.", image: "/assets/shop/shopRenderBowlingSports.webp", meta: "4 BALLS" },

    { id: "shopRenderDartShuriken", name: "Shuriken", price: "$1.99", category: "darts", shelf: "Throwables", description: "The Shuriken throwable shown in Duelio's Darts shop.", image: "/assets/shop/shopRenderDartShuriken.webp" },
    { id: "shopRenderDartKunai", name: "Kunai", price: "$1.99", category: "darts", shelf: "Throwables", description: "The Kunai throwable shown in Duelio's Darts shop.", image: "/assets/shop/shopRenderDartKunai.webp" },

    { id: "ring.wideBand", name: "Wide Band", price: "$0.99", category: "ringtoss", shelf: "Rings & Bands", description: "The Wide Band ring finish from Ring Toss.", image: "/assets/shop/ring-wide.jpg", art: "ring" },
    { id: "ring.waveBand", name: "Wave Band", price: "$0.99", category: "ringtoss", shelf: "Rings & Bands", description: "The Wave Band ring finish from Ring Toss.", image: "/assets/shop/ring-wave.jpg", art: "ring" },
    { id: "ring.carvedBand", name: "Carved Band", price: "$0.99", category: "ringtoss", shelf: "Rings & Bands", description: "The Carved Band ring finish from Ring Toss.", image: "/assets/shop/ring-carved.jpg", art: "ring" },

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
      image.loading = "eager";
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
    selectedSection = sectionMap.has(sectionID) ? sectionID : "pro";
    const section = sectionMap.get(selectedSection);
    const sectionProducts = products.filter((product) => product.category === selectedSection);
    updateSelector(section);
    grid.replaceChildren();
    grid.setAttribute("aria-label", `${section.title} products`);

    const shelfNames = [...new Set(sectionProducts.map((product) => product.shelf))];
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
      shelfProducts.forEach((product) => track.appendChild(makeCard(product)));
      shelf.append(shelfTitle, track);
      grid.appendChild(shelf);
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
    button.setAttribute("role", "tab");
    button.textContent = section.label;
    button.addEventListener("click", () => {
      history.replaceState(null, "", section.id === "pro" ? "/shop/" : `/shop/?section=${encodeURIComponent(section.id)}`);
      renderSection(section.id);
      grid.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    filterHost.appendChild(button);
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
