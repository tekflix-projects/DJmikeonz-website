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

  // ============ REFERRAL SOURCE — "OTHER" FIELD ============

  const referralSelect    = document.getElementById('referral');
  const referralOtherWrap = document.getElementById('referral-other-wrap');
  const referralOtherInput = document.getElementById('referral-other');

  if (referralSelect && referralOtherWrap) {
    referralSelect.addEventListener('change', () => {
      const show = referralSelect.value === 'Other';
      referralOtherWrap.style.display = show ? 'block' : 'none';
      referralOtherInput.required = show;
    });
  }

  // ============ REVIEW TEXT — EXPAND/COLLAPSE ============

  requestAnimationFrame(() => {
    document.querySelectorAll('.review-text').forEach(textEl => {
      if (textEl.scrollHeight <= textEl.clientHeight + 2) return;
      const btn = document.createElement('button');
      btn.className = 'review-expand-btn';
      btn.textContent = 'Show more';
      btn.addEventListener('click', () => {
        const expanded = textEl.classList.toggle('expanded');
        btn.textContent = expanded ? 'Show less' : 'Show more';
      });
      textEl.insertAdjacentElement('afterend', btn);
    });
  });

  // ============ CONTACT FORM (Formspree AJAX) ============

  const contactForm      = document.getElementById('contact-form');
  const contactSubmitBtn = document.getElementById('contact-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const cBtnText    = contactSubmitBtn.querySelector('.btn-text');
      const cBtnLoading = contactSubmitBtn.querySelector('.btn-loading');
      const cSuccess    = document.getElementById('contact-form-success');
      const cError      = document.getElementById('contact-form-error');

      cBtnText.hidden          = true;
      cBtnLoading.hidden       = false;
      contactSubmitBtn.disabled = true;
      cSuccess.hidden          = true;
      cError.hidden            = true;

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          cSuccess.hidden = false;
          contactForm.reset();
        } else {
          const data = await response.json().catch(() => ({}));
          cError.textContent = data.errors
            ? data.errors.map(err => err.message).join(', ')
            : 'Something went wrong. Please try again.';
          cError.hidden = false;
        }
      } catch {
        cError.textContent = 'Could not send your message. Please check your connection and try again.';
        cError.hidden = false;
      } finally {
        cBtnText.hidden           = false;
        cBtnLoading.hidden        = true;
        contactSubmitBtn.disabled = false;
      }
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
          successMsg.textContent = "Thank you! DJ MIKEONZ will be in touch within 24 hours.";
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

  // ============ MIN DATE — BOOKING FORM ============

  const dateInput = document.getElementById('event-date');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  // ============ YOUTUBE CLICK-TO-PLAY FACADE ============

  document.querySelectorAll('.yt-facade').forEach(facade => {
    facade.addEventListener('click', () => {
      const id     = facade.dataset.videoid;
      const title  = facade.dataset.title || 'DJ MIKEONZ Video';
      const iframe = document.createElement('iframe');
      iframe.src   = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      iframe.title = title;
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none;';
      facade.replaceWith(iframe);
    }, { once: true });
  });

  // ============ REVIEWS CAROUSEL NAV ============

  const carousel      = document.querySelector('.reviews-carousel');
  const prevBtn       = document.getElementById('carouselPrev');
  const nextBtn       = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');

  if (carousel && dotsContainer) {
    const cards = Array.from(carousel.querySelectorAll('.review-card'));

    cards.forEach((card, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.addEventListener('click', () => scrollToCard(card));
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));

    function scrollToCard(card) {
      carousel.scrollTo({ left: card.offsetLeft - carousel.offsetLeft, behavior: 'smooth' });
    }

    const cardObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = cards.indexOf(entry.target);
          dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        }
      });
    }, { root: carousel, threshold: 0.55 });

    cards.forEach(card => cardObserver.observe(card));

    prevBtn?.addEventListener('click', () => {
      const pos    = carousel.scrollLeft;
      const target = [...cards].reverse().find(c => c.offsetLeft - carousel.offsetLeft < pos - 10);
      if (target) scrollToCard(target);
    });

    nextBtn?.addEventListener('click', () => {
      const pos    = carousel.scrollLeft;
      const target = cards.find(c => c.offsetLeft - carousel.offsetLeft > pos + 10);
      if (target) scrollToCard(target);
    });
  }

  // ============ FLOATING MOBILE CTA ============

  const floatingCta = document.querySelector('.floating-cta');
  if (floatingCta) {
    const heroEl    = document.getElementById('hero');
    const bookingEl = document.getElementById('booking');
    let heroVisible    = true;
    let bookingVisible = false;

    const updateCta = () => {
      floatingCta.classList.toggle('visible', !heroVisible && !bookingVisible);
    };

    new IntersectionObserver(([e]) => {
      heroVisible = e.isIntersecting;
      updateCta();
    }, { threshold: 0.2 }).observe(heroEl);

    new IntersectionObserver(([e]) => {
      bookingVisible = e.isIntersecting;
      updateCta();
    }, { threshold: 0.1 }).observe(bookingEl);
  }

});
