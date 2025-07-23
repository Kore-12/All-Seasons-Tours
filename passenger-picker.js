class PassengerPicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        html, body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: transparent;
          overflow: hidden;
          height: 100%;
          width: 100%;
        }
        #passengerContainer {
          position: relative;
          display: inline-block;
        }

        #passengerInput {
          width: 240px;
          padding: 10px 14px;
          border: 1px solid #a5d6a7;
          border-radius: 12px;
          font-size: 16px;
          cursor: pointer;
          outline: none;
        }

        .dropdown {
          display: none;
          margin-top: 8px;
          width: 280px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
          padding: 10px;
          z-index: 1000;
          position: absolute;
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
          margin: 10px 0;
        }

        .labels {
          display: flex;
          flex-direction: column;
        }

        .labels span:first-child {
          font-weight: bold;
          color: #cc6600;
        }

        .labels span:last-child {
          font-size: 14px;
          color: #aaa;
        }

        .controls {
          display: flex;
          align-items: center;
        }

        .controls button {
          width: 28px;
          height: 28px;
          border: 2px solid #4CAF50;
          color: #4CAF50;
          border-radius: 50%;
          background: none;
          font-size: 18px;
          line-height: 20px;
          cursor: pointer;
        }

        .controls span {
          width: 24px;
          text-align: center;
          margin: 0 8px;
          font-weight: bold;
          color: orange;
        }

        .controls button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      </style>
      <div id="passengerContainer">
        <input type="text" id="passengerInput" readonly placeholder="Passenger Count" />
        <div class="dropdown" id="passengerDropdown">
          ${['adult', 'child', 'infant'].map(type => `
            <div class="row">
              <div class="labels">
                <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <span>${type === 'adult' ? '(11+)' : type === 'child' ? '(2–11)' : '(0–2)'}</span>
              </div>
              <div class="controls">
                <button data-type="${type}" data-delta="-1">−</button>
                <span id="${type}Count">0</span>
                <button data-type="${type}" data-delta="1">+</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.counts = { adult: 0, child: 0, infant: 0 };
  }

  connectedCallback() {
    const shadow = this.shadowRoot;
    const input = shadow.getElementById("passengerInput");
    const dropdown = shadow.getElementById("passengerDropdown");

    input.addEventListener("click", (e) => {
      dropdown.classList.toggle("active");
      e.stopPropagation();
    });

    document.addEventListener("click", (e) => {
      if (!this.contains(e.target)) {
        dropdown.classList.remove("active");
      }
    });

    shadow.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.type;
        const delta = parseInt(btn.dataset.delta, 10);
        this.updateCount(type, delta);
      });
    });

    this.updateInput();
  }

  updateCount(type, delta) {
    this.counts[type] = Math.max(0, this.counts[type] + delta);
    this.shadowRoot.getElementById(`${type}Count`).textContent = this.counts[type];
    this.updateInput();
  }

  updateInput() {
    const total = Object.values(this.counts).reduce((a, b) => a + b, 0);
    const input = this.shadowRoot.getElementById("passengerInput");
    if (total === 0) {
      input.value = '';
      input.placeholder = "Passenger Count";
    } else {
      let parts = [];
      if (this.counts.adult > 0) parts.push(`${this.counts.adult} Adult${this.counts.adult > 1 ? 's' : ''}`);
      if (this.counts.child > 0) parts.push(`${this.counts.child} Child${this.counts.child > 1 ? 'ren' : ''}`);
      if (this.counts.infant > 0) parts.push(`${this.counts.infant} Infant${this.counts.infant > 1 ? 's' : ''}`);
      input.value = parts.join(', ');
    }
  }
}

customElements.define('passenger-picker', PassengerPicker);
