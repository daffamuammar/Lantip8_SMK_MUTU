(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const scrollToId = (id) => {
    const el = document.querySelector(id);
    if (el)
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
  };
  document.querySelectorAll('a[href^="#"]').forEach((link) =>
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (href && href.length > 1) {
        event.preventDefault();
        scrollToId(href);
        document.querySelector(".main-nav")?.classList.remove("is-open");
      }
    }),
  );

  const menu = document.querySelector(".main-nav");
  document
    .querySelector(".menu-trigger")
    ?.addEventListener("click", () => menu?.classList.toggle("is-open"));
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) =>
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === "#" + visible.target.id,
        ),
      );
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: [0.08, 0.25, 0.5] },
  );
  sections.forEach((section) => observer.observe(section));

  const revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));

  const topButton = document.querySelector(".back-to-top");
  topButton?.addEventListener("click", () => scrollToId("#beranda"));
  window.addEventListener(
    "scroll",
    () => topButton?.classList.toggle("is-visible", window.scrollY > 600),
    { passive: true },
  );

  document.querySelectorAll(".gallery-filter").forEach((filter) =>
    filter.addEventListener("click", () => {
      const value = filter.dataset.filter;
      document
        .querySelectorAll(".gallery-filter")
        .forEach((button) =>
          button.classList.toggle("is-active", button === filter),
        );
      document
        .querySelectorAll(".gallery-card")
        .forEach((card) =>
          card.classList.toggle(
            "is-hidden",
            value !== "semua" && card.dataset.category !== value,
          ),
        );
    }),
  );
  const lightbox = document.querySelector("#lightbox");
  const closeLightbox = () => {
    if (lightbox) lightbox.hidden = true;
    document.body.style.overflow = "";
  };
  document.querySelectorAll(".gallery-card").forEach((card) =>
    card.addEventListener("click", () => {
      document.querySelector("#lightbox-image").src = card.dataset.image;
      document.querySelector("#lightbox-image").alt = card.dataset.title;
      document.querySelector("#lightbox-title").textContent =
        card.dataset.title;
      document.querySelector("#lightbox-label").textContent =
        card.dataset.label;
      if (lightbox) lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    }),
  );
  document
    .querySelector(".lightbox-close")
    ?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
})();
