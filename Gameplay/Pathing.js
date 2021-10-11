import {  rotateArray, randInt, rotateColors, logGridPos} from '../Utils';
//const fs = require('react-native-fs');

let nodesVisited = 0;
let logger = [];
const randomizeColors = (colors) => {
    const ndxArr = colors.map((val, ndx) => ndx);
    return colors.map(() => {
        //pick a random index, take it out of list
        const randNdx = Math.floor(Math.random() * ndxArr.length);
        const colorsNdx = ndxArr[randNdx];
        ndxArr.splice(randNdx, 1);
        return colors[colorsNdx];
    });
}

const rotateUntilMatchedV1 = (curr, nextNode) => {
for (let i = 0; i < 4; i++) {
        if (curr.isMatch(nextNode)) {
            return;
        }
        else {
            nextNode.colors = rotateArray(nextNode.colors, 1);
        }
    }
}

// rotates nextNode initial color position until computed(current) position is a match 
// between curr and nextNode.
const rotateUntilMatched = (curr, nextNode) => {
    while(!curr.isMatch(nextNode)) {
        nextNode.colors = rotateArray(nextNode.colors, 1);

    }
}


// returns an array where  if a random element is chosen,
// there is is chance% that element will be a randomly selected element of outcomes
// or null
const makeRandomDistribution = (chance, outcomes) => {
    const numOutcomes = Math.floor(chance * 100);
    const numNonOutcomes = Math.floor((1-chance) * 100);
    const outcomesDist = Array.from({length: numOutcomes}, (v,i)=> {
        const randomOutcome = outcomes[randInt(0, outcomes.length)];
        return randomOutcome;
    });
    const nonOutcomesDist = Array.from({length: numNonOutcomes},(v,i)=> null);
    return [...outcomesDist, ...nonOutcomesDist];
}

const getRandomElement = (randomDist) => {
    return randomDist[randInt(0,randomDist.length-1)];
}

const setupSymbols = (board, criteria) => {
    // randomize board colors. add random linked groups
    const symbolDict = {1:[],2:[], 3:[],4:[]}; // don't want to loop through array 3 times 
    const groupDist = makeRandomDistribution(criteria.group, [1,2,3,4] )
    board.grid.forEach((row) => row.forEach(node => {
        if(board.start !== node){
            node.colors = randomizeColors(node.colors);
        }
        const symbol = getRandomElement(groupDist);

        // symbol 0 is the non group. don't display it, shouldn't rotate any nodes
        if(symbol !== null) {
            node.symbol = symbol;
            symbolDict[node.symbol] = [...symbolDict[node.symbol], node];
        }
    }));

    // add inital random linked groups.
    board.grid.forEach((row) => row.forEach(node => {
      // Node adds all nodes with same symbol to links but doesn't add itself.
      if(node.symbol) {
          node.links = symbolDict[node.symbol].filter(otherNode=> node !== otherNode );
      }

    }));
}

// adds otherNode to node.links if otherNode !=== node  and it's not already in the list
const addLink = (node, otherNode) => {
    if(node !== otherNode && !node.links.includes(otherNode)) {
        node.links = [...node.links, otherNode];
    }
}

const getCriteria = (difficulty) => {
    let criteria;
    switch(difficulty) {
        case 0:
            criteria = {group: .3, directLinks: .3, freezer: 0, rotateCC: 0, falsePaths: 0, minLength: 7, maxLength: 13};
        break;
        case 1:
         criteria = {group: .5, directLinks: .3, freezer: .1, rotateCC: .1, falsePaths: 2, minLength: 9, maxLength: 20, maxFalsePathLength: 4, circles:false};
         break;
        case 2:
            criteria = {group: .4, directLinks: .4, freezer: .1, rotateCC: .1, falsePaths: 2, minLength: 12, maxLength: 20};
            break;
        case 10: // supringly hard 
         criteria = {group: .4, directLinks: .7, freezer: .1, rotateCC: .1, falsePaths: 3, minLength: 12, maxLength: 20};
        break;
    }
    return criteria;
}

const setupSpecialNodes = (board, criteria) => {
    const outcomes = [1];
    const dist = makeRandomDistribution(criteria.freezer, outcomes );
    const rotateCCDist = makeRandomDistribution(criteria.rotateCC, outcomes);
    board.grid.forEach((row) => row.forEach(node => {
        if (node.links.length > 0 && node !== board.start && node !== board.finish) {
            const freezer = getRandomElement(dist);
            if (freezer) {
                node.special = 'freezer';
            }else{
                const rotateCC = getRandomElement(rotateCCDist);
                if(rotateCC) {
                    node.special = 'rotateCC';
                }
            }
        }
    }));

}
// call after setupSymbols
const setupLinkedNeighbors = (board, criteria) => {
    const outcomes = [1,1,1,2,2,3,4]; // number of links. fewer links more likely
    const dist = makeRandomDistribution(criteria.directLinks, outcomes );
    
    let counter = 0;
    board.grid.forEach((row) => row.forEach(node => {

        const linkCount = getRandomElement(dist);

        if(linkCount) {
            Array.from({length:linkCount}, (v,i)=> {
                // if link isn't already in list, add random link
                addLink(node, node.neighbors[randInt(0, node.neighbors.length)]);

            });
            counter++;
        }
  
      }));


}

const resetGrid = (board) => {
    // reset board for player
    board.grid.forEach((row) => row.forEach(node => {node.fixed = false; node.rot = 0}));
    board.visitedNodes = [board.start];
    
    board.start.fixed = true;

    board.grid.forEach((row) => row.forEach(node =>  {
        node.frozen = 0;
        node.direction=-1;}));

}

const neighboring = (row, col, node)=> {
    if(node.gridPos.row === row && node.gridPos.col === col){
        return true;
    }
    return node.neighbors.find(neighbor=> neighbor.gridPos.row === row && neighbor.gridPos.col === col);

}

// returns a random node !== to board.finish or its neighbors
const isInGrid = (grid, row, col) => {
    if(row < 0 || col < 0){
        return false;
    }
    else if(row >= grid.length || col >= grid[0].length) {
        return false;
    }else{
        return true;
    }
}
const distance = (gPos1, gPos2) => {
    return Math.abs(gPos2.col - gPos1.col) + Math.abs(gPos2.row - gPos1.row);
}

const getFalseFinish = (board, maxLength)  => {
       let finishRow = -1;
       let finishCol = -1;
    if (maxLength) {
        // pick a node where noderow = startrow+x and nodecol = startcol +y where x+y < maxLength
        const start = board.start;
        while(!isInGrid(board.grid, finishRow, finishCol) || neighboring(finishRow, finishCol, board.finish)  ) {

            const colOffset = randInt(-board.grid[0].length, board.grid[0].length);
            let rowOffset =  (maxLength - Math.abs(colOffset));
           
            if(randInt(0,2) === 0) {
                rowOffset = rowOffset * -1;
            }

            finishRow = board.start.gridPos.row + rowOffset;
            finishCol = board.start.gridPos.col + colOffset;
        }
        
    }
    else { // random finish anywhere not adjacent to actual finish
         finishRow = randInt(0, board.grid.length);
         finishCol = randInt(0, board.grid[0].length);
        while (neighboring(finishRow, finishCol, board.finish)) {
            finishRow = randInt(0, board.grid.length);
            finishCol = randInt(0, board.grid[0].length);
        }
    }
       const falseFinish = board.grid[finishRow][finishCol];

       return falseFinish;
}
// random node between start or finish
const getFalseStart = (board) => {
    const firstHalf = board.solution.length / 2;
    return board.solution[randInt(1,firstHalf)];
}

// assumes solution has already been found
const setupFalsePaths = (board, criteria) => { 
    
    const {start, finish} = board;
    criteria.minLength = criteria.maxFalsePathLength; // false paths should hop-step towards their finish
    Array.from({length: criteria.falsePaths}, ()=> {
        const falseStart = getFalseStart(board); 
        board.start = falseStart;

        const falseFinish = getFalseFinish(board, criteria.maxFalsePathLength);
        board.finish = falseFinish;

        pathFinder(board, criteria);
        board.start = start;
        board.finish = finish;
       resetGrid(board);

    });

}
/**
 * Pathing rules: 
 * visit any neighboring node (left/right/ below/above)
 * only can form path with matching node (same colors)
 * can revisit nodes UNLESS if path exists from a > b then 
 * path a > b is closed. and vice versa.
 */
const setupGrid = (board) => {
    const criteria = getCriteria(1); 
    const t1 = Date.now();
   
    setupSymbols(board, criteria);
    setupLinkedNeighbors(board, criteria);
    setupSpecialNodes(board, criteria);

    board.solution = [];
   let count = 0;
   const MaxTries = 5;
  while((board.solution.length < criteria.minLength || board.solution.length > criteria.maxLength) && count < MaxTries){
        count++;
        pathFinder(board, criteria);
       
        // copy visited nodes and save it as solution 
        board.solution = board.visitedNodes.map(node=> node);
   
        // get final color
        const finalNode = board.solution[board.solution.length -1];
        board.finalColor = rotateColors(finalNode.colors, finalNode.rot )[0];
        resetGrid(board);
   }

    setupFalsePaths(board, criteria);

    const t2 = Date.now();
    console.log(`---------\ntotal time to setup grid: ${t2- t1} milliseconds`);
    console.log(`Took ${count} tries to create path\n-----------`);

}

const visit = (board, visitedNodes, candidate, criteria) => {
    //console.log(`visiting node: ${candidate.toString()}`);

    board.visitedNodes = [...visitedNodes, candidate];
    candidate.fixed = true;
    if(candidate.special == 'freezer'){
        candidate.links.forEach(node=> node.frozen++);

    }else {
        if(candidate.special === 'rotateCC') {
            candidate.links.forEach(node=> node.direction = 1);
        }
        candidate.rotateLinked();
    }
    return pathFinder(board, criteria);
}

/**
 * Returns an array of nodes adjacent to curr.
 * Nodes will be randomly selected from array. Nodes that 
 * the criteria dictate should be more likely to visit 
 * eg nodes closer to finish, nodes fixed in position to create loops, etc
 * @param {Node} curr 
 * @param {*} criteria 
 * @param {Node} finish
 * @returns 
 */
const selectCandidates = (curr, criteria, finish, visitedNodes) => {
    //console.log('----------');
    //logGridPos('CurrentNode', curr.gridPos);
    let candidates; //= [...curr.neighbors];
    let extras = [];
    //console.log(`current: ${curr.gridPos.row} ${curr.gridPos.col}`);
    candidates = curr.neighbors.map(node => {
        if (node.gridPos.row > curr.gridPos.row) {
            extras = [...extras,node];
        }
        return node;
    });
    candidates = [...extras, ...candidates];
    const logStr = 'candidates:\n' +candidates.map(node=> node.toString()).join('\n') + '\n';
    const closestRow = Math.sign(finish.gridPos.row - curr.gridPos.row) + curr.gridPos.row; 
    const closestCol = Math.sign(finish.gridPos.col - curr.gridPos.col ) + curr.gridPos.col;
    
    // add extras to candidates
    if(criteria && visitedNodes.length >= criteria.minLength ) {
        // time to hopstep to finish
        //console.log('hopstep to finishline');
        let neighbors = [];
        //logGridPos('current', curr.gridPos);
        //logGridPos('finish', finish.gridPos)
        if(curr.gridPos.row === finish.gridPos.row){ // direct row case
          ///  console.log('   picked the neighbor on the same row closer to finish');
           /// console.log(`   closestRow: ${closestRow}`);

             neighbors = curr.neighbors.filter(node=> node.gridPos.row === curr.gridPos.row && node.gridPos.col === closestCol);
             neighbors = [...neighbors, ...neighbors];
        } else if(curr.gridPos.col === finish.gridPos.col) { // direct col case
            //console.log('   picked the neighbor on the same col closer to finish');
             neighbors = curr.neighbors.filter(node=> node.gridPos.col === curr.gridPos.col && node.gridPos.row === closestRow);
             neighbors = [...neighbors, ...neighbors];

        } else {
           // d console.log('   no direct line to finish. picked the two closer neighbors');

            // if the current node is not on the same row or col as finish node, there will be 2 nodes closer to finish
             neighbors = curr.neighbors.filter(node=> 
                (node.gridPos.row === curr.gridPos.row && node.gridPos.col === closestCol) 
                ||(node.gridPos.col === curr.gridPos.col && node.gridPos.row === closestRow)  );
        }
        extras = [...extras, ...neighbors, ...neighbors];
        //console.log(`   added in ${extras.length} nodes closer to finish\n---------\n`);
    }else if(criteria && criteria.circles) {
        console.log('increase chance of loopdeloops');
        const fixedNeighbors = curr.neighbors.filter(node=> node.fixed);
        console.log(`   found ${fixedNeighbors.length} fixed neighbors`);

        extras = [...fixedNeighbors];
    }
    candidates = [...candidates, ...extras];

    return candidates;
}

const pathFinder = (board, criteria) => {
    const { visitedNodes, finish } = board;
    const curr = visitedNodes[visitedNodes.length - 1];
   // fs.writeFile('../Logs/108.txt', JSON.stringify(logger), (err)=>{if(err){console.log(err)}});
    logger = [];
   // console.log(`current: ${curr.gridPos.row} ${curr.gridPos.col}`);

    //logGridPos('current node', curr.gridPos);

    if (curr === finish) { // we are done here
        return true;
    }

    else {    
        let candidates = selectCandidates(curr, criteria, finish, visitedNodes);
        // pick one neighbor to visit next
        while (candidates.length > 0) {
            const randomIndex = Math.floor(Math.random() * candidates.length);
            const candidate = candidates[randomIndex];
            //console.log(`checking candidate: ${candidate.toString()}`);
            if (board.isPathOpen(curr, candidate)) {

                // if candidate already matches, great. No need to meddle.
                if (curr.isMatch(candidate)) {
                    // logGridPos('    candidate:', candidate.gridPos);
                    // console.log('   is a match!');

                    const isGoodCandidate = visit(board, visitedNodes, candidate, criteria);
                    if (!isGoodCandidate) {
                        candidates = candidates.filter(node => node !== candidate);
                    }
                    else {
                        return true;
                    }
                }
                // the candidate can be mutated. Rotate the colors till it is a match
                else if (!candidate.fixed && candidate.frozen == 0 && !board.solution.find(node=> node===candidate)) {
                    //logGridPos('    candidate:', candidate.gridPos);
                    //  console.log('   can be meddled with!');

                    //candidate.colors = randomizeColors(candidate.colors);
                    rotateUntilMatched(curr, candidate);

                    const isGoodCandidate = visit(board, visitedNodes, candidate);


                    if (!isGoodCandidate) {
                        candidates = candidates.filter(node => node !== candidate);
                    }
                    else {
                        return true;
                    }
                }
                else { // the candidate can't be a match because it is fixed in place (on the path-algorithm's solution of the puzzle that is.)
                    candidates = candidates.filter(node => node !== candidate);
                }
            }
            else { // can't be a match bc path between node and candidate already exists
                candidates = candidates.filter(node => node !== candidate);
            }
        }
      
        // if while loop finishes, no candidates are left.
        // no candidates left and board not finished. 
        // take this sorry-ass good for nothing node off the list.
        //console.log(`rejecting current node`);
        const reject = visitedNodes.pop();
        
        // only remove freeze if reject is not still in visitedNodes
        if(reject.special==='freezer' &&!visitedNodes.find(node => node === reject) ) {
            reject.links.forEach(node=> node.frozen--);
        }
        else{
            reject.rotateLinked(true);

        } 
        if(reject.special === 'rotateCC' &&!visitedNodes.find(node => node === reject) ) { 
            reject.links.forEach(node=> node.direction=-1);

        }
        if (!visitedNodes.find(node => node === reject)) { // ok to set fixed to false
            reject.fixed = false;
        }

        return false;
    }



}

export { setupGrid };  