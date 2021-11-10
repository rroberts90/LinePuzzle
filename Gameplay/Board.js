
import * as MyMath from '../Utils.js';
import {setupGrid as setupGridSolution } from './Pathing';
import colorScheme from './ColorSchemes';

import { getItem, storeItem } from '../Storage.js';
import Node from './Node'

const getColors = (colorSet) => {
  return Object.entries(colorSet).map((arr)=> arr[1]);
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

const NodeWidth = .2;

const calcNodeWidth = (cols, width) => {
  if (cols ===5) {
    return .17  * width;
  }else {
    return .2 * width;
  }
}

const gameSizes = {
  tutorial: MyMath.gridPos(6, 1),
  endless: MyMath.gridPos(6,4),
  timed: MyMath.gridPos(6,4),
  puzzle: MyMath.gridPos(7,5)
};

const gameDims = (game) => { 

  return gameSizes[game];
 }

/*const tutorialBoard = (level) => {
  switch(level) {
    case -5:
      return {
          colors: [colorScheme.one,colorScheme.two, colorScheme.three, colorScheme.four],

      }
  }
}*/

  class Board {

    constructor (game, level, windowWidth, prevBoard) {
        console.log(`new ${game} board.`);
        const {row: numRow, col: numCol} = gameDims(game, level);
        const nodeWidth = calcNodeWidth(numCol, windowWidth);
        this.gameType = game;
        
        if(!prevBoard) {
          //console.log("new board");
          this.grid = setupGridFlex(numRow,numCol, nodeWidth);
          this.start = setStart(this.grid, numRow, numCol);

        }
        else {
          //console.log("new board with prevBoard");
          this.grid = copyBoardData(prevBoard.grid);
          this.start = setStart(this.grid, numRow, numCol, prevBoard.finish, prevBoard.finalColor);
        }

        this.setupNeighbors(numRow, numCol);

        const finish = MyMath.gridPos(0,MyMath.randInt(0,numCol));
        this.finish =  this.grid[finish.row][finish.col];
        
        this.start.fixed = true;
        this.visitedNodes = [this.start]; 


        setupGridSolution(this, game, level);

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
          this.grid.forEach((row) => row.forEach(node => {
            node.direction = 1;
        }));
                  nextNode.rotateLinked();
        }
        return {next: nextNode, prev: null};
      } 
      else {
        return {next: null, prev: nextNode};
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
      if(current.special == 'freezer'  ) {
        // -------> I think this is wrong. frozen is ++ every time it is visited if -- each time as well will even out>
        //if the node is frozen two or more times,
        // both freezes need to be removed before the node rotates again.
        current.links.forEach(node=> node.frozen--);
        // don't reverse rotate linked nodes if node is a freeze
      } else if(current.special !== 'freezer') {
        current.rotateLinked(true); // reverse rotate

      } 
      const ccRemaining = this.visitedNodes.find(node=> node.special==='rotateCC');
      if(current.special === 'rotateCC' && !ccRemaining ){
        // change direction, after rotating
        this.grid.forEach((row) => row.forEach(node => {
          node.direction = -1;
      }));        
      }
      const prev = this.visitedNodes[this.visitedNodes.length-1];
      

      return prev;

    }
 
    restart(){
  
    while(this.visitedNodes.length > 1){
      this.removeLast();
    }
    this.resetGrid();

    }

    resetGrid() {
      this.grid.forEach((row) => row.forEach(node => {node.fixed = false; node.rot = 0}));
      this.visitedNodes = [this.start];
      
      this.start.fixed = true;
  
      this.grid.forEach((row) => row.forEach(node =>  {
          node.frozen = 0;
          node.direction=-1;}));
    }

    /**
     * user requests hint. 
     * compare visitedNodes to solution. 
     * when visitedNodes[i] !== solution[i]. stop. 
     * remove all nodes after i from visitedNodes. Add solution[i] to visited nodes
     */
    hint(){
      let ndx = 0;
      //const solution = this.solution.map(node=>node.toString()).join('\n');
      //const visitedNodes = this.visitedNodes.map(node=>node.toString()).join('\n');

      while(this.visitedNodes[ndx] === this.solution[ndx]) {
        ndx++;
      }

      const removeCount = this.visitedNodes.filter((node, i)=> i>=ndx).length;

      const nextNode = this.solution[ndx];

      return {removeCount, nextNode};

    }

    toString(){
      const nodes =  this.grid.reduce((flat, row) => [...flat, ...row]);
      return nodes.map(node=>node.toString()).join(' ');

    }

}

  export {Board};