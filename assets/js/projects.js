document.addEventListener('DOMContentLoaded', () => {
  if (typeof projects === 'undefined') return;

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
    { id: 'master-planning', label: 'Master Planning' },
    { id: 'competition', label: '★ Competition' }
  ];

  let currentFilter = 'all';
  let currentView = 'grid'; // grid or list

  const filterBar = document.getElementById('filter-bar');
  const gridContainer = document.getElementById('projects-grid');
  const listContainer = document.getElementById('projects-list');
  const totalCountEl = document.getElementById('total-count');
  const viewBtns = document.querySelectorAll('.view-btn');

  // Initialize
  initFilters();
  initViewToggles();
  renderProjects();

  function initFilters() {
    filterBar.innerHTML = '';
    
    filters.forEach(filter => {
      // Calculate count
      const count = filter.id === 'all' 
        ? projects.length 
        : projects.filter(p => p.categories.includes(filter.id)).length;
        
      const btn = document.createElement('button');
      btn.className = `filter-btn ${filter.id === currentFilter ? 'active' : ''}`;
      btn.dataset.filter = filter.id;
      btn.textContent = filter.id === 'all' ? filter.label : `${filter.label} (${count})`;
      
      btn.addEventListener('click', () => {
        // Update active class
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentFilter = filter.id;
        renderProjects();
      });
      
      filterBar.appendChild(btn);
    });
    
    totalCountEl.textContent = `(${projects.length})`;
  }

  function initViewToggles() {
    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentView = btn.dataset.view;
        
        if (currentView === 'grid') {
          gridContainer.classList.remove('hidden');
          listContainer.classList.remove('active');
        } else {
          gridContainer.classList.add('hidden');
          listContainer.classList.add('active');
        }
      });
    });
  }

  function renderProjects() {
    // Filter data
    const filteredProjects = currentFilter === 'all' 
      ? projects 
      : projects.filter(p => p.categories.includes(currentFilter));

    // Render Grid
    gridContainer.innerHTML = '';
    // Render List
    listContainer.innerHTML = '';

    filteredProjects.forEach((p, index) => {
      // Grid Card
      const gridCard = document.createElement('a');
      gridCard.href = `/projects/${p.slug}/index.html`;
      gridCard.className = 'project-card-grid';
      
      let badgeHtml = p.isCompetition ? `<span class="badge">★ Award</span>` : '';
      
      gridCard.innerHTML = `
        <div class="image-wrapper">
          <img src="${p.thumbnail}" alt="${p.name}" loading="lazy">
          <div class="image-overlay"></div>
        </div>
        <div class="info-block">
          <div class="title-row">
            <span class="title">${p.name}</span>
            ${badgeHtml}
          </div>
          <div class="meta">${p.category} &middot; ${p.location}</div>
        </div>
      `;
      gridContainer.appendChild(gridCard);

      // List Row
      const listRow = document.createElement('a');
      listRow.href = `/projects/${p.slug}/index.html`;
      listRow.className = 'project-list-row';
      
      const numStr = (index + 1).toString().padStart(2, '0');
      
      listRow.innerHTML = `
        <div class="project-number">${numStr}</div>
        <div class="project-name">${p.name} ${badgeHtml}</div>
        <div class="project-category">${p.category} &middot; ${p.location}</div>
        <div class="project-year">${p.year}</div>
      `;
      listContainer.appendChild(listRow);
    });

    // Animate new elements in
    if (window.gsap) {
      if (currentView === 'grid') {
        gsap.fromTo(gridContainer.children, 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }
        );
      } else {
        gsap.fromTo(listContainer.children, 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }
        );
      }
    }
  }
});
