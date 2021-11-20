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
import { BackButton } from './Views/NavigationButtons';

const Duration = 1500;

const defaultStartTime = 60;

const Game = ({ navigation, route }) => {
  const gameType = route.name;

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
  const { play } = useSound();

  const getBoard = (ref, prevBoard, boardSize,savedBoard) => {  

    if (ref.current === null && !prevBoard) {
      ref.current = new Board(gameType, 0, null,boardSize,savedBoard);
      ref.current.level = 0;
    }
    else if (prevBoard) { 

      ref.current = new Board(gameType, prevBoard.level + 1, prevBoard);
      ref.current.level = prevBoard.level + 1;

    }

    return ref.current;

  }

  const translateYAnim0 = useRef(new Animated.Value(0)).current;
  const translateYAnim1 = useRef(new Animated.Value(-height)).current;

  const board0 = useRef(null);
  const board1 = useRef(null);

  useEffect(() => {
    // check if there is a save. , and get the board size
    // change saveLoaded to true and proceed as normal
    const saveName = 'saved' + gameType;
    getItems(saveName, 'board').then(vals => {
      const savedBoard = vals[0][1];
      const boardSize = vals[1][1] === 'true' ? true : false;
      if (savedBoard) {
        getBoard(board0, null, boardSize,savedBoard);
      }
      else {
        getBoard(board0,null, boardSize);
      }
      getBoard(board1, board0.current);
      setSaveLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (gameType === 'tutorial' && level === 6) {
      storeItem('tutorialFinished', true);
      setTimeout(() => navigation.navigate('colorflush'), 1000);
      return;
    }

    if (level > 0) {
         if (level === 1) { // special case give board1 positions
         board1.current.grid.forEach((row, i) =>
         row.forEach((node, j) => node.pos = board0.current.grid[i][j].pos));
 
         }
      const end0 = translateYAnim0._value + height;
      const end1 = translateYAnim1._value + height;

      console.log(` level: ${level} `);

      Animated.parallel([Animated.timing(translateYAnim0, {
        toValue: end0,
        duration: Duration,
        useNativeDriver: true,
        easing: Easing.ease
      }),
      Animated.timing(translateYAnim1, {
        toValue: end1,
        duration: Duration,
        useNativeDriver: true,
        easing: Easing.ease
      })
      ]).start(finished => {
        if (finished) {
          console.log('  level animations finished.');
        } else {
          throw 'Level Animation did not finish';
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

  const onFinish = (gameType, highLevel) => {
    navigation.navigate('afterGame', { gameType: gameType, score: highLevel });

  }

  if (!saveLoaded) {
    return (<>
      <Header />
      <BackButton onPress={() => navigation.navigate('colorflush')} />
    </>);
  }
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
      <Timer onFinish={onFinish} level={level}  time = {time} setTime= {setTime}/> : 
      gameType === 'moves'? 
      <Mover onFinish= {onFinish} level = {level} moves={moves}/> : 
      <Header/>
    }
    <BackButton onPress={() => { 
      play('paper'); 
      const currentSave = board0Current ? board0.current.save() : board1.current.save();
      const saveName = 'saved' + gameType;
      storeItem(saveName, currentSave);
      navigation.navigate('colorflush') }
      }/>


  </>

  );

}

export default Game;


/**      <View style={{position:'absolute', width: '100%', height: '15%', backgroundColor:'red', bottom: '-7.5%', left:0}}/>

 *   {gameType ==='null' ? <TouchableOpacity
        style={{position:'absolute', top:40, right: 40, backgroundColor:'grey'}}
        onPress={()=>savePuzzle()}
    >
      <Text style={{fontSize:30}}> Save </Text>
        </TouchableOpacity> : null}

 */