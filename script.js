const SITE = {
  youtube: "https://youtube.com/@sanatanrahasyakathaofficial",
  short: "https://youtube.com/shorts/_mJ29KiNdwc",
  email: "email@sanatanrahasya.com",
  phone: "+919000000000",
  whatsapp: "919000000000"
};

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const openExt = (a, url) => {
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener";
};

$$("[data-youtube]").forEach(a => openExt(a, SITE.youtube));
$$("[data-youtube-short]").forEach(a => openExt(a, SITE.short));
$$("[data-mail]").forEach(a => a.href = "mailto:" + SITE.email);
$$("[data-phone]").forEach(a => {
  a.href = "https://wa.me/" + SITE.whatsapp;
  a.target = "_blank";
  a.rel = "noopener";
});

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const preload = $("#preload");
setTimeout(() => preload.classList.add("hide"), reduce ? 150 : 950);
setTimeout(() => preload.remove(), 1800);

const motes = $("#motes");
if (!reduce) {
  for (let i = 0; i < 22; i++) {
    const m = document.createElement("span");
    m.className = "mote";
    const s = 2 + Math.random() * 5;
    m.style.cssText = `left:${Math.random() * 100}%;bottom:-10vh;width:${s}px;height:${s}px;opacity:${.25 + Math.random() * .5};animation-duration:${16 + Math.random() * 20}s;animation-delay:${-Math.random() * 26}s`;
    motes.appendChild(m);
  }
}

const head = $("#siteHead");
const prog = $("#scrollProgress");
const toTop = $("#toTop");

const onScroll = () => {
  const y = window.scrollY;
  head.classList.toggle("stuck", y > 40);
  toTop.classList.toggle("show", y > 600);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  prog.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));

const burger = $("#burger");
const menu = $("#menu");
const backdrop = document.createElement("div");
backdrop.className = "backdrop";
document.body.appendChild(backdrop);

const setMenu = open => {
  menu.classList.toggle("open", open);
  backdrop.classList.toggle("on", open);
  burger.classList.toggle("on", open);
  burger.setAttribute("aria-expanded", open);
  document.body.classList.toggle("lock", open);
};
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
backdrop.addEventListener("click", () => setMenu(false));
$$(".m-link, .m-sub").forEach(a => a.addEventListener("click", () => setMenu(false)));

const revealer = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px" }
);
$$(".reveal").forEach(el => revealer.observe(el));

const secObserver = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      $$(".m-link").forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#" + id));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
$$("main section[id]").forEach(s => secObserver.observe(s));

$$("[data-count]").forEach(el => {
  const end = +el.dataset.count;
  const dec = new Intl.NumberFormat("en-IN");
  const run = () => {
    if (reduce) {
      el.textContent = dec.format(end);
      return;
    }
    const dur = 1500;
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = dec.format(Math.round(end * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  new IntersectionObserver(
    (e, o) => {
      if (e[0].isIntersecting) {
        run();
        o.disconnect();
      }
    },
    { threshold: 0.5 }
  ).observe(el);
});

$$(".chip-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".chip-btn").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const f = btn.dataset.filter;
    $$(".v-card").forEach(card => {
      const show = f === "all" || card.dataset.cat === f;
      card.classList.toggle("hide", !show);
      if (show) {
        card.classList.remove("in");
        requestAnimationFrame(() => card.classList.add("in"));
      }
    });
  });
});

$$(".k-more").forEach(btn => {
  btn.addEventListener("click", () => {
    const ext = btn.nextElementSibling;
    const open = !ext.classList.contains("open");
    ext.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open);
    btn.firstChild.textContent = open ? "बंद करें " : "पूरी कथा पढ़ें ";
  });
});

$$(".b-lyr").forEach(btn => {
  btn.addEventListener("click", () => {
    const lyr = btn.closest(".b-item").nextElementSibling;
    const open = !lyr.classList.contains("open");
    lyr.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open);
    btn.textContent = open ? "बंद करें" : "दोहे";
  });
});

const lb = $("#lightbox");
const lbFrame = $("#lbFrame");
let lastFocus = null;

const openLb = (id, isShort) => {
  lbFrame.classList.toggle("is-short", !!isShort);
  if (!id || id.indexOf("PASTE") === 0) {
    lbFrame.innerHTML =
      '<div style="display:grid;place-content:center;gap:14px;height:100%;text-align:center;padding:24px;font-family:inherit">' +
      '<div style="font-family:\'Tiro Devanagari Hindi\',serif;font-size:56px;color:#e8b54b">ॐ</div>' +
      '<p style="color:#e8b54b;font-size:17px;margin:0">अभी वीडियो जोड़ा नहीं गया है</p>' +
      '<p style="color:#a9a2bd;font-size:13.5px;margin:0">index.html में <b>data-video="PASTE_…"</b> की जगह अपना YouTube Video ID डालें</p>' +
      '</div>';
  } else {
    lbFrame.innerHTML =
      '<iframe src="https://www.youtube-nocookie.com/embed/' +
      id +
      '?autoplay=1&rel=0" title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
  }
  lastFocus = document.activeElement;
  lb.hidden = false;
  document.body.classList.add("lock");
  $("#lbClose").focus();
};

const closeLb = () => {
  lb.hidden = true;
  lbFrame.innerHTML = "";
  lbFrame.classList.remove("is-short");
  document.body.classList.remove("lock");
  if (lastFocus) lastFocus.focus();
};

$$("[data-video]").forEach(b =>
  b.addEventListener("click", () => openLb(b.dataset.video, b.hasAttribute("data-short")))
);
$("#lbClose").addEventListener("click", closeLb);
lb.addEventListener("click", e => {
  if (e.target === lb) closeLb();
});
addEventListener("keydown", e => {
  if (e.key === "Escape" && !lb.hidden) closeLb();
});

const form = $("#contactForm");
const note = $("#formNote");

const check = (input, ok) => {
  input.closest(".fld").classList.toggle("bad", !ok);
  return ok;
};

const validate = () => {
  let first = null;
  const n = $("#name"), m = $("#email"), t = $("#message");
  const tests = [
    [n, check(n, n.value.trim().length >= 2)],
    [m, check(m, /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(m.value.trim()))],
    [t, check(t, t.value.trim().length >= 10)]
  ];
  for (const [el, ok] of tests) if (!ok && !first) first = el;
  return first;
};

["name", "email", "message"].forEach(id => {
  const el = $("#" + id);
  el.addEventListener("input", () => {
    el.closest(".fld").classList.remove("bad");
    note.textContent = "";
    note.classList.remove("bad");
  });
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const bad = validate();
  if (bad) {
    note.textContent = "कृपया ऊपर के काले अंक वाले फ़ील्ड ठीक करें।";
    note.classList.add("bad");
    bad.focus();
    return;
  }
  note.classList.remove("bad");
  const btn = form.querySelector("button[type=submit]");
  form.classList.add("sending");
  btn.disabled = true;
  note.textContent = "";
  setTimeout(() => {
    form.reset();
    form.classList.remove("sending");
    btn.disabled = false;
    note.textContent = "धन्यवाद! आपका संदेश प्राप्त हुआ। जय श्री राम 🙏";
  }, 1500);
});

const yr = $("#yr");
yr.textContent = new Date().getFullYear();