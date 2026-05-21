document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('gallery-track');
  if (!track) return;

  // 1. Populate Gallery
  // The prompt asks for 30-40 images with alternating sizes: medium, large, small, medium, large, small...
  const totalItems = 36;
  const sizes = ['size-medium', 'size-large', 'size-small'];
  let html = '';

  for (let i = 0; i < totalItems; i++) {
    const sizeClass = sizes[i % sizes.length];
    // Vary the aspect ratios based on size for picsum
    let w, h;
    if (sizeClass === 'size-small') { w = 280; h = 360; }
    else if (sizeClass === 'size-medium') { w = 420; h = 520; }
    else { w = 620; h = 420; }
    
    const imgSrc = `https://picsum.photos/${w}/${h}?random=${300 + i}`;
    
    html += `
      <div class="gallery-item ${sizeClass}">
        <img src="${imgSrc}" loading="lazy" alt="Gallery item ${i + 1}">
      </div>
    `;
  }
  track.innerHTML = html;

  // 2. Drag to Scroll Logic (exactly as per prompt)
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
      velocity *= 0.93; // friction
      animFrame = requestAnimationFrame(decelerate);
    };
    decelerate();
  });
  
  // Prevent default image drag behavior that interrupts pointer events
  track.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });
});
