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
  let currentView = 'grid'; // grid or list

  const filterBar = document.getElementById('filter-bar');
  const gridContainer = document.getElementById('projects-grid');
  const listContainer = document.getElementById('projects-list');
  const totalCountEl = document.getElementById('total-count');
  const viewBtns = document.querySelectorAll('.view-btn');

  // Fetch projects from Sanity
  let projects = [];
  try {
    projects = await fetchAllProjects();
  } catch (error) {
    console.error("Error fetching projects", error);
  }

  // Initialize
  initFilters();
  initViewToggles();
  updateTriggerText();
  renderProjects();

  function updateTriggerText() {
    const triggerBtn = document.querySelector('.filter-trigger');
    if (triggerBtn) {
      const activeFilterObj = filters.find(f => f.id === currentFilter);
      triggerBtn.textContent = currentFilter === 'all' ? 'FILTER BY CATEGORY ▼' : `${activeFilterObj.label.toUpperCase()} ▼`;
    }
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
        updateTriggerText();
        renderProjects();
      });
      
      filterBar.appendChild(btn);
    });
    
    if (totalCountEl) {
      totalCountEl.textContent = `(${projects.length})`;
    }
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
      : projects.filter(p => p.category === currentFilter);

    gridContainer.innerHTML = '';
    listContainer.innerHTML = '';

    filteredProjects.forEach((p, index) => {
      // Grid Card
      const gridCard = document.createElement('a');
      gridCard.href = `/projects/project-detail.html?slug=${p.slug.current}`;
      gridCard.addEventListener('click', () => localStorage.setItem('current_project_slug', p.slug.current));
      gridCard.className = 'project-card-grid';
      
      const imgSrc = p.imageUrl ? `${p.imageUrl}?w=600&h=800&fit=crop&auto=format` : 'https://picsum.photos/600/800';
      
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

      // List Row
      const listRow = document.createElement('a');
      listRow.href = `/projects/project-detail.html?slug=${p.slug.current}`;
      listRow.addEventListener('click', () => localStorage.setItem('current_project_slug', p.slug.current));
      listRow.className = 'project-list-row';
      
      const numStr = (index + 1).toString().padStart(2, '0');
      
      listRow.innerHTML = `
        <div class="project-number">${numStr}</div>
        <div class="project-name">${p.title}</div>
        <div class="project-category">${p.category.replace('-', ' ')}</div>
      `;
      listContainer.appendChild(listRow);
    });

    if (window.gsap && window.ScrollTrigger) {
      ScrollTrigger.refresh();
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
