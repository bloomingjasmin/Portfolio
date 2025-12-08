const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav__toggle");
const navLinksWrap = document.querySelector(".nav__links");
const navLinks = document.querySelectorAll(".nav__links a");
const timeEl = document.getElementById("local-time");
const backToTop = document.querySelector(".back-to-top");
const hero = document.querySelector(".hero");
const parallaxTargets = document.querySelectorAll(".hero__orb, .hero__flower--one, .hero__flower--two, .hero__main");
const sections = ["home", "about", "projects", "cv", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if (navToggle && navLinksWrap) {
  navToggle.addEventListener("click", () => {
    navLinksWrap.classList.toggle("open");
  });

  navLinksWrap.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      navLinksWrap.classList.remove("open");
    }
  });
}

function updateTime() {
  if (!timeEl) return;
  const now = new Date();
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  }).format(now);
  timeEl.textContent = formatted;
}

updateTime();
setInterval(updateTime, 1000 * 60);

function handleScroll() {
  if (nav) {
    nav.classList.toggle("nav--scrolled", window.scrollY > 10);
  }
  if (backToTop) {
    backToTop.classList.toggle("show", window.scrollY > 240);
  }
}

window.addEventListener("scroll", handleScroll);
handleScroll();

if (backToTop) {
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// Scroll spy
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          const href = link.getAttribute("href") || "";
          link.classList.toggle("active", href === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.35 }
);
sections.forEach((section) => sectionObserver.observe(section));

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal--visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => revealObserver.observe(el));

// Hero parallax
function setTilt(el, x, y, scale = 10) {
  el.style.setProperty("--tilt-x", `${x * scale}px`);
  el.style.setProperty("--tilt-y", `${y * scale}px`);
}

if (hero) {
  hero.addEventListener("mousemove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    parallaxTargets.forEach((el, idx) => setTilt(el, x, y, 10 + idx * 2));
  });

  hero.addEventListener("mouseleave", () => {
    parallaxTargets.forEach((el) => {
      el.style.setProperty("--tilt-x", "0px");
      el.style.setProperty("--tilt-y", "0px");
    });
  });
}

// Simple contact form handler (demo)
const form = document.querySelector(".contact__form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    alert("Thanks for reaching out! Replace this alert with your submit handler.");
    form.reset();
  });
}

const introBanner = document.getElementById("intro-banner");
const introOverlay = document.querySelector(".intro-banner__overlay");
const exploreBtn = document.getElementById("intro-explore-btn");
const homeSection = document.getElementById("home");
const introFlash = document.getElementById("intro-flash");
const projectsRow = document.getElementById("projects-row");
const projectsScrollBtn = document.getElementById("projects-scroll-right");

if (exploreBtn && introBanner && homeSection) {
  exploreBtn.addEventListener("click", () => {
    introBanner.classList.add("intro-banner--exiting");
    setTimeout(() => {
      introBanner.classList.add("intro-banner--hidden");
      if (homeSection) {
        homeSection.scrollIntoView({ behavior: "instant" });
      }
    }, 600);
  });
}

window.showIntroOverlay = function () {
  if (introOverlay) {
    introOverlay.classList.add("intro-banner__overlay--visible");
  }
};

if (projectsScrollBtn && projectsRow) {
  const positionArrow = () => {
    const rect = projectsRow.getBoundingClientRect();
    const mid = rect.top + rect.height / 2 + window.scrollY;
    projectsScrollBtn.style.top = `${mid}px`;
  };

  const updateArrowState = () => {
    const maxScroll = projectsRow.scrollWidth - projectsRow.clientWidth;
    if (projectsRow.scrollLeft > maxScroll) {
      projectsRow.scrollLeft = maxScroll;
    }
    const nearEnd = projectsRow.scrollLeft >= maxScroll - 4;
    projectsScrollBtn.disabled = nearEnd || maxScroll <= 0;
    positionArrow();
  };

  const scrollProjects = () => {
    const maxScroll = projectsRow.scrollWidth - projectsRow.clientWidth;
    const target = Math.min(projectsRow.scrollLeft + projectsRow.clientWidth * 0.8, maxScroll);
    projectsRow.scrollTo({ left: target, behavior: "smooth" });
    // schedule state update after smooth scroll
    setTimeout(updateArrowState, 350);
  };

  projectsScrollBtn.addEventListener("click", scrollProjects);
  projectsRow.addEventListener("scroll", updateArrowState, { passive: true });
  window.addEventListener("resize", updateArrowState);
  window.addEventListener("scroll", positionArrow, { passive: true });
  positionArrow();
  updateArrowState();
}
