/**
 * Structiva Main Application Script
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Metric Counter Animation
  const metricValues = document.querySelectorAll('.metric-val');
  let animated = false;

  function runCounters() {
    metricValues.forEach(el => {
      const targetText = el.getAttribute('data-target') || el.innerText;
      const numMatch = targetText.match(/\d+/);
      if (!numMatch) return;
      const targetNum = parseInt(numMatch[0], 10);
      const prefix = targetText.startsWith('<') ? '<' : '';
      const suffix = targetText.includes('%') ? '%' : (targetText.includes('min') ? 'min' : '');

      let current = 0;
      const step = Math.max(1, Math.floor(targetNum / 35));
      const interval = setInterval(() => {
        current += step;
        if (current >= targetNum) {
          current = targetNum;
          clearInterval(interval);
        }
        el.innerText = `${prefix}${current}${suffix}`;
      }, 30);
    });
  }

  // Trigger counters with IntersectionObserver
  const metricSection = document.querySelector('.metric-strip-section');
  if (metricSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        runCounters();
      }
    }, { threshold: 0.3 });
    observer.observe(metricSection);
  } else {
    runCounters();
  }

  // 2. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-question');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isOpen) item.classList.add('active');
      });
    }
  });

  // 3. Mobile Navigation Menu Toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
  }
});
