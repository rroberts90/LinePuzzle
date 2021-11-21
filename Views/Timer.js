import  React, {useState, useEffect, useRef} from 'react';
import { View,Text, StyleSheet, SafeAreaView, Animated, Easing } from 'react-native';
import Header from './Header';
import useInterval from "./useInterval";

const defaultBackground = 'rgba(248,248,255,1)';
const defaultSize = 1;

const Timer = ({onFinish, level, time, setTime}) => {

    const [prevTime, setPrevTime]= useState(()=> time);
    
    const fontAnim = useRef(new Animated.Value(1)).current;

    useEffect(()=> {
        const isFinished = time <=0;

        if(isFinished){
        onFinish('timed',level);

        }
        if(time > prevTime) { 
            // added moves
            Animated.sequence([
                Animated.timing(fontAnim, {
                    toValue: 1.5,
                    isInteraction: false,
                    useNativeDriver: true,
                    duration: 500,
                    easing: Easing.linear
                }),
                Animated.spring(fontAnim, {toValue: defaultSize, useNativeDriver: true })
            ]).start();
        }
        setPrevTime(time);

    }, [time]);
    
    useInterval(()=>{

        setTime(t=> t-1);

        if(time <= 0){
            return;
        }
    }, 1000);
    return (
        <Header title1={'Time'} item1={time} title2={'Score'} item2={level} fontAnim = {fontAnim}/>
 );   
}

const styles = StyleSheet.create({
    duo: {
        flexDirection:'row'
    },
    box: {
        position: 'absolute',
        top: '6%',
        alignSelf: 'center',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,.5)',
        opacity: 1,
        paddingHorizontal: 10,
        paddingVertical: 2,
        backgroundColor: defaultBackground,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%'
        
    },
    box2: {
        position:'absolute',
        width: '100%',
        top:0,
        paddingHorizontal: 10,
        paddingBottom: 0,
        backgroundColor: defaultBackground,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
        
    },
    header: {
        fontSize: 16,
        letterSpacing: 1,
        alignSelf: 'center',
        opacity: .6,
        marginBottom: 5

    },
    timetext: {
       fontSize: 25,
       opacity: .7,
       marginBottom: 5
    },
    bar: {
        width: '95%',
        borderRadius:10,
        height:2,
        backgroundColor:'black',
        opacity: .5,
    }

});

export default Timer;