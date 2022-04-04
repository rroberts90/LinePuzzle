import Board from './BoardPM.js'
import getCriteria from './CriteriaPM.js'
//console.log = function() {}

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const levelNames = require("./Output/levelNames.json");

import * as fs from 'fs';
import { group } from 'console';
import { getgroups } from 'process';

const isInRange = (x, r) => {
  return x >= r[0] && x <= r[1];
}

const groupInfo = {
  animal2: { name: 'Animals', count: 0 },
  flower: { name: 'Flowers', count: 0 },
  glyph: { name: 'Glyphs', count: 0 },
  animal1: { count: 0, name: 'Aquatic' },
  pets2: { name: 'Dogs', count: 0 },
  card: { name: 'Cards', count: 0 },
  food: { name: 'Food', count: 0 },
  pets1: { name: 'Big Dogs', count: 0 },
  science: { name: 'Science', count: 0 },
  desert: { name: 'Deserts', count: 0 },
  fruit: { name: 'Fruits', count: 0 }

};

const getNamesByLevel = (levelCount) => {
  const levelGroups = [];
  let nextNdx = -1;
  for (let i = 0; i < 3; i++) {
    levelGroups.push({ title: `Learner ${i + 1}`, key: 'learner' })

  }

  while (levelGroups.length < levelCount) {
    // get next group
    nextNdx = (nextNdx + 1) % Object.entries(groupInfo).length
    console.log(nextNdx)
    const group = Object.entries(groupInfo)[nextNdx][0]

    levelGroups.push({ title: `${groupInfo[group].name} ${groupInfo[group].count + 1}`, key: group })
    levelGroups.push({ title: `${groupInfo[group].name} ${groupInfo[group].count + 2}`, key: group })
    levelGroups.push({ title: `${groupInfo[group].name} ${groupInfo[group].count + 3}`, key: group })
    groupInfo[group].count += 3

  }

  return levelGroups;

}


const createJSON = (level, n, solutionRange, pathLengthRange, boardSize, difficulty) => {

  let boards = [];

  let prevBoard = null;

  //console.log = function(){}
  while (boards.length < n) {
    const board = new Board(boardSize, getCriteria('endless', difficulty, boardSize, level), prevBoard);
    if (isInRange(board.shortestSolution, solutionRange) && isInRange(board.pathLength, pathLengthRange)) {
      boards.push(board);
      prevBoard = board;
    }
  }

  //boards.sort((a,b)=> a.pathLength - b.pathLength);
  //boards.sort((a,b)=> a.shortestSolution - b.shortestSolution);

  const savedBoards = boards.map(board => board.save());


  return JSON.stringify(savedBoards);

}

const makeFile = (fileName, data) => {
  fs.writeFileSync(fileName, data, err => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

const makeRequireScript = (num) => {
  let s = 'const getPuzzlePack  = (id) => {\nswitch(id) {';
  for (let i = 1; i <= num; i++) {
    s += `case ${i}: \n return require(\'./${i}.json\')\n`
  }


  s += '}}\nexport default getPuzzlePack;'

  return s;
}

const makeLevels = async (num) => {

  let smallBoard = true;
  const packInfo = { count: num, levels: [] };
  const difficulties = ['easy', 'moderate', 'hard'];
  let sRange = [10, 15];
  let pRange = [20, 30];
  const mazePerLevel = 10;
  let difficulty = 0;

  for (let i = 1; i <= num; i++) {
    console.info(i)

    if (i === 4) {
      sRange = [16, 20];
      pRange = [60, 80];
      difficulty++;
    }
    if (i === 10) {
      sRange = [16, 25];
      pRange = [80, 120];
    }
    if (i === 16) {
      sRange = [17, 25];
      pRange = [100, 150];
    }
    if (i === 30) {
      sRange = [20, 35];
      pRange = [100, 200];

    }
    if (i === 51) {
      sRange = [20, 35];
      pRange = [100, 200];

    }
    if (i === 75) {
      sRange = [20, 40];
      pRange = [150, 200];
      difficulty++;
      smallBoard = false;
    }
    if (i === 100) {
      sRange = [30, 40];
      pRange = [175, 400];
      smallBoard = false;
    }
   
    const difficultyBool = difficulty === 0 ? true : false;
    const data = createJSON(i, mazePerLevel, sRange, pRange, smallBoard, difficultyBool);
    const fileName = `./Output/${i}.json`;
   
    makeFile(fileName, data);
  
    packInfo.levels.push({
      level: i, 
      difficulty: difficulties[difficulty],
      mazeCount: mazePerLevel,
      title: levelNames[i - 1].title,
      group: levelNames[i - 1].key
    })
  }

  const requireScript = makeRequireScript(num);
// makeFile('./Output/getPuzzlePack.js', requireScript);

  //makeFile('./Output/packInfo.json', JSON.stringify(packInfo));
}
makeLevels(150)

const  rewritePuzzle = (level, number, start, finish, smallBoard)=> {
  let criteriaNotMet = true;
  let board;
  const solutionRange = [20, 35];
  const pathLengthRange = [100, 200];
  while (criteriaNotMet) {
     board = new Board(smallBoard, getCriteria('endless', false, smallBoard, level), null);

    if (board.start.gridPos.col === start && board.finish.gridPos.col === finish && isInRange(board.shortestSolution, solutionRange) && isInRange(board.pathLength, pathLengthRange)) {
      criteriaNotMet = false;
    }
  }

  const file = fs.readFileSync(`./Output/${level}.json`);
  const boards = JSON.parse(file.toString());

  boards[number-1]= board.save();
  makeFile(`./Output/${level}.json`, JSON.stringify(boards))
}
//rewritePuzzle(49, 4, 3,3, true)

//const requireScript = makeRequireScript(150);
//makeFile('./Output/getPuzzlePack.js', requireScript);
///makeFile('./Output/levelNames.json', JSON.stringify(getNamesByLevel(300)))

/*const  makePuzzlePacks =  async (num)=> {
  console.log(FileSystem.documentDirectory);
  const puzzleFolder = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'PuzzlePacks/');
  if(!puzzleFolder.exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'PuzzlePacks/');
  }

  for(let i = 1;i<= num;i++) {
    const data = createJSON(i, 20, [10,15], [20,40],false);
    await FileSystem.writeAsStringAsync(puzzleFolder.uri + `${i}`, data );

  }


}*/



//createJSON('1', 20, [10,15], [20,40],false);

