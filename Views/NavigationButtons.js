import React, {useState, useEffect, useRef} from 'react';
import {  TouchableOpacity, Image, StyleSheet, Text, SafeAreaView, Animated} from 'react-native';
import colorScheme from '../Gameplay/ColorSchemes'

import useSound from '../Sounds';
const defaultBackground = 'rgba(248,248,255,1)';

const buttonBackground  = 'rgba(240,240,245,1)';

const PlayButton = ({navigation, title, disabled, toggleDisabled, borderColor, text})=> {
    const {play} = useSound();
    return (
        <TouchableOpacity
        style={[styles.menuButton, {borderColor: borderColor}]}
        onPress={() => {
            toggleDisabled(true);
            navigation.push(title);
            setTimeout(()=> toggleDisabled(false), 500);

        }}
        disabled={disabled}
    >
        <Image style={[styles.play, {tintColor:borderColor, opacity: .8}]} source = {title !=='colorflush' ? require('../Icons/play1.png') : require('../Icons/skip3.png') }/>
    <Text style={[styles.buttonText, text? {fontSize: 30}: {} ]}>{text? text : title} </Text>
    </TouchableOpacity>
    );
}
const IconButton = ({navigation, title, disabled, toggleDisabled, borderColor, icon})=> {
    const {play} = useSound();

    return (
        <TouchableOpacity
            style={[styles.iconButton,{ borderColor: borderColor }]}
            onPress={() => {
                toggleDisabled(true)
                navigation.navigate(title);
                setTimeout(() => toggleDisabled(false), 500);

            }}
            disabled={disabled}
        >
            <Image style={styles.icon} source={icon} />
        </TouchableOpacity>
    );
}

const BackButton = ({ onPress }) => {
    return (<SafeAreaView style={styles.backbutton}>
        <TouchableOpacity
            style={{
                 height: 40, 
                 width: 40
        }}
            onPress={()=>{
                onPress();}}
        >
            <Image style={{ height: '100%', width: '100%', opacity: .7 }} source={require('../Icons/backArrow2.png')} />
        </TouchableOpacity>
    </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    menuButton: {
        borderWidth: 7,
        alignItems:'center',
        justifyContent: 'flex-start',
        alignSelf:'center',
        marginVertical: 15,
        padding: 5,
        borderRadius: 15,
        width: '65%',
        flexDirection: 'row',
        backgroundColor: buttonBackground

    },
    buttonText: {
        color: 'black',
        fontSize: 40,
        letterSpacing: 1.25,
        alignSelf: 'stretch',
        opacity: .8
    },
    iconButton: {
        borderRadius: 15,
        borderWidth: 7,
        alignSelf: 'stretch',
        width: '45%',
        marginHorizontal: 10,
        marginVertical: 20,
        padding: 5,
    },
    icon:{
        height: 45, 
        width: 45,
        alignSelf: 'center',
        tintColor: 'black',
        opacity: .65
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width:'60%',
        alignItems: 'stretch'


    }, 
    play: {
        width:'18%',
        aspectRatio: 1,
        marginRight: 10
    }, 
    skip: {
        width:'22%',
        aspectRatio: 1,
        marginRight: 0
    }, 
    headerText: { 
        fontSize: 30
    },
    toggle: {
        borderRadius: 2,
        borderWidth: 7,
        borderColor: colorScheme.four,

    },
    toggleText: {
        fontSize:30, 
        padding: 10,
        color: 'black',

    },
    backbutton: {
        position: 'absolute',
         top: -5,
          left: 5,

    }
});
export {BackButton, PlayButton, IconButton};