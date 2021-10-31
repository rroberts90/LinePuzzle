import {rotateColors, logGridPos} from '../Utils'

const visit = (board, visitedNodes, candidate, pathList) => {
    //console.log(`visiting node: ${candidate.toString()}`);

    board.visitedNodes = [...visitedNodes, candidate];
    candidate.fixed = true;
    if(candidate.special == 'freezer'){
        candidate.links.forEach(node=> node.frozen++);

    }else {
        if(candidate.special === 'rotateCC') {
            board.grid.forEach((row) => row.forEach(node => {
                node.direction = 1;
            }));

        }
        candidate.rotateLinked();
    }
    return pathFinder(board, pathList);
}

/**
 * Finds all possible paths through grid. If
 * @param {Node} curr 
 * @param {*} criteria 
 * @param {Node} finish
 * @returns 
 */

const pathFinder = (board, pathList) => {
    const { visitedNodes, finish } = board;
    const curr = visitedNodes[visitedNodes.length - 1];
    //logGridPos('Current', curr.gridPos);

    if (curr === finish) { 
        //console.log('got to finish');
        pathList.push(visitedNodes.map(node=>node));
    }

    else {    
        let candidates = curr.neighbors.map(node => node);
      
        // pick one neighbor to visit next
        while (candidates.length > 0) {
            const randomIndex = Math.floor(Math.random() * candidates.length);
            const candidate = candidates[randomIndex];

            if (board.isPathOpen(curr, candidate)) {

                //candidate  matches
                if (curr.isMatch(candidate)) {

                    const isGoodCandidate = visit(board, visitedNodes, candidate, pathList);
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
      
        //console.log(`rejecting current node`);
        const reject = visitedNodes.pop();
        
        // only remove freeze if reject is not still in visitedNodes
        if(reject.special==='freezer' &&!visitedNodes.find(node => node === reject) ) {
            reject.links.forEach(node=> node.frozen--);
        }
        else{
            reject.rotateLinked(true);
        } 
        if(reject.special === 'rotateCC' && !visitedNodes.find(node=> node.special==='rotateCC')
        ) { 
            board.grid.forEach((row) => row.forEach(node => {
                node.direction = -1;
            }));
        }
        if (!visitedNodes.find(node => node === reject)) { // ok to set fixed to false
            reject.fixed = false;
        }

        return false;
    }
}

const makeDeadends = (board, path) => {
    // start at end
    for(let i = path.length-1;i>=0;i--){
        if(!board.solution.find(node=> node===path[i])) {
            path[i].colors = rotateColors(path[i].colors, -1);
            break;
        }
    }
}

// where l is an array of arrays
const findMinLength = (l) => {
    if(l.length === 0){
        return 0;
    }
    return l.reduce((prev, curr)=> {if(prev.length< curr.length){return prev}else{return curr}}).length

}
const solutionChecker = (board, resetGrid) => {
    let pathList = [];
    board.resetGrid();

    pathFinder(board, pathList);


    //console.log('\n\n');

    for(let i = 0; i < pathList.length;i++){
        makeDeadends(board, pathList[i]);
    }
    board.resetGrid();

    pathList = [];
    pathFinder(board, pathList);
    board.resetGrid();

    return findMinLength(pathList);
}
export default solutionChecker;
