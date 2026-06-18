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
    description,
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
    card.href = `/projects/project-detail.html?slug=${project.slug.current}`;
    card.addEventListener('click', () => localStorage.setItem('current_project_slug', project.slug.current));
    card.className = `project-card ${isLeft ? 'project-left' : 'project-right'}`;
    
    // Default to an empty string if no image is uploaded
    const imgSrc = project.imageUrl ? `${project.imageUrl}?w=1000&auto=format` : '';

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

async function fetchAndInitGallery() {
  const track = document.getElementById('gallery-track');
  if (!track) return;

  // Fetch all gallery images from all projects
  const query = `*[_type == "project"] { 
    "main": mainImage.asset->url,
    "gallery": gallery[].asset->url 
  }`;
  const projects = await fetchSanityData(query);
  
  let allUrls = [];
  if (projects) {
    projects.forEach(p => { 
      if (p.main) allUrls.push(p.main);
      if (p.gallery && Array.isArray(p.gallery)) allUrls = allUrls.concat(p.gallery); 
    });
  }

  // Shuffle the array to ensure images don't look repetitive
  for (let i = allUrls.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allUrls[i], allUrls[j]] = [allUrls[j], allUrls[i]];
  }

  const wrapper = track.closest('.gallery-track-wrapper') || track.parentElement;

  if (allUrls.length === 0) {
    // Hide the entire gallery section if there are no images at all
    if (wrapper) {
      wrapper.style.display = 'none';
      const sectionLabel = wrapper.previousElementSibling;
      if (sectionLabel) sectionLabel.style.display = 'none';
    }
    return;
  }

  // Ensure wrapper is visible
  if (wrapper) wrapper.style.display = '';

  // Call the global function in gallery.js
  if (window.initGalleryTrack) {
    window.initGalleryTrack(allUrls);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    renderHomeProjects();
  }
  fetchAndInitGallery();
});
