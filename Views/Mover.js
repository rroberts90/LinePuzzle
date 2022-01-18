import  React, {useState, useEffect, useRef} from 'react';
import { Animated, Easing } from 'react-native';
import Header from './Header';
import useInterval from "./useInterval";

const defaultMoves = 25;
const defaultSize = 1;
const Mover = ({onFinish, level, moves, navigation}) => {
    //const [prevCount, setPrevCount]= useState(()=> visitedNodes);

    const [prevMoves, setPrevMoves]= useState(()=> moves);
    
    const fontAnim = useRef(new Animated.Value(1)).current;
    const [finished, setFinished] = useState(false); // makes layout load all pretty before rendering
    useEffect(()=> {
        if(moves < prevMoves) { 
            // added moves
            Animated.sequence([
                Animated.timing(fontAnim, {
                    toValue: 1.5,
                    isInteraction: false,
                    useNativeDriver: true,
                    duration: 500,
                    easing: Easing.in(Easing.quad)
                }),
                Animated.timing(fontAnim, {
                    toValue: 1,
                    isInteraction: false,
                    useNativeDriver: true,
                    duration: 500,
                    easing: Easing.out(Easing.quad)
                })            ]).start();
        }
        if(defaultMoves-moves <= 0  && !finished){
             setFinished(true);
             onFinish('moves',level);
        }

        setPrevMoves(moves);
    }, [moves]);
    

    return (
        <Header title1={'Moves'} item1={defaultMoves - moves} title2={'Score'} item2={level} fontAnim={fontAnim} navigation= {navigation}/>
 );   
}

export default Mover;