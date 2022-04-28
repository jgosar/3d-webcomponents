const colorPickerTemplate = document.createElement("template");
colorPickerTemplate.innerHTML = `
  <style>
    .color-picker{
      position: relative;
      right: 3vw;
      bottom: 3vw;
      width: 4vw;
      height: 4vw;
      background-image: conic-gradient(
        hsl(0, 100%, 50%),
        hsl(45, 100%, 50%),
        hsl(90, 100%, 50%),
        hsl(135, 100%, 50%),
        hsl(180, 100%, 50%),
        hsl(225, 100%, 50%),
        hsl(270, 100%, 50%),
        hsl(315, 100%, 50%),
        hsl(3600, 100%, 50%)
      );
      border-radius: 50%;
      transition: 200ms;
    }
    .color-picker:hover{
      width: 10vw;
      height: 10vw;
      right: 0;
      bottom: 0;
    }
  </style>
  <div class="color-picker">
	</div>
`;

class WctColorPicker extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.appendChild(colorPickerTemplate.content.cloneNode(true));

    this.setupClickListener();
  }

  static get observedAttributes() {
    return [];
  }

  setupClickListener() {
    const colorPickerElement = this.shadowRoot.querySelector(".color-picker");
    colorPickerElement.addEventListener("click", (event) =>
      this.pickColor(event)
    );
  }

  attributeChangedCallback(name, oldValue, newValue) {}

  pickColor(event) {
    const pickerWidth = event.target.clientWidth;
    const xFromCentre = event.offsetX - pickerWidth / 2;
    const yFromCentre = event.offsetY - pickerWidth / 2;
    let angleFromCentre = radiansToDegrees(
      Math.atan(xFromCentre / -yFromCentre)
    );
    if (yFromCentre > 0) {
      angleFromCentre += 180;
    }
    if (angleFromCentre < 0) {
      angleFromCentre += 360;
    }
    this.emitColorPickedEvent(event, Math.round(angleFromCentre));
  }

  emitColorPickedEvent(event, hue) {
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent("color-picked", {
        bubbles: true,
        composed: true,
        detail: {
          hue,
        },
      })
    );
    return false;
  }
}

window.customElements.define("wct-color-picker", WctColorPicker);
