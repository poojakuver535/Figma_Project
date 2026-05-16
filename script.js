/* 
   DATA: Carousel images using placeholder images
    */
const carouselImages = [
  {
    src: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
    alt: "HDPE pipe manufacturing process",
  },
  {
    src: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
    alt: "Industrial HDPE coil installation",
  },
  {
    src: "https://images.unsplash.com/photo-1565793979904-e08f8b0c0d5e?w=800&q=80",
    alt: "Pipeline infrastructure project",
  },
  {
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    alt: "HDPE pipe quality testing",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    alt: "Modern pipe manufacturing facility",
  },
];

/* Application cards data */
const appCards = [
  {
    title: "Fishnet Manufacturing",
    desc: "High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads.",
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80",
  },
  {
    title: "Fishnet Manufacturing",
    desc: "High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads.",
    img: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=400&q=80",
  },
  {
    title: "Fishnet Manufacturing",
    desc: "High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads.",
    img: "https://images.unsplash.com/photo-1530481111971-3e1f76c25a59?w=400&q=80",
  },
  {
    title: "Fishnet Manufacturing",
    desc: "High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads.",
    img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80",
  },
  {
    title: "Fishnet Manufacturing",
    desc: "High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads.",
    img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80",
  },
  {
    title: "Fishnet Manufacturing",
    desc: "High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads.",
    img: "https://images.unsplash.com/photo-1565793979904-e08f8b0c0d5e?w=400&q=80",
  },
];

/* 
   1. STICKY HEADER
   
    */
(function initStickyHeader() {
  const stickyHeader = document.getElementById("stickyHeader");
  const productHero = document.getElementById("productHero");
  let lastScrollY = window.scrollY;

  function onScroll() {
    const heroBottom = productHero.getBoundingClientRect().bottom;
    const scrollingDown = window.scrollY > lastScrollY;
    lastScrollY = window.scrollY;

    if (heroBottom < 0) {
      // Past the hero fold
      if (scrollingDown) {
        // Show sticky header when scrolling down past hero
        stickyHeader.classList.add("visible");
      } else {
        // Hide sticky header when scrolling back up
        stickyHeader.classList.remove("visible");
      }
    } else {
      // Still in hero area — always hide
      stickyHeader.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* 
   2. IMAGE CAROUSEL
   
    */
(function initCarousel() {
  const track = document.getElementById("carouselTrack");
  const thumbStrip = document.getElementById("thumbnailStrip");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const mainWrap = document.getElementById("carouselMain");
  const zoomPanel = document.getElementById("zoomPreview");
  const zoomImg = document.getElementById("zoomImg");

  let current = 0;
  const slides = [];
  const thumbs = [];

  /* Build slides and thumbnails */
  carouselImages.forEach((item, i) => {
    /* Slide */
    const slide = document.createElement("div");
    slide.className = "carousel-slide" + (i === 0 ? " active" : "");
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt;
    img.loading = "lazy";
    slide.appendChild(img);
    track.appendChild(slide);
    slides.push(slide);

    /* Thumbnail */
    const thumb = document.createElement("div");
    thumb.className = "thumb" + (i === 0 ? " active" : "");
    const tImg = document.createElement("img");
    tImg.src = item.src;
    tImg.alt = item.alt;
    tImg.loading = "lazy";
    thumb.appendChild(tImg);
    thumb.addEventListener("click", () => goTo(i));
    thumbStrip.appendChild(thumb);
    thumbs.push(thumb);
  });

  /** Switch to slide index n */
  function goTo(n) {
    slides[current].classList.remove("active");
    thumbs[current].classList.remove("active");
    current = (n + slides.length) % slides.length;
    slides[current].classList.add("active");
    thumbs[current].classList.add("active");
    // Update zoom image source
    zoomImg.src = carouselImages[current].src;
  }

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  /* Auto-advance every 4 seconds */
  let autoTimer = setInterval(() => goTo(current + 1), 4000);
  mainWrap.addEventListener("mouseenter", () => clearInterval(autoTimer));
  mainWrap.addEventListener("mouseleave", () => {
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  });

  /* Touch or swipe support for mobile */
  let touchStartX = 0;
  mainWrap.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );
  mainWrap.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    },
    { passive: true },
  );

  /* ---- ZOOM ON HOVER ----
   */
  zoomImg.src = carouselImages[0].src;

  mainWrap.addEventListener("mouseenter", () => {
    zoomImg.src = carouselImages[current].src;
    zoomPanel.classList.add("show");
  });

  mainWrap.addEventListener("mouseleave", () => {
    zoomPanel.classList.remove("show");
  });

  mainWrap.addEventListener("mousemove", (e) => {
    const rect = mainWrap.getBoundingClientRect();
    const xFrac = (e.clientX - rect.left) / rect.width;
    const yFrac = (e.clientY - rect.top) / rect.height;

    const xOff = xFrac * 100;
    const yOff = yFrac * 100;
    zoomImg.style.objectPosition = `${xOff}% ${yOff}%`;
    zoomImg.style.transform = `scale(2) translate(${(0.5 - xFrac) * 30}%, ${(0.5 - yFrac) * 30}%)`;
  });
})();

/* 
   3. APPLICATIONS CAROUSEL with card-level zoom */
(function initAppCarousel() {
  const carousel = document.getElementById("appCarousel");
  const prevBtn = document.getElementById("appPrev");
  const nextBtn = document.getElementById("appNext");

  let offset = 0;
  const CARD_WIDTH = 240;
  const VISIBLE = 4;

  appCards.forEach((card) => {
    const el = document.createElement("div");
    el.className = "app-card";

    const img = document.createElement("img");
    img.className = "app-card-img";
    img.src = card.img;
    img.alt = card.title;
    img.loading = "lazy";

    const overlay = document.createElement("div");
    overlay.className = "app-card-overlay";
    overlay.innerHTML = `
      <div class="app-card-title">${card.title}</div>
      <div class="app-card-desc">${card.desc}</div>
    `;

    const zoom = document.createElement("div");
    zoom.className = "app-card-zoom";
    const zImg = document.createElement("img");
    zImg.src = card.img;
    zImg.alt = card.title + " zoomed";
    zoom.appendChild(zImg);

    el.appendChild(img);
    el.appendChild(overlay);
    el.appendChild(zoom);
    carousel.appendChild(el);
  });

  const maxOffset = Math.max(0, appCards.length - VISIBLE) * CARD_WIDTH;

  function slide(dir) {
    offset = Math.min(Math.max(offset + dir * CARD_WIDTH, 0), maxOffset);
    carousel.style.transform = `translateX(-${offset}px)`;
  }

  prevBtn.addEventListener("click", () => slide(-1));
  nextBtn.addEventListener("click", () => slide(1));
})();

(function initFAQ() {
  const items = document.querySelectorAll(".faq-item");
  items.forEach((item) => {
    const btn = item.querySelector(".faq-q");
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      // Close all
      items.forEach((i) => i.classList.remove("open"));
      // Toggle clicked
      if (!isOpen) item.classList.add("open");
    });
  });
})();

(function initProcessTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const content = document.getElementById("processContent");

  /* Process steps data */
  const panels = {
    raw: {
      title: "High-Grade Raw Material Selection",
      text: "Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.",
      bullets: [
        "PE100 grade material",
        "Optimal molecular weight distribution",
      ],
    },
    extrusion: {
      title: "Precision Extrusion Process",
      text: "State-of-the-art extruders with precise temperature control zones ensure consistent melt flow and homogeneous material distribution throughout the pipe wall.",
      bullets: ["Temperature-controlled zones", "Consistent melt flow index"],
    },
    cooling: {
      title: "Controlled Cooling System",
      text: "A multi-stage vacuum water cooling system gradually brings the pipe to ambient temperature while maintaining precise dimensional tolerances.",
      bullets: ["Vacuum calibration", "Gradual temperature reduction"],
    },
    sizing: {
      title: "Precision Sizing & Calibration",
      text: "Advanced sizing sleeves ensure exact outer diameter consistency to within ±0.1mm tolerance across all production runs.",
      bullets: [
        "±0.1mm dimensional tolerance",
        "Automated calibration feedback",
      ],
    },
    quality: {
      title: "Rigorous Quality Control",
      text: "Every batch undergoes hydrostatic pressure testing, impact resistance checks, and dimensional verification to IS 1984 and ISO 4427 standards.",
      bullets: ["Hydrostatic pressure testing", "ISO 4427 compliance checks"],
    },
    marking: {
      title: "Permanent Ink-Jet Marking",
      text: "Continuous ink-jet printing applies permanent identification markings including size, pressure rating, manufacturer, and production date.",
      bullets: ["Permanent ink-jet system", "Full traceability data"],
    },
    cutting: {
      title: "Precision Cutting & Coiling",
      text: "Automatic cut-off saws deliver precise pipe lengths with clean, perpendicular ends ready for fusion jointing.",
      bullets: ["Automated cut-off control", "Clean perpendicular ends"],
    },
    packaging: {
      title: "Protective Packaging",
      text: "Pipes are carefully bundled, end-capped, and labelled with complete product information before being palletised for safe transport.",
      bullets: ["End-cap protection", "Full product labelling"],
    },
  };

  function renderPanel(key) {
    const p = panels[key] || panels.raw;
    content.innerHTML = `
      <div class="process-panel active">
        <div class="process-text">
          <h3>${p.title}</h3>
          <p>${p.text}</p>
          <ul>${p.bullets.map((b) => `<li>✓ ${b}</li>`).join("")}</ul>
        </div>
        <div class="process-img">
          <div class="img-placeholder dark">
            <span>${p.title} Image</span>
          </div>
        </div>
      </div>`;
  }

  renderPanel("raw");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderPanel(tab.dataset.tab);
    });
  });
})();

/* 
   6. MODAL — Get Custom Quote or Catalogue
   */
(function initModal() {
  const overlay = document.getElementById("modalOverlay");
  const openBtn = document.getElementById("openModal");
  const closeBtn = document.getElementById("modalClose");

  function open() {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  /* Close on Escape key */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

/* 
   7. HAMBURGER MENU Mobile)
    */
(function initHamburger() {
  const btn = document.getElementById("hamburger");
  const nav = document.getElementById("mobileNav");

  btn.addEventListener("click", () => {
    nav.classList.toggle("open");
    btn.textContent = nav.classList.contains("open") ? "✕" : "☰";
  });
})();

/* 
   8. SCROLL ANIMATIONS — Fade-in sections as they enter viewport
    */
(function initScrollAnimations() {
  const targets = document.querySelectorAll(
    ".feature-card, .testimonial-card, .portfolio-card, .specs-table-wrap, .process-content",
  );

  /* Set initial invisible state */
  targets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          /* Stagger siblings within the same parent */
          const siblings = Array.from(entry.target.parentElement.children);
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, idx * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  targets.forEach((el) => observer.observe(el));
})();
