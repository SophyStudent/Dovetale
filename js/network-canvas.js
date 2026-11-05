/**
 * Structiva Connected Systems Canvas
 * Interactive HTML5 Canvas motion graphic representing the interconnected marketing infrastructure.
 */
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Nodes definition
  const nodes = [
    { id: 1, label: 'Website & Funnel', xRel: 0.25, yRel: 0.35, r: 8, color: '#16b8a6' },
    { id: 2, label: 'Google & Meta Ads', xRel: 0.75, yRel: 0.25, r: 7, color: '#38bdf8' },
    { id: 3, label: 'Central CRM', xRel: 0.50, yRel: 0.55, r: 10, color: '#16b8a6' },
    { id: 4, label: 'GA4 & Server CAPI', xRel: 0.22, yRel: 0.75, r: 7, color: '#818cf8' },
    { id: 5, label: 'Email & Retention', xRel: 0.78, yRel: 0.75, r: 8, color: '#2dd4bf' }
  ];

  // Connections
  const links = [
    [1, 3], // Website -> CRM
    [2, 1], // Ads -> Website
    [2, 3], // Ads -> CRM
    [3, 4], // CRM -> GA4
    [1, 4], // Website -> GA4
    [3, 5], // CRM -> Retention
    [5, 1], // Retention -> Website
    [4, 2]  // GA4 -> Ads (Offline conversions)
  ];

  // Particles moving along links
  const particles = [];
  for (let i = 0; i < 18; i++) {
    const link = links[Math.floor(Math.random() * links.length)];
    particles.push({
      link: link,
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
      size: 2.5 + Math.random() * 1.5
    });
  }

  let mouse = { x: null, y: null };
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  let time = 0;

  function animate() {
    time += 0.02;
    ctx.clearRect(0, 0, width, height);

    // Compute absolute positions
    const pos = {};
    nodes.forEach(n => {
      pos[n.id] = {
        x: n.xRel * width + Math.sin(time + n.id) * 3,
        y: n.yRel * height + Math.cos(time + n.id) * 3,
        r: n.r,
        label: n.label,
        color: n.color
      };
    });

    // Draw connection lines
    links.forEach(([fromId, toId]) => {
      const p1 = pos[fromId];
      const p2 = pos[toId];

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Active pulse line
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      const pulseAlpha = 0.15 + 0.1 * Math.sin(time * 2 + fromId);
      ctx.strokeStyle = `rgba(22, 184, 166, ${pulseAlpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw & update particles
    particles.forEach(p => {
      p.progress += p.speed;
      if (p.progress > 1) p.progress = 0;

      const p1 = pos[p.link[0]];
      const p2 = pos[p.link[1]];
      const x = p1.x + (p2.x - p1.x) * p.progress;
      const y = p1.y + (p2.y - p1.y) * p.progress;

      // Glow
      ctx.beginPath();
      ctx.arc(x, y, p.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(22, 184, 166, 0.2)';
      ctx.fill();

      // Dot
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = '#16b8a6';
      ctx.fill();
    });

    // Draw nodes
    nodes.forEach(n => {
      const p = pos[n.id];
      const isHovered = mouse.x && Math.hypot(p.x - mouse.x, p.y - mouse.y) < 30;

      // Outer ambient glow
      const glowR = isHovered ? p.r * 3.5 : p.r * 2.5 + Math.sin(time + n.id) * 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? 'rgba(22, 184, 166, 0.35)' : 'rgba(22, 184, 166, 0.12)';
      ctx.fill();

      // Node core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // White center
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Label
      ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = isHovered ? '#ffffff' : '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText(p.label, p.x, p.y + p.r + 16);
    });

    requestAnimationFrame(animate);
  }

  animate();
});
