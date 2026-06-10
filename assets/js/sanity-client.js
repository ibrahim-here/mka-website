const SANITY_PROJECT_ID = '6xblaggo';
const SANITY_DATASET = 'production';

// Helper to fetch Sanity data
async function fetchSanityData(query) {
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2023-05-03/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching from Sanity:", error);
    return [];
  }
}

// Fetch 4 featured projects for the home page
async function fetchFeaturedProjects() {
  const query = `*[_type == "project"] | order(_createdAt asc) [0...4] {
    title,
    slug,
    category,
    "imageUrl": mainImage.asset->url
  }`;
  return await fetchSanityData(query);
}

// Fetch all projects for the portfolio page
async function fetchAllProjects() {
  const query = `*[_type == "project"] | order(_createdAt desc) {
    title,
    slug,
    category,
    "imageUrl": mainImage.asset->url
  }`;
  return await fetchSanityData(query);
}

// Fetch a single project by its slug
async function fetchProjectBySlug(slug) {
  const query = `*[_type == "project" && slug.current == "${slug}"][0] {
    title,
    category,
    "mainImageUrl": mainImage.asset->url,
    "galleryUrls": gallery[].asset->url
  }`;
  return await fetchSanityData(query);
}

// Render projects on the home page
async function renderHomeProjects() {
  const container = document.querySelector('.projects-scroll-container');
  if (!container) return;

  const projects = await fetchFeaturedProjects();
  if (!projects || projects.length === 0) return;

  // Clear existing static projects except the "View All Projects" button
  const ctaBtn = container.querySelector('.text-center');
  container.innerHTML = '';

  projects.forEach((project, index) => {
    const isLeft = index % 2 === 0;
    const card = document.createElement('a');
    card.href = `../projects/project-detail.html?slug=${project.slug.current}`;
    card.addEventListener('click', () => localStorage.setItem('current_project_slug', project.slug.current));
    card.className = `project-card ${isLeft ? 'project-left' : 'project-right'}`;
    
    // Default image if upload failed
    const imgSrc = project.imageUrl ? `${project.imageUrl}?w=800&h=1000&fit=crop&auto=format` : 'https://picsum.photos/800/600?random=201';

    card.innerHTML = `
      <div class="project-img-wrapper">
        <img src="${imgSrc}" alt="${project.title}">
      </div>
      <div class="project-info">
        <h3>${project.title}</h3>
        <span class="project-category">${project.category.replace('-', ' ')}</span>
      </div>
    `;
    container.appendChild(card);
  });

  if (ctaBtn) {
    container.appendChild(ctaBtn);
  }

  // Re-initialize GSAP animations for the new dynamic elements
  if (window.gsap && window.ScrollTrigger) {
    ScrollTrigger.refresh();
  }
}

async function replaceDummyImages() {
  // Wait a moment to allow scripts like gallery.js to inject their dummy images first
  setTimeout(async () => {
    const dummyImages = document.querySelectorAll('img[src*="picsum.photos"]');
    if (dummyImages.length === 0) return;

    // Fetch some nice gallery images from any project
    const query = `*[_type == "project" && defined(gallery)] { "urls": gallery[0...3].asset->url }`;
    const projects = await fetchSanityData(query);
    
    let allUrls = [];
    if (projects) {
      projects.forEach(p => { if (p.urls) allUrls = allUrls.concat(p.urls); });
    }

    if (allUrls.length > 0) {
      // Shuffle the URLs for variety
      allUrls = allUrls.sort(() => Math.random() - 0.5);
      
      let urlIndex = 0;
      dummyImages.forEach(img => {
        // Pick a URL, loop back to start if we run out
        const url = allUrls[urlIndex % allUrls.length];
        img.src = `${url}?w=800&h=600&fit=crop&auto=format`;
        urlIndex++;
      });
    }
  }, 100);
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    renderHomeProjects();
  }
  replaceDummyImages();
});
