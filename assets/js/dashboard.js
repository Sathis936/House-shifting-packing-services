/**
 * ShiftPro - Customer & Admin Dashboard Logic (Indian Rupee INR)
 */

(function () {
  'use strict';

  // Demo active move presets in Indian Rupees
  const movePresets = {
    confirmed: {
      id: 'MOVE-7731',
      pickup: 'Bandra West, Mumbai, MH',
      delivery: 'Koramangala, Bengaluru, KA',
      date: 'Aug 24, 2026',
      slot: 'Morning (09:00 AM)',
      size: '2 BHK Apartment',
      tier: 'Standard Economy',
      total: 18500,
      status: 'confirmed',
      statusLabel: 'Booking Confirmed • Survey Completed',
      stepIndex: 1,
      crewLeader: 'Elena Rostova (Move Coordinator)',
      subtext: 'Virtual video survey completed. Packing material dispatch scheduled for Aug 23.'
    },
    packing: {
      id: 'MOVE-1024',
      pickup: 'Indiranagar, Bengaluru, KA',
      delivery: 'Hitec City, Hyderabad, TS',
      date: 'Aug 22, 2026',
      slot: 'Morning (09:00 AM)',
      size: '2 BHK House',
      tier: 'Premium 3-Layer Packing',
      total: 22800,
      status: 'packing',
      statusLabel: 'Packing Team Assigned & On Site',
      stepIndex: 2,
      crewLeader: 'Marcus Reed (Lead Packer)',
      subtext: 'Crew of 3 packers currently applying 3-layer bubble wrap & furniture blankets.'
    },
    transit: {
      id: 'MOVE-8492',
      pickup: 'South Extension, New Delhi, DL',
      delivery: 'Sector 62, Noida, UP',
      date: 'Aug 21, 2026',
      slot: 'Morning (09:00 AM)',
      size: '3 BHK Apartment',
      tier: 'Premium 3-Layer Packing',
      total: 28400,
      status: 'transit',
      statusLabel: 'In Transit on Route (Highway Express)',
      stepIndex: 3,
      crewLeader: 'Robert Vance (Lead Driver #TRK-904)',
      subtext: 'Container truck passed Toll Plaza. Live satellite GPS telemetry active.'
    },
    delivered: {
      id: 'MOVE-3350',
      pickup: 'Anna Nagar, Chennai, TN',
      delivery: 'Whitefield, Bengaluru, KA',
      date: 'Aug 20, 2026',
      slot: 'Morning (09:00 AM)',
      size: '4 BHK Villa',
      tier: 'VIP White Glove',
      total: 42000,
      status: 'delivered',
      statusLabel: 'Delivered & Inspected Successfully',
      stepIndex: 4,
      crewLeader: 'Daniel Croft (Delivery Supervisor)',
      subtext: 'Unloading, bed assembly, and inventory verification signed by customer.'
    }
  };

  let currentActiveMove = movePresets.transit;
  let activeDiscount = 0;

  // --- Customer Dashboard Logic ---
  function initCustomerDashboard() {
    const isCustomerDash = document.getElementById('customer-dashboard-root');
    if (!isCustomerDash) return;

    const savedMoves = JSON.parse(localStorage.getItem('shiftpro_customer_moves') || 'null');
    if (savedMoves && savedMoves.length > 0) {
      const latest = savedMoves[0];
      currentActiveMove = {
        id: latest.id,
        pickup: latest.pickup,
        delivery: latest.delivery,
        date: latest.date,
        slot: latest.slot || 'Morning',
        size: latest.size || '2 BHK',
        tier: latest.tier || 'Premium',
        total: latest.total || 24800,
        status: latest.status || 'confirmed',
        statusLabel: latest.statusLabel || 'Booking Confirmed',
        stepIndex: latest.status === 'delivered' ? 4 : (latest.status === 'transit' ? 3 : (latest.status === 'packing' ? 2 : 1)),
        crewLeader: 'Robert Vance (Assigned Lead)',
        subtext: 'Your move request is registered and actively managed by our team.'
      };
    }

    renderActiveMove(currentActiveMove);

    document.querySelectorAll('[data-set-status]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-set-status');
        if (movePresets[key]) {
          currentActiveMove = movePresets[key];
          renderActiveMove(currentActiveMove);
          if (window.showToast) window.showToast(`Switched demo view to: ${currentActiveMove.statusLabel}`, 'info');
        }
      });
    });

    document.querySelectorAll('[data-view-invoice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const moveId = btn.getAttribute('data-view-invoice') || currentActiveMove.id;
        openInvoiceModal(moveId, currentActiveMove);
      });
    });

    initCoordinatorChat();
    initInvoiceCoupon();
  }

  function renderActiveMove(moveData) {
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setText('cust-active-id', moveData.id);
    setText('cust-active-route', `${moveData.pickup.split(',')[0]} → ${moveData.delivery.split(',')[0]}`);
    setText('cust-active-date', `${moveData.date} • ${moveData.slot}`);
    setText('cust-active-subtext', moveData.subtext || '');
    setText('cust-active-total', `₹${moveData.total.toLocaleString('en-IN')}`);

    const badgeEl = document.getElementById('cust-active-status');
    if (badgeEl) {
      badgeEl.className = `status-badge status-badge-${moveData.status}`;
      badgeEl.textContent = moveData.statusLabel;
    }

    const stepNodes = document.querySelectorAll('.cust-step-node');
    stepNodes.forEach((node, idx) => {
      const nodeStep = idx + 1;
      node.classList.remove('active', 'completed', 'opacity-40');
      
      if (nodeStep < moveData.stepIndex) {
        node.classList.add('completed');
      } else if (nodeStep === moveData.stepIndex) {
        node.classList.add('active');
      } else {
        node.classList.add('opacity-40');
      }
    });

    setText('cust-coord-name', moveData.crewLeader);
  }

  function openInvoiceModal(moveId, moveData) {
    activeDiscount = 0;
    renderInvoiceCalculations(moveId, moveData);
    window.openModal('invoice-modal');
  }

  function renderInvoiceCalculations(moveId, moveData) {
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    const invNum = 'INV-' + moveId.replace('MOVE-', '') + '-2026';
    setText('inv-number', invNum);
    setText('inv-date', new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }));
    setText('inv-move-id', moveId);
    setText('inv-pickup', moveData.pickup || 'South Extension, New Delhi, DL');
    setText('inv-delivery', moveData.delivery || 'Sector 62, Noida, UP');
    
    const grossTotal = moveData.total || 28400;
    const baseFare = Math.round(grossTotal * 0.55);
    const packingFare = Math.round(grossTotal * 0.25);
    const handlingFare = Math.round(grossTotal * 0.15);
    const tax = Math.round(grossTotal * 0.05);
    
    const subtotal = baseFare + packingFare + handlingFare + tax;
    const finalTotal = Math.max(0, subtotal - activeDiscount);

    setText('inv-base-fare', `₹${baseFare.toLocaleString('en-IN')}.00`);
    setText('inv-packing-fare', `₹${packingFare.toLocaleString('en-IN')}.00`);
    setText('inv-handling-fare', `₹${handlingFare.toLocaleString('en-IN')}.00`);
    setText('inv-tax-fare', `₹${tax.toLocaleString('en-IN')}.00`);
    setText('inv-discount-fare', activeDiscount > 0 ? `-₹${activeDiscount.toLocaleString('en-IN')}.00` : '₹0.00');
    setText('inv-grand-total', `₹${finalTotal.toLocaleString('en-IN')}.00`);
  }

  function initInvoiceCoupon() {
    const couponForm = document.getElementById('inv-coupon-form');
    const couponInput = document.getElementById('inv-coupon-input');
    if (couponForm && couponInput) {
      couponForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = couponInput.value.trim().toUpperCase();
        if (code === 'MOVE500' || code === 'WELCOME500') {
          activeDiscount = 500;
          renderInvoiceCalculations(currentActiveMove.id, currentActiveMove);
          if (window.showToast) window.showToast('Promo code applied! ₹500 discount deducted from invoice.', 'success');
        } else if (code === 'SHIFT10') {
          activeDiscount = Math.round(currentActiveMove.total * 0.1);
          renderInvoiceCalculations(currentActiveMove.id, currentActiveMove);
          if (window.showToast) window.showToast('10% discount applied to your invoice!', 'success');
        } else {
          if (window.showToast) window.showToast('Invalid coupon code. Try MOVE500 or SHIFT10', 'warning');
        }
      });
    }
  }

  function initCoordinatorChat() {
    const chatForm = document.getElementById('coord-chat-form');
    const chatInput = document.getElementById('coord-chat-input');
    const chatBox = document.getElementById('coord-chat-messages');

    if (chatForm && chatInput && chatBox) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;

        const userDiv = document.createElement('div');
        userDiv.className = 'flex justify-end';
        userDiv.innerHTML = `
          <div class="bg-brand-600 text-white p-3 rounded-2xl rounded-tr-none text-xs max-w-xs shadow-sm">
            <p>${msg}</p>
            <span class="text-[9px] text-blue-200 block text-right mt-1">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        `;
        chatBox.appendChild(userDiv);
        chatInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        setTimeout(() => {
          const repDiv = document.createElement('div');
          repDiv.className = 'flex justify-start';
          repDiv.innerHTML = `
            <div class="bg-surface-secondary p-3 rounded-2xl rounded-tl-none text-xs max-w-xs border border-custom text-main shadow-sm">
              <p class="font-bold text-[10px] text-brand-600 mb-0.5">Elena Rostova (Coordinator)</p>
              <p>Hi Sarah! I have verified this for Move #${currentActiveMove.id}. Our driver Robert is on track and will call you 30 minutes before arrival!</p>
              <span class="text-[9px] text-muted-custom block text-left mt-1">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          `;
          chatBox.appendChild(repDiv);
          chatBox.scrollTop = chatBox.scrollHeight;
        }, 1000);
      });
    }
  }

  // --- Admin Dashboard Logic ---
  function initAdminDashboard() {
    const isAdminDash = document.getElementById('admin-dashboard-root');
    if (!isAdminDash) return;

    initAdminCharts();
    initAdminMovesTable();
    initQuoteActions();
  }

  function initAdminCharts() {
    if (typeof Chart === 'undefined') return;

    const revenueCtx = document.getElementById('adminRevenueChart')?.getContext('2d');
    if (revenueCtx) {
      new Chart(revenueCtx, {
        type: 'line',
        data: {
          labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [
            {
              label: 'Monthly Revenue (₹ Lakhs)',
              data: [3.4, 4.2, 5.1, 6.2, 7.5, 8.4, 9.2, 10.5],
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: '#2563eb'
            },
            {
              label: 'Target (₹ Lakhs)',
              data: [3.0, 3.8, 4.8, 5.8, 7.0, 8.0, 8.8, 9.5],
              borderColor: '#94a3b8',
              borderDash: [5, 5],
              borderWidth: 2,
              fill: false,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12 } }
          },
          scales: {
            y: {
              grid: { color: 'rgba(148, 163, 184, 0.15)' },
              ticks: { callback: val => '₹' + val + 'L' }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
    }

    const categoriesCtx = document.getElementById('adminCategoryChart')?.getContext('2d');
    if (categoriesCtx) {
      new Chart(categoriesCtx, {
        type: 'doughnut',
        data: {
          labels: ['Household Shifting', 'Corporate / Office', 'Vehicle Transport', 'Secure Storage'],
          datasets: [{
            data: [54, 24, 14, 8],
            backgroundColor: ['#2563eb', '#f97316', '#10b981', '#6366f1'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } }
          },
          cutout: '70%'
        }
      });
    }
  }

  function initAdminMovesTable() {
    const table = document.getElementById('admin-moves-table');
    const searchInput = document.getElementById('admin-move-search');
    const filterSelect = document.getElementById('admin-move-filter');

    if (!table) return;

    table.querySelectorAll('.move-status-changer').forEach(select => {
      select.addEventListener('change', () => {
        const moveId = select.getAttribute('data-move-id');
        const newStatus = select.value;
        if (window.showToast) window.showToast(`Updated status for ${moveId} to: ${newStatus.toUpperCase()}`, 'success');
      });
    });

    table.querySelectorAll('.assign-driver-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const moveId = btn.getAttribute('data-move-id');
        const driverName = prompt(`Assign Lead Driver for Move #${moveId}:`, 'Robert Vance (#TRK-904)');
        if (driverName) {
          btn.textContent = driverName;
          if (window.showToast) window.showToast(`Assigned ${driverName} to ${moveId}`, 'success');
        }
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase();
        table.querySelectorAll('tbody tr').forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(term) ? '' : 'none';
        });
      });
    }

    if (filterSelect) {
      filterSelect.addEventListener('change', () => {
        const filterVal = filterSelect.value;
        table.querySelectorAll('tbody tr').forEach(row => {
          const rowStatus = row.getAttribute('data-status') || '';
          if (filterVal === 'all' || rowStatus === filterVal) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }
  }

  function initQuoteActions() {
    document.querySelectorAll('.quote-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const quoteId = btn.getAttribute('data-quote-id');
        btn.closest('tr')?.remove();
        if (window.showToast) window.showToast(`Quote #${quoteId} converted to Active Move!`, 'success');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCustomerDashboard();
    initAdminDashboard();
  });
})();
