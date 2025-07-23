class PassengerPicker extends HTMLElement {
  constructor() {
    super();
    console.log('PassengerPicker: Constructor called');
  }

  connectedCallback() {
    console.log('PassengerPicker: Connected to DOM');
    
    // Add a small delay to ensure proper rendering in Wix
    setTimeout(() => {
      this.render();
    }, 100);
  }

  render() {
    this.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .input-box {
          width: 280px;
          padding: 12px 16px;
          border: 2px solid #a5d6a7;
          border-radius: 12px;
          font-size: 16px;
          cursor: pointer;
          outline: none;
          text-align: left;
          background: white;
          transition: border-color 0.3s ease;
        }

        .input-box:hover {
          border-color: #4CAF50;
        }

        .input-box:focus {
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }

        .dropdown {
          display: none;
          width: 320px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          padding: 16px;
          margin-top: 8px;
          z-index: 9999;
          border: 1px solid #e0e0e0;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
        }

        .dropdown.active {
          display: block;
        }

        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 12px 0;
          padding: 8px 0;
        }

        .row:not(:last-child) {
          border-bottom: 1px solid #f0f0f0;
        }

        .labels {
          display: flex;
          flex-direction: column;
        }

        .labels span:first-child {
          font-weight: 600;
          color: #cc6600;
          font-size: 16px;
        }

        .labels span:last-child {
          font-size: 13px;
          color: #888;
          margin-top: 2px;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .controls button {
          width: 32px;
          height: 32px;
          border: 2px solid #4CAF50;
          color: #4CAF50;
          border-radius: 50%;
          background: white;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .controls button:hover:not(:disabled) {
          background: #4CAF50;
          color: white;
          transform: scale(1.05);
        }

        .controls span {
          min-width: 32px;
          text-align: center;
          font-weight: 600;
          color: #333;
          font-size: 16px;
        }

        .controls button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          transform: none;
        }

        .debug-info {
          margin-top: 10px;
          padding: 8px;
          background: #f5f5f5;
          border-radius: 4px;
          font-size: 12px;
          color: #666;
        }
      </style>

      <div class="container">
        <input type="text" id="passengerInput" class="input-box" readonly placeholder="Select passengers" />
        <div class="dropdown" id="passengerDropdown">
          <div class="row">
            <div class="labels">
              <span>Adult</span>
              <span>(12+ years)</span>
            </div>
            <div class="controls">
              <button data-type="adult" data-dir="-1" title="Decrease adults">−</button>
              <span id="adultCount">1</span>
              <button data-type="adult" data-dir="1" title="Increase adults">+</button>
            </div>
          </div>
          <div class="row">
            <div class="labels">
              <span>Child</span>
              <span>(2–11 years)</span>
            </div>
            <div class="controls">
              <button data-type="child" data-dir="-1" title="Decrease children">−</button>
              <span id="childCount">0</span>
              <button data-type="child" data-dir="1" title="Increase children">+</button>
            </div>
          </div>
          <div class="row">
            <div class="labels">
              <span>Infant</span>
              <span>(Under 2 years)</span>
            </div>
            <div class="controls">
              <button data-type="infant" data-dir="-1" title="Decrease infants">−</button>
              <span id="infantCount">0</span>
              <button data-type="infant" data-dir="1" title="Increase infants">+</button>
            </div>
          </div>
        </div>
        <div class="debug-info">
          Component loaded successfully. Click input to open dropdown.
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const input = this.querySelector("#passengerInput");
    const dropdown = this.querySelector("#passengerDropdown");
    
    // Initialize counts with at least 1 adult
    const counts = {
      adult: 1,
      child: 0,
      infant: 0
    };

    // Update input with initial values
    this.updateInput(counts, input);

    // Toggle dropdown on input click
    input.addEventListener("click", (e) => {
      console.log('Input clicked');
      dropdown.classList.toggle("active");
      e.stopPropagation();
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.contains(e.target)) {
        dropdown.classList.remove("active");
      }
    });

    // Handle increment/decrement buttons
    const buttons = this.querySelectorAll("button[data-type]");
    buttons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const type = btn.getAttribute("data-type");
        const dir = parseInt(btn.getAttribute("data-dir"));
        
        // Update count with validation
        if (dir === 1) {
          counts[type]++;
        } else if (dir === -1 && counts[type] > 0) {
          // Ensure at least 1 adult remains
          if (type === 'adult' && counts[type] <= 1) {
            return;
          }
          counts[type]--;
        }

        // Update display
        this.querySelector(`#${type}Count`).textContent = counts[type];
        this.updateInput(counts, input);
        this.updateButtonStates(counts);
        
        // Dispatch custom event for external listeners
        this.dispatchEvent(new CustomEvent('passengerChange', {
          detail: { ...counts },
          bubbles: true
        }));
      });
    });

    // Initial button state update
    this.updateButtonStates(counts);
  }

  updateInput(counts, input) {
    const total = counts.adult + counts.child + counts.infant;
    if (total === 0) {
      input.value = '';
      input.placeholder = "Select passengers";
    } else {
      let parts = [];
      if (counts.adult > 0) parts.push(`${counts.adult} Adult${counts.adult > 1 ? 's' : ''}`);
      if (counts.child > 0) parts.push(`${counts.child} Child${counts.child > 1 ? 'ren' : ''}`);
      if (counts.infant > 0) parts.push(`${counts.infant} Infant${counts.infant > 1 ? 's' : ''}`);
      input.value = parts.join(', ');
    }
  }

  updateButtonStates(counts) {
    // Disable adult decrease button if only 1 adult
    const adultDecBtn = this.querySelector('button[data-type="adult"][data-dir="-1"]');
    if (adultDecBtn) {
      adultDecBtn.disabled = counts.adult <= 1;
    }

    // Disable decrease buttons when count is 0
    ['child', 'infant'].forEach(type => {
      const decBtn = this.querySelector(`button[data-type="${type}"][data-dir="-1"]`);
      if (decBtn) {
        decBtn.disabled = counts[type] <= 0;
      }
    });
  }

  // Public method to get current passenger counts
  getPassengerCounts() {
    const adultCount = parseInt(this.querySelector('#adultCount').textContent) || 1;
    const childCount = parseInt(this.querySelector('#childCount').textContent) || 0;
    const infantCount = parseInt(this.querySelector('#infantCount').textContent) || 0;
    
    return {
      adult: adultCount,
      child: childCount,
      infant: infantCount,
      total: adultCount + childCount + infantCount
    };
  }
}

// Register the custom element
if (!customElements.get('passenger-picker')) {
  customElements.define('passenger-picker', PassengerPicker);
  console.log('PassengerPicker: Custom element registered');
} else {
  console.log('PassengerPicker: Custom element already registered');
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PassengerPicker;
}
