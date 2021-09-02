
import * as MyMath from './MathStuff.js';
import {setupGrid as setupGridSolution } from './Pathing';
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

// brighter version
const colorScheme3 = 
{
    one:"rgba(226, 84, 132,1)", // magenta
    two: "rgba(140, 197, 245,1)", // blue
    three:  "rgba(255, 200, 95,1)",  //"rgba(255, 187, 95,1)", // orange
    four: "rgba(144, 200, 105,1)" // lime green
}

// better brighter version 
const colorScheme4 = 
{
  one:"rgba(255, 15, 96,1)", // magenta
  two: "rgba(30, 162, 255,1)", // blue
  three:  "rgba(255, 151, 15,1)",  // orange
  four: "rgba(132, 255, 15,1)" // lime green darker version: 69, 142, 0
}

// easier to read colors in printouts
const colorScheme5 = 
{
  one:'magenta', // magenta
  two: 'skyblue', // blue
  three:  'orange',  // orange
  four: 'forestgreen' // lime green darker version: 69, 142, 0
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

  const toDegrees = (angle) =>{
    return angle * (180 / Math.PI);
  }
  
  const calculateColor = (node, endPoint) => {
   
    const center = MyMath.centerOnNode(node.pos, node.diameter);
    const hypo  = MyMath.distance(endPoint.x - center.x, endPoint.y - center.y);
    const adj = MyMath.distance(endPoint.x - center.x, 0);
    const angle = toDegrees(Math.acos(adj/ hypo));
    const xDir = Math.sign(endPoint.x - center.x);
    const yDir = Math.sign(endPoint.y - center.y)
   
    let color;
    const computedColors = rotateColors(node.colors, node.rot);
    if(xDir == 1 &&  angle < 45) {
      color = computedColors[1];
    }
    else if(xDir == -1 && angle < 45) {
      color = computedColors[3];
    }
    else if( yDir == -1 && angle >= 45) {
      color = computedColors[0];
    }
    else if(yDir == 1 && angle >= 45){
      color = computedColors[2];
    }
    else {
      color = "grey";
    }
  
    return color;
  }

  const testColors = [colorScheme1.one, colorScheme1.four, colorScheme1.two, colorScheme1.three];
  const testColors2 = [colorScheme2.one, colorScheme2.four, colorScheme2.two, colorScheme2.three];
  
  const getColors = (colorSet) => {
    return Object.entries(colorSet).map((arr)=> arr[1]);
  }

  /**
 * 
 * @param {} props 
 */
  class Node {
       
      constructor(gridPos, point, diameter, colors, links, direction) {
        this.gridPos =gridPos;
        this.pos = point;
        this.colors = colors;
        this.rot = 0;
        this.neighbors = []; // Adjacent Nodes 
        this.diameter = diameter || Default_Node_Width;
        this.links = links || []; // If this node is reached these nodes will rotate.
        this.direction = direction || -1; // rotation direction
        this.fixed = false; // if node is in visited nodes list can't rotate
        this.symbol = null;
      }


      // if the node is rotatable (not in the line's path) change colors + direction
      rotate(reverse){
        const direction = reverse ? -this.direction : this.direction;
        if(!this.fixed) {
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
        if(neighbor) {
           //console.log(`inside neighbor:`);
           //console.log(` ${neighbor.pos.x} ${neighbor.pos.y}`);
        
        const matchColor = this.isMatch(neighbor);
        if(neighbor && matchColor){
            return {candidate: neighbor,matchColor: matchColor} ;
        }
      }
      return {candidate: null,matchColor: null} ;

    }

      insideNeighbor(point){
        return this.neighbors.find(neighbor=> MyMath.pointInCircle(point, neighbor.pos, neighbor.diameter));
      }

       isMatch (node){
        let match = null;
        
        // get computed colors
        const compNodeRotatedColors = rotateColors(node.colors, node.rot);
        const myNodeRotatedColors = rotateColors(this.colors, this.rot);
        
        // node is a neighbor. must be above/below/left/right
            if(node.gridPos.row > this.gridPos.row ) {
                // below current node. bottom == top
                match = compNodeRotatedColors[0] == myNodeRotatedColors[2] ? myNodeRotatedColors[2] : null;  
            }
            else if(node.gridPos.row < this.gridPos.row ) {
                // above of current node. top == bottom
                match = compNodeRotatedColors[2] == myNodeRotatedColors[0] ? myNodeRotatedColors[0] : null;  
            }
            else if(node.gridPos.col > this.gridPos.col ) {
                // right of current node. left == right
                match = compNodeRotatedColors[3] == myNodeRotatedColors[1] ? myNodeRotatedColors[1] : null;
            }
            else if(node.gridPos.col < this.gridPos.col ) {
                // left of current node. right == left
                match = compNodeRotatedColors[1] == myNodeRotatedColors[3] ? myNodeRotatedColors[3] : null;
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
        grid[i][j] = new Node(MyMath.gridPos(i,j), MyMath.point(x,y), diameter, testColors); 
      } 
    } 
    return grid; 
  }

  const setupGridFlex = (numRow, numCol, diameter) =>{ 
    const grid = []; 
    let x;
    let y;
    for (let i = 0; i < numRow; i++) { 
      grid[i] = []; 
      for (let j = 0; j < numCol; j++) { 
        grid[i][j] = new Node(MyMath.gridPos(i,j), MyMath.point(0,0), diameter, getColors(colorScheme1)); 

      } 
    } 
    return grid;
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
  const potentials = [MyMath.gridPos( i,j+1), //right
    MyMath.gridPos( i,j-1), //left
    MyMath.gridPos( i-1,j), // bottom
    MyMath.gridPos(i+1,j)];
    return potentials.filter(neighbor => isInBounds(neighbor, numRow, numCol));
  
}
const setStart = (grid,numRow,numCol,prevFinish) =>{ 

      if(!prevFinish) { // random start position
        const randGridPos = MyMath.gridPos(numRow-1,MyMath.randInt(0,numCol));
        return grid[randGridPos.row][randGridPos.col];

      }else{ // fixed start position and color
        // start is same col as prevFinish 
        const start = grid[numRow-1][prevFinish.gridPos.col];

        // the top/botom colors match
        while(start.colors[2] !== prevFinish.colors[0]){
          start.colors = rotateColors(start.colors, 1);
        }
        return start;
      }
}
// returns a 2d array. 
//Each element contains a list of the row/col positions of neighboring nodes. 
const getAllNeighbors = (numRow, numCol)  => {

    const grid = [];
    for(let i = 0; i <numRow;i++) {
        grid[i] = [];
        for(let j = 0; j< numCol; j++) {
            const potentials = [MyMath.gridPos( i,j+1), //right
              MyMath.gridPos( i,j-1), //left
              MyMath.gridPos( i-1,j), // bottom
              MyMath. gridPos(i+1,j)];// top
            grid[i][j] =  potentials.filter(neighbor => isInBounds(neighbor, numRow, numCol));
        }
    }

    return grid;
}

class Board {

    constructor (numRow, numCol, windowWidth, prevFinish) {
        console.log("new board");

        //this.grid = setupGrid(numRow, numCol, windowWidth, windowHeight);
        this.grid = setupGridFlex(numRow,numCol, .21 * windowWidth);
        this.setupNeighbors(numRow, numCol);
        
        const finish = MyMath.gridPos(0,MyMath.randInt(0,numCol));
        this.finish =  this.grid[finish.row][finish.col];
        this.start = setStart(this.grid, numRow, numCol, prevFinish);
        this.start.fixed = true;
        
        this.visitedNodes = [this.start];
        
        // rotate nodes properly
        setupGridSolution(this);
        //this.initialSetup = this.grid.map(this.row.map(node=> {return {...node};}));
    }
 
    setupNeighbors(numRow, numCol){
        const neighborGridPosArray2d = getAllNeighbors(numRow, numCol);
        
        this.grid.forEach((row,i)=> row.forEach((node,j)=> node.neighbors = this.getNodesFromGridPosArr(neighborGridPosArray2d[i][j])));
    }

    /**
    * Takes a list of node coordinaes in grid and returns a list of node objects
    * @param {[]} gridPosArr 
    */
    getNodesFromGridPosArr(gridPosArr) {
        return gridPosArr.map(gridPos => this.grid[gridPos.row][gridPos.col]);
    }

     getCurrentNode(){
        return this.visitedNodes[this.visitedNodes.length-1];
    }

    // checks if touch hits any of the nodes
    pointInNode(pos) {

    }

    // Checks if a line between two nodes already exists.
    // If two nodes are adjacent in visitedNodes a line exists.
    isPathOpen(curr, next){
      let prevNode;
     
      const results = this.visitedNodes.filter((node,ndx) => {
        if(ndx === 0) {
          prevNode = node;
        }
        else {
          if((curr === prevNode && next === node) || ((curr === node && next === prevNode) )) {
            // this path is closed!
            return true;
          }
          prevNode = node;
        }
      });

      if(results.length > 0) {
        return false;
      }else{
        return true;
      }
    }
    
    visitNode(nextNode) {
      const curr = this.visitedNodes[this.visitedNodes.length-1];
      if(curr === nextNode) {//can't visit myself
        return null;
      }
      if(this.isPathOpen(curr, nextNode)) {

       // console.log("adding node");
        this.visitedNodes = [...this.visitedNodes, nextNode];
        nextNode.fixed = true; 
      //  MyMath.logGridPos('next: ', nextNode.gridPos);
       // MyMath.logGridPos('  links: ', nextNode.links[0].gridPos);
        nextNode.rotateLinked();
        return nextNode;
      } 
      else {
        return null;
      }
      
    }

    removeLast(){
      if(this.visitedNodes.length <= 1){
        return null;
      }
      const current = this.visitedNodes.pop();
  
      // if current is not in visited list a second time, remove fixed
      const isStillThere = this.visitedNodes.find(node=> node === current);
      current.fixed = isStillThere ? true : false;

      const prev = this.visitedNodes[this.visitedNodes.length-1];
      
      current.rotateLinked(true); // reverse rotate

      return prev;

    }
 
    restart(){
  
    while(this.visitedNodes.length > 1){
      this.removeLast();
    }
    }

}


const ZeroNode = {pos: MyMath.point(0,0), diameter: Default_Node_Width, colors: getColors(colorScheme1) };
const testObj = {property:1, func: function() {console.log(this.property); this.property += 1000;}};

export {Board, calculateColor, toDegrees, ZeroNode, rotateColors};