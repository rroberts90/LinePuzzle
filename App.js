import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from "react";
import { Animated, View, StyleSheet, PanResponder, Text, TextPropTypes, Button, measureInWindow} from "react-native";
import { Svg, Path, Line, Rect, Circle, G } from 'react-native-svg';

import { Node, Pulse, dynamicNodeSize ,dynamicNodeSizeNoPosition} from './NodeCode';
import {Board, centerOnNode, distance, rotateColors, calculateColor, toDegrees} from './GameLogic.js';
import {Cursor} from './UserInput';

const Segment = (props) => {

  return <Line
    x1={props.x1}
    x2={props.x2}
    y1={props.y1}
    y2={props.y2}
    fill="none"
    stroke={props.color}
    strokeWidth="10"
  />;
}

const UserPath = (props) => {
  return (
    <G>
      {props.segments}
    </G>
  );
}

const NodeGrid = (props) => {
  const flat = props.grid.reduce((flat, row) => [...flat, ...row]);

  const nodes = flat.map((node,ndx)=>  
  <Node node={node}
  key={ndx}
  />);

  return (
  <View style= {[styles.board]}>
      {nodes}
      {props.children}
  </View>);
}

const App = () => {

  const start = {row:4,col: 2};
  const board = useRef(new Board(5,5,start )).current;
 
  //setInterval(()=> { console.log("board positions: ");
  //board.grid.forEach(row=> row.forEach(node=> console.log(node.pos)));}, 2000)
 
  const [currentNode, setCurrentNode] = useState(board.getCurrentNode());
  const [endPoint, setEndPoint] = useState(currentNode.pos);//centerOnNode(currentNode.pos, currentNode.diameter));
 
  useEffect(()=> {
    setTimeout(()=> {
      setCurrentNode(board.getCurrentNode());
      setEndPoint(centerOnNode(currentNode.pos, currentNode.diameter));
    }, 500);
  },[]);

  const lineSegments = useRef([]).current;
  const pulseFlag = useRef(0);
  
  const color = calculateColor(currentNode, endPoint );
  const currPos = centerOnNode(currentNode.pos, currentNode.diameter);
  const currPosF =  currentNode.pos;//centerOnNodeFlipped(currentNode.pos, currentNode.diameter);

  const currX = currentNode.pos.x;
  const currY = currentNode.pos.y;
  
  return (

    <View style={styles.container}>
      <NodeGrid  grid={board.grid} >
        </NodeGrid>
        <Cursor  setEndPoint={setEndPoint} node={currentNode} currX={currPosF.x} currY ={currPosF.y} />

      <Svg style={{position: "absolute"}} height="100%" width="100%">
        <UserPath segments={lineSegments} />
        <Segment x1={currPos.x} y1={currPos.y} x2={endPoint.x} y2={endPoint.y} color={color} />
      </Svg>


    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: "rgba(248,248,255,1)",

  },
  board: {
    paddingTop: '30%',
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  
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
  }

});

export default App;

/**
 *      
  <Pulse pos={currentNode.pos} colors={currentNode.colors} GOGOGO={pulseFlag.current} diameter = {currentNode.diameter}/>

 *   const rows = props.grid.map(row => {
   return ( 
     <Row height={row[0].diameter} key={row[0].gridPos.row}>
       {row.map(node=>{
         console.log(`diameter: ${node.diameter}`);
       //return <Node pos={node.pos} colors={node.colors} rot={node.rot} diameter = {node.diameter} key={node.gridPos.row+ node.gridPos.col} />  
     return<View style={styles.rect} />
  }
        )}
    </Row>
    );
  }
  );

       <Animated.View
        style={[{
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          position: "absolute",
          top: currX,
          left: currY,
        }, dynamicNodeSize(currentNode.diameter), styles.cursor]}
        {...panResponder.panHandlers}
      >

      </Animated.View>


        console.log(`Segment position1: ${props.x1} ${props.y1}`);
  console.log(`Segment position2: ${props.x2} ${props.y2}`);
  console.log(`Segment color: ${props.color}`);

   onLayout={(event)=> {console.log(`CursorLayout: ${event.nativeEvent.layout.x} ${event.nativeEvent.layout.y}`)}}
 */