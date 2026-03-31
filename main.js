/* =============================================
   DJ MIKEONZ — main.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ============ NAVBAR SCROLL OPACITY ============

  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run on load in case page is already scrolled

  // ============ MOBILE HAMBURGER MENU ============

  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close drawer when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close drawer on outside click
  document.addEventListener('click', (e) => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // ============ SMOOTH SCROLL ============

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ============ FADE-IN ON SCROLL (Intersection Observer) ============

  const fadeEls = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target); // fire once only
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeEls.forEach(el => fadeObserver.observe(el));

  // ============ ACTIVE NAV LINK ON SCROLL ============

  const sections    = document.querySelectorAll('section[id]');
  const navLinkEls  = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));

  // ============ EVENT TYPE — "OTHER" FIELD ============

  const otherRadio = document.getElementById('event-type-other');
  const otherWrap  = document.getElementById('other-event-wrap');
  const otherInput = document.getElementById('other-event-type');

  if (otherRadio && otherWrap) {
    document.querySelectorAll('input[name="event_type"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const show = otherRadio.checked;
        otherWrap.style.display = show ? 'block' : 'none';
        otherInput.required = show;
      });
    });
  }

  // ============ BOOKING FORM (Formspree AJAX) ============

  const form       = document.getElementById('booking-form');
  const submitBtn  = document.getElementById('submit-btn');
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  const successMsg = document.getElementById('form-success');
  const errorMsg   = document.getElementById('form-error');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Show loading state
      btnText.hidden    = true;
      btnLoading.hidden = false;
      submitBtn.disabled = true;
      successMsg.hidden = true;
      errorMsg.hidden   = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          successMsg.textContent = "Thank you! Mike will be in touch within 24 hours.";
          successMsg.hidden = false;
          form.reset();
        } else {
          const data = await response.json().catch(() => ({}));
          const msg = data.errors
            ? data.errors.map(err => err.message).join(', ')
            : 'Something went wrong. Please try again.';
          errorMsg.textContent = msg;
          errorMsg.hidden = false;
        }
      } catch {
        errorMsg.textContent = 'Could not send your message. Please check your connection and try again.';
        errorMsg.hidden = false;
      } finally {
        btnText.hidden     = false;
        btnLoading.hidden  = true;
        submitBtn.disabled = false;
      }
    });
  }

});
