import React, { useEffect,useState, useRef, forwardRef } from 'react'
import {StyleSheet, View, Animated,Easing, Image, Text, useWindowDimensions} from 'react-native'

import {  point, convertToLayout } from '../Utils'
import {getItem} from '../Storage'
 
const getSymbolSource = (group)=> {
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

  const getImpossibleSource = (group)=> {
    let icon = '';
    switch (group){
      case 1: 
        icon = require('../Icons/impossible1.png');
        break;
      case 2: 
        icon = require('../Icons/impossible2.png');
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
        icon = require('../Icons/animal1.png');
        break;
      case 2: 
        icon = require('../Icons/animal2.png');
        break;
      case 3: 
        icon = require('../Icons/animal3.png');
        break;
      case 4: 
        icon = require('../Icons/animal4.png');
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
  const getFlowerSource = (group)=> {
    let icon = '';
    switch (group){
      case 1: 
        icon = require('../Icons/flowers1.png');
        break;
      case 2: 
        icon = require('../Icons/flowers2.png');
        break;
      case 3: 
        icon = require('../Icons/flowers3.png');
        break;
      case 4: 
        icon = require('../Icons/flowers4.png');
        break;
      
    }
    return icon;
  
  }
  const getDogSource = (group)=> {
    let icon = '';
    switch (group){
      case 1: 
        icon = require('../Icons/dogs1.png');
        break;
      case 2: 
        icon = require('../Icons/dogs2.png');
        break;
      case 3: 
        icon = require('../Icons/dogs3.png');
        break;
      case 4: 
        icon = require('../Icons/dogs5.png');
        break;
      
    }
    return icon;
  
  }
  const getDog2Source = (group)=> {
    let icon = '';
    switch (group){
      case 1: 
        icon = require('../Icons/dogs4.png');
        break;
      case 2: 
        icon = require('../Icons/dogs6.png');
        break;
      case 3: 
        icon = require('../Icons/dogs7.png');
        break;
      case 4: 
        icon = require('../Icons/dogs8.png');
        break;
      
    }
    return icon;
  
  }
  const getScienceSource = (group)=> {
    let icon = '';
    switch (group){
      case 1: 
        icon = require('../Icons/science5.png');
        break;
      case 2: 
        icon = require('../Icons/science2.png');
        break;
      case 3: 
        icon = require('../Icons/science3.png');
        break;
      case 4: 
        icon = require('../Icons/science4.png');
        break;
      
    }
    return icon;
  
  }

  const getFoodSource = (group)=> {
    let icon = '';
    switch (group){
      case 1: 
        icon = require('../Icons/food1.png');
        break;
      case 2: 
        icon = require('../Icons/food2.png');
        break;
      case 3: 
        icon = require('../Icons/food3.png');
        break;
      case 4: 
        icon = require('../Icons/food5.png');
        break;
      
    }
    return icon;
  
  }

  const getDesertSource = (group)=> {
    let icon = '';
    switch (group){
      case 1: 
        icon = require('../Icons/desert1.png');
        break;
      case 2: 
        icon = require('../Icons/desert2.png');
        break;
      case 3: 
        icon = require('../Icons/desert3.png');
        break;
      case 4: 
        icon = require('../Icons/desert4.png');
        break;
      
    }
    return icon;
  
  }
  const getFruitSource = (group)=> {
    let icon = '';
    switch (group){
      case 1: 
        icon = require('../Icons/fruit1.png');
        break;
      case 2: 
        icon = require('../Icons/fruit2.png');
        break;
      case 3: 
        icon = require('../Icons/fruit5.png');
        break;
      case 4: 
        icon = require('../Icons/fruit4.png');
        break;
      
    }
    return icon;
  
  }
  const getCardSource = (group)=> {
    let icon = '';
    switch (group){
      case 1: 
        icon = require('../Icons/card1.png');
        break;
      case 2: 
        icon = require('../Icons/card2.png');
        break;
      case 3: 
        icon = require('../Icons/card3.png');
        break;
      case 4: 
        icon = require('../Icons/card4.png');
        break;
      
    }
    return icon;
  
  }


  const getArrowSource = (arrow) => { 
    let source = '';
    switch(arrow)  {
      case 0: 
        source = require('../Icons/arrowUp7.png');
        break;
      case 1:
        source = require('../Icons/arrowRight7.png');
        break;
      case 2:
          source = require('../Icons/arrowDown7.png');
          break;  
      case 3:
          source = require('../Icons/arrowLeft7.png');
          break;  
      case 4: // bidirectional horizontal
        source = require('../Icons/arrowBiHorizontal4.png');
        break; 
      case 5: // bidirectional vertical
        source = require('../Icons/arrowBiVertical4.png');
        break; 
    }
    return source;
  }
  
  const defaultGroup = 'shapes';
  
  const sourceDict = {
    impossible: getImpossibleSource,
    learner: getImpossibleSource,
    glyph: getGlyphSource,
    animal2: getAnimalSource,
    animal1: getSymbolSource,
    pets1: getDogSource,
    pets2: getDog2Source,
    flower: getFlowerSource,
    food: getFoodSource,
    science: getScienceSource,
    desert: getDesertSource,
    fruit: getFruitSource,
    card: getCardSource

  };

  const Symbol = ({group, diameter, frozen, freezer, theme}) => {
    const [sourceFile, setSource] = useState(()=>getSymbolSource(group)); //default
    
    useEffect(()=>{
      if (!theme) {
        getItem('display').then(display => {
          setSource(sourceDict[display](group))
        }).catch(e => console.log(e));
      }
      else{
        setSource(sourceDict[theme](group))
      }

    }, [sourceFile, group]);

    const opacity = frozen > 0 ? .3 : 1;

    return( sourceFile !== '' ? 
    <Image style={[symbolStyles(diameter), {opacity: opacity, alignSelf:'center', tintColor: freezer ? 'rgb(220,220,220)' : null}]} source={sourceFile} /> : null );
  }
  
  const ArrowPadding = 1;
 
  // absolutely positioned relative to parent (node)
  const positionArrow2 = (startNode, endNode, width, height) => {
    const radius = startNode.diameter /2;
    const diameter = startNode.diameter;
    let pos;
    let type;

    if(startNode.gridPos.row === endNode.gridPos.row) {

      if(startNode.gridPos.col < endNode.gridPos.col) {  // right arrow
            pos = point(diameter+ArrowPadding/2, radius - height/2);
            type = 1;
        }else { // left arrow
            pos = point(-width - ArrowPadding/2 , radius-height/2);
            type = 3;
        }
    } else {
        if(startNode.gridPos.row > endNode.gridPos.row) {  // down arrow
            pos = point(radius-width/2, -height - (ArrowPadding/2) );
            type = 0;
        }else { // up arrow
            pos = point(radius-width/2, diameter + ArrowPadding/2  );
            type = 2;
        }
    }
    return {pos, type};
  }

  const getArrowDims = (startNode, endNode, length) => {
    // two cases vertical  and horizontal
    let width;
    let height;
    let thickness = startNode.diameter / 5;

    startNode.neighbors.forEach(neighbor=> {
      if(startNode.gridPos.row === neighbor.gridPos.row) {
        width = Math.abs(Math.abs(startNode.pos.x - neighbor.pos.x )- startNode.diameter) -ArrowPadding;
        if (width > startNode.diameter * .25) {
          width = startNode.diameter * .25;
        }
      }else {
        height =  Math.abs(Math.abs(startNode.pos.y - neighbor.pos.y)- startNode.diameter) -ArrowPadding;
        if (height > startNode.diameter * .25) {
          height = startNode.diameter * .25;
        }
      }
    })

    //width = width < height ? width : height;
    //height = width;    

    if(startNode.gridPos.row === endNode.gridPos.row) {
      height = thickness;
      width = length;
    }
    else{
      width = thickness;
      height = length;
    }
    return {width, height};
  }

const shouldAddArrow = (node, neighbor) => {
  if(node.special === 'freezer') { // don't show any freezer arrows bc they don't do anything
      return false;
  }
  if (node.links.includes(neighbor)) {
    

   if (!node.symbol) {     // if link exists and node has no symbol always draw link. 

      return true;
    }
    if (node.symbol !== neighbor.symbol) { //  symbols already tells user nodes are linked.
      return true;
    } else {
      return false;
    }

  }
  else {
    return false;
  }
}

  const FixedArrow = ({node, linkedNode, length}) => {
   let {width, height} = getArrowDims(node, linkedNode, length);
    
   let {pos, type} = positionArrow2(node, linkedNode,width,height);
    pos = point(pos.x + node.pos.x, pos.y + node.pos.y);
   
  const source = getArrowSource(type);


    return <Image style={[styles.arrow,  
      StyleSheet.absoluteFill,
      arrowStyles(width,height), 
      convertToLayout(pos)]} 
      source={source} /> ;

  }

  const Arrows = ({grid}) => {
          const flat = grid.reduce((flat, row) => [...flat, ...row]);

      const length = Math.min(grid[1][0].pos.y - grid[0][0].pos.y - grid[0][0].diameter,grid[0][1].pos.x - grid[0][0].pos.x - grid[0][0].diameter   );
      const arrows = flat.reduce((arrowList, node) => {
        const arrowNeighbors = node.neighbors.filter(neighbor =>
          shouldAddArrow(node, neighbor));
        return [...arrowList, ...arrowNeighbors.map(neighbor => {
          return { node: node, neighbor: neighbor }
        })];
      }, []);


    return (<View style={{position:'absolute', height:'100%', width: '100%'}}> 


                {
          arrows.map((arrow, i)=> <FixedArrow node={arrow.node} linkedNode= {arrow.neighbor} key={i} length={length}/>) 
        }
      </View>);
  }

  const arrowStyles = (width, height) => {
     return { 
         width: width,
         height: height,

         opacity: .7,
    };
  }

  const Special = ({node, gameType}) => {
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
          return null; 
      }else if(node.special === 'rotateCC') {
        const source = require('../Icons/rotateCC4.png');
        return <Image style={[styles.special, {height:'100%',width:'100%', opacity: 1}]} source={source}/>;

      }else if(node.special === 'verticalFlip'){
        const source = require('../Icons/arrowFlip1.png');
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
    const percentageSize = .8;
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
          tintColor: 'black'
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
  
  export { Symbol, Special,Arrows, getGlyphSource, getSymbolSource, getImpossibleSource, getAnimalSource, getFoodSource, getFruitSource,getFlowerSource, getDesertSource, getDogSource, getDog2Source, getScienceSource, getCardSource};