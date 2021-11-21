import React, { useEffect,useState, useRef, forwardRef } from 'react'
import {StyleSheet, View, Animated,Easing, Image, Text, useWindowDimensions} from 'react-native'

import { distance, centerOnNode, point, convertToLayout } from '../Utils'
import {getItem} from '../Storage'

const getSymbolSource = (group)=> {
    let icon = '';
    switch (group){
      case 1: 
        icon = require('../Icons/shape1.png');
        break;
      case 2: 
        icon = require('../Icons/shape2.png');
        break;
      case 3: 
        icon = require('../Icons/shape4.png');
        break;
      case 4: 
        icon = require('../Icons/shape3.png');
        break;
      
    }
    return icon;
  
  }

  const getImpossibleSource = (group)=> {
    let icon = '';
    switch (group){
      case 1: 
        icon = require('../Icons/impossible1.png');
        break;
      case 2: 
        icon = require('../Icons/impossible6.png');
        break;
      case 3: 
        icon = require('../Icons/impossible3.png');
        break;
      case 4: 
        icon = require('../Icons/impossible7.png');
        break;
      
    }
    return icon;
  
  }

  const getAnimalSource = (group)=> {
    let icon = '';
    switch (group){
      case 1: 
        icon = require('../Icons/seaAnimal1.png');
        break;
      case 2: 
        icon = require('../Icons/seaAnimal2.png');
        break;
      case 3: 
        icon = require('../Icons/seaAnimal3.png');
        break;
      case 4: 
        icon = require('../Icons/seaAnimal4.png');
        break;
      
    }
    return icon;
  
  }
  
  const getGlyphSource = (group)=> {
    let icon = '';
    switch (group){
      case 1: 
        icon = require('../Icons/glyph1.png');
        break;
      case 2: 
        icon = require('../Icons/glyph2.png');
        break;
      case 3: 
        icon = require('../Icons/glyph3.png');
        break;
      case 4: 
        icon = require('../Icons/glyph4.png');
        break;
      
    }
    return icon;
  
  }

  const getArrowSource = (arrow) => { 
    let source = '';
    switch(arrow)  {
      case 0: 
        source = require('../Icons/ArrowUp1.png');
        break;
      case 1:
        source = require('../Icons/ArrowRight1.png');
        break;
      case 2:
          source = require('../Icons/ArrowDown1.png');
          break;  
      case 3:
          source = require('../Icons/ArrowLeft1.png');
          break;  
      case 4: // bidirectional horizontal
        source = require('../Icons/ArrowBiHorizontal1.png');
        break; 
      case 5: // bidirectional vertical
        source = require('../Icons/ArrowBiVertical1.png');
        break; 
    }
    return source;
  }
  
  const defaultGroup = 'shapes';
  
  const Symbol = ({group, diameter, frozen, freezer}) => {
    const [sourceFile, setSource] = useState(()=>getSymbolSource(group)); //default
    
    useEffect(()=>{
      getItem('display').then(display => {
        if (display === 'glyphs') {
          setSource(getGlyphSource(group));
        }
        else if (display === 'impossible') {
          setSource(getImpossibleSource(group));
        }
        else if (display === 'seaAnimal') {
          setSource(getAnimalSource(group));
        } else {
          setSource(getSymbolSource(group));
        }
      }).catch(e => console.log(e));
    }, [sourceFile, group]);

    const opacity = frozen > 0 ? .3 : 1;

    return( sourceFile !== '' ? 
    <Image style={[symbolStyles(diameter), {opacity: opacity, alignSelf:'center', tintColor: freezer ? 'rgb(220,220,220)' : null}]} source={sourceFile} /> : null );
  }
  
  const ArrowPadding = 2;
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
            pos = point(middleX+ArrowPadding/2, -height/2);
            type = 1;
        }else { // left arrow
            pos = point(-middleX-(width) - ArrowPadding/2,-height/2);
            type = 3;
        }
    } else {
        // use middleY
        if(startNode.gridPos.row > endNode.gridPos.row) {  // down arrow
            pos = point(-width/2, -middleY - height - ArrowPadding/2);
            type = 0;
        }else { // up arrow
            pos = point(-width/2, middleY +ArrowPadding/2);
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
        height =  Math.abs(Math.abs(startNode.pos.y - endNode.pos.y)- startNode.diameter) -ArrowPadding;
        width = thickness;

    }else { // horizontal
        width= Math.abs(Math.abs(startNode.pos.x - endNode.pos.x )- startNode.diameter) -ArrowPadding;
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
    const [booster, setBooster] = useState(null);
    const moveAnim = useRef(new Animated.ValueXY(0,0)).current;
    const sizeAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const windowWidth = useWindowDimensions().width;

    useEffect(()=>{
      if(node.special === 'booster'){
        setBooster(true);
      }
    },[]);
    useEffect(()=>{
      if(!node.special  && booster){
        const speed = 20;
        const time = (node.pos.y / speed) * 100;
        Animated.parallel([
          Animated.timing(fadeAnim,{
          duration: 500,
          toValue: 0,
          isInteraction: false,
          useNativeDriver: true,
          Easing: Easing.quad
        }),
         Animated.timing(sizeAnim, {
          duration: 500,
          toValue: 2,
          isInteraction: false,
          useNativeDriver: true,
          Easing: Easing.quad
         })
      
      ]).start(finished=> setBooster(false));
      }
      else if(!booster && node.special === 'booster'){
        setBooster(true);
      }
    }, [node.special]);

      if(node.special === 'freezer') {
          const source = require('../Icons/freezePattern5.png');
          return null; //<Image style={[styles.special, styles.freezePattern, {borderRadius: node.diameter/2}]} source={source}/>
      }else if(node.special === 'rotateCC') {
        const source = require('../Icons/rotateCC3.png');
        return <Image style={[styles.special, {height:'100%',width:'100%', opacity: 1}]} source={source}/>;

      }else if(booster) { 
        return (<Animated.View style={[styles.booster,{transform:[{scale:sizeAnim}], opacity: fadeAnim}]}>
            <Text style={styles.boosterPlus}>+</Text>
            <Text style={styles.boosterText}>5</Text>
        
        </Animated.View>);
      }
      return null;
  }

  const symbolStyles = (diameter) => {
    const percentageSize = .9;
    return {height:diameter * percentageSize, 
            width: diameter * percentageSize,
            padding:1};
  }
   
  const styles = StyleSheet.create({
    symbol: {
        height: 45,
        width: 45,
      }, 
      arrow: {
          opacity: 0,
          height:10,
          width:10,
          resizeMode:'stretch',
          borderColor: 'black',
          borderWidth:0,
          zIndex:0
      },
      arrowWrapper: {
          position:'absolute'
      }, 
      special: {
          position: 'absolute',
          height:'100%',
          width:'100%',
          opacity:.5
      },
      freezePattern: {
        opacity: .25
      },
      booster: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        left: -2
      },
      boosterPlus: 
      {
        fontSize: 15,
        alignSelf: 'center',
        marginBottom: 1

      },
      boosterText: 
      {
        fontSize: 25,
        alignSelf: 'center'

      }

  });
  
  export {Arrow, Symbol, Special,Arrows, getGlyphSource, getSymbolSource, getImpossibleSource, getAnimalSource};