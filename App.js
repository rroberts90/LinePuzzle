import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, StyleSheet, useWindowDimensions, Vibration} from 'react-native'

import { NodeView, Pulse, GridView} from './NodeViews';
import {Board, calculateColor,rotateColors, ZeroNode} from './GameLogic.js';
import {Cursor} from './UserInput.js';
import {gridPos, point, centerOnNode, logPoint,logGridPos, compareGridPos} from './MathStuff.js';
import ButtonsBar from './ButtonsBar';
import { Segment, UserPath, Fade } from './PathViews';


const App = () => {
 
  const windowWidth = useWindowDimensions().width; 
  const height = useWindowDimensions().height; 

  const board = useRef(null); 
  function getBoard() { // so board is not re initialized every time
  
    if(board.current === null) {
      board.current = new Board(6,4, windowWidth);
   }
   return board.current;
  
  }

  const [currentNode, setCurrentNode] = useState(()=>{return getBoard().getCurrentNode()});
  const [cursorMover, setCursorMover] = useState(null); // hacky state variable to force cursor to rerender.
  const [won, setWon] = useState(false); // hacky state variable to force cursor to rerender.

  //const currentNode = getBoard().getCurrentNode();

  const lineSegments = useRef([]);
  const fadeSegments = useRef([]);

  const pulseTrigger = useRef(0); // triggers pulse animation

  // sets the endPointto the CurrentNode position after it's position is measurable.
  const updateAfterLayout = () => {
    console.log('updateAfterLayout');
    setCursorMover(1);
    resetCurrentNode();
  }

  /** 
   Sets a new current node. 
   Adds segment to previous node
  */
  const updateNodeBundle = (next,node) => {
    //console.log('updateNode');
  
   const prevNode = node;

   setCurrentNode(next);
   const updatedEndPoint = centerOnNode(next.pos, next.diameter);

  const seg = {
   startNode:prevNode,
   endPoint:updatedEndPoint,
};
   lineSegments.current  = [...lineSegments.current, seg];

   pulseTrigger.current++;
  
   if(next === getBoard().finish) {
     setWon(true);
     Vibration.vibrate();
   }
    //console.log(`visited nodes length: ${getBoard().visitedNodes.length}`);
    //console.log(getBoard().visitedNodes);
  };

  function detectMatch(point) {
   // console.log(getBoard().getCurrentNode().gridPos);
  //  console.log(currentNode.gridPos);
  /// console.log('');
  const node = getBoard().getCurrentNode();
  //logGridPos('current: ', node.gridPos);
  
   const {candidate, matchColor} = node.matchPoint(point);
  // logGridPos('candidate Node: ', candidate && candidate.gridPos);
   

   const next = candidate ? getBoard().visitNode(candidate) : null;
    if(next){
      updateNodeBundle(next,node);
      return true;
    }
    else{
      return false;
    }

    
  }

  const currPosF =  currentNode.pos;

  const currX = currentNode.pos.x;
  const currY = currentNode.pos.y;

  function resetCurrentNode(){
    
    setCurrentNode(getBoard().getCurrentNode());
    
    pulseTrigger.current++;
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
    setWon(false); // for testing
  }

  const startCenter = centerOnNode(getBoard().start.pos, getBoard().start.diameter);
  const startPoint = point(startCenter.x, startCenter.y+250);
  
  const finishCenter = centerOnNode(getBoard().finish.pos, getBoard().finish.diameter);
  const finishPoint = point(finishCenter.x, finishCenter.y-250);
  const fixedColor = won ? null : 'grey';

  return ( 

    <View style={styles.container}>

        <UserPath segments={lineSegments.current} fades={fadeSegments.current} />
       
      <Pulse pos={currPosF} colors={rotateColors(currentNode.colors, currentNode.rot)} GOGOGO={pulseTrigger.current} diameter = {currentNode.diameter} />
      <Cursor cursorMover={cursorMover} node={currentNode} currX={currX} currY ={currY} pulseTrigger={pulseTrigger} detectMatch = {detectMatch}  />

      <GridView board={getBoard()} afterUpdate={updateAfterLayout} height={height} wonColor={fixedColor}/>
    <ButtonsBar onRestart = {onRestart} onUndo = {onUndo}/>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: "rgba(248,248,255,1)"

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

export default App;
