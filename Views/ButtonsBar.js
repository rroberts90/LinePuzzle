// butttons bar
import React, {useState} from 'react';

import { View, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';


const ButtonsBar = ({ onUndo, onRestart, onHint }) => {
    const [disabled, toggleDisabled]= useState(false);

    return (
        <View style={styles.buttonsBar}>
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
        </View>

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
        backgroundColor: 'rgba(137, 148, 153,.4)',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 10    },
    lightbulb: {
        paddingBottom: 1
    }
});
export default ButtonsBar;