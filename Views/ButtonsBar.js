// butttons bar
import React, {useState, useRef, useEffect} from 'react';

import { View, StyleSheet, Button, TouchableOpacity, Image, Animated, Easing} from 'react-native';


const ButtonsBar = ({ onUndo, onRestart, onHint, isCurrent, translateAnim }) => {
    const [disabled, toggleDisabled]= useState(false);
    const followAnim =  useRef(new Animated.Value(0)).current;

    useEffect(()=> {
         Animated.timing(followAnim, {
            toValue: Animated.multiply(translateAnim,-1),
            duration: 0,
            useNativeDriver: false
              }).start(finished=>console.log(`finished: ${finished}`));
            },[]);
    return (
        <Animated.View style={[styles.buttonsBar, { transform:[{translateY: followAnim}, {translateY: isCurrent? 0: 200}]}]} >
            <TouchableOpacity style={styles.button} onPress={onUndo}>
                <Image style={styles.icon} source={require('../Icons/undo2.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onRestart}>
                <Image style={styles.icon} source={require('../Icons/restart2.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.lightbulb]} onPress={()=>{
                onHint(); 
                toggleDisabled(true);
                 setTimeout(()=> toggleDisabled(false), 200);
                }} disabled={disabled}>
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
        borderTopWidth: 2,
        borderRadius: 1,
        borderColor: 'grey',
        paddingTop: 10,

    },
    icon: {
        width: 50,
        height: 50,
        tintColor: 'rgb(59,68,75)'
    },
    button: {
        marginLeft: 0,
        marginBottom: 30,
        paddingHorizontal: 5,
        borderRadius: 10  
      },
    lightbulb: {
        paddingBottom: 1
    }
});
export default ButtonsBar;