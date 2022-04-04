const template = document.createElement("template");
template.innerHTML = `
  <style>
	html {
	  transform-style: preserve-3d;
	}

  .animated {
    transition: 1s;
  }
	
	.box {
	  transform-style: preserve-3d;
	  --hue: 290; 
	}
	
	.box-side {
	  position: absolute;
	  top: 0;
	  right: 0;
	  bottom: 0;
	  left: 0;

	  background-size: 100%;
	}

	.box-back {
	  width: var(--box-width);
	  height: var(--box-height);
	  transform: translate3d(0px, 0px, 0px);
      background-color: hsl(var(--hue) var(--saturation) 10%);
	}

	.box-front {
	  width: var(--box-width);
	  height: var(--box-height);
	  transform: translate3d(0px, 0px, var(--box-length));
	  background-color: hsl(var(--hue) var(--saturation) 40%);
	}

	.box-left {
	  width: var(--box-length);
	  height: var(--box-height);
	  transform: translate3d(
		  calc(0px - var(--box-length) / 2),
		  0px,
		  calc(var(--box-length) / 2)
		)
		rotateY(90deg);
	  background-color: hsl(var(--hue) var(--saturation) 30%);
	}

	.box-right {
	  width: var(--box-length);
	  height: var(--box-height);
	  transform: translate3d(
		  calc(var(--box-width) - (var(--box-length) / 2)),
		  0px,
		  calc(var(--box-length) / 2)
		)
		rotateY(-90deg);
	  background-color: hsl(var(--hue) var(--saturation) 20%);
	}

	.box-top {
	  width: var(--box-width);
	  height: var(--box-length);
	  transform: translate3d(
		  0px,
		  calc(0px - var(--box-length) / 2),
		  calc(var(--box-length) / 2)
		)
		rotateX(90deg);
	  background-color: hsl(var(--hue) var(--saturation) 50%);
	}

	.box-bottom {
	  width: var(--box-width);
	  height: var(--box-length);
	  transform: translate3d(
		  0px,
		  calc((0px - var(--box-length) / 2) + var(--box-height)),
		  calc(var(--box-length) / 2)
		)
		rotateX(90deg);
	  background-color: hsl(var(--hue) var(--saturation) 0%);
	}
  </style>
  <div class="box animated" style="transform: translate3d(1vw, 1vw, -1vw);">
	</div>
`;

class WctBox extends HTMLElement {
  BOX_SIDES = ["front", "back", "top", "bottom", "left", "right"];
  boxPosition = { x: 0, y: 0, z: 0 };
  boxDimensions = { width: 1, height: 1, length: 1 };

  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.createBoxSides();
    this.updateBoxDimensions({});
    this.updateBoxPosition({});
  }

  static get observedAttributes() {
    return ["width", "height", "length", "x", "y", "z", "hue", "onclick"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (["width", "height", "length"].includes(name)) {
      this.updateBoxDimensions({ [name]: newValue });
    }
    if (["x", "y", "z"].includes(name)) {
      this.updateBoxPosition({ [name]: newValue });
    }
    if (name == "hue") {
      this.updateBoxProperties({ "--hue": newValue });
    }
  }

  updateBoxDimensions(dimensionsChanges) {
    this.boxDimensions = {
      ...this.boxDimensions,
      ...dimensionsChanges,
    };

    Object.entries(this.boxDimensions).forEach(
      ([dimensionName, dimensionValue]) =>
        this.setBoxStyleProperty(
          `--box-${dimensionName}`,
          `${dimensionValue}vw`
        )
    );
  }

  updateBoxPosition(positionChanges) {
    this.boxPosition = {
      ...this.boxPosition,
      ...positionChanges,
    };

    this.setBoxStyleProperty(
      "transform",
      `translate3d(${this.boxPosition.x}vw, ${this.boxPosition.y}vw, ${this.boxPosition.z}vw)`
    );
  }

  updateBoxProperties(properties) {
    Object.entries(properties).forEach(([propName, propValue]) =>
      this.setBoxStyleProperty(propName, propValue)
    );
  }

  createBoxSides() {
    const boxElement = this.shadowRoot.querySelector(".box");
    this.BOX_SIDES.forEach((boxSide) => {
      const sideElement = document.createElement("div");
      sideElement.classList.add("box-side");
      sideElement.classList.add(`box-${boxSide}`);
      sideElement.addEventListener("click", () => this.emitClickEvent(boxSide));
      boxElement.appendChild(sideElement);
    });
  }

  emitClickEvent(side) {
    this.dispatchEvent(
      new CustomEvent("box-side-click", {
        bubbles: true,
        composed: true,
        detail: {
          side,
        },
      })
    );
  }

  setBoxStyleProperty(property, value) {
    this.shadowRoot.querySelector(".box").style.setProperty(property, value);
  }
}

window.customElements.define("wct-box", WctBox);