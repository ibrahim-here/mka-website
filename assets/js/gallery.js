window.initGalleryTrack = function(imageUrls) {
  const track = document.getElementById('gallery-track');
  if (!track || !imageUrls || imageUrls.length === 0) return;

  // ─────────────────────────────────────────────────────────
  // 1. Populate Gallery with Real Images
  //    Images are displayed at full natural aspect ratio —
  //    no cropping. Height is fixed by CSS; width is auto.
  // ─────────────────────────────────────────────────────────
  let html = '';

  imageUrls.forEach((url, i) => {
    // Add Sanity image optimization params
    const optimizedUrl = `${url}?h=1000&auto=format`;
    html += `
      <div class="gallery-item">
        <img src="${optimizedUrl}" loading="lazy" alt="Gallery item ${i + 1}">
      </div>
    `;
  });
  
  // Clone the gallery items enough times to fill the screen and allow seamless loop.
  // If there are very few images, clone them more times.
  const clonesNeeded = Math.max(3, Math.ceil(15 / imageUrls.length));
  
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
  }, 100);

  // ─────────────────────────────────────────────────────────
  // 2. Mouse Wheel → Horizontal Scroll
  //    When the user scrolls vertically over the gallery,
  //    translate that into horizontal scrolling instead.
  // ─────────────────────────────────────────────────────────
  track.addEventListener('wheel', (e) => {
    // Only intercept when the track is the scroll target
    e.preventDefault();
    // deltaY is the vertical scroll; redirect it horizontally
    track.scrollLeft += e.deltaY + e.deltaX;
  }, { passive: false });

  // ─────────────────────────────────────────────────────────
  // 3. Drag to Scroll (pointer events, with inertia/momentum)
  // ─────────────────────────────────────────────────────────
  let isDragging = false;
  let startX;
  let scrollLeft;
  let velocity = 0;
  let lastX;
  let animFrame;

  track.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    lastX = e.pageX;
    track.style.cursor = 'grabbing';
    cancelAnimationFrame(animFrame);
  });

  track.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
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

  // Prevent default browser image-drag from interfering
  track.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });

  // ─────────────────────────────────────────────────────────
  // 4. Smooth Animation Loop
  // ─────────────────────────────────────────────────────────
  function animate() {
    if (!isDragging) {
      // Apply momentum
      scrollLeft -= velocity;
      track.scrollLeft = scrollLeft;
      
      // Decay velocity
      velocity *= 0.95;
      
      // Stop animation when velocity is very small
      if (Math.abs(velocity) < 0.1) velocity = 0;
      
      // Infinite Loop Logic!
      // If we've scrolled past a third of the width, seamlessly jump back.
      // The total width is made of N identical sets of images.
      const setWidth = track.scrollWidth / clonesNeeded;
      
      if (track.scrollLeft >= track.scrollWidth - setWidth - track.clientWidth) {
        // Jump back
        track.scrollLeft -= setWidth;
        scrollLeft -= setWidth;
      } else if (track.scrollLeft <= setWidth / 2) {
        // Jump forward
        track.scrollLeft += setWidth;
        scrollLeft += setWidth;
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
};
