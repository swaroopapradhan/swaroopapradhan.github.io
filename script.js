// ── Navbar: scroll behavior + active link ─────────────────
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const currentY = window.scrollY;

  // Hide on scroll down, reveal on scroll up
  if (currentY > lastScrollY && currentY > 80) {
    navbar.classList.add('nav-hidden');
  } else {
    navbar.classList.remove('nav-hidden');
  }
  lastScrollY = currentY;

  // Shadow when scrolled
  if (currentY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active link highlighting
  let current = '';
  sections.forEach(section => {
    if (currentY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === `#${current}`) {
      a.classList.add('active');
    }
  });

  // Back to top
  const btt = document.getElementById('back-to-top');
  if (currentY > 400) {
    btt.classList.add('visible');
  } else {
    btt.classList.remove('visible');
  }
}, { passive: true });

// ── Hamburger menu ────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close menu when a link is clicked
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

// ── Scroll reveal (IntersectionObserver) ─────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── Back to top ───────────────────────────────────────────
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Contact form ──────────────────────────────────────────
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name    = document.getElementById('f-name');
  const email   = document.getElementById('f-email');
  const message = document.getElementById('f-message');
  let valid = true;

  [name, email, message].forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    }
  });

  if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.classList.add('error');
    valid = false;
  }

  if (!valid) return;

  // Open mailto as fallback (no backend needed)
  const subject = encodeURIComponent(document.getElementById('f-subject').value || 'Portfolio Inquiry');
  const body    = encodeURIComponent(`Hi Swaroopa,\n\n${message.value}\n\nBest,\n${name.value}`);
  window.location.href = `mailto:2swaroopa@gmail.com?subject=${subject}&body=${body}`;

  document.getElementById('form-success').classList.add('show');
  this.reset();
});

// ── Photo carousel ───────────────────────────────────────
(function () {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots   = document.querySelectorAll('.carousel-dot');
  if (slides.length <= 1) return;

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo((current + 1) % slides.length); }

  function start() { timer = setInterval(next, 4000); }
  function stop()  { clearInterval(timer); }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stop();
      goTo(Number(dot.dataset.index));
      start();
    });
  });

  start();
})();

// ── Experience accordion ──────────────────────────────────
document.querySelectorAll('.tl-card').forEach(card => {
  const header = card.querySelector('.tl-header');
  const bullets = card.querySelector('.tl-bullets');
  const tags    = card.querySelector('.tl-tags');
  const item    = card.closest('.tl-item');

  // Wrap bullets + tags in a collapsible body
  const body = document.createElement('div');
  body.className = 'tl-body';
  card.insertBefore(body, bullets);
  body.appendChild(bullets);
  if (tags) body.appendChild(tags);

  // Add chevron toggle button to header
  const btn = document.createElement('button');
  btn.className = 'tl-toggle';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Show details');
  btn.innerHTML = '<i class="fas fa-chevron-down"></i>';
  header.appendChild(btn);

  // Toggle on card click
  card.addEventListener('click', () => {
    const expanded = item.classList.toggle('expanded');
    btn.setAttribute('aria-expanded', String(expanded));
    btn.setAttribute('aria-label', expanded ? 'Hide details' : 'Show details');
  });
});

// ── Experience overlay ────────────────────────────────────
const expSection = document.getElementById('experience');
const expClose   = document.getElementById('experience-close');

function openExperience(e) {
  if (e) e.preventDefault();
  expSection.classList.add('experience-open');
  document.body.style.overflow = 'hidden';
  expSection.scrollTop = 0;
  navbar.classList.remove('nav-hidden');
}
function closeExperience() {
  expSection.classList.remove('experience-open');
  document.body.style.overflow = '';
}

document.querySelectorAll('a[href="#experience"]').forEach(a => {
  a.addEventListener('click', openExperience);
});
if (expClose) expClose.addEventListener('click', closeExperience);


// ── Skills overlay ────────────────────────────────────────
const skillsSection = document.getElementById('skills');
const skillsClose   = document.getElementById('skills-close');

function openSkills(e) {
  if (e) e.preventDefault();
  skillsSection.classList.add('skills-open');
  document.body.style.overflow = 'hidden';
  skillsSection.scrollTop = 0;
}
function closeSkills() {
  skillsSection.classList.remove('skills-open');
  document.body.style.overflow = '';
}

document.querySelectorAll('a[href="#skills"]').forEach(a => {
  a.addEventListener('click', openSkills);
});
if (skillsClose) skillsClose.addEventListener('click', closeSkills);


// ── Certifications overlay ────────────────────────────────
const certSection = document.getElementById('certifications');
const certClose   = document.getElementById('cert-close');

function openCertifications(e) {
  if (e) e.preventDefault();
  certSection.classList.add('cert-open');
  document.body.style.overflow = 'hidden';
  certSection.scrollTop = 0;
}
function closeCertifications() {
  certSection.classList.remove('cert-open');
  document.body.style.overflow = '';
}

document.querySelectorAll('a[href="#certifications"]').forEach(a => {
  a.addEventListener('click', openCertifications);
});
if (certClose) certClose.addEventListener('click', closeCertifications);

// ── Client Journey overlay ────────────────────────────────
const cjSection = document.getElementById('client-journey');
const cjClose   = document.getElementById('cj-close');

function openClientJourney(e) {
  if (e) e.preventDefault();
  cjSection.classList.add('cj-open');
  document.body.style.overflow = 'hidden';
  cjSection.scrollTop = 0;
}
function closeClientJourney() {
  cjSection.classList.remove('cj-open');
  document.body.style.overflow = '';
}

document.querySelectorAll('a[href="#client-journey"]').forEach(a => {
  a.addEventListener('click', openClientJourney);
});
if (cjClose) cjClose.addEventListener('click', closeClientJourney);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeAllOverlays(); }
});

// ── Brand logo: close all overlays and go home ───────────
function closeAllOverlays() {
  closeSkills();
  closeExperience();
  closeClientJourney();
  closeCertifications();
  if (typeof closeWorkOverlay === 'function') closeWorkOverlay();
}

document.querySelector('.nav-brand').addEventListener('click', (e) => {
  e.preventDefault();
  closeAllOverlays();
  navbar.classList.remove('nav-hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Also close all overlays when any nav link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    // Only close overlays not targeted by this link
    const href = link.getAttribute('href');
    if (href !== '#skills') closeSkills();
    if (href !== '#experience') closeExperience();
    if (href !== '#client-journey') closeClientJourney();
    if (href !== '#certifications') closeCertifications();
  });
});

// ── Smooth scroll for anchor links ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    if (this.getAttribute('href') === '#skills') return; // handled by overlay
    if (this.getAttribute('href') === '#experience') return; // handled by overlay
    if (this.getAttribute('href') === '#client-journey') return; // handled by overlay
    if (this.getAttribute('href') === '#certifications') return; // handled by overlay
    if (this.getAttribute('href') === '#work') return; // handled by work overlay
    const href = this.getAttribute('href');
    // Handle internal nav within work overlay
    if (href && href.startsWith('#wo-')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── View My Work overlay ──────────────────────────────────
const workOverlay = document.getElementById('work-overlay');
const workClose   = document.getElementById('work-close');

function openWorkOverlay(e) {
  if (e) e.preventDefault();
  closeAllOverlays();
  workOverlay.classList.add('work-overlay-open');
  document.body.style.overflow = 'hidden';
  workOverlay.scrollTop = 0;
}
function closeWorkOverlay() {
  workOverlay.classList.remove('work-overlay-open');
  document.body.style.overflow = '';
}

document.querySelectorAll('a[href="#work"], .js-open-work').forEach(a => {
  a.addEventListener('click', openWorkOverlay);
});
if (workClose) workClose.addEventListener('click', closeWorkOverlay);

// "Get in Touch" inside overlay: close overlay then scroll to contact
document.querySelectorAll('.js-close-work-go-contact').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    closeWorkOverlay();
    setTimeout(() => {
      const contact = document.getElementById('contact');
      if (contact) {
        const top = contact.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 450);
  });
});

// (Escape key handled by the existing keydown listener via closeAllOverlays)

