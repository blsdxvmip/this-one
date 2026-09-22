/**
 * Interactive Particle & Constellation Canvas Effect
 * High-performance 60fps HTML5 Canvas particle network with ambient drift,
 * dynamic constellation connections, mouse/touch repulsion, and Retina/high-DPI support.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.initParticleCanvas = factory().initParticleCanvas;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Default Configuration Options
   */
  const DEFAULT_OPTIONS = {
    // Particle counts: density determines count = (width * height) / density
    density: 12000,
    minParticles: 35,
    maxParticles: 120,

    // Particle Appearance
    minRadius: 1.2,
    maxRadius: 2.6,
    particleColor: '129, 140, 248', // Indigo-400 (RGB string for alpha blending)
    accentColor: '56, 189, 248',   // Sky-400 accent for varied glowing nodes
    accentRatio: 0.25,             // 25% of particles will have the accent glow

    // Alpha / Opacity pulsing
    minAlpha: 0.2,
    maxAlpha: 0.8,
    pulseSpeedRange: [0.008, 0.02],

    // Velocity & Movement
    speed: 0.45,
    friction: 0.95,
    ambientDrift: 0.02,

    // Constellation Connections
    connectDistance: 130,
    lineBaseAlpha: 0.25,
    lineWidth: 0.8,

    // Mouse & Touch Repulsion
    interactionRadius: 150,
    repulsionStrength: 0.8,
    returnEase: 0.04
  };

  /**
   * Single Particle Entity
   */
  class Particle {
    constructor(canvasWidth, canvasHeight, options) {
      this.options = options;
      this.isAccent = Math.random() < options.accentRatio;
      this.colorRgb = this.isAccent ? options.accentColor : options.particleColor;

      this.init(canvasWidth, canvasHeight, true);
    }

    init(width, height, randomPlacement = false) {
      this.radius = this.options.minRadius + Math.random() * (this.options.maxRadius - this.options.minRadius);

      // Random position across canvas
      if (randomPlacement) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
      }

      // Ambient velocity
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.3 + Math.random() * 0.7) * this.options.speed;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;

      // Displacement forces from interaction
      this.fx = 0;
      this.fy = 0;

      // Alpha pulsing phase and speed
      this.alphaPhase = Math.random() * Math.PI * 2;
      const [minPulse, maxPulse] = this.options.pulseSpeedRange;
      this.pulseSpeed = minPulse + Math.random() * (maxPulse - minPulse);
      this.alpha = this.options.minAlpha;
    }

    update(width, height, mouse) {
      // 1. Update subtle alpha pulsing
      this.alphaPhase += this.pulseSpeed;
      const alphaRange = this.options.maxAlpha - this.options.minAlpha;
      this.alpha = this.options.minAlpha + (Math.sin(this.alphaPhase) * 0.5 + 0.5) * alphaRange;

      // 2. Mouse Repulsion Physics
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const maxDist = this.options.interactionRadius;

        if (distSq < maxDist * maxDist && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / maxDist) * this.options.repulsionStrength;
          const normalX = dx / dist;
          const normalY = dy / dist;

          // Push away from cursor smoothly
          this.fx += normalX * force * 2.2;
          this.fy += normalY * force * 2.2;
        }
      }

      // Smooth decay of displacement forces
      this.fx *= this.options.friction;
      this.fy *= this.options.friction;

      // 3. Move particle
      this.x += this.vx + this.fx;
      this.y += this.vy + this.fy;

      // 4. Subtle ambient nudge
      this.vx += (Math.random() - 0.5) * this.options.ambientDrift;
      this.vy += (Math.random() - 0.5) * this.options.ambientDrift;

      // Clamp ambient velocity so it stays gentle
      const maxSpd = this.options.speed * 1.5;
      this.vx = Math.max(-maxSpd, Math.min(maxSpd, this.vx));
      this.vy = Math.max(-maxSpd, Math.min(maxSpd, this.vy));

      // 5. Wrap around canvas edges seamlessly
      const padding = this.radius * 2;
      if (this.x < -padding) this.x = width + padding;
      else if (this.x > width + padding) this.x = -padding;

      if (this.y < -padding) this.y = height + padding;
      else if (this.y > height + padding) this.y = -padding;
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.colorRgb}, ${this.alpha})`;
      ctx.fill();

      // Subtle glow for accent particles
      if (this.isAccent && this.alpha > 0.4) {
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${this.colorRgb}, ${this.alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.colorRgb}, ${this.alpha})`;
        ctx.fill();
        ctx.restore();
      }
    }
  }

  /**
   * Main Particle Network Canvas Controller
   */
  class ParticleNetwork {
    constructor(canvas, userOptions = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      if (!this.ctx) {
        console.error('ParticleCanvas: Unable to get 2D context.');
        return;
      }

      this.options = Object.assign({}, DEFAULT_OPTIONS, userOptions);
      this.particles = [];
      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.animationFrameId = null;
      this.isRunning = false;

      // Mouse & Pointer state
      this.mouse = {
        x: -9999,
        y: -9999,
        targetX: -9999,
        targetY: -9999,
        active: false
      };

      // Bind event handlers
      this.handleResize = this.handleResize.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseLeave = this.handleMouseLeave.bind(this);
      this.handleTouchMove = this.handleTouchMove.bind(this);
      this.handleTouchEnd = this.handleTouchEnd.bind(this);
      this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
      this.tick = this.tick.bind(this);

      this.init();
    }

    init() {
      this.updateDimensions();
      this.spawnParticles();
      this.bindEvents();
      this.start();
    }

    updateDimensions() {
      const rect = this.canvas.getBoundingClientRect();
      const parent = this.canvas.parentElement;

      // Use bounding rect or parent client dimensions
      const cssWidth = rect.width || (parent ? parent.clientWidth : window.innerWidth);
      const cssHeight = rect.height || (parent ? parent.clientHeight : window.innerHeight);

      this.width = cssWidth;
      this.height = cssHeight;

      // High-DPI / Retina optimization (capped at 2 for optimal battery and performance)
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);

      this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      this.ctx.scale(this.dpr, this.dpr);
    }

    spawnParticles() {
      const area = this.width * this.height;
      let count = Math.floor(area / this.options.density);
      count = Math.max(this.options.minParticles, Math.min(this.options.maxParticles, count));

      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push(new Particle(this.width, this.height, this.options));
      }
    }

    bindEvents() {
      window.addEventListener('resize', this.handleResize, { passive: true });
      document.addEventListener('visibilitychange', this.handleVisibilityChange);

      // Track relative to canvas bounding client rect
      window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', this.handleMouseLeave, { passive: true });

      // Touch interaction
      window.addEventListener('touchstart', this.handleTouchMove, { passive: true });
      window.addEventListener('touchmove', this.handleTouchMove, { passive: true });
      window.addEventListener('touchend', this.handleTouchEnd, { passive: true });
      window.addEventListener('touchcancel', this.handleTouchEnd, { passive: true });
    }

    unbindEvents() {
      window.removeEventListener('resize', this.handleResize);
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseleave', this.handleMouseLeave);
      window.removeEventListener('touchstart', this.handleTouchMove);
      window.removeEventListener('touchmove', this.handleTouchMove);
      window.removeEventListener('touchend', this.handleTouchEnd);
      window.removeEventListener('touchcancel', this.handleTouchEnd);
    }

    handleResize() {
      const oldWidth = this.width;
      const oldHeight = this.height;

      this.updateDimensions();

      if (oldWidth > 0 && oldHeight > 0) {
        // Adjust existing particle positions proportionally
        const scaleX = this.width / oldWidth;
        const scaleY = this.height / oldHeight;

        for (let i = 0; i < this.particles.length; i++) {
          this.particles[i].x *= scaleX;
          this.particles[i].y *= scaleY;
        }
      }

      // Re-adjust particle count to maintain ideal density
      const targetCount = Math.max(
        this.options.minParticles,
        Math.min(this.options.maxParticles, Math.floor((this.width * this.height) / this.options.density))
      );

      while (this.particles.length < targetCount) {
        this.particles.push(new Particle(this.width, this.height, this.options));
      }
      if (this.particles.length > targetCount) {
        this.particles.length = targetCount;
      }
    }

    getRelativeCoords(clientX, clientY) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    handleMouseMove(e) {
      const coords = this.getRelativeCoords(e.clientX, e.clientY);
      // Only active if cursor is reasonably within/near canvas bounds
      if (
        coords.x >= -100 &&
        coords.x <= this.width + 100 &&
        coords.y >= -100 &&
        coords.y <= this.height + 100
      ) {
        this.mouse.x = coords.x;
        this.mouse.y = coords.y;
        this.mouse.active = true;
      } else {
        this.mouse.active = false;
      }
    }

    handleMouseLeave() {
      this.mouse.active = false;
    }

    handleTouchMove(e) {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const coords = this.getRelativeCoords(touch.clientX, touch.clientY);
        this.mouse.x = coords.x;
        this.mouse.y = coords.y;
        this.mouse.active = true;
      }
    }

    handleTouchEnd() {
      this.mouse.active = false;
    }

    handleVisibilityChange() {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    }

    drawConnections() {
      const p = this.particles;
      const len = p.length;
      const maxDist = this.options.connectDistance;
      const maxDistSq = maxDist * maxDist;
      const ctx = this.ctx;

      ctx.lineWidth = this.options.lineWidth;

      for (let i = 0; i < len; i++) {
        const p1 = p[i];

        for (let j = i + 1; j < len; j++) {
          const p2 = p[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;

          // Quick bounding box check before calculating square distance
          if (Math.abs(dx) > maxDist || Math.abs(dy) > maxDist) continue;

          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            // Proximity alpha fading
            const proximityFactor = 1 - dist / maxDist;
            const lineAlpha = proximityFactor * this.options.lineBaseAlpha * Math.min(p1.alpha, p2.alpha);

            if (lineAlpha <= 0.01) continue;

            ctx.strokeStyle = `rgba(${this.options.particleColor}, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Optional interactive connection line to the cursor if nearby
        if (this.mouse.active) {
          const mdx = p1.x - this.mouse.x;
          const mdy = p1.y - this.mouse.y;
          const mDistSq = mdx * mdx + mdy * mdy;
          const mouseConnectDist = this.options.interactionRadius;

          if (mDistSq < mouseConnectDist * mouseConnectDist) {
            const mDist = Math.sqrt(mDistSq);
            const mAlpha = (1 - mDist / mouseConnectDist) * 0.35 * p1.alpha;
            if (mAlpha > 0.02) {
              ctx.strokeStyle = `rgba(${this.options.accentColor}, ${mAlpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(this.mouse.x, this.mouse.y);
              ctx.stroke();
            }
          }
        }
      }
    }

    tick() {
      if (!this.isRunning) return;

      // Clear full canvas buffer
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Update and draw all particles
      const count = this.particles.length;
      for (let i = 0; i < count; i++) {
        const particle = this.particles[i];
        particle.update(this.width, this.height, this.mouse);
        particle.draw(this.ctx);
      }

      // Draw constellation network lines
      this.drawConnections();

      // Schedule next 60fps frame
      this.animationFrameId = requestAnimationFrame(this.tick);
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.animationFrameId = requestAnimationFrame(this.tick);
    }

    stop() {
      this.isRunning = false;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }

    destroy() {
      this.stop();
      this.unbindEvents();
      this.particles = [];
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }
    }
  }

  /**
   * Safe initialization function for consumers
   * @param {HTMLCanvasElement|string} canvasElementOrId Canvas DOM element or ID/selector string
   * @param {Object} [options] Custom configuration parameters
   * @returns {ParticleNetwork|null} Controller instance with start(), stop(), and destroy() methods
   */
  function initParticleCanvas(canvasElementOrId, options = {}) {
    let canvas = null;

    if (typeof canvasElementOrId === 'string') {
      canvas = document.getElementById(canvasElementOrId) || document.querySelector(canvasElementOrId);
    } else if (canvasElementOrId && canvasElementOrId.nodeType === 1) {
      canvas = canvasElementOrId;
    }

    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      console.warn(
        'initParticleCanvas: Valid <canvas> element not found for selector/element:',
        canvasElementOrId
      );
      return null;
    }

    return new ParticleNetwork(canvas, options);
  }

  // Automatic DOM initialization if a canvas with data-particles or id="particles-canvas" exists
  if (typeof document !== 'undefined') {
    const autoInit = () => {
      const defaultTarget =
        document.querySelector('canvas[data-particles]') ||
        document.getElementById('particles-canvas') ||
        document.getElementById('particle-canvas');

      if (defaultTarget && !defaultTarget._particleNetworkInstance) {
        defaultTarget._particleNetworkInstance = initParticleCanvas(defaultTarget);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoInit);
    } else {
      autoInit();
    }
  }

  return {
    initParticleCanvas,
    ParticleNetwork
  };
});
