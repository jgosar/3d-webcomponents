const template = document.createElement("template");
template.innerHTML = `
  <style>
	html {
	  transform-style: preserve-3d;
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
  <div class="box" style="transform: translate3d(200vw, 200vw, -200vw);">
	  <div class="box-side box-top"></div>
	  <div class="box-side box-back"></div>
	  <div class="box-side box-front"></div>
	  <div class="box-side box-right"></div>
	  <div class="box-side box-left"></div>
	  <div class="box-side box-bottom"></div>
	</div>
`;

class WctBox extends HTMLElement {
  boxPosition = { x: 0, y: 0, z: 0 };

  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["width", "height", "length", "x", "y", "z", "hue"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "width") {
      this.shadowRoot
        .querySelector(".box")
        .style.setProperty("--box-width", newValue);
    }
    if (name == "height") {
      this.shadowRoot
        .querySelector(".box")
        .style.setProperty("--box-height", newValue);
    }
    if (name == "length") {
      this.shadowRoot
        .querySelector(".box")
        .style.setProperty("--box-length", newValue);
    }
    if (name == "x") {
      this.updateBoxPosition({ x: newValue });
    }
    if (name == "y") {
      this.updateBoxPosition({ y: newValue });
    }
    if (name == "z") {
      this.updateBoxPosition({ z: newValue });
    }
    if (name == "hue") {
      this.updateBoxProperties({ "--hue": newValue });
    }
  }

  updateBoxPosition(positionChanges) {
    this.boxPosition = {
      ...this.boxPosition,
      ...positionChanges,
    };

    this.shadowRoot
      .querySelector(".box")
      .style.setProperty(
        "transform",
        `translate3d(${this.boxPosition.x}, ${this.boxPosition.y}, ${this.boxPosition.z})`
      );
  }

  updateBoxProperties(properties) {
    Object.entries(properties).forEach(([propName, propValue]) =>
      this.shadowRoot
        .querySelector(".box")
        .style.setProperty(propName, propValue)
    );
  }
}

window.customElements.define("wct-box", WctBox);
