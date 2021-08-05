
import { useWindowDimensions } from 'react-native';

const Default_Node_Width = 75;

const colorScheme1 =
{
  one: "rgba(231, 48, 110,1)", // magenta
  two: "rgba(47, 127, 183,1)", // blue
  three: "rgba(255, 167, 53,1)", // orange
  four: "rgba(103, 142, 66,1)" // lime green
}

const colorScheme2 =
{
  one: "rgba(255, 86, 154,1)", // magenta
  two: "rgba(91, 224, 255,1)", // blue
  three: "rgba(255, 170, 86,1)", // orange
  four: "rgba(141, 255, 164,1)" // lime green
}


const distance = (dx, dy) => {
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
  }
  
  const centerOnNode = (pos, diameter) => {
      return { x: pos.x + diameter / 2, y: pos.y + diameter / 2 };
  }
  
  const centerOnNodeFlipped = (pos, diameter) => {
    return { x: pos.x - diameter / 4, y: pos.y - diameter / 4 };
}

  // note: breaks if rotating counter clockwise by more than 1 at a time.
  const rotateColors = (colors, rot) => {
    return colors.map((val, i) => {
      if (i + rot < 0) {
        return colors[colors.length - 1];
      }
      else {
        return colors[(i + rot) % 4]
      }
    })
  }


  const toDegrees = (angle) =>{
    return angle * (180 / Math.PI);
  }
  
  const calculateColor = (node, endPoint) => {
   
    const center = centerOnNode(node.pos, node.diameter);
    const hypo  = distance(endPoint.x - center.x, endPoint.y - center.y);
    const adj = distance(endPoint.x - center.x, 0);
    const angle = toDegrees(Math.acos(adj/ hypo));
    const xDir = Math.sign(endPoint.x - center.x);
    const yDir = Math.sign(endPoint.y - center.y)
   
    let color;
    if(xDir == 1 &&  angle < 45) {
      color = node.colors[1];
    }
    else if(xDir == -1 && angle < 45) {
      color = node.colors[3];
    }
    else if( yDir == -1 && angle >= 45) {
      color = node.colors[0];
    }
    else if(yDir == 1 && angle >= 45){
      color = node.colors[2];
    }
    else {
      color = "grey";
    }
  
    return color;
  }

  const testColors = [colorScheme1.one, colorScheme1.four, colorScheme1.two, colorScheme1.three];
  const testColors2 = [colorScheme2.one, colorScheme2.four, colorScheme2.two, colorScheme2.three];

  class Node {

      constructor(row, col, x, y, diameter, colors,neighbors, links, direction) {
        this.gridPos = { row: row, col: col };
        this.pos = { x: x, y: y };
        this.colors = colors;
        this.rot = 0;
        this.neighbors = neighbors; // array of gridPos objects adjacent to node
        this.diameter = diameter || Default_Node_Width;
        this.links = links || []; // array of nodes to rotate when node is touched
        this.direction = direction || -1; // rotation direction
      }

      rotate(){
          this.rot += this.direction;
          this.colors = rotateColors(this.colors, this.direction);
      }

      rotateLinked() {
        this.links.forEach(node => node.rotate());
      }

      isNeighbor(node){
            return this.neighbors.some(gridPos=> 
            gridPos.row == node.gridPos.row && gridPos.col == node.gridPos.col);
      }

       isMatch (node2){
        let match;
        if(this.gridPos.row == node2.gridPos.row && this.gridPos.col == node2.gridPos.col) {
           console.log("isMatch detecting a node touching itself");
           match = false;
        }
        else if(this.isNeighbor(node)) {
            // node is a neighbor. must be above/below/left/right
            if(node.gridPos.row > this.gridPos.row ) {
                // right of current node. left == right
               match = node.colors[3] == this.colors[1] ? true : false;    
            }
            else if(node.gridPos.row < this.gridPos.row ) {
                // left of current node. right == left
                match = node.colors[1] == this.colors[3] ? true : false;
            }
            else if(node.gridPos.col > this.gridPos.col ) {
                // above current node. bottom == top
               match = node.colors[2] == this.colors[0] ? true : false;    
            }
            else if(node.gridPos.col < this.gridPos.col ) {
                // below current node. top == bottom
               match = node.colors[0] == this.colors[2] ? true : false;    
            }
        } 
        else {
            match = false;
        }
        return match;
      }
  }

  const setupGrid = (numRow, numCol, windowWidth, windowHeight) =>{ 
    const grid = []; 
    const diameter = (3/20) * windowWidth;
    const margin = (3/60) * windowWidth;
    const topMargin = 100;
    let x;
    let y;
    for (let i = 0; i < numRow; i++) { 
      grid[i] = []; 
      y = margin*2 + diameter * i + margin * i + topMargin;
      for (let j = 0; j < numCol; j++) { 
        x = margin/2 + diameter * j + margin * j;
        grid[i][j] = new Node(i, j, x, y, diameter, testColors ); 
      } 
    } 
    return grid;
  }

  const setupGridFlex = (numRow, numCol, diameter, neighbors) =>{ 
    const grid = []; 
    let x;
    let y;
    for (let i = 0; i < numRow; i++) { 
      grid[i] = []; 
      for (let j = 0; j < numCol; j++) { 
        grid[i][j] = new Node(i, j, 0, 0, diameter, testColors, neighbors[i][j]); 

      } 
    } 
    return grid;
  }

const gridPos = (row, col) => {
    return {row:row, col:col}
}

const isInBounds = (gridPos, numRow, numCol) => {

    if(gridPos.row < 0 || gridPos.row > numRow-1 || 
        gridPos.col < 0 || gridPos.col > numCol-1 ) {
            return false;
        }
    else {
        return true;
    }
}

const getNeighbors =  (i,j, numRow, numCol) => {
    const potentials = [gridPos(j+1, i), 
        gridPos(j-1, i), 
        gridPos(j, i-1), 
        gridPos(j,i+1)];
    return potentials.filter(neighbor => isInBounds(neighbor, numRow, numCol));
  
}

const getAllNeighbors = (numRow, numCol)  => {

    const grid = [];
    for(let i = 0; i <numCol;i++) {
        grid[i] = [];
        for(let j = 0; j< numRow; j++) {
            const potentials = [gridPos(j+1, i), 
                          gridPos(j-1, i), 
                          gridPos(j, i-1), 
                          gridPos(j,i+1)];
            grid[i][j] =  potentials.filter(neighbor => isInBounds(neighbor, numRow, numCol));
        }
    }

    return grid;
}


class Board {

    constructor (numRow, numCol, start, finish) {
        const windowWidth = useWindowDimensions().width;
        const windowHeight = useWindowDimensions().height;

        //this.grid = setupGrid(numRow, numCol, windowWidth, windowHeight);
        const neighbors = getAllNeighbors(numRow, numCol);
        this.grid = setupGridFlex(numRow,numCol, .15 * windowWidth, neighbors);
        
        this.visitedNodes = [this.grid[start.row][start.col]];

    }

     getCurrentNode(){
        return this.visitedNodes[this.visitedNodes.length-1];
    }

    // checks if touch hits any of the nodes
    pointInNode(pos) {

    }


}



export {Board, centerOnNode, distance, rotateColors, calculateColor, toDegrees, centerOnNodeFlipped };