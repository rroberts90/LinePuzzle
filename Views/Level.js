import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, StyleSheet, useWindowDimensions, Vibration, Button} from 'react-native'

import { Pulse, GridView} from './Nodes';
import {Cursor} from './UserInput';
import {point, centerOnNode,logGridPos,rotateColors} from '../Utils';
import ButtonsBar from './ButtonsBar';
import { UserPath } from './Paths';
import useInterval from './useInterval.js';

const displaySolution = (solution) => {
  return solution.slice(1).map((node,i)=> {
    const prevNode = solution[i];
    return {startNode: prevNode, endPoint: centerOnNode(node.pos, node.diameter) }
  });
}

const Level = ({onWin, l, getBoard, currentLevel, translateAnim, current}) => {
  const windowWidth = useWindowDimensions().width; 
  const height = useWindowDimensions().height; 

  const [win, setWin] = useState(()=> false);

  const [currentNode, setCurrentNode] = useState(()=>{return getBoard().getCurrentNode()});

  //const currentNode = getBoard().getCurrentNode();

  const lineSegments = useRef([]);
  const fadeSegments = useRef([]);
//  setTimeout(()=> {lineSegments.current = displaySolution(getBoard().solution)}, 500);
  const [pulser, triggerPulser] = useState(()=>0); // triggers pulse animation

  const intervalId = useRef(null);
  const [hintAllowed, toggleHint] = useState(true);

  const [defaultPulser, setDefaultPulser] = useState(0);

  useEffect(()=>{
    //console.log(`---------------\nLevel ${l} start color: ${getBoard().start.colors[2]}\n`);
    //logGridPos('    start',getBoard().start.gridPos);
    if (l !== 0) {
    resetCurrentNode(1500);
    }
    lineSegments.current = [];
    setWin(false);
    setDefaultPulser(0);

    //logGridPos('currentNode:', getBoard().getCurrentNode().gridPos);
  },[l]);

  
  useInterval(() => {
    
    if(getBoard().getCurrentNode() === getBoard().start){
    triggerPulser(currentValue=> currentValue+1);
    }
    setDefaultPulser(defaultPulser + 1);

  }, 5000);
  /*useEffect(()=>{
    if(current){
    //console.log('is current');
    if(intervalId.current){
      clearInterval(intervalId.current);
    }
    async function starterPulse () {
      //console.log(`current pulser: ${pulser}`);
      //const _ = pulser +1;
     // await sleep(500);

      triggerPulser(currentValue=> currentValue+1);
    }
    intervalId.current = setInterval(starterPulse, 3000);
    }
  }, [current]);*/

  
  // sets the endPointto the CurrentNode position after it's position is measurable.
  const updateAfterLayout = () => {
    resetCurrentNode(100);

  }

  /** 
   Sets a new current node. 
   Adds segment to previous node
  */
  const updateNodeBundle = (next,node) => {
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
    console.log('got to finish node. ');
    setWin(true);
   
    setTimeout(()=>onWin(currentLevel=> currentLevel+1), 500);

    Vibration.vibrate();
   }
  /* const oneAway = next.neighbors.find(neighbor=> {
     return neighbor === getBoard().finish && next.isMatch(neighbor)
   });

   if(oneAway){
     console.log('one away no hints');
    toggleHint(false);
   }*/

  };

  function detectMatch(point) {
   // console.log(getBoard().getCurrentNode().gridPos);
  //  console.log(currentNode.gridPos);
  /// console.log('');
  const node = getBoard().getCurrentNode();
  //logGridPos('current: ', node.gridPos);
  

   const {candidate} = node.matchPoint(point);
  // logGridPos('candidate Node: ', candidate && candidate.gridPos);
   
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
        setTimeout( ()=>  triggerPulser(currentValue => currentValue+1)
        ,makePulseWait);
    }

  }

  function sleep(ms) {
    return new Promise(resolve=> setTimeout(resolve,ms));
  }
   
  async function onHint() {
    console.log(`hint allowed? ${hintAllowed}`);
    if(!hintAllowed) {
      return;
    }

    toggleHint(false);
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
      updateNodeBundle(next, prev);
      toggleHint(true);
  }

  function onUndo() {

    if (getBoard().removeLast()) {

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

  const startCenter = centerOnNode(getBoard().start.pos, getBoard().start.diameter);
  const startPoint = point(startCenter.x, startCenter.y+250);
  
  const finishCenter = centerOnNode(getBoard().finish.pos, getBoard().finish.diameter);
  const finishPoint = point(finishCenter.x, finishCenter.y-250);
  return ( 

    <View style={[styles.container]} >

      <UserPath segments={lineSegments.current} fades={fadeSegments.current} />
         
      <Pulse pos={currPosF} colors={rotateColors(currentNode.colors, currentNode.rot)} GOGOGO={pulser} diameter = {currentNode.diameter} />
      <Cursor node={currentNode} currPoint={point(currX, currY)} triggerPulser={triggerPulser} detectMatch = {detectMatch} intervalId={intervalId} />

      <GridView board={getBoard()} afterUpdate={updateAfterLayout} height={height} won={win}/>
    <ButtonsBar onRestart = {onRestart} onUndo = {onUndo} onHint={onHint} isCurrent={current} translateAnim={translateAnim} hintAllowed={hintAllowed}/>
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
    width:"100%"
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
  
  testSize: {
    position: "absolute",
    width: 58.5,
    height: 58.5,
    borderRadius: 58.5 / 2,
    borderWidth:58.5 / 6,
    backgroundColor: "lightgrey",
    zIndex: 10
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