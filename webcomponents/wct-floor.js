const wctFloorTemplate = document.createElement("template");
wctFloorTemplate.innerHTML = `
  <style>
    html {
      transform-style: preserve-3d;
    }

    .floor{
	    transform-style: preserve-3d;
      width: var(--floor-width);
      height: var(--floor-length);
      transform: translate3d(
        var(--floor-x),
        calc(0px - var(--floor-length) / 2),
        calc(var(--floor-z) + var(--floor-length) / 2)
      )
      rotateX(90deg);
    }

    .floor-tile{
      width: 1em;
      height: 1em;
      background-color: white;
      border: 1px solid black;
      box-sizing: border-box;
      display: inline-block;
    }
  </style>
  <div class="floor" id="floor">
  </div>
`;

class WctFloor extends HTMLElement {
  floorPosition = { x: 0, y: 0, z: 0 };
  floorDimensions = { width: 1, length: 1 };

  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.appendChild(wctFloorTemplate.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["width", "length", "x", "y", "z"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (["width", "length"].includes(name)) {
      this.updateFloorDimensions({ [name]: newValue });
    }
    if (["x", "y", "z"].includes(name)) {
      this.updateFloorPosition({ [name]: newValue });
    }
  }

  updateFloorDimensions(dimensionsChanges) {
    this.floorDimensions = {
      ...this.floorDimensions,
      ...dimensionsChanges,
    };

    Object.entries(this.floorDimensions).forEach(
      ([dimensionName, dimensionValue]) =>
        this.setFloorStyleProperty(
          `--floor-${dimensionName}`,
          `${Math.floor(dimensionValue)}em`
        )
    );

    this.createFloorTiles();
  }

  updateFloorPosition(positionChanges) {
    this.floorPosition = {
      ...this.floorPosition,
      ...positionChanges,
    };

    Object.entries(this.floorPosition).forEach(
      ([dimensionName, dimensionValue]) =>
        this.setFloorStyleProperty(
          `--floor-${dimensionName}`,
          `${dimensionValue}em`
        )
    );
  }

  setFloorStyleProperty(property, value) {
    this.shadowRoot.querySelector(".floor").style.setProperty(property, value);
  }

  createFloorTiles() {
    const floorElement = this.shadowRoot.querySelector(".floor");
    floorElement.textContent = "";
    for (let z = 0; z < this.floorDimensions.length; z++) {
      for (let x = 0; x < this.floorDimensions.width; x++) {
        const tileElement = document.createElement("div");
        tileElement.classList.add("floor-tile");
        tileElement.addEventListener("click", (event) =>
          this.emitClickEvent(event, x, z)
        );

        floorElement.appendChild(tileElement);
      }
    }
  }

  emitClickEvent(event, x, z) {
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent("floor-tile-click", {
        bubbles: true,
        composed: true,
        detail: {
          x,
          z,
        },
      })
    );
    return false;
  }
}

window.customElements.define("wct-floor", WctFloor);
