/**
 * DOVETALE KNOWLEDGE OS & STUDY ATLAS - ENGINE (V2)
 * High-legibility reader, collapsible navigation, in-header table of contents,
 * interactive checklists with local persistence, universal search, and auto-save notes.
 */

(function () {
  'use strict';

  if (!window.STUDY_DATA) {
    console.error('STUDY_DATA is not loaded.');
    return;
  }

  const { meta, documents } = window.STUDY_DATA;

  // LocalStorage State Keys
  const STORAGE_KEY = 'dovetale_study_portal_state_v2';
  let appState = {
    mastered: {},      // { [docId]: boolean }
    checklist: {},     // { [chkId]: boolean }
    notes: {},         // { [docId]: string }
    currentDocId: 'overview',
    activeCategory: 'all',
    sidebarCollapsed: false
  };

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      appState = { ...appState, ...parsed };
    }
  } catch (e) {
    console.warn('Could not load study state from localStorage', e);
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        mastered: appState.mastered,
        checklist: appState.checklist,
        notes: appState.notes,
        sidebarCollapsed: appState.sidebarCollapsed
      }));
    } catch (e) {
      console.warn('Could not save study state to localStorage', e);
    }
    updateGlobalStats();
  }

  // DOM Elements
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const sidebarDocList = document.getElementById('sidebarDocList');
  const studyContainer = document.getElementById('studyContentContainer');
  const breadcrumbEl = document.getElementById('headerBreadcrumb');
  const actionBtnsEl = document.getElementById('headerActions');
  const searchInput = document.getElementById('sidebarSearchInput');
  const searchModal = document.getElementById('searchModalBackdrop');
  const modalSearchInput = document.getElementById('modalSearchInput');
  const modalSearchResults = document.getElementById('modalSearchResults');
  const progressFill = document.getElementById('sidebarProgressFill');
  const progressPercentText = document.getElementById('sidebarProgressText');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarToggleText = document.getElementById('sidebarToggleText');

  // Apply initial sidebar collapsed state on desktop
  if (appState.sidebarCollapsed && window.innerWidth > 992) {
    document.body.classList.add('sidebar-collapsed');
    if (sidebarToggleText) sidebarToggleText.textContent = 'Show Modules';
  }

  // =========================================================================
  // GLOBAL STATISTICS & PROGRESS
  // =========================================================================
  function updateGlobalStats() {
    const totalDocs = documents.length;
    const masteredCount = Object.values(appState.mastered).filter(Boolean).length;
    const totalChecklists = meta.totalChecklists;
    const checkedCount = Object.values(appState.checklist).filter(Boolean).length;

    const chkRatio = totalChecklists > 0 ? (checkedCount / totalChecklists) : 0;
    const docRatio = totalDocs > 0 ? (masteredCount / totalDocs) : 0;
    const overallPct = Math.round((chkRatio * 0.6 + docRatio * 0.4) * 100);

    if (progressFill) progressFill.style.width = overallPct + '%';
    if (progressPercentText) progressPercentText.textContent = overallPct + '% Mastered';

    document.querySelectorAll('.doc-item-link').forEach(link => {
      const docId = link.getAttribute('data-doc-id');
      if (appState.mastered[docId]) {
        link.classList.add('mastered');
      } else {
        link.classList.remove('mastered');
      }
    });
  }

  // =========================================================================
  // SIDEBAR RENDERING
  // =========================================================================
  function renderSidebar() {
    const cat = appState.activeCategory;
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    let filtered = documents;
    if (cat !== 'all') {
      filtered = filtered.filter(d => d.category === cat);
    }
    if (query) {
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(query) || 
        d.tag.toLowerCase().includes(query) ||
        d.summary.toLowerCase().includes(query)
      );
    }

    const groups = {};
    filtered.forEach(d => {
      if (!groups[d.categoryName]) groups[d.categoryName] = [];
      groups[d.categoryName].push(d);
    });

    let html = `
      <a href="#overview" class="doc-item-link ${appState.currentDocId === 'overview' ? 'active' : ''}" data-doc-id="overview">
        <span class="doc-item-badge">HUB</span>
        <div class="doc-item-info">
          <span class="doc-item-title">Executive Atlas &amp; Dashboard</span>
          <div class="doc-item-meta">
            <span>22 Modules</span> &bull; <span>System Map</span>
          </div>
        </div>
      </a>
    `;

    for (const [groupName, groupDocs] of Object.entries(groups)) {
      html += `<div class="doc-group-title"><span>${groupName}</span> <span>${groupDocs.length}</span></div>`;
      groupDocs.forEach(d => {
        const isMastered = !!appState.mastered[d.id];
        const isActive = appState.currentDocId === d.id;
        html += `
          <a href="#${d.id}" class="doc-item-link ${isActive ? 'active' : ''} ${isMastered ? 'mastered' : ''}" data-doc-id="${d.id}">
            <span class="doc-item-badge">${d.tag}</span>
            <div class="doc-item-info">
              <span class="doc-item-title">${d.title}</span>
              <div class="doc-item-meta">
                <span>${d.readTime}</span>
                ${d.checklistCount ? `<span style="color:var(--accent-emerald);">&bull; ${d.checklistCount} tasks</span>` : ''}
              </div>
            </div>
          </a>
        `;
      });
    }

    if (filtered.length === 0) {
      html += `<div style="padding: 24px 12px; text-align: center; color: var(--text-soft); font-size: 13px;">No matching modules found.</div>`;
    }

    sidebarDocList.innerHTML = html;

    sidebarDocList.querySelectorAll('.doc-item-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const docId = link.getAttribute('data-doc-id');
        loadDocument(docId);
        closeMobileSidebar();
      });
    });
  }

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
  }

  // =========================================================================
  // VIEW 1: EXECUTIVE ATLAS & DASHBOARD
  // =========================================================================
  function renderOverview() {
    appState.currentDocId = 'overview';
    window.location.hash = 'overview';

    breadcrumbEl.innerHTML = `
      <span>Atlas</span>
      <span class="sep">/</span>
      <strong>Executive Study Hub</strong>
    `;

    actionBtnsEl.innerHTML = `
      <button class="header-btn" id="btnResetProgress" title="Reset Study Progress">
        <span>↺</span> <span>Reset Progress</span>
      </button>
      <button class="header-btn primary" id="btnQuickSearch">
        <span>🔍 Search (Ctrl+K)</span>
      </button>
    `;

    document.getElementById('btnQuickSearch')?.addEventListener('click', openSearchModal);
    document.getElementById('btnResetProgress')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all checklist and study progress?')) {
        appState.mastered = {};
        appState.checklist = {};
        saveState();
        renderOverview();
        renderSidebar();
      }
    });

    const totalMastered = Object.values(appState.mastered).filter(Boolean).length;
    const totalChecklists = meta.totalChecklists;
    const checkedCount = Object.values(appState.checklist).filter(Boolean).length;
    const checkPct = totalChecklists > 0 ? Math.round((checkedCount / totalChecklists) * 100) : 0;

    let html = `
      <div class="overview-hero">
        <div class="overview-tag">DOVETALE KNOWLEDGE OS // PERSONAL STUDY SUITE</div>
        <h2>Business &amp; Marketing Infrastructure Atlas</h2>
        <p>Comprehensive interactive study portal compiling all 22 internal operational frameworks, technical specifications, and website blueprints. Designed for rapid information synthesis, structured study, and checklist execution.</p>
      </div>

      <!-- Executive KPI Cards -->
      <div class="metric-cards-grid">
        <div class="kpi-card">
          <div class="kpi-num">${meta.totalDocs}</div>
          <div class="kpi-label">Master Modules</div>
          <div class="kpi-desc">10 Pillars, 3 Business Frameworks &amp; 9 Website Architecture Guides</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-num">${checkedCount} / ${totalChecklists}</div>
          <div class="kpi-label">Implementation Checklists</div>
          <div class="kpi-desc">${checkPct}% tasks verified across technical implementation blueprints</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-num">${totalMastered} / 22</div>
          <div class="kpi-label">Modules Mastered</div>
          <div class="kpi-desc">Mark modules as reviewed to track mastery throughout the curriculum</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-num">47.3k</div>
          <div class="kpi-label">Words of Architecture</div>
          <div class="kpi-desc">Zero loss documentation with full fidelity code schemas and checklists</div>
        </div>
      </div>

      <!-- Interactive System Architecture Pipeline Map -->
      <div class="atlas-section-title">
        <span>⚡</span> The 10 Infrastructure Pillars — End-to-End Pipeline
      </div>
      <div class="atlas-section-desc">
        Click any pillar node to dive into its complete implementation blueprint, schema configurations, and deliverables.
      </div>

      <div class="architecture-diagram-container">
        <div class="pipeline-tiers-grid">
          
          <!-- TIER I -->
          <div class="tier-column">
            <div class="tier-header">
              <span class="tier-badge">Tier I &bull; 2 Modules</span>
              <h4>Foundation &amp; Ingestion</h4>
            </div>
            <div class="tier-nodes-list">
              <a href="#pillar-01" class="pillar-node-btn" data-doc-id="pillar-01">
                <div class="pillar-node-top">
                  <span class="pillar-node-id">01</span>
                  <span class="pillar-node-status">${appState.mastered['pillar-01'] ? '✓ Mastered' : 'Pending'}</span>
                </div>
                <div class="pillar-node-name">Product, Service &amp; Market Intelligence</div>
              </a>

              <a href="#pillar-02" class="pillar-node-btn" data-doc-id="pillar-02">
                <div class="pillar-node-top">
                  <span class="pillar-node-id">02</span>
                  <span class="pillar-node-status">${appState.mastered['pillar-02'] ? '✓ Mastered' : 'Pending'}</span>
                </div>
                <div class="pillar-node-name">Audience Intelligence &amp; Segmentation</div>
              </a>
            </div>
          </div>

          <!-- TIER II -->
          <div class="tier-column">
            <div class="tier-header">
              <span class="tier-badge">Tier II &bull; 3 Modules</span>
              <h4>Telemetry &amp; Content</h4>
            </div>
            <div class="tier-nodes-list">
              <a href="#pillar-03" class="pillar-node-btn" data-doc-id="pillar-03">
                <div class="pillar-node-top">
                  <span class="pillar-node-id">03</span>
                  <span class="pillar-node-status">${appState.mastered['pillar-03'] ? '✓ Mastered' : 'Pending'}</span>
                </div>
                <div class="pillar-node-name">Brand Content &amp; Creative Operations</div>
              </a>

              <a href="#pillar-04" class="pillar-node-btn" data-doc-id="pillar-04">
                <div class="pillar-node-top">
                  <span class="pillar-node-id">04</span>
                  <span class="pillar-node-status">${appState.mastered['pillar-04'] ? '✓ Mastered' : 'Pending'}</span>
                </div>
                <div class="pillar-node-name">Digital Presence &amp; Website Infrastructure</div>
              </a>

              <a href="#pillar-05" class="pillar-node-btn" data-doc-id="pillar-05">
                <div class="pillar-node-top">
                  <span class="pillar-node-id">05</span>
                  <span class="pillar-node-status">${appState.mastered['pillar-05'] ? '✓ Mastered' : 'Pending'}</span>
                </div>
                <div class="pillar-node-name">Conversion Rate &amp; Landing Page Infrastructure</div>
              </a>
            </div>
          </div>

          <!-- TIER III -->
          <div class="tier-column">
            <div class="tier-header">
              <span class="tier-badge">Tier III &bull; 3 Modules</span>
              <h4>Algorithmic Attribution &amp; Performance</h4>
            </div>
            <div class="tier-nodes-list">
              <a href="#pillar-06" class="pillar-node-btn" data-doc-id="pillar-06">
                <div class="pillar-node-top">
                  <span class="pillar-node-id">06</span>
                  <span class="pillar-node-status">${appState.mastered['pillar-06'] ? '✓ Mastered' : 'Pending'}</span>
                </div>
                <div class="pillar-node-name">Customer Acquisition &amp; Performance Marketing</div>
              </a>

              <a href="#pillar-07" class="pillar-node-btn" data-doc-id="pillar-07">
                <div class="pillar-node-top">
                  <span class="pillar-node-id">07</span>
                  <span class="pillar-node-status">${appState.mastered['pillar-07'] ? '✓ Mastered' : 'Pending'}</span>
                </div>
                <div class="pillar-node-name">Lead Management &amp; Sales Enablement</div>
              </a>

              <a href="#pillar-08" class="pillar-node-btn" data-doc-id="pillar-08">
                <div class="pillar-node-top">
                  <span class="pillar-node-id">08</span>
                  <span class="pillar-node-status">${appState.mastered['pillar-08'] ? '✓ Mastered' : 'Pending'}</span>
                </div>
                <div class="pillar-node-name">Email Marketing &amp; Retention Lifecycle</div>
              </a>
            </div>
          </div>

          <!-- TIER IV -->
          <div class="tier-column">
            <div class="tier-header">
              <span class="tier-badge">Tier IV &bull; 2 Modules</span>
              <h4>Governance &amp; Sentinel</h4>
            </div>
            <div class="tier-nodes-list">
              <a href="#pillar-09" class="pillar-node-btn" data-doc-id="pillar-09">
                <div class="pillar-node-top">
                  <span class="pillar-node-id">09</span>
                  <span class="pillar-node-status">${appState.mastered['pillar-09'] ? '✓ Mastered' : 'Pending'}</span>
                </div>
                <div class="pillar-node-name">Analytics, Tracking &amp; Attribution Infrastructure</div>
              </a>

              <a href="#pillar-10" class="pillar-node-btn" data-doc-id="pillar-10">
                <div class="pillar-node-top">
                  <span class="pillar-node-id">10</span>
                  <span class="pillar-node-status">${appState.mastered['pillar-10'] ? '✓ Mastered' : 'Pending'}</span>
                </div>
                <div class="pillar-node-name">Marketing Automation &amp; AI Integration</div>
              </a>
            </div>
          </div>

        </div>
      </div>

      <!-- Categories Quick Navigation Hub -->
      <div class="atlas-section-title">
        <span>📚</span> Curriculum Knowledge Hubs
      </div>
      <div class="atlas-section-desc">
        Direct access to business frameworks, commercial catalogs, and website design blueprints.
      </div>

      <div class="category-hub-grid">
        <div class="category-card">
          <div class="cat-card-header">
            <span class="cat-card-icon">🏛️</span>
            <div>
              <h3>Business Strategy &amp; Client Frameworks</h3>
              <span style="font-size: 11px; color: var(--text-soft); font-family: var(--font-mono);">3 Comprehensive Guides</span>
            </div>
          </div>
          <p class="cat-card-desc">Brand positioning, operational SLAs, internal vs client-facing delivery separation, and the 3 Core Service Packages.</p>
          <div class="cat-doc-links">
            <a href="#biz-brand-strategy" class="cat-link-row" data-doc-id="biz-brand-strategy">
              <span>Brand Strategy &amp; Positioning</span>
              <span>→</span>
            </a>
            <a href="#biz-client-engagement" class="cat-link-row" data-doc-id="biz-client-engagement">
              <span>Client Engagement &amp; Delivery Framework</span>
              <span>→</span>
            </a>
            <a href="#biz-service-catalog" class="cat-link-row" data-doc-id="biz-service-catalog">
              <span>Client-Facing Service Catalog (3 Packages)</span>
              <span>→</span>
            </a>
          </div>
        </div>

        <div class="category-card">
          <div class="cat-card-header">
            <span class="cat-card-icon">🌐</span>
            <div>
              <h3>Website Architecture &amp; Design System</h3>
              <span style="font-size: 11px; color: var(--text-soft); font-family: var(--font-mono);">2 Master Systems Guides</span>
            </div>
          </div>
          <p class="cat-card-desc">Sitemap hierarchy, conversion paths, design philosophy synthesizing Leroux and Optivo, typography, and token architecture.</p>
          <div class="cat-doc-links">
            <a href="#web-architecture" class="cat-link-row" data-doc-id="web-architecture">
              <span>Website Architecture &amp; UX Strategy</span>
              <span>→</span>
            </a>
            <a href="#web-style-guide" class="cat-link-row" data-doc-id="web-style-guide">
              <span>Visual Design &amp; Style Guide (Tokens &amp; Cadence)</span>
              <span>→</span>
            </a>
          </div>
        </div>

        <div class="category-card" style="grid-column: span 2;">
          <div class="cat-card-header">
            <span class="cat-card-icon">📄</span>
            <div>
              <h3>7 Complete Page Production Blueprints</h3>
              <span style="font-size: 11px; color: var(--text-soft); font-family: var(--font-mono);">Full Page Layouts &amp; Technical Copy</span>
            </div>
          </div>
          <p class="cat-card-desc">Production copy, ASCII wireframes, responsive specifications, and conversion goals for all 7 website pages.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 8px;">
            <a href="#page-home" class="cat-link-row" data-doc-id="page-home"><span>Page 01: Home</span> <span>→</span></a>
            <a href="#page-about" class="cat-link-row" data-doc-id="page-about"><span>Page 02: About Us</span> <span>→</span></a>
            <a href="#page-services" class="cat-link-row" data-doc-id="page-services"><span>Page 03: Services (10 Pillars)</span> <span>→</span></a>
            <a href="#page-how-we-work" class="cat-link-row" data-doc-id="page-how-we-work"><span>Page 04: How We Work</span> <span>→</span></a>
            <a href="#page-who-we-serve" class="cat-link-row" data-doc-id="page-who-we-serve"><span>Page 05: Who We Serve</span> <span>→</span></a>
            <a href="#page-insights" class="cat-link-row" data-doc-id="page-insights"><span>Page 06: Insights</span> <span>→</span></a>
            <a href="#page-contact" class="cat-link-row" data-doc-id="page-contact"><span>Page 07: Contact &amp; Audit</span> <span>→</span></a>
          </div>
        </div>
      </div>
    `;

    studyContainer.innerHTML = html;

    studyContainer.querySelectorAll('[data-doc-id]').forEach(elem => {
      elem.addEventListener('click', (e) => {
        e.preventDefault();
        const id = elem.getAttribute('data-doc-id');
        loadDocument(id);
      });
    });

    renderSidebar();
    updateGlobalStats();
  }

  // =========================================================================
  // VIEW 2: DOCUMENT STUDY READER
  // =========================================================================
  function loadDocument(docId) {
    if (docId === 'overview') {
      renderOverview();
      return;
    }

    const doc = documents.find(d => d.id === docId);
    if (!doc) {
      renderOverview();
      return;
    }

    appState.currentDocId = doc.id;
    window.location.hash = doc.id;

    const scroller = document.querySelector('.study-scrollable');
    if (scroller) scroller.scrollTop = 0;

    breadcrumbEl.innerHTML = `
      <a href="#overview" id="breadcrumbHome" style="color: var(--text-muted); text-decoration: none;">Atlas</a>
      <span class="sep">/</span>
      <span>${doc.categoryName}</span>
      <span class="sep">/</span>
      <strong>${doc.tag}</strong>
    `;
    document.getElementById('breadcrumbHome')?.addEventListener('click', (e) => {
      e.preventDefault();
      renderOverview();
    });

    const isMastered = !!appState.mastered[doc.id];

    // In-Header Table of Contents Dropdown Popover
    let tocDropdownHtml = '';
    if (doc.toc && doc.toc.length > 0) {
      tocDropdownHtml = `
        <div class="toc-dropdown-wrap">
          <button class="header-btn" id="btnTocDropdown">
            <span>📑 Sections ▾</span>
          </button>
          <div class="toc-popover" id="tocPopover">
            <div class="toc-popover-title">JUMP TO SECTION</div>
            <ul class="toc-popover-list">
              ${doc.toc.map(item => `
                <li>
                  <a href="#${item.anchor}" class="toc-popover-link level-${item.level}" data-anchor="${item.anchor}">
                    ${item.text}
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      `;
    }

    actionBtnsEl.innerHTML = `
      ${tocDropdownHtml}
      <button class="header-btn ${isMastered ? 'active' : ''}" id="btnToggleMastered">
        <span>${isMastered ? '✓ Mastered' : '○ Mark as Mastered'}</span>
      </button>
      <button class="header-btn primary" id="btnReaderSearch">
        <span>🔍 Search</span>
      </button>
    `;

    // Dropdown popover logic
    const tocBtn = document.getElementById('btnTocDropdown');
    const tocPopover = document.getElementById('tocPopover');
    if (tocBtn && tocPopover) {
      tocBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        tocPopover.classList.toggle('open');
      });

      document.addEventListener('click', (e) => {
        if (!tocPopover.contains(e.target) && e.target !== tocBtn) {
          tocPopover.classList.remove('open');
        }
      });

      tocPopover.querySelectorAll('.toc-popover-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('data-anchor');
          const targetEl = document.getElementById(targetId);
          tocPopover.classList.remove('open');
          if (targetEl && scroller) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }

    document.getElementById('btnReaderSearch')?.addEventListener('click', openSearchModal);

    document.getElementById('btnToggleMastered')?.addEventListener('click', () => {
      appState.mastered[doc.id] = !appState.mastered[doc.id];
      saveState();
      loadDocument(doc.id);
    });

    const parsedHTML = parseMarkdownToHTML(doc.rawContent, doc.id);
    const savedNotes = appState.notes[doc.id] || '';

    let html = `
      <div class="doc-reader-header">
        <div class="doc-meta-row">
          <span class="doc-tier-pill">${doc.tier}</span>
          <span class="doc-category-badge">${doc.categoryIcon} ${doc.categoryName}</span>
          <span class="doc-stat-pill">&bull; ${doc.words} words</span>
          <span class="doc-stat-pill">&bull; ${doc.readTime}</span>
        </div>
        <h1 class="doc-reader-title">${doc.title}</h1>
        <p class="doc-reader-summary">${doc.summary || ''}</p>
      </div>

      <!-- Executive Key Takeaways Card -->
      <div class="takeaways-card">
        <div class="takeaways-header">
          <span class="takeaways-badge">EXECUTIVE MODULE SPECIFICATION</span>
          <span class="takeaways-progress" id="docChecklistProgress">0% Completed</span>
        </div>
        <div class="takeaways-grid">
          <div class="takeaway-item">
            <div class="takeaway-label">Classification</div>
            <div class="takeaway-value">${doc.tier}</div>
          </div>
          <div class="takeaway-item">
            <div class="takeaway-label">Checklist Tasks</div>
            <div class="takeaway-value">${doc.checklistCount} Implementation Items</div>
          </div>
          <div class="takeaway-item">
            <div class="takeaway-label">Mastery Status</div>
            <div class="takeaway-value">${isMastered ? '<span style="color:var(--accent-emerald); font-weight:600;">✓ Fully Mastered</span>' : 'Pending Study'}</div>
          </div>
        </div>
      </div>

      <!-- High-Legibility Document Content -->
      <div class="markdown-body">
        ${parsedHTML}
      </div>

      <!-- Personal Study Notes Box -->
      <div class="study-notes-section">
        <div class="study-notes-header">
          <h4><span>📝</span> Personal Study Notes for this Module</h4>
          <span class="notes-save-status" id="notesSaveStatus">Saved</span>
        </div>
        <textarea class="study-notes-textarea" id="moduleStudyNotes" placeholder="Write personal insights, formulas, or implementation notes here. Auto-saved in your browser.">${savedNotes}</textarea>
      </div>

      <!-- Bottom Document Pager -->
      ${renderDocPager(doc)}
    `;

    studyContainer.innerHTML = html;

    setupChecklistListeners(doc.id);

    const notesTextarea = document.getElementById('moduleStudyNotes');
    const notesStatus = document.getElementById('notesSaveStatus');
    if (notesTextarea) {
      let timeout = null;
      notesTextarea.addEventListener('input', () => {
        notesStatus.textContent = 'Saving...';
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          appState.notes[doc.id] = notesTextarea.value;
          saveState();
          notesStatus.textContent = 'Saved';
        }, 500);
      });
    }

    setupCopyButtons();

    renderSidebar();
    updateGlobalStats();
    updateDocChecklistStats(doc.id);
  }

  // =========================================================================
  // DOCUMENT PAGER (Previous / Next)
  // =========================================================================
  function renderDocPager(currDoc) {
    const idx = documents.findIndex(d => d.id === currDoc.id);
    const prev = idx > 0 ? documents[idx - 1] : null;
    const next = idx < documents.length - 1 ? documents[idx + 1] : null;

    return `
      <div style="display: flex; justify-content: space-between; gap: 16px; margin-top: 60px; padding-top: 36px; border-top: 1px solid var(--border-subtle); flex-wrap: wrap;">
        ${prev ? `
          <a href="#${prev.id}" class="header-btn" style="flex: 1; min-width: 200px; justify-content: flex-start; padding: 14px 18px;" onclick="window.loadDocById('${prev.id}'); return false;">
            <div style="text-align: left;">
              <span style="font-size: 11px; text-transform: uppercase; color: var(--text-soft); display: block;">← Previous</span>
              <strong style="color: var(--text-heading); font-size: 14px;">${prev.title}</strong>
            </div>
          </a>
        ` : '<div></div>'}

        ${next ? `
          <a href="#${next.id}" class="header-btn" style="flex: 1; min-width: 200px; justify-content: flex-end; padding: 14px 18px;" onclick="window.loadDocById('${next.id}'); return false;">
            <div style="text-align: right;">
              <span style="font-size: 11px; text-transform: uppercase; color: var(--text-soft); display: block;">Next →</span>
              <strong style="color: var(--text-heading); font-size: 14px;">${next.title}</strong>
            </div>
          </a>
        ` : '<div></div>'}
      </div>
    `;
  }

  window.loadDocById = loadDocument;

  // =========================================================================
  // MARKDOWN TO HTML ENGINE
  // =========================================================================
  function parseMarkdownToHTML(md, docId) {
    if (!md) return '';

    const lines = md.split('\n');
    let out = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer = [];
    let inTable = false;
    let tableBuffer = [];
    let inList = false;
    let listBuffer = [];
    let inAscii = false;
    let asciiBuffer = [];

    let chkCounter = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          if (inList) { out.push(flushList(listBuffer)); inList = false; listBuffer = []; }
          if (inTable) { out.push(flushTable(tableBuffer)); inTable = false; tableBuffer = []; }

          const nextFew = lines.slice(i + 1, i + 6).join('\n');
          const isAsciiBox = /[┌┐└┘├┤─│═║╔╗╚╝]/.test(nextFew);

          if (isAsciiBox) {
            inAscii = true;
            asciiBuffer = [];
          } else {
            inCodeBlock = true;
            codeLanguage = line.trim().replace(/^```/, '') || 'plaintext';
            codeBuffer = [];
          }
        } else {
          inCodeBlock = false;
          out.push(renderCodeBlock(codeBuffer.join('\n'), codeLanguage));
          codeBuffer = [];
        }
        continue;
      }

      if (inAscii) {
        if (line.trim().startsWith('```')) {
          inAscii = false;
          out.push(renderAsciiDiagram(asciiBuffer.join('\n')));
          asciiBuffer = [];
        } else {
          asciiBuffer.push(line);
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Checklists: - [ ] or - [x]
      const chkMatch = line.match(/^\s*-\s*\[([ xX])\]\s*(.*)$/);
      if (chkMatch) {
        if (inList) { out.push(flushList(listBuffer)); inList = false; listBuffer = []; }
        if (inTable) { out.push(flushTable(tableBuffer)); inTable = false; tableBuffer = []; }

        chkCounter++;
        const chkId = `${docId}-chk-${chkCounter}`;
        const isChecked = appState.checklist[chkId] !== undefined ? appState.checklist[chkId] : (chkMatch[1].toLowerCase() === 'x');
        const text = formatInlineMarkdown(chkMatch[2]);

        out.push(`
          <label class="checklist-item ${isChecked ? 'checked' : ''}" data-chk-id="${chkId}">
            <input type="checkbox" data-chk-id="${chkId}" ${isChecked ? 'checked' : ''}>
            <span class="checklist-text">${text}</span>
          </label>
        `);
        continue;
      }

      // Table row
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        if (inList) { out.push(flushList(listBuffer)); inList = false; listBuffer = []; }
        inTable = true;
        tableBuffer.push(line.trim());
        continue;
      } else if (inTable) {
        inTable = false;
        out.push(flushTable(tableBuffer));
        tableBuffer = [];
      }

      // Unordered lists
      if (/^\s*[-*]\s+/.test(line)) {
        if (inTable) { out.push(flushTable(tableBuffer)); inTable = false; tableBuffer = []; }
        inList = true;
        listBuffer.push(line.replace(/^\s*[-*]\s+/, ''));
        continue;
      } else if (inList) {
        inList = false;
        out.push(flushList(listBuffer));
        listBuffer = [];
      }

      // Headings
      const hMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (hMatch) {
        const level = hMatch[1].length;
        let text = hMatch[2].trim();
        const cleanText = text.replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/\*\*/g, '');
        const anchor = 'sec-' + i + '-' + cleanText.toLowerCase().replace(/[^\w]+/g, '-');
        const inlineFormatted = formatInlineMarkdown(text);
        out.push(`<h${level} id="${anchor}">${inlineFormatted}</h${level}>`);
        continue;
      }

      // Blockquotes
      if (line.startsWith('>')) {
        out.push(`<blockquote>${formatInlineMarkdown(line.replace(/^>\s*/, ''))}</blockquote>`);
        continue;
      }

      // Horizontal rules
      if (/^(\*\*\*|---|___)$/.test(line.trim())) {
        out.push(`<hr>`);
        continue;
      }

      // Paragraphs
      if (line.trim().length > 0) {
        out.push(`<p>${formatInlineMarkdown(line)}</p>`);
      }
    }

    if (inList) out.push(flushList(listBuffer));
    if (inTable) out.push(flushTable(tableBuffer));
    if (inCodeBlock) out.push(renderCodeBlock(codeBuffer.join('\n'), codeLanguage));
    if (inAscii) out.push(renderAsciiDiagram(asciiBuffer.join('\n')));

    return out.join('\n');
  }

  function formatInlineMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08); padding:2px 6px; border-radius:4px; font-family:var(--font-mono); font-size:13px; color:#deb57b;">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:var(--accent-gold); text-decoration:underline; text-underline-offset:3px;" target="_blank">$1</a>');
  }

  function flushList(items) {
    if (!items || items.length === 0) return '';
    const lis = items.map(it => `<li>${formatInlineMarkdown(it)}</li>`).join('');
    return `<ul>${lis}</ul>`;
  }

  function flushTable(rows) {
    if (!rows || rows.length < 2) return '';
    let html = '<div class="table-scroll-wrapper"><table>';
    let isHeader = true;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (/^\|[\s\-:|]+\|$/.test(row)) {
        isHeader = false;
        continue;
      }
      const cols = row.split('|').slice(1, -1).map(c => c.trim());
      if (isHeader) {
        html += '<thead><tr>';
        cols.forEach(c => html += `<th>${formatInlineMarkdown(c)}</th>`);
        html += '</tr></thead><tbody>';
      } else {
        html += '<tr>';
        cols.forEach(c => html += `<td>${formatInlineMarkdown(c)}</td>`);
        html += '</tr>';
      }
    }
    html += '</tbody></table></div>';
    return html;
  }

  function renderAsciiDiagram(content) {
    const safeContent = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `
      <div class="ascii-diagram-card">
        <div class="ascii-header">
          <span class="ascii-title">ARCHITECTURE BLUEPRINT</span>
          <button class="copy-ascii-btn" data-clipboard-text="${encodeURIComponent(content)}">Copy Diagram</button>
        </div>
        <div class="ascii-body">${safeContent}</div>
      </div>
    `;
  }

  function renderCodeBlock(code, lang) {
    const safeCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `
      <div class="code-block-wrap">
        <div class="code-block-header">
          <span>SPECIFICATION // ${lang.toUpperCase()}</span>
          <button class="copy-ascii-btn" data-clipboard-text="${encodeURIComponent(code)}">Copy Code</button>
        </div>
        <div class="code-block-body"><code>${safeCode}</code></div>
      </div>
    `;
  }

  // =========================================================================
  // CHECKLIST PERSISTENCE & STATS
  // =========================================================================
  function setupChecklistListeners(docId) {
    document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', () => {
        const chkId = input.getAttribute('data-chk-id');
        const parent = input.closest('.checklist-item');
        if (input.checked) {
          appState.checklist[chkId] = true;
          if (parent) parent.classList.add('checked');
        } else {
          appState.checklist[chkId] = false;
          if (parent) parent.classList.remove('checked');
        }
        saveState();
        updateDocChecklistStats(docId);
      });
    });
  }

  function updateDocChecklistStats(docId) {
    const inputs = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const total = inputs.length;
    if (total === 0) return;

    let checked = 0;
    inputs.forEach(inp => { if (inp.checked) checked++; });
    const pct = Math.round((checked / total) * 100);

    const progressEl = document.getElementById('docChecklistProgress');
    if (progressEl) {
      progressEl.textContent = `${checked} / ${total} Tasks Verified (${pct}%)`;
    }
  }

  // =========================================================================
  // COPY CLIPBOARD
  // =========================================================================
  function setupCopyButtons() {
    document.querySelectorAll('.copy-ascii-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const raw = decodeURIComponent(btn.getAttribute('data-clipboard-text') || '');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(raw).then(() => {
            const old = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = old, 1500);
          });
        }
      });
    });
  }

  // =========================================================================
  // UNIVERSAL SEARCH MODAL
  // =========================================================================
  function openSearchModal() {
    if (searchModal) {
      searchModal.classList.add('open');
      modalSearchInput.value = '';
      modalSearchResults.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-soft);">Type keywords to search across all 22 documents and 47,000+ words...</div>';
      modalSearchInput.focus();
    }
  }

  function closeSearchModal() {
    if (searchModal) searchModal.classList.remove('open');
  }

  function handleSearchQuery(query) {
    if (!query || query.trim().length < 2) {
      modalSearchResults.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-soft);">Type at least 2 characters...</div>';
      return;
    }

    const q = query.toLowerCase().trim();
    const results = [];

    documents.forEach(doc => {
      let score = 0;
      let matches = [];

      if (doc.title.toLowerCase().includes(q)) score += 10;
      if (doc.tag.toLowerCase().includes(q)) score += 5;
      if (doc.tier.toLowerCase().includes(q)) score += 3;

      const lowerContent = doc.rawContent.toLowerCase();
      let pos = lowerContent.indexOf(q);
      let count = 0;

      while (pos !== -1 && count < 3) {
        score += 2;
        count++;
        const start = Math.max(0, pos - 40);
        const end = Math.min(doc.rawContent.length, pos + q.length + 60);
        const snippet = doc.rawContent.substring(start, end)
          .replace(/[\n\r]+/g, ' ')
          .replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>');
        matches.push('...' + snippet + '...');
        pos = lowerContent.indexOf(q, pos + q.length + 20);
      }

      if (score > 0) {
        results.push({ doc, score, matches });
      }
    });

    results.sort((a, b) => b.score - a.score);

    if (results.length === 0) {
      modalSearchResults.innerHTML = `<div style="padding:24px; text-align:center; color:var(--text-soft);">No matches found for "${query}".</div>`;
      return;
    }

    let html = '';
    results.slice(0, 15).forEach(res => {
      html += `
        <a href="#${res.doc.id}" class="search-result-item" data-doc-id="${res.doc.id}">
          <div class="search-result-title">${res.doc.title} <span style="font-size:11px; color:var(--accent-gold); font-family:var(--font-mono); font-weight:normal;">[${res.doc.tag}]</span></div>
          ${res.matches.length > 0 ? `<div class="search-result-snippet">${res.matches[0]}</div>` : ''}
        </a>
      `;
    });

    modalSearchResults.innerHTML = html;

    modalSearchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const id = item.getAttribute('data-doc-id');
        closeSearchModal();
        loadDocument(id);
      });
    });
  }

  // =========================================================================
  // INITIALIZATION & EVENT LISTENERS
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Collapsible Toggle (Desktop & Mobile)
    sidebarToggleBtn?.addEventListener('click', () => {
      if (window.innerWidth > 992) {
        const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
        appState.sidebarCollapsed = isCollapsed;
        saveState();
        if (sidebarToggleText) {
          sidebarToggleText.textContent = isCollapsed ? 'Show Modules' : 'Hide Sidebar';
        }
      } else {
        sidebar?.classList.toggle('open');
        sidebarBackdrop?.classList.toggle('active');
      }
    });

    document.getElementById('sidebarCloseBtn')?.addEventListener('click', closeMobileSidebar);
    sidebarBackdrop?.addEventListener('click', closeMobileSidebar);

    // Category Filter Buttons
    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        appState.activeCategory = pill.getAttribute('data-cat');
        renderSidebar();
      });
    });

    // Sidebar Search input
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderSidebar();
      });
    }

    // Modal Search Hotkey: Ctrl+K / Cmd+K
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearchModal();
      } else if (e.key === 'Escape' && searchModal && searchModal.classList.contains('open')) {
        closeSearchModal();
      }
    });

    if (modalSearchInput) {
      modalSearchInput.addEventListener('input', (e) => {
        handleSearchQuery(e.target.value);
      });
    }

    document.getElementById('modalCloseBtn')?.addEventListener('click', closeSearchModal);
    if (searchModal) {
      searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) closeSearchModal();
      });
    }

    // Read URL Hash or default to Overview
    const hash = window.location.hash.replace('#', '');
    if (hash && (hash === 'overview' || documents.some(d => d.id === hash))) {
      loadDocument(hash);
    } else {
      renderOverview();
    }
  });

})();
