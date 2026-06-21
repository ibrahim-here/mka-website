window.initGalleryTrack = function(images) {
  const track = document.getElementById('gallery-track');
  if (!track || !images || images.length === 0) return;

  // ─────────────────────────────────────────────────────────
  // 1. Populate Gallery with Real Images
  //    Images are displayed at full natural aspect ratio —
  //    no cropping. Height is fixed by CSS; width is auto.
  // ─────────────────────────────────────────────────────────
  let html = '';

  images.forEach((item, i) => {
    // Add Sanity image optimization params
    const optimizedUrl = `${item.url}?h=1000&auto=format`;
    html += `
      <div class="gallery-item">
        <a href="/projects/project-detail.html?slug=${item.slug}" onclick="localStorage.setItem('current_project_slug', '${item.slug}')" class="gallery-link">
          <img src="${optimizedUrl}" loading="lazy" alt="Gallery item ${i + 1}" draggable="false">
        </a>
      </div>
    `;
  });
  
  // Clone the gallery items enough times to fill the screen and allow seamless loop.
  // If there are very few images, clone them more times.
  const clonesNeeded = Math.max(3, Math.ceil(15 / images.length));
  
  let fullHtml = '';
  for(let c=0; c < clonesNeeded; c++) {
    fullHtml += html;
  }
  
  track.innerHTML = fullHtml;

  // Initialize scroll position to the middle set to allow scrolling left immediately
  setTimeout(() => {
    const setWidth = track.scrollWidth / clonesNeeded;
    // Scroll to the middle clone block
    track.scrollLeft = setWidth * Math.floor(clonesNeeded / 2);
    scrollLeft = track.scrollLeft; // Synchronize our internal variable
  }, 100);

  // ─────────────────────────────────────────────────────────
  // 2. Mouse Wheel → Horizontal Scroll
  //    When the user scrolls vertically over the gallery,
  //    translate that into horizontal scrolling instead.
  // ─────────────────────────────────────────────────────────
  track.addEventListener('wheel', (e) => {
    // Only intercept when the user is primarily scrolling horizontally
    // or if we strictly want to map vertical to horizontal.
    // To allow scrolling down the page, we only prevent default if horizontal scroll is larger
    // OR if we just want to add the delta to track, we don't prevent default.
    // Actually, mapping vertical to horizontal while preventing default breaks vertical page scrolling.
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      track.scrollLeft += e.deltaX;
      scrollLeft = track.scrollLeft;
    } else {
      // Let vertical scroll pass through to the page so user can reach the footer!
      // But we can optionally still move the track slightly
      track.scrollLeft += e.deltaY * 0.3;
      scrollLeft = track.scrollLeft;
    }
  }, { passive: false });

  // ─────────────────────────────────────────────────────────
  // 3. Drag to Scroll (pointer events, with inertia/momentum)
  // ─────────────────────────────────────────────────────────
  let isDragging = false;
  let startX;
  let scrollLeft = 0;
  let velocity = 0;
  let lastX;
  let animFrame;

  let hasDragged = false;

  track.addEventListener('pointerdown', (e) => {
    isDragging = true;
    hasDragged = false;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    lastX = e.pageX;
    track.style.cursor = 'grabbing';
    cancelAnimationFrame(animFrame);
  });

  track.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    hasDragged = true;
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    velocity = e.pageX - lastX;
    lastX = e.pageX;
    track.scrollLeft = scrollLeft - walk;
  });

  document.addEventListener('pointerup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = 'grab';

    // Momentum / inertia on release
    const decelerate = () => {
      if (Math.abs(velocity) < 0.5) return;
      track.scrollLeft -= velocity;
      velocity *= 0.93; // friction coefficient
      animFrame = requestAnimationFrame(decelerate);
    };
    decelerate();
  });

  // Prevent clicking on links if we were dragging
  track.addEventListener('click', (e) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // Prevent default browser image-drag from interfering
  track.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });

  // ─────────────────────────────────────────────────────────
  // 4. Smooth Animation Loop (with Auto-Scroll)
  // ─────────────────────────────────────────────────────────
  const autoScrollSpeed = 0.5; // Pixels per frame to constantly move

  function animate() {
    if (!isDragging) {
      // If the user isn't dragging, apply either the dying momentum or the constant auto-scroll
      let currentVelocity = velocity;
      
      if (Math.abs(velocity) < 0.1) {
        // Momentum is dead, apply constant auto-scroll (negative to move content left)
        currentVelocity = -autoScrollSpeed;
      } else {
        // Decay the manual drag momentum
        velocity *= 0.95;
      }

      scrollLeft -= currentVelocity;
      track.scrollLeft = scrollLeft;
      
      // Infinite Loop Logic!
      const setWidth = track.scrollWidth / clonesNeeded;
      
      if (track.scrollLeft >= setWidth * (clonesNeeded - 1.5)) {
        // Jump back
        track.scrollLeft -= setWidth;
        scrollLeft -= setWidth;
      } else if (track.scrollLeft <= setWidth * 0.5) {
        // Jump forward
        track.scrollLeft += setWidth;
        scrollLeft += setWidth;
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
};
