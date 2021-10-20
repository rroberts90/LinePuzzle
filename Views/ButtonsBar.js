// butttons bar
import React, {useState, useRef, useEffect} from 'react';

import { View, StyleSheet, Button, TouchableOpacity, Image, Animated, Easing} from 'react-native';


const ButtonsBar = ({ onUndo, onRestart, onHint, isCurrent, translateAnim, hintAllowed }) => {
    const [disabled, toggleDisabled]= useState(false);
    const followAnim =  useRef(new Animated.Value(0)).current;
  // console.log(`are hints allowed: ${hintAllowed}`);
    useEffect(()=> {
         Animated.timing(followAnim, {
            toValue: Animated.multiply(translateAnim,-1),
            duration: 0,
            useNativeDriver: true
              }).start(finished=>console.log(`finished: ${finished}`));
            },[]);
    return (
        <Animated.View style={[styles.buttonsBar, { transform:[{translateY: followAnim}, {translateY: isCurrent? 0: 200}]}]} >
            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-start', alignItems: 'center'}}>
             <View style={styles.bar}/>        
            </View>
            <TouchableOpacity style={styles.button} onPress={onUndo}>
                <Image style={styles.icon} source={require('../Icons/undo2.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onRestart}>
                <Image style={styles.icon} source={require('../Icons/restart2.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.lightbulb]} onPress={()=>{
                toggleDisabled(true);
                onHint(); 
                 setTimeout(()=> toggleDisabled(false), 500);
                }} disabled={!hintAllowed || disabled}>
                <Image style={styles.icon} source={require('../Icons/lightbulb.png')} />
            </TouchableOpacity>
        </Animated.View>

    );
};

const styles = StyleSheet.create({
    buttonsBar: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: 'rgba(248,248,255,1)',

        paddingTop: 10,

    },
    icon: {
        width: 50,
        height: 50,
        opacity: .8

        },
    button: {
        marginLeft: 0,
        marginBottom: 30,
        paddingHorizontal: 5,
        borderRadius: 10
      },
    lightbulb: {
        paddingBottom: 1,
        opacity: .8
    }, 
    bar: {
        width: '95%',
        borderRadius:10,
        height:2,
        backgroundColor:'black',
        opacity: .5
    }
});
export default ButtonsBar;