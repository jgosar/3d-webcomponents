const boxes = [
  { x: 0, y: 0, z: 0 },
  { x: 1, y: 1, z: -1, hue: 10 },
  { x: 2, y: 1, z: -1, hue: 120 },
  { x: 2, y: 0, z: -2, width: 2, hue: 60 },
  { x: 1, y: 0, z: -2, hue: 240 },
];

window.onload = function () {
  renderBoxes();
};

function renderBoxes() {
  const sceneElement = document.getElementById("scene");
  sceneElement.innerHtml = "";
  boxes.forEach((box) => {
    const boxElement = document.createElement("wct-box");
    Object.entries(box).forEach(([attrName, attrValue]) =>
      boxElement.setAttribute(attrName, attrValue)
    );
    boxElement.addEventListener("box-side-click", (event) =>
      boxclick(box, event)
    );
    sceneElement.appendChild(boxElement);
  });
}

function boxclick(box, event) {
  console.log(`Box clicked on side: ${event.detail.side}`);
}
