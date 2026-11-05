/**
 * STRUCTIVA - Masterclass Interactive Engine
 * Powers the exact Leroux luxury interactions:
 * - Full-bleed hero slider with smooth background transitions, slide counter, and progress bar
 * - Interactive process steps with dynamic photo switching
 * - Testimonial quote navigator
 * - Mobile navigation menu toggle
 */

document.addEventListener('DOMContentLoaded', function () {
  // =========================================================================
  // 1. HERO CAROUSEL
  // =========================================================================
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const slides = [
      {
        image: 'images/main-home-rev-img-1.jpg',
        title: 'From strategy to delivery, we build the marketing systems that make <span>your business scale.</span>',
        num: '01',
        tag: 'Infrastructure',
        tagLink: '#solutions',
        caption: 'Enterprise tracking data layers &amp;<br>server-side conversion pipelines'
      },
      {
        image: 'images/main-home-rev-img-2.jpg',
        title: 'We help growing companies realize their commercial potential through <span>connected data infrastructure.</span>',
        num: '02',
        tag: 'CRM Sync',
        tagLink: '#solutions',
        caption: 'Closed-loop revenue feedback<br>and bi-directional pipeline sync'
      },
      {
        image: 'images/main-home-rev-img-3.jpg',
        title: 'Ten dedicated pillars engineered to eliminate data gaps, attribution loss, and <span>wasted ad spend.</span>',
        num: '03',
        tag: 'Pillars',
        tagLink: '#expertise',
        caption: 'Comprehensive architecture<br>built for enterprise revenue teams'
      },
      {
        image: 'images/main-home-rev-img-4.jpg',
        title: 'Refresh your brand and pave the way for new business <span>goals and ventures.</span>',
        num: '04',
        tag: 'CRO Testing',
        tagLink: '#process',
        caption: 'Systematic statistical experimentation<br>that protects gross margin'
      }
    ];

    let currentSlide = 0;
    const heroCopyTitle = heroSection.querySelector('.hero-copy h1');
    const slideTopSpan = heroSection.querySelector('.slide-top span');
    const prevBtn = heroSection.querySelector('.slide-top button[aria-label="Previous slide"]');
    const nextBtn = heroSection.querySelector('.slide-top button[aria-label="Next slide"]');
    const progressI = heroSection.querySelector('.progress-line i');
    const captionTagBtn = heroSection.querySelector('.slide-caption button');
    const captionTagLink = heroSection.querySelector('.slide-caption a');
    const captionP = heroSection.querySelector('.slide-caption p');

    let slideInterval = null;
    let progressInterval = null;
    const slideTime = 6500;

    function renderSlide(index) {
      currentSlide = (index + slides.length) % slides.length;
      const s = slides[currentSlide];

      heroSection.style.backgroundImage = `url('${s.image}')`;
      if (heroCopyTitle) heroCopyTitle.innerHTML = s.title;
      if (slideTopSpan) slideTopSpan.textContent = s.num;
      if (captionTagBtn) captionTagBtn.textContent = s.tag;
      if (captionTagLink) {
        captionTagLink.href = s.tagLink;
        captionTagLink.textContent = 'Management';
      }
      if (captionP) captionP.innerHTML = s.caption;

      resetProgress();
    }

    function resetProgress() {
      clearInterval(progressInterval);
      clearTimeout(slideInterval);

      if (progressI) progressI.style.width = '0%';
      let startTime = Date.now();

      progressInterval = setInterval(() => {
        let elapsed = Date.now() - startTime;
        let pct = Math.min((elapsed / slideTime) * 100, 100);
        if (progressI) progressI.style.width = pct + '%';
      }, 50);

      slideInterval = setTimeout(() => {
        renderSlide(currentSlide + 1);
      }, slideTime);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        renderSlide(currentSlide - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        renderSlide(currentSlide + 1);
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') renderSlide(currentSlide - 1);
      if (e.key === 'ArrowRight') renderSlide(currentSlide + 1);
    });

    renderSlide(0);
  }

  // =========================================================================
  // 2. INTERACTIVE PROCESS STEPS (HOW DOES IT WORK?)
  // =========================================================================
  const processSection = document.querySelector('.process');
  if (processSection) {
    const steps = processSection.querySelectorAll('.process-step');
    const processImg = processSection.querySelector('.process > img');

    const stepImages = [
      'images/main-home-img-6-b.jpg',
      'images/main-home-img-6-a.jpg',
      'images/main-home-img-6-c.jpg'
    ];

    steps.forEach((step, idx) => {
      step.addEventListener('click', () => {
        steps.forEach(s => {
          s.classList.remove('active');
          s.setAttribute('aria-expanded', 'false');
        });
        step.classList.add('active');
        step.setAttribute('aria-expanded', 'true');

        if (processImg && stepImages[idx]) {
          processImg.style.opacity = '0.3';
          setTimeout(() => {
            processImg.src = stepImages[idx];
            processImg.style.opacity = '1';
          }, 200);
        }
      });
    });
  }

  // =========================================================================
  // 3. TESTIMONIAL CAROUSEL
  // =========================================================================
  const testimonial = document.querySelector('.testimonial');
  if (testimonial) {
    const quotes = [
      {
        quote: "“Structiva eliminated our tracking blindness post-iOS 14. Within 4 weeks of deploying their server-side CAPI and CRM attribution pipeline, our Meta and Google ROAS scaled by 41% with complete data fidelity.”",
        author: "Raymond Cole",
        role: "VP of Growth · Apex SaaS Global",
        avatar: "images/testimonials-img.png"
      },
      {
        quote: "“Before Structiva, our HubSpot pipeline and paid advertising were living in different universes. Structiva engineered a bi-directional sync that allows ad algorithms to bid exclusively on closed-won revenue.”",
        author: "Elena Rostova",
        role: "Chief Commercial Officer · FinEdge Technologies",
        avatar: "images/testimonials-img-6.png"
      },
      {
        quote: "“The CRO and data layer overhaul was the highest-ROI technical investment we made this fiscal year. Our conversion rate increased from 1.8% to 3.4% without changing our core marketing spend.”",
        author: "Marcus Thorne",
        role: "Director of E-Commerce · Nordica Direct",
        avatar: "images/testimonials-img.png"
      }
    ];

    let currentQuote = 0;
    const bq = testimonial.querySelector('blockquote');
    const authorStrong = testimonial.querySelector('.person strong');
    const authorSpan = testimonial.querySelector('.person span');
    const authorImg = testimonial.querySelector('.person img');
    const prevQuoteBtn = testimonial.querySelector('button[aria-label="Previous testimonial"]');
    const nextQuoteBtn = testimonial.querySelector('button[aria-label="Next testimonial"]');

    function renderQuote(index) {
      currentQuote = (index + quotes.length) % quotes.length;
      const q = quotes[currentQuote];
      if (bq) bq.textContent = q.quote;
      if (authorStrong) authorStrong.textContent = q.author;
      if (authorSpan) authorSpan.textContent = q.role;
      if (authorImg) authorImg.src = q.avatar;
    }

    if (prevQuoteBtn) {
      prevQuoteBtn.addEventListener('click', () => renderQuote(currentQuote - 1));
    }
    if (nextQuoteBtn) {
      nextQuoteBtn.addEventListener('click', () => renderQuote(currentQuote + 1));
    }
  }

  // =========================================================================
  // 4. MOBILE MENU TRIGGER
  // =========================================================================
  const menuTrigger = document.querySelector('.menu-trigger');
  const nav = document.querySelector('.navigation nav');

  if (menuTrigger && nav) {
    menuTrigger.addEventListener('click', () => {
      if (nav.style.display === 'flex') {
        nav.style.display = 'none';
      } else {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '100%';
        nav.style.left = '0';
        nav.style.width = '100%';
        nav.style.background = '#20282d';
        nav.style.padding = '24px 40px';
        nav.style.gap = '20px';
        nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
      }
    });
  }
});
