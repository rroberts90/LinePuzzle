import  React, {useState, useEffect, useRef} from 'react';
import { View,Text, StyleSheet, SafeAreaView, Animated, Easing } from 'react-native';
import Header from './Header';
import useInterval from "./useInterval";


const Timer = ({onFinish, level, time, setTime, navigation}) => {

    const [prevTime, setPrevTime]= useState(()=> time);
    
    const fontAnim = useRef(new Animated.Value(1)).current;
    const [finished, setFinished] = useState(false);

    function sleep(ms) {
        return new Promise(resolve=> setTimeout(resolve,ms));
      }

    useEffect(()=> {
        const timesUp = time <=0;

        if(timesUp && !finished){
            setFinished(true); // stops glitch where timer keeps on reloading
            sleep(500).then(()=>onFinish('timed',level));

        }
        if(time > prevTime) { 
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
                })  
            ]).start();
        }
        setPrevTime(time);

    }, [time]);
    
    useInterval(()=>{

        if(time > 0){
        setTime(t=> t-1);
        }
        if(time <= 0){
            return;
        }
    }, 1000);
    return (
        <Header title1={'Time'} item1={time <0 ? 0 :time} title2={'Score'} item2={level} fontAnim = {fontAnim} navigation= {navigation}/>
 );   
}

export default Timer;