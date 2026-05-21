document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initPageTransitions();
  initScrollNav();
  
  // Remove page transition overlay on load
  const overlay = document.querySelector('.page-transition-overlay');
  if (overlay) {
    // Let GSAP handle the stagger in animations, just fade out the cover
    gsap.to(overlay, { opacity: 0, duration: 0.6, ease: "power2.inOut", onComplete: () => {
      overlay.style.display = 'none';
    }});
  }

  // Global Page Load Stagger (if main content wrapper exists)
  const mainContent = document.querySelector('main');
  if (mainContent && window.gsap) {
    // Only stagger immediate children of main or specific top-level elements
    gsap.from("main > section > .container > *", {
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.08,
      delay: 0.2 // wait for overlay
    });
  }

  // Initialize Accordion and Carousel
  initAccordion();
  initCarousel();
});

function initMobileNav() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const overlay = document.querySelector('.mobile-overlay');
  
  if (!toggle || !overlay) return;

  toggle.addEventListener('click', () => {
    overlay.classList.toggle('active');
    
    if (overlay.classList.contains('active')) {
      // Animate links in
      const links = overlay.querySelectorAll('.nav-links a');
      gsap.fromTo(links, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      );
    }
  });
}

function initPageTransitions() {
  const links = document.querySelectorAll('a');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('href');
      
      // Ignore anchors or external links
      if (!target || target.startsWith('#') || target.startsWith('http') || link.getAttribute('target') === '_blank') {
        return;
      }
      
      e.preventDefault();
      
      // Create or show overlay
      let overlay = document.querySelector('.page-transition-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.style.opacity = '0';
        overlay.style.display = 'block';
        document.body.appendChild(overlay);
      } else {
        overlay.style.display = 'block';
      }
      
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          window.location.href = target;
        }
      });
    });
  });
}

function initScrollNav() {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  if (items.length === 0) return;

  // Open the first item by default
  const firstItem = items[0];
  const firstHeader = firstItem.querySelector('.accordion-header');
  const firstContent = firstItem.querySelector('.accordion-content');
  const firstIcon = firstItem.querySelector('.accordion-icon');
  
  if (firstContent) {
    firstContent.classList.add('active');
    firstContent.style.height = firstContent.scrollHeight + 'px';
    if (firstIcon) firstIcon.innerHTML = '×';
  }

  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const icon = item.querySelector('.accordion-icon');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = content.classList.contains('active');

      // Close all items
      items.forEach(otherItem => {
        const otherContent = otherItem.querySelector('.accordion-content');
        const otherIcon = otherItem.querySelector('.accordion-icon');
        if (otherContent && otherContent.classList.contains('active')) {
          otherContent.classList.remove('active');
          otherContent.style.height = '0px';
          if (otherIcon) otherIcon.innerHTML = '+';
        }
      });

      // Open clicked item if it was closed
      if (!isOpen) {
        content.classList.add('active');
        content.style.height = content.scrollHeight + 'px';
        if (icon) icon.innerHTML = '×';
      }
    });
  });
}

function initCarousel() {
  const container = document.querySelector('.carousel-container');
  if (!container) return;

  const slides = Array.from(container.querySelectorAll('.carousel-slide'));
  if (slides.length === 0) return;

  let currentIndex = 0;

  // Create Left/Right navigation buttons
  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-nav-btn prev-btn';
  prevBtn.innerHTML = '←';
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-nav-btn next-btn';
  nextBtn.innerHTML = '→';

  function updateCarousel() {
    const N = slides.length;
    slides.forEach((slide, index) => {
      slide.className = 'carousel-slide';
      
      const relativeIndex = (index - currentIndex + N) % N;
      
      if (relativeIndex === 0) {
        slide.classList.add('active');
        slide.appendChild(prevBtn);
        slide.appendChild(nextBtn);
      } else if (relativeIndex === 1) {
        slide.classList.add('next');
      } else if (relativeIndex === N - 1) {
        slide.classList.add('prev');
      } else {
        slide.classList.add('hidden');
      }
    });
  }

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });

  slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
      if (slide.classList.contains('prev')) {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
      } else if (slide.classList.contains('next')) {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
      }
    });
  });

  updateCarousel();
}
