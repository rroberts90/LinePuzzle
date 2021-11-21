import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, StyleSheet, useWindowDimensions, Vibration, Button} from 'react-native'

import { Pulse} from './Nodes';
import GridView from './Grid';
import {Cursor} from './UserInput';
import {point, centerOnNode,logGridPos,rotateColors} from '../Utils';
import { UserPath } from './Paths';
import useInterval from './useInterval.js';
import { levelUp, getItem} from '../Storage';
import useSound from '../Sounds'
import Tooltip from './Tooltip'
import {Arrows} from './Symbols'

const displaySolution = (solution) => {
  return solution.slice(1).map((node,i)=> {
    const prevNode = solution[i];
    return {startNode: prevNode, endPoint: centerOnNode(node.pos, node.diameter) }
  });
}


const Level = ({onWin, l, getBoard, current, hintEl, undoEl, restartEl, setMoves, setTime}) => {
  const windowWidth = useWindowDimensions().width; 
  const height = useWindowDimensions().height; 

  const [win, setWin] = useState(()=> false);

  const [currentNode, setCurrentNode] = useState(()=>{return getBoard().getCurrentNode()});

  const lineSegments = useRef([]);
  const fadeSegments = useRef([]);
  const [pulser, triggerPulser] = useState(()=>0); // triggers pulse animation

  const intervalId = useRef(null);

  const [defaultPulser, setDefaultPulser] = useState(0);
  const [loading, toggleLoading] = useState(true);

  const {play} = useSound();
  
  useEffect(()=>{
    //console.log(`---------------\nLevel ${l} start color: ${getBoard().start.colors[2]}\n`);
    //logGridPos('    start',getBoard().start.gridPos);
    if (l !== 0) {
    resetCurrentNode(1600);
    }

    lineSegments.current = [];
    
    /*console.log(`${l} called to setup level`);
    console.log(`visited Nodes length: ${getBoard().visitedNodes.length}\n`);
    if (getBoard().visitedNodes.length > 1) {
      getBoard().visitedNodes.reduce((prev, curr) => {
        const updatedEndPoint = centerOnNode(curr.pos, curr.diameter);
        const seg = {
         startNode:prev,
         endPoint:updatedEndPoint,
        };
        lineSegments.current  = [...lineSegments.current, seg];
      
      return curr;
    });
  }*/
    
    setWin(false);
    setDefaultPulser(0);
    getBoard().restart();
    //resetCurrentNode(1);
    return () => {
      console.log(`return ${l} effect`);
      //getBoard().restart();
  }
  },[l]);

  useInterval(() => {
    
    if(getBoard().getCurrentNode() === getBoard().start){
    triggerPulser(currentValue=> currentValue+1);
    }
    setDefaultPulser(defaultPulser + 1);
    return ()=> {
      console.log('clearing interval');
      triggerPulser(0);
      setDefaultPulser(0);
    };
  }, 5000);
  
  // sets the endPointto the CurrentNode position after it's position is measurable.
  const updateAfterLayout = () => {
    resetCurrentNode(1);
    setTimeout(()=>{
      if(loading) {
        toggleLoading(false);
      }
    }, 300);
    
  }

  /** 
   Sets a new current node. 
   Adds segment to previous node
  */
  const updateNodeBundle = (next,node, hint) => {
   // play('connect');
   const prevNode = node;
   setCurrentNode(next);

   const updatedEndPoint = centerOnNode(next.pos, next.diameter);

  const seg = {
   startNode:prevNode,
   endPoint:updatedEndPoint,
  };
   lineSegments.current  = [...lineSegments.current, seg];

   triggerPulser(currentValue => currentValue+1);
  
   if(next === getBoard().finish) {
    //console.log('got to finish node. ');
    levelUp(getBoard().gameType, l);  

    setWin(true); // triggers end line fade in 
    hintEl.current.onPress = null;
    setTimeout(()=>onWin(currentLevel=> currentLevel+1), 500);


    // check if vibrate is AOK with user
    play('win');

    getItem('vibrate').then(vibrate=> {
      if(vibrate){
        Vibration.vibrate();
      }

    });


   }else{
    play(hint ? 'button' : 'connect');

   }
   if(next.special === 'booster') {
    setMoves(moves=> moves- 5);
    setTime(time => time+5);
    next.special = null;
    setMoves(moves=> moves+1);

 }else{
  setMoves(moves=> moves+1);

 }

  };

  function detectMatch(point) {

  const node = getBoard().getCurrentNode();
  

   const {candidate} = node.matchPoint(point);
   
    if (candidate) {
      const { next, prev } = getBoard().visitNode(candidate);
      if (next) {

        updateNodeBundle(next, node);
        return {newNode: next, prevPoint: null};
      }
      else if (prev) {
        onUndo();
        return {newNode: null, prevPoint: prev.pos};
      }
    } else {
      return {newNode: null, prevPoint:null};
    }

  }

  const currPosF =  currentNode.pos;

  const currX = currentNode.pos.x;
  const currY = currentNode.pos.y;

  function resetCurrentNode(makePulseWait){
    
    setCurrentNode(getBoard().getCurrentNode());

    if(!makePulseWait) {
        triggerPulser(currentValue => currentValue+1);
    }else{
        setTimeout( ()=>  {
          if( pulser) {
            triggerPulser(currentValue => currentValue+1)
          }
        }
        ,makePulseWait);
    }

  }

  function sleep(ms) {
    return new Promise(resolve=> setTimeout(resolve,ms));
  }
   
  async function onHint() {

    const board = getBoard();
    const {removeCount, nextNode}  = getBoard().hint();

    const duration = 300;
    for(var i =0; i< removeCount;i++){
        onUndo();
        await sleep(duration);
    }

     const prev = getBoard().getCurrentNode();
     const {next} = getBoard().visitNode(nextNode);

     if(next === null) {
       throw 'solution is not accurate';
     }
      updateNodeBundle(next, prev, true);
      return removeCount * duration + 500;
  }

  function onUndo(button) {

    if (getBoard().removeLast()) {
      play(button ? 'button' : 'undo');
      const seg = lineSegments.current.pop();
      fadeSegments.current.push(seg);
      resetCurrentNode();

    }
  }

  function onRestart() {
    getBoard().restart();
    lineSegments.current = [];
    resetCurrentNode();
    setWin(false);
  }

  useEffect(()=> {
    if(current) {
    hintEl.current.onPress = onHint;
    undoEl.current.onPress = onUndo;
    restartEl.current.onPress = onRestart;
    }
  }, [current]);

  const loadingWall = loading ? <View style={{position: 'absolute', width:'100%', height:'100%', backgroundColor:'rgba(248,248,255,1)', zIndex: 20 }}/> : null;

  return ( 

    <View style={[styles.container]} >

<Arrows  grid={getBoard().grid}/>

      <UserPath segments={lineSegments.current} fades={fadeSegments.current} />
         
      <Pulse pos={currPosF} colors={rotateColors(currentNode.colors, currentNode.rot)} GOGOGO={pulser} diameter = {currentNode.diameter} />

      <Cursor node={currentNode} currPoint={point(currX, currY)} triggerPulser={triggerPulser} detectMatch = {detectMatch} intervalId={intervalId} />
      <GridView board={getBoard()} afterUpdate={updateAfterLayout} height={height} won={win} />
      {/*getBoard().gameType==='tutorial' ? <Tooltip level={l}/> : null*/}

      {loadingWall}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: 'rgba(248,248,255,1)'

  },
  spacer: {
    height: '25%'
  },
  
  row: {
    flex:1,
    flexDirection: "row",
    justifyContent: "space-between",
    width:"100%",
    backgroundColor: 'rgba(248,248,255,1)'
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "bold"
  },
  origin: {
    position: "absolute",
    top: 100,
    left: 100
  },
  rect: {
    width: 50,
    height: 50,
    backgroundColor: "blue",
    borderRadius: 1,
    margin: 10
  },
  zero: {
    position: "absolute",
    height: '100%',
    width: '100%',
    padding: 0,
    margin: 0,
  },
  dot: {
    width:50,
    height:50,
    position: 'absolute',
    top: 0,
    left: 0,
  }

});

export default Level;