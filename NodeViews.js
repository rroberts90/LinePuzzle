import { Animated, View, StyleSheet, Easing, Text} from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { convertToLayout, point } from "./MathStuff";
import { Segment, CapSegment } from "./PathViews";
import { calculateColor } from "./GameLogic";
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
        marginTop:  diameter /6 ,
        width: diameter,
        height: diameter,
        borderRadius: diameter / 2,
        borderWidth: diameter / 6,
        backgroundColor: "lightgrey",
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
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

    const testTouchHandlers = {onStartShouldSetResponder: ()=> true, onResponderGrant: ()=> {
      props.node.rotate();
    }};
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
        <Text style={styles.symbol}> {props.node.symbol} </Text>
      </Animated.View>
    );
  } 
  
  const Pulse = (props) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const sizeAnim = useRef(new Animated.Value(1)).current;
    
   
    const colorStyles = borderStyles(props.colors);
    const duration = 1000;
    useEffect(() => {

      fadeAnim.setValue(1);
      sizeAnim.setValue(1);
      
  
      Animated.parallel([
        Animated.timing(sizeAnim, {
          toValue: 1.5,
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
    useEffect(()=> {
      console.log("COMING IN HOT");
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 2500,
        useNativeDriver: true,
        easing: Easing.ease
      }).start();
      }, []);
  
    const flat = props.board.grid.reduce((flat, row) => [...flat, ...row]);
  
    const nodes = flat.map((node,ndx)=>  
     <NodeView node={node}
    key={ndx}
    afterUpdate = {props.board.getCurrentNode() === node ? props.afterUpdate : null }
    />
    );
  
    const bottomRow = props.board.grid[props.board.grid.length - 1];
    const topRow = props.board.grid[0];

    const startCaps = bottomRow.map((node, i) =>
      <CapSegment color={node.colors[2]}
        end={'start'} 
        visible={props.board.start === node} 
        nodeDiameter={node.diameter} 
        key={i} />);
    
    const finishCaps = topRow.map((node, i) =>
      <CapSegment color={props.wonColor || calculateColor(node, point(node.pos.x, node.pos.y-100))}
        end={'finish'} 
        visible={props.board.finish === node} 
        nodeDiameter={node.diameter} 
        key={i} />);
    return (
    <Animated.View style= {[styles.board, {
      transform: [{translateY: translateYAnim}]
    }]}  >
        {finishCaps}
        {nodes}
        {startCaps}
   
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
    symbol: {
      fontSize: 30
    },
    board: {
      flex: 1,
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      paddingHorizontal: 5
      
    }
});
/**     <Segment startNode={props.board.start} endPoint={startPoint}/>
        <Segment startNode={props.board.finish} endPoint={finishPoint} fixedColor={fixedColor}/>
         */
const nodeSize = styles.nodeSize;
  export {NodeView, Pulse, GridView, dynamicNodeSize, dynamicNodeSizeNoPosition};