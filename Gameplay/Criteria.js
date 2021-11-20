
const puzzle1 = { group: .5, 
    directLinks: .4, 
    freezer: .2, 
    rotateCC: .1,
     falsePaths: 7, 
     minLength: 20, 
     maxFalsePathLength: 15, 
     maxLength: 100, 
     circles: 2 
 }
 const puzzle2 = { group: .5, 
    directLinks: .3, 
    freezer: .1, 
    rotateCC: .1,
     falsePaths: 7, 
     minLength: 20, 
     maxFalsePathLength: 15, 
     maxLength: 100, 
     circles: 2 
 }

// remember difficulty == false means hard (fuck, that is confusing.)
const getCriteria = (gameType, level, difficulty) => {
    /*console.log(` Progress level: ${level}`);
    console.log(` Difficulty level: ${difficulty}`);*/

    if(gameType === 'endless' && !difficulty) {
        return puzzle2;
    }

    else if(gameType ==='timed' || gameType === 'moves') {
        return { group: .5, 
            directLinks: .2, 
            freezer: .2, 
            rotateCC: .1,
             falsePaths: 7, 
             minLength: 18, 
             maxFalsePathLength: 13, 
             maxLength: 100, 
             circles: 2,
            gameType: gameType };
    }

    let criteria = {group: .4, 
                    directLinks: .1, 
                    freezer: 0, 
                    rotateCC: 0, 
                    falsePaths: 1,
                     minLength: 10, 
                     maxLength: 20, 
                     maxFalsePathLength: 5, 
                     circles:1,
                     gameType: gameType};
    
    if(level <= 5){
        // base criteria
        return criteria;
    }
    else if(level > 5 && level<=10){
        criteria.directLinks = .2;
        criteria.falsePaths = 2;

    }
    else if(level > 10 && level <= 20){
        criteria.directLinks = .2
        criteria.group = .4;
        criteria.maxFalsePathLength = 8;
        criteria.falsePaths = 3;
    }
    else if(level > 20 && level <=80){
        criteria.directLinks = .2
        criteria.group = .4;
        criteria.maxFalsePathLength = 10;
        criteria.falsePaths = 6;
        criteria.freezer = .1;
        criteria.minLength = 15;
        criteria.circles = 2;

    }
    else if( level > 80) {
        criteria.directLinks = .3
        criteria.group = .4;
        criteria.maxFalsePathLength = 12;
        criteria.falsePaths = 6;
        criteria.freezer = .1;
        criteria.minLength = 15;
        criteria.circles = 2;
        criteria.rotateCC = .1;
    }

    return criteria;
}

export default getCriteria;