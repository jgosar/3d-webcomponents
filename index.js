let boxes = [
  { x: 0, y: -1, z: 0 },
  { x: 1, y: -1, z: -1, hue: 10 },
  { x: 2, y: -1, z: -1, hue: 120 },
  { x: 2, y: -2, z: -2, hue: 60 },
  { x: 1, y: -2, z: -2, hue: 240 },
];

let floor = { x: 0, z: 0, width: 5, length: 3 };

window.onload = function () {
  renderBoxes();
  renderFloor();
};

function renderBoxes() {
  const boxesElement = document.getElementById("boxes");
  boxesElement.textContent = "";
  boxes.forEach((box) => {
    const boxElement = document.createElement("wct-box");
    Object.entries(box).forEach(([attrName, attrValue]) =>
      boxElement.setAttribute(attrName, attrValue)
    );
    boxElement.addEventListener("box-side-click", (event) =>
      boxClick(box, event)
    );
    boxesElement.appendChild(boxElement);
  });
}

function boxClick(box, event) {
  const action = event.detail.mouseButton === "left" ? "add" : "remove";
  if (action === "add") {
    const newBox = getNewBoxProps(box, event.detail.side);
    boxes.push(newBox);
  } else {
    boxes = boxes.filter((arrayBox) => arrayBox !== box);
  }
  renderBoxes();
}

function renderFloor() {
  const sceneElement = document.getElementById("scene");

  const floorElement = document.createElement("wct-floor");
  Object.entries(floor).forEach(([attrName, attrValue]) =>
    floorElement.setAttribute(attrName, attrValue)
  );
  floorElement.addEventListener("floor-tile-click", (event) =>
    floorTileClick(event)
  );

  sceneElement.appendChild(floorElement);
}

function floorTileClick(event) {
  const newBox = { x: event.detail.x, y: -1, z: event.detail.z };
  boxes.push(newBox);
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
