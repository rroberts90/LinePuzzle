// butttons bar
import React, {useState, useRef, useEffect} from 'react';

import { View, StyleSheet, Button, TouchableOpacity, Image, SafeAreaView} from 'react-native';

import useSound from '../Sounds';

const ButtonsBar = ({ undoEl, restartEl, hintEl}) => {
    const [disabled, toggleDisabled]= useState(false);
    const {play}= useSound();

    function handleOnHint() {
        console.log('handling hint');
        if (disabled || hintEl.current.onPress === null) {
            console.log('hint is disabled');
            return;
        }

        toggleDisabled(true);
       hintEl.current.onPress()
       .then(waitTime=> {
        setTimeout(()=> toggleDisabled(false), 500);

       })
       .catch(error=> {
           console.log(error);
       })

        //toggleDisabled(false);
    }

    return (
        <View style={[styles.buttonsBar]}>
            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-start', alignItems: 'center'}}>
             <View style={styles.bar}/>        
            </View>
            <TouchableOpacity ref={undoEl} style={styles.button} onPress={()=>{ undoEl.current.onPress(true)}} >
                <Image style={styles.icon} source={require('../Icons/undo2.png')} />
            </TouchableOpacity>
            <TouchableOpacity ref={restartEl} style={[styles.button]} onPress={()=> {play('button'); restartEl.current.onPress()}} >
                <Image style={styles.icon} source={require('../Icons/restart2.png')} />
            </TouchableOpacity>
            <TouchableOpacity ref={hintEl} style={[styles.button, styles.lightbulb, {opacity: disabled? .5: .8 }]} onPress={handleOnHint} disabled={disabled}>
                <Image style={styles.icon} source={require('../Icons/lightbulb.png')} />
            </TouchableOpacity>
        </View>

    );
};

const styles = StyleSheet.create({
    buttonsBar: {
        width: '100%',
        position: 'absolute',
        bottom: -2,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: 'rgba(248,248,255,1)',
        height: '9%'
    },
    icon: {
        height: '100%',
        aspectRatio: 1,
        alignSelf: 'center',
        
        opacity: .8

        },
    button: {
        width: '13.5%',
        aspectRatio: 1,
        paddingHorizontal: 5,
        paddingTop: 10,
        borderRadius: 10
      },
    lightbulb: {
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