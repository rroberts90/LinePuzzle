import React, {useState, useEffect, useRef} from 'react';
import { Button, StyleSheet, View, Animated, useWindowDimensions, Easing } from 'react-native';
import {Board} from './Gameplay/Board';

import Level from './Views/Level';
import { logGridPos } from './Utils';
const Duration = 1500;

const App = () => {
  const [level, setLevel] = useState(0);

  const height =  useWindowDimensions().height;
  const width = useWindowDimensions().width;
  
  const [board0Current, setBoard0Current] = useState(true);
  const [board1Current, setBoard1Current] = useState(false);

  const getBoard = (ref, prevBoard) =>{  //garuntees board exists at all times
    
    if(ref.current === null && !prevBoard) {

      ref.current = new Board(6,4, width);
      ref.current.level = 0;
      // problem is that both boards are initialized to 0
   }
   else if(prevBoard) { // not the first 

     ref.current = new Board(6,4,width,prevBoard );
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

const onWin = (lev)=> {

  console.log(`onWin: currentLevel: ${level} nextLevel: ${lev} \n`);
  setLevel(lev);
} 

  return (<>

    <Animated.View style={{ position: 'absolute', height: '100%', transform: [{ translateY: translateYAnim1 }] }}>
      <Level onWin={setLevel} getBoard={() => getBoard(board1)} l={getBoard(board1).level} currentLevel={level} translateAnim={translateYAnim1} current={board1Current}/>
    </Animated.View>

    <Animated.View style={{ position: 'absolute', height: '100%', transform: [{ translateY: translateYAnim0 }] }}>
      <Level onWin={setLevel} getBoard={() => getBoard(board0)} l={getBoard(board0).level} currentLevel={level} translateAnim={translateYAnim0} current ={board0Current} />
    </Animated.View>

  </>
    
);
  /**
   *     
   */
  //cst levels = useRef([<Level onWin={onWin} key={0}/>,<Level onWin={onWin} key={1}/>]).current;
  //let currentLevel = <Level onWin={onWin} key={0}/>;
  //let nextLevel = <Level onWin={onWin} key={0}/>;

}

export default App;
