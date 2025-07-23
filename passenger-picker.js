class PassengerPicker extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
        }

        .container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .input-box {
          width: 240px;
          padding: 10px 14px;
          border: 1px solid #a5d6a7;
          border-radius: 12px;
          font-size: 16px;
          cursor: pointer;
          outline: none;
          text-align: left;
        }

        .dropdown {
          display: none;
          width: 280px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
          padding: 10px;
          margin-top: 10px;
          z-index: 9999;
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

      <div class="container">
        <input type="text" id="passengerInput" class="input-box" readonly placeholder="Passenger Count" />
        <div class="dropdown" id="passengerDropdown">
          <div class="row">
            <div class="labels">
              <span>Adult</span>
              <span>(11+)</span>
            </div>
            <div class="controls">
              <button data-type="adult" data-dir="-1">−</button>
              <span id="adultCount">0</span>
              <button data-type="adult" data-dir="1">+</button>
            </div>
          </div>
          <div class="row">
            <div class="labels">
              <span>Child</span>
              <span>(2–11)</span>
            </div>
            <div class="controls">
              <button data-type="child" data-dir="-1">−</button>
              <span id="childCount">0</span>
              <button data-type="child" data-dir="1">+</button>
            </div>
          </div>
          <div class="row">
            <div class="labels">
              <span>Infant</span>
              <span>(0–2)</span>
            </div>
            <div class="controls">
              <button data-type="infant" data-dir="-1">−</button>
              <span id="infantCount">0</span>
              <button data-type="infant" data-dir="1">+</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const input = this.querySelector("#passengerInput");
    const dropdown = this.querySelector("#passengerDropdown");
    const counts = {
      adult: 0,
      child: 0,
      infant: 0
    };

    input.addEventListener("click", (e) => {
      dropdown.classList.toggle("active");
      e.stopPropagation();
    });

    document.addEventListener("click", (e) => {
      if (!this.contains(e.target)) {
        dropdown.classList.remove("active");
      }
    });

    const buttons = this.querySelectorAll("button[data-type]");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.getAttribute("data-type");
        const dir = parseInt(btn.getAttribute("data-dir"));
        counts[type] = Math.max(0, counts[type] + dir);
        this.querySelector(`#${type}Count`).textContent = counts[type];
        updateInput();
      });
    });

    const updateInput = () => {
      const total = counts.adult + counts.child + counts.infant;
      if (total === 0) {
        input.value = '';
        input.placeholder = "Passenger Count";
      } else {
        let parts = [];
        if (counts.adult > 0) parts.push(`${counts.adult} Adult${counts.adult > 1 ? 's' : ''}`);
        if (counts.child > 0) parts.push(`${counts.child} Child${counts.child > 1 ? 'ren' : ''}`);
        if (counts.infant > 0) parts.push(`${counts.infant} Infant${counts.infant > 1 ? 's' : ''}`);
        input.value = parts.join(', ');
      }
    };
  }
}

customElements.define('passenger-picker', PassengerPicker);
