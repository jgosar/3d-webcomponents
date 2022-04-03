function getCameraPositionFor(x, y, z, width) {
  // x, y, z: coordinates of the lower left corner of the object closest to the observer (with maximum z)
  // width: the width of the object we're looking at (size in direction x)
  // output: offset to which we need to move the view in order to see the object

  // First we determine where the centre of the object's top side is (For the sake of simplicity we assume the object's width equals its length)
  const objectTopCentre = negateCoordinates({
    x: x + width * 0.5,
    y: y,
    z: z - width * 0.5,
  });
  let offset = { x: 0, y: width * 0.4, z: -width * 0.8 };

  return addCoordinates(objectTopCentre, offset);
}

function addCoordinates(position1, position2) {
  const pos1 = position1 || { x: 0, y: 0, z: 0 };
  const pos2 = position2 || { x: 0, y: 0, z: 0 };

  return {
    x: pos1.x + pos2.x,
    y: pos1.y + pos2.y,
    z: pos1.z + pos2.z,
  };
}

function negateCoordinates(position) {
  const pos = position || { x: 0, y: 0, z: 0 };

  return {
    x: -pos.x,
    y: -pos.y,
    z: -pos.z,
  };
}
