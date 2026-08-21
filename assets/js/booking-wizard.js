/**
 * ShiftPro - Interactive Customer Move Booking Wizard Logic (Indian Rupee INR)
 */

(function () {
  'use strict';

  let currentStep = 1;
  const totalSteps = 4;

  const bookingState = {
    pickupAddress: '',
    pickupCity: '',
    deliveryAddress: '',
    deliveryCity: '',
    moveDate: '',
    moveSlot: 'morning',
    moveType: 'local',
    homeSize: '2bhk',
    inventory: {
      beds: 2,
      sofas: 1,
      dining: 1,
      wardrobes: 2,
      appliances: 3,
      tv: 1,
      fragileBoxes: 4,
      standardBoxes: 12
    },
    packingTier: 'premium',
    hasPickupLift: true,
    hasDeliveryLift: true,
    vehicleShifting: 'none',
    insurance: true,
    estimatedTotal: 18500
  };

  function updateStepUI() {
    for (let i = 1; i <= totalSteps; i++) {
      const node = document.getElementById(`wizard-node-${i}`);
      const stepContent = document.getElementById(`wizard-step-content-${i}`);
      
      if (node) {
        node.classList.remove('active', 'completed');
        if (i < currentStep) {
          node.classList.add('completed');
          node.innerHTML = '<i class="fa-solid fa-check text-xs"></i>';
        } else if (i === currentStep) {
          node.classList.add('active');
          node.textContent = i;
        } else {
          node.textContent = i;
        }
      }

      if (stepContent) {
        if (i === currentStep) {
          stepContent.classList.remove('hidden');
        } else {
          stepContent.classList.add('hidden');
        }
      }
    }

    const fillBar = document.getElementById('wizard-progress-fill');
    if (fillBar) {
      const pct = ((currentStep - 1) / (totalSteps - 1)) * 100;
      fillBar.style.width = `${pct}%`;
    }

    const prevBtn = document.getElementById('wizard-prev-btn');
    const nextBtn = document.getElementById('wizard-next-btn');
    const submitBtn = document.getElementById('wizard-submit-btn');

    if (prevBtn) {
      if (currentStep === 1) {
        prevBtn.classList.add('invisible');
      } else {
        prevBtn.classList.remove('invisible');
      }
    }

    if (nextBtn && submitBtn) {
      if (currentStep === totalSteps) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
        populateSummary();
      } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
      }
    }
  }

  function validateStep(step) {
    if (step === 1) {
      const pickup = document.getElementById('wiz-pickup-addr');
      const delivery = document.getElementById('wiz-delivery-addr');
      const date = document.getElementById('wiz-move-date');

      if (!pickup || !pickup.value.trim()) {
        if (window.showToast) window.showToast('Please enter your pickup address', 'warning');
        if (pickup) pickup.focus();
        return false;
      }
      if (!delivery || !delivery.value.trim()) {
        if (window.showToast) window.showToast('Please enter your delivery destination address', 'warning');
        if (delivery) delivery.focus();
        return false;
      }
      if (!date || !date.value) {
        if (window.showToast) window.showToast('Please select your preferred moving date', 'warning');
        if (date) date.focus();
        return false;
      }

      bookingState.pickupAddress = pickup.value.trim();
      bookingState.deliveryAddress = delivery.value.trim();
      bookingState.moveDate = date.value;
      bookingState.moveSlot = document.querySelector('input[name="wiz_slot"]:checked')?.value || 'morning';
      bookingState.moveType = document.querySelector('input[name="wiz_movetype"]:checked')?.value || 'local';
    }

    if (step === 2) {
      const sizeRadio = document.querySelector('input[name="wiz_homesize"]:checked');
      if (sizeRadio) bookingState.homeSize = sizeRadio.value;
    }

    if (step === 3) {
      const packRadio = document.querySelector('input[name="wiz_packing"]:checked');
      if (packRadio) bookingState.packingTier = packRadio.value;

      bookingState.hasPickupLift = document.getElementById('wiz-pickup-lift')?.checked || false;
      bookingState.hasDeliveryLift = document.getElementById('wiz-delivery-lift')?.checked || false;
      bookingState.vehicleShifting = document.getElementById('wiz-vehicle-shift')?.value || 'none';
      bookingState.insurance = document.getElementById('wiz-transit-ins')?.checked || false;
    }

    return true;
  }

  function calculateDynamicPrice() {
    let base = bookingState.moveType === 'local' ? 6500 : 18500;
    
    const sizeMult = {
      '1rk': 0.75,
      '1bhk': 1.0,
      '2bhk': 1.45,
      '3bhk': 2.1,
      '4bhk': 2.9,
      'office': 2.6
    };
    base *= (sizeMult[bookingState.homeSize] || 1.45);

    // Items count calculation
    let itemsCount = 0;
    Object.keys(bookingState.inventory).forEach(k => {
      itemsCount += bookingState.inventory[k];
    });
    base += itemsCount * 250;

    // Packing tier
    if (bookingState.packingTier === 'premium') base += 2800;
    if (bookingState.packingTier === 'whiteglove') base += 6500;

    // Vehicle
    if (bookingState.vehicleShifting === 'bike') base += 3500;
    if (bookingState.vehicleShifting === 'car') base += 8500;

    // Insurance
    if (bookingState.insurance) base += 1200;

    bookingState.estimatedTotal = Math.round(base);
    return bookingState.estimatedTotal;
  }

  function populateSummary() {
    const total = calculateDynamicPrice();
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setText('wiz-sum-from', bookingState.pickupAddress);
    setText('wiz-sum-to', bookingState.deliveryAddress);
    setText('wiz-sum-date', `${bookingState.moveDate} (${bookingState.moveSlot.toUpperCase()} slot)`);
    setText('wiz-sum-size', bookingState.homeSize.toUpperCase());
    setText('wiz-sum-tier', bookingState.packingTier.toUpperCase());
    setText('wiz-sum-price', `₹${total.toLocaleString('en-IN')}`);

    const invContainer = document.getElementById('wiz-sum-inventory-pills');
    if (invContainer) {
      invContainer.innerHTML = '';
      Object.entries(bookingState.inventory).forEach(([item, qty]) => {
        if (qty > 0) {
          const pill = document.createElement('span');
          pill.className = 'px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg border border-custom';
          pill.textContent = `${item}: ${qty}`;
          invContainer.appendChild(pill);
        }
      });
    }
  }

  function saveBooking() {
    const newMoveId = 'MOVE-' + Math.floor(1000 + Math.random() * 9000);
    const newMoveRecord = {
      id: newMoveId,
      pickup: bookingState.pickupAddress,
      delivery: bookingState.deliveryAddress,
      date: bookingState.moveDate,
      slot: bookingState.moveSlot,
      size: bookingState.homeSize,
      tier: bookingState.packingTier,
      total: bookingState.estimatedTotal,
      status: 'confirmed',
      statusLabel: 'Booking Confirmed (Team Assignment in Progress)',
      createdAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const savedMoves = JSON.parse(localStorage.getItem('shiftpro_customer_moves') || '[]');
    savedMoves.unshift(newMoveRecord);
    localStorage.setItem('shiftpro_customer_moves', JSON.stringify(savedMoves));

    if (window.showToast) window.showToast(`Move #${newMoveId} booked successfully!`, 'success');

    const confirmModal = document.getElementById('booking-success-modal');
    if (confirmModal) {
      const idEl = document.getElementById('success-modal-move-id');
      if (idEl) idEl.textContent = newMoveId;
      window.openModal('booking-success-modal');
    } else {
      setTimeout(() => {
        window.location.href = `track-move.html?id=${newMoveId}`;
      }, 1500);
    }
  }

  function initInventoryCounters() {
    document.querySelectorAll('[data-inventory-item]').forEach(container => {
      const itemKey = container.getAttribute('data-inventory-item');
      const valEl = container.querySelector('.inv-val');
      const btnMinus = container.querySelector('.inv-minus');
      const btnPlus = container.querySelector('.inv-plus');

      if (btnMinus && btnPlus && valEl) {
        btnMinus.addEventListener('click', () => {
          let current = parseInt(valEl.textContent, 10) || 0;
          if (current > 0) {
            current--;
            valEl.textContent = current;
            bookingState.inventory[itemKey] = current;
          }
        });

        btnPlus.addEventListener('click', () => {
          let current = parseInt(valEl.textContent, 10) || 0;
          current++;
          valEl.textContent = current;
          bookingState.inventory[itemKey] = current;
        });
      }
    });
  }

  function initWizard() {
    const nextBtn = document.getElementById('wizard-next-btn');
    const prevBtn = document.getElementById('wizard-prev-btn');
    const submitBtn = document.getElementById('wizard-submit-btn');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
          if (currentStep < totalSteps) {
            currentStep++;
            updateStepUI();
          }
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          updateStepUI();
        }
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        saveBooking();
      });
    }

    initInventoryCounters();
    updateStepUI();

    const pendingQuote = sessionStorage.getItem('shiftpro_pending_quote');
    if (pendingQuote) {
      try {
        const qData = JSON.parse(pendingQuote);
        sessionStorage.removeItem('shiftpro_pending_quote');
        if (qData.grandTotal) {
          bookingState.estimatedTotal = qData.grandTotal;
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', initWizard);
})();
