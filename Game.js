import React, {useState, useEffect, useRef} from 'react';
import { Text, StyleSheet, View, Animated, useWindowDimensions, Easing, TouchableOpacity, Image} from 'react-native';
import {Board} from './Gameplay/Board';

import Level from './Views/Level';
import ButtonsBar from './Views/ButtonsBar';
import { storeItem } from './Storage';
import { logGridPos } from './Utils';
import * as FileSystem from 'expo-file-system';
import Timer from './Views/Timer';
import Header from './Views/Header'
import useSound  from './Sounds';
import {BackButton} from './Views/NavigationButtons';


const Duration = 1500;

const Game = ({navigation, route}) => {
  const gameType = route.name;
  const [level, setLevel] = useState(0);

  const height =  useWindowDimensions().height;
  const width = useWindowDimensions().width;
  
  const [board0Current, setBoard0Current] = useState(true);
  const [board1Current, setBoard1Current] = useState(false);

  const undoEl = useRef(null);
  const restartEl = useRef(null);
  const hintEl = useRef(null);
  const {play} = useSound();
  const getBoard = (ref, prevBoard) =>{  //garuntees board exists at all times
    
    if(ref.current === null && !prevBoard) {

      ref.current = new Board(gameType, 0, width);
      ref.current.level = 0;
      // problem is that both boards are initialized to 0
   }
   else if(prevBoard) { // not the first 

     ref.current = new Board(gameType,prevBoard.level+1, width,prevBoard );
     ref.current.level = prevBoard.level+1;

   }

   return ref.current;
  
  }

  const translateYAnim0 = useRef(new Animated.Value(0)).current;
  const translateYAnim1 = useRef(new Animated.Value(-height)).current;

  const board0 = useRef(null);
  const board1 = useRef(null);

  if(board0.current === null) {
    //console.clear();

    getBoard(board0);
    getBoard(board1, board0.current);

    
  }

    useEffect(()=> {
      if(gameType === 'tutorial' && level === 6) {
        storeItem('tutorialFinished',true);
        setTimeout(()=>navigation.navigate('colorflush'), 1000);
        return;
      }

      if(level === 1) { // special case give board1 positions
        board1.current.grid.forEach((row,i ) => 
        row.forEach((node, j) => node.pos = board0.current.grid[i][j].pos));

      }
      if(level > 0) {
        const end0 = translateYAnim0._value + height;
        const end1 = translateYAnim1._value + height;
       
        console.log(` level: ${level} `);
        
        Animated.parallel([Animated.timing(translateYAnim0, {
          toValue: end0 ,
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
      ]).start(finished=> {
           if(finished){
             console.log('  level animations finished.');
           }else{
             throw 'Level Animation did not finish';
           }
           if(level % 2 !== 0) { // board0 is offscreen. reset
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

const savePuzzle = ()=> {
  const board = board0Current ? board0.current : board1.current;

  const fileLoc = `${FileSystem.documentDirectory}/puzzles.txt`;
  console.log(FileSystem.documentDirectory);
  FileSystem.writeAsStringAsync(fileLoc, board.toString()).then(()=>console.log('success')).catch(e=> console.log(e));
}

const onFinish = (gameType,highLevel) => {
  navigation.navigate('afterGame', {gameType:'timed', score: highLevel});

}

  return (<>

    <Animated.View style={{ position: 'absolute', height: '100%', transform: [{ translateY: translateYAnim1 }] }}>
      <Level onWin={setLevel} getBoard={() => getBoard(board1)} l={getBoard(board1).level}  current={board1Current} undoEl={undoEl} restartEl={restartEl} hintEl={hintEl}  />
    </Animated.View>

    <Animated.View style={{ position: 'absolute', height: '100%', transform: [{ translateY: translateYAnim0 }] }}>
      <Level onWin={setLevel} getBoard={() => getBoard(board0)} l={getBoard(board0).level} current ={board0Current} undoEl={undoEl} restartEl={restartEl} hintEl={hintEl} />
    </Animated.View>

    <ButtonsBar undoEl={undoEl} restartEl={restartEl} hintEl={hintEl} />

    {gameType === 'timed' ? <Timer onFinish={onFinish} level={level}/> : <Header />}
    {gameType !=='tutorial' ? <BackButton onPress={()=>{play('paper');navigation.navigate('colorflush')}} />  : null}
  
  
  </>
    
);

}

export default Game;


/**
 *   {gameType ==='null' ? <TouchableOpacity
        style={{position:'absolute', top:40, right: 40, backgroundColor:'grey'}}
        onPress={()=>savePuzzle()}
    >
      <Text style={{fontSize:30}}> Save </Text>
        </TouchableOpacity> : null}
 
 */