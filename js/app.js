/**
 * SevaSetu Core Application Controller
 * Handles Navigation, Modals, Forms, Payment Simulator, Role Switching,
 * Volunteer Attendance Codes, Bill Vault, 80G Receipts, and Certificates.
 */
(function(window) {
  'use strict';

  var store = window.SevaSetuStore;
  var currentSection = 'campaigns'; // 'campaigns' | 'ngos' | 'volunteers' | 'vault' | 'lead' | 'ngo_admin' | 'platform_admin' | 'verify'

  // Route definitions mapping paths to roles and sections
  var ROUTES = {
    '/': { role: 'donor', section: 'campaigns', title: 'SevaSetu | Transparent Digital Giving & Volunteering' },
    '/campaigns': { role: 'donor', section: 'campaigns', title: 'Causes & Campaigns | SevaSetu' },
    '/ngos': { role: 'donor', section: 'ngos', title: 'Verified NGOs Directory | SevaSetu' },
    '/volunteer': { role: 'volunteer', section: 'volunteers', title: 'Volunteer Portal | SevaSetu' },
    '/field-lead': { role: 'field_lead', section: 'lead', title: 'Field Lead Attendance Tool | SevaSetu' },
    '/ngo-admin': { role: 'ngo_admin', section: 'ngo_admin', title: 'NGO Administration Portal | SevaSetu' },
    '/platform-admin': { role: 'platform_admin', section: 'platform_admin', title: 'Platform Admin & Compliance | SevaSetu' },
    '/vault': { role: 'donor', section: 'vault', title: 'The Bill Vault | SevaSetu' },
    '/verify': { role: 'donor', section: 'verify', title: 'Instant QR & Document Authenticator | SevaSetu' }
  };

  // Resolve current route from window location (supports clean paths and hash fallback)
  function resolveCurrentRoute() {
    var path = window.location.pathname || '/';
    // Remove trailing slash if not root
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    // Check hash fallback (e.g. #/volunteer or file:///...#volunteer)
    var hash = window.location.hash || '';
    if (hash.startsWith('#/')) {
      path = hash.substring(1);
    } else if (hash.startsWith('#')) {
      path = '/' + hash.substring(1);
    }

    // Direct match
    if (ROUTES[path]) {
      return { path: path, config: ROUTES[path] };
    }

    // Check if path matches without prefix
    for (var r in ROUTES) {
      if (path.endsWith(r) && r !== '/') {
        return { path: r, config: ROUTES[r] };
      }
    }

    return { path: '/', config: ROUTES['/'] };
  }

  // Application initialization
  function initApp() {
    store.init();
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.removeItem('sevasetu_theme');
    setupEventListeners();

    // Initial route resolution
    var routeInfo = resolveCurrentRoute();
    store.state.currentRole = routeInfo.config.role;
    currentSection = routeInfo.config.section;
    document.title = routeInfo.config.title;

    updateNavLinks();
    renderCurrentSection();

    // Subscribe to store updates
    store.subscribe(function(state) {
      updateNavLinks();
      renderCurrentSection();
    });

    // Check URL parameters (e.g. verify?bill=...)
    handleUrlParams();
  }

  // Navigate to a specific URL route
  function navigate(path, pushState) {
    if (pushState === undefined) pushState = true;
    
    // Normalize path
    if (!path.startsWith('/')) path = '/' + path;
    var config = ROUTES[path] || ROUTES['/'];

    store.setRole(config.role);
    currentSection = config.section;
    document.title = config.title;

    if (pushState) {
      try {
        if (window.location.protocol === 'file:') {
          window.location.hash = '#' + path;
        } else {
          window.history.pushState({ path: path }, config.title, path);
        }
      } catch (err) {
        window.location.hash = '#' + path;
      }
    }

    updateNavLinks();
    renderCurrentSection();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle URL query parameters for direct links or QR scanning
  function handleUrlParams() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('bill') || params.get('receipt')) {
      var id = params.get('bill') || params.get('receipt');
      navigate('/verify', false);
      setTimeout(function() {
        var inp = document.getElementById('verify-search-input');
        if (inp) {
          inp.value = id;
          runVerificationLookup(id);
        }
      }, 100);
    } else if (params.get('cert')) {
      var certId = params.get('cert');
      navigate('/verify', false);
      setTimeout(function() {
        var inp = document.getElementById('verify-search-input');
        if (inp) {
          inp.value = certId;
          runVerificationLookup(certId);
        }
      }, 100);
    }
  }

  function updateNavLinks() {
    var nav = document.getElementById('main-nav-links');
    if (!nav) return;

    var currentUser = store.state.currentUser;
    var role = currentUser ? currentUser.role : 'guest';
    var links = [];

    if (!currentUser) {
      // Public / Guest Navigation
      links = [
        { path: '/campaigns', secId: 'campaigns', label: 'Causes & Campaigns' },
        { path: '/ngos', secId: 'ngos', label: 'Verified NGOs' },
        { path: '/volunteer', secId: 'volunteers', label: 'Volunteering' },
        { path: '/verify', secId: 'verify', label: 'Verify QR' }
      ];
    } else {
      // Role-specific Navigation
      if (role === 'platform_admin') {
        links = [
          { path: '/platform-admin', secId: 'platform_admin', label: 'Trust & Admin Console' },
          { path: '/ngos', secId: 'ngos', label: 'NGO Registry' },
          { path: '/campaigns', secId: 'campaigns', label: 'Causes & Campaigns' },
          { path: '/verify', secId: 'verify', label: 'Verify QR' }
        ];
      } else if (role === 'ngo_admin') {
        links = [
          { path: '/ngo-admin', secId: 'ngo_admin', label: 'NGO Administration' },
          { path: '/campaigns', secId: 'campaigns', label: 'Causes & Campaigns' },
          { path: '/ngos', secId: 'ngos', label: 'Verified NGOs' },
          { path: '/verify', secId: 'verify', label: 'Verify QR' }
        ];
      } else if (role === 'field_lead') {
        links = [
          { path: '/field-lead', secId: 'lead', label: 'Field Lead Console' },
          { path: '/volunteer', secId: 'volunteers', label: 'Volunteer Drives' },
          { path: '/verify', secId: 'verify', label: 'Verify QR' }
        ];
      } else if (role === 'volunteer') {
        links = [
          { path: '/volunteer', secId: 'volunteers', label: 'Volunteer Portal' },
          { path: '/campaigns', secId: 'campaigns', label: 'Causes & Campaigns' },
          { path: '/verify', secId: 'verify', label: 'Verify QR' }
        ];
      } else {
        // Donor
        links = [
          { path: '/campaigns', secId: 'campaigns', label: 'Causes & Campaigns' },
          { path: '/ngos', secId: 'ngos', label: 'Verified NGOs' },
          { path: '/volunteer', secId: 'volunteers', label: 'Volunteering' },
          { path: '/vault', secId: 'vault', label: 'My Bill Vault' },
          { path: '/verify', secId: 'verify', label: 'Verify QR' }
        ];
      }
    }

    nav.innerHTML = links.map(function(l) {
      var isAct = l.secId === currentSection;
      return '<li><a href="' + l.path + '" class="nav-link ' + (isAct ? 'active' : '') + '" onclick="event.preventDefault(); window.SevaSetuApp.navigate(\'' + l.path + '\')">' + l.label + '</a></li>';
    }).join('');

    renderUserActions();
  }

  function renderUserActions() {
    var container = document.getElementById('nav-user-actions');
    if (!container) return;

    var currentUser = store.state.currentUser;

    if (!currentUser) {
      container.innerHTML = [
        '<button class="btn btn-secondary btn-sm" onclick="window.SevaSetuApp.openLoginModal()">Sign In</button>',
        '<button class="btn btn-outline-teal btn-sm" onclick="window.SevaSetuApp.openRegisterModal()">Register</button>',
        '<button class="btn btn-primary btn-sm" onclick="window.SevaSetuApp.openDonationModal()">',
        '  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
        '  Donate',
        '</button>'
      ].join('');
    } else {
      var roleClasses = {
        platform_admin: 'role-tag-admin',
        ngo_admin: 'role-tag-ngo',
        field_lead: 'role-tag-lead',
        volunteer: 'role-tag-volunteer',
        donor: 'role-tag-donor'
      };
      var roleClass = roleClasses[currentUser.role] || 'role-tag-donor';
      var initials = (currentUser.name || 'U').split(' ').map(function(n) { return n[0]; }).slice(0, 2).join('');

      container.innerHTML = [
        '<div class="user-profile-badge" title="' + currentUser.email + ' (' + currentUser.title + ')">',
        '  <div class="user-avatar-circle">' + initials + '</div>',
        '  <div style="display:flex; flex-direction:column; line-height:1.2;">',
        '    <strong style="font-size:0.8rem; color:var(--text-primary);">' + currentUser.name + '</strong>',
        '    <span class="role-tag-pill ' + roleClass + '">' + currentUser.role.replace('_', ' ') + '</span>',
        '  </div>',
        '</div>',
        '<button class="btn btn-secondary btn-sm" onclick="window.SevaSetuApp.handleLogout()" title="Sign out of ' + currentUser.email + '">Sign Out</button>',
        '<button class="btn btn-primary btn-sm" onclick="window.SevaSetuApp.openDonationModal()">',
        '  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
        '  Donate',
        '</button>'
      ].join('');
    }
  }

  // Switch Sections
  function switchSection(secId) {
    var pathToNav = '/';
    for (var p in ROUTES) {
      if (ROUTES[p].section === secId) {
        pathToNav = p;
        break;
      }
    }
    navigate(pathToNav);
  }

  function switchRole(roleId) {
    var targetPath = '/';
    if (roleId === 'volunteer') targetPath = '/volunteer';
    else if (roleId === 'field_lead') targetPath = '/field-lead';
    else if (roleId === 'ngo_admin') targetPath = '/ngo-admin';
    else if (roleId === 'platform_admin') targetPath = '/platform-admin';
    navigate(targetPath);
  }

  // Render Content Sections with Authentication Route Guards
  function renderCurrentSection() {
    var appMain = document.getElementById('app-main-content');
    if (!appMain) return;

    var currentUser = store.state.currentUser;
    var userRole = currentUser ? currentUser.role : 'guest';

    // Route Protection Checks
    if (currentSection === 'platform_admin') {
      if (userRole !== 'platform_admin') {
        renderAccessDeniedView(appMain, 'Platform Admin & Compliance Console', 'Platform Admin', 'admin@sevasetu.org', 'Admin@SevaSetu2026');
        return;
      }
    }

    if (currentSection === 'ngo_admin') {
      if (userRole !== 'ngo_admin' && userRole !== 'platform_admin') {
        renderAccessDeniedView(appMain, 'NGO Administration Portal', 'NGO Administrator', 'ngo@akshayaseva.org', 'Ngo@Akshaya2026');
        return;
      }
    }

    if (currentSection === 'lead') {
      if (userRole !== 'field_lead' && userRole !== 'platform_admin') {
        renderAccessDeniedView(appMain, 'Field Lead Attendance Tool', 'Field Lead', 'lead@sevasetu.org', 'Lead@Field2026');
        return;
      }
    }

    if (currentSection === 'vault') {
      if (!currentUser) {
        renderAccessDeniedView(appMain, 'The Bill Vault & Personal Tax Receipts', 'Donor or Member', 'donor@sevasetu.org', 'Donor@2026');
        return;
      }
    }

    switch (currentSection) {
      case 'campaigns':
        renderCampaignsView(appMain);
        break;
      case 'ngos':
        renderNgosView(appMain);
        break;
      case 'volunteers':
        renderVolunteersView(appMain);
        break;
      case 'vault':
        renderBillVaultView(appMain);
        break;
      case 'lead':
        renderFieldLeadView(appMain);
        break;
      case 'ngo_admin':
        renderNgoAdminView(appMain);
        break;
      case 'platform_admin':
        renderPlatformAdminView(appMain);
        break;
      case 'verify':
        renderVerificationView(appMain);
        break;
      default:
        renderCampaignsView(appMain);
    }
  }

  // Access Denied / Auth Gate View
  function renderAccessDeniedView(container, portalName, requiredRole, demoEmail, demoPass) {
    container.innerHTML = [
      '<section style="padding: 60px 0;">',
      '  <div class="container">',
      '    <div class="auth-gate-card">',
      '      <div class="auth-gate-icon">🔒</div>',
      '      <span class="badge-tag" style="background:#fee2e2; color:#b91c1c; font-weight:700; margin-bottom:12px; display:inline-block;">Protected Operational Portal</span>',
      '      <h2 style="font-size:1.8rem; font-weight:800; color:var(--text-primary); margin:8px 0 12px;">' + portalName + '</h2>',
      '      <p style="color:var(--text-secondary); max-width:480px; margin:0 auto 28px; line-height:1.6;">',
      '        This dashboard contains restricted administrative controls and records. Please sign in with an authorized <strong>' + requiredRole + '</strong> account to proceed.',
      '      </p>',
      '      <div style="display:flex; justify-content:center; gap:12px; margin-bottom:32px;">',
      '        <button class="btn btn-primary" onclick="window.SevaSetuApp.openLoginModal(\'' + demoEmail + '\', \'' + demoPass + '\')">Sign In with Credentials</button>',
      '        <button class="btn btn-secondary" onclick="window.SevaSetuApp.navigate(\'/\')">Back to Public Causes</button>',
      '      </div>',
      '      <div class="demo-accounts-box" style="text-align:left;">',
      '        <div style="font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">1-Click Instant Sign-In (From CREDENTIALS.md):</div>',
      '        <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:10px;">Select any role below to authenticate immediately:</div>',
      '        <div style="display:flex; flex-wrap:wrap; gap:8px;">',
      '          <button type="button" class="demo-account-chip" onclick="window.SevaSetuApp.quickLogin(\'admin@sevasetu.org\', \'Admin@SevaSetu2026\')">🛡️ Platform Admin</button>',
      '          <button type="button" class="demo-account-chip" onclick="window.SevaSetuApp.quickLogin(\'ngo@akshayaseva.org\', \'Ngo@Akshaya2026\')">🏛️ NGO Administrator</button>',
      '          <button type="button" class="demo-account-chip" onclick="window.SevaSetuApp.quickLogin(\'lead@sevasetu.org\', \'Lead@Field2026\')">⚡ Field Lead</button>',
      '          <button type="button" class="demo-account-chip" onclick="window.SevaSetuApp.quickLogin(\'volunteer@sevasetu.org\', \'Volunteer@2026\')">🤝 Volunteer</button>',
      '          <button type="button" class="demo-account-chip" onclick="window.SevaSetuApp.quickLogin(\'donor@sevasetu.org\', \'Donor@2026\')">💳 Donor</button>',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</section>'
    ].join('');
  }

  // 1. CAMPAIGNS VIEW
  function renderCampaignsView(container) {
    var campaigns = store.state.campaigns;
    var totalRaised = campaigns.reduce(function(acc, c) { return acc + Number(c.raisedAmount); }, 0);
    var totalDonors = campaigns.reduce(function(acc, c) { return acc + Number(c.donorCount); }, 0);

    var html = '';

    // Hero Section
    html += '<section class="hero-section">';
    html += '  <div class="container hero-grid">';
    html += '    <div class="hero-content">';
    html += '      <div class="hero-tag">';
    html += '        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>';
    html += '        Verified Statutory Compliance & Form 10BD';
    html += '      </div>';
    html += '      <h1 class="hero-title">Giving That Connects With <span class="highlight">100% Traceability</span></h1>';
    html += '      <p class="hero-desc">Discover verified Indian NGOs, donate securely via UPI or Cards with Section 80G tax benefits, and retrieve immutable transaction records in your Bill Vault.</p>';
    html += '      <div class="hero-actions">';
    html += '        <button class="btn btn-primary" onclick="window.SevaSetuApp.openDonationModal()">';
    html += '          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Donate to a Cause';
    html += '        </button>';
    html += '        <button class="btn btn-secondary" onclick="window.SevaSetuApp.switchSection(\'volunteers\')">';
    html += '          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Volunteer in Your City';
    html += '        </button>';
    html += '      </div>';
    html += '    </div>';
    html += '    <div class="hero-card">';
    html += '      <div class="trust-badge-card">';
    html += '        <div class="trust-icon-box">🛡️</div>';
    html += '        <div>';
    html += '          <h2 style="font-size:1.1rem;font-weight:700;color:var(--text-primary);margin-bottom:2px;">SevaSetu Trust Standard</h2>';
    html += '          <p style="font-size:0.85rem;color:var(--text-muted);">Independent audits, NITI Aayog Darpan & 80G validity checks.</p>';
    html += '        </div>';
    html += '      </div>';
    html += '      <div class="stats-mini-grid">';
    html += '        <div class="stat-item">';
    html += '          <div class="stat-num">' + store.formatCurrency(totalRaised) + '</div>';
    html += '          <div class="stat-label">Transparent Giving</div>';
    html += '        </div>';
    html += '        <div class="stat-item">';
    html += '          <div class="stat-num">' + totalDonors.toLocaleString('en-IN') + '+</div>';
    html += '          <div class="stat-label">Verified Donors</div>';
    html += '        </div>';
    html += '        <div class="stat-item">';
    html += '          <div class="stat-num">100%</div>';
    html += '          <div class="stat-label">Bill ID Traceability</div>';
    html += '        </div>';
    html += '        <div class="stat-item">';
    html += '          <div class="stat-num">Sec 80G</div>';
    html += '          <div class="stat-label">Instant Tax Receipts</div>';
    html += '        </div>';
    html += '      </div>';
    html += '    </div>';
    html += '  </div>';
    html += '</section>';

    // Campaigns Grid Section
    html += '<section style="padding: 40px 0;">';
    html += '  <div class="container">';
    html += '    <div class="section-header">';
    html += '      <span class="section-tag">Audited Initiatives</span>';
    html += '      <h2 class="section-title">Active NGO Campaigns</h2>';
    html += '      <p class="section-desc">Every campaign features published fund utilization ledgers, real-time milestones, and direct beneficiary safeguards.</p>';
    html += '    </div>';

    // Toolbar
    html += '    <div class="toolbar-bar">';
    html += '      <div class="search-input-box">';
    html += '        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
    html += '        <input type="text" id="campaign-search-input" placeholder="Search causes, NGOs, or keywords..." onkeyup="window.SevaSetuApp.filterCampaigns()">';
    html += '      </div>';
    html += '      <div class="filter-pills" id="campaign-category-filters">';
    html += '        <button class="filter-chip active" onclick="window.SevaSetuApp.setCampaignCategory(\'ALL\', this)">All Causes</button>';
    html += '        <button class="filter-chip" onclick="window.SevaSetuApp.setCampaignCategory(\'Education & Nutrition\', this)">Education & Nutrition</button>';
    html += '        <button class="filter-chip" onclick="window.SevaSetuApp.setCampaignCategory(\'Healthcare\', this)">Healthcare</button>';
    html += '        <button class="filter-chip" onclick="window.SevaSetuApp.setCampaignCategory(\'Environment & Climate\', this)">Environment</button>';
    html += '      </div>';
    html += '    </div>';

    // Cards Grid
    html += '    <div class="cards-grid" id="campaigns-grid-container">';
    html += renderCampaignCards(campaigns);
    html += '    </div>';
    html += '  </div>';
    html += '</section>';

    container.innerHTML = html;
  }

  function renderCampaignCards(campaigns) {
    if (!campaigns || campaigns.length === 0) {
      return '<div style="grid-column: 1/-1; text-align:center; padding: 48px; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px solid var(--border-light);"><p style="color:var(--text-muted);">No active campaigns match your search.</p></div>';
    }

    return campaigns.map(function(c) {
      var percent = Math.min(100, Math.round((c.raisedAmount / c.goalAmount) * 100));
      return [
        '<div class="campaign-card">',
        '  <div class="card-header-banner" style="background: linear-gradient(135deg, ' + (c.bannerColor || 'var(--brand-teal)') + ' 0%, var(--brand-navy) 100%);">',
        '    <span class="badge-tag">' + c.category + '</span>',
        c.is80GEligible ? '    <span class="badge-80g">Sec 80G Tax Exemption</span>' : '',
        '  </div>',
        '  <div class="card-body">',
        '    <div class="ngo-meta">',
        '      <svg class="verified-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>',
        '      <span>' + c.ngoName + '</span>',
        '    </div>',
        '    <h3 class="card-title">' + c.title + '</h3>',
        '    <p class="card-desc">' + c.shortDesc + '</p>',
        '    <div class="progress-container">',
        '      <div class="progress-labels">',
        '        <span style="color:var(--brand-teal);">' + store.formatCurrency(c.raisedAmount) + ' raised</span>',
        '        <span style="color:var(--text-muted);">' + percent + '%</span>',
        '      </div>',
        '      <div class="progress-track">',
        '        <div class="progress-fill" style="width: ' + percent + '%;"></div>',
        '      </div>',
        '    </div>',
        '    <div class="card-stats-row">',
        '      <span>Target: <strong>' + store.formatCurrency(c.goalAmount) + '</strong></span>',
        '      <span><strong>' + (c.donorCount || 0) + '</strong> Donors</span>',
        '      <span><strong>' + c.daysLeft + '</strong> Days Left</span>',
        '    </div>',
        '    <div class="card-actions-row">',
        '      <button class="btn btn-outline-teal btn-sm" style="flex:1;" onclick="window.SevaSetuApp.openCampaignDetails(\'' + c.id + '\')">Details & Ledger</button>',
        '      <button class="btn btn-primary btn-sm" style="flex:1;" onclick="window.SevaSetuApp.openDonationModal(\'' + c.id + '\')">Donate Now</button>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('');
    }).join('');
  }

  // 2. VERIFIED NGOS VIEW
  function renderNgosView(container) {
    var ngos = store.state.ngos;
    var html = [
      '<section style="padding: 48px 0;">',
      '  <div class="container">',
      '    <div class="section-header">',
      '      <span class="section-tag">Statutory Transparency</span>',
      '      <h2 class="section-title">Verified NGO Registry</h2>',
      '      <p class="section-desc">Organizations registered on SevaSetu are reviewed against their 12A, 80G, PAN, and NITI Aayog Darpan credentials. We never imply government endorsement.</p>',
      '    </div>',
      '    <div class="cards-grid">'
    ];

    html.push(ngos.map(function(ngo) {
      return [
        '<div class="campaign-card">',
        '  <div style="padding: 24px; border-bottom: 1px solid var(--border-light); display:flex; justify-content:space-between; align-items:flex-start;">',
        '    <div>',
        '      <span class="verified-pill">✓ ' + (ngo.verificationStatus === 'VERIFIED' ? 'Darpan & 80G Verified' : ngo.verificationStatus) + '</span>',
        '      <h3 style="font-size:1.25rem; font-weight:700; color:var(--text-primary); margin-top:8px;">' + ngo.name + '</h3>',
        '      <p style="font-size:0.85rem; color:var(--text-muted);">' + ngo.city + ' • Founded ' + ngo.founded + '</p>',
        '    </div>',
        '    <div style="background:var(--brand-teal-light); color:var(--brand-teal); font-weight:800; font-size:1.1rem; padding:6px 12px; border-radius:var(--radius-md);" title="Transparency Score">',
        '      ' + ngo.trustScore + '<span style="font-size:0.7rem; font-weight:normal;">/100</span>',
        '    </div>',
        '  </div>',
        '  <div class="card-body">',
        '    <p class="card-desc">' + ngo.mission + '</p>',
        '    <div style="background:var(--bg-surface-subtle); padding:12px; border-radius:var(--radius-md); font-size:0.8rem; margin-bottom:16px;">',
        '      <div style="margin-bottom:4px;"><strong>Darpan ID:</strong> ' + ngo.darpanId + '</div>',
        '      <div style="margin-bottom:4px;"><strong>NGO PAN:</strong> ' + ngo.pan + '</div>',
        '      <div style="margin-bottom:4px;"><strong>80G Order:</strong> ' + ngo.sec80G + '</div>',
        '      <div><strong>FCRA Status:</strong> ' + ngo.fcraStatus + '</div>',
        '    </div>',
        '    <div style="margin-top:auto; display:flex; gap:10px;">',
        '      <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="window.SevaSetuApp.showNgoStatutoryModal(\'' + ngo.id + '\')">View Statutory Proofs</button>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('');
    }).join(''));

    html.push('    </div>');
    html.push('  </div>');
    html.push('</section>');

    container.innerHTML = html.join('');
  }

  // 3. VOLUNTEER VIEW
  function renderVolunteersView(container) {
    var opps = store.state.volunteerOpportunities;
    var records = store.state.volunteerRecords;

    var html = [
      '<section style="padding: 48px 0;">',
      '  <div class="container">',
      '    <div class="section-header">',
      '      <span class="section-tag">Direct Community Action</span>',
      '      <h2 class="section-title">Verified Volunteering Drives</h2>',
      '      <p class="section-desc">Join on-ground or digital initiatives. Attend sessions, verify presence via Field Lead session codes, and receive verifiable service certificates.</p>',
      '    </div>',
      '    <div class="tabs-nav">',
      '      <button class="tab-btn active" id="tab-vol-opps" onclick="window.SevaSetuApp.switchVolTab(\'opps\')">Available Opportunities</button>',
      '      <button class="tab-btn" id="tab-vol-records" onclick="window.SevaSetuApp.switchVolTab(\'records\')">My Attendance & Certificates (' + records.length + ')</button>',
      '    </div>',
      '    <div id="vol-content-area">'
    ];

    html.push(renderVolOppsTab(opps));
    html.push('    </div>');
    html.push('  </div>');
    html.push('</section>');

    container.innerHTML = html.join('');
  }

  function renderVolOppsTab(opps) {
    return [
      '<div class="cards-grid">',
      opps.map(function(opp) {
        var hasActiveSession = opp.activeSession && opp.activeSession.isActive;
        return [
          '<div class="campaign-card">',
          '  <div style="padding:20px; border-bottom:1px solid var(--border-light); background:var(--bg-surface-subtle);">',
          '    <span class="badge-tag">' + opp.category + '</span>',
          '    <h3 style="font-size:1.2rem; font-weight:700; color:var(--text-primary); margin-top:8px;">' + opp.title + '</h3>',
          '    <p style="font-size:0.85rem; color:var(--text-muted);">' + opp.ngoName + ' • ' + opp.location + '</p>',
          '  </div>',
          '  <div class="card-body">',
          '    <div style="font-size:0.9rem; margin-bottom:12px;">',
          '      <div>📅 <strong>Schedule:</strong> ' + opp.dateStr + '</div>',
          '      <div>⏱️ <strong>Service Hours Credit:</strong> ' + opp.hoursReward + ' Hours</div>',
          '      <div>👥 <strong>Spots:</strong> ' + opp.spotsFilled + ' / ' + opp.spotsTotal + ' filled</div>',
          '      <div>👤 <strong>Field Lead:</strong> ' + opp.leadName + '</div>',
          '    </div>',
          hasActiveSession ? [
            '<div style="background:var(--status-verified-bg); border:1px solid var(--status-verified); padding:10px 14px; border-radius:var(--radius-md); margin-bottom:16px;">',
            '  <div style="font-size:0.85rem; font-weight:700; color:var(--status-verified);">⚡ Live Attendance Session Active</div>',
            '  <div style="font-size:0.8rem; color:var(--text-secondary);">Ask your field lead for the 6-character session code to check-in.</div>',
            '</div>'
          ].join('') : '',
          '    <div class="card-actions-row" style="margin-top:auto;">',
          '      <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="window.SevaSetuApp.viewOppDetails(\'' + opp.id + '\')">Requirements</button>',
          hasActiveSession
            ? '<button class="btn btn-primary btn-sm" style="flex:1;" onclick="window.SevaSetuApp.openVolunteerCheckInModal(\'' + opp.id + '\')">Enter Code & Check In</button>'
            : '<button class="btn btn-amber btn-sm" style="flex:1;" onclick="window.SevaSetuApp.registerForOpp(\'' + opp.id + '\')">Register Now</button>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('');
      }).join(''),
      '</div>'
    ].join('');
  }

  function renderVolRecordsTab() {
    var records = store.state.volunteerRecords;
    if (records.length === 0) {
      return '<div style="text-align:center; padding:48px; background:var(--bg-surface); border-radius:var(--radius-lg);"><p style="color:var(--text-muted);">No volunteering attendance recorded yet. Join a session to earn verified certificates.</p></div>';
    }

    return [
      '<div class="vault-table-wrapper">',
      '  <table class="vault-table">',
      '    <thead>',
      '      <tr>',
      '        <th>Record ID</th>',
      '        <th>Opportunity & NGO</th>',
      '        <th>Date & Time</th>',
      '        <th>Hours</th>',
      '        <th>Status</th>',
      '        <th>Certificate</th>',
      '      </tr>',
      '    </thead>',
      '    <tbody>',
      records.map(function(r) {
        var isApproved = r.status === 'APPROVED';
        return [
          '<tr>',
          '  <td class="vault-bill-id">' + r.recordId + '</td>',
          '  <td><strong>' + r.opportunityTitle + '</strong><br><small style="color:var(--text-muted);">' + r.ngoName + '</small></td>',
          '  <td>' + r.sessionDate + '<br><small style="color:var(--text-muted);">' + r.checkInTime + ' - ' + (r.checkOutTime || 'Present') + '</small></td>',
          '  <td><strong>' + r.hoursLogged + ' hrs</strong></td>',
          '  <td><span class="' + (isApproved ? 'verified-pill' : 'badge-tag') + '">' + r.status + '</span></td>',
          '  <td>',
          isApproved
            ? '<button class="btn btn-primary btn-sm" onclick="window.SevaSetuApp.viewVolunteerCertificate(\'' + r.recordId + '\')">View Certificate</button>'
            : (r.status === 'CHECKED_IN'
                ? '<button class="btn btn-secondary btn-sm" onclick="window.SevaSetuApp.triggerCheckOut(\'' + r.recordId + '\')">Check Out</button>'
                : '<span style="font-size:0.8rem; color:var(--text-muted);">Awaiting Lead Approval</span>'),
          '  </td>',
          '</tr>'
        ].join('');
      }).join(''),
      '    </tbody>',
      '  </table>',
      '</div>'
    ].join('');
  }

  // 4. BILL VAULT VIEW
  function renderBillVaultView(container) {
    var donations = store.state.donations;
    var html = [
      '<section style="padding: 48px 0;">',
      '  <div class="container">',
      '    <div class="section-header">',
      '      <span class="section-tag">Audited Financial Records</span>',
      '      <h2 class="section-title">The Bill Vault (Transaction & 80G Repository)</h2>',
      '      <p class="section-desc">Search, retrieve, and download tamper-evident 80G tax certificates with signed QR verification codes. All records match statutory Form 10BD reporting standards.</p>',
      '    </div>',
      '    <div class="toolbar-bar">',
      '      <div class="search-input-box">',
      '        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
      '        <input type="text" id="vault-search-input" placeholder="Search by Bill ID (e.g. SS-BILL-2026-...) or NGO name..." onkeyup="window.SevaSetuApp.filterVault()">',
      '      </div>',
      '      <div style="font-size:0.9rem; color:var(--text-muted);">',
      '        Total Stored Bills: <strong>' + donations.length + '</strong>',
      '      </div>',
      '    </div>',
      '    <div class="vault-table-wrapper" id="vault-table-container">',
      renderVaultTable(donations),
      '    </div>',
      '  </div>',
      '</section>'
    ];

    container.innerHTML = html.join('');
  }

  function renderVaultTable(donations) {
    if (donations.length === 0) {
      return '<div style="text-align:center; padding:48px;"><p style="color:var(--text-muted);">No donation records found.</p></div>';
    }

    return [
      '<table class="vault-table">',
      '  <thead>',
      '    <tr>',
      '      <th>Bill ID</th>',
      '      <th>Date & Time</th>',
      '      <th>Cause & NGO</th>',
      '      <th>Amount</th>',
      '      <th>Payment Ref</th>',
      '      <th>80G Tax Status</th>',
      '      <th>Action</th>',
      '    </tr>',
      '  </thead>',
      '  <tbody>',
      donations.map(function(d) {
        return [
          '<tr>',
          '  <td class="vault-bill-id">' + d.billId + '</td>',
          '  <td>' + store.formatDate(d.timestamp) + '</td>',
          '  <td><strong>' + d.campaignTitle + '</strong><br><small style="color:var(--text-muted);">' + d.ngoName + '</small></td>',
          '  <td><strong style="color:var(--brand-teal);">' + store.formatCurrency(d.amount) + '</strong></td>',
          '  <td><small style="font-family:var(--font-mono);">' + d.providerRef + '</small><br><span class="badge-tag">' + d.paymentMethod + '</span></td>',
          '  <td>',
          d.is80GEligible
            ? '<span class="verified-pill">✓ Sec 80G Eligible</span><br><small style="color:var(--text-muted);">Form 10BD Ready</small>'
            : '<span class="badge-tag">No PAN Provided</span>',
          '  </td>',
          '  <td>',
          '    <button class="btn btn-outline-teal btn-sm" onclick="window.SevaSetuApp.viewOfficialReceipt(\'' + d.billId + '\')">Official Receipt</button>',
          '  </td>',
          '</tr>'
        ].join('');
      }).join(''),
      '  </tbody>',
      '</table>'
    ].join('');
  }

  // 5. FIELD LEAD VIEW
  function renderFieldLeadView(container) {
    var opps = store.state.volunteerOpportunities;
    var records = store.state.volunteerRecords.filter(function(r) { return r.status === 'PENDING_APPROVAL' || r.status === 'CHECKED_IN'; });

    var html = [
      '<section style="padding: 48px 0;">',
      '  <div class="container">',
      '    <div class="section-header">',
      '      <span class="section-tag">Field Lead Authority</span>',
      '      <h2 class="section-title">Field Lead Attendance & Code Console</h2>',
      '      <p class="section-desc">Generate temporary, unguessable 10-minute session attendance codes for volunteer check-ins and review service hours sign-offs.</p>',
      '    </div>',
      '    <div style="display:grid; grid-template-columns: 1.2fr 0.8fr; gap:32px; margin-bottom:40px;">',
      '      <div style="background:var(--bg-surface); padding:28px; border-radius:var(--radius-lg); border:1px solid var(--border-light); box-shadow:var(--shadow-sm);">',
      '        <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:16px;">Active Sessions & Code Generation</h3>',
      opps.map(function(opp) {
        var hasActive = opp.activeSession && opp.activeSession.isActive;
        return [
          '<div style="padding:16px; border:1px solid var(--border-light); border-radius:var(--radius-md); margin-bottom:16px; background:var(--bg-surface-subtle);">',
          '  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">',
          '    <strong>' + opp.title + '</strong>',
          '    <span class="badge-tag">' + opp.ngoName + '</span>',
          '  </div>',
          hasActive ? [
            '<div style="background:#ffffff; border:1px solid var(--brand-teal); padding:16px; border-radius:var(--radius-md); text-align:center; margin:12px 0;">',
            '  <div style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); letter-spacing:1px;">Active Volunteer Attendance Code</div>',
            '  <div style="font-size:2.2rem; font-family:var(--font-mono); font-weight:800; color:var(--brand-teal); letter-spacing:4px; margin:4px 0;">' + opp.activeSession.sessionToken + '</div>',
            '  <div style="font-size:0.85rem; color:var(--brand-amber); font-weight:600;">Valid for 10 minutes • Scoped to ' + opp.title + '</div>',
            '  <button class="btn btn-secondary btn-sm" style="margin-top:10px; color:var(--status-alert);" onclick="window.SevaSetuApp.revokeSessionCode(\'' + opp.id + '\')">Revoke Code Now</button>',
            '</div>'
          ].join('') : [
            '<div style="margin:12px 0; color:var(--text-muted); font-size:0.85rem;">No active session code currently running.</div>',
            '<button class="btn btn-primary btn-sm" onclick="window.SevaSetuApp.generateSessionCode(\'' + opp.id + '\')">⚡ Generate 10-Min Session Code</button>'
          ].join(''),
          '</div>'
        ].join('');
      }).join(''),
      '      </div>',
      '      <div style="background:var(--bg-surface); padding:28px; border-radius:var(--radius-lg); border:1px solid var(--border-light); box-shadow:var(--shadow-sm);">',
      '        <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:16px;">Pending Attendance Approvals (' + records.length + ')</h3>',
      records.length === 0
        ? '<p style="color:var(--text-muted); font-size:0.9rem;">No pending approvals in queue.</p>'
        : records.map(function(r) {
            return [
              '<div style="padding:14px; border:1px solid var(--border-light); border-radius:var(--radius-md); margin-bottom:12px; background:var(--bg-surface-subtle);">',
              '  <div style="font-weight:700; color:var(--text-primary);">' + r.volunteerName + '</div>',
              '  <div style="font-size:0.8rem; color:var(--text-muted);">' + r.opportunityTitle + ' • ' + r.checkInTime + ' to ' + (r.checkOutTime || 'Present') + '</div>',
              '  <div style="margin-top:10px; display:flex; gap:8px;">',
              '    <button class="btn btn-primary btn-sm" onclick="window.SevaSetuApp.openApproveHoursModal(\'' + r.recordId + '\', ' + r.hoursLogged + ')">Sign Off & Issue Cert</button>',
              '  </div>',
              '</div>'
            ].join('');
          }).join(''),
      '      </div>',
      '    </div>',
      '  </div>',
      '</section>'
    ];

    container.innerHTML = html.join('');
  }

  // 6. NGO ADMIN PORTAL
  function renderNgoAdminView(container) {
    var myNgo = store.state.ngos[0]; // Akshaya Seva Foundation
    var myCampaigns = store.state.campaigns.filter(function(c) { return c.ngoId === myNgo.id; });
    var myDonations = store.state.donations.filter(function(d) { return d.ngoId === myNgo.id; });
    var totalFunds = myDonations.reduce(function(acc, d) { return acc + Number(d.amount); }, 0);

    var html = [
      '<section style="padding: 48px 0;">',
      '  <div class="container">',
      '    <div class="section-header" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:20px;">',
      '      <div>',
      '        <span class="section-tag">Organization Administration</span>',
      '        <h2 class="section-title">' + myNgo.name + '</h2>',
      '        <p class="section-desc">Manage statutory evidence, campaigns, fund allocation ledgers, and export Form 10BD tax statements.</p>',
      '      </div>',
      '      <button class="btn btn-primary" onclick="window.SevaSetuApp.openNewCampaignModal()">',
      '        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Launch New Campaign',
      '      </button>',
      '    </div>',
      '    <div class="stats-mini-grid" style="margin-bottom:32px;">',
      '      <div class="stat-item"><div class="stat-num">' + store.formatCurrency(totalFunds) + '</div><div class="stat-label">Total Verified Funds Received</div></div>',
      '      <div class="stat-item"><div class="stat-num">' + myDonations.length + '</div><div class="stat-label">80G Receipts Generated</div></div>',
      '      <div class="stat-item"><div class="stat-num">' + myCampaigns.length + '</div><div class="stat-label">Active Published Drives</div></div>',
      '      <div class="stat-item"><div class="stat-num">' + myNgo.darpanId + '</div><div class="stat-label">NITI Aayog Darpan UID</div></div>',
      '    </div>',
      '    <div class="vault-table-wrapper" style="margin-bottom:32px;">',
      '      <div style="padding:16px 20px; font-weight:700; border-bottom:1px solid var(--border-light); background:var(--bg-surface-subtle); display:flex; justify-content:space-between; align-items:center;">',
      '        <span>Form 10BD Readiness & Donor Statements</span>',
      '        <button class="btn btn-secondary btn-sm" onclick="window.SevaSetuApp.exportForm10Bd()">Download Form 10BD CSV</button>',
      '      </div>',
      '      <table class="vault-table">',
      '        <thead>',
      '          <tr>',
      '            <th>Donor Name</th>',
      '            <th>Donor PAN</th>',
      '            <th>Amount (INR)</th>',
      '            <th>Receipt ID</th>',
      '            <th>Tax Year</th>',
      '            <th>Status</th>',
      '          </tr>',
      '        </thead>',
      '        <tbody>',
      myDonations.map(function(d) {
        return [
          '<tr>',
          '  <td>' + d.donorName + '</td>',
          '  <td><code>' + store.maskPan(d.donorPan) + '</code></td>',
          '  <td>' + store.formatCurrency(d.amount) + '</td>',
          '  <td>' + d.receiptId + '</td>',
          '  <td>AY 2026-27</td>',
          '  <td><span class="verified-pill">✓ Form 10BD Ready</span></td>',
          '</tr>'
        ].join('');
      }).join(''),
      '        </tbody>',
      '      </table>',
      '    </div>',
      '  </div>',
      '</section>'
    ];

    container.innerHTML = html.join('');
  }

  // 7. PLATFORM ADMIN & TRUST/SAFETY CONSOLE
  function renderPlatformAdminView(container) {
    var ngos = store.state.ngos;
    var auditLogs = store.state.auditLogs.slice(0, 15);

    var html = [
      '<section style="padding: 48px 0;">',
      '  <div class="container">',
      '    <div class="section-header">',
      '      <span class="section-tag">Platform Reviewer & Compliance</span>',
      '      <h2 class="section-title">Trust & Safety Console</h2>',
      '      <p class="section-desc">Review NGO verification submissions, audit privileged actions, inspect evidence documents, and enforce statutory standards.</p>',
      '    </div>',
      '    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:32px; margin-bottom:40px;">',
      '      <div style="background:var(--bg-surface); padding:28px; border-radius:var(--radius-lg); border:1px solid var(--border-light); box-shadow:var(--shadow-sm);">',
      '        <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:16px;">NGO Verification Reviews</h3>',
      ngos.map(function(n) {
        return [
          '<div style="padding:16px; border:1px solid var(--border-light); border-radius:var(--radius-md); margin-bottom:12px; background:var(--bg-surface-subtle);">',
          '  <div style="display:flex; justify-content:space-between; align-items:flex-start;">',
          '    <div>',
          '      <strong>' + n.name + '</strong>',
          '      <div style="font-size:0.8rem; color:var(--text-muted);">' + n.darpanId + ' • PAN: ' + n.pan + '</div>',
          '    </div>',
          '    <span class="' + (n.verificationStatus === 'VERIFIED' ? 'verified-pill' : 'badge-tag') + '">' + n.verificationStatus + '</span>',
          '  </div>',
          '  <p style="font-size:0.8rem; color:var(--text-secondary); margin:8px 0;">' + (n.reviewerNotes || 'No notes') + '</p>',
          '  <div style="display:flex; gap:8px; margin-top:10px;">',
          n.verificationStatus !== 'VERIFIED'
            ? '<button class="btn btn-primary btn-sm" onclick="window.SevaSetuApp.adminReviewNgo(\'' + n.id + '\', \'VERIFIED\')">Approve Verification</button>'
            : '<button class="btn btn-secondary btn-sm" onclick="window.SevaSetuApp.adminReviewNgo(\'' + n.id + '\', \'UNDER_REVERIFICATION\')">Trigger Re-verification</button>',
          '    <button class="btn btn-secondary btn-sm" onclick="window.SevaSetuApp.showNgoStatutoryModal(\'' + n.id + '\')">Inspect Docs</button>',
          '  </div>',
          '</div>'
        ].join('');
      }).join(''),
      '      </div>',
      '      <div style="background:var(--bg-surface); padding:28px; border-radius:var(--radius-lg); border:1px solid var(--border-light); box-shadow:var(--shadow-sm);">',
      '        <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:16px;">Tamper-Evident Audit Trail</h3>',
      '        <div style="font-size:0.85rem; max-height:480px; overflow-y:auto;">',
      auditLogs.map(function(log) {
        return [
          '<div style="padding:10px; border-bottom:1px solid var(--border-light);">',
          '  <div style="display:flex; justify-content:space-between; font-weight:600; font-size:0.8rem;">',
          '    <span style="color:var(--brand-teal); font-family:var(--font-mono);">' + log.action + '</span>',
          '    <span style="color:var(--text-muted);">' + store.formatDate(log.timestamp) + '</span>',
          '  </div>',
          '  <div style="color:var(--text-primary); margin:2px 0;">' + log.details + '</div>',
          '  <div style="color:var(--text-muted); font-size:0.75rem;">Actor: ' + log.actor + ' (' + log.role + ')</div>',
          '</div>'
        ].join('');
      }).join(''),
      '        </div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</section>'
    ];

    container.innerHTML = html.join('');
  }

  // 8. VERIFICATION LOOKUP VIEW
  function renderVerificationView(container) {
    var html = [
      '<section style="padding: 48px 0;">',
      '  <div class="container" style="max-width:800px;">',
      '    <div class="section-header" style="text-align:center;">',
      '      <span class="section-tag">Public Document Verifier</span>',
      '      <h2 class="section-title">Instant QR & Bill ID Authenticator</h2>',
      '      <p class="section-desc">Validate 80G tax receipts and Volunteer Service Certificates issued by SevaSetu without exposing private donor data.</p>',
      '    </div>',
      '    <div style="background:var(--bg-surface); padding:32px; border-radius:var(--radius-lg); border:1px solid var(--border-light); box-shadow:var(--shadow-md); margin-bottom:32px;">',
      '      <div class="form-group">',
      '        <label class="form-label">Enter Bill ID, Receipt ID, or Certificate Number</label>',
      '        <div style="display:flex; gap:10px;">',
      '          <input type="text" id="verify-search-input" class="form-input" placeholder="e.g. SS-BILL-2026-892147 or SEVA-CERT-2026-11082">',
      '          <button class="btn btn-primary" onclick="window.SevaSetuApp.triggerManualVerify()">Verify Now</button>',
      '        </div>',
      '        <p class="form-help">Tip: Try verifying with sample Bill ID <code>SS-BILL-2026-892147</code> or sample Cert ID <code>SEVA-CERT-2026-11082</code></p>',
      '      </div>',
      '      <div id="verify-result-box" style="margin-top:24px;"></div>',
      '    </div>',
      '  </div>',
      '</section>'
    ];

    container.innerHTML = html.join('');
  }

  function runVerificationLookup(query) {
    query = (query || '').trim();
    var resultBox = document.getElementById('verify-result-box');
    if (!resultBox) return;

    if (!query) {
      resultBox.innerHTML = '<div style="color:var(--status-alert);">Please enter a valid document identifier.</div>';
      return;
    }

    // Search in donations
    var donation = store.state.donations.find(function(d) {
      return d.billId.toLowerCase() === query.toLowerCase() || d.receiptId.toLowerCase() === query.toLowerCase();
    });

    if (donation) {
      resultBox.innerHTML = [
        '<div style="border:2px solid var(--status-verified); background:var(--status-verified-bg); border-radius:var(--radius-md); padding:20px;">',
        '  <div style="display:flex; align-items:center; gap:8px; color:var(--status-verified); font-weight:700; font-size:1.1rem; margin-bottom:12px;">',
        '    ✓ Genuine 80G Tax Exemption Receipt Verified',
        '  </div>',
        '  <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.9rem;">',
        '    <div><strong>Bill ID:</strong> ' + donation.billId + '</div>',
        '    <div><strong>Receipt Number:</strong> ' + donation.receiptId + '</div>',
        '    <div><strong>Recipient NGO:</strong> ' + donation.ngoName + '</div>',
        '    <div><strong>NGO 80G Order:</strong> ' + donation.ngo80GOrder + '</div>',
        '    <div><strong>Amount Contributed:</strong> ' + store.formatCurrency(donation.amount) + '</div>',
        '    <div><strong>Timestamp:</strong> ' + store.formatDate(donation.timestamp) + '</div>',
        '    <div><strong>Donor Name:</strong> ' + (donation.isAnonymous ? 'Anonymous Donor' : donation.donorName) + '</div>',
        '    <div><strong>Donor PAN:</strong> ' + store.maskPan(donation.donorPan) + '</div>',
        '  </div>',
        '  <div style="margin-top:16px;">',
        '    <button class="btn btn-primary btn-sm" onclick="window.SevaSetuApp.viewOfficialReceipt(\'' + donation.billId + '\')">View Official Certificate</button>',
        '  </div>',
        '</div>'
      ].join('');
      return;
    }

    // Search in volunteer records
    var vRecord = store.state.volunteerRecords.find(function(v) {
      return (v.certificateId && v.certificateId.toLowerCase() === query.toLowerCase()) || v.recordId.toLowerCase() === query.toLowerCase();
    });

    if (vRecord) {
      resultBox.innerHTML = [
        '<div style="border:2px solid var(--status-verified); background:var(--status-verified-bg); border-radius:var(--radius-md); padding:20px;">',
        '  <div style="display:flex; align-items:center; gap:8px; color:var(--status-verified); font-weight:700; font-size:1.1rem; margin-bottom:12px;">',
        '    ✓ Genuine Volunteer Service Record Verified',
        '  </div>',
        '  <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.9rem;">',
        '    <div><strong>Certificate ID:</strong> ' + vRecord.certificateId + '</div>',
        '    <div><strong>Volunteer:</strong> ' + vRecord.volunteerName + '</div>',
        '    <div><strong>Activity:</strong> ' + vRecord.opportunityTitle + '</div>',
        '    <div><strong>Issuing NGO:</strong> ' + vRecord.ngoName + '</div>',
        '    <div><strong>Approved Hours:</strong> ' + vRecord.hoursLogged + ' Hours</div>',
        '    <div><strong>Verified By:</strong> ' + (vRecord.approvedBy || 'Field Lead') + '</div>',
        '  </div>',
        '  <div style="margin-top:16px;">',
        '    <button class="btn btn-primary btn-sm" onclick="window.SevaSetuApp.viewVolunteerCertificate(\'' + vRecord.recordId + '\')">View Signed Certificate</button>',
        '  </div>',
        '</div>'
      ].join('');
      return;
    }

    resultBox.innerHTML = [
      '<div style="border:2px solid var(--status-alert); background:var(--status-alert-bg); border-radius:var(--radius-md); padding:20px;">',
      '  <div style="color:var(--status-alert); font-weight:700; margin-bottom:6px;">⚠️ Record Not Found in SevaSetu Vault</div>',
      '  <p style="font-size:0.9rem; color:var(--text-secondary);">No active record matches "' + query + '". Please verify the number or check with the issuing organization.</p>',
      '</div>'
    ].join('');
  }

  // MODALS & ACTIONS

  // 1. Donation Modal
  function openDonationModal(campaignId) {
    var campaigns = store.state.campaigns;
    var selected = campaigns.find(function(c) { return c.id === campaignId; }) || campaigns[0];
    var modal = document.getElementById('donation-modal');
    if (!modal) return;

    var curUser = store.state.currentUser || {};
    var defName = curUser.name || 'Sunita Patel';
    var defEmail = curUser.email || 'donor@sevasetu.org';
    var defPhone = curUser.phone || '+91 98765 43210';
    var defPan = curUser.pan || 'ABCDE1234F';

    var formHtml = [
      '<div class="modal-card">',
      '  <div class="modal-header">',
      '    <div style="display:flex; align-items:center; gap:10px;">',
      '      <img src="assets/sevasetu-logo.png" alt="SevaSetu" style="width:28px; height:28px; border-radius:6px; object-fit:cover;">',
      '      <h3 class="modal-title">Make a Verified Donation</h3>',
      '    </div>',
      '    <button class="modal-close-btn" onclick="window.SevaSetuApp.closeModal(\'donation-modal\')">&times;</button>',
      '  </div>',
      '  <div class="modal-body">',
      '    <div style="background:var(--brand-teal-light); padding:14px; border-radius:var(--radius-md); margin-bottom:20px;">',
      '      <div style="font-size:0.8rem; font-weight:700; color:var(--brand-teal); text-transform:uppercase;">Selected Initiative</div>',
      '      <div style="font-weight:700; font-size:1.05rem; color:var(--text-primary); margin-top:2px;">' + selected.title + '</div>',
      '      <div style="font-size:0.85rem; color:var(--text-secondary);">' + selected.ngoName + ' • Section 80G 50% Tax Exemption</div>',
      '    </div>',
      '    <form id="donation-form" onsubmit="window.SevaSetuApp.processDonationSubmit(event, \'' + selected.id + '\')">',
      '      <div class="form-group">',
      '        <label class="form-label">Select Amount (INR)</label>',
      '        <div class="amount-picker-grid">',
      '          <button type="button" class="amount-pill" onclick="window.SevaSetuApp.pickAmount(500, this)">₹500</button>',
      '          <button type="button" class="amount-pill selected" onclick="window.SevaSetuApp.pickAmount(1000, this)">₹1,000</button>',
      '          <button type="button" class="amount-pill" onclick="window.SevaSetuApp.pickAmount(2500, this)">₹2,500</button>',
      '          <button type="button" class="amount-pill" onclick="window.SevaSetuApp.pickAmount(5000, this)">₹5,000</button>',
      '        </div>',
      '        <input type="number" id="custom-donation-amount" class="form-input" value="1000" min="100" placeholder="Custom amount (Min ₹100)" oninput="window.SevaSetuApp.updateCalculatedDeduction()">',
      '        <div id="tax-savings-calc" style="font-size:0.85rem; color:var(--brand-teal); font-weight:600; margin-top:6px;">✓ Saves approx ₹500 under Section 80G</div>',
      '      </div>',
      '      <div class="form-group">',
      '        <label class="form-label">Donor Name (For Tax Receipt)</label>',
      '        <input type="text" id="donor-name" class="form-input" required value="' + defName + '">',
      '      </div>',
      '      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">',
      '        <div class="form-group">',
      '          <label class="form-label">Email Address</label>',
      '          <input type="email" id="donor-email" class="form-input" required value="' + defEmail + '">',
      '        </div>',
      '        <div class="form-group">',
      '          <label class="form-label">Phone Number</label>',
      '          <input type="tel" id="donor-phone" class="form-input" value="' + defPhone + '">',
      '        </div>',
      '      </div>',
      '      <div class="form-group">',
      '        <label class="form-label">Permanent Account Number (PAN) - Required for 80G Tax Benefit</label>',
      '        <input type="text" id="donor-pan" class="form-input" placeholder="e.g. ABCDE1234F" maxlength="10" style="text-transform:uppercase;" value="' + defPan + '">',
      '        <p class="form-help">Mandatory under Income Tax Rule 18AB for generating 80G tax receipt and Form 10BD reporting.</p>',
      '      </div>',
      '      <div class="form-group">',
      '        <label class="form-label">Payment Mode</label>',
      '        <select id="donation-payment-method" class="form-select" onchange="window.SevaSetuApp.togglePaymentFields(this.value)">',
      '          <option value="UPI">Instant UPI (Google Pay, PhonePe, Paytm QR)</option>',
      '          <option value="CARD">Credit / Debit Card (Visa, RuPay, Mastercard)</option>',
      '          <option value="NETBANKING">Net Banking (HDFC, SBI, ICICI, Axis)</option>',
      '        </select>',
      '      </div>',
      '      <div id="payment-upi-section" class="upi-qr-box">',
      '        <div class="upi-qr-wrapper" id="modal-upi-qr-target"></div>',
      '        <div style="font-weight:700; font-size:0.9rem;">Scan to pay with any UPI App</div>',
      '        <div style="font-size:0.8rem; color:var(--text-muted);">UPI ID: <code>sevasetu@icici</code> (Simulated Sandbox)</div>',
      '      </div>',
      '      <div style="margin-bottom:20px;">',
      '        <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; cursor:pointer;">',
      '          <input type="checkbox" id="donor-anonymous-toggle"> Make contribution anonymous on public campaign leaderboard',
      '        </label>',
      '      </div>',
      '      <button type="submit" class="btn btn-primary" style="width:100%; padding:14px; font-size:1.05rem;">Confirm & Pay via Gateway</button>',
      '    </form>',
      '  </div>',
      '</div>'
    ].join('');

    modal.innerHTML = formHtml;
    modal.classList.add('active');

    // Generate UPI QR code
    var qrTarget = document.getElementById('modal-upi-qr-target');
    if (qrTarget && window.SevaSetuQR) {
      window.SevaSetuQR.renderTo(qrTarget, 'upi://pay?pa=sevasetu@icici&pn=SevaSetu&am=1000&cu=INR&tn=Donation', 150);
    }
  }

  function pickAmount(val, btn) {
    var inp = document.getElementById('custom-donation-amount');
    if (inp) inp.value = val;
    var pills = document.querySelectorAll('.amount-pill');
    pills.forEach(function(p) { p.classList.remove('selected'); });
    if (btn) btn.classList.add('selected');
    updateCalculatedDeduction();
  }

  function updateCalculatedDeduction() {
    var inp = document.getElementById('custom-donation-amount');
    var calc = document.getElementById('tax-savings-calc');
    var qrTarget = document.getElementById('modal-upi-qr-target');
    if (!inp || !calc) return;
    var val = Number(inp.value) || 0;
    var deduction = Math.round(val * 0.5);
    calc.textContent = '✓ Saves approx ₹' + deduction.toLocaleString('en-IN') + ' under Section 80G';

    if (qrTarget && window.SevaSetuQR) {
      window.SevaSetuQR.renderTo(qrTarget, 'upi://pay?pa=sevasetu@icici&pn=SevaSetu&am=' + val + '&cu=INR&tn=Donation', 150);
    }
  }

  function togglePaymentFields(method) {
    var upiSec = document.getElementById('payment-upi-section');
    if (upiSec) {
      upiSec.style.display = method === 'UPI' ? 'flex' : 'none';
    }
  }

  function processDonationSubmit(e, campaignId) {
    e.preventDefault();
    var amount = Number(document.getElementById('custom-donation-amount').value);
    if (!amount || amount < 100) {
      alert('Minimum donation amount is ₹100.');
      return;
    }

    var donorName = document.getElementById('donor-name').value;
    var donorEmail = document.getElementById('donor-email').value;
    var donorPhone = document.getElementById('donor-phone').value;
    var donorPan = document.getElementById('donor-pan').value;
    var paymentMethod = document.getElementById('donation-payment-method').value;
    var isAnonymous = document.getElementById('donor-anonymous-toggle').checked;

    if (donorPan && !store.validatePan(donorPan)) {
      alert('Please enter a valid 10-character Indian PAN (e.g. ABCDE1234F) to claim Section 80G tax benefits.');
      return;
    }

    try {
      var donation = store.createDonation({
        campaignId: campaignId,
        amount: amount,
        paymentMethod: paymentMethod,
        donorName: donorName,
        donorEmail: donorEmail,
        donorPhone: donorPhone,
        donorPan: donorPan,
        donorAddress: 'Karnataka, India',
        isAnonymous: isAnonymous
      });

      closeModal('donation-modal');
      viewOfficialReceipt(donation.billId);
    } catch (err) {
      alert('Error creating donation: ' + err.message);
    }
  }

  function showDonationSuccessModal(donation) {
    var modal = document.getElementById('donation-modal');
    if (!modal) return;

    var html = [
      '<div class="modal-card">',
      '  <div class="modal-header">',
      '    <h3 class="modal-title" style="color:var(--status-verified);">✓ Payment Successful</h3>',
      '    <button class="modal-close-btn" onclick="window.SevaSetuApp.closeModal(\'donation-modal\')">&times;</button>',
      '  </div>',
      '  <div class="modal-body" style="text-align:center;">',
      '    <div style="width:64px; height:64px; border-radius:50%; background:var(--status-verified-bg); color:var(--status-verified); display:flex; align-items:center; justify-content:center; font-size:2rem; margin:0 auto 16px;">✓</div>',
      '    <h4 style="font-size:1.3rem; margin-bottom:8px;">Thank You, ' + donation.donorName + '!</h4>',
      '    <p style="color:var(--text-secondary); margin-bottom:20px;">Your contribution of <strong>' + store.formatCurrency(donation.amount) + '</strong> has been deposited to <strong>' + donation.ngoName + '</strong>.</p>',
      '    <div style="background:var(--bg-surface-subtle); padding:16px; border-radius:var(--radius-md); text-align:left; font-size:0.9rem; margin-bottom:24px;">',
      '      <div><strong>Immutable Bill ID:</strong> <span class="vault-bill-id">' + donation.billId + '</span></div>',
      '      <div><strong>Receipt Number:</strong> ' + donation.receiptId + '</div>',
      '      <div><strong>Payment Reference:</strong> ' + donation.providerRef + '</div>',
      '      <div><strong>80G Deduction Eligible:</strong> ' + store.formatCurrency(donation.taxDeductionClaimed) + '</div>',
      '    </div>',
      '    <div style="display:flex; gap:12px; justify-content:center;">',
      '      <button class="btn btn-primary" onclick="window.SevaSetuApp.viewOfficialReceipt(\'' + donation.billId + '\')">Download 80G Tax Receipt</button>',
      '      <button class="btn btn-secondary" onclick="window.SevaSetuApp.switchSection(\'vault\'); window.SevaSetuApp.closeModal(\'donation-modal\');">Open Bill Vault</button>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');

    modal.innerHTML = html;
    modal.classList.add('active');
  }

  // 2. Official 80G Tax Receipt Viewer
  function viewOfficialReceipt(billId) {
    var donation = store.state.donations.find(function(d) { return d.billId === billId; });
    if (!donation) {
      alert('Donation record not found.');
      return;
    }

    var modal = document.getElementById('receipt-modal');
    if (!modal) return;

    var html = [
      '<div class="modal-card print-only-target" style="max-width:800px; overflow:hidden;">',
      '  <div class="printer-slot-bar no-print">',
      '    <div style="display:flex; align-items:center; gap:8px;">',
      '      <div class="printer-led"></div>',
      '      <span style="color:#94a3b8; font-size:0.75rem; font-family:monospace; font-weight:700;">SEVASETU THERMAL SLIP PRINTER • MODEL 80G-SEC5</span>',
      '    </div>',
      '    <span class="verified-stamp-seal" style="animation-delay:0.8s;">80G VERIFIED</span>',
      '  </div>',
      '  <div class="modal-header no-print">',
      '    <h3 class="modal-title">Official Section 80G Donation Receipt</h3>',
      '    <div style="display:flex; gap:10px;">',
      '      <button class="btn btn-primary btn-sm" onclick="window.print()">Print / Save PDF</button>',
      '      <button class="modal-close-btn" onclick="window.SevaSetuApp.closeModal(\'receipt-modal\')">&times;</button>',
      '    </div>',
      '  </div>',
      '  <div class="modal-body" style="background:#f1f5f9; padding:20px;">',
      '    <div class="receipt-slip-animated">',
      '      <div class="printer-laser-line"></div>',
      '      <div class="official-receipt-doc">',
      '      <div class="receipt-watermark">Section 80G Tax Exemption Certificate • Government of India IT Act, 1961</div>',
      '      <div class="receipt-header-table">',
      '        <div class="receipt-ngo-title">' + donation.ngoName + '</div>',
      '        <div class="receipt-statutory-row">PAN: <strong>' + donation.ngoPan + '</strong> | 80G Approval: <strong>' + donation.ngo80GOrder + '</strong></div>',
      '        <div class="receipt-statutory-row">Platform Partner: SevaSetu Digital Giving Bridge (UID: SETU-IND-2026)</div>',
      '      </div>',
      '      <table class="receipt-table">',
      '        <tr><td class="header-cell">Receipt Number:</td><td><strong>' + donation.receiptId + '</strong></td></tr>',
      '        <tr><td class="header-cell">Immutable Bill ID:</td><td><strong>' + donation.billId + '</strong></td></tr>',
      '        <tr><td class="header-cell">Date of Realization:</td><td>' + store.formatDate(donation.timestamp) + '</td></tr>',
      '        <tr><td class="header-cell">Donor Name:</td><td><strong>' + donation.donorName + '</strong></td></tr>',
      '        <tr><td class="header-cell">Donor PAN:</td><td><strong>' + donation.donorPan + '</strong></td></tr>',
      '        <tr><td class="header-cell">Amount Contributed:</td><td><strong style="font-size:1.1rem;">' + store.formatCurrency(donation.amount) + '</strong></td></tr>',
      '        <tr><td class="header-cell">Eligible 80G Deduction (50%):</td><td><strong>' + store.formatCurrency(donation.taxDeductionClaimed) + '</strong></td></tr>',
      '        <tr><td class="header-cell">Mode of Contribution:</td><td>' + donation.paymentMethod + ' (Ref: ' + donation.providerRef + ')</td></tr>',
      '        <tr><td class="header-cell">Cause / Campaign:</td><td>' + donation.campaignTitle + '</td></tr>',
      '      </table>',
      '      <div class="receipt-footer-grid">',
      '        <div id="receipt-qr-code-box" style="width:120px; height:120px;"></div>',
      '        <div style="font-size:0.75rem; color:#475569; line-height:1.4;">',
      '          <strong>Statutory Compliance Note:</strong><br>',
      '          This receipt qualifies for 50% deduction under Section 80G of the Income Tax Act, 1961. This transaction is reconciled and queued for official Form 10BD annual reporting with the Director of Income Tax (Exemption). Scan the signed QR code to verify validity.',
      '        </div>',
      '        <div style="text-align:center;">',
      '          <div style="font-family:\'Brush Script MT\', cursive, serif; font-size:1.8rem; color:#107361;">Ananya H.</div>',
      '          <div style="font-size:0.8rem; font-weight:bold; border-top:1px solid #000; padding-top:4px;">Authorized Signatory</div>',
      '          <div style="font-size:0.7rem; color:#64748b;">' + donation.ngoName + '</div>',
      '        </div>',
      '      </div>',
      '    </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');

    modal.innerHTML = html;
    modal.classList.add('active');

    // Render verification QR
    var qrBox = document.getElementById('receipt-qr-code-box');
    if (qrBox && window.SevaSetuQR) {
      window.SevaSetuQR.renderTo(qrBox, donation.qrVerificationUrl, 120);
    }
  }

  // 3. Volunteer Certificate Viewer
  function viewVolunteerCertificate(recordId) {
    var rec = store.state.volunteerRecords.find(function(r) { return r.recordId === recordId; });
    if (!rec) return;

    var modal = document.getElementById('receipt-modal');
    if (!modal) return;

    var html = [
      '<div class="modal-card print-only-target" style="max-width:800px;">',
      '  <div class="modal-header no-print">',
      '    <h3 class="modal-title">Verified Certificate of Volunteering</h3>',
      '    <div style="display:flex; gap:10px;">',
      '      <button class="btn btn-primary btn-sm" onclick="window.print()">Print / Save PDF</button>',
      '      <button class="modal-close-btn" onclick="window.SevaSetuApp.closeModal(\'receipt-modal\')">&times;</button>',
      '    </div>',
      '  </div>',
      '  <div class="modal-body" style="background:#f1f5f9; padding:24px;">',
      '    <div class="certificate-animated-card">',
      '      <div class="official-receipt-doc" style="border: 4px double #107361; text-align:center; background:#ffffff; box-shadow:0 12px 30px rgba(0,0,0,0.08); padding:32px;">',
      '        <div style="font-size:0.85rem; text-transform:uppercase; letter-spacing:2px; color:#107361; font-weight:bold;">SevaSetu Verified Community Service</div>',
      '        <h2 style="font-size:2.2rem; font-family:serif; color:#162836; margin:16px 0 8px;">Certificate of Volunteering</h2>',
      '        <p style="font-size:1rem; color:#475569; font-style:italic;">This is proudly presented to</p>',
      '        <h3 style="font-size:1.8rem; color:#107361; margin:10px 0; border-bottom:2px solid #cbd5e1; display:inline-block; padding:0 30px;">' + rec.volunteerName + '</h3>',
      '        <p style="font-size:1rem; color:#334155; max-width:600px; margin:16px auto; line-height:1.6;">',
      '          In recognition of dedicated civic service for completing <strong>' + rec.hoursLogged + ' hours</strong> of verified on-ground service with <strong>' + rec.ngoName + '</strong> in the initiative <em>"' + rec.opportunityTitle + '"</em> on <strong>' + rec.sessionDate + '</strong>.',
      '        </p>',
      '        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:36px; padding-top:20px; border-top:1px solid #cbd5e1;">',
      '          <div id="cert-qr-code-box" style="width:100px; height:100px;"></div>',
      '          <div class="cert-gold-emblem" style="text-align:center;">',
      '            <div style="width:52px; height:52px; border-radius:50%; background:linear-gradient(135deg, #f59e0b 0%, #b45309 100%); margin:0 auto; display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.4rem; box-shadow:0 4px 12px rgba(217, 119, 6, 0.4); border:2px solid #fef3c7;">★</div>',
      '            <div style="font-size:0.68rem; font-weight:bold; color:#b45309; margin-top:4px; letter-spacing:1px;">GOLD SEAL VERIFIED</div>',
      '          </div>',
      '          <div>',
      '            <div style="font-size:0.85rem; font-weight:bold;">Certificate ID: ' + rec.certificateId + '</div>',
      '            <div style="font-size:0.75rem; color:#64748b;">Digitally verified via SevaSetu Attendance Protocol</div>',
      '          </div>',
      '          <div>',
      '            <svg width="110" height="28" viewBox="0 0 110 28" fill="none" style="display:block; margin:0 auto 2px;">',
      '              <path class="signature-svg-line" d="M5 20 Q 20 4, 35 16 T 60 10 T 85 18 T 105 12" stroke="#107361" stroke-width="2.2" stroke-linecap="round"/>',
      '            </svg>',
      '            <div style="font-size:0.8rem; font-weight:bold; border-top:1px solid #000; padding-top:2px;">' + (rec.approvedBy || 'Field Lead & Reviewer') + '</div>',
      '          </div>',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');

    modal.innerHTML = html;
    modal.classList.add('active');

    var qrBox = document.getElementById('cert-qr-code-box');
    if (qrBox && window.SevaSetuQR) {
      window.SevaSetuQR.renderTo(qrBox, rec.qrVerificationUrl, 100);
    }
  }

  // 4. Campaign Details & Fund Allocation Modal
  function openCampaignDetails(campaignId) {
    var c = store.state.campaigns.find(function(x) { return x.id === campaignId; });
    if (!c) return;

    var modal = document.getElementById('general-modal');
    if (!modal) return;

    var percent = Math.min(100, Math.round((c.raisedAmount / c.goalAmount) * 100));

    var html = [
      '<div class="modal-card" style="max-width:760px;">',
      '  <div class="modal-header">',
      '    <div>',
      '      <span class="badge-tag">' + c.category + '</span>',
      '      <h3 class="modal-title" style="margin-top:4px;">' + c.title + '</h3>',
      '    </div>',
      '    <button class="modal-close-btn" onclick="window.SevaSetuApp.closeModal(\'general-modal\')">&times;</button>',
      '  </div>',
      '  <div class="modal-body">',
      '    <p style="font-size:0.95rem; color:var(--text-secondary); line-height:1.6; margin-bottom:24px;">' + c.fullDesc + '</p>',
      '    <h4 style="font-size:1.1rem; font-weight:700; margin-bottom:12px; color:var(--text-primary);">Audited Fund Allocation Ledger</h4>',
      '    <div style="background:var(--bg-surface-subtle); padding:16px; border-radius:var(--radius-md); margin-bottom:24px;">',
      c.fundAllocation.map(function(item) {
        return [
          '<div class="allocation-item">',
          '  <div class="allocation-header">',
          '    <span>' + item.category + ' (' + item.percent + '%)</span>',
          '    <strong>' + store.formatCurrency(item.amount) + '</strong>',
          '  </div>',
          '  <div class="progress-track"><div class="progress-fill" style="width:' + item.percent + '%;"></div></div>',
          '</div>'
        ].join('');
      }).join(''),
      '    </div>',
      '    <h4 style="font-size:1.1rem; font-weight:700; margin-bottom:12px; color:var(--text-primary);">Real-Time Field Milestones</h4>',
      '    <div style="margin-bottom:24px;">',
      c.milestones.map(function(m) {
        var isDone = m.status === 'COMPLETED';
        return [
          '<div style="display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--border-light);">',
          '  <div style="width:24px; height:24px; border-radius:50%; background:' + (isDone ? 'var(--status-verified)' : 'var(--border-medium)') + '; color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:bold;">' + (isDone ? '✓' : '•') + '</div>',
          '  <div style="flex:1;">',
          '    <div style="font-weight:600; font-size:0.9rem;">' + m.title + '</div>',
          '    <div style="font-size:0.8rem; color:var(--text-muted);">' + m.target + ' • ' + m.date + '</div>',
          '  </div>',
          '  <span class="' + (isDone ? 'verified-pill' : 'badge-tag') + '">' + m.status + '</span>',
          '</div>'
        ].join('');
      }).join(''),
      '    </div>',
      '    <h4 style="font-size:1.1rem; font-weight:700; margin-bottom:12px; color:var(--text-primary);">Field Updates & Beneficiary Media</h4>',
      '    <div>',
      c.impactUpdates.map(function(u) {
        return [
          '<div style="background:var(--bg-surface-subtle); padding:14px; border-radius:var(--radius-md); margin-bottom:10px;">',
          '  <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:700; color:var(--brand-teal);">',
          '    <span>' + u.title + '</span>',
          '    <span style="color:var(--text-muted);">' + u.date + '</span>',
          '  </div>',
          '  <p style="font-size:0.85rem; color:var(--text-secondary); margin:6px 0;">' + u.text + '</p>',
          '  <div style="font-size:0.75rem; color:var(--text-muted);">Verified by: ' + u.author + '</div>',
          '</div>'
        ].join('');
      }).join(''),
      '    </div>',
      '  </div>',
      '  <div class="modal-footer">',
      '    <button class="btn btn-secondary" onclick="window.SevaSetuApp.closeModal(\'general-modal\')">Close</button>',
      '    <button class="btn btn-primary" onclick="window.SevaSetuApp.closeModal(\'general-modal\'); window.SevaSetuApp.openDonationModal(\'' + c.id + '\');">Donate to This Cause</button>',
      '  </div>',
      '</div>'
    ].join('');

    modal.innerHTML = html;
    modal.classList.add('active');
  }

  // 5. Volunteer Check-In Modal
  function openVolunteerCheckInModal(oppId) {
    var opp = store.state.volunteerOpportunities.find(function(o) { return o.id === oppId; });
    if (!opp) return;

    var modal = document.getElementById('general-modal');
    if (!modal) return;

    var html = [
      '<div class="modal-card">',
      '  <div class="modal-header">',
      '    <h3 class="modal-title">Volunteer Session Check-In</h3>',
      '    <button class="modal-close-btn" onclick="window.SevaSetuApp.closeModal(\'general-modal\')">&times;</button>',
      '  </div>',
      '  <div class="modal-body">',
      '    <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:16px;">',
      '      Checking in to: <strong>' + opp.title + '</strong> (' + opp.ngoName + ')',
      '    </p>',
      '    <form onsubmit="window.SevaSetuApp.submitCheckIn(event, \'' + opp.id + '\')">',
      '      <div class="form-group">',
      '        <label class="form-label">Enter 6-Character Attendance Code</label>',
      '        <input type="text" id="checkin-code-input" class="form-input" style="font-family:var(--font-mono); font-size:1.5rem; text-align:center; letter-spacing:4px; text-transform:uppercase;" placeholder="SETU-XXXX" required maxlength="9">',
      '        <p class="form-help">Ask your on-ground Field Lead (' + (opp.leadName || 'Lead') + ') for the active code.</p>',
      '      </div>',
      '      <div class="form-group">',
      '        <label class="form-label">Volunteer Full Name</label>',
      '        <input type="text" id="checkin-name-input" class="form-input" value="' + (store.state.currentUser ? store.state.currentUser.name : 'Arjun Verma') + '" required>',
      '      </div>',
      '      <div class="form-group">',
      '        <label class="form-label">Volunteer Email</label>',
      '        <input type="email" id="checkin-email-input" class="form-input" value="' + (store.state.currentUser ? store.state.currentUser.email : 'volunteer@sevasetu.org') + '" required>',
      '      </div>',
      '      <button type="submit" class="btn btn-primary" style="width:100%; padding:12px;">Confirm Arrival & Check In</button>',
      '    </form>',
      '  </div>',
      '</div>'
    ].join('');

    modal.innerHTML = html;
    modal.classList.add('active');
  }

  function submitCheckIn(e, oppId) {
    e.preventDefault();
    var code = document.getElementById('checkin-code-input').value;
    var name = document.getElementById('checkin-name-input').value;
    var email = document.getElementById('checkin-email-input').value;

    try {
      var record = store.checkInVolunteer(oppId, code, name, email);
      closeModal('general-modal');
      showToast('Checked in successfully at ' + record.checkInTime);
      switchSection('volunteers');
      setTimeout(function() {
        switchVolTab('records');
      }, 100);
    } catch (err) {
      alert(err.message);
    }
  }

  function triggerCheckOut(recordId) {
    try {
      store.checkOutVolunteer(recordId);
      showToast('Checked out! Awaiting Field Lead approval.');
      renderCurrentSection();
    } catch (err) {
      alert(err.message);
    }
  }

  // 6. Field Lead Approval Modal
  function openApproveHoursModal(recordId, hours) {
    var modal = document.getElementById('general-modal');
    if (!modal) return;

    var html = [
      '<div class="modal-card">',
      '  <div class="modal-header">',
      '    <h3 class="modal-title">Sign Off Volunteer Service Hours</h3>',
      '    <button class="modal-close-btn" onclick="window.SevaSetuApp.closeModal(\'general-modal\')">&times;</button>',
      '  </div>',
      '  <div class="modal-body">',
      '    <form onsubmit="window.SevaSetuApp.submitLeadApproval(event, \'' + recordId + '\')">',
      '      <div class="form-group">',
      '        <label class="form-label">Verified Service Hours to Credit</label>',
      '        <input type="number" id="approve-hours-input" class="form-input" value="' + hours + '" step="0.5" min="0.5" required>',
      '      </div>',
      '      <div class="form-group">',
      '        <label class="form-label">Field Lead Review Note</label>',
      '        <textarea id="approve-notes-input" class="form-textarea" rows="3" required placeholder="Describe task completion, hygiene adherence, and contribution...">Punctual attendance, completed all assigned activity objectives successfully.</textarea>',
      '      </div>',
      '      <button type="submit" class="btn btn-primary" style="width:100%; padding:12px;">Approve & Issue Certificate of Volunteering</button>',
      '    </form>',
      '  </div>',
      '</div>'
    ].join('');

    modal.innerHTML = html;
    modal.classList.add('active');
  }

  function submitLeadApproval(e, recordId) {
    e.preventDefault();
    var hours = document.getElementById('approve-hours-input').value;
    var notes = document.getElementById('approve-notes-input').value;

    try {
      var record = store.approveVolunteerHours(recordId, hours, notes);
      closeModal('general-modal');
      renderCurrentSection();
      viewVolunteerCertificate(record.recordId);
    } catch (err) {
      alert(err.message);
    }
  }

  // 7. NGO Statutory Modal
  function showNgoStatutoryModal(ngoId) {
    var ngo = store.state.ngos.find(function(n) { return n.id === ngoId; });
    if (!ngo) return;

    var modal = document.getElementById('general-modal');
    if (!modal) return;

    var html = [
      '<div class="modal-card">',
      '  <div class="modal-header">',
      '    <h3 class="modal-title">Statutory Verification Dossier: ' + ngo.name + '</h3>',
      '    <button class="modal-close-btn" onclick="window.SevaSetuApp.closeModal(\'general-modal\')">&times;</button>',
      '  </div>',
      '  <div class="modal-body">',
      '    <div style="background:var(--bg-surface-subtle); padding:16px; border-radius:var(--radius-md); font-size:0.9rem; line-height:1.8;">',
      '      <div><strong>Legal Name:</strong> ' + ngo.name + '</div>',
      '      <div><strong>NITI Aayog NGO Darpan UID:</strong> <code>' + ngo.darpanId + '</code> (Active)</div>',
      '      <div><strong>Statutory PAN:</strong> <code>' + ngo.pan + '</code></div>',
      '      <div><strong>Section 12A Registration:</strong> <code>' + ngo.reg12A + '</code></div>',
      '      <div><strong>Section 80G Order Number:</strong> <code>' + ngo.sec80G + '</code></div>',
      '      <div><strong>FCRA Compliance:</strong> ' + ngo.fcraStatus + '</div>',
      '      <div><strong>Bank Escrow Account:</strong> ' + ngo.bankDetails.bankName + ' (' + ngo.bankDetails.accountNo + ')</div>',
      '      <div><strong>Last Platform Audit:</strong> ' + (ngo.verifiedDate || 'Recent') + '</div>',
      '    </div>',
      '    <p style="font-size:0.8rem; color:var(--text-muted); margin-top:16px;">',
      '      All copies of 12A, 80G certificates and Trust Deeds are cross-inspected and verified by SevaSetu platform reviewers as part of the launch checklist.',
      '    </p>',
      '  </div>',
      '</div>'
    ].join('');

    modal.innerHTML = html;
    modal.classList.add('active');
  }

  // 8. Launch New Campaign Modal (NGO Admin)
  function openNewCampaignModal() {
    var modal = document.getElementById('general-modal');
    if (!modal) return;

    var html = [
      '<div class="modal-card" style="max-width:650px;">',
      '  <div class="modal-header">',
      '    <h3 class="modal-title">Launch New Verified Campaign</h3>',
      '    <button class="modal-close-btn" onclick="window.SevaSetuApp.closeModal(\'general-modal\')">&times;</button>',
      '  </div>',
      '  <div class="modal-body">',
      '    <form onsubmit="window.SevaSetuApp.submitNewCampaign(event)">',
      '      <div class="form-group">',
      '        <label class="form-label">Campaign Title</label>',
      '        <input type="text" id="new-cmp-title" class="form-input" required placeholder="e.g. Winter Warmth Blankets for 1,000 Families">',
      '      </div>',
      '      <div class="form-group">',
      '        <label class="form-label">Cause Category</label>',
      '        <select id="new-cmp-category" class="form-select">',
      '          <option value="Education & Nutrition">Education & Nutrition</option>',
      '          <option value="Healthcare">Healthcare</option>',
      '          <option value="Environment & Climate">Environment & Climate</option>',
      '          <option value="Disaster Relief & Rural Welfare">Disaster Relief & Rural Welfare</option>',
      '        </select>',
      '      </div>',
      '      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">',
      '        <div class="form-group">',
      '          <label class="form-label">Fundraising Goal (INR)</label>',
      '          <input type="number" id="new-cmp-goal" class="form-input" required min="10000" placeholder="e.g. 500000">',
      '        </div>',
      '        <div class="form-group">',
      '          <label class="form-label">Duration (Days)</label>',
      '          <input type="number" id="new-cmp-days" class="form-input" value="30" min="5">',
      '        </div>',
      '      </div>',
      '      <div class="form-group">',
      '        <label class="form-label">Short Summary</label>',
      '        <input type="text" id="new-cmp-short" class="form-input" required placeholder="Brief 1-line impact statement...">',
      '      </div>',
      '      <div class="form-group">',
      '        <label class="form-label">Full Narrative & Beneficiary Safeguards</label>',
      '        <textarea id="new-cmp-full" class="form-textarea" rows="3" required placeholder="Explain procurement, operations, logistics, and verification..."></textarea>',
      '      </div>',
      '      <div class="form-group">',
      '        <label style="display:flex; align-items:center; gap:8px; font-size:0.9rem;">',
      '          <input type="checkbox" id="new-cmp-80g" checked> Grant Section 80G Tax Deductibility for Donors',
      '        </label>',
      '      </div>',
      '      <button type="submit" class="btn btn-primary" style="width:100%; padding:12px;">Submit Campaign for Publication</button>',
      '    </form>',
      '  </div>',
      '</div>'
    ].join('');

    modal.innerHTML = html;
    modal.classList.add('active');
  }

  function submitNewCampaign(e) {
    e.preventDefault();
    var title = document.getElementById('new-cmp-title').value;
    var category = document.getElementById('new-cmp-category').value;
    var goal = document.getElementById('new-cmp-goal').value;
    var days = document.getElementById('new-cmp-days').value;
    var shortDesc = document.getElementById('new-cmp-short').value;
    var fullDesc = document.getElementById('new-cmp-full').value;
    var is80G = document.getElementById('new-cmp-80g').checked;

    try {
      var cmp = store.createCampaign({
        ngoId: store.state.ngos[0].id,
        title: title,
        category: category,
        goalAmount: goal,
        daysLeft: days,
        shortDesc: shortDesc,
        fullDesc: fullDesc,
        is80GEligible: is80G
      });

      closeModal('general-modal');
      showToast('Campaign "' + cmp.title + '" published successfully!');
      switchSection('campaigns');
    } catch (err) {
      alert(err.message);
    }
  }

  // Helper actions
  function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  function switchVolTab(tabId) {
    var oppsBtn = document.getElementById('tab-vol-opps');
    var recsBtn = document.getElementById('tab-vol-records');
    var area = document.getElementById('vol-content-area');
    if (!area) return;

    if (tabId === 'opps') {
      if (oppsBtn) oppsBtn.classList.add('active');
      if (recsBtn) recsBtn.classList.remove('active');
      area.innerHTML = renderVolOppsTab(store.state.volunteerOpportunities);
    } else {
      if (recsBtn) recsBtn.classList.add('active');
      if (oppsBtn) oppsBtn.classList.remove('active');
      area.innerHTML = renderVolRecordsTab();
    }
  }

  function generateSessionCode(oppId) {
    try {
      store.generateFieldSessionCode(oppId);
      showToast('Generated 10-minute session code!');
      renderCurrentSection();
    } catch (err) {
      alert(err.message);
    }
  }

  function revokeSessionCode(oppId) {
    try {
      store.revokeFieldSessionCode(oppId);
      showToast('Session code revoked.');
      renderCurrentSection();
    } catch (err) {
      alert(err.message);
    }
  }

  function adminReviewNgo(ngoId, decision) {
    try {
      store.reviewNgoStatus(ngoId, decision, 'Platform reviewer signed off verification compliance.');
      showToast('Updated NGO verification status to ' + decision);
      renderCurrentSection();
    } catch (err) {
      alert(err.message);
    }
  }

  function triggerManualVerify() {
    var inp = document.getElementById('verify-search-input');
    if (inp) runVerificationLookup(inp.value);
  }

  function filterCampaigns() {
    var query = (document.getElementById('campaign-search-input').value || '').toLowerCase();
    var filtered = store.state.campaigns.filter(function(c) {
      return c.title.toLowerCase().indexOf(query) !== -1 ||
             c.ngoName.toLowerCase().indexOf(query) !== -1 ||
             c.category.toLowerCase().indexOf(query) !== -1;
    });
    var container = document.getElementById('campaigns-grid-container');
    if (container) container.innerHTML = renderCampaignCards(filtered);
  }

  function setCampaignCategory(category, btn) {
    var chips = document.querySelectorAll('.filter-chip');
    chips.forEach(function(c) { c.classList.remove('active'); });
    if (btn) btn.classList.add('active');

    var filtered = category === 'ALL'
      ? store.state.campaigns
      : store.state.campaigns.filter(function(c) { return c.category === category; });

    var container = document.getElementById('campaigns-grid-container');
    if (container) container.innerHTML = renderCampaignCards(filtered);
  }

  function filterVault() {
    var query = (document.getElementById('vault-search-input').value || '').toLowerCase();
    var filtered = store.state.donations.filter(function(d) {
      return d.billId.toLowerCase().indexOf(query) !== -1 ||
             d.ngoName.toLowerCase().indexOf(query) !== -1 ||
             d.campaignTitle.toLowerCase().indexOf(query) !== -1;
    });
    var container = document.getElementById('vault-table-container');
    if (container) container.innerHTML = renderVaultTable(filtered);
  }

  function exportForm10Bd() {
    var rows = [
      ['Unique ID Type', 'Donor PAN', 'Donor Name', 'Address', 'Donation Amount (INR)', 'Receipt Number', 'Date of Donation', 'Section Code']
    ];
    store.state.donations.forEach(function(d) {
      if (d.is80GEligible) {
        rows.push([
          'PAN',
          d.donorPan,
          d.donorName,
          d.donorAddress || 'India',
          d.amount,
          d.receiptId,
          d.timestamp.split('T')[0],
          'Section 80G'
        ]);
      }
    });

    var csvContent = 'data:text/csv;charset=utf-8,' + rows.map(function(e) { return e.join(','); }).join('\n');
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'SevaSetu_Form10BD_Export_' + new Date().toISOString().split('T')[0] + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Form 10BD CSV Statement exported.');
  }

  function showToast(msg) {
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<span>⚡</span> ' + msg;
    var container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    container.appendChild(toast);
    setTimeout(function() {
      toast.remove();
    }, 3500);
  }

  // Legal Modal Openers
  function openLegalModal(type) {
    var modal = document.getElementById('general-modal');
    if (!modal) return;

    var title = 'Platform Policies';
    var content = '';

    if (type === 'privacy') {
      title = 'Privacy & Statutory Data Policy';
      content = [
        '<p><strong>1. Data Minimization & Statutory Mandate:</strong> SevaSetu collects donor identity details and PAN solely to satisfy statutory verification and Form 10BD reporting requirements under Rule 18AB of the Indian Income Tax Act.</p>',
        '<p><strong>2. Access Control:</strong> PAN data is masked by default in all customer-facing screens. Only authorized auditors and statutory reviewers possess restricted access.</p>',
        '<p><strong>3. Public QR Verification:</strong> Scanned verification tokens expose only minimal authenticity confirmations and do not leak unmasked donor credentials.</p>'
      ].join('');
    } else if (type === 'terms') {
      title = 'Terms of Platform Service';
      content = [
        '<p><strong>1. Role of SevaSetu:</strong> SevaSetu is an audited digital giving and transparency bridge connecting contributors with verified non-governmental organizations.</p>',
        '<p><strong>2. Disclaimers:</strong> SevaSetu does not claim government sponsorship or representation. All 80G benefits are governed by the Income Tax Department of India.</p>',
        '<p><strong>3. Tamper-evident Records:</strong> All generated Bill IDs are immutable and cryptographically auditable.</p>'
      ].join('');
    } else if (type === 'cookies') {
      title = 'Cookie & Tracking Preferences';
      content = [
        '<p>We use essential cookies strictly necessary for maintaining authenticated sessions and preserving security tokens.</p>',
        '<label style="display:block; margin:10px 0;"><input type="checkbox" checked disabled> Essential Security Cookies (Always Active)</label>',
        '<label style="display:block; margin:10px 0;"><input type="checkbox" id="pref-analytics" checked> Performance & Error Telemetry</label>',
        '<label style="display:block; margin:10px 0;"><input type="checkbox" id="pref-marketing"> Marketing Communications (Optional - Off by Default)</label>',
        '<button class="btn btn-primary btn-sm" style="margin-top:14px;" onclick="window.SevaSetuApp.saveCookiePrefs()">Save Preferences</button>'
      ].join('');
    } else if (type === 'refunds') {
      title = 'Donation & Refund Policy';
      content = [
        '<p>Charitable contributions processed through SevaSetu are direct donations to verified NGOs. If a technical error or duplicate transaction occurs, refund requests may be lodged with the Bill ID within 7 business days.</p>',
        '<p>Note: Once an official 80G tax certificate has been finalized and queued for Form 10BD filing, cancellations require statutory rectification.</p>'
      ].join('');
    }

    var html = [
      '<div class="modal-card">',
      '  <div class="modal-header">',
      '    <h3 class="modal-title">' + title + '</h3>',
      '    <button class="modal-close-btn" onclick="window.SevaSetuApp.closeModal(\'general-modal\')">&times;</button>',
      '  </div>',
      '  <div class="modal-body" style="font-size:0.95rem; line-height:1.7; color:var(--text-secondary);">' + content + '</div>',
      '</div>'
    ].join('');

    modal.innerHTML = html;
    modal.classList.add('active');
  }

  function saveCookiePrefs() {
    closeModal('general-modal');
    showToast('Cookie preferences updated.');
  }

  // Authentication Modals & Handlers
  function openLoginModal(prefillEmail, prefillPass) {
    var modal = document.getElementById('auth-modal');
    if (!modal) return;

    var emailVal = prefillEmail || '';
    var passVal = prefillPass || '';

    modal.innerHTML = [
      '<div class="modal-card" style="max-width:500px;">',
      '  <div class="modal-header">',
      '    <h3 class="modal-title">Sign In to SevaSetu</h3>',
      '    <button class="modal-close-btn" onclick="window.SevaSetuApp.closeModal(\'auth-modal\')">&times;</button>',
      '  </div>',
      '  <div class="modal-body">',
      '    <div class="demo-accounts-box">',
      '      <div style="font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:4px;">1-Click Role Login (Demo):</div>',
      '      <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:8px;">Click any role below to pre-fill credentials from CREDENTIALS.md:</div>',
      '      <div style="display:flex; flex-wrap:wrap; gap:6px;">',
      '        <button type="button" class="demo-account-chip" onclick="window.SevaSetuApp.fillLogin(\'admin@sevasetu.org\', \'Admin@SevaSetu2026\')">🛡️ Admin</button>',
      '        <button type="button" class="demo-account-chip" onclick="window.SevaSetuApp.fillLogin(\'ngo@akshayaseva.org\', \'Ngo@Akshaya2026\')">🏛️ NGO</button>',
      '        <button type="button" class="demo-account-chip" onclick="window.SevaSetuApp.fillLogin(\'lead@sevasetu.org\', \'Lead@Field2026\')">⚡ Lead</button>',
      '        <button type="button" class="demo-account-chip" onclick="window.SevaSetuApp.fillLogin(\'volunteer@sevasetu.org\', \'Volunteer@2026\')">🤝 Volunteer</button>',
      '        <button type="button" class="demo-account-chip" onclick="window.SevaSetuApp.fillLogin(\'donor@sevasetu.org\', \'Donor@2026\')">💳 Donor</button>',
      '      </div>',
      '    </div>',
      '    <div id="login-error-msg" style="display:none; padding:10px; background:var(--status-alert-bg); color:var(--status-alert); border-radius:var(--radius-sm); font-size:0.85rem; margin-bottom:14px;"></div>',
      '    <form onsubmit="window.SevaSetuApp.handleLoginSubmit(event)">',
      '      <div class="form-group">',
      '        <label class="form-label">Email or Username</label>',
      '        <input type="text" id="login-email-input" class="form-input" required value="' + emailVal + '" placeholder="e.g. admin@sevasetu.org">',
      '      </div>',
      '      <div class="form-group">',
      '        <label class="form-label">Password</label>',
      '        <input type="password" id="login-password-input" class="form-input" required value="' + passVal + '" placeholder="••••••••••••">',
      '      </div>',
      '      <button type="submit" class="btn btn-primary" style="width:100%; padding:12px; font-size:1rem;">Sign In</button>',
      '    </form>',
      '    <div style="text-align:center; margin-top:20px; font-size:0.85rem; color:var(--text-secondary);">',
      '      New to SevaSetu? <a href="javascript:void(0)" onclick="window.SevaSetuApp.openRegisterModal()" style="font-weight:600;">Create an Account</a>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');

    modal.classList.add('active');
  }

  function fillLogin(email, pass) {
    var emailInp = document.getElementById('login-email-input');
    var passInp = document.getElementById('login-password-input');
    if (emailInp) emailInp.value = email;
    if (passInp) passInp.value = pass;
  }

  function quickLogin(email, pass) {
    var res = store.login(email, pass);
    if (res.success) {
      closeModal('auth-modal');
      showToast('Welcome, ' + res.user.name + ' (' + res.user.role.replace('_', ' ').toUpperCase() + ')');
      redirectPostLogin(res.user.role);
    } else {
      alert(res.error);
    }
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    var email = document.getElementById('login-email-input').value;
    var pass = document.getElementById('login-password-input').value;
    var errBox = document.getElementById('login-error-msg');

    var res = store.login(email, pass);
    if (!res.success) {
      if (errBox) {
        errBox.textContent = res.error;
        errBox.style.display = 'block';
      } else {
        alert(res.error);
      }
      return;
    }

    closeModal('auth-modal');
    showToast('Signed in successfully as ' + res.user.name);
    redirectPostLogin(res.user.role);
  }

  function redirectPostLogin(role) {
    updateNavLinks();
    if (role === 'platform_admin') navigate('/platform-admin');
    else if (role === 'ngo_admin') navigate('/ngo-admin');
    else if (role === 'field_lead') navigate('/field-lead');
    else if (role === 'volunteer') navigate('/volunteer');
    else navigate('/vault');
  }

  function openRegisterModal() {
    var modal = document.getElementById('auth-modal');
    if (!modal) return;

    modal.innerHTML = [
      '<div class="modal-card" style="max-width:540px;">',
      '  <div class="modal-header">',
      '    <h3 class="modal-title">Create a SevaSetu Account</h3>',
      '    <button class="modal-close-btn" onclick="window.SevaSetuApp.closeModal(\'auth-modal\')">&times;</button>',
      '  </div>',
      '  <div class="modal-body">',
      '    <div id="register-error-msg" style="display:none; padding:10px; background:var(--status-alert-bg); color:var(--status-alert); border-radius:var(--radius-sm); font-size:0.85rem; margin-bottom:14px;"></div>',
      '    <form onsubmit="window.SevaSetuApp.handleRegisterSubmit(event)">',
      '      <div class="form-group">',
      '        <label class="form-label">Full Name</label>',
      '        <input type="text" id="reg-name-input" class="form-input" required placeholder="e.g. Anjali Nair">',
      '      </div>',
      '      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">',
      '        <div class="form-group">',
      '          <label class="form-label">Email Address</label>',
      '          <input type="email" id="reg-email-input" class="form-input" required placeholder="name@example.com">',
      '        </div>',
      '        <div class="form-group">',
      '          <label class="form-label">Phone Number</label>',
      '          <input type="tel" id="reg-phone-input" class="form-input" placeholder="+91 98765 00000">',
      '        </div>',
      '      </div>',
      '      <div class="form-group">',
      '        <label class="form-label">Password</label>',
      '        <input type="password" id="reg-password-input" class="form-input" required placeholder="Minimum 6 characters" minlength="6">',
      '      </div>',
      '      <div class="form-group">',
      '        <label class="form-label">Account Role</label>',
      '        <select id="reg-role-input" class="form-select">',
      '          <option value="donor">Donor / Contributor (Instant 80G Tax Exemption Receipts)</option>',
      '          <option value="volunteer">Civic Volunteer (On-ground & Digital Drives, Service Certificates)</option>',
      '          <option value="field_lead">Field Lead Coordinator (Attendance Session Generation)</option>',
      '          <option value="ngo_admin">NGO Representative (Profile Verification & Campaigns)</option>',
      '        </select>',
      '      </div>',
      '      <button type="submit" class="btn btn-primary" style="width:100%; padding:12px; font-size:1rem;">Register & Access Portal</button>',
      '    </form>',
      '    <div style="text-align:center; margin-top:20px; font-size:0.85rem; color:var(--text-secondary);">',
      '      Already registered? <a href="javascript:void(0)" onclick="window.SevaSetuApp.openLoginModal()" style="font-weight:600;">Sign In here</a>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');

    modal.classList.add('active');
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    var name = document.getElementById('reg-name-input').value;
    var email = document.getElementById('reg-email-input').value;
    var phone = document.getElementById('reg-phone-input').value;
    var password = document.getElementById('reg-password-input').value;
    var role = document.getElementById('reg-role-input').value;
    var errBox = document.getElementById('register-error-msg');

    var res = store.register({
      name: name,
      email: email,
      phone: phone,
      password: password,
      role: role
    });

    if (!res.success) {
      if (errBox) {
        errBox.textContent = res.error;
        errBox.style.display = 'block';
      } else {
        alert(res.error);
      }
      return;
    }

    closeModal('auth-modal');
    showToast('Account registered! Welcome to SevaSetu, ' + res.user.name);
    redirectPostLogin(res.user.role);
  }

  function handleLogout() {
    store.logout();
    showToast('Signed out successfully.');
    updateNavLinks();
    navigate('/');
  }

  function setupEventListeners() {
    // Popstate event for browser back/forward buttons
    window.addEventListener('popstate', function(e) {
      var routeInfo = resolveCurrentRoute();
      store.state.currentRole = routeInfo.config.role;
      currentSection = routeInfo.config.section;
      document.title = routeInfo.config.title;
      updateNavLinks();
      renderCurrentSection();
    });

    // Escape key closes modals
    window.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeModal('auth-modal');
        closeModal('donation-modal');
        closeModal('receipt-modal');
        closeModal('general-modal');
      }
    });
  }

  // Expose API to window
  window.SevaSetuApp = {
    init: initApp,
    navigate: navigate,
    ROUTES: ROUTES,
    switchSection: switchSection,
    switchRole: switchRole,
    openLoginModal: openLoginModal,
    fillLogin: fillLogin,
    quickLogin: quickLogin,
    handleLoginSubmit: handleLoginSubmit,
    openRegisterModal: openRegisterModal,
    handleRegisterSubmit: handleRegisterSubmit,
    handleLogout: handleLogout,
    openDonationModal: openDonationModal,
    pickAmount: pickAmount,
    updateCalculatedDeduction: updateCalculatedDeduction,
    togglePaymentFields: togglePaymentFields,
    processDonationSubmit: processDonationSubmit,
    viewOfficialReceipt: viewOfficialReceipt,
    viewVolunteerCertificate: viewVolunteerCertificate,
    openCampaignDetails: openCampaignDetails,
    openVolunteerCheckInModal: openVolunteerCheckInModal,
    submitCheckIn: submitCheckIn,
    triggerCheckOut: triggerCheckOut,
    openApproveHoursModal: openApproveHoursModal,
    submitLeadApproval: submitLeadApproval,
    showNgoStatutoryModal: showNgoStatutoryModal,
    openNewCampaignModal: openNewCampaignModal,
    submitNewCampaign: submitNewCampaign,
    closeModal: closeModal,
    switchVolTab: switchVolTab,
    generateSessionCode: generateSessionCode,
    revokeSessionCode: revokeSessionCode,
    adminReviewNgo: adminReviewNgo,
    triggerManualVerify: triggerManualVerify,
    filterCampaigns: filterCampaigns,
    setCampaignCategory: setCampaignCategory,
    filterVault: filterVault,
    exportForm10Bd: exportForm10Bd,
    openLegalModal: openLegalModal,
    saveCookiePrefs: saveCookiePrefs
  };

  // Launch when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})(window);
