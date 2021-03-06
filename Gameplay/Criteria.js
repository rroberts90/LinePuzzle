
const puzzle1 = { group: .5, 
    directLinks: .4, 
    freezer: .2, 
    rotateCC: .1,
     falsePaths: 7, 
     minLength: 15, 
     maxFalsePathLength: 15, 
     maxLength: 100, 
     circles: 2 
 }

 const endlessHard = { 
    gameType: 'endless' ,
    group: .5, 
    directLinks: .4, 
    freezer: .1, 
    rotateCC: .05,
     falsePaths: 8, 
     minLength: 16, 
     maxFalsePathLength: 14, 
     maxLength: 100, 
     circles: 2 ,
     minSymbols: 10
 }

// remember difficulty == false means hard 
const getCriteria = (gameType, level, difficulty, largeBoard) => {
    console.log(` Progress level: ${level}`);
    //console.log(` Difficulty level: ${difficulty}`);*/
    if(level ==null) {
        level = 1;
    }
    console.log(`criteria: largeBoard ${largeBoard}\n   difficulty: ${difficulty}`)

    if(gameType === 'endless' && !difficulty) {
 
         if(!largeBoard){

             return endlessHard;
         }else{
            let hard = [];
            Object.assign(hard, endlessHard);
            hard.minLength += 5;
            hard.maxFalsePathLength += 2;
            hard.falsePaths += 4;
            return hard;
         }
    }

    else if(gameType ==='timed' || gameType === 'moves') {
        let puzzle =  { group: .5, 
            directLinks: .3, 
            freezer: .2, 
            rotateCC: .1,
             falsePaths: 8, 
             minLength: 16, 
             maxFalsePathLength: 12, 
             maxLength: 100, 
             circles: 2,
             totalBoosters: 5,
            gameType: gameType };
            if(gameType === 'timed') { // add an extra booster because this mode is hard!
                puzzle.totalBoosters++;
            }
        if(!largeBoard) {
            return puzzle;
        }else{
            puzzle.minLength += 4;
            puzzle.falsePaths +=2;
            puzzle.maxFalsePathLength +=3;
            puzzle.totalBoosters +=4;
            return puzzle;
        }
    }

    let criteria = {group: .3, 
                    directLinks: 0, 
                    freezer: 0, 
                    rotateCC: 0, 
                    falsePaths: 4,
                     minLength: 12, 
                     maxLength: 20, 
                     maxFalsePathLength: 5, 
                     circles:2,
                     gameType: gameType};
    if(level <= 5){
        // base criteria
        return criteria;
    }
    else if(level > 5 && level<=10){
        criteria.directLinks = .2;
        criteria.falsePaths =2;
        criteria.maxFalsePathLength = 8;

    }
    else if(level > 10 && level <= 20){
        criteria.directLinks = .2
        criteria.group = .4;
        criteria.falsePaths =6;

        criteria.maxFalsePathLength = 9;
    }
    else{
        criteria.directLinks = .3
        criteria.group = .4;
        criteria.maxFalsePathLength = 13;
        criteria.falsePaths = 8;
        criteria.freezer = .2;
        criteria.minLength = 17;
        criteria.circles = 2;

    }
    if(largeBoard) {
        criteria.minLength += 3;
        criteria.falsePaths += 3;
    }
    return criteria;
}

export default getCriteria;