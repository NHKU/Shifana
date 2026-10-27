/* Mobile menu, scroll reveal, counters, skill bars, WhatsApp form */
(() => {
  const $ = (s, c = document) => c.querySelector(s),
    $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const header = $(".site-header");
  const menuBtn = $(".menu-btn");
  const menu = $("#menu");

  // Menu panel: open/close, lock page scroll while open
  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  menuBtn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  menu.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  // Header gets a frosted background once the page scrolls
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal sections, animate counters and skill bars when visible
  const countUp = (el) => {
    const end = +el.dataset.count,
      t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      p < 1 && requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        $$("[data-count]", en.target).forEach(countUp);
        en.target.querySelector(".skills")?.classList.add("in");
        io.unobserve(en.target);
      }),
    { threshold: 0.15 },
  );
  $$(".reveal").forEach((el) => io.observe(el));

  // Contact form: opens WhatsApp with the message prefilled
  $("#form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const text = `Hi Fathima, I'm ${d.name} (${d.email}${d.phone ? ", " + d.phone : ""}). I'm interested in ${d.service}. ${d.msg}`;
    window.open("https://wa.me/916235792829?text=" + encodeURIComponent(text), "_blank", "noopener");
  });
})();

/* Blog: category filter + hide any thumbnail that fails to load (gradient shows instead) */
(() => {
  const btns = [...document.querySelectorAll(".filters button")];
  document.querySelectorAll(".post img").forEach((img) => img.addEventListener("error", () => img.remove()));
  if (!btns.length) return;
  const posts = [...document.querySelectorAll(".post")],
    empty = document.querySelector(".empty");
  btns.forEach((b) =>
    b.addEventListener("click", () => {
      btns.forEach((x) => x.classList.toggle("on", x === b));
      posts.forEach((p) => (p.hidden = b.dataset.f !== "all" && p.dataset.cat !== b.dataset.f));
      empty.hidden = posts.some((p) => !p.hidden);
    }),
  );
})();
