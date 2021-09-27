import React, { useEffect, useRef, forwardRef } from 'react'
import {StyleSheet, View, Animated,Easing} from 'react-native'

import { distance, centerOnNode,rotateColors } from './MathStuff';
import {  } from './BoardLogic';

import { convertToLayout, point } from "./MathStuff";

const toDegrees = (angle) =>{
    return angle * (180 / Math.PI);
  }

const calculateColor = (node, endPoint) => {
   
    const center = centerOnNode(node.pos, node.diameter);
   
    const hypo  = distance(endPoint.x - center.x, endPoint.y - center.y);
    const adj = distance(endPoint.x - center.x, 0);
    const angle = toDegrees(Math.acos(adj/ hypo));
 
    const xDir = Math.sign(endPoint.x - center.x);
    const yDir = Math.sign(endPoint.y - center.y)
   
    let color;
    const computedColors = rotateColors(node.colors, node.rot);
    
    
    if(xDir == 1 &&  angle < 45) {
      color = computedColors[1];
    }
    else if(xDir == -1 && angle < 45) {
      color = computedColors[3];
    }
    else if( yDir == -1 && angle >= 45) {
      color = computedColors[0];
    }
    else if(yDir == 1 && angle >= 45){
      color = computedColors[2];
    }
    else {
      color = "grey";
    }
  
    return color;
  }

const Fade = (props) => {
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  useEffect(()=>{
    if(props.fade === true){
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.quad
    }).start(finished=>{
      props.onFade();
    });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.fadeOut]);
  return <Animated.View style= {{opacity:fadeAnim}}>
     {props.children}
    </Animated.View>
}

const Segment = ({startNode, endPoint, fixedColor}) => {

  if (startNode === null  || endPoint === null){
      return null;
    }

    const color = fixedColor || calculateColor(startNode, endPoint );
    
    const startPos = centerOnNode(startNode.pos,  startNode.diameter);
    const endPos  = endPoint; //centerEndPoint ? centerOnNode(endPoint, startNode.diameter): endPoint;
    
    const scaleX = distance(endPos.x - startPos.x, endPos.y - startPos.y);
    const scaleY = startNode.diameter / 5; // line width

    const opp = endPoint.y - startPos.y;
    const xDir = Math.sign(endPoint.x - startPos.x);
    const angle = xDir > 0 ? toDegrees(Math.asin(opp/ scaleX)) : 180 - toDegrees(Math.asin(opp/ scaleX)); // scaleX is also hypotenuse

    const rotate = `${angle}deg`;
    
 // toPrint.forEach(obj => console.log(`${Object.entries(obj)[0]}`));
  //console.log(`\n`);
 //const shiftedStartPos = point(startPos.x + scaleX/2, startPos.y + scaleY/2); //scale centers around middle of element.
    return (<View style={[styles.dot, 
                         convertToLayout(startPos),
                        { backgroundColor: color,
                         transform: [ 
                          {rotate: rotate},
                          {translateX: scaleX/2},
                             { scaleX: scaleX}, 
                             { scaleY: scaleY},

                             ] }]}/>

   );
}
  
  
  const UserPath = ({segments, fades}) => {

 //    console.log(segments[0].props);
    return (
      <View >
        {segments.map((seg,i) =>
            <Segment startNode={seg.startNode} endPoint={seg.endPoint} key={i}/>
        )}
        {fades.map((seg,i) =>
            <Fade fade={true} onFade={()=> fades.pop()}  key={i}>
            <Segment startNode={seg.startNode} endPoint={seg.endPoint}/>
            </Fade>
        )}
      </View>
    );
  }

  const AnimatedSegment = ({startNode, panX, panY})=>{
    if(startNode === null) {
      console.log("no segment yet");
      return null;
    }
    const endPos = point(panX._value, panY._value);
    const color = calculateColor(startNode, endPos );
    
    const startPos = centerOnNode(startNode.pos,  startNode.diameter);
    
    const distance = distance(endPos.x - startPos.x, endPos.y - startPos.y);
    const magicNumber = panX._value !== 0 ? d / panX._value : 0; 
    const scaleX = Animated.multiply(panX, magicNumber);
    const scaleY = Animated.divide(startNode.diameter / 5); // line width

    const opp = endPoint.y - startPos.y;
    const xDir = Math.sign(endPoint.x - startPos.x);
    const angle = xDir > 0 ? toDegrees(Math.asin(opp/ scaleX)) : 180 - toDegrees(Math.asin(opp/ scaleX)); // scaleX is also hypotenuse

    const rotate = `${angle}deg`;
    

 // toPrint.forEach(obj => console.log(`${Object.entries(obj)[0]}`));
  //console.log(`\n`);
 //const shiftedStartPos = point(startPos.x + scaleX/2, startPos.y + scaleY/2); //scale centers around middle of element.
    return (<Animated.View style={[styles.dot, 
                         convertToLayout(startPos),
                        { backgroundColor: color,
                         transform: [ 
                          {translateX: Animated.divide(scaleX,2)},
                             { scaleX: scaleX}, 
                             { scaleY: scaleY},

                             ] }]}/>

   );
  }

  const CapSegment = ({color, end, visible, nodeDiameter, fixedHeight}) => {
    
    const opacity = visible ? 1 : 0;
    
    const width = nodeDiameter / 6;
    
    const sidePadding = ( nodeDiameter - width) /2;
    const height = fixedHeight || (end ==='start' ? '15%' : '15%');
    return <View style={{
      position: 'relative',
      backgroundColor: color,
      height: height,
      width: width,
      marginHorizontal: sidePadding + nodeDiameter/12,
      opacity: opacity,
      transform: [{translateY: end ==='start' ? -nodeDiameter/3 : nodeDiameter/3},
                   {scaleY: end === 'start' ? 1 : 1.5}]

    }}/>
  }
  //      transform: [{translateY: end ==='start' ? -nodeDiameter/5 : nodeDiameter/5}, {}]

  const styles  = StyleSheet.create({
    dot: {
        width:1,
        height:1,
        zIndex:0,
        top:0,
        left: 0,
        position: 'absolute',

      }
  });
  export {Segment, UserPath, Fade, CapSegment, calculateColor}