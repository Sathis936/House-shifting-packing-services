/**
 * ShiftPro - Home Shifting & Packing Service Multipurpose HTML Template
 * Core Main JavaScript
 */

(function () {
  'use strict';

  // --- 1. Theme Management (Dark / Light Mode) ---
  const THEME_KEY = 'shiftpro_theme';
  const DIR_KEY = 'shiftpro_dir';
  const AUTH_KEY = 'shiftpro_logged_in';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      updateThemeIcons(true);
    } else {
      document.documentElement.classList.remove('dark');
      updateThemeIcons(false);
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    updateThemeIcons(isDark);
    showToast(`Switched to ${isDark ? 'Dark' : 'Light'} Mode`, 'info');
  }

  function updateThemeIcons(isDark) {
    const themeToggles = document.querySelectorAll('.theme-toggle-btn');
    themeToggles.forEach(btn => {
      const sunIcon = btn.querySelector('.fa-sun');
      const moonIcon = btn.querySelector('.fa-moon');
      if (sunIcon && moonIcon) {
        if (isDark) {
          sunIcon.classList.remove('hidden');
          moonIcon.classList.add('hidden');
        } else {
          sunIcon.classList.add('hidden');
          moonIcon.classList.remove('hidden');
        }
      }
    });
  }

  // --- 2. RTL / LTR Direction Management ---
  function initDirection() {
    const savedDir = localStorage.getItem(DIR_KEY);
    if (savedDir === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
      updateRtlButtons(true);
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      updateRtlButtons(false);
    }
  }

  function toggleDirection() {
    const currentDir = document.documentElement.getAttribute('dir');
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem(DIR_KEY, newDir);
    updateRtlButtons(newDir === 'rtl');
    showToast(`Direction set to ${newDir.toUpperCase()}`, 'info');
  }

  function updateRtlButtons(isRtl) {
    const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
    rtlToggles.forEach(btn => {
      btn.textContent = isRtl ? 'LTR' : 'RTL';
      btn.setAttribute('title', isRtl ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left (Arabic/Hebrew)');
    });
  }

  // --- 3. Authentication State Manager in Navbar ---
  window.isUserLoggedIn = function () {
    return localStorage.getItem(AUTH_KEY) === 'true';
  };

  window.loginUser = function (email = 'customer@shiftpro.com') {
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem('shiftpro_user_email', email);
    updateNavbarAuthState();
    showToast('Logged in successfully! Welcome back.', 'success');
  };

  window.logoutUser = function () {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('shiftpro_user_email');
    updateNavbarAuthState();
    showToast('Logged out successfully.', 'info');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 400);
  };

  function updateNavbarAuthState() {
    const authContainers = document.querySelectorAll('.nav-auth-container');
    const isLoggedIn = window.isUserLoggedIn();

    const portalsDropdownHtml = `
      <div class="relative group py-1">
        <button type="button" class="nav-portal-btn px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer" aria-haspopup="true">
          <i class="fa-solid fa-table-columns text-brand-600 dark:text-emerald-400"></i>
          <span>Portals</span>
          <i class="fa-solid fa-chevron-down text-[9px] transition-transform group-hover:rotate-180"></i>
        </button>
        <div class="dropdown-menu-bridge absolute right-0 top-full pt-2 -mt-1 w-56 hidden group-hover:block transition-all z-50">
          <div class="nav-dropdown-menu rounded-2xl p-2 space-y-1 text-xs shadow-xl border border-custom bg-surface">
            <a href="dashboard-customer.html" class="nav-dropdown-item flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-main hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <i class="fa-solid fa-user text-brand-600 dark:text-emerald-400 w-4 text-center"></i>
              <div>
                <span class="block text-main font-bold">Customer Dashboard</span>
                <span class="block text-[10px] text-muted-custom font-normal">Tracking, Bookings & Invoices</span>
              </div>
            </a>
            <a href="dashboard-admin.html" class="nav-dropdown-item flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-main hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <i class="fa-solid fa-shield-halved text-amber-500 w-4 text-center"></i>
              <div>
                <span class="block text-main font-bold">Admin Dashboard</span>
                <span class="block text-[10px] text-muted-custom font-normal">Fleet & Dispatch Control</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    `;

    authContainers.forEach(container => {
      if (!isLoggedIn) {
        // Logged Out state: Portals dropdown + Login button
        container.innerHTML = `
          ${portalsDropdownHtml}
          <a href="login.html" class="px-3.5 py-1.5 rounded-xl text-xs font-bold text-main hover:text-brand-600 border border-custom bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm">
            <i class="fa-solid fa-arrow-right-to-bracket text-brand-600"></i>
            <span>Login</span>
          </a>
        `;
      } else {
        // Logged In state: Portals dropdown + Logout button
        container.innerHTML = `
          ${portalsDropdownHtml}
          <button type="button" onclick="window.logoutUser()" title="Logout" class="nav-logout-btn px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        `;
      }
    });

    // Also update mobile menu auth container if present
    const mobileAuth = document.getElementById('mobile-auth-container');
    if (mobileAuth) {
      if (!isLoggedIn) {
        mobileAuth.innerHTML = `
          <div class="pt-2 border-t border-custom space-y-2">
            <div class="text-[10px] font-bold uppercase tracking-wider text-muted-custom">Dashboards & Portals</div>
            <div class="grid grid-cols-2 gap-2">
              <a href="dashboard-customer.html" class="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-bold text-xs border border-brand-200 dark:border-slate-700 shadow-xs hover:bg-brand-100">
                <i class="fa-solid fa-user text-xs"></i> Customer Dashboard
              </a>
              <a href="dashboard-admin.html" class="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-800 dark:bg-slate-700 text-white font-bold text-xs shadow-xs hover:bg-slate-900">
                <i class="fa-solid fa-shield-halved text-amber-400 text-xs"></i> Admin Dashboard
              </a>
            </div>
            <div class="pt-1">
              <a href="login.html" class="flex items-center justify-center gap-1.5 w-full py-2.5 text-center font-bold text-xs rounded-xl border border-custom bg-surface text-main hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs">
                <i class="fa-solid fa-arrow-right-to-bracket text-brand-600"></i> Login
              </a>
            </div>
          </div>
        `;
      } else {
        mobileAuth.innerHTML = `
          <div class="pt-2 border-t border-custom space-y-2">
            <div class="text-[10px] font-bold uppercase tracking-wider text-muted-custom">Dashboards & Portals</div>
            <div class="grid grid-cols-2 gap-2">
              <a href="dashboard-customer.html" class="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-xs hover:bg-brand-700">
                <i class="fa-solid fa-user text-xs"></i> Customer Dashboard
              </a>
              <a href="dashboard-admin.html" class="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-800 dark:bg-slate-700 text-white font-bold text-xs shadow-xs hover:bg-slate-900">
                <i class="fa-solid fa-shield-halved text-amber-400 text-xs"></i> Admin Dashboard
              </a>
            </div>
            <button type="button" onclick="window.logoutUser()" class="flex items-center justify-center gap-1.5 w-full py-2 px-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 font-bold text-xs hover:bg-rose-100 transition-colors">
              <i class="fa-solid fa-arrow-right-from-bracket text-xs"></i> Logout
            </button>
          </div>
        `;
      }
    }
  }

  // --- 4. Sticky Navbar & Mobile Menu with Close Controls ---
  function initNavbar() {
    const header = document.querySelector('header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          header.classList.add('shadow-md');
        } else {
          header.classList.remove('shadow-md');
        }
      });
    }

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    function closeMobileMenu() {
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (mobileMenuBtn) {
          const icon = mobileMenuBtn.querySelector('i');
          if (icon) {
            icon.className = 'fa-solid fa-bars text-lg';
          }
        }
      }
    }

    function openMobileMenu() {
      if (mobileMenu) {
        mobileMenu.classList.remove('hidden');
        if (mobileMenuBtn) {
          const icon = mobileMenuBtn.querySelector('i');
          if (icon) {
            icon.className = 'fa-solid fa-xmark text-lg text-rose-500';
          }
        }
      }
    }

    function toggleMobileMenu() {
      if (mobileMenu) {
        if (mobileMenu.classList.contains('hidden')) {
          openMobileMenu();
        } else {
          closeMobileMenu();
        }
      }
    }

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
      });

      // Close buttons inside mobile menu
      document.querySelectorAll('.mobile-menu-close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeMobileMenu();
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          closeMobileMenu();
        }
      });

      // Close menu on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeMobileMenu();
        }
      });

      // Close menu when any nav link inside menu is clicked
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          closeMobileMenu();
        });
      });
    }
  }

  // --- 5. Animated Stats Counters ---
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-counter'), 10);
          const suffix = entry.target.getAttribute('data-suffix') || '';
          let count = 0;
          const step = Math.max(1, Math.floor(target / 50));
          const interval = setInterval(() => {
            count += step;
            if (count >= target) {
              entry.target.textContent = target.toLocaleString() + suffix;
              clearInterval(interval);
            } else {
              entry.target.textContent = count.toLocaleString() + suffix;
            }
          }, 25);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counters.forEach(c => observer.observe(c));
  }

  // --- 6. Global Toast Notification System ---
  window.showToast = function (message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-msg';

    let iconClass = 'fa-check-circle text-emerald-500';
    if (type === 'error') iconClass = 'fa-exclamation-circle text-rose-500';
    if (type === 'info') iconClass = 'fa-info-circle text-blue-500';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation text-amber-500';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass} text-xl flex-shrink-0"></i>
      <div class="flex-grow text-sm font-medium">${message}</div>
      <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" onclick="this.parentElement.remove()">
        <i class="fa-solid fa-xmark text-xs"></i>
      </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // --- 7. Global Modal Helpers ---
  window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  // Close modals on clicking backdrop
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // --- 8. FAQ Accordion Helper ---
  function initAccordions() {
    const accordions = document.querySelectorAll('.faq-accordion-item');
    accordions.forEach(item => {
      const header = item.querySelector('.faq-accordion-header');
      const body = item.querySelector('.faq-accordion-body');
      const icon = item.querySelector('.faq-icon');
      if (header && body) {
        header.addEventListener('click', () => {
          const isOpen = !body.classList.contains('hidden');
          const parent = item.closest('.faq-accordion-group');
          if (parent) {
            parent.querySelectorAll('.faq-accordion-body').forEach(b => b.classList.add('hidden'));
            parent.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));
          }
          if (!isOpen) {
            body.classList.remove('hidden');
            if (icon) icon.classList.add('rotate-180');
          }
        });
      }
    });
  }

  // --- 9. Back To Top Button ---
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.classList.remove('opacity-0', 'invisible');
        btn.classList.add('opacity-100', 'visible');
      } else {
        btn.classList.add('opacity-0', 'invisible');
        btn.classList.remove('opacity-100', 'visible');
      }
    });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 10. Generic Forms (Newsletter, Contact, Quick Estimate) ---
  function initForms() {
    document.querySelectorAll('form[data-ajax-form]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Processing...';
          submitBtn.disabled = true;
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }
          const successMsg = form.getAttribute('data-success-msg') || 'Thank you! Your request has been received.';
          showToast(successMsg, 'success');
          form.reset();
        }, 1000);
      });
    });
  }

  // --- 11. Blog Live Search & Category Filtering ---
  function initBlogSearch() {
    const searchInput = document.getElementById('blog-search-input');
    const categoryBtns = document.querySelectorAll('.blog-category-btn');
    const blogCards = document.querySelectorAll('.blog-card-item');
    const emptyState = document.getElementById('blog-empty-state');
    const resultsCount = document.getElementById('blog-results-count');

    if (!blogCards.length) return;

    let activeCategory = 'all';
    let searchQuery = '';

    function filterArticles() {
      let visibleCount = 0;
      const q = searchQuery.toLowerCase().trim();

      blogCards.forEach(card => {
        const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
        const title = (card.querySelector('.blog-title')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('.blog-desc')?.textContent || '').toLowerCase();

        const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
        const matchesQuery = !q || title.includes(q) || desc.includes(q) || cardCategory.includes(q);

        if (matchesCategory && matchesQuery) {
          card.classList.remove('hidden-by-filter');
          visibleCount++;
        } else {
          card.classList.add('hidden-by-filter');
        }
      });

      if (emptyState) {
        if (visibleCount === 0) {
          emptyState.classList.remove('hidden');
        } else {
          emptyState.classList.add('hidden');
        }
      }

      if (resultsCount) {
        resultsCount.textContent = `Showing ${visibleCount} article${visibleCount === 1 ? '' : 's'}`;
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        filterArticles();
      });
    }

    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => {
          b.classList.remove('bg-brand-600', 'text-white');
          b.classList.add('bg-surface-secondary', 'text-muted-custom');
        });
        btn.classList.remove('bg-surface-secondary', 'text-muted-custom');
        btn.classList.add('bg-brand-600', 'text-white');

        activeCategory = (btn.getAttribute('data-filter') || 'all').toLowerCase();
        filterArticles();
      });
    });
  }

  // --- 12. Pincode / City Hub Live Search ---
  function initServiceAreasSearch() {
    const searchInput = document.getElementById('hub-search-input');
    const searchForm = document.getElementById('hub-search-form');
    const hubCards = document.querySelectorAll('.hub-card-item');
    const hubResultMsg = document.getElementById('hub-search-result');

    if (!hubCards.length && !searchInput) return;

    function searchHubs(q) {
      if (!q) {
        hubCards.forEach(card => card.classList.remove('hidden'));
        if (hubResultMsg) hubResultMsg.textContent = '';
        return;
      }

      const term = q.toLowerCase().trim();
      let matchCount = 0;

      hubCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const pincodes = card.getAttribute('data-pincodes') || '';
        if (text.includes(term) || pincodes.includes(term)) {
          card.classList.remove('hidden');
          matchCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      if (hubResultMsg) {
        if (matchCount > 0) {
          hubResultMsg.className = 'text-xs font-bold text-emerald-600 mt-2 block';
          hubResultMsg.textContent = `✓ Found ${matchCount} active logistics hub(s) serving "${q}". Direct daily transit available!`;
        } else {
          hubResultMsg.className = 'text-xs font-bold text-amber-600 mt-2 block';
          hubResultMsg.textContent = `ℹ Direct hub not listed for "${q}", but we provide Pan-India express route coverage. Call 1800-SHIFT-PRO.`;
        }
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => searchHubs(e.target.value));
    }
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (searchInput) searchHubs(searchInput.value);
      });
    }
  }

  // --- 13. Services & Category Tab Filters ---
  function initTabFilters() {
    const tabButtons = document.querySelectorAll('.filter-tab-btn');
    if (!tabButtons.length) return;

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => {
          b.classList.remove('bg-brand-600', 'text-white', 'active');
          b.classList.add('bg-surface-secondary', 'text-muted-custom');
        });
        btn.classList.add('bg-brand-600', 'text-white', 'active');
        btn.classList.remove('bg-surface-secondary', 'text-muted-custom');

        const filter = btn.getAttribute('data-filter') || 'all';
        document.querySelectorAll('.service-item').forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 14. Password Visibility & Quick Fill Helpers ---
  window.quickFillLogin = function (role) {
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-pass');
    if (!emailInput || !passInput) return;

    if (role === 'admin') {
      emailInput.value = 'admin@shiftprologistics.com';
      passInput.value = 'adminpass2026';
      if (window.showToast) window.showToast('Filled Admin Credentials. Click Sign In.', 'info');
    } else {
      emailInput.value = 'customer@shiftpro.com';
      passInput.value = 'customer2026';
      if (window.showToast) window.showToast('Filled Customer Credentials. Click Sign In.', 'info');
    }
  };

  window.togglePassVisibility = function () {
    const passInput = document.getElementById('login-pass');
    const eyeIcon = document.getElementById('pass-eye');
    if (!passInput) return;
    if (passInput.type === 'password') {
      passInput.type = 'text';
      if (eyeIcon) {
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
      }
    } else {
      passInput.type = 'password';
      if (eyeIcon) {
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
      }
    }
  };

  // --- 15. Live Countdown Timer Simulation ---
  function initCountdownTimer() {
    const secEl = document.getElementById('count-secs');
    if (!secEl) return;
    setInterval(() => {
      let sec = parseInt(secEl.textContent, 10) || 0;
      sec = sec > 0 ? sec - 1 : 59;
      secEl.textContent = sec < 10 ? '0' + sec : sec;
    }, 1000);
  }

  // --- Active Page Navbar Highlighting ---
  function initActiveNav() {
    const rawPath = window.location.pathname.split('/').pop().split('?')[0].split('#')[0];
    const currentPath = rawPath || 'index.html';

    const navLinks = document.querySelectorAll('header nav a, #mobile-menu a');
    navLinks.forEach(link => {
      const href = (link.getAttribute('href') || '').split('?')[0].split('#')[0];
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      const isExactMatch = href === currentPath;
      const isHomeMatch = (currentPath === '' || currentPath === 'index.html' || currentPath === 'index-2.html') && href === currentPath;
      const isServicesMatch = (currentPath.startsWith('service-') || currentPath === 'services.html') && href === 'services.html';
      const isBlogMatch = (currentPath.startsWith('blog-') || currentPath === 'blog.html') && href === 'blog.html';

      if (isExactMatch || isHomeMatch || isServicesMatch || isBlogMatch) {
        link.classList.add('text-brand-600', 'dark:text-brand-400', 'font-bold');
        link.classList.remove('text-slate-700', 'dark:text-slate-200');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  // --- 16. Authentication Forms (Login & Register Handlers) ---
  function initAuthForms() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('login-email');
        const email = emailInput ? emailInput.value.toLowerCase() : 'customer@shiftpro.com';
        if (window.loginUser) window.loginUser(email);
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 500);
      });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.loginUser) window.loginUser('customer@shiftpro.com');
        if (window.showToast) window.showToast('Account created successfully! Redirecting to home page...', 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 500);
      });
    }
  }

  // DOM Content Loaded Init
  
  // --- Enhanced Desktop Dropdowns on Hover & Touch/Click ---
  function initDesktopDropdowns() {
    document.addEventListener('click', (e) => {
      const portalBtn = e.target.closest('.nav-portal-btn');
      if (portalBtn) {
        const portalGroup = portalBtn.closest('.group');
        if (portalGroup) {
          const menu = portalGroup.querySelector('.dropdown-menu-bridge, div.absolute');
          if (menu) {
            e.stopPropagation();
            const isCurrentlyHidden = menu.classList.contains('hidden');
            // Close other dropdowns
            document.querySelectorAll('header div.absolute').forEach(m => m.classList.add('hidden'));
            if (isCurrentlyHidden) {
              menu.classList.remove('hidden');
            } else {
              menu.classList.add('hidden');
            }
          }
        }
        return;
      }

      const navTrigger = e.target.closest('header nav .group > a');
      if (navTrigger) {
        const group = navTrigger.closest('.group');
        const menu = group ? group.querySelector('.dropdown-menu-bridge, div.absolute') : null;
        if (menu && (window.innerWidth >= 1024 && window.innerWidth <= 1280)) {
          e.preventDefault();
          e.stopPropagation();
          const isHidden = menu.classList.contains('hidden');
          document.querySelectorAll('header nav div.absolute').forEach(m => m.classList.add('hidden'));
          if (isHidden) {
            menu.classList.remove('hidden');
          }
          return;
        }
      }

      // Clicking outside closes any toggled dropdowns
      if (!e.target.closest('.group')) {
        document.querySelectorAll('header div.absolute.dropdown-menu-bridge, header nav div.absolute, header .nav-auth-container div.absolute').forEach(m => {
          m.classList.add('hidden');
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDesktopDropdowns();
    initTheme();
    initDirection();
    initNavbar();
    initActiveNav();
    initCounters();
    initAccordions();
    initBackToTop();
    initForms();
    initBlogSearch();
    initServiceAreasSearch();
    initTabFilters();
    initCountdownTimer();
    initAuthForms();
    updateNavbarAuthState();

    // Attach theme toggle clicks
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    // Attach RTL toggle clicks
    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggleDirection);
    });
  });
})();
