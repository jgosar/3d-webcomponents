const POSITION_INTERVAL = 0.5;
const ANGLE_INTERVAL = 5;
const KEYDOWN_DEBOUNCE_MS = 200;

const appState = {
  boxes: [],
  floor: { x: -5, z: -5, width: 10, length: 10 },
  camera: { x: 0, y: -6, z: 8.5, angleX: -35, angleY: 0 },
  hue: 225,
};
let pressedKeys = [];

window.onload = function () {
  loadBoxes();
  updateCameraParams(appState.camera);
  setupKeyListeners();
  setupColorPickerListener();
  renderBoxes();
  renderFloor();
};

////////////////////////////////Local storage////////////////////////////////
function saveBoxes() {
  localStorage.setItem(
    "3d-webcomponents_boxes",
    JSON.stringify(appState.boxes)
  );
}

function loadBoxes() {
  appState.boxes =
    JSON.parse(localStorage.getItem("3d-webcomponents_boxes")) || [];
}
////////////////////////////////Local storage////////////////////////////////

////////////////////////////////Create DOM from JSON////////////////////////////////
function renderBoxes() {
  const boxesElement = document.getElementById("boxes");
  boxesElement.textContent = "";
  appState.boxes.forEach((box) => {
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

function renderFloor() {
  const sceneElement = document.getElementById("scene");

  const floorElement = document.createElement("wct-floor");
  Object.entries(appState.floor).forEach(([attrName, attrValue]) =>
    floorElement.setAttribute(attrName, attrValue)
  );
  floorElement.addEventListener("floor-tile-click", (event) =>
    floorTileClick(event)
  );

  sceneElement.appendChild(floorElement);
}

function updateCameraParams(changes) {
  const sceneElement = document.getElementById("scene");
  Object.entries(changes).forEach(([attrName, attrValue]) => {
    if (["x", "y", "z", "angleX", "angleY"].includes(attrName)) {
      appState.camera[attrName] = attrValue;
      sceneElement.setAttribute(`camera-${attrName}`, attrValue);
    }
  });
}
////////////////////////////////Create DOM from JSON////////////////////////////////

////////////////////////////////Handle click events////////////////////////////////
function boxClick(box, event) {
  const action = event.detail.mouseButton === "left" ? "add" : "remove";
  if (action === "add") {
    const newBox = getNewBoxProps(box, event.detail.side);
    appState.boxes.push(newBox);
  } else {
    appState.boxes = appState.boxes.filter((arrayBox) => arrayBox !== box);
  }
  saveBoxes();
  renderBoxes();
}

function getNewBoxProps(parentBox, side) {
  const positionDiffBySide = {
    right: { x: 1 },
    left: { x: -1 },
    bottom: { y: 1 },
    top: { y: -1 },
    front: { z: 1 },
    back: { z: -1 },
  };

  const positionDiff = positionDiffBySide[side];
  return { ...addCoordinates(parentBox, positionDiff), hue };
}

function floorTileClick(event) {
  const newBox = {
    x: event.detail.x + appState.floor.x,
    y: -1,
    z: event.detail.z + appState.floor.z,
    hue,
  };
  appState.boxes.push(newBox);
  saveBoxes();
  renderBoxes();
}

function setupColorPickerListener() {
  const colorPickerElenent = document.getElementById("color-picker");
  colorPickerElenent.addEventListener("color-picked", (event) => {
    console.log("color picked: " + event.detail.hue);
    hue = event.detail.hue;
  });
}
////////////////////////////////Handle click events////////////////////////////////

////////////////////////////////Keyboard events////////////////////////////////
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

function handlePressedKeys() {
  const keyHandlers = {
    KeyW: () => moveOneStepInRelativeDirection(0),
    KeyS: () => moveOneStepInRelativeDirection(180),
    KeyA: () => moveOneStepInRelativeDirection(270),
    KeyD: () => moveOneStepInRelativeDirection(90),
    KeyQ: () =>
      updateCameraParams({ y: appState.camera.y - POSITION_INTERVAL }),
    KeyY: () =>
      updateCameraParams({ y: appState.camera.y + POSITION_INTERVAL }),
    KeyZ: () =>
      updateCameraParams({ y: appState.camera.y + POSITION_INTERVAL }),
    ArrowLeft: () =>
      updateCameraParams({ angleY: appState.camera.angleY - ANGLE_INTERVAL }),
    ArrowRight: () =>
      updateCameraParams({ angleY: appState.camera.angleY + ANGLE_INTERVAL }),
    ArrowUp: () =>
      updateCameraParams({
        angleX: constrainValue(
          -90,
          appState.camera.angleX + ANGLE_INTERVAL,
          90
        ),
      }),
    ArrowDown: () =>
      updateCameraParams({
        angleX: constrainValue(
          -90,
          appState.camera.angleX - ANGLE_INTERVAL,
          90
        ),
      }),
  };

  pressedKeys.forEach((key) => keyHandlers[key]?.());
}

function moveOneStepInRelativeDirection(relativeAngle) {
  updateCameraParams(
    addCoordinates(
      appState.camera,
      getPositionChange(
        appState.camera.angleY + relativeAngle,
        POSITION_INTERVAL
      )
    )
  );
}
////////////////////////////////Keyboard events////////////////////////////////
