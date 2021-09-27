import { distance, rotateArray, logGridPos, logColors, randInt, compareGridPos, rotateColors} from './MathStuff';

let nodesVisited = 0;

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

const testLinks = (board) => {

    board.grid.forEach((row) => row.forEach(node => {
        const randomNeighbor = randInt(0, node.neighbors.length);

        node.links = [node.neighbors[randomNeighbor]];
    }));
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
            criteria = {group: .3, directLinks: .3, freezer: 0, rotateCC: 0, falsePaths: 3, minLength: 9};

        break;
        case 1:
         criteria = {group: .5, directLinks: .3, freezer: .1, rotateCC: .1, falsePaths: 2, minLength: 9};
         break;
        case 2: // supringly hard 
         criteria = {group: .4, directLinks: .7, freezer: .1, rotateCC: .1, falsePaths: 3, minLength: 12};
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
const getFalseFinish = (board)  => {
       // random node !== finish
       let finishRow = randInt(0, board.grid.length);
       let finishCol = randInt(0, board.grid[0].length);
       while(neighboring(finishRow, finishCol,board.finish)) {
            finishRow = randInt(0, board.grid.length);
            finishCol= randInt(0, board.grid[0].length);
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
    Array.from({length: criteria.falsePaths}, ()=> {
        const falseStart = getFalseStart(board); 
        const falseFinish = getFalseFinish(board);
       
        board.start = falseStart;
        board.finish = falseFinish;

        pathFinder(board);
        board.start = start;
        board.finish = finish;
        resetGrid(board);

    });



    board.finish = finish;
}
/**
 * Pathing rules: 
 * visit any neighboring node (left/right/ below/above)
 * only can form path with matching node (same colors)
 * can revisit nodes UNLESS if path exists from a > b then 
 * path a > b is closed. and vice versa.
 */
const setupGrid = (board) => {
    const criteria = getCriteria(2); 
    console.log(criteria);
    const t1 = Date.now();
    setupSymbols(board, criteria);
    setupLinkedNeighbors(board, criteria);
    setupSpecialNodes(board, criteria);

    board.solution = [];
   // 
   while(board.solution.length < criteria.minLength){

        pathFinder(board);
        // copy visited nodes and save it as solution 
        board.solution = board.visitedNodes.map(node=> node);
   
        // get final color
        const finalNode = board.solution[board.solution.length -1];
        board.finalColor = rotateColors(finalNode.colors, finalNode.rot )[0];
        resetGrid(board);
    }
    setupFalsePaths(board, criteria);

    const t2 = Date.now();
    console.log(`total time to setup grid: ${t2- t1} milliseconds`);

}

const visit = (board, visitedNodes, candidate) => {
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
    return pathFinder(board);
}

const pathFinder = (board) => {
    const { visitedNodes, finish } = board;
    const curr = visitedNodes[visitedNodes.length - 1];

    //logGridPos('current node', curr.gridPos);

    if (curr === finish) { // we are done here
        return true;
    }

    else {    // pick one neighbor to be a match
        let candidates; //= [...curr.neighbors];
        let extra;
        candidates = curr.neighbors.map(node => {
            if (node.gridPos.row > curr.gridPos.row) {
                extra = node;
            }
            return node;
        });
        candidates = extra ? [...candidates, extra] : candidates;

        while (candidates.length > 0) {
            const randomIndex = Math.floor(Math.random() * candidates.length);
            const candidate = candidates[randomIndex];

            if (board.isPathOpen(curr, candidate)) {

                // if candidate already matches, great. No need to meddle.
                if (curr.isMatch(candidate)) {
                    // logGridPos('    candidate:', candidate.gridPos);
                    // console.log('   is a match!');

                    const isGoodCandidate = visit(board, visitedNodes, candidate);
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