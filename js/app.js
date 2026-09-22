/**
 * This One - Interactive Experience Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particle Background Canvas
  if (typeof initParticleCanvas === 'function') {
    initParticleCanvas('bg-canvas');
  }

  // 2. Interactive Terminal Tab Switching
  initTerminal();

  // 3. 3D Tilt Effect on Feature Cards
  initTiltCards();

  // 4. Animated Counters on Scroll
  initAnimatedCounters();

  // 5. Code Copy Button with Toast Feedback
  initCopyButton();

  // 6. Smooth Scroll & Navbar Shadow on Scroll
  initNavbar();

  // 7. Mobile Menu Toggle
  initMobileMenu();
});

/**
 * Terminal snippet switcher and interactive execution
 */
function initTerminal() {
  const tabs = document.querySelectorAll('.terminal-tab');
  const codePanels = document.querySelectorAll('.code-panel');

  const codeSnippets = {
    quickstart: `# Clone and step into the project
git clone https://github.com/blsdxvmip/this-one.git
cd this-one

# Initialize environment & launch
npm install && npm run dev
# ✨ Ready on http://localhost:3000`,
    config: `# this-one.config.json
{
  "project": "this-one",
  "engine": "v2-hyperdrive",
  "theme": "cyber-obsidian",
  "features": {
    "subagents": true,
    "instantGlow": true,
    "reactiveCanvas": true
  }
}`,
    agents: `// Autonomous Subagent Orchestrator
import { orchestrate } from '@this-one/core';

const cluster = await orchestrate({
  roles: ['creative_designer', 'canvas_fx', 'qa_specialist'],
  goal: 'Deliver supreme digital excellence',
  concurrency: 'auto'
});

console.log('⚡ All subagents synchronized!');`
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab');
      const codeElement = document.getElementById('terminal-code');
      if (codeElement && codeSnippets[target]) {
        // Fade transition
        codeElement.style.opacity = '0';
        setTimeout(() => {
          codeElement.textContent = codeSnippets[target];
          codeElement.style.opacity = '1';
        }, 120);
      }
    });
  });
}

/**
 * Copy to clipboard functionality
 */
function initCopyButton() {
  const copyBtn = document.getElementById('copy-code-btn');
  const codeElement = document.getElementById('terminal-code');
  const copyFeedback = document.getElementById('copy-feedback');

  if (!copyBtn || !codeElement) return;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(codeElement.textContent.trim());
      if (copyFeedback) {
        copyFeedback.classList.add('visible');
        setTimeout(() => copyFeedback.classList.remove('visible'), 2000);
      }
      copyBtn.classList.add('copied');
      setTimeout(() => copyBtn.classList.remove('copied'), 2000);
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }
  });
}

/**
 * Modern 3D Tilt Effect on cards
 */
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;

  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouch) return; // Disable tilt on touch devices for smoother performance

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      card.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });
}

/**
 * Animated statistics on scroll
 */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.getAttribute('data-target'));
        const suffix = entry.target.getAttribute('data-suffix') || '';
        const decimals = parseInt(entry.target.getAttribute('data-decimals') || '0', 10);
        animateValue(entry.target, 0, target, 1600, decimals, suffix);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

function animateValue(obj, start, end, duration, decimals, suffix) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeOutQuad = 1 - Math.pow(1 - progress, 3);
    const currentVal = start + (end - start) * easeOutQuad;
    obj.textContent = currentVal.toFixed(decimals) + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.textContent = end.toFixed(decimals) + suffix;
    }
  };
  window.requestAnimationFrame(step);
}

/**
 * Navbar scroll blur dynamic adjustment
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/**
 * Mobile Navigation Menu
 */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggle.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggle.classList.remove('open');
    });
  });
}
