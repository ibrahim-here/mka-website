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

  initHoverTextAnimation();
  initAccordionMarquees();

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

// Handle Back/Forward Cache (bfcache) navigation
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.display = 'none';
    }
  }
});

window.toggleMobileMenu = function(element) {
  const overlay = document.querySelector('.mobile-overlay');
  const toggleBtn = element || document.querySelector('.mobile-menu-toggle');
  const scrollMenuBtn = document.getElementById('scrollMenuBtn');

  if(toggleBtn) toggleBtn.classList.toggle('active');
  overlay.classList.toggle('active');
  
  const isActive = overlay.classList.contains('active');
  document.body.style.overflow = isActive ? 'hidden' : '';
  
  if (scrollMenuBtn) {
    scrollMenuBtn.textContent = isActive ? 'CLOSE' : 'MENU';
  }
  
  if (isActive) {
    // Animate links in
    const links = overlay.querySelectorAll('.nav-links a');
    if (window.gsap) {
      gsap.fromTo(links, 
        { x: -30, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      );
    }
  }
};

function initMobileNav() {
  // Close when clicking anywhere outside nav-links in overlay
  const mobileOverlay = document.querySelector('.mobile-overlay');
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
      // If the user didn't click on a link, close it.
      if (!e.target.closest('a')) {
        window.toggleMobileMenu();
      }
    });
  }
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
  const links = document.querySelector('.nav-links');
  const scrollMenuBtn = document.getElementById('scrollMenuBtn');
  const overlay = document.querySelector('.mobile-overlay');
  
  if (!nav) return;

  if (scrollMenuBtn && overlay) {
    scrollMenuBtn.addEventListener('click', () => {
      const toggleBtn = document.querySelector('.mobile-menu-toggle');
      if (toggleBtn) {
        toggleBtn.click();
      } else {
        overlay.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    const heroSection = document.querySelector('.hero-section, .project-hero');
    const threshold = heroSection ? heroSection.offsetHeight - 10 : 50; // Slight offset so it happens right when it touches

    if (window.scrollY >= threshold) {
      if (links) links.classList.add('hidden-on-scroll');
      if (scrollMenuBtn) scrollMenuBtn.classList.add('visible');
      // Logo should disappear too
      const logo = nav.querySelector('.nav-logo');
      if(logo) {
        logo.style.transition = "opacity 0.4s ease";
        logo.style.opacity = "0";
        logo.style.pointerEvents = "none";
      }
      nav.classList.add('scrolled');
      if (heroSection) {
        nav.classList.remove('hero-inverted');
      }
    } else {
      if (links) links.classList.remove('hidden-on-scroll');
      if (scrollMenuBtn) scrollMenuBtn.classList.remove('visible');
      const logo = nav.querySelector('.nav-logo');
      if(logo) {
        logo.style.opacity = "1";
        logo.style.pointerEvents = "auto";
      }
      nav.classList.remove('scrolled');
      if (heroSection) {
        nav.classList.add('hero-inverted');
      }
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

function initHoverTextAnimation() {
  const elements = document.querySelectorAll('[class*="btn"], .nav-links a');
  elements.forEach(el => {
    // Skip if already wrapped
    if (el.querySelector('.hover-text-wrapper')) return;
    
    // Find the text node (ignore ::before pseudo elements in HTML, as they are CSS)
    let textNode = null;
    el.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        textNode = node;
      }
    });
    
    if (textNode) {
      const text = textNode.textContent.trim();
      const wrapper = document.createElement('span');
      wrapper.className = 'hover-text-wrapper';
      wrapper.innerHTML = `<span class="hover-text-visible">${text}</span><span class="hover-text-hidden">${text}</span>`;
      el.replaceChild(wrapper, textNode);
    }
  });
}

function initAccordionMarquees() {
  const wrappers = document.querySelectorAll('.accordion-images');
  wrappers.forEach(wrapper => {
    const track = wrapper.querySelector('.accordion-images-track');
    if (!track) return;
    
    const originalContent = track.innerHTML;
    const clonesNeeded = 10;
    let newContent = '';
    for(let c=0; c < clonesNeeded; c++) {
      newContent += originalContent;
    }
    track.innerHTML = newContent;
    
    wrapper.style.overflowX = 'hidden';
    wrapper.style.cursor = 'grab';
    
    let isDragging = false;
    let startX, scrollLeftPos = 0;
    let velocity = 0, lastX;
    const autoScrollSpeed = 0.8; // Slightly faster and smoother
    let currentScroll = 0;

    wrapper.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startX = e.pageX - wrapper.offsetLeft;
      scrollLeftPos = wrapper.scrollLeft;
      lastX = e.pageX;
      wrapper.style.cursor = 'grabbing';
    });

    wrapper.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - wrapper.offsetLeft;
      const walk = (x - startX) * 1.5;
      velocity = e.pageX - lastX;
      lastX = e.pageX;
      wrapper.scrollLeft = scrollLeftPos - walk;
      currentScroll = wrapper.scrollLeft;
    });

    document.addEventListener('pointerup', () => {
      if (!isDragging) return;
      isDragging = false;
      wrapper.style.cursor = 'grab';
    });
    
    wrapper.addEventListener('dragstart', e => e.preventDefault());

    function animate() {
      if (!isDragging) {
        if (Math.abs(velocity) < 0.1) {
          velocity = -autoScrollSpeed; 
        } else {
          velocity *= 0.95; 
        }
        
        currentScroll -= velocity;
        
        const setWidth = track.scrollWidth / clonesNeeded;
        if (currentScroll >= setWidth * (clonesNeeded - 2)) {
          currentScroll -= setWidth;
        } else if (currentScroll <= setWidth) {
          currentScroll += setWidth;
        }
        
        wrapper.scrollLeft = currentScroll;
      }
      requestAnimationFrame(animate);
    }
    
    setTimeout(() => {
      currentScroll = track.scrollWidth / 4;
      wrapper.scrollLeft = currentScroll; 
      animate();
    }, 100);
  });
}
