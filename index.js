let boxes = [
  { x: 0, y: 0, z: 0 },
  { x: 1, y: 1, z: -1, hue: 10 },
  { x: 2, y: 1, z: -1, hue: 120 },
  { x: 2, y: 0, z: -2, hue: 60 },
  { x: 1, y: 0, z: -2, hue: 240 },
];

window.onload = function () {
  renderBoxes();
};

function renderBoxes() {
  const sceneElement = document.getElementById("scene");
  sceneElement.textContent = "";
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
  const action = event.detail.mouseButton === "right" ? "add" : "remove";
  if (action === "add") {
    const newBox = getNewBoxProps(box, event.detail.side);
    boxes.push(newBox);
  } else {
    boxes = boxes.filter((arrayBox) => arrayBox !== box);
  }
  renderBoxes();
}

function getNewBoxProps(parentBox, side) {
  return {
    ...parentBox,
    x:
      side === "right"
        ? parentBox.x + 1
        : side === "left"
        ? parentBox.x - 1
        : parentBox.x,
    y:
      side === "bottom"
        ? parentBox.y + 1
        : side === "top"
        ? parentBox.y - 1
        : parentBox.y,
    z:
      side === "front"
        ? parentBox.z + 1
        : side === "back"
        ? parentBox.z - 1
        : parentBox.z,
  };
}
