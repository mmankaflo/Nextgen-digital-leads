const app = (() => {
  const backToTop = document.getElementById("back-to-top");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const faqItems = document.querySelectorAll(".faq-item");
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.getElementById("prev-testimonial");
  const nextBtn = document.getElementById("next-testimonial");
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const loadingScreen = document.getElementById("loading-screen");
  const navLinks = document.querySelectorAll(".nav-link");
  const sideTabToggle = document.getElementById("side-tab-toggle");
  const sideTabPanel = document.getElementById("side-tab-panel");
  const sideTabItems = document.querySelectorAll(".side-tab-item");
  const modalOverlay = document.getElementById("project-modal");
  const modalClose = document.getElementById("modal-close");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalTags = document.getElementById("modal-tags");
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

  const handleSideTabToggle = () => {
    if (!sideTabPanel || !sideTabToggle) return;
    const isOpen = sideTabPanel.classList.toggle("open");
    sideTabToggle.setAttribute("aria-expanded", String(isOpen));
  };

  const handleSideTabItemClick = (item) => {
    const targetId = item.dataset.target;
    if (targetId) {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }

    sideTabItems.forEach((tab) => tab.classList.remove("active"));
    item.classList.add("active");

    // Keep panel open for continued navigation
  };

  const openProjectModal = (title, description, tags = []) => {
    if (!modalOverlay || !modalTitle || !modalDescription || !modalTags) return;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalTags.innerHTML = tags.map((tag) => `<span>${tag}</span>`).join("");
    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
  };

  const closeProjectModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");
  };

  const initEvents = () => {
    window.addEventListener("scroll", handleScroll);

    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        const isOpen = !navMenu.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
      });
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (navMenu) {
          navMenu.classList.remove("open");
        }
        if (navToggle) {
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      if (question) {
        question.addEventListener("click", () => handleFaqClick(item));
      }
    });

    if (sideTabToggle) {
      sideTabToggle.addEventListener("click", handleSideTabToggle);
    }

    sideTabItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        // Don't prevent default for external links
        if (item.classList.contains("side-tab-link") && item.getAttribute("href")) {
          return;
        }
        e.preventDefault();
        handleSideTabItemClick(item);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        testimonialIndex = testimonialIndex === 0 ? testimonialCards.length - 1 : testimonialIndex - 1;
        updateTestimonial();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        testimonialIndex = testimonialIndex === testimonialCards.length - 1 ? 0 : testimonialIndex + 1;
        updateTestimonial();
      });
    }

    document.querySelectorAll(".view-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest(".portfolio-item");
        const title = card?.querySelector(".portfolio-info h3")?.textContent || "Project Preview";
        const description = card?.querySelector(".portfolio-info p")?.textContent || "We create tailored digital experiences that help businesses grow with clarity and impact.";
        const tags = Array.from(card?.querySelectorAll(".tech-tags span") || []).map((tag) => tag.textContent);
        openProjectModal(title, description, tags);
      });
    });

    if (modalClose) {
      modalClose.addEventListener("click", closeProjectModal);
    }

    if (modalOverlay) {
      modalOverlay.addEventListener("click", (event) => {
        if (event.target === modalOverlay) {
          closeProjectModal();
        }
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeProjectModal();
      }
    });

    document.querySelectorAll("[data-scroll-target]").forEach((element) => {
      element.addEventListener("click", () => {
        const target = document.querySelector(element.dataset.scrollTarget);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    if (form && formStatus) {
      form.addEventListener("submit", () => {
        formStatus.textContent = "Your request has been successfully sent and a consultant will reach out to you within 24h.";
        formStatus.className = "form-status success";
      });
    }
  };

  const init = () => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }

    updateTestimonial();
    initEvents();
    if (typeof animations !== "undefined" && animations.init) {
      animations.init();
    }
    if (typeof particles !== "undefined" && particles.init) {
      particles.init();
    }
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
