import * as MyMath from '../Utils.js';

const Default_Node_Width = 80;

const toDegrees = (angle) => {
  return angle * (180 / Math.PI);
}

const calculateColor = (node, endPoint) => {

  const center = MyMath.centerOnNode(node.pos, node.diameter);
  const hypo = MyMath.distance(endPoint.x - center.x, endPoint.y - center.y);
  const adj = MyMath.distance(endPoint.x - center.x, 0);
  const angle = toDegrees(Math.acos(adj / hypo));
  const xDir = Math.sign(endPoint.x - center.x);
  const yDir = Math.sign(endPoint.y - center.y)

  let color;
  const computedColors = MyMath.rotateColors(node.colors, node.rot);
  if (xDir == 1 && angle < 45) {
    color = computedColors[1];
  }
  else if (xDir == -1 && angle < 45) {
    color = computedColors[3];
  }
  else if (yDir == -1 && angle >= 45) {
    color = computedColors[0];
  }
  else if (yDir == 1 && angle >= 45) {
    color = computedColors[2];
  }
  else {
    color = "grey";
  }

  return color;
}



/**
* 
* @param {} props 
*/
class Node {

  constructor(gridPos, point, colors, links, direction,diameter, savedNode) {
    if(savedNode) {
      this.loadSave(savedNode);
    }
    else { 
      this.gridPos = gridPos;
    this.pos = point;
    this.colors = colors;
    this.rot = 0;
    this.neighbors = []; // Adjacent Nodes 
    this.diameter = diameter || Default_Node_Width;
    this.links = links || []; // If this node is reached these nodes will rotate.
    this.direction = direction || -1; // rotation direction
    this.fixed = false; // if node is in visited nodes list can't rotate
    this.symbol = null;
    this.special = null;
    this.frozen = 0;
    }
  }


  // if the node is rotatable (not in the line's path) change colors + direction
  rotate(reverse) {
    const direction = reverse ? -this.direction : this.direction;
    if (!this.fixed && this.frozen == 0) {
      this.rot += direction;
    }
  }

  rotateLinked(reverse) {
    this.links.forEach(node => node.rotate(reverse));
  }


  // determines if point is inside of neighbor node and is also a match.
  // returns the matching node or null
  matchPoint(point) {
    const neighbor = this.insideNeighbor(point);
    if (neighbor) {
      //console.log(`inside neighbor:`);
      //console.log(` ${neighbor.pos.x} ${neighbor.pos.y}`);

      const matchColor = this.isMatch(neighbor);
      if (neighbor && matchColor) {
        return { candidate: neighbor, matchColor: matchColor };
      }
    }
    return { candidate: null, matchColor: null };

  }

  insideNeighbor(point) {
    return this.neighbors.find(neighbor => MyMath.pointInCircle(point, neighbor.pos, neighbor.diameter));
  }

  isNeighbor(node) {
    return this.neighbors.find(neighbor => neighbor === node);
  }

  isMatch(node) {
    let match = null;

    // get computed colors
    const compNodeRotatedColors = MyMath.rotateColors(node.colors, node.rot);
    const myNodeRotatedColors = MyMath.rotateColors(this.colors, this.rot);

    // node is a neighbor. must be above/below/left/right
    if (node.gridPos.row > this.gridPos.row) {
      // below current node. bottom == top
      match = compNodeRotatedColors[0] == myNodeRotatedColors[2] ? myNodeRotatedColors[2] : null;
    }
    else if (node.gridPos.row < this.gridPos.row) {
      // above of current node. top == bottom
      match = compNodeRotatedColors[2] == myNodeRotatedColors[0] ? myNodeRotatedColors[0] : null;
    }
    else if (node.gridPos.col > this.gridPos.col) {
      // right of current node. left == right
      match = compNodeRotatedColors[3] == myNodeRotatedColors[1] ? myNodeRotatedColors[1] : null;
    }
    else if (node.gridPos.col < this.gridPos.col) {
      // left of current node. right == left
      match = compNodeRotatedColors[1] == myNodeRotatedColors[3] ? myNodeRotatedColors[3] : null;
    }
    return match;
  }
  save() {
    const links = this.links.map(node => node.gridPos);
    const neighbors = this.neighbors.map(node => node.gridPos);

    return {
      gridPos: this.gridPos,
      symbol: this.symbol,
      colors: this.colors,
      links: links,
      special: this.special,
      rot: this.rot,
      direction: this.direction,
      fixed: this.fixed,
      pos: this.pos,
      diameter: this.diameter,
      neighbors: neighbors
    }
  }

  loadSave(savedNode) {
    this.gridPos = savedNode.gridPos;
    this.symbol = savedNode.symbol;
    this.colors = savedNode.colors;
    this.special = savedNode.special;
    this.rot = savedNode.rot;
    this.direction = savedNode.direction;
    this.fixed = savedNode.fixed;
    this.links = savedNode.links;
    this.pos = savedNode.pos;
    this.diameter = savedNode.diameter;
    this.neighbors = savedNode.neighbors;
  }


toString(){
  //return `Node: (row: ${this.gridPos.row}, col:${this.gridPos.col} )`;
  return JSON.stringify({
    gridPos: this.gridPos,
    symbol: this.symbol,
    colors: this.colors,
    links: this.links.map(node => node.gridPos)

  });//{
  // gridPos: JSON.stringify(this.gridPos),
  //  links: JSON.stringify(this.links)



  //});
}
  }

export default Node;