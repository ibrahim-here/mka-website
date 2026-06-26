document.addEventListener('DOMContentLoaded', async () => {
  // Wait for the sanity-client function to be available
  if (typeof fetchAllProjects === 'undefined') return;

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'residential', label: 'Residential' },
    { id: 'religious', label: 'Religious' },
    { id: 'hospitality', label: 'Hospitality' },
    { id: 'landscape', label: 'Landscape' },
    { id: 'transport', label: 'Transport' },
    { id: 'industrial', label: 'Industrial' },
    { id: 'health', label: 'Health' },
    { id: 'education', label: 'Education' },
    { id: 'master-planning', label: 'Master Planning' }
  ];

  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  
  let currentFilter = categoryParam && filters.find(f => f.id === categoryParam) ? categoryParam : 'all';
  
  let currentPage = 1;
  const itemsPerPage = 12;

  const filterBar = document.getElementById('filter-bar');
  const gridContainer = document.getElementById('projects-grid');
  const totalCountEl = document.getElementById('total-count');

  // Fetch projects from Sanity
  let projects = [];
  try {
    projects = await fetchAllProjects();
  } catch (error) {
    console.error("Error fetching projects", error);
  }

  // Initialize
  initFilters();
  
  if (projects.length === 0) {
    const gridContainer = document.getElementById('projects-grid');
    if (gridContainer) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2rem; background: #ffebee; color: #c62828; border-radius: 8px; text-align: center; border: 1px solid #ef9a9a;">
          <h3>⚠️ API Connection Failed</h3>
          <p style="margin-top: 1rem;">The browser blocked the connection to the Sanity database. This almost always happens when you open the HTML file directly (so the URL starts with <strong>file:///</strong>).</p>
          <p>Please open this project using a local web server (like VS Code's <strong>Live Server</strong> extension) so the URL starts with <strong>http://localhost</strong> or <strong>http://127.0.0.1</strong>.</p>
        </div>
      `;
    }
    return;
  }
  
  renderProjects();

  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      renderProjects(true);
    });
  }



  function initFilters() {
    filterBar.innerHTML = '';
    
    filters.forEach(filter => {
      // Calculate count
      const count = filter.id === 'all' 
        ? projects.length 
        : projects.filter(p => p.category === filter.id).length;
        
      const btn = document.createElement('button');
      btn.className = `filter-btn ${filter.id === currentFilter ? 'active' : ''}`;
      btn.dataset.filter = filter.id;
      btn.textContent = filter.id === 'all' ? filter.label : `${filter.label} (${count})`;
      
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentFilter = filter.id;
        currentPage = 1; // Reset to first page
        renderProjects();
      });
      
      filterBar.appendChild(btn);
    });
    
    if (totalCountEl) {
      totalCountEl.textContent = `(${projects.length})`;
    }
  }


  function renderProjects(append = false) {
    // Filter data
    const filteredProjects = currentFilter === 'all' 
      ? projects 
      : projects.filter(p => p.category === currentFilter);

    if (!append) {
      gridContainer.innerHTML = '';
    }

    const startIndex = append ? (currentPage - 1) * itemsPerPage : 0;
    const endIndex = currentPage * itemsPerPage;
    const projectsToRender = filteredProjects.slice(startIndex, endIndex);

    const loadMoreContainer = document.getElementById('load-more-container');
    if (loadMoreContainer) {
      if (endIndex >= filteredProjects.length) {
        loadMoreContainer.style.display = 'none';
      } else {
        loadMoreContainer.style.display = 'block';
      }
    }

    const newGridItems = [];
    const newListItems = [];

    projectsToRender.forEach((p, idx) => {
      // Grid Card
      const gridCard = document.createElement('a');
      gridCard.href = `/projects/project-detail.html?slug=${p.slug.current}`;
      gridCard.addEventListener('click', () => localStorage.setItem('current_project_slug', p.slug.current));
      gridCard.className = 'project-card-grid';
      
      const imgSrc = p.imageUrl ? `${p.imageUrl}?w=1000&auto=format` : 'https://picsum.photos/800/600';
      
      gridCard.innerHTML = `
        <div class="image-wrapper">
          <img src="${imgSrc}" alt="${p.title}" loading="lazy">
          <div class="image-overlay"></div>
        </div>
        <div class="info-block">
          <div class="title-row">
            <span class="title">${p.title}</span>
          </div>
          <div class="meta">${p.category.replace('-', ' ')}</div>
        </div>
      `;
      gridContainer.appendChild(gridCard);
      newGridItems.push(gridCard);
    });

    if (window.gsap && window.ScrollTrigger) {
      ScrollTrigger.refresh();
      gsap.fromTo(newGridItems, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }
      );
    }
  }
});
