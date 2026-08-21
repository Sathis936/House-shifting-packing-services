/**
 * ShiftPro - Real-Time Household Move Tracking Portal Logic
 */

(function () {
  'use strict';

  const demoMoveDatabase = {
    'MOVE-8492': {
      id: 'MOVE-8492',
      customer: 'David & Sarah Jenkins',
      origin: '742 Evergreen Terrace, New York, NY',
      destination: '128 Beacon St, Boston, MA',
      moveType: 'Inter-City Relocation (3 BHK)',
      status: 'in-transit',
      statusLabel: 'In Transit on Route (Highway I-95)',
      statusCode: 3, // 1: Booked, 2: Packing, 3: In Transit, 4: Delivered
      estimatedDelivery: 'Today, by 4:45 PM',
      driver: {
        name: 'Robert Vance',
        phone: '+1 (555) 234-8921',
        rating: '4.9 ★ (184 moves)',
        vehicle: 'Volvo FH16 Enclosed Air-Ride Van (#TRK-904)',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      crew: ['Elena Rostova (Lead Packer)', 'Samuel K. (Heavy Lifting)', 'Carlos M. (Assembly)'],
      inventorySummary: '42 Boxes, 8 Large Furniture Units, 1 Piano (Crated), 1 Motorbike',
      timeline: [
        { time: 'Aug 21, 08:30 AM', title: 'Booking Confirmed & Pre-Move Virtual Survey Completed', done: true },
        { time: 'Aug 21, 10:15 AM', title: 'Packing Crew Arrived & 3-Layer Protective Wrapping Finished', done: true },
        { time: 'Aug 21, 01:00 PM', title: 'Goods Securely Loaded into Container Truck & GPS Sealed', done: true },
        { time: 'Aug 21, 02:40 PM', title: 'Truck in Transit - Passed Hartford Toll Plaza', current: true },
        { time: 'Aug 21, 04:45 PM (Est.)', title: 'Expected Arrival at Boston Destination & Unloading' }
      ]
    },
    'MOVE-1024': {
      id: 'MOVE-1024',
      customer: 'Alex Rivera',
      origin: '104 Sunset Blvd, Los Angeles, CA',
      destination: '850 Market St, San Francisco, CA',
      moveType: 'Express Apartment Move (2 BHK)',
      status: 'packing',
      statusLabel: 'Packing Team Assigned & On Site',
      statusCode: 2,
      estimatedDelivery: 'Tomorrow, 11:30 AM',
      driver: {
        name: 'Marcus Reed',
        phone: '+1 (555) 890-1122',
        rating: '5.0 ★ (92 moves)',
        vehicle: 'Freightliner 26ft Box Truck (#TRK-512)',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      crew: ['Marcus Reed (Lead)', 'James T. (Technician)'],
      inventorySummary: '26 Standard Boxes, 4 Fragile Glass Crates, 3 Beds',
      timeline: [
        { time: 'Aug 20, 04:00 PM', title: 'Booking Confirmed & Moving Date Locked', done: true },
        { time: 'Aug 21, 09:00 AM', title: 'Packing Crew Assigned & Materials Dispatched', done: true },
        { time: 'Aug 21, 11:00 AM', title: 'Currently Packing Delicate Items & Furniture Wrap', current: true },
        { time: 'Aug 21, 03:00 PM (Est.)', title: 'Loading into Enclosed Transport Vehicle' },
        { time: 'Aug 22, 11:30 AM (Est.)', title: 'Delivery & Unpacking in San Francisco' }
      ]
    },
    'MOVE-7731': {
      id: 'MOVE-7731',
      customer: 'Apex Tech Solutions (Corporate)',
      origin: 'Level 14, 500 Michigan Ave, Chicago, IL',
      destination: 'Tech Park Tower B, Austin, TX',
      moveType: 'Corporate Office Relocation (45 Workstations)',
      status: 'confirmed',
      statusLabel: 'Booking Confirmed - Pre-Move Audit Done',
      statusCode: 1,
      estimatedDelivery: 'Aug 25, 02:00 PM',
      driver: {
        name: 'Thomas Wayne (Fleet Coordinator)',
        phone: '+1 (555) 776-9900',
        rating: '4.9 ★ (320 moves)',
        vehicle: '2x 40ft Multi-Axle Fleet (#FLT-88 & #FLT-89)',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
      },
      crew: ['Thomas Wayne (Supervisor)', '8-Member Certified Commercial Crew'],
      inventorySummary: '45 Ergonomic Desks, 6 Server Racks, 90 Monitors, 80 File Crates',
      timeline: [
        { time: 'Aug 19, 11:00 AM', title: 'Corporate Contract Approved & Security Badges Issued', done: true },
        { time: 'Aug 21, 09:00 AM', title: 'Pre-Move IT Infrastructure Tagging Complete', current: true },
        { time: 'Aug 23, 06:00 PM', title: 'Server Dismantling & Weekend Zero-Downtime Packing' },
        { time: 'Aug 24, 08:00 AM', title: 'Interstate Convoy Departure' },
        { time: 'Aug 25, 02:00 PM', title: 'Austin Office Reassembly & Network Handover' }
      ]
    },
    'MOVE-3350': {
      id: 'MOVE-3350',
      customer: 'Emily Watson',
      origin: '35 Pinecrest Dr, Seattle, WA',
      destination: '920 Highland Rd, Portland, OR',
      moveType: 'Residential Villa Relocation (4 BHK)',
      status: 'delivered',
      statusLabel: 'Delivered & Inspected Successfully',
      statusCode: 4,
      estimatedDelivery: 'Delivered Today, 01:15 PM',
      driver: {
        name: 'Daniel Croft',
        phone: '+1 (555) 443-6712',
        rating: '5.0 ★ (240 moves)',
        vehicle: 'Eco-Van Transporter (#EV-209)',
        photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
      },
      crew: ['Daniel Croft (Lead)', 'Anthony B.', 'Samira N.'],
      inventorySummary: '58 Boxes, Grand Dining, Garden Furniture, Car Transported',
      timeline: [
        { time: 'Aug 19, 09:00 AM', title: 'Booking Confirmed & Inventory Audited', done: true },
        { time: 'Aug 20, 08:30 AM', title: 'Full Household Packing & Crating Completed', done: true },
        { time: 'Aug 20, 02:00 PM', title: 'Transit via I-5 South Corridor', done: true },
        { time: 'Aug 21, 10:00 AM', title: 'Arrival, Unloading & Placement in Rooms', done: true },
        { time: 'Aug 21, 01:15 PM', title: 'Customer Sign-off & Clean-up Verification', done: true }
      ]
    }
  };

  function renderTrackingResult(moveData) {
    const container = document.getElementById('tracking-result-container');
    const emptyState = document.getElementById('tracking-empty-state');
    if (!container) return;

    if (emptyState) emptyState.classList.add('hidden');
    container.classList.remove('hidden');

    // Status Badge & Labels
    const badgeEl = document.getElementById('trk-status-badge');
    if (badgeEl) {
      badgeEl.className = `status-badge status-badge-${moveData.status}`;
      badgeEl.textContent = moveData.statusLabel;
    }

    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setText('trk-move-id', moveData.id);
    setText('trk-customer-name', moveData.customer);
    setText('trk-origin', moveData.origin);
    setText('trk-destination', moveData.destination);
    setText('trk-move-type', moveData.moveType);
    setText('trk-eta', moveData.estimatedDelivery);
    setText('trk-inventory', moveData.inventorySummary);

    // Driver Info
    setText('trk-driver-name', moveData.driver.name);
    setText('trk-driver-phone', moveData.driver.phone);
    setText('trk-driver-rating', moveData.driver.rating);
    setText('trk-driver-vehicle', moveData.driver.vehicle);
    
    const driverPhoto = document.getElementById('trk-driver-photo');
    if (driverPhoto) driverPhoto.src = moveData.driver.photo;

    // Timeline Rendering
    const timelineEl = document.getElementById('trk-timeline-list');
    if (timelineEl) {
      timelineEl.innerHTML = '';
      moveData.timeline.forEach((step, idx) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = `tracking-step ${step.done ? 'done' : ''} ${step.current ? 'current' : ''}`;
        
        let iconHtml = '<i class="fa-regular fa-circle"></i>';
        if (step.done) iconHtml = '<i class="fa-solid fa-check text-white"></i>';
        if (step.current) iconHtml = '<i class="fa-solid fa-truck-fast text-white"></i>';

        stepDiv.innerHTML = `
          <div class="tracking-icon">${iconHtml}</div>
          <div class="bg-surface p-4 rounded-xl border border-custom shadow-sm mb-3">
            <div class="flex items-center justify-between gap-2 mb-1">
              <h4 class="font-semibold text-sm text-main">${step.title}</h4>
              <span class="text-xs text-muted-custom font-medium">${step.time}</span>
            </div>
            ${step.current ? '<p class="text-xs text-blue-600 dark:text-blue-400 font-medium"><i class="fa-solid fa-satellite-dish mr-1 animate-pulse"></i> Live GPS Feed Active</p>' : ''}
          </div>
        `;
        timelineEl.appendChild(stepDiv);
      });
    }

    // Scroll to results smoothly
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleTrackSearch(trackingId) {
    const cleanId = (trackingId || '').trim().toUpperCase();
    if (!cleanId) {
      if (window.showToast) window.showToast('Please enter a valid Tracking ID', 'warning');
      return;
    }

    const matchedMove = demoMoveDatabase[cleanId];
    if (matchedMove) {
      renderTrackingResult(matchedMove);
      if (window.showToast) window.showToast(`Found shipment details for ${cleanId}`, 'success');
    } else {
      // Dynamic fallback for any random query ID
      const dynamicMove = {
        id: cleanId,
        customer: 'Registered Customer',
        origin: 'Central City Hub A',
        destination: 'Metro Destination Hub B',
        moveType: 'Standard Household Relocation',
        status: 'in-transit',
        statusLabel: 'Active In Transit',
        statusCode: 3,
        estimatedDelivery: 'Scheduled for Tomorrow, 03:00 PM',
        driver: {
          name: 'Harrison Ford',
          phone: '+1 (555) 600-4422',
          rating: '4.8 ★ (110 moves)',
          vehicle: 'ShiftPro Heavy Relocator (#TRK-771)',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        },
        crew: ['Harrison F. (Team Lead)', 'Mike D. (Logistics)'],
        inventorySummary: 'Household Package Items (Safe Transit Certified)',
        timeline: [
          { time: 'Yesterday, 10:00 AM', title: 'Booking Confirmed & Inventory Verified', done: true },
          { time: 'Today, 08:00 AM', title: 'Goods Packed with Multi-Layer Protection & Loaded', done: true },
          { time: 'Today, 12:30 PM', title: 'Vehicle in Transit via Express Highway', current: true },
          { time: 'Tomorrow, 03:00 PM (Est.)', title: 'Final Destination Delivery & Unloading' }
        ]
      };
      renderTrackingResult(dynamicMove);
      if (window.showToast) window.showToast(`Showing live tracking status for ${cleanId}`, 'info');
    }
  }

  function initTracker() {
    const searchForm = document.getElementById('tracking-search-form');
    const searchInput = document.getElementById('tracking-id-input');

    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleTrackSearch(searchInput.value);
      });
    }

    // Quick demo ID pills
    document.querySelectorAll('[data-demo-track]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-demo-track');
        if (searchInput) searchInput.value = id;
        handleTrackSearch(id);
      });
    });

    // URL parameter auto-search (e.g. track-move.html?id=MOVE-8492)
    const urlParams = new URLSearchParams(window.location.search);
    const queryId = urlParams.get('id');
    if (queryId) {
      if (searchInput) searchInput.value = queryId;
      handleTrackSearch(queryId);
    }
  }

  document.addEventListener('DOMContentLoaded', initTracker);
})();
