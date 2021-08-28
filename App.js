import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, StyleSheet, useWindowDimensions, Button, TouchableOpacity, Image, Text} from 'react-native'

import { NodeView, Pulse} from './NodeViews';
import {Board, calculateColor,rotateColors, ZeroNode} from './GameLogic.js';
import {Cursor} from './UserInput.js';
import {gridPos, point, centerOnNode, logPoint,logGridPos, compareGridPos}from './MathStuff.js';

import ButtonsBar from './ButtonsBar'

import { Segment, UserPath } from './PathViews'

const GridView = (props) => {
  const flat = props.board.grid.reduce((flat, row) => [...flat, ...row]);

  const nodes = flat.map((node,ndx)=>  
   <NodeView node={node}
  key={ndx}
  afterUpdate = {props.board.getCurrentNode() === node ? props.afterUpdate : null }
  />
  );

  return (
  <View style= {[styles.board]} 
  >
      {nodes}
      {props.children}
  </View>);
}

const App = () => {
 
  const windowWidth = useWindowDimensions().width; 

  const board = useRef(null); 
  function getBoard() { // so board is not re initialized every time
  
    if(board.current === null) {
      board.current = new Board(6,4, gridPos(5,2) , gridPos(0,2), windowWidth);
   }
   return board.current;
  
  }

  const [currentNode, setCurrentNode] = useState(()=>{return getBoard().getCurrentNode()});
  const [cursorMover, setCursorMover] = useState(null); // hacky state variable to force cursor to rerender.

  //const currentNode = getBoard().getCurrentNode();

  const lineSegments = useRef([]);
  const pulseTrigger = useRef(0); // triggers pulse animation

  /*useEffect(()=>{ // test snippet
    const board = getBoard();
    const next = board.start
    const seg = <Segment startNode={board.getCurrentNode()} endPoint ={updatedEndPoint} key={lineSegments.current.length}/>

    lineSegments.current  = [...lineSegments.current, seg];
  },[]);*/


  // sets the endPointto the CurrentNode position after it's position is measurable.
  const updateAfterLayout = () => {
    console.log('updateAfterLayout');
    // loaded.current = true;
    setCursorMover(1);
    //resetCurrentNode();
  }

  /** 
  Handles side effects of setting a new current node. 
  // updates the pulse position.
  //esets current Node state
  // adds segment between currentNode and lastCurrentNode to UserPath
  // rotates linked nodes
  */
  const updateNodeBundle = (next,node) => {
    //console.log('updateNode');
  
   const prevNode = node;

   setCurrentNode(next);
   const updatedEndPoint = centerOnNode(next.pos, next.diameter);

   const seg = <Segment startNode={prevNode} endPoint ={updatedEndPoint} key={lineSegments.current.length}/>

   lineSegments.current  = [...lineSegments.current, seg];

   pulseTrigger.current++;

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
      lineSegments.current.pop();
      resetCurrentNode();
    

    }
  }

  function onRestart() {
    getBoard().restart();
    lineSegments.current = [];
    resetCurrentNode();

  }
  return ( 

    <View style={styles.container}>

        <UserPath segments={lineSegments.current} />
       
      <Pulse pos={currPosF} colors={rotateColors(currentNode.colors, currentNode.rot)} GOGOGO={pulseTrigger.current} diameter = {currentNode.diameter} />
      <Cursor cursorMover={cursorMover} node={currentNode} currX={currX} currY ={currY} pulseTrigger={pulseTrigger} detectMatch = {detectMatch}  />

      <GridView board={getBoard()} afterUpdate={updateAfterLayout}/>

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
  board: {
    paddingTop: '25%',
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingHorizontal: 5
    
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

/**
 *       <Svg style={{position: "absolute"}} height="100%" width="100%">
        <UserPath segments={lineSegments.current} />
        <Segment startNode={currentNode} endPoint={endPoint} />
      </Svg>
 */
//  OTHER WAY OF MEASURING NODE POSITION. NEEDS A SETTIMEOUT TO WORK.     
  /*
    const measuredRef = useRef(null); // will measure location of current node

    useLayoutEffect(()=> {
    if(measuredRef.current) {
      measuredRef.current.measure((x,y, width, height, px,py) => {
          console.log(`finally. ${x} ${y} ${width} ${height} ${px} ${py}`);
      });
  }
  else {
    console.log('thought the whole point was this would work??');
  }
  
      setEndPoint(centerOnNode(currentNode.pos, currentNode.diameter));
      pulseTrigger.current += 1;
  
  },[]);*/