import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Image, StyleSheet, Text, SafeAreaView, Animated, View, Pressable } from 'react-native';
import colorScheme from '../Gameplay/ColorSchemes'

import useSound from '../Sounds';
import { storeItem } from '../Storage';
import GlobalStyles from '../GlobalStyles'

const defaultBackground = GlobalStyles.defaultBackground.backgroundColor;
const buttonBackground = defaultBackground//'rgba(240,240,245,1)';

const PlayButton = ({ navigation, title, disabled, toggleDisabled, borderColor, text, boardSize }) => {
    const { play } = useSound();
    return (
        <TouchableOpacity
            style={[styles.menuButton, { borderColor: borderColor }]}
            onPress={() => {
                toggleDisabled(true);
                boardSize !== null ? navigation.push(title, { boardSize: true }) : navigation.push(title);
                setTimeout(() => toggleDisabled(false), 500);

            }}
            disabled={disabled}
        >
            <View style={{
                height: '60%', aspectRatio: 1, marginHorizontal: 5
            }}>
                <Image style={[styles.play,
                { tintColor: borderColor, opacity: .8 }]}
                    source={text === 'skip tutorial' ? require('../Icons/skip3.png') : require('../Icons/play1.png')} />
            </View>
            <Text style={[styles.buttonText, text ? { fontSize: 30 } : {}]}>{text ? text : title} </Text>
        </TouchableOpacity>
    );
}
const IconButton = ({ navigation, title, disabled, toggleDisabled, borderColor, icon }) => {
    const { play } = useSound();

    return (
        <TouchableOpacity
            style={[styles.iconButton, { borderColor: borderColor }]}
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

const BackButton = ({ navigation, overrideDestination }) => {
    return (

        <TouchableOpacity
            style={styles.backbutton}
            onPress={() => {
                storeItem('tutorialFinished', true);
                overrideDestination ? navigation.navigate(overrideDestination, { updateProgress: true }) : navigation.navigate('colormaze')
            }}
        >
            <Image style={{ height: '100%', width: '100%', opacity: .7 }} source={require('../Icons/backArrow2.png')} />
        </TouchableOpacity>

    );

}


const BoardSize = ({ row, col }) => {
    return (<><Text style={[styles.boardSize]}>{col}</Text>
        <View style={[styles.times]} />
        <Text style={[styles.boardSize]}>{row}</Text></>);
}

// has a choice for board size
const PlayButtonExpanded = ({ navigation, title, disabled, toggleDisabled, borderColor, text, boardSizeSelected, toggleSize }) => {
    const { play } = useSound();
    return (
        <TouchableOpacity
            style={[styles.menuButton2, { borderColor: borderColor }]}
            onPress={() => {
                toggleDisabled(true);
                navigation.push(title, { boardSize: boardSizeSelected });
                setTimeout(() => toggleDisabled(false), 500);

            }}
            disabled={disabled}
        >
            <View style={{
                height: '80%', aspectRatio: 1, marginHorizontal: 5, justifyContent: 'center'
            }}>
                <Image style={[styles.play2,
                { tintColor: borderColor, opacity: .8 }]}
                    source={require('../Icons/play1.png')} />
            </View>
            <Text style={[styles.buttonText,
            text ? { fontSize: 30 } : {}]}>
                {text ? text : title}
            </Text>
            <View style={[styles.row2]}>
                <Pressable style={[styles.boardSizeButton]}
                    onPress={() => toggleSize(true)}
                >
                    <View style={{
                        position: 'absolute',
                        width: '100%'
                        , height: '100%',
                        backgroundColor: boardSizeSelected ? borderColor : 'rgb(211,211,211)',
                        opacity: .5
                    }} />
                    <BoardSize row={'6'} col={'4'} />
                </Pressable>
                <Pressable style={[styles.boardSizeButton]}
                    onPress={() => toggleSize(false)}>
                    <View style={{
                        position: 'absolute',
                        width: '100%'
                        , height: '100%',
                        backgroundColor: boardSizeSelected ? 'rgb(211,211,211)' : borderColor,
                        opacity: .5
                    }} />
                    <BoardSize row={'7'} col={'5'} />

                </Pressable>
            </View>
        </TouchableOpacity>
    );
}

const mapDifficultyToColor = (difficulty) => {
    if (difficulty === 'easy') {
        return colorScheme.four;
    }
    else if (difficulty === 'moderate') {
        return colorScheme.three;
    } else {
        return colorScheme.one;
    }
}

const PuzzleButton = ({ navigation, disabled, toggleDisabled, info }) => {
    const name = `Pack ${info.level}`;
    const progressStr = `${info.initialProgress}/${info.mazeCount}`;
    const puzzleCompleted = info.initialProgress >= info.mazeCount;
    const source = !puzzleCompleted ? require('../Icons/play1.png') : require('../Icons/check1.png')
    return (
        <TouchableOpacity
            style={[styles.menuButton, styles.puzzleButton]}
            onPress={() => {
                toggleDisabled(true);
                if (!puzzleCompleted) {
                    storeItem('currentPuzzle', info.level);
                    navigation.push('puzzle', info);
                } else {
                    navigation.push('afterPuzzle', { puzzleNumber: info.level });

                }
                setTimeout(() => toggleDisabled(false), 500);

            }}
            disabled={disabled}
        >
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>

                <View>
                    <Image style={[styles.play,
                    { tintColor: mapDifficultyToColor(info.difficulty), opacity: .8 },
                    {
                        height: '60%', aspectRatio: 1, marginHorizontal: 5
                    }]}
                        source={source} />
                </View>

                <Text style={[styles.puzzleText, styles.level]} > {name}</Text>
            </View>

            <Text style={[styles.puzzleText, styles.progress]}> {progressStr}</Text>


            <Text style={[styles.puzzleText, styles.difficulty]}>{info.difficulty}</Text>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    menuButton: {
        width: '75%',
        height: '10%',
        borderWidth: 5,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 15,
        padding: 0,
        marginHorizontal: 0,
        borderRadius: 3,
        flexDirection: 'row',
        backgroundColor: buttonBackground

    },
    puzzleButton: {
        width: '95%',
        height: 60,
        borderWidth: 0,
        justifyContent: 'flex-start',
    },
    puzzleText: {
        fontSize: 20,
        flex: 1,
        textAlign: 'center',

    },
    level: {
    },
    difficulty: {

    },
    buttonText: {
        flex: 1.6,
        color: 'black',
        fontSize: 35,
        letterSpacing: 1.5,
        alignSelf: 'center',
        opacity: .8,
        marginLeft: '5%'
    },
    iconButton: {
        borderRadius: 0,
        borderWidth: 0,
        alignSelf: 'stretch',
        marginHorizontal: 10,
        marginVertical: 20,
        padding: 5,
        backgroundColor: buttonBackground
    },
    icon: {
        height: 45,
        width: 45,
        alignSelf: 'center',
        tintColor: 'black',
        opacity: .65
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '60%',
        alignItems: 'stretch'

    },
    play2: {
        width: '70%',
        height: '70%',
        aspectRatio: 1,

    },
    play: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,

    },
    skip: {
        width: '22%',
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
        fontSize: 30,
        padding: 10,
        color: 'black',

    },
    backbutton: {
        height: 40,
        width: 40,
        position: 'absolute',
        left: 1,
        bottom: 0,
        opacity: .8,
        zIndex: 10

    },
    backbuttonwrapper: {
        flex: 1
    },
    menuButton2: {
        width: '75%',
        height: '10%',
        borderWidth: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginVertical: 15,
        padding: 0,
        marginHorizontal: 0,
        borderRadius: 3,
        flexDirection: 'row',
        backgroundColor: buttonBackground

    },
    row2: {
        flexDirection: 'column',
        flex: 1,

    },
    boardSize: {
        fontSize: 25,
        color: 'black',
        opacity: .8,
        paddingVertical: 0,
        paddingHorizontal: 8,
        textAlign: 'center'

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
        height: '50%'
    }
});
export { BackButton, PlayButton, IconButton, PlayButtonExpanded, BoardSize, PuzzleButton };