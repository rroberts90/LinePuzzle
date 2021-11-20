import React, {useRef, useState } from "react";
import { Animated, PanResponder, StyleSheet, View} from "react-native";
import {dynamicNodeSizeNoPosition} from './Nodes';
import {  Segment } from "./Paths";
import * as MyMath from '../Utils';
import useSound from "../Sounds";
const Cursor = (props) => {
    const mostRecentPoint = useRef(null);
    const [endPoint, setEndPoint] = useState(null);

    const pan = useRef(new Animated.ValueXY()).current;
    const {play} = useSound();

    
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => {
          //pulseFlag.current = pulseFlag.current + 1;
          return true;
        },

        onMoveShouldSetPanResponder: () => true,
  
        onPanResponderGrant: (evt, gestureState) => {
          clearInterval(props.intervalId.current);
          const centeredEndPoint = MyMath.point(gestureState.x0, gestureState.y0);
          setEndPoint(centeredEndPoint);
          
          mostRecentPoint.current = centeredEndPoint;
          props.triggerPulser(current=> current+1);

          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value
          });
        },

        onPanResponderMove: (evt, gestureState) => {
       
          const point =  MyMath.point( gestureState.moveX,gestureState.moveY );
          setEndPoint(point);
         
          // check for intersections with other nodes
          const {newNode, prevPoint} = props.detectMatch(point);
          if(prevPoint){
            // rolled back to previous node 
            //mostRecentPoint.current = prevPoint;
          }
          else if(newNode){
            //play('connect');
            mostRecentPoint.current = point;
            
          }
 
          return Animated.event(
            [
              null,
              { dx: pan.x, dy: pan.y }
            ],
            { useNativeDriver: false }
          )(evt, gestureState);
        },
        onPanResponderRelease: (evt, gestureState) => {
          //console.log("RELEASED");
         
          const centeredEndPoint = mostRecentPoint.current;///MyMath.point(gestureState.x0, gestureState.y0); //MyMath.centerOnNode(MyMath.point(props.currX, props.currY), props.node.diameter );
          setEndPoint(null);

          pan.setValue({ x: 0, y: 0 });
          //reset();
        }
      })
    ).current;

    const segment =   <Segment startNode= {props.node} endPoint={endPoint}/>
    return (<>   
      <Animated.View
    style={[{
      transform: [{ translateX: pan.x }, { translateY: pan.y }],
      position: "absolute",
      top: props.currPoint.y,
      left: props.currPoint.x,
      margin: 0,
      zIndex: 11
    }, dynamicNodeSizeNoPosition(props.node.diameter,0), styles.cursor]}
    {...panResponder.panHandlers}
   >
    </Animated.View>
    {segment}

    </>

    );
  }

  const styles = StyleSheet.create({
    cursor: {
        backgroundColor: "rgba(0,0,0,.5)",
        borderColor: "rgba(255,255,255,.5)",
        opacity:0
      },
    }
  );
  export {Cursor};
