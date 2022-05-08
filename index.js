let boxes = [];

let floor = { x: -5, z: -5, width: 10, length: 10 };

let camera = { x: 0, y: -6, z: 8.5, angleX: -35, angleY: 0 };
let hue = 225;

const POSITION_INTERVAL = 0.5;
const ANGLE_INTERVAL = 5;
const KEYDOWN_DEBOUNCE_MS = 200;
let pressedKeys = [];

window.onload = function () {
  loadBoxes();
  updateCameraParams(camera);
  setupKeyListeners();
  setupColorPickerListener();
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

function saveBoxes() {
  localStorage.setItem("3d-webcomponents_boxes", JSON.stringify(boxes));
}

function loadBoxes() {
  boxes = JSON.parse(localStorage.getItem("3d-webcomponents_boxes")) || [];
}

function boxClick(box, event) {
  const action = event.detail.mouseButton === "left" ? "add" : "remove";
  if (action === "add") {
    const newBox = getNewBoxProps(box, event.detail.side);
    boxes.push(newBox);
  } else {
    boxes = boxes.filter((arrayBox) => arrayBox !== box);
  }
  saveBoxes();
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
  const newBox = {
    x: event.detail.x + floor.x,
    y: -1,
    z: event.detail.z + floor.z,
    hue,
  };
  boxes.push(newBox);
  saveBoxes();
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
    hue,
  };
}

function updateCameraParams(changes) {
  const sceneElement = document.getElementById("scene");
  Object.entries(changes).forEach(([attrName, attrValue]) => {
    if (["x", "y", "z", "angleX", "angleY"].includes(attrName)) {
      camera[attrName] = attrValue;
      sceneElement.setAttribute(`camera-${attrName}`, attrValue);
    }
  });
}

function handlePressedKeys() {
  const keyHandlers = {
    KeyW: () => moveOneStepInRelativeDirection(0),
    KeyS: () => moveOneStepInRelativeDirection(180),
    KeyA: () => moveOneStepInRelativeDirection(270),
    KeyD: () => moveOneStepInRelativeDirection(90),
    KeyQ: () => updateCameraParams({ y: camera.y - POSITION_INTERVAL }),
    KeyY: () => updateCameraParams({ y: camera.y + POSITION_INTERVAL }),
    KeyZ: () => updateCameraParams({ y: camera.y + POSITION_INTERVAL }),
    ArrowLeft: () =>
      updateCameraParams({ angleY: camera.angleY - ANGLE_INTERVAL }),
    ArrowRight: () =>
      updateCameraParams({ angleY: camera.angleY + ANGLE_INTERVAL }),
    ArrowUp: () =>
      updateCameraParams({
        angleX: constrainValue(-90, camera.angleX + ANGLE_INTERVAL, 90),
      }),
    ArrowDown: () =>
      updateCameraParams({
        angleX: constrainValue(-90, camera.angleX - ANGLE_INTERVAL, 90),
      }),
  };

  pressedKeys.forEach((key) => keyHandlers[key]?.());
}

function setupKeyListeners() {
  setInterval(handlePressedKeys, KEYDOWN_DEBOUNCE_MS);

  document.addEventListener("keydown", (e) => {
    if (!pressedKeys.includes(e.code)) {
      pressedKeys = [...pressedKeys, e.code];
    }
  });
  document.addEventListener("keyup", (e) => {
    if (pressedKeys.includes(e.code)) {
      pressedKeys = pressedKeys.filter((keyCode) => keyCode !== e.code);
    }
  });
}

function setupColorPickerListener() {
  const colorPickerElenent = document.getElementById("color-picker");
  colorPickerElenent.addEventListener("color-picked", (event) => {
    console.log("color picked: " + event.detail.hue);
    hue = event.detail.hue;
  });
}

function moveOneStepInRelativeDirection(relativeAngle) {
  updateCameraParams(
    addCoordinates(
      camera,
      getPositionChange(camera.angleY + relativeAngle, POSITION_INTERVAL)
    )
  );
}
