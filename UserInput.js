import React, {useRef } from "react";
import { Animated, PanResponder, StyleSheet} from "react-native";
import {dynamicNodeSizeNoPosition} from './NodeCode';
import { centerOnNode } from "./GameLogic";
const Cursor = (props) => {

    const pan = useRef(new Animated.ValueXY()).current;
    
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => {
          //pulseFlag.current = pulseFlag.current + 1;
          return true;
        },
        onMoveShouldSetPanResponder: () => true,
  
        onPanResponderGrant: (evt, gestureState) => {
          console.log("granting");
          props.setEndPoint( centerOnNode(props.node.pos, props.node.diameter));
  
          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value
          });
        },
        onPanResponderMove: (evt, gestureState) => {
          props.setEndPoint({ x: gestureState.moveX, y: gestureState.moveY });
  
          return Animated.event(
            [
              null,
              { dx: pan.x, dy: pan.y }
            ],
            { useNativeDriver: false }
          )(evt, gestureState);
        },
        onPanResponderRelease: (evt, gestureState) => {
          console.log("RELEASED");
         
          props.setEndPoint(centerOnNode(props.node.pos, props.node.diameter ));
         // setEndPoint(currentNode.pos);
          pan.setValue({ x: 0, y: 0 });
  
        }
      })
    ).current;
  
    return ( <Animated.View
    style={[{
      transform: [{ translateX: pan.x }, { translateY: pan.y }],
      position: "absolute",
      top: props.currY,
      left: props.currX,
      margin: 0
    }, dynamicNodeSizeNoPosition(props.node.diameter,0), styles.cursor]}
    {...panResponder.panHandlers}
   
  
   >
    </Animated.View>
    );
  }

  const styles = StyleSheet.create({
    cursor: {
        backgroundColor: "rgba(0,0,0,.5)",
        borderColor: "rgba(255,255,255,.5)"
      },
    }
  );
  export {Cursor};
