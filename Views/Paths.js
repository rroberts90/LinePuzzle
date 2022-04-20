import React, { useEffect, useRef, useState } from 'react'
import {StyleSheet, View, Animated,Easing, useWindowDimensions} from 'react-native'

import { distance, centerOnNode,rotateColors,convertToLayout, point } from '../Utils';

import GlobalStyles from '../GlobalStyles'

const defaultFinishColor = GlobalStyles.defaultBackground.backgroundColor;

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


const Segment = ({startNode,endPoint, fixedColor}) => {

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

const getFixedStyles = (startNode, endNode) => {
 const width = startNode.diameter/ 5;
 const rotatedColors = rotateColors(startNode.colors, startNode.rot);

  if(startNode.gridPos.row < endNode.gridPos.row){  // below
    const startPos1 = centerOnNode(startNode.pos,  startNode.diameter)
    const startPos = point(startPos1.x - width/2, startPos1.y)

    const length = Math.abs(endNode.pos.y - startNode.pos.y)
   
    return {type:1, fixedStyles:{
      backgroundColor: rotatedColors[2],
      top: startPos.y,
      left: startPos.x,
      width: width,
      height: length
    }}
  }

  else if(startNode.gridPos.row > endNode.gridPos.row){ // above
    const startPos1 = centerOnNode(endNode.pos,  endNode.diameter)
    const startPos = point(startPos1.x - width/2, startPos1.y)
 
    const length = Math.abs(endNode.pos.y - startNode.pos.y)
    
    return {type: 0,fixedStyles:{
      backgroundColor: rotatedColors[0],
      top: startPos.y,
      left: startPos.x,
      width: width,
      height: length
    }}
  }
  else if(startNode.gridPos.col > endNode.gridPos.col){ // going left
    const startPos1 = centerOnNode(endNode.pos,  endNode.diameter)
    const startPos = point(startPos1.x, startPos1.y - width/2)

    const length = Math.abs(endNode.pos.x - startNode.pos.x)
    
    return {type: 0, fixedStyles: {
      backgroundColor: rotatedColors[3],
      top: startPos.y,
      left: startPos.x,
      width: length,
      height: width
    }}
  }
  else if(startNode.gridPos.col < endNode.gridPos.col){ // going right
    const startPos1 = centerOnNode(startNode.pos,  startNode.diameter)
    const startPos = point(startPos1.x, startPos1.y - width/2)

    const length = Math.abs(endNode.pos.x - startNode.pos.x)
    
    return {type: 1, fixedStyles: {
      backgroundColor: rotatedColors[1],
      top: startPos.y,
      left: startPos.x,
      width: length,
      height: width
    }}
  }
}
const getTransformStyles = (start , end, arrowWidth, moveAnim )=> { 
  if(!moveAnim) {
    return [];
  }
  if(start.row < end.row){ //down
    return [{translateY: Animated.multiply(moveAnim,-1)},{translateY: -arrowWidth/4},{rotate: '225deg'}]
  }
  if(start.row > end.row){//up
    return [{translateY: moveAnim},{translateY: arrowWidth/4},{rotate: '45deg'}]
  }
  if(start.col > end.col) { //left
    return [{translateX: moveAnim},{translateX: arrowWidth/4},{rotate: '-45deg'}]
  }
  else{
    return [{translateX: Animated.multiply(moveAnim,-1)},{translateX: -arrowWidth/4},{rotate: '-225deg'}]
  }
}

const PathArrow1 = ({startNode, endNode, moveAnim, number}) => {

  const arrowWidth = startNode.diameter/5 / 1.5;

  return ( <Animated.View style={[arrowStyles(arrowWidth, arrowWidth, 'rgba(255,255,255,.5)' ), 
  styles.lightener,
  {transform: getTransformStyles(startNode.gridPos, endNode.gridPos, arrowWidth, moveAnim)}]} />);
}

const FixedSegment = ({seg, startNode, endNode, number}) => {
  
  const moveAnim = useRef(new Animated.Value(endNode.diameter/2)).current;

  useEffect(()=> {seg.moveAnim = moveAnim}, [] );

  const {type, fixedStyles} = getFixedStyles(startNode, endNode);

    const isHorizontal = startNode.gridPos.row === endNode.gridPos.row ;

    fixedStyles['position'] = 'absolute';
    fixedStyles['justifyContent'] = type === 1 ? 'flex-start' : 'flex-end';
    fixedStyles['alignItems'] = 'center';

 
    return (<View style={[
      fixedStyles, 
      {flexDirection: isHorizontal ? 'row': 'column'}
    ]}>
     <PathArrow1 startNode={startNode} endNode={endNode} moveAnim={moveAnim} number={number}/>
    </View>
                             

   );
}


   const recursiveArrows = (segments, ndx)=> {

    if(segments.current.length > 0 && segments.current[ndx]) {
      console.log('animating')

      const seg = segments.current[ndx];

      if(!seg.dist || seg.dist === 0) { // lazy 
        seg.dist = distance(seg.endNode.pos.x - seg.startNode.pos.x, seg.endNode.pos.y-seg.startNode.pos.y) - seg.endNode.diameter/2;
      }
      if(seg?.moveAnim) {
        console.log(`animating arrow: distance ${seg.dist}`);
        seg.moveAnim.setValue(seg.endNode.diameter/2)
        const nextNdx = (ndx + 1) % segments.current.length;

        setTimeout(()=> recursiveArrows(segments,nextNdx), 1750)

        animateArrowInFixedSegments(seg.moveAnim, seg.dist).start(onFinish=> {
          seg.moveAnim.setValue(seg.endNode.diameter/2)

          //recursiveArrows(segments, nextNdx);
        });
      } 
    }


   }
  const UserPath = ({segments, fades}) => {
    const [prevLength, setPrevLength] = useState(()=> segments.current.length);
    const [arrowAnimationRunning, toggleAAR] = useState(false);
    useEffect(()=> {
      console.log(segments.current.length)

      // if there are segments on the grid and animation is not running, start it up!
      if(segments.current.length >= 1 && !arrowAnimationRunning ) {
        console.log('starting animations')
        recursiveArrows(segments,0);
        toggleAAR(true)
      }
      if(segments.current.length === 0) { // if segments length drops to zero stop all animations
        toggleAAR(false)
      }
    
     },[segments.current.length]);

     useEffect(()=> {return function cleanup(){
       segments.current = {} // prevents infinite call to recursiveArrows()
     }},[])
    return (
      <View >
        {segments.current.map((seg,i) =>
            <FixedSegment seg={seg} startNode={seg.startNode} endNode={seg.endNode} key={i} number={i}/>
        )}
        {fades.map((seg,i) =>
            <Fade fade={true} onFade={()=> fades.pop()}  key={i}>
            <FixedSegment seg={seg} startNode={seg.startNode} endNode={seg.endNode} number={i} />
            </Fade>
        )}
      </View>
    );
  }

const arrowStyles = (width, height, color) => {
  return {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: height,
    borderTopWidth:2,
    borderLeftWidth: 2,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderColor: color,
    transform: [{rotate: '90deg'}],
    opacity: .8
  }
}


const animateArrowInFixedSegments = (triangleAnim, distance)=> {
   return  Animated.timing(triangleAnim, {
    toValue: -(distance),
    duration: 3000,
    easing: Easing.linear,
    isInteraction: false,
    useNativeDriver: true
  })
}
const animateArrow = (triangleAnim, distance ,delay) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(triangleAnim, {
      toValue: -(distance),
      duration: 3000,
      easing: Easing.linear,
      delay: delay,
      isInteraction: false,
      useNativeDriver: true
    }),
    Animated.timing(triangleAnim, {
      toValue: 10,
      duration: 1,
      easing: Easing.linear,
      isInteraction: false,
      useNativeDriver: true
    }),
    Animated.timing(triangleAnim, {
      toValue: 10,
      duration: 750,
      easing: Easing.linear,
      isInteraction: false,
      useNativeDriver: true
    })
  
  ]));
}

const Arrow2 = ({moveAnim, width, color}) => {
  return <Animated.View style={[arrowStyles(width, width, color),
      {
        transform: [{ translateY: moveAnim }, { rotate: '45deg' }] 
      }]}/>;
}


const BridgeSegment=  ({color, width, end}) => {

  const positionStyles = end === 'start' ? {bottom: '-20%'}  : {top: '-20%'}
  
  return <Animated.View  style={[{
    position: 'absolute',    
    left: 0,
    width: width,
    height:  '50%',
    backgroundColor: color,
  }, positionStyles]}
   />;
}

  const CapSegment = ({end,node, won, moveAnim}) => {

    let color;

    const fadeAnim = useRef(new Animated.Value(.65)).current;
    const triangleAnim1 = useRef(new Animated.Value(0)).current;

    const stagger = end === 'start' ? 1500 : 1500;
    if (end === 'finish') {
      color = won ? rotateColors(node.colors, node.rot)[0] : defaultFinishColor;
    } else {
      color = node.colors[2];
    }

    useEffect(() => {
      if ((won === true && end === 'finish')) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          isInteraction: false,
          easing: Easing.Quad
        }).start(finished=> setTimeout(()=>fadeAnim.setValue(.65),3000))
      }
      if(end==='start'){
        fadeAnim.setValue(1);
      }
    }, [won]);

    const triangleOffset = Math.floor(node.pos.y /2);

    useEffect(()=> {
     if(true){
        animateArrow(triangleAnim1, 100).start();
      }
    },[won]);
 
    const width = end === 'start' || won ? node.diameter / 5 : node.diameter / 5;
    const border = color===defaultFinishColor ? 2: 0;

    const left = node.pos.x + node.diameter/2 - (width/2) ;


    const triangleWidth = node.diameter / 5 - 6;
  
    const pathTriangleColor = 'rgba(245,255,245,.5)'
    return <Animated.View style={{
      backgroundColor: color,
      width: width,
      height: '100%',
      left: left,
      opacity: fadeAnim,
      borderLeftWidth: border,
      borderRightWidth: border,
      borderColor: 'rgba(0,0,0,.9)',
      transform: [{ translateY: end === 'start' ? -node.diameter/4 : node.diameter/4 },
      ],
      
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
    }}>
      {
        
          [<Arrow2 width= {triangleWidth} moveAnim={triangleAnim1} key={1}  color={end === 'start' ? pathTriangleColor : 'black'}/>,
          ]
          }
     <BridgeSegment color={color} width={width} end={end}/>
    </Animated.View>
  }

  const styles  = StyleSheet.create({
    dot: {
        width:1,
        height:1,
        zIndex:0,
        top:0,
        left: 0,
        position: 'absolute',


      },
    lightener : { 
      zIndex:10,
      position: 'relative',
      margin:.5
        }
  });


  export {Segment, UserPath, Fade, CapSegment, calculateColor}
