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

    authContainers.forEach(container => {
      if (!isLoggedIn) {
        // Logged Out state: Only Login & Register buttons
        container.innerHTML = `
          <a href="login.html" class="px-3.5 py-2 rounded-xl text-xs font-bold text-main hover:text-brand-600 border border-custom bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm">
            <i class="fa-solid fa-arrow-right-to-bracket text-brand-600"></i> Login
          </a>
          <a href="register.html" class="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-md shadow-blue-500/20">
            Register
          </a>
        `;
      } else {
        // Logged In state: Portals dropdown and Logout button alone
        container.innerHTML = `
          <div class="relative group">
            <button type="button" class="nav-portal-btn px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm">
              <i class="fa-solid fa-table-columns text-brand-600 dark:text-indigo-400"></i> Portals <i class="fa-solid fa-chevron-down text-[9px]"></i>
            </button>
            <div class="absolute right-0 top-full pt-1 w-52 hidden group-hover:block transition-all z-50">
              <div class="nav-dropdown-menu rounded-2xl p-2 space-y-1 text-xs">
                <a href="dashboard-customer.html" class="nav-dropdown-item flex items-center gap-2.5 px-3 py-2.5 rounded-xl">
                  <i class="fa-solid fa-user text-brand-600 dark:text-indigo-400"></i> Customer Portal
                </a>
                <a href="dashboard-admin.html" class="nav-dropdown-item flex items-center gap-2.5 px-3 py-2.5 rounded-xl">
                  <i class="fa-solid fa-shield-halved text-amber-500"></i> Admin Console
                </a>
              </div>
            </div>
          </div>

          <button type="button" onclick="window.logoutUser()" title="Logout" class="nav-logout-btn px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm">
            <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
          </button>
        `;
      }
    });

    // Also update mobile menu auth container if present
    const mobileAuth = document.getElementById('mobile-auth-container');
    if (mobileAuth) {
      if (!isLoggedIn) {
        mobileAuth.innerHTML = `
          <a href="login.html" class="block w-full py-2.5 text-center font-bold text-xs rounded-xl border border-custom bg-surface text-main">Login</a>
          <a href="register.html" class="block w-full py-2.5 text-center font-bold text-xs rounded-xl bg-brand-600 text-white">Sign Up</a>
        `;
      } else {
        mobileAuth.innerHTML = `
          <a href="dashboard-customer.html" class="block w-full py-2.5 text-center font-bold text-xs rounded-xl bg-brand-600 text-white">Customer Portal</a>
          <a href="dashboard-admin.html" class="block w-full py-2.5 text-center font-bold text-xs rounded-xl bg-slate-800 text-white">Admin Console</a>
          <button type="button" onclick="window.logoutUser()" class="block w-full py-2.5 text-center font-bold text-xs rounded-xl bg-rose-50 dark:bg-rose-900/40 text-rose-600 border border-rose-200">Logout</button>
        `;
      }
    }
  }

  // --- 4. Sticky Navbar & Mobile Menu ---
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
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
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

  // DOM Content Loaded Init
  document.addEventListener('DOMContentLoaded', () => {
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
