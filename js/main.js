const app = (() => {
  const backToTop = document.getElementById("back-to-top");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const faqItems = document.querySelectorAll(".faq-item");
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.getElementById("prev-testimonial");
  const nextBtn = document.getElementById("next-testimonial");
  const form = document.getElementById("contact-form");
  const loadingScreen = document.getElementById("loading-screen");
  const navLinks = document.querySelectorAll(".nav-link");
  let testimonialIndex = 0;

  const updateTestimonial = () => {
    testimonialCards.forEach((card, index) => {
      card.classList.toggle("active", index === testimonialIndex);
    });
  };

  const handleScroll = () => {
    if (window.scrollY > 320) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }

    navLinks.forEach((link) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      const top = target.offsetTop - 110;
      const bottom = top + target.offsetHeight;
      const scroll = window.scrollY;
      if (scroll >= top && scroll < bottom) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  const handleFaqClick = (item) => {
    const isActive = item.classList.contains("active");
    faqItems.forEach((faq) => faq.classList.remove("active"));
    if (!isActive) item.classList.add("active");
  };


  const initEvents = () => {
    window.addEventListener("scroll", handleScroll);

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    navToggle.addEventListener("click", () => {
      const isOpen = !navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    faqItems.forEach((item) => {
      item.querySelector(".faq-question").addEventListener("click", () => handleFaqClick(item));
    });

    prevBtn.addEventListener("click", () => {
      testimonialIndex = testimonialIndex === 0 ? testimonialCards.length - 1 : testimonialIndex - 1;
      updateTestimonial();
    });

    nextBtn.addEventListener("click", () => {
      testimonialIndex = testimonialIndex === testimonialCards.length - 1 ? 0 : testimonialIndex + 1;
      updateTestimonial();
    });
  };

  const init = () => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }

    updateTestimonial();
    initEvents();
    animations.init();
    particles.init();
    handleScroll();

    window.addEventListener("load", () => {
      if (loadingScreen) {
        loadingScreen.classList.add("loaded");
        setTimeout(() => loadingScreen.remove(), 600);
      }
    });
  };

  return { init };
})();

window.addEventListener("DOMContentLoaded", app.init);
