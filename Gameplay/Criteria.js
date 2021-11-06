
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
 const puzzle2= {};
  Object.assign(puzzle2, puzzle1);
puzzle2.minLength += 2;
puzzle2.group += .1;
puzzle2.falsePaths +=1;

const getCriteria = (gameType, level, difficulty) => {
    console.log(` Progress level: ${level}`);
    console.log(` Difficulty level: ${difficulty}`);

    if(gameType === 'endless' && difficulty === 3) {
        return puzzle1;
    }
    if (gameType === 'puzzle'){
        return puzzle2;
    }
    else if(gameType ==='timed' ) {
        return { group: .5, 
            directLinks: .4, 
            freezer: .2, 
            rotateCC: .1,
             falsePaths: 7, 
             minLength: 18, 
             maxFalsePathLength: 13, 
             maxLength: 100, 
             circles: 2 };
    }

    let criteria = {group: .4, 
                    directLinks: .2, 
                    freezer: 0, 
                    rotateCC: 0, 
                    falsePaths: 1,
                     minLength: 5, 
                     maxLength: 25, 
                     maxFalsePathLength: 5, 
                     circles:1};
    
    if(level <= 5 || difficulty === 1){
        // base criteria
        return criteria;
    }
    else if(level > 5 && level<=10){
        criteria.directLinks = .2
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
        criteria.group = .5;
        criteria.maxFalsePathLength = 12;
        criteria.falsePaths = 6;
        criteria.freezer = .1;
        criteria.minLength = 17;
        criteria.circles = 2;
        criteria.rotateCC = .1;
    }

    return criteria;
}

export default getCriteria;