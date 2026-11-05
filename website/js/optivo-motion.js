/**
 * Optivo Corporate Motion Engine
 * Restores all dynamic animations, carousels, rotating stamps, and counters
 * for Structiva Business & Marketing Systems
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    console.log('Optivo Motion Engine initializing...');

    // 1. INJECT ROTATION STYLES FOR THE STAMP
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes optivoContinuousSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .hero-three__round .thumb img,
      .hero-three__round img[alt="text-3"] {
        animation: optivoContinuousSpin 12s linear infinite !important;
        transform-origin: center center !important;
        display: block !important;
      }
      
      /* Smooth marquee animation for brands carousel */
      @keyframes brandsMarquee {
        0% { transform: translate3d(0, 0, 0); }
        100% { transform: translate3d(-50%, 0, 0); }
      }
      
      .barnds-carousel__one .owl-stage {
        display: flex !important;
        width: 200% !important;
        animation: brandsMarquee 20s linear infinite !important;
      }
      .barnds-carousel__one:hover .owl-stage {
        animation-play-state: paused !important;
      }

      /* Hover micro-interactions */
      .hero-five__item-two .hero-five__item__thumb:hover img {
        transform: scale(1.03);
        transition: transform 0.6s ease;
      }
      .hero-five__item-two .hero-five__item__thumb img {
        transition: transform 0.6s ease;
      }

      /* Video Modal Lightbox */
      .optivo-modal-overlay {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(14, 24, 40, 0.92);
        backdrop-filter: blur(8px);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      .optivo-modal-overlay.active {
        opacity: 1;
        pointer-events: auto;
      }
      .optivo-modal-content {
        position: relative;
        width: 90%;
        max-width: 900px;
        background: #000;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 25px 50px rgba(0,0,0,0.5);
      }
      .optivo-modal-close {
        position: absolute;
        top: -40px; right: 0;
        color: #fff;
        font-size: 28px;
        cursor: pointer;
        background: transparent;
        border: none;
      }
    `;
    document.head.appendChild(style);

    // 2. MAKE ALL OWL CAROUSELS SLIDE SMOOTHLY
    initAutoSliders();

    // 3. ANIMATE NUMBER COUNTERS
    initNumberCounters();

    // 4. ATTACH VIDEO MODAL
    initVideoModal();

    // 5. ATTACH SHOWCASE TAB INTERACTIONS
    initShowcaseTabs();

    console.log('Optivo Motion Engine active: Carousels, stamp rotation, and counters are running.');
  });

  // Slider function for Owl Carousels
  function initAutoSliders() {
    const carousels = [
      { sel: '.service-five__carousel', speed: 4500 },
      { sel: '.case-study-five__carosul', speed: 5000 },
      { sel: '.testimonials-five__carousel', speed: 5500 },
      { sel: '.team-area-two__carousel', speed: 4000 },
      { sel: '.blog-two__carousel', speed: 6000 }
    ];

    carousels.forEach(c => {
      const el = document.querySelector(c.sel);
      if (!el) return;
      const stage = el.querySelector('.owl-stage');
      const items = el.querySelectorAll('.owl-item');
      if (!stage || items.length <= 1) return;

      let currentIndex = 0;
      const totalItems = items.length;
      const itemWidth = items[0].offsetWidth || 350;

      // Ensure stage has smooth transition
      stage.style.transition = 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
      stage.style.display = 'flex';

      function slideNext() {
        currentIndex = (currentIndex + 1) % (totalItems - 1);
        const offset = -(currentIndex * itemWidth);
        stage.style.transform = `translate3d(${offset}px, 0px, 0px)`;
      }

      function slidePrev() {
        currentIndex = (currentIndex - 1 + (totalItems - 1)) % (totalItems - 1);
        const offset = -(currentIndex * itemWidth);
        stage.style.transform = `translate3d(${offset}px, 0px, 0px)`;
      }

      // Auto play interval
      let timer = setInterval(slideNext, c.speed);

      // Pause on hover
      el.addEventListener('mouseenter', () => clearInterval(timer));
      el.addEventListener('mouseleave', () => timer = setInterval(slideNext, c.speed));

      // Hook up next/prev navigation buttons if present
      const nextBtn = el.querySelector('.owl-next');
      const prevBtn = el.querySelector('.owl-prev');
      if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); slideNext(); });
      if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); slidePrev(); });

      // Hook up dot clicks
      const dots = el.querySelectorAll('.owl-dot');
      dots.forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          currentIndex = idx;
          const offset = -(currentIndex * itemWidth);
          stage.style.transform = `translate3d(${offset}px, 0px, 0px)`;
          dots.forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
        });
      });
    });
  }

  // Number Counter Animation
  function initNumberCounters() {
    const counterElements = document.querySelectorAll('.count, .count-box, h2, h3');
    const targets = [];

    counterElements.forEach(el => {
      const text = el.innerText.trim();
      const match = text.match(/^(\d+)(\s*[\+K%]|\s*M|\s*B)?$/);
      if (match && parseInt(match[1]) > 0 && el.children.length === 0) {
        targets.push({
          el: el,
          value: parseInt(match[1]),
          suffix: match[2] || '',
          started: false
        });
      }
    });

    if ('IntersectionObserver' in window && targets.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            targets.forEach(t => {
              if (t.el === entry.target && !t.started) {
                t.started = true;
                animateNumber(t.el, t.value, t.suffix);
              }
            });
          }
        });
      }, { threshold: 0.3 });

      targets.forEach(t => observer.observe(t.el));
    }
  }

  function animateNumber(el, endVal, suffix) {
    let startVal = 0;
    const duration = 1800;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(ease * endVal);
      el.innerText = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerText = endVal + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  // Video Lightbox Modal
  function initVideoModal() {
    const videoBtn = document.querySelector('.hero-five__item__video-box, .video-popup');
    if (!videoBtn) return;

    const modal = document.createElement('div');
    modal.className = 'optivo-modal-overlay';
    modal.innerHTML = `
      <div class="optivo-modal-content">
        <button class="optivo-modal-close" aria-label="Close">&times;</button>
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
          <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
                  src="https://www.youtube.com/embed/KPgl7w-xtM8?autoplay=1" 
                  title="Structiva Systems Walkthrough" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen>
          </iframe>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.optivo-modal-close');
    const iframe = modal.querySelector('iframe');
    const baseSrc = iframe.src;

    videoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      iframe.src = baseSrc;
      modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      iframe.src = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        iframe.src = '';
      }
    });
  }

  // Showcase Tabs Hover & Click
  function initShowcaseTabs() {
    const tabs = document.querySelectorAll('.home-showcase__item, .home-showcase a');
    tabs.forEach(tab => {
      tab.addEventListener('mouseenter', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  }

})();
