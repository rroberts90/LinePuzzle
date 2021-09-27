import { Animated, View, StyleSheet, Easing, Text, Image, useWindowDimensions} from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { convertToLayout, point } from "./MathStuff";
import { Segment, CapSegment } from "./PathViews";
import { calculateColor } from "./BoardLogic";
import {Arrow, Symbol, Special} from './SymbolViews'

const Node_Width = 60;

const borderStyles = (colors) => {
    return {
      borderTopColor: colors[0],
      borderRightColor: colors[1],
      borderBottomColor: colors[2],
      borderLeftColor: colors[3],
    }
  }

  const dynamicNodeSize = (diameter, margin) => {
      return {
        marginVertical:  diameter /6 ,
        marginHorizontal: diameter /12,
        width: diameter,
        height: diameter,
        borderRadius: diameter / 2,
        borderWidth: diameter / 6,
        backgroundColor: "lightgrey",
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1
      };
  }
  const dynamicNodeSizeNoPosition = (diameter) => {
      return {
              width: diameter,
        height: diameter,
        borderRadius: diameter / 2,
        borderWidth: diameter / 6
      };
  }
  const pulseSize = (diameter) => {
    return {
            width: diameter,
      height: diameter,
      borderRadius: diameter / 2,
      borderWidth: diameter / 2
    };
}
const rotToTransform = (rot) =>{
    const degrees = rot * -90; // negative because colors are rotated counter clockwise by default
    return {transform: [{rotate:`${degrees}deg`}]};
  }

const shouldAddArrow = (node, neighbor) => {
 
  if(node.links.includes(neighbor)){
    // if link exists and node has no symbol always draw link. 
    if(!node.symbol){
      return true;
    }
    if(node.symbol !== neighbor.symbol) { // matches symbols already tells user nodes are linked.
      return true;
    } else {
      return false;
    }

  }else{
    return false;
  }
}

const Frozen = ({node}) => {
  return ((node.frozen > 0) ? 
  <View style={{backgroundColor: 'dimgrey', opacity:.5, width:node.diameter,
   height:node.diameter, position:'absolute', borderWidth: node.diameter/6,
    borderRadius: node.diameter/2, borderColor:'darkgrey'}}/>: null);
}

const NodeView = (props) => {

    const rotAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(()=>{
        Animated.timing(rotAnim, {
            toValue: props.node.rot * -90,
            duration: 1000,
            useNativeDriver: true,
    
          }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.node.rot]);

    const colorStyles = borderStyles(props.node.colors);
   const arrowNodes = props.node.neighbors.filter(neighbor=> shouldAddArrow(props.node, neighbor) );
    
    return (
      <Animated.View style={[
      dynamicNodeSize(props.node.diameter),
        colorStyles,
        {transform: [{rotate:rotAnim.interpolate({
                inputRange: [0,360],
                outputRange:['0deg', '360deg']
            })}]}
        ]}

        onLayout={(event)=>{
             props.node.pos = {x:event.nativeEvent.layout.x,y:event.nativeEvent.layout.y};
             if(props.afterUpdate) {
               props.afterUpdate();
             }
   }}
       >
     <Special node={props.node}/>
     <Symbol group= {props.node.symbol} diameter ={props.node.diameter} />
     <Frozen node={props.node}/>
      {arrowNodes.map((neighbor,i)=> <Arrow node={props.node} linkedNode= {neighbor} key={i} rotAnim={rotAnim} />)}
      </Animated.View>
    );
  } 
  /**   {//props.node.links.filter(node=> props.node.neighbors.includes(node))
     .map((node,i) => <Arrow node= {props.node} linkedNode= {node} key={i} />)}
      */
  const Pulse = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const sizeAnim = useRef(new Animated.Value(1)).current;
    

    const colorStyles = borderStyles(props.colors);
    const duration = 500;
    useEffect(() => {

      if(props.GOGOGO > 0){

        //console.log("pulsing");
      fadeAnim.setValue(1);
      sizeAnim.setValue(1);
      
      Animated.parallel([
        Animated.timing(sizeAnim, {
          toValue: 1.35,
          duration: duration,
          useNativeDriver: true,
          easing: Easing.linear

        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
          easing: Easing.quad
        })
      ]).start(finished => {
        if (!finished) {
          // make sure that the pulse's opacity is 0 at end
          fadeAnim.setValue(0);
  
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.GOGOGO]);
  
    return <Animated.View
      style={[
        dynamicNodeSizeNoPosition(props.diameter),
        styles.pulse,
        colorStyles,
        convertToLayout(props.pos),
        {
          opacity: fadeAnim,
          transform: [ {scale:sizeAnim}]
        }]}
  
    />
  
  }

  const GridView = (props) => {
    const translateYAnim = useRef(new Animated.Value(-props.height)).current;
    const screenHeight = useWindowDimensions().height;
   /* useEffect(()=> {

      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 2500,
        useNativeDriver: true,
        easing: Easing.ease
      }).start();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);*/
  
    const flat = props.board.grid.reduce((flat, row) => [...flat, ...row]);
  
    const nodes = flat.map((node,ndx)=>  
     <NodeView node={node}
    key={ndx}
    afterUpdate = {props.board.getCurrentNode() === node ? props.afterUpdate : null }
    />
    );
  
    const bottomRow = props.board.grid[props.board.grid.length - 1];
    const topRow = props.board.grid[0];
    const boardHeight = bottomRow[0].pos.y - topRow[0].pos.y + topRow[0].diameter;
    const endHeight =  (screenHeight- boardHeight) / 2;
    const startHeight = (screenHeight- boardHeight) / 2;



    const startCaps = bottomRow.map((node, i) =>
      <CapSegment color={node.colors[2]}
        end={'start'} 
        visible={props.board.start === node} 
        nodeDiameter={node.diameter} 
        key={i} fixedHeight= {startHeight}/>);
    
    const finishCaps = topRow.map((node, i) =>
      <CapSegment color={props.wonColor || calculateColor(node, point(node.pos.x, node.pos.y-100))}
        end={'finish'} 
        visible={props.board.finish === node} 
        nodeDiameter={node.diameter} 
        fixedHeight={endHeight}
        key={i} />);

    return (
    <View style= {[styles.board]}  >
        {finishCaps}
        {nodes}
        {startCaps}
   
    </View>);
  }
  

  const styles = StyleSheet.create({
    nodeSize: {
      position: "absolute",
      width: Node_Width,
      height: Node_Width,
      borderRadius: Node_Width / 2,
      borderWidth: Node_Width / 6,
      backgroundColor: "lightgrey",
      zIndex: 10
    },
    nodeBorder: {
    },
    pulse: {
        position: "absolute",
      backgroundColor: "darkgrey",
      zIndex: 0
    },
    textSymbol: {
      fontSize: 30
    },
  
    board: {
      flex: 1,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      paddingHorizontal: 5,
      height:'100%'
      
    }
});
/**     <Segment startNode={props.board.start} endPoint={startPoint}/>
        <Segment startNode={props.board.finish} endPoint={finishPoint} fixedColor={fixedColor}/>
         */
const nodeSize = styles.nodeSize;
  export {NodeView, Pulse, GridView, dynamicNodeSize, dynamicNodeSizeNoPosition};