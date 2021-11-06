import React, {useState, useEffect, useRef} from 'react';
import {  TouchableOpacity, Image, StyleSheet, Text, SafeAreaView} from 'react-native';
import colorScheme from '../Gameplay/ColorSchemes'

import useSound from '../Sounds';
const defaultBackground = 'rgba(248,248,255,1)';


const PlayButton = ({navigation, title, disabled, toggleDisabled, borderColor, text})=> {
    const {play} = useSound();
    return (
        <TouchableOpacity
        style={[styles.menuButton, {borderColor: borderColor}]}
        onPress={() => {
            play('paper');
            toggleDisabled(true);
            navigation.push(title);
            setTimeout(()=> toggleDisabled(false), 500);

        }}
        disabled={disabled}
    >
        <Image style={[styles.play, {tintColor:borderColor, opacity: .8}]} source = {require('../Icons/play1.png')}/>
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
                play('paper');
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
            onPress={onPress}
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
        marginVertical: 20,
        padding: 5,
        borderRadius: 15,
        width: '60%',
        flexDirection: 'row'
    },
    buttonText: {
        color: 'black',
        fontSize: 40,
        fontWeight: 'bold',
        alignSelf: 'stretch',
        opacity: .8
    },
    loadingScreen: {
        backgroundColor: defaultBackground,
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    defaultBackground: {backgroundColor:defaultBackground},
    iconButton: {
        borderWidth: 7,
        borderRadius: 15,
        alignSelf: 'stretch',
        width: '45%',
        marginHorizontal: 10,
        marginVertical: 20,
        padding: 5
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
    selected: {

    },
    backbutton: {
        position: 'absolute',
         top: -5,
          left: 5,

    }
});
export {BackButton, PlayButton, IconButton};