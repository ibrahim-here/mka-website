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
  track.innerHTML = html;

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
});
