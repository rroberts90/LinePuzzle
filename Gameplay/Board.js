
import * as MyMath from '../Utils.js';
import { setupGrid as setupGridSolution } from './Pathing';
import colorScheme from './ColorSchemes';

import Node from './Node'
import getPuzzlePack from '../PremadeBoardStuff/Output/getPuzzlePack.js';

const getColors = (colorSet) => {
  return Object.entries(colorSet).map((arr) => arr[1]);
}

const setupGridFlex = (numRow, numCol) => {
  const grid = [];
  let x;
  let y;
  for (let i = 0; i < numRow; i++) {
    grid[i] = [];
    for (let j = 0; j < numCol; j++) {
      grid[i][j] = new Node(MyMath.gridPos(i, j), MyMath.point(0, 0), getColors(colorScheme));

    }
  }
  return grid;
}


const isInBounds = (gridPos, numRow, numCol) => {

  if (gridPos.row < 0 || gridPos.row > numRow - 1 ||
    gridPos.col < 0 || gridPos.col > numCol - 1) {
    return false;
  }
  else {
    return true;
  }
}

const getNeighbors = (i, j, numRow, numCol) => {
  const potentials = [MyMath.gridPos(i, j + 1), //right
  MyMath.gridPos(i, j - 1), //left
  MyMath.gridPos(i - 1, j), // bottom
  MyMath.gridPos(i + 1, j)];
  return potentials.filter(neighbor => isInBounds(neighbor, numRow, numCol));

}

const setStart = (grid, numRow, numCol, prevFinish, finalColor) => {

  if (!prevFinish) { // random start position
    const randGridPos = MyMath.gridPos(numRow - 1, MyMath.randInt(0, numCol));
    return grid[randGridPos.row][randGridPos.col];

  } else { // fixed start position and color
    // start is same col as prevFinish 
    const start = grid[numRow - 1][prevFinish.gridPos.col];
    // make top/botom colors match
    //const computedColors = rotateColors(prevFinish.colors, prevFinish.rot);

    if (finalColor) {
      while (start.colors[2] !== finalColor) {
        start.colors = MyMath.rotateColors(start.colors, 1);
      }
    }

    return start;
  }
}

const copyBoardData = (prevGrid) => {
  return prevGrid.map(row =>
    row.map(node => {
      //console.log(node.diameter);
      const nodeCopy = new Node(MyMath.gridPos(node.gridPos.row, node.gridPos.col),
        MyMath.point(node.pos.x, node.pos.y),
        node.colors, null, null, node.diameter);
      return nodeCopy;

    }

    ));

}



// returns a 2d array. 
//Each element contains a list of the row/col positions of neighboring nodes. 
const getAllNeighbors = (numRow, numCol) => {

  const grid = [];
  for (let i = 0; i < numRow; i++) {
    grid[i] = [];
    for (let j = 0; j < numCol; j++) {
      const potentials = [MyMath.gridPos(i, j + 1), //right
      MyMath.gridPos(i, j - 1), //left
      MyMath.gridPos(i - 1, j), // bottom
      MyMath.gridPos(i + 1, j)];// top
      grid[i][j] = potentials.filter(neighbor => isInBounds(neighbor, numRow, numCol));
    }
  }

  return grid;
}

const gameSizes = {
  tutorial: MyMath.gridPos(6, 1),
  endless: MyMath.gridPos(6, 4),
  timed: MyMath.gridPos(6, 4),
  puzzle: MyMath.gridPos(7, 5)
};

const gameDims = (game) => {

  return gameSizes[game];
}

class Board {

  constructor(game, level, prevBoard, boardSize, puzzleInfo) {
    console.log(`new board puzzle #: ${puzzleInfo.puzzleNumber} Level #: ${level + puzzleInfo.initialProgress}`);
    this.gameType = game;

    if (puzzleInfo.puzzleNumber) {
      this.initialProgress = puzzleInfo.initialProgress;

      // get saved board
      const pack = getPuzzlePack(puzzleInfo.puzzleNumber);
      this.numRow = pack[level].grid.length;
      this.numCol = pack[level].grid[0].length;

      const actualLevel = level + puzzleInfo.initialProgress;
      if (actualLevel >= 20) {
        // dummy board just so errors don't fly everywhere
        this.setupGridFromScratch(game, 0, prevBoard)
      }
      else {
        this.loadSave(pack[level + puzzleInfo.initialProgress]);
      }

      if (prevBoard) {
        this.copyPositionData(prevBoard.grid);
      }
    }
    else {

      if (game === 'tutorial') {
        this.numRow = 6;
        this.numCol = 2;
      }
      else if (!boardSize) {
        this.numRow = 7;
        this.numCol = 5;
      } else {
        this.numRow = 6;
        this.numCol = 4;
      }

      this.setupGridFromScratch(game, level, prevBoard);
    }

  }

  copyPositionData(prevGrid) {
    this.grid.forEach((row, i) =>
      row.forEach((node, j) => {
        //console.log(node.diameter);
        node.diameter = prevGrid[i][j].diameter;
        node.pos = prevGrid[i][j].pos;

      }

      ));
  }
  setupGridFromScratch(game, level, prevBoard) {

    this.potentialBoosterNodes = [];

    if (!prevBoard) {
      console.log("new board");
      this.grid = setupGridFlex(this.numRow, this.numCol);
      this.start = setStart(this.grid, this.numRow, this.numCol);

    }
    else {
      console.log("new board with prevBoard");
      this.numRow = prevBoard.numRow;
      this.numCol = prevBoard.numCol;
      this.grid = copyBoardData(prevBoard.grid);
      this.start = setStart(this.grid, this.numRow, this.numCol, prevBoard.finish, prevBoard.finalColor);
    }

    this.setupNeighbors(this.numRow, this.numCol);

    const finish = MyMath.gridPos(0, MyMath.randInt(0, this.numCol));
    this.finish = this.grid[finish.row][finish.col];

    this.start.fixed = true;
    this.visitedNodes = [this.start];
    this.score = 0;

    setupGridSolution(this, game, level);
  }

  setupNeighbors(numRow, numCol) {
    const neighborGridPosArray2d = getAllNeighbors(numRow, numCol);

    this.grid.forEach((row, i) => row.forEach((node, j) => node.neighbors = this.getNodesFromGridPosArr(neighborGridPosArray2d[i][j])));
  }

  /**
  * Takes a list of node coordinaes in grid and returns a list of node objects
  * @param {[]} gridPosArr 
  */
  getNodesFromGridPosArr(gridPosArr) {
    return gridPosArr.map(gridPos => this.grid[gridPos.row][gridPos.col]);
  }

  getCurrentNode() {
    return this.visitedNodes[this.visitedNodes.length - 1];
  }

  // checks if touch hits any of the nodes
  pointInNode(pos) {

  }

  // Checks if a line between two nodes already exists.
  // If two nodes are adjacent in visitedNodes a line exists.
  isPathOpen(curr, next) {
    let prevNode;

    const results = this.visitedNodes.filter((node, ndx) => {
      if (ndx === 0) {
        prevNode = node;
      }
      else {
        if ((curr === prevNode && next === node) || ((curr === node && next === prevNode))) {
          // this path is closed!
          return true;
        }
        prevNode = node;
      }
    });

    if (results.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  visitNode(nextNode) {
    const curr = this.visitedNodes[this.visitedNodes.length - 1];
    if (curr === nextNode) {//can't visit myself

      return null;
    }
    if (this.isPathOpen(curr, nextNode)) {

      this.visitedNodes = [...this.visitedNodes, nextNode];
      nextNode.fixed = true;

      if (!nextNode.special || nextNode.special === 'booster') {
        nextNode.rotateLinked();
      }
      else if (nextNode.special === 'freezer') {

        // don't rotate links, instead add a freeze
        nextNode.links.forEach(node => node.frozen++);

      } else if (nextNode.special === 'rotateCC') {
        this.grid.forEach((row) => row.forEach(node => {
          node.direction = 1;
        }));

        nextNode.rotateLinked();
      }
      return { next: nextNode, prev: null };
    }
    else if (this.visitedNodes.length >= 2 && nextNode === this.visitedNodes[this.visitedNodes.length - 2]) {
      return { next: null, prev: nextNode };
    } else {
      return { next: null, prev: null };

    }

  }

  removeLast() {

    if (this.visitedNodes.length <= 1) {
      return null;
    }

    const current = this.visitedNodes.pop();

    // if current is not in visited list a second time,
    const isStillThere = this.visitedNodes.find(node => node === current);
    current.fixed = (isStillThere) ? true : false;

    // if node is a freeze-node, and it is not in visitedNodes list a second time, 
    // remove a freeze from its links
    if (current.special == 'freezer') {
      current.links.forEach(node => node.frozen--);

    } else if (current.special !== 'freezer') {  // don't reverse rotate linked nodes if node is a freeze

      current.rotateLinked(true); // reverse rotate

    }
    const ccRemaining = this.visitedNodes.find(node => node.special === 'rotateCC');
    if (current.special === 'rotateCC' && !ccRemaining) {
      // change direction, after rotating
      this.grid.forEach((row) => row.forEach(node => {
        node.direction = -1;
      }));
    }
    const prev = this.visitedNodes[this.visitedNodes.length - 1];


    return prev;

  }

  restart() {

    while (this.visitedNodes.length > 1) {
      this.removeLast();
    }
    this.resetGrid();

  }

  resetGrid() {
    this.grid.forEach((row) => row.forEach(node => { node.fixed = false; node.rot = 0 }));
    this.visitedNodes = [this.start];

    this.start.fixed = true;
    this.grid.forEach((row) => row.forEach(node => {
      node.frozen = 0;
      node.direction = -1;
    }));
  }

  /**
   * user requests hint. 
   * compare visitedNodes to solution. 
   * when visitedNodes[i] !== solution[i]. stop. 
   * remove all nodes after i from visitedNodes. Add solution[i] to visited nodes
   */
  hint() {
    let ndx = 0;
    //const solution = this.solution.map(node=>node.toString()).join('\n');
    //const visitedNodes = this.visitedNodes.map(node=>node.toString()).join('\n');

    while (this.visitedNodes[ndx] === this.solution[ndx]) {
      ndx++;
    }

    const removeCount = this.visitedNodes.filter((node, i) => i >= ndx).length;

    const nextNode = this.solution[ndx];

    return { removeCount, nextNode };

  }


  save() {
    //prevents cyclical refs
    /* const visitedNodes = this.visitedNodes.map(node=> );
     const solution = this.solution.map(node=> node.gridPos);
     return JSON.stringify({
       group:this.grid.map(row=>row.map(node => node.save())),
       start: this.start.gridPos,
       finish: this.finish.gridPos,
       visitedNodes: visitedNodes,
       solution: solution
     
     });*/

  }

  loadSave(savedBoard) {

    this.grid = savedBoard.grid.map(row => row.map(savedNode => {
      const node = new Node(); //  load save fills  empty node
      node.loadSave(savedNode);
      return node;
    }));

    this.setupNeighbors(this.grid.length, this.grid[0].length);

    // now that we have proper refs to every node , unpack links
    this.grid.map(row => row.map(node => {
      node.links = node.links.map(gridPos => this.getNodeFromGridPos(gridPos));

    }));


    this.start = this.getNodeFromGridPos(savedBoard.start);
    this.finish = this.getNodeFromGridPos(savedBoard.finish);
    this.visitedNodes = savedBoard.visitedNodes.map(rawGridPos => this.getNodeFromGridPos(MyMath.unCompressGridPos(rawGridPos)));
    this.solution = savedBoard.solution.map(rawGridPos => this.getNodeFromGridPos(MyMath.unCompressGridPos(rawGridPos)));


  }

  getNodeFromGridPos(gridPos) {
    return this.grid[gridPos.row][gridPos.col];
  }

  toString() {
    const nodes = this.grid.reduce((flat, row) => [...flat, ...row]);
    return nodes.map(node => node.toString()).join(' ');

  }



}

export { Board };