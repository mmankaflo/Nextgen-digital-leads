const particles = (() => {
  const config = {
    particleCount: 80,
    maxVelocity: 0.8,
    linkDistance: 140,
    colors: ["rgba(0,200,83,0.75)", "rgba(57,255,20,0.65)", "rgba(255,255,255,0.18)"],
  };

  let canvas, ctx, particlesArray, width, height;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * config.maxVelocity;
      this.vy = (Math.random() - 0.5) * config.maxVelocity;
      this.size = Math.random() * 2.2 + 1.3;
      this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
    }

    draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -20 || this.x > width + 20) this.vx *= -1;
      if (this.y < -20 || this.y > height + 20) this.vy *= -1;
    }
  }

  const resize = () => {
    width = canvas.clientWidth * window.devicePixelRatio;
    height = canvas.clientHeight * window.devicePixelRatio;
    canvas.width = width;
    canvas.height = height;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  };

  const createParticles = () => {
    particlesArray = Array.from({ length: config.particleCount }, () => new Particle());
  };

  const drawConnections = () => {
    for (let i = 0; i < particlesArray.length; i += 1) {
      const particle = particlesArray[i];
      for (let j = i + 1; j < particlesArray.length; j += 1) {
        const other = particlesArray[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.linkDistance) {
          ctx.strokeStyle = `rgba(57,255,20, ${1 - distance / config.linkDistance})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, width, height);
    particlesArray.forEach((particle) => {
      particle.update();
      particle.draw();
    });
    drawConnections();
    requestAnimationFrame(animate);
  };

  const init = () => {
    canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resize();
    createParticles();
    animate();
    window.addEventListener("resize", resize);
  };

  return { init };
})();
