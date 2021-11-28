import React, {useState, useEffect, useRef} from 'react';
import {  TouchableOpacity, Image, StyleSheet, Text, SafeAreaView, Animated,View,Pressable} from 'react-native';
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

const BoardSize = ({row, col}) => {
    return (<><Text style={[styles.boardSize]}>{col}</Text>
    <View style={[styles.times]} />
    <Text style={[styles.boardSize]}>{row}</Text></>);
}

// has a choice for board size
const PlayButtonExpanded = ({ navigation, title, disabled, toggleDisabled, borderColor, text, boardSizeSelected, toggleSize }) => {
    const { play } = useSound();
    const utfCircle = "&#11044"
    return (
        <TouchableOpacity
            style={[styles.menuButton2, { borderColor: borderColor }]}
            onPress={() => {
                toggleDisabled(true);
                navigation.push(title, {boardSize: boardSizeSelected});
                setTimeout(() => toggleDisabled(false), 500);

            }}
            disabled={disabled}
        >
            <Image style={[styles.play,
            { tintColor: borderColor, opacity: .8 }]}
                source={require('../Icons/play1.png')} />

            <Text style={[styles.buttonText,
            text ? { fontSize: 30 } : {}]}>
                {text ? text : title}
            </Text>

            <View style={[styles.row2, {}]}>
                <Pressable style={[styles.boardSizeButton]}
                onPress={()=>toggleSize(true)}
                >
                    <View style={{
                        position: 'absolute',
                        width: '101%'
                        , height: '100%',
                        backgroundColor: boardSizeSelected ? borderColor : 'rgb(211,211,211)',
                        opacity: .5
                    }} />
                    <BoardSize  row={'6'} col={'4'}/>
                </Pressable>
                <Pressable style={[styles.boardSizeButton]}   
                 onPress={()=>toggleSize(false)}>
                    <View style={{
                        position: 'absolute',
                        width: '100%'
                        , height: '100%',
                        backgroundColor: boardSizeSelected ? 'rgb(211,211,211)' : borderColor,
                        opacity: .5
                    }} />
                    <BoardSize row={'7'} col= {'5'}/>

                </Pressable>
            </View>
        </TouchableOpacity>
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
        alignSelf: 'center',
        opacity: .8
    },
    iconButton: {
        borderRadius: 3,
        borderWidth: 5,
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

    },
    menuButton2: {
        borderWidth: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginVertical: 15,
        padding: 0,
        borderRadius: 3,
        width: '80%',
        flexDirection: 'row',
        backgroundColor: buttonBackground

    },
    row2: {
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'flex-end',

    },
    boardSize: {
        fontSize: 25,
        color: 'black',
        opacity: .8,
        paddingVertical: 3,
        paddingHorizontal: 8
    },
    times: {
        borderColor: 'black',
        width: 2,
        borderWidth: 3,
        borderRadius: 3,
        aspectRatio: 1,
        marginLeft: 1,
        marginRight: 1
    },
    boardSizeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    }
});
export {BackButton, PlayButton, IconButton, PlayButtonExpanded, BoardSize};