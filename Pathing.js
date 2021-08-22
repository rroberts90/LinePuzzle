import { distance, rotateArray, logGridPos, logColors, randInt } from './MathStuff';

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

/**
 * Pathing rules: 
 * visit any neighboring node (left/right/ below/above)
 * only can form path with matching node (same colors)
 * can revisit nodes UNLESS if path exists from a > b then 
 * path a > b is closed. and vice versa.
 */

const setupGrid = (board) => {
    // randomize board colors. add random linked groups
    const symbolDict = {1:[],2:[], 3:[],4:[]}; // don't want to loop through array 3 times 
    
    board.grid.forEach((row) => row.forEach(node => {
        node.colors = randomizeColors(node.colors);
      
        const symbol = randInt(0,5);

        // symbol 0 is the non group. don't display it, shouldn't rotate any nodes
        if(symbol !== 0) {
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

    pathFinder(board);

    // reset board for player
    board.grid.forEach((row) => row.forEach(node => {node.fixed = false; node.rot = 0}));
    board.visitedNodes = [board.start];
    board.start.fixed = true;
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

                    board.visitedNodes = [...visitedNodes, candidate];
                    candidate.fixed = true;
                    candidate.rotateLinked();

                    const isGoodCandidate = pathFinder(board);
                    if (!isGoodCandidate) {
                        candidates = candidates.filter(node => node !== candidate);
                    }
                    else {
                        return true;
                    }
                }
                // the candidate can be mutated. Rotate the colors till it is a match
                else if (!candidate.fixed) {
                    //logGridPos('    candidate:', candidate.gridPos);
                    //  console.log('   can be meddled with!');

                    //candidate.colors = randomizeColors(candidate.colors);
                    rotateUntilMatched(curr, candidate);

                    board.visitedNodes = [...visitedNodes, candidate];
                    candidate.fixed = true;
                    candidate.rotateLinked();
                    const isGoodCandidate = pathFinder(board);

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
        reject.rotateLinked(true);
        if (!visitedNodes.find(node => node === reject)) { // ok to set fixed to false
            reject.fixed = false;
        }

        return false;
    }

}

export { setupGrid };  