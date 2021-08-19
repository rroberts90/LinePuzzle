import {distance, rotateArray,logGridPos, logColors, randInt} from './MathStuff';

let nodesVisited = 0;
const randomizeColors = (colors) => {
    const ndxArr = colors.map((val,ndx) => ndx);
    return  colors.map(() => {
        //pick a random index, take it out of list
        const randNdx = Math.floor(Math.random() * ndxArr.length);
        const colorsNdx = ndxArr[randNdx];
        ndxArr.splice(randNdx,1);
        return colors[colorsNdx];
    });


}

const rotateUntilMatched = (curr, nextNode) => {
    for(let i = 0;i < 4; i++){
        if(curr.isMatch(nextNode)){
            return;
        }
        else{
            nextNode.colors = rotateArray(nextNode.colors, 1);
        }
    }
}

/**
 * Pathing rules: 
 * visit any neighboring node (left/right/ below/above)
 * only can form path with matching node (same colors)
 * can revisit nodes UNLESS if path exists from a > b then 
 * path a > b is closed. and vice versa.
 */

// first whack at it. 
// recursive-ish algorithm traverses grid, creating viable path as it goes.
// should stop at finish node or if no viable paths are left.
// no linked rotations yet.
const setupGrid = (board) => {
    // randomize board colors.
    board.grid.forEach((row) => row.forEach( node => node.colors= randomizeColors(node.colors) ));

    goOff(board);
    
    // for testing add random links to nodes.
    const rows = board.grid.length;
    const cols = board.grid[0].length;
  
    board.grid.forEach((row) => row.forEach( node => {
        const randomNeighbor = randInt(0, node.neighbors.length);
        
        node.links = [ node.neighbors[randomNeighbor] ];
    }));

    // reset board for player}{}
    board.grid.forEach((row) => row.forEach( node => node.fixed = false ));          
    board.visitedNodes = [board.start];
    board.start.fixed = true;
}

const goOff = (board) =>{
    const {visitedNodes, finish} = board;
    const curr = visitedNodes[visitedNodes.length-1];
    
    //logGridPos('current node', curr.gridPos);
    
    if (curr === board.finish) { // we are done here
        return;
    }

    else{    // pick one neighbor to be a match
        let candidates = [...curr.neighbors];
        
        while(candidates.length > 0) {
            const randomIndex = Math.floor(Math.random() * candidates.length);
            const candidate = candidates[randomIndex];
            
            if(board.isPathOpen(curr, candidate)){
                
                // if candidate already matches, great. No need to meddle.
                if(curr.isMatch(candidate)) {
                   // logGridPos('    candidate:', candidate.gridPos);
                   // console.log('   is a match!');
                   
                    board.visitedNodes = [...visitedNodes, candidate];
                    candidate.fixed = true;
                    return goOff(board);
                }
                // the candidate can be meddled with. Rotate the colors till it is a match
                else if(!candidate.fixed) { 
                    //logGridPos('    candidate:', candidate.gridPos);
                  //  console.log('   can be meddled with!');
                   
                  
                  candidate.colors = randomizeColors(candidate.colors);
                  rotateUntilMatched(curr, candidate);
                  
                  board.visitedNodes = [...visitedNodes, candidate];
                    candidate.fixed = true;
                    return goOff(board);
                } 
                else { // the successor can't be a match because it is fixed in place (on the path-algorithm's solution of the puzzle that is.)
                    candidates.splice(randomIndex,1)
                }
            }
            else { // the way is closed
                candidates.splice(randomIndex,1)
            }
        }
    }

}

export {setupGrid};