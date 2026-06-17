document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('gallery-track');
  if (!track) return;

  // ─────────────────────────────────────────────────────────
  // 1. Populate Gallery
  //    Images are displayed at full natural aspect ratio —
  //    no cropping. Height is fixed by CSS; width is auto.
  // ─────────────────────────────────────────────────────────
  const totalItems = 36;
  let html = '';

  for (let i = 0; i < totalItems; i++) {
    // Vary picsum dimensions to get a natural mix of landscape / portrait images
    const variants = [
      { w: 800, h: 520 },  // landscape
      { w: 520, h: 780 },  // portrait
      { w: 700, h: 520 },  // landscape
      { w: 400, h: 600 },  // tall portrait
      { w: 900, h: 520 },  // wide landscape
      { w: 520, h: 700 },  // portrait
    ];
    const { w, h } = variants[i % variants.length];
    const imgSrc = `https://picsum.photos/${w}/${h}?random=${300 + i}`;

    html += `
      <div class="gallery-item">
        <img src="${imgSrc}" loading="lazy" alt="Gallery item ${i + 1}">
      </div>
    `;
  }
  
  // Clone the gallery items 3 times for a seamless infinite loop
  track.innerHTML = html + html + html;

  // Initialize scroll position to the middle set to allow scrolling left immediately
  setTimeout(() => {
    const setWidth = track.scrollWidth / 3;
    track.scrollLeft = setWidth;
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
  // 4. Infinite Scroll Loop
  // ─────────────────────────────────────────────────────────
  track.addEventListener('scroll', () => {
    if (track.scrollWidth === 0) return;
    
    // Total width is composed of 3 identical sets of images
    const setWidth = track.scrollWidth / 3;
    
    // If we scroll into the 3rd set, silently jump back to the 2nd set
    if (track.scrollLeft >= setWidth * 2) {
      track.scrollLeft -= setWidth;
      scrollLeft -= setWidth; // Update drag start reference if dragging
    }
    // If we scroll into the 1st set, silently jump forward to the 2nd set
    else if (track.scrollLeft <= 0) {
      track.scrollLeft += setWidth;
      scrollLeft += setWidth; // Update drag start reference if dragging
    }
  });
});
