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
  
  let currentPage = 1;
  const itemsPerPage = 12;

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

  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      renderProjects(true);
    });
  }

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
        currentPage = 1; // Reset to first page
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

  function renderProjects(append = false) {
    // Filter data
    const filteredProjects = currentFilter === 'all' 
      ? projects 
      : projects.filter(p => p.category === currentFilter);

    if (!append) {
      gridContainer.innerHTML = '';
      listContainer.innerHTML = '';
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

      // List Row
      const listRow = document.createElement('a');
      listRow.href = `/projects/project-detail.html?slug=${p.slug.current}`;
      listRow.addEventListener('click', () => localStorage.setItem('current_project_slug', p.slug.current));
      listRow.className = 'project-list-row';
      
      const actualIndex = startIndex + idx;
      const numStr = (actualIndex + 1).toString().padStart(2, '0');
      
      listRow.innerHTML = `
        <div class="project-number">${numStr}</div>
        <div class="project-name">${p.title}</div>
        <div class="project-category">${p.category.replace('-', ' ')}</div>
      `;
      listContainer.appendChild(listRow);
      newListItems.push(listRow);
    });

    if (window.gsap && window.ScrollTrigger) {
      ScrollTrigger.refresh();
      if (currentView === 'grid') {
        gsap.fromTo(newGridItems, 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }
        );
      } else {
        gsap.fromTo(newListItems, 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }
        );
      }
    }
  }
});
