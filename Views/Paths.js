import React, { useEffect, useRef, forwardRef } from 'react'
import {StyleSheet, View, Animated,Easing} from 'react-native'

import { distance, centerOnNode,rotateColors,convertToLayout, point } from '../Utils';


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
    const endPos  = endPoint; 
    
    const scaleX = distance(endPos.x - startPos.x, endPos.y - startPos.y);
    const scaleY = startNode.diameter / 5; // line width

    const opp = endPoint.y - startPos.y;
    const xDir = Math.sign(endPoint.x - startPos.x);
    const angle = xDir > 0 ? toDegrees(Math.asin(opp/ scaleX)) : 180 - toDegrees(Math.asin(opp/ scaleX)); // scaleX is also hypotenuse

    const rotate = `${angle}deg`;
    
    return (<View style={[styles.dot, 
                         convertToLayout(startPos),
                        { backgroundColor: color,
                         transform: [ 
                          { rotate: rotate },
                          { translateX: scaleX/2 },
                             { scaleX: scaleX }, 
                             { scaleY: scaleY },

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

const calcOpacity = (end) => {
  if(end ==='start') {
    return 1;
  }
  else {
    return .5;
  }
}

const triangleStyles = (width, height, color) => {
  return {
    borderTopWidth: 0,
    borderRightWidth: width/2.0,
    borderBottomWidth: width/1.5,
    borderLeftWidth: width/2.0,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: color,
    borderLeftColor: 'transparent',
  }
}
  const CapSegment = ({end,node, fixedHeight, won}) => {

    let color;
    const defaultFinishColor = 'rgba(248,248,255,1)';
    if(end === 'finish') {
     color = won ? rotateColors(node.colors, node.rot)[0] : defaultFinishColor;
    }else{
      color = node.colors[2];
    }
    const fadeAnim = useRef(new Animated.Value(.5)).current;

    useEffect(() => {
      if ((won === true && end === 'finish')) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.Quad
        }).start(finished=> setTimeout(()=>fadeAnim.setValue(.5),1500))
      }
      if(end==='start'){
        fadeAnim.setValue(1);
      }
    }, [won]);
 
    const width = node.diameter / 6;
    const border = end !== 'start' && color==defaultFinishColor ? 3: 0;
  //  const sidePadding = ( node.diameter - width) /2;
    const height = fixedHeight || (end ==='start' ? 100: 100);
    const left = node.pos.x + node.diameter/2 - width;
    const triangles = end !== 'start' && color===defaultFinishColor ? [1,1,1,1,1].map((_,i)=><View style={triangleStyles(node.diameter/6-6, fixedHeight/10, 'black')} key={i}/>): [];
    return <Animated.View style={{
      alignSelf: 'left',
      backgroundColor: color,
      width: width,
      height: height,
      left: left,
      opacity: fadeAnim,
      borderLeftWidth: border,
      borderRightWidth: border, 
      borderColor: 'black',
      transform: [{translateY: end ==='start' ? -node.diameter/3 : node.diameter/3},
                   {scaleY: end === 'start' ? 1 : 1.8}],
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center'

    }}>
      {triangles}
      </Animated.View>
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