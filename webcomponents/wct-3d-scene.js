const template2 = document.createElement("template");
template2.innerHTML = `
	<style>
		.wrapper {
		  --perspective: 50vw;
		  position: absolute;
		  height: 100vh;
		  width: 100vw;
		  overflow: hidden;
		  perspective: var(--perspective); 
		  background: linear-gradient(
			180deg,
			rgba(9, 154, 221, 1) 0%,
			rgba(0, 212, 255, 1) 20%,
			rgba(0, 255, 29, 1) 50%
		  );
		  --saturation: 90%;
		}

		.three-d-container {
		  transform-style: preserve-3d;
		  display: block;
		}

		.animated {
		  transition: 1s;
		}

		.translated-to-screen-centre {
		  --camera-rotation-x: -35deg;
		  --camera-rotation-y: 0;
		  transform: translate3d(50vw, 50vh, var(--perspective)) rotateX(var(--camera-rotation-x)) rotateY(var(--camera-rotation-y));
		  position: absolute;
		  z-index: 1;
		}
	</style>
	<div class="wrapper">
		<div class="three-d-container animated translated-to-screen-centre">
			<div id="translated-to-camera-pos" class="three-d-container animated">
				<slot></slot>
			</div>
		</div>
	</div>
`;

class Wct3dScene extends HTMLElement {
  cameraPosition = { x: "0", y: "0", z: "0" };

  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.appendChild(template2.content.cloneNode(true));
    this.updateCameraPosition({});
  }

  static get observedAttributes() {
    return ["camera-x", "camera-y", "camera-z"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "camera-x") {
      this.updateCameraPosition({ x: newValue });
    }
    if (name == "camera-y") {
      this.updateCameraPosition({ y: newValue });
    }
    if (name == "camera-z") {
      this.updateCameraPosition({ z: newValue });
    }
  }

  updateCameraPosition(positionChanges) {
    this.cameraPosition = {
      ...this.cameraPosition,
      ...positionChanges,
    };

    this.shadowRoot
      .querySelector("#translated-to-camera-pos")
      .style.setProperty(
        "transform",
        `translate3d(${this.negateNumber(
          this.cameraPosition.x
        )}, ${this.negateNumber(this.cameraPosition.y)}, ${this.negateNumber(
          this.cameraPosition.z
        )})`
      );
  }

  negateNumber(numberString) {
    if (numberString.startsWith("-")) {
      return numberString.substring(1);
    } else {
      return `-${numberString}`;
    }
  }
}

window.customElements.define("wct-3d-scene", Wct3dScene);
