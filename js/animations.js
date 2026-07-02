const animations = (() => {
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = Number(entry.target.dataset.target);
          const duration = 1600;
          let start = 0;
          const step = (timestamp) => {
            if (!entry.target.startTime) entry.target.startTime = timestamp;
            const progress = Math.min((timestamp - entry.target.startTime) / duration, 1);
            entry.target.textContent = Math.floor(progress * target);
            if (progress < 1) window.requestAnimationFrame(step);
            else entry.target.textContent = target;
          };
          window.requestAnimationFrame(step);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const init = () => {
    revealElements.forEach((el) => revealObserver.observe(el));
    document.querySelectorAll(".stat-number").forEach((counter) => counterObserver.observe(counter));
  };

  return { init };
})();
