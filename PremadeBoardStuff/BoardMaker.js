import  Board  from './BoardPM.js'
import  getCriteria from './CriteriaPM.js'

//console.log = function() {}

import * as fs from 'fs';
const createJSON = (n, boardSize) => {

  let boards = [];
  //console.log = function(){}
  while(boards.length < n){
    const board = new Board(false, getCriteria('endless', false));

    boards.push(board.save());
  }

  fs.writeFile(`./Output/test${new Date()}`, JSON.stringify(boards), err=> {
      if(err) {
          console.error(err);
          return;
      }
  });

}

//createJSON(500, false);