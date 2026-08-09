(() => {
  "use strict";

  const categories = [
    ["all", "All"],
    ["pro", "Pro"],
    ["perks", "Perks"],
    ["pool", "Pool"],
    ["racing", "Racing"],
    ["bowling", "Bowling"],
    ["darts", "Darts"],
    ["ringtoss", "Ring Toss"],
    ["chess", "Chess"],
    ["cards", "Cards"],
  ];

  const products = [
    { id: "duelio.pro", name: "Duelio Pro", price: "$9.99", category: "pro", description: "The complete Pro upgrade with its exclusive benefits and cosmetics.", image: "/assets/shop/duelio-pro.png", art: "icon" },
    { id: "hints.25", name: "25 Hints", price: "$1.99", category: "perks", description: "A quick refill of 25 hints for supported games.", image: "/assets/img/pro-icon.png", art: "icon" },
    { id: "hints.100", name: "100 Hints", price: "$4.99", category: "perks", description: "The larger-value pack with 100 in-game hints.", image: "/assets/img/pro-icon.png", art: "icon" },

    { id: "pool.beast", name: "Beast Bundle", price: "$4.99", category: "pool", description: "A wild collection of Beast-themed pool gear.", image: "/assets/shop/shopRenderPoolBeast.webp" },
    { id: "pool.aquatic", name: "Aquatic Bundle", price: "$3.99", category: "pool", description: "Bring deep-water style to the table.", image: "/assets/shop/shopRenderPoolAquatic.webp" },
    { id: "pool.overgrown", name: "Overgrown Bundle", price: "$3.99", category: "pool", description: "A lush set inspired by nature taking over.", image: "/assets/shop/shopRenderPoolOvergrown.webp" },
    { id: "pool.icefire", name: "Ice & Fire Bundle", price: "$3.99", category: "pool", description: "Opposing elements meet in one pool collection.", image: "/assets/shop/shopRenderPoolIceFire.webp" },
    { id: "pool.nebula", name: "Nebula Bundle", price: "$3.99", category: "pool", description: "A cosmic table set pulled from deep space.", image: "/assets/shop/shopRenderPoolNebula.webp" },
    { id: "pool.voyager", name: "Voyager Bundle", price: "$3.99", category: "pool", description: "Adventure-ready gear for your next break.", image: "/assets/shop/shopRenderPoolVoyager.webp" },
    { id: "pool.highroller", name: "High Roller Bundle", price: "$3.99", category: "pool", description: "A polished set for the sharpest pool rooms.", image: "/assets/shop/shopRenderPoolHighRoller.webp" },
    { id: "pool.web", name: "Web Table", price: "$2.99", category: "pool", description: "Turn your pool table into a striking web pattern.", image: "/assets/shop/shopRenderPoolWeb.webp" },
    { id: "cueRobot", name: "Circuit Breaker", price: "$1.99", category: "pool", description: "A mechanical cue built for precision shots.", image: "/assets/shop/cueRobot.webp" },
    { id: "cueFinger", name: "The Pointer", price: "$1.99", category: "pool", description: "A cue that makes every called shot unmistakable.", image: "/assets/shop/cueFinger.webp" },
    { id: "cueLaser", name: "Precision Beam", price: "$1.99", category: "pool", description: "A bright futuristic cue for lining up the win.", image: "/assets/shop/cueLaser.webp" },
    { id: "cueBoxing", name: "Knockout", price: "$1.99", category: "pool", description: "A heavyweight cue ready to deliver the final shot.", image: "/assets/shop/cueBoxing.webp" },
    { id: "pool.cuepack", name: "Premium Cue Pack", price: "$4.99", category: "pool", description: "Expand the cue rack with a premium collection.", image: "/assets/shop/shopRenderPoolCuePack.webp" },
    { id: "pool.complete", name: "Complete Pool Pack", price: "$19.99", category: "pool", description: "The complete collection of premium pool customizations.", image: "/assets/shop/shopRenderPoolComplete.webp" },

    { id: "bundle.sport", name: "Sports Bundle", price: "$3.99", category: "racing", description: "Sporty rides shared across Duelio's racing games.", image: "/assets/shop/shopRenderCarsSport.webp" },
    { id: "bundle.luxury", name: "Luxury Bundle", price: "$3.99", category: "racing", description: "Premium cars with a refined finish.", image: "/assets/shop/shopRenderCarsLuxury.webp" },
    { id: "bundle.offroad", name: "Off-Road Bundle", price: "$3.99", category: "racing", description: "Rugged vehicles made for leaving the ideal line.", image: "/assets/shop/shopRenderCarsOffroad.webp" },

    { id: "ball.ball_toxic.obj", name: "Toxic Swirl", price: "$0.99", category: "bowling", description: "A vivid toxic bowling ball skin.", image: "/assets/shop/ball-toxic.webp", art: "texture" },
    { id: "ball.ball_andromeda.obj", name: "Andromeda", price: "$1.99", category: "bowling", description: "Roll a galaxy down the lane.", image: "/assets/shop/ball-andromeda.webp", art: "texture" },
    { id: "shopRenderBowlingSports", name: "Sports Pack", price: "$3.99", category: "bowling", description: "A complete collection of sports-inspired bowling balls.", image: "/assets/shop/shopRenderBowlingSports.webp" },

    { id: "shopRenderDartShuriken", name: "Shuriken", price: "$1.99", category: "darts", description: "Trade the standard flight for a sharp shuriken style.", image: "/assets/shop/shopRenderDartShuriken.webp" },
    { id: "shopRenderDartKunai", name: "Kunai", price: "$1.99", category: "darts", description: "A kunai-inspired dart set for the board.", image: "/assets/shop/shopRenderDartKunai.webp" },

    { id: "ring.wideBand", name: "Wide Band", price: "$0.99", category: "ringtoss", description: "A bold wide-band ring for Ring Toss.", image: "/assets/shop/ring-wide.jpg", art: "texture" },
    { id: "ring.waveBand", name: "Wave Band", price: "$0.99", category: "ringtoss", description: "A flowing wave-styled ring finish.", image: "/assets/shop/ring-wave.jpg", art: "texture" },
    { id: "ring.carvedBand", name: "Carved Band", price: "$0.99", category: "ringtoss", description: "A textured carved ring built to stand out.", image: "/assets/shop/ring-carved.jpg", art: "texture" },

    { id: "shopRenderChessBoards", name: "Board Pack", price: "$3.99", category: "chess", description: "A collection of premium boards for every match.", image: "/assets/shop/shopRenderChessBoards.webp" },
    { id: "shopRenderChessWaterFire", name: "Water & Fire", price: "$1.99", category: "chess", description: "Elemental chess pieces in opposing styles.", image: "/assets/shop/shopRenderChessWaterFire.webp" },
    { id: "shopRenderChessPixel", name: "Pixel Pieces", price: "$1.99", category: "chess", description: "Give the board a retro pixel-art lineup.", image: "/assets/shop/shopRenderChessPixel.webp" },

    { id: "shopRenderCardsPixelDeck", name: "Pixel Deck", price: "$3.99", category: "cards", description: "A retro deck shared by Duelio's card games.", image: "/assets/shop/shopRenderCardsPixelDeck.webp" },
  ];

  const filterHost = document.getElementById("shop-filters");
  const grid = document.getElementById("product-grid");
  const resultCount = document.getElementById("shop-result-count");
  if (!filterHost || !grid || !resultCount) return;

  const categoryNames = new Map(categories);
  const cards = [];
  let selectedCategory = "all";

  function openIcon() {
    const span = document.createElement("span");
    span.setAttribute("aria-hidden", "true");
    span.innerHTML = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42L17.59 5H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z"/></svg>';
    return span.firstElementChild;
  }

  function makeCard(product) {
    const article = document.createElement("article");
    article.className = "product-card reveal";
    article.dataset.category = product.category;
    article.dataset.product = product.id;

    const art = document.createElement("div");
    art.className = "product-art" + (product.art ? ` ${product.art}` : "");
    art.style.setProperty("--product-glow", product.category === "racing" ? "rgba(254, 81, 0, 0.23)" : "rgba(29, 137, 233, 0.22)");

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";

    const category = document.createElement("span");
    category.className = "product-category";
    category.textContent = categoryNames.get(product.category);
    art.append(image, category);

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

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;

    const open = document.createElement("a");
    open.className = "btn product-open";
    open.href = `duelio://shop?product=${encodeURIComponent(product.id)}`;
    open.dataset.openDuelio = "";
    open.setAttribute("aria-label", `Open ${product.name} in Duelio`);
    open.append(openIcon(), document.createTextNode("Open in Duelio"));

    body.append(titleRow, description, open);
    article.append(art, body);
    return article;
  }

  products.forEach((product) => {
    const card = makeCard(product);
    cards.push(card);
    grid.appendChild(card);
  });

  function applyFilter(category) {
    selectedCategory = categoryNames.has(category) ? category : "all";
    let visible = 0;
    cards.forEach((card) => {
      const shouldShow = selectedCategory === "all" || card.dataset.category === selectedCategory;
      card.hidden = !shouldShow;
      if (shouldShow) visible += 1;
    });
    filterHost.querySelectorAll(".filter-button").forEach((button) => {
      const active = button.dataset.category === selectedCategory;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    resultCount.textContent = `${visible} item${visible === 1 ? "" : "s"}`;
  }

  categories.forEach(([key, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.dataset.category = key;
    button.textContent = label;
    button.addEventListener("click", () => applyFilter(key));
    filterHost.appendChild(button);
  });

  const requestedProduct = new URLSearchParams(location.search).get("product");
  const requestedCard = requestedProduct
    ? cards.find((card) => card.dataset.product === requestedProduct)
    : null;
  const requestedSection = new URLSearchParams(location.search).get("section");

  if (requestedCard) {
    applyFilter(requestedCard.dataset.category);
    requestAnimationFrame(() => {
      requestedCard.classList.add("spotlight");
      requestedCard.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  } else {
    applyFilter(categoryNames.has(requestedSection) ? requestedSection : "all");
  }

  const notice = document.getElementById("open-notice");
  const dismissNotice = document.getElementById("dismiss-open-notice");
  let pageLeft = false;
  addEventListener("pagehide", () => { pageLeft = true; });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pageLeft = true;
  });

  document.querySelectorAll("[data-open-duelio]").forEach((link) => {
    link.addEventListener("click", () => {
      pageLeft = false;
      if (notice) notice.hidden = true;
      setTimeout(() => {
        if (!pageLeft && document.visibilityState === "visible" && notice) {
          notice.hidden = false;
        }
      }, 1400);
    });
  });

  dismissNotice?.addEventListener("click", () => { notice.hidden = true; });
})();
