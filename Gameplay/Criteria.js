
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
    rotateCC: .1,
     falsePaths: 20, 
     minLength: 18, 
     maxFalsePathLength: 16, 
     maxLength: 100, 
     circles: 2 
 }

// remember difficulty == false means hard 
const getCriteria = (gameType, level, difficulty, largeBoard) => {
    /*console.log(` Progress level: ${level}`);
    console.log(` Difficulty level: ${difficulty}`);*/
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
            hard.minLength += 4;
            hard.maxFalsePathLength += 2;
            hard.falsePaths += 4;
            return hard;
         }
    }

    else if(gameType ==='timed' || gameType === 'moves') {
        let puzzle =  { group: .4, 
            directLinks: .3, 
            freezer: .2, 
            rotateCC: .1,
             falsePaths: 9, 
             minLength: 17, 
             maxFalsePathLength: 8, 
             maxLength: 100, 
             circles: 2,
             totalBoosters: 5,
            gameType: gameType };
        if(!largeBoard) {
            return puzzle;
        }else{
            puzzle.minLength += 2;
            puzzle.falsePaths +=2;
            puzzle.maxFalsePathLength +=3;
            puzzle.totalBoosters +=2;
            return puzzle;
        }
    }

    let criteria = {group: .3, 
                    directLinks: .1, 
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
        criteria.falsePaths =6;
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
        criteria.maxFalsePathLength = 9;
        criteria.falsePaths = 8;
        criteria.freezer = .1;
        criteria.minLength = 15;
        criteria.circles = 2;

    }
    if(largeBoard) {
        criteria.minLength += 3;
        criteria.falsePaths += 3;
    }
    return criteria;
}

export default getCriteria;