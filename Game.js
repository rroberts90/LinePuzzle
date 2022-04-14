import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, View, Animated, useWindowDimensions, Easing, TouchableOpacity, Image } from 'react-native';
import { Board } from './Gameplay/Board';

import Level from './Views/Level';
import ButtonsBar from './Views/ButtonsBar';
import { storeItem, getItem, getItems } from './Storage';
import Timer from './Views/Timer';
import Mover from './Views/Mover';

import Header from './Views/Header'
import useSound from './Sounds';
import {getStar} from './Views/Puzzler';
import Puzzler from './Views/Puzzler';

import GlobalStyles from './GlobalStyles';

import { logPoint } from './Utils';
const Duration = 1500;

const defaultStartTime = 40;

function stackTrace() {
  var err = new Error();
  return err.stack;
}
const Game = ({ navigation, route }) => {

 //console.log = function() {}
 const gameType = route.name;
  const { boardSize, 
    level:puzzleNumber, 
    initialProgress, 
    group: theme, 
    title, 
    difficulty, savedTime} = route.params;

  const [level, setLevel] = useState(0);

  const height = useWindowDimensions().height;

  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(defaultStartTime);

  const [board0Current, setBoard0Current] = useState(true);
  const [board1Current, setBoard1Current] = useState(false);

  const undoEl = useRef(null);
  const restartEl = useRef(null);
  const hintEl = useRef(null);

  const [saveLoaded, setSaveLoaded] = useState(false);

  const {play} = useSound();
  const getBoard = (ref, prevBoard) => {

    if (ref.current === null && !prevBoard) {
      
      ref.current = new Board(gameType, 0, null, boardSize, {puzzleNumber, initialProgress,theme});
      ref.current.level = 0;
      ref.current.forcedFinish = false;

    }

    else if (prevBoard) {

      ref.current = new Board(gameType, prevBoard.level + 1, prevBoard,boardSize, {puzzleNumber, initialProgress,theme});
      ref.current.level = prevBoard.level + 1;
      ref.current.forcedFinish = false;
    }

    return ref.current;

  }

  const translateYAnim0 = useRef(new Animated.Value(0)).current;
  const translateYAnim1 = useRef(new Animated.Value(-height)).current;

  const board0 = useRef(null);
  const board1 = useRef(null);

  useEffect(() => {

    console.log('\n\n---------new game')
    getBoard(board0, null);

    getBoard(board1, board0.current);
    setSaveLoaded(true);
    

    setTimeout(()=> { // hacky way to force all the nodes to get correct positions
      let maxDiameter = 0;
      board1.current.grid.forEach((row, i) =>
      row.forEach((node, j) =>{ 
        node.pos = board0.current.grid[i][j].pos;
        
       }));

    }, 500);  

  }, []);

  useEffect(() => {
    if (gameType === 'tutorial' && level === 6) {
      storeItem('tutorialFinished', true);
      setTimeout(() => navigation.navigate('colormaze'), 1000);
      return;
    }

    if (level > 0) {
      if (level === 1) { // special case give board1 positions
        board1.current.grid.forEach((row, i) =>
          row.forEach((node, j) =>{ node.pos = board0.current.grid[i][j].pos; node.loaded = true;}));

      }
      const end0 = translateYAnim0._value + height;
      const end1 = translateYAnim1._value + height;

      console.log(` level: ${level} `);
  
      // if we're in puzzle mode, and puzzle #20 is finished, end level
     if(gameType === 'puzzle') {
      
      // get the star info and save it
      const star = getStar(time,difficulty).color;
      
      getItem('levelProgress').then(levelProgress=> {
      
        const updatedProgress = levelProgress.map(level=> level);
        updatedProgress[puzzleNumber-1].progress++; //Level is index position +1
        updatedProgress[puzzleNumber-1].visitedNodes = []; // reset visited nodes
        if(star !== GlobalStyles.defaultBackground.backgroundColor) {
          updatedProgress[puzzleNumber-1].stars.push(star);
        }

        storeItem('levelProgress',updatedProgress);

      });

      if(initialProgress + level >= 10){
        console.log('COMPLETED');
        play('packWin');
        setTimeout(()=>navigation.push('afterPuzzle',{puzzleNumber: puzzleNumber, title}), 1000);
    
        }else{
          play('win');
        }

        

     }else{
      play('win');

     }

     const delayTime = gameType === 'puzzle' ? 2000 : 1000;
      Animated.parallel([Animated.timing(translateYAnim0, {
        toValue: end0,
        duration: Duration,
        useNativeDriver: true,
        delay: delayTime,
        easing: Easing.ease
      }),
      Animated.timing(translateYAnim1, {
        toValue: end1,
        duration: Duration,
        useNativeDriver: true,
        delay: delayTime,
        easing: Easing.ease
      })
      ]).start(finished => {
        if (finished) {
          console.log('  level animations finished.');
        } else {
          throw 'Level Animation did not finish';
        }
        if(gameType === 'puzzle'){
          //setTime(0);

        }
        if (level % 2 !== 0) { // board0 is offscreen. reset
          getBoard(board0, board1.current);

          translateYAnim0.setValue(-height);
          translateYAnim1.setValue(0);
          setBoard1Current(true);
          setBoard0Current(false);

        }
        else { // board1 is offscreen. reset
          setBoard0Current(true);
          setBoard1Current(false);

          getBoard(board1, board0.current);
          translateYAnim1.setValue(-height);
          translateYAnim0.setValue(0);

        }

      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);


  const onFinish = async (gameType, highLevel) => {
    getBoard(board0).forcedFinish = true;
    getBoard(board1).forcedFinish = true;
    play('gameOver');

    setTimeout(()=> {
      navigation.push('afterGame', { gameType: gameType, score: level, boardSize: boardSize })
      getBoard(board0).forcedFinish = false;
      getBoard(board1).forcedFinish = false;

    },
    2000);
 

  }


  const puzzleID = level+1 + initialProgress <= 20 ? `${level+1 + initialProgress}` : 10;
  return (<>
    <Animated.View style={{ position: 'absolute', height: '100%', width: '100%', transform: [{ translateY: translateYAnim1 }] }}>

      <Level onWin={setLevel}
        getBoard={() => getBoard(board1)}
        l={getBoard(board1).level}
        current={board1Current}
        undoEl={undoEl}
        restartEl={restartEl}
        hintEl={hintEl}
        setMoves={setMoves}
        setTime={setTime} />
    </Animated.View>

    <Animated.View style={{ position: 'absolute', height: '100%', width: '100%', transform: [{ translateY: translateYAnim0 }] }}>


      <Level onWin={setLevel}
        getBoard={() => getBoard(board0)}
        l={getBoard(board0).level}
        current={board0Current}
        undoEl={undoEl}
        restartEl={restartEl}
        hintEl={hintEl}
        setMoves={setMoves}
        setTime={setTime} />

    </Animated.View>

    <ButtonsBar undoEl={undoEl} restartEl={restartEl} hintEl={hintEl} />

    {gameType === 'timed' ?
      <Timer onFinish={onFinish} level={level} time={time} setTime={setTime} navigation={navigation} /> :
      gameType === 'moves' ?
        <Mover onFinish={onFinish} level={level} moves={moves} navigation={navigation} /> :
      gameType === 'puzzle' ?
        <Puzzler board={board0Current ? board0 : board1} navigation = {navigation} info={{puzzleID: puzzleID, difficulty, savedTime}} time={time} setTime={setTime} level={level}/> :
        <Header fontAnim={1} navigation={navigation}  />
    }

  </>

  );

}

export default Game;
