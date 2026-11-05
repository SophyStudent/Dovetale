/**
 * DOVETALE - Masterclass Interactive Engine
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
        quote: "“Dovetale eliminated our tracking blindness post-iOS 14. Within 4 weeks of deploying their server-side CAPI and CRM attribution pipeline, our Meta and Google ROAS scaled by 41% with complete data fidelity.”",
        author: "Raymond Cole",
        role: "VP of Growth · Apex SaaS Global",
        avatar: "images/testimonials-img.png"
      },
      {
        quote: "“Before Dovetale, our HubSpot pipeline and paid advertising were living in different universes. Dovetale engineered a bi-directional sync that allows ad algorithms to bid exclusively on closed-won revenue.”",
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
        nav.style.zIndex = '9999';
      }
    });
  }

  // =========================================================================
  // 5. MASTER DOSSIER INTERACTIVE CONSOLE (THE 10 PILLARS)
  // =========================================================================
  const dossierConsole = document.querySelector('.master-dossier-console');
  if (dossierConsole) {
    const pillarsData = {
      '01': {
        breadcrumb: 'PILLAR // 01 • TIER I',
        badge: 'DATA_SCHEMA',
        title: 'Unified Data Layer & Schema Contract',
        desc: 'Standardized, type-safe data schema implemented across your web and application touchpoints. Eliminates broken tags, missing e-commerce parameters, and discrepancies before ingestion.',
        deliverable: '42-point Schema Contract',
        fidelity: '99.8% Deterministic',
        specId: 'DOVETALE ENTERPRISE SPECIFICATION // V4.8'
      },
      '02': {
        breadcrumb: 'PILLAR // 02 • TIER I',
        badge: 'CLOUD_CAPI',
        title: 'Server-Side CAPI & Consent Architecture',
        desc: 'Dedicated GCP Cloud Run or AWS Fargate Docker containers edge-routing conversion telemetry directly to Meta Graph API, Google Ads Enhanced Conversions, and LinkedIn CAPI. Bypasses ad-blockers and Safari 7-day cookie caps while enforcing Google Consent Mode v2.',
        deliverable: 'Cloud Run / AWS Container Cluster',
        fidelity: '+38% Signal Recovery',
        specId: 'DOVETALE ENTERPRISE SPECIFICATION // V4.8'
      },
      '03': {
        breadcrumb: 'PILLAR // 03 • TIER II',
        badge: 'PIPELINE_SYNC',
        title: 'Bi-Directional CRM & Pipeline Sync',
        desc: 'Closed-loop data pipelines connecting HubSpot or Salesforce directly with paid media smart bidding algorithms. Replaces naive form-fill optimization with true offline conversion synchronization tied to qualified pipeline stages and closed-won contract values.',
        deliverable: 'Bi-Directional Webhook Engine',
        fidelity: '100% Closed-Won Revenue Attribution',
        specId: 'DOVETALE ENTERPRISE SPECIFICATION // V4.8'
      },
      '04': {
        breadcrumb: 'PILLAR // 04 • TIER II',
        badge: 'AUTOMATION_LTV',
        title: 'Marketing Automation Lifecycle',
        desc: 'Event-driven lifecycle messaging built on Klaviyo or Customer.io. Triggers personalized transactional and retention communications based on granular product telemetry and platform usage milestones, reducing customer onboarding churn.',
        deliverable: 'Behavioral Trigger Workflow Matrix',
        fidelity: '+34% Retention LTV Lift',
        specId: 'DOVETALE ENTERPRISE SPECIFICATION // V4.8'
      },
      '05': {
        breadcrumb: 'PILLAR // 05 • TIER II',
        badge: 'EXPERIMENT_CRO',
        title: 'Conversion Rate Optimization Matrix',
        desc: 'High-velocity experimentation infrastructure built to systematically isolate variables that influence buyer decision-making. We construct test hypotheses weighted by financial gross profit rather than superficial design preferences.',
        deliverable: 'Bayesian Testing Suite & Split URLs',
        fidelity: 'p < 0.05 Statistical Confidence',
        specId: 'DOVETALE ENTERPRISE SPECIFICATION // V4.8'
      },
      '06': {
        breadcrumb: 'PILLAR // 06 • TIER III',
        badge: 'ECONOMETRICS_MMM',
        title: 'Multi-Touch Attribution & MMM',
        desc: 'Advanced statistical attribution engines that blend deterministic first-party clickstream data with top-down econometric modeling. Solves post-iOS 14 multi-touch attribution blindness without relying on fragile third-party cookies or fingerprinting.',
        deliverable: 'Bayesian Econometric MMM Engine',
        fidelity: '0% Third-Party Reliance',
        specId: 'DOVETALE ENTERPRISE SPECIFICATION // V4.8'
      },
      '07': {
        breadcrumb: 'PILLAR // 07 • TIER III',
        badge: 'DYNAMIC_CREATIVE',
        title: 'Dynamic Creative Operations DCO',
        desc: 'Algorithmic creative generation and automated modular asset assembly. Dynamically serves personalized visual variations based on real-time audience segment telemetry, purchase recency, and live inventory levels.',
        deliverable: 'Automated DCO Feed & Rendering Matrix',
        fidelity: 'Sub-50ms Edge Assembly',
        specId: 'DOVETALE ENTERPRISE SPECIFICATION // V4.8'
      },
      '08': {
        breadcrumb: 'PILLAR // 08 • TIER III',
        badge: 'IDENTITY_CDP',
        title: 'Customer Data Platform & Resolution',
        desc: 'Centralized identity resolution stitching anonymous pre-purchase sessions with authenticated post-purchase records into a unified golden customer profile stored in client-owned data warehouses (BigQuery/Snowflake).',
        deliverable: 'BigQuery / Snowflake Golden Graph',
        fidelity: 'Deterministic ID Stitching',
        specId: 'DOVETALE ENTERPRISE SPECIFICATION // V4.8'
      },
      '09': {
        breadcrumb: 'PILLAR // 09 • TIER IV',
        badge: 'EXECUTIVE_BI',
        title: 'Automated Reporting & Dashboards',
        desc: 'Executive business intelligence dashboards unifying ad spend across Google, Meta, and LinkedIn with real-time merchant cash collection (Stripe/Shopify) and pipeline progress for instant commercial clarity.',
        deliverable: 'Executive Real-Time Financial BI Suite',
        fidelity: 'Automated Hourly Refresh',
        specId: 'DOVETALE ENTERPRISE SPECIFICATION // V4.8'
      },
      '10': {
        breadcrumb: 'PILLAR // 10 • TIER IV',
        badge: 'SENTINEL_GOVERNANCE',
        title: 'Technical Governance & Leak Prevention',
        desc: 'Continuous monitoring agents that inspect conversion endpoints and webhook payloads every 15 minutes. Automatically flags broken scripts, expired consent tokens, and schema mismatches with a strict 4-hour remediation SLA.',
        deliverable: '24/7 Automated Sentinel & 4-Hour SLA',
        fidelity: '99.9% Uptime Guarantee',
        specId: 'DOVETALE ENTERPRISE SPECIFICATION // V4.8'
      }
    };

    const navButtons = dossierConsole.querySelectorAll('.dossier-nav-btn');
    const displayCard = dossierConsole.querySelector('.dossier-display-card');
    const breadcrumbEl = document.getElementById('dossier-breadcrumb');
    const badgeEl = document.getElementById('dossier-badge');
    const titleEl = document.getElementById('dossier-title');
    const descEl = document.getElementById('dossier-desc');
    const deliverableEl = document.getElementById('dossier-deliverable');
    const fidelityEl = document.getElementById('dossier-fidelity');
    const specIdEl = document.getElementById('dossier-spec-id');

    navButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        const pillarId = this.getAttribute('data-pillar');
        const data = pillarsData[pillarId];
        if (!data) return;

        navButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Smooth fade transition
        displayCard.style.opacity = '0.3';
        setTimeout(() => {
          if (breadcrumbEl) breadcrumbEl.textContent = data.breadcrumb;
          if (badgeEl) badgeEl.textContent = data.badge;
          if (titleEl) titleEl.textContent = data.title;
          if (descEl) descEl.textContent = data.desc;
          if (deliverableEl) deliverableEl.textContent = data.deliverable;
          if (fidelityEl) fidelityEl.textContent = data.fidelity;
          if (specIdEl) specIdEl.textContent = data.specId;
          displayCard.style.opacity = '1';
          updateCardNav(pillarId);
        }, 120);
      });
    });

    // In-Card Prev / Next Navigation for mobile & desktop UX
    const prevBtn = document.getElementById('dossier-prev-btn');
    const nextBtn = document.getElementById('dossier-next-btn');
    const prevTitleEl = document.getElementById('dossier-prev-title');
    const nextTitleEl = document.getElementById('dossier-next-title');
    const trackerCurrEl = document.getElementById('dossier-tracker-curr');

    const pillarKeys = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

    function updateCardNav(currentId) {
      const idx = pillarKeys.indexOf(currentId);
      if (idx === -1) return;

      const prevIdx = (idx - 1 + pillarKeys.length) % pillarKeys.length;
      const nextIdx = (idx + 1) % pillarKeys.length;

      const prevKey = pillarKeys[prevIdx];
      const nextKey = pillarKeys[nextIdx];

      if (trackerCurrEl) trackerCurrEl.textContent = currentId;
      if (prevTitleEl) prevTitleEl.textContent = prevKey + '. ' + pillarsData[prevKey].title.split('&')[0].trim();
      if (nextTitleEl) nextTitleEl.textContent = nextKey + '. ' + pillarsData[nextKey].title.split('&')[0].trim();

      if (prevBtn) prevBtn.setAttribute('data-target-pillar', prevKey);
      if (nextBtn) nextBtn.setAttribute('data-target-pillar', nextKey);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        const target = this.getAttribute('data-target-pillar') || '10';
        const targetNavBtn = dossierConsole.querySelector('.dossier-nav-btn[data-pillar="' + target + '"]');
        if (targetNavBtn) targetNavBtn.click();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        const target = this.getAttribute('data-target-pillar') || '02';
        const targetNavBtn = dossierConsole.querySelector('.dossier-nav-btn[data-pillar="' + target + '"]');
        if (targetNavBtn) targetNavBtn.click();
      });
    }

    // Initialize nav for initial pillar 01
    updateCardNav('01');
  }

});
