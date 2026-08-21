/**
 * ShiftPro - Interactive Shifting & Relocation Cost Calculator (Indian Rupee INR)
 */

(function () {
  'use strict';

  const defaultRates = {
    baseLocal: 2500,
    basePerKmLocal: 35,
    basePerKmIntercity: 55,
    sizes: {
      studio: { name: 'Studio / 1 RK', baseLabor: 1800, materialCost: 1200, weightMult: 0.8 },
      '1bhk': { name: '1 BHK Apartment', baseLabor: 2800, materialCost: 2000, weightMult: 1.0 },
      '2bhk': { name: '2 BHK Apartment', baseLabor: 4500, materialCost: 3500, weightMult: 1.5 },
      '3bhk': { name: '3 BHK Apartment / House', baseLabor: 7000, materialCost: 5500, weightMult: 2.2 },
      '4bhk': { name: '4+ BHK / Luxury Villa', baseLabor: 11000, materialCost: 8500, weightMult: 3.1 },
      office: { name: 'Office / Corporate', baseLabor: 9500, materialCost: 7500, weightMult: 2.8 }
    },
    packingTiers: {
      standard: { name: 'Standard (Boxes & Tape)', extra: 0 },
      premium: { name: 'Premium (3-Layer Bubble & Foam)', extra: 2800 },
      whiteglove: { name: 'VIP White Glove (Crating & Unpack)', extra: 6500 }
    },
    floorElevator: {
      ground: 0,
      lift_low: 600,
      lift_high: 1200,
      nolift_low: 2200,
      nolift_high: 4500
    },
    specialItems: {
      piano: 4500,
      fridge: 1200,
      tv: 1000,
      glass: 1500,
      safe: 2500,
      antique: 1800
    },
    vehicles: {
      none: 0,
      bike: 3500,
      sedan: 8500,
      suv: 11000
    }
  };

  function calculateEstimate() {
    const form = document.getElementById('shifting-calculator-form');
    if (!form) return;

    const moveType = form.querySelector('input[name="move_type"]:checked')?.value || 'local';
    const distanceSlider = document.getElementById('calc-distance');
    const distance = distanceSlider ? parseInt(distanceSlider.value, 10) : 25;

    const homeSizeSelect = document.getElementById('calc-home-size')?.value || '2bhk';
    const packingTier = form.querySelector('input[name="calc_packing_tier"]:checked')?.value || 'premium';
    const floorSelect = document.getElementById('calc-floor-elevator')?.value || 'lift_low';
    const vehicleSelect = document.getElementById('calc-vehicle')?.value || 'none';
    const storageDays = parseInt(document.getElementById('calc-storage-days')?.value || '0', 10);
    const insuranceIncluded = document.getElementById('calc-insurance')?.checked || false;

    // Specialty items checked
    let specialItemsTotal = 0;
    const selectedSpecialties = [];
    form.querySelectorAll('input[name="calc_special_items"]:checked').forEach(cb => {
      const val = cb.value;
      if (defaultRates.specialItems[val]) {
        specialItemsTotal += defaultRates.specialItems[val];
        selectedSpecialties.push(cb.getAttribute('data-name') || val);
      }
    });

    const sizeData = defaultRates.sizes[homeSizeSelect] || defaultRates.sizes['2bhk'];
    const packingData = defaultRates.packingTiers[packingTier] || defaultRates.packingTiers['premium'];
    const floorCost = defaultRates.floorElevator[floorSelect] || 0;
    const vehicleCost = defaultRates.vehicles[vehicleSelect] || 0;
    const storageCost = storageDays * 450;

    // Transport Fare
    let transportFare = defaultRates.baseLocal;
    if (moveType === 'local') {
      transportFare += distance * defaultRates.basePerKmLocal * sizeData.weightMult;
    } else {
      transportFare += 3500 + distance * defaultRates.basePerKmIntercity * sizeData.weightMult;
    }

    // Packing & Labor Fare
    const laborCost = sizeData.baseLabor + floorCost;
    const packingCost = sizeData.materialCost + packingData.extra;
    
    // Subtotal
    const subtotal = transportFare + laborCost + packingCost + specialItemsTotal + vehicleCost + storageCost;
    const insuranceCost = insuranceIncluded ? Math.max(999, Math.round(subtotal * 0.03)) : 0;
    const grandTotal = Math.round(subtotal + insuranceCost);

    const minEstimate = Math.round(grandTotal * 0.94);
    const maxEstimate = Math.round(grandTotal * 1.07);

    // Update UI elements in Indian Rupee format
    updateElementText('calc-res-total', `₹${grandTotal.toLocaleString('en-IN')}`);
    updateElementText('calc-res-range', `₹${minEstimate.toLocaleString('en-IN')} - ₹${maxEstimate.toLocaleString('en-IN')}`);
    updateElementText('calc-res-transport', `₹${Math.round(transportFare).toLocaleString('en-IN')}`);
    updateElementText('calc-res-packing', `₹${Math.round(packingCost).toLocaleString('en-IN')}`);
    updateElementText('calc-res-labor', `₹${Math.round(laborCost).toLocaleString('en-IN')}`);
    updateElementText('calc-res-addons', `₹${Math.round(specialItemsTotal + vehicleCost + storageCost + insuranceCost).toLocaleString('en-IN')}`);

    // Prepare transfer payload
    const bookingPayload = {
      moveType,
      distance,
      homeSize: sizeData.name,
      packingTier: packingData.name,
      specialItems: selectedSpecialties,
      grandTotal,
      estimatedRange: `₹${minEstimate.toLocaleString('en-IN')} - ₹${maxEstimate.toLocaleString('en-IN')}`
    };

    const bookBtn = document.getElementById('calc-book-btn');
    if (bookBtn) {
      bookBtn.onclick = () => {
        sessionStorage.setItem('shiftpro_pending_quote', JSON.stringify(bookingPayload));
        window.location.href = 'dashboard-customer.html?step=wizard';
      };
    }
  }

  function updateElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function initCalculator() {
    const form = document.getElementById('shifting-calculator-form');
    if (!form) return;

    const distanceSlider = document.getElementById('calc-distance');
    const distanceValDisplay = document.getElementById('calc-distance-val');
    if (distanceSlider && distanceValDisplay) {
      distanceSlider.addEventListener('input', (e) => {
        distanceValDisplay.textContent = `${e.target.value} km`;
        calculateEstimate();
      });
    }

    form.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('change', calculateEstimate);
      input.addEventListener('input', calculateEstimate);
    });

    calculateEstimate();
  }

  document.addEventListener('DOMContentLoaded', initCalculator);
})();
