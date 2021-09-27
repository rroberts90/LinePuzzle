import React, { useEffect, useRef, forwardRef } from 'react'
import {StyleSheet, View, Animated,Easing, Image} from 'react-native'

import { distance, centerOnNode, point, convertToLayout } from './MathStuff'

const getSymbolSource = (group)=> {
    let icon = '';
    switch (group){
      case 1: 
        icon = require('./Icons/Viper1.png');
        break;
      case 2: 
        icon = require('./Icons/Glyph1.png');
        break;
      case 3: 
        icon = require('./Icons/Reeds1.png');
        break;
      case 4: 
        icon = require('./Icons/Horus1.png');
        break;
      
    }
    return icon;
  
  }
  
  const getArrowSource = (arrow) => { 
    let source = '';
    switch(arrow)  {
      case 0: 
        source = require('./Icons/ArrowUp1.png');
        break;
      case 1:
        source = require('./Icons/ArrowRight1.png');
        break;
      case 2:
          source = require('./Icons/ArrowDown1.png');
          break;  
      case 3:
          source = require('./Icons/ArrowLeft1.png');
          break;  
      case 4: // bidirectional horizontal
        source = require('./Icons/ArrowBiHorizontal1.png');
        break; 
      case 5: // bidirectional vertical
        source = require('./Icons/ArrowBiVertical1.png');
        break; 
    }
    return source;
  }
  
  const Symbol = ({group, diameter}) => {
    const sourceFile = getSymbolSource(group);
    return( sourceFile !== '' ? 
    <Image style={symbolStyles(diameter)} source={sourceFile} /> : null );
  }
  
  // absolutely positioned relative to parent (node)
  const positionArrow = (startNode, endNode, width, height) => {
    const diameter = startNode.diameter
    const middleX = startNode.diameter /2;
    const middleY = startNode.diameter /2;
    let pos;
    let type;

    if(startNode.gridPos.row === endNode.gridPos.row) {
        // use middleX
        if(startNode.gridPos.col < endNode.gridPos.col) {  // right arrow
            pos = point(middleX, -height/2);
            type = 1;
        }else { // left arrow
            pos = point(-middleX-(width),-height/2);
            type = 3;
        }
    } else {
        // use middleY
        if(startNode.gridPos.row > endNode.gridPos.row) {  // down arrow
            pos = point(-width/2, -middleY - height);
            type = 0;
        }else { // up arrow
            pos = point(-width/2, middleY);
            type = 2;
        }
    }
    return {pos, type};
  }
  const topOrLeft = (pos) => {
    if(pos.x ===0) {
        return {top:pos.y}
    }else{
        return {left:pos.x}
    }
}

  const getArrowDims = (startNode, endNode) => {
    // two cases vertical  and horizontal
    let width;
    let height;
    const thickness = startNode.diameter / 3;
    if( startNode.gridPos.row !== endNode.gridPos.row) { // vertical
        height =  Math.abs(Math.abs(startNode.pos.y - endNode.pos.y)- startNode.diameter) ;
        width = thickness;

    }else { // horizontal
        width= Math.abs(Math.abs(startNode.pos.x - endNode.pos.x )- startNode.diameter) ;
        height =  thickness;

    }

    width = width;
    height = height;
    return {width, height};
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

  const Arrow = ({node, linkedNode, rotAnim}) => {
    if(true) { //node.gridPos.row == 1 && node.gridPos.col == 1) {

    const {width, height} = getArrowDims(node, linkedNode);

    let {pos, type} = positionArrow(node, linkedNode,width,height);
    
    if(linkedNode.links.includes(node)) {
        if (node.gridPos.row === linkedNode.gridPos.row) { 
            type = 4;
            if(node.gridPos.col > linkedNode.gridPos.col) { // only 1 node needs to render bidirectional
              return null;
            }
        }else{
            type = 5;
            if(node.gridPos.row > linkedNode.gridPos.row) {// only 1 node needs to render bidirectional
              return null;
            }
        }
    }
    const source = getArrowSource(type);
   
  
    return (<Animated.View 
    style={[styles.arrowWrapper, {transform: [{rotate:rotAnim.interpolate({
        inputRange: [0,360],
        outputRange:['0deg', '-360deg']
    })}]}]}>
        <Image style={[styles.arrow,  StyleSheet.absoluteFill,arrowStyles(width,height), convertToLayout(pos)]} source={source} /> 
        </Animated.View>);
}
else{
    return null;
}
  }

  const Arrows = ({grid}) => {
    const flat = grid.reduce((flat, row) => [...flat, ...row]);
    
    const arrows = flat.reduce((arrowList,node)=> 
    {
        const arrowNeighbors = node.neighbors.filter(neighbor=> 
            shouldAddArrow(node, neighbor));
        
        return [...arrowList, ...arrowNeighbors.map(neighbor=> {
            return {node: node, neighbor: neighbor }
        })];
    });
    
    return (<View style={{position:'absolute'}}> 
        {
            arrows.map((arrow, i)=> <Arrow node={arrow.node} linkedNode= {arrow.neighbor} key={i} />) 
        }
      </View>);
  }
//.map((neighbor,i)=> <Arrow node={props.node} linkedNode= {neighbor} key={i} length={arrowNodes.length} />)}
  const arrowStyles = (width, height) => {
     return { 
         width: width,
         height: height,
         opacity: .5
    };
  }

  const Special = ({node}) => {
      if(node.special === 'freezer') {
          const source = require('./Icons/freezePattern4.jpeg');
          return <Image style={[styles.special, {borderRadius: node.diameter/2}]} source={source}/>
      }else if(node.special === 'rotateCC') {
        const source = require('./Icons/rotateCC1.png');
        return <Image style={[styles.special, {borderRadius: node.diameter/2}]} source={source}/>;

      }
      return null;
  }
  const symbolStyles = (diameter) => {
    const percentageSize = .85;
    return {height:diameter * percentageSize, 
            width: diameter * percentageSize,
            padding:1};
  }
   
  const styles = StyleSheet.create({
    symbol: {
        height: 45,
        width: 45,
        padding:1
      }, 
      arrow: {
          opacity: 0,
          height:0,
          width:0,
          resizeMode:'stretch',
          borderColor: 'black',
          borderWidth:0,
      },
      arrowWrapper: {
          position:'absolute'
      }, 
      special: {
          position: 'absolute',
          height:'100%',
          width:'100%',
          opacity:.5,
      }

  });
  
  export {Arrow, Symbol, Special,Arrows};