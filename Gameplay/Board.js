
import * as MyMath from '../Utils.js';
import {setupGrid as setupGridSolution } from './Pathing';
import colorScheme from './ColorSchemes';

const Default_Node_Width = 75;

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
    const computedColors = MyMath.rotateColors(node.colors, node.rot);
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
        this.special = null;
        this.frozen = 0; // frozen zero times
      }


      // if the node is rotatable (not in the line's path) change colors + direction
      rotate(reverse){
        const direction = reverse ? -this.direction : this.direction;
        if(!this.fixed && this.frozen == 0) {
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
        const compNodeRotatedColors = MyMath.rotateColors(node.colors, node.rot);
        const myNodeRotatedColors = MyMath.rotateColors(this.colors, this.rot);
        
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

       toString(){
        return `Node: (row: ${this.gridPos.row}, col:${this.gridPos.col} )`;
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
        grid[i][j] = new Node(MyMath.gridPos(i,j), MyMath.point(x,y), diameter, getColors(colorScheme)); 
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
        grid[i][j] = new Node(MyMath.gridPos(i,j), MyMath.point(0,0), diameter, getColors(colorScheme)); 

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

const setStart = (grid,numRow,numCol,prevFinish, finalColor) =>{ 

      if(!prevFinish) { // random start position
        const randGridPos = MyMath.gridPos(numRow-1,MyMath.randInt(0,numCol));
        return grid[randGridPos.row][randGridPos.col];

      }else{ // fixed start position and color
        // start is same col as prevFinish 
        const start = grid[numRow-1][prevFinish.gridPos.col];
        // make top/botom colors match
        //const computedColors = rotateColors(prevFinish.colors, prevFinish.rot);

        if(finalColor) {
          while(start.colors[2] !== finalColor){
            start.colors = MyMath.rotateColors(start.colors, 1);
           }
        }
        
        return start;
      }
}

const copyBoardData = (prevGrid) => { 
    return prevGrid.map( row =>
    row.map(node=> {
    return  new Node(MyMath.gridPos(node.gridPos.row, node.gridPos.col),
             MyMath.point(node.pos.x, node.pos.y),
             node.diameter,
             node.colors);  

    }
              
      ));     

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
              MyMath.gridPos(i+1,j)];// top
            grid[i][j] =  potentials.filter(neighbor => isInBounds(neighbor, numRow, numCol));
        }
    }

    return grid;
}

const NodeWidth = .2
class Board {

    constructor (numRow, numCol, windowWidth, prevBoard) {

        if(!prevBoard) {
          console.log("new board");
          this.grid = setupGridFlex(numRow,numCol, NodeWidth * windowWidth);
          this.start = setStart(this.grid, numRow, numCol);

        }
        else {
          console.log("new board with prevBoard");
          this.grid = copyBoardData(prevBoard.grid);
          this.start = setStart(this.grid, numRow, numCol, prevBoard.finish, prevBoard.finalColor);
        }

        this.setupNeighbors(numRow, numCol);

        const finish = MyMath.gridPos(0,MyMath.randInt(0,numCol));
        this.finish =  this.grid[finish.row][finish.col];
        
        this.start.fixed = true;
        this.visitedNodes = [this.start]; 
        //console.log(`  startColors[2]: ${this.start.colors[2]}`);

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
        if(!nextNode.special) {
          nextNode.rotateLinked();
        } else if (nextNode.special === 'freezer'){
          // don't rotate links, instead add a freeze
          nextNode.links.forEach(node=> node.frozen++);

        } else if (nextNode.special === 'rotateCC') {
          nextNode.links.forEach(node=> node.direction = 1);
          nextNode.rotateLinked();
        }
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
  
      // if current is not in visited list a second time,
      const isStillThere = this.visitedNodes.find(node=> node === current);
      current.fixed = (isStillThere) ? true : false;

      // if node is a freeze-node, and it is not in visitedNodes list a second time, 
      // remove a freeze from its links
      if(current.special == 'freezer' && !isStillThere ) {
        // if the node is frozen two or more times,
        // both freezes need to be removed before the node rotates again.
        current.links.forEach(node=> node.frozen--);
        // don't reverse rotate linked nodes if node is a freeze
      } else if(current.special !== 'freezer') {
        current.rotateLinked(true); // reverse rotate

      } 

      if(current.special === 'rotateCC' && !isStillThere ){
        // change direction, after rotating
         current.links.forEach(node=> node.direction = -1);
        
      }
      const prev = this.visitedNodes[this.visitedNodes.length-1];
      

      return prev;

    }
 
    restart(){
  
    while(this.visitedNodes.length > 1){
      this.removeLast();
    }
    }

    /**
     * user requests hint. 
     * compare visitedNodes to solution. 
     * when visitedNodes[i] !== solution[i]. stop. 
     * remove all nodes after i from visitedNodes. Add solution[i] to visited nodes
     */
    hint(){
      let ndx = 0;
      const solution = this.solution.map(node=>node.toString()).join('\n');
      const visitedNodes = this.visitedNodes.map(node=>node.toString()).join('\n');

      while(this.visitedNodes[ndx] === this.solution[ndx]) {
        ndx++;
      }

      const removeCount = this.visitedNodes.filter((node, i)=> i>=ndx).length;

      const nextNode = this.solution[ndx];

      return {removeCount, nextNode};

    }

}



export {Board, calculateColor, toDegrees};