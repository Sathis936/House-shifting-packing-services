/**
 * ShiftPro - Customer Portal Logic (Indian Rupee INR)
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

  // --- Customer Portal Logic ---
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

    const stageDefinitions = [
      { step: 1, label: '1. Booking Confirmed', sub: 'Survey & Date Locked', icon: 'fa-calendar-check' },
      { step: 2, label: '2. Packing Assigned', sub: 'Crew Dispatched', icon: 'fa-box-open' },
      { step: 3, label: '3. In Transit', sub: 'Live Highway Telematics', icon: 'fa-truck-fast' },
      { step: 4, label: '4. Delivered & Done', sub: 'Unpack & Final Audit', icon: 'fa-house-circle-check' }
    ];

    const stepNodes = document.querySelectorAll('.cust-step-node');
    stepNodes.forEach((node, idx) => {
      const nodeStep = idx + 1;
      const def = stageDefinitions[idx];
      node.classList.remove('active', 'completed', 'pending', 'opacity-40');

      if (nodeStep < moveData.stepIndex) {
        node.classList.add('completed');
        node.innerHTML = `
          <div class="step-circle w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold mx-auto shadow-md">
            <i class="fa-solid fa-check"></i>
          </div>
          <p class="step-title font-bold text-main text-xs mt-2">${def.label}</p>
          <span class="step-sub text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block">${def.sub}</span>
        `;
      } else if (nodeStep === moveData.stepIndex) {
        node.classList.add('active');
        node.innerHTML = `
          <div class="step-circle w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold mx-auto shadow-lg shadow-brand-500/40 animate-pulse">
            <i class="fa-solid ${def.icon}"></i>
          </div>
          <p class="step-title font-extrabold text-brand-600 dark:text-brand-300 text-xs mt-2">${def.label}</p>
          <span class="step-sub text-[10px] text-brand-700 dark:text-cyan-300 font-bold block">${def.sub}</span>
        `;
      } else {
        node.classList.add('pending');
        node.innerHTML = `
          <div class="step-circle w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto">
            <i class="fa-solid ${def.icon}"></i>
          </div>
          <p class="step-title text-xs mt-2">${def.label}</p>
          <span class="step-sub text-[10px] block">${def.sub}</span>
        `;
      }
    });

    // Update demo stage switcher button active highlighting
    document.querySelectorAll('[data-set-status]').forEach(btn => {
      const key = btn.getAttribute('data-set-status');
      const isCurrent = (key === 'confirmed' && moveData.stepIndex === 1) ||
                        (key === 'packing' && moveData.stepIndex === 2) ||
                        (key === 'transit' && moveData.stepIndex === 3) ||
                        (key === 'delivered' && moveData.stepIndex === 4);
      if (isCurrent) {
        btn.className = 'px-3 py-1.5 rounded-lg bg-brand-600 text-white font-bold transition-all shadow-sm';
      } else {
        btn.className = 'px-3 py-1.5 rounded-lg bg-surface hover:bg-slate-200 dark:hover:bg-slate-700 border border-custom font-bold text-main transition-colors';
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

  document.addEventListener('DOMContentLoaded', () => {
    initCustomerDashboard();
  });
})();
