import { Animated, View, StyleSheet, Easing, Text} from "react-native";
import React, { useEffect, useRef, useState } from "react";

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
        marginTop:  diameter /6 + 10,
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
const rotToTransform = (rot) =>{
    const degrees = rot * -90; // negative because colors are rotated counter clockwise by default
    return {transform: [{rotate:`${degrees}deg`}]};
  }

const convertToLayout = (pos) => {
    return { left: pos.x, top: pos.y };
  }
  
const NodeView = (props) => {

    const rotAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(()=>{
        Animated.timing(rotAnim, {
            toValue: props.node.rot * -90,
            duration: 1000,
            useNativeDriver: false,
    
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

    {...testTouchHandlers}
       >
        <Text style={styles.symbol}> {props.node.symbol} </Text>
      </Animated.View>
    );
  } 
  
  const Pulse = (props) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const sizeAnim = useRef(new Animated.Value(props.diameter)).current;
    const moverAnim = useRef(new Animated.Value(0)).current;
   
    const colorStyles = borderStyles(props.colors);
    const duration = 1000;
    useEffect(() => {

      fadeAnim.setValue(1);
      sizeAnim.setValue(props.diameter);
      moverAnim.setValue(0);
  
      Animated.parallel([
        Animated.timing(sizeAnim, {
          toValue: props.diameter * 1.5,
          duration: duration,
          useNativeDriver: false,
          easing: Easing.linear

        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: false,
          easing: Easing.quad
        }),
        Animated.timing(moverAnim, {
          toValue: props.diameter * -.25,
          duration: duration,
          useNativeDriver: false,
          easing: Easing.linear

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
          width: sizeAnim, //Bind animated values
          height: sizeAnim,
          borderRadius: sizeAnim,
          transform: [{ translateX: moverAnim }, { translateY: moverAnim }]
        }]}
  
    />
  
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

      backgroundColor: "grey",
      zIndex: 0
    },
    symbol: {
      fontSize: 30
    }
});
const nodeSize = styles.nodeSize;
  export {NodeView, Pulse, dynamicNodeSize, dynamicNodeSizeNoPosition};