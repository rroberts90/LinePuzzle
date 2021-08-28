// butttons bar
import React from 'react';

import { View, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';


const ButtonsBar = ({ onUndo, onRestart }) => {
    return (
        <View style={styles.buttonsBar}>
            <TouchableOpacity style={styles.button} onPress={onUndo}>
                <Image style={styles.icon} source={require('./Icons/undo.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onRestart}>
                <Image style={styles.icon} source={require('./Icons/restart.png')} />
            </TouchableOpacity>
        </View>

    );
};


const styles = StyleSheet.create({
    buttonsBar: {
        flexDirection: 'row'
    },
    icon: {
        width: 50,
        height: 50,
        tintColor: "rgb(59,68,75)"
    },
    button: {
        marginLeft: 30,
        marginBottom: 30,
    }
});
export default ButtonsBar;