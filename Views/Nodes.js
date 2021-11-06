import { Animated, View, StyleSheet, Easing, Text, Image, useWindowDimensions} from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { convertToLayout, point } from '../Utils';
import { Segment, CapSegment } from './Paths';
import { calculateColor } from '../Gameplay/Board';
import {Arrow, Symbol, Special} from './Symbols'
import { useLinkProps } from "@react-navigation/native";

const Node_Width = 60;
const test = (ref, node, afterUpdate) => {
  if(ref.current) {
    ref.current.measureInWindow((x,y,width, height)=> {
      node.pos = {x:x,y:y};
      if(afterUpdate) {
        afterUpdate();
      }
    });

  }else{
    throw 'measure node error'
  }
}
const borderStyles = (colors) => {
    return {
      borderTopColor: colors[0],
      borderRightColor: colors[1],
      borderBottomColor: colors[2],
      borderLeftColor: colors[3],
    }
  }

  const dynamicNodeSize = (diameter, tutorial) => {
      
      return {
        marginVertical:  diameter /6,
        marginHorizontal: tutorial ? '50%' : 0,
        width: diameter,
        height: diameter,
        borderRadius: diameter / 2,
        borderWidth: diameter / 6,
        backgroundColor: "lightgrey",
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
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
//  <View style={{width:node.diameter + node.diameter/12 -2, height: 4, backgroundColor:'black', position:'absolute', top: '55%', borderRadius:2}}/>

const Frozen = ({node, rotAnim}) => {

  const width = (node.diameter- node.diameter/12 - 10) /2;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (node.frozen === 0) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.Quad
      }).start();
    }
    else if(node.frozen > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.Quad
      }).start();
    }
  }, [node.frozen]);

  return (
  <Animated.View style={{position:'absolute', opacity: fadeAnim, transform: [{rotate:rotAnim.interpolate({
    inputRange: [0,360],
    outputRange:['0deg', '-360deg']
})}]}}>

     <View style={{width:width -1, height: 2, backgroundColor:'rgb(36,36,36)', position:'absolute',alignSelf:
     'flex-start', top: '55%', left:1, borderRadius:5}}/>
      <View style={{alignSelf:'flex-end',width:width-1, height: 2, backgroundColor:'rgb(36,36,36)', position:'absolute', top: '55%', right:1,borderRadius:2}}/>
    <Image style={styles.lock} source={require('../Icons/Lock1.png')}/>

  <View style={{backgroundColor: 'dimgrey', opacity:.1, width:node.diameter+3,
   height:node.diameter+3, borderWidth: node.diameter/6,
    borderRadius: node.diameter/2, borderColor:'dimgrey'}}>
   
    </View>

    </Animated.View>);
}

const NodeView = (props) => {

    const rotAnim = useRef(new Animated.Value(0)).current;
    const measureRef = useRef(null);
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
      <Animated.View ref={measureRef} style={[
      dynamicNodeSize(props.node.diameter, props.tutorial),
        colorStyles,
        {transform: [{rotate:rotAnim.interpolate({
                inputRange: [0,360],
                outputRange:['0deg', '360deg']
            })}]}
        ]}

        onLayout={(event)=>{
             test(measureRef, props.node, props.afterUpdate);
             //props.node.pos = {x:event.nativeEvent.layout.x,y:event.nativeEvent.layout.y};
             //console.log(`layout x: ${event.nativeEvent.layout.x}`);

   }}
       >
     <Special node={props.node}/>
     <Symbol group= {props.node.symbol} diameter ={props.node.diameter} frozen ={props.node.frozen} />
     <Frozen node={props.node} rotAnim={rotAnim}/>
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
     // console.log(`Pulsing. gogogo: ${props.GOGOGO}`)
      if(props.GOGOGO > 0){

        //console.log("pulsing");
      fadeAnim.setValue(1);
      sizeAnim.setValue(1);
      
      Animated.parallel([
        Animated.timing(sizeAnim, {
          toValue: 1.35,
          duration: duration,
          useNativeDriver: true,
          isInteraction: false,
          easing: Easing.linear

        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
          isInteraction: false,
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
    const endHeight =  (screenHeight- boardHeight) / 2.5;
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
      justifyContent: "space-evenly",
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      paddingHorizontal: 5
        },
    tutorial: {
      flex: 1
        },

    horizontalLine:{
      position: 'absolute',
      width:'100%'
    },
    lock:{
      position: 'absolute',

      width: '60%',
      height: '60%',
      alignSelf: 'center',
      top: '20%', //TEMPORARY MAY ALIGN WEIRD ON DIFFERENT SCREEN SIZES
      opacity:1,

    }
});
/**     <Segment startNode={props.board.start} endPoint={startPoint}/>
        <Segment startNode={props.board.finish} endPoint={finishPoint} fixedColor={fixedColor}/>
         */
const nodeSize = styles.nodeSize;
  export {NodeView, Pulse, GridView, dynamicNodeSize, dynamicNodeSizeNoPosition};