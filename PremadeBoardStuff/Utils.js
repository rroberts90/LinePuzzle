const gridPos = (row, col) => {
  return {row:row, col:col};
}

const point = (x,y) => {
  return {x:x,y:y};
}

/**
* 
* @param {*} point 
* @param {*} topLeft 
* @param {*} diameter 
* @returns 
*/
const pointInCircle = (point, topLeft, diameter) => {
  return pic(point, centerOnNode(topLeft, diameter), diameter/2);
}
// inside circle if distance^2 < radius^2
const pic = (point, center,r ) => {
  const d = distance(point.x - center.x, point.y - center.y);
  return Math.pow(d,2) <= Math.pow(r,2) ? true : false;
}

const centerOnNode = (pos, diameter) => {
    return { x: pos.x + diameter / 2, y: pos.y + diameter / 2 };
}

const centerOnNodeFlipped = (pos, diameter) => {
  return { x: pos.x - diameter / 4, y: pos.y - diameter / 4 };
}

const distance = (dx, dy) => {
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
}

const convertToLayout = (pos) => {
  return { left: pos.x, top: pos.y };
}


const logPoint = (name,point) => {
  console.log(`${name}: ${point.x} ${point.y}`);
}

const logGridPos = (name,gPos) => {
  if(gPos){
  console.log(`${name}: ${gPos.row} ${gPos.col}`);
  }else {
      console.log('not a gPos');
  }
}

const compareGridPos = (gPos1, gPos2) => {
  return gPos1.row == gPos2.row && gPos1.col == gPos2.col;
}

const rotateArray = (arr, rot) => {
  return arr.map((val, i) => {
    if (i + rot < 0) {
      return arr[arr.length - 1];
    }
    else {
      return arr[(i + rot) % 4]
    }
  })
}

const rotateColors = (colors, rot) => {
  return colors.map((val, i) => {
    if (rot < 0) { // reverse case
      const rot2 = rot  % 4;
      if (i + rot2 < 0) {// wrap around 
        return colors[colors.length + i + rot2];
      }
      else{  // no wrap
        return colors[i+rot2];
      }
    }
    else {
      return colors[(i + rot) % 4]
    }
  })
}
const logColors  = (colors) => {
//   logGridPos('    node', gridPos);
  console.log(`     top: ${colors[0]}`);
  console.log(`     right: ${colors[1]}`);
  console.log(`     bottom: ${colors[2]}`);
  console.log(`     left: ${colors[3]}`);



}

/**
* 
* @param {*} min - inclusive
* @param {*} max - exclusive
*/
const randInt = (min,max)  => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const compressGridPos = (gridPos)=> {
  return [gridPos.row, gridPos.col];
}

const _compressGridPos = compressGridPos;
export {_compressGridPos as compressGridPos};
const _logGridPos = logGridPos;
export { _logGridPos as logGridPos };
const _gridPos = gridPos;
export { _gridPos as gridPos };
const _rotateColors = rotateColors;
export { _rotateColors as rotateColors };
const _randInt = randInt;
export { _randInt as randInt };
const _rotateArray = rotateArray;
export { _rotateArray as rotateArray };

const _point = point;
export { _point as point };