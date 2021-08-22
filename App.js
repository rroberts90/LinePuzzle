import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, StyleSheet, useWindowDimensions, Button, TouchableOpacity, Image, Text} from 'react-native'
import { Svg, Line, G } from 'react-native-svg'

import { NodeView, Pulse} from './NodeViews'
import {Board, calculateColor,rotateColors, ZeroNode} from './GameLogic.js'
import {Cursor} from './UserInput.js'
import {gridPos, point, centerOnNode, logPoint,logGridPos, compareGridPos}from './MathStuff.js'

const Segment = ({startNode, endPoint}) => {

  const color = calculateColor(startNode, endPoint );
  
  const startPos = centerOnNode(startNode.pos,  startNode.diameter);
  const endPos  = endPoint; //centerEndPoint ? centerOnNode(endPoint, startNode.diameter): endPoint;

  return <Line
    x1={startPos.x}
    x2={endPos.x}
    y1={startPos.y}
    y2={endPos.y}
    fill='none'
    stroke={color}
    strokeWidth='10'
    strokeLinecap='round'
  />;
}

const UserPath = (props) => {
  return (
    <G>
      {props.segments}
    </G>
  );
}

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
  //const currentNode = getBoard().getCurrentNode();
  const [endPoint, setEndPoint] = useState(()=> currentNode.pos);

  const lineSegments = useRef([]);
  const pulseTrigger = useRef(0); // triggers pulse animation

  // sets the endPointto the CurrentNode position after it's position is measurable.
  const updateAfterLayout = () => {
    console.log('updateAfterLayout');
    setEndPoint(centerOnNode(currentNode.pos, currentNode.diameter));
    // loaded.current = true;
     pulseTrigger.current += 1;
  }

  /** 
  Handles side effects of setting a new current node. 
  // updates the pulse position.
  //esets current Node state
  // adds segment between currentNode and lastCurrentNode to UserPath
  // rotates linked nodes
  // resets endPoint to current Node.
  */
  const updateNodeBundle = (next,node) => {
    console.log('updateNode');
  
   const prevNode = node;
   const updatedEndPoint = centerOnNode(next.pos, next.diameter);

   setCurrentNode(next);
   setEndPoint(updatedEndPoint);

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
  
  //logPoint('currentPoint', currentNode.pos);
  //logPoint('endPoint', endPoint);
  const currPosF =  currentNode.pos;

  const currX = currentNode.pos.x;
  const currY = currentNode.pos.y;
//
//source={{uri:'https://reactnative.dev/img/tiny_logo.png'}} />
  return ( 

    <View style={styles.container}>

      <Svg style={{position: "absolute"}} height="100%" width="100%">
        <UserPath segments={lineSegments.current} />
        <Segment startNode={currentNode} endPoint={endPoint} />
      </Svg>
    
      <GridView board={getBoard()} afterUpdate={updateAfterLayout}/>
        <Cursor  setEndPoint={setEndPoint} node={currentNode} currX={currX} currY ={currY} pulseTrigger={pulseTrigger} detectMatch = {detectMatch}  />
        <Pulse pos={currPosF} colors={rotateColors(currentNode.colors, currentNode.rot)} GOGOGO={pulseTrigger.current} diameter = {currentNode.diameter} />

      <View style={styles.buttonsBar}>
        <TouchableOpacity style={styles.button} onPress={() => {
          console.log('undo');
          
          if (getBoard().removeLast()) {
            lineSegments.current.pop();

            setCurrentNode(getBoard().getCurrentNode());
            setEndPoint(centerOnNode(getBoard().getCurrentNode().pos, getBoard().getCurrentNode().diameter));
            pulseTrigger.current++;

          }
      }}>
         <Image style={styles.icon} source={require('./Icons/undo.png')}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() =>{

          console.log('restart')
          getBoard().restart();
          lineSegments.current = [];
          setCurrentNode(getBoard().getCurrentNode());
          setEndPoint(centerOnNode(getBoard().getCurrentNode().pos, getBoard().getCurrentNode().diameter));
          pulseTrigger.current++;

        }}>
          <Image style={styles.icon} source={require('./Icons/restart.png')} />
        </TouchableOpacity>
      </View>
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
  icon: {
    width:50,
    height:50,
    tintColor: "rgb(59,68,75)" 
  },
  button: {
    marginLeft: 30,
    marginBottom: 30,
  },
  buttonsBar: {
    flexDirection:'row'
  }

});

export default App;


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