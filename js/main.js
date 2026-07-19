const app = (() => {
  const backToTop = document.getElementById("back-to-top");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const dropdowns = document.querySelectorAll(".dropdown");
  const faqItems = document.querySelectorAll(".faq-item");
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.getElementById("prev-testimonial");
  const nextBtn = document.getElementById("next-testimonial");
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const loadingScreen = document.getElementById("loading-screen");
  const navLinks = document.querySelectorAll('.nav-link[href]');
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
      const href = link.getAttribute("href");
      // Only handle in-page fragment links (e.g. "#services") —
      // skip absolute or path links which are not valid selectors.
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
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

  const closeSubmenus = () => {
    document.querySelectorAll(".dropdown-branch").forEach((branch) => {
      branch.classList.remove("open");
      const trigger = branch.querySelector(".dropdown-trigger");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  };

  const closeDropdowns = () => {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("open");
      const toggle = dropdown.querySelector(".dropdown-toggle");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    closeSubmenus();
  };

  const openDropdown = (dropdown) => {
    closeDropdowns();
    dropdown.classList.add("open");
    const toggle = dropdown.querySelector(".dropdown-toggle");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
    }
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
        const isOpen = navMenu.classList.toggle("open");
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
        closeDropdowns();
      });
    });

    dropdowns.forEach((dropdown) => {
      const toggle = dropdown.querySelector(".dropdown-toggle");
      if (!toggle) return;

      toggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const isOpen = dropdown.classList.contains("open");
        if (isOpen) {
          closeDropdowns();
        } else {
          openDropdown(dropdown);
        }
      });

      dropdown.addEventListener("mouseenter", () => openDropdown(dropdown));
      dropdown.addEventListener("mouseleave", closeDropdowns);
      toggle.addEventListener("focus", () => openDropdown(dropdown));
      toggle.addEventListener("blur", () => {
        setTimeout(() => {
          if (!dropdown.contains(document.activeElement)) {
            closeDropdowns();
          }
        }, 120);
      });
    });

    document.querySelectorAll(".dropdown-trigger").forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const branch = trigger.closest(".dropdown-branch");
        if (!branch) return;
        const isOpen = branch.classList.contains("open");
        document.querySelectorAll(".dropdown-branch").forEach((item) => {
          item.classList.remove("open");
          const itemTrigger = item.querySelector(".dropdown-trigger");
          if (itemTrigger) {
            itemTrigger.setAttribute("aria-expanded", "false");
          }
        });
        if (!isOpen) {
          branch.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });

    document.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", () => {
        closeDropdowns();
      });
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".dropdown")) {
        closeDropdowns();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDropdowns();
      }
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
      form.addEventListener("submit", (event) => {
        const submitButton = form.querySelector('button[type="submit"]');

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Sending...";
        }

        formStatus.textContent = "Sending your request...";
        formStatus.className = "form-status";
      });
    }
  };

  const shouldSkipLoadingScreen = () => {
    return window.matchMedia("(max-width: 900px)").matches ||
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;
  };

  const hideLoadingScreen = () => {
    if (!loadingScreen || loadingScreen.classList.contains("loaded")) return;

    loadingScreen.classList.add("loaded");

    if (shouldSkipLoadingScreen()) {
      loadingScreen.remove();
      return;
    }

    setTimeout(() => {
      if (loadingScreen?.parentNode) {
        loadingScreen.remove();
      }
    }, 600);
  };

  const init = () => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }

    hideLoadingScreen();
    updateTestimonial();
    initEvents();
    if (typeof animations !== "undefined" && animations.init) {
      animations.init();
    }
    if (typeof particles !== "undefined" && particles.init) {
      particles.init();
    }
    handleScroll();

    const finishLoading = () => {
      hideLoadingScreen();
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
      window.setTimeout(finishLoading, 800);
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        window.setTimeout(finishLoading, 800);
      }, { once: true });
    }

    window.addEventListener("load", finishLoading, { once: true });
  };

  return { init };
})();

window.addEventListener("DOMContentLoaded", app.init);
