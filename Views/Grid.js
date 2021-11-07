import { Animated, View, StyleSheet, Easing, Text, Image, useWindowDimensions} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Segment, CapSegment } from './Paths';

import { NodeView } from "./Nodes";
const GridView = (props) => {
    const screenHeight = useWindowDimensions().height;
    const screenWidth =  useWindowDimensions().width;
    const flat = props.board.grid.reduce((flat, row) => [...flat, ...row]);
  
    const nodes = flat.map((node,ndx)=>  
     <NodeView node={node}
    key={ndx}
    afterUpdate = {props.board.getCurrentNode() === node ? props.afterUpdate : null }
    tutorial= {props.tutorial}
    />
    );
  
    const bottomRow = props.board.grid[props.board.grid.length - 1];
    const topRow = props.board.grid[0];

    const boardHeight = bottomRow[0].pos.y - topRow[0].pos.y + topRow[0].diameter;
    const endHeight =  (screenHeight- boardHeight) / 2;
    const startHeight = screenHeight - endHeight - boardHeight;// (screenHeight- boardHeight) / 2;
//    <Animated.View style= {!props.tutorial ? styles.board : {width: screenWidth, paddingHorizontal:5}}  >

    const startCap = 
      <CapSegment 
        end={'start'} 
        node={props.board.start} 
        fixedHeight= {startHeight}/>;
    
        const finishCap = 
        <CapSegment 
          end={'finish'} 
          node={props.board.finish} 
          fixedHeight= {endHeight}
          won={props.won}/>;
      
    return (
    <Animated.View style= {styles.board}  >
        <View style={{width:'100%'}}>
        {finishCap}
        </View>
        {nodes}
        <View style={{width:'100%'}}>
        {startCap}
        </View>
   
    </Animated.View>);
  }

  const styles = StyleSheet.create({
    board: {
        flex: 1,
        justifyContent: "space-evenly",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        paddingHorizontal: 5
          },
    board2: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: 5
    }, 
    cap: {
      flex: 1,
      backgroundColor: 'rgba(0,255,0,.3)'

    },
    grid: {
      flex: 8,
      backgroundColor: 'rgba(255,0,0,.3)'
    }


    
  });
  export default GridView;