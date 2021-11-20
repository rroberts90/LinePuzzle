
import React, { useState, useEffect } from 'react';

import { View, Text, Button, Image, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import colorScheme from '../Gameplay/ColorSchemes'
import useSound from '../Sounds';

import { clearAll, storeItem, getSettings } from '../Storage'
import { BackButton } from './NavigationButtons';

import { getGlyphSource, getAnimalSource, getSymbolSource, getImpossibleSource } from './Symbols';
const defaultBackground = 'rgba(248,248,255,1)';

const DisplayImage = ({ source }) => {
    return <Image style={styles.iconSmall} source={source} />;
}

const Selector = ({ toggle, color, text1, text2, press1, press2 }) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <Pressable style={[styles.toggle, styles.toggleLeft, { borderColor: color }]} onPress={press1}>
                <View style={toggle ? [styles.selected, { backgroundColor: color }] : null} />
                <Text style={styles.toggleText}>{text1}</Text>
            </Pressable>
            <Pressable style={[styles.toggle, styles.toggleRight, { borderColor: color }]} onPress={press2}>
                <View style={toggle ? null : [styles.selected, { backgroundColor: color }]} />

                <Text style={styles.toggleText}>{text2}</Text>
            </Pressable>
        </View>
    );
}

function SettingsScreen({ navigation, route }) {
    const color = colorScheme.four;

    const [soundOn, toggleSound] = useState(null);
  
    const [board, toggleBoard] = useState(null);

    const [vibrate, toggleVibrate] = useState(null);

    const [difficulty, toggleDifficulty] = useState(null);

    const [display, setDisplay] = useState(null);

    const { play } = useSound();

    useEffect(() => {
        getSettings().then(settings => {
            const d = settings[0][1];

            const s = settings[1][1];
            const v = settings[2][1];
            const d2 = settings[3][1];
            const b = settings[4][1];

            setDisplay(d2 ? d2.replace(/"/g, '') : 'shapes');

            toggleDifficulty(d === 'true' ? true : false);

            toggleSound(s === 'true' ? true : false);
            toggleVibrate(v === 'true' ? true : false);
            toggleBoard(b === 'true' ? true : false);

        }).catch(e => console.log(e));
    }, []);

    useEffect(() => {
        if (difficulty !== null) {
            storeItem('difficulty', difficulty);
        }
    }, [difficulty]);

    useEffect(() => {
        if (soundOn !== null) {
            storeItem('sound', soundOn);
        }
    }, [soundOn]);

    useEffect(() => {
        if (vibrate !== null) {
            storeItem('vibrate', vibrate);
        }
    }, [vibrate]);

    useEffect(() => {
        if (display !== null) {

            storeItem('display', display);
        }
    }, [display]);

    useEffect(() => {
        if (board !== null) {
            storeItem('board', board);
        }
    }, [board]);

    return (
        <View style={styles.container}>
            <Text style={styles.topHeader}> Settings </Text>

            <View style={styles.bar} />

            <Text style={styles.headerText}> Difficulty </Text>
            <Selector toggle={difficulty} color={colorScheme.two} text1={'easy'} text2={'hard'} press1={() => { toggleDifficulty(true); play('connect'); }} press2={() => { toggleDifficulty(false); play('connect'); }} />
            <View style={styles.bar} />

            <Text style={styles.headerText}> Sound </Text>
            <Selector toggle={soundOn} color={colorScheme.two} text1={'on'} text2={'off'} press1={() => { toggleSound(true); play('connect'); }} press2={() => toggleSound(false)} />
            <View style={styles.bar} />

            <Text style={styles.headerText}> Vibrate </Text>
            <Selector toggle={vibrate} color={colorScheme.two} text1={'on'} text2={'off'} press1={() => { toggleVibrate(true); play('connect'); }} press2={() => { toggleVibrate(false); play('connect'); }} />
            <View style={styles.bar} />

            <Text style={styles.headerText}> Board Size </Text>
            <Selector toggle={board} color={colorScheme.two} text1={'4x6'} text2={'5x7'} press1={() => { toggleBoard(true); play('connect'); }} press2={() => { toggleBoard(false); play('connect'); }} />
            <View style={styles.bar} />
            <Text style={styles.headerText}> Display </Text>

            <View style={{ flexDirection: 'row' }}>
                <Pressable style={[styles.toggle, styles.toggleLeft, styles.toggleColorFour, styles.iconContainer]} onPress={() => { play('connect'); setDisplay('shapes') }}>
                    <View style={display === 'shapes' ? styles.selectedFour : null} />
                    <DisplayImage source={getSymbolSource(1)} />
                    <DisplayImage source={getSymbolSource(2)} />
                    <DisplayImage source={getSymbolSource(3)} />
                    <DisplayImage source={getSymbolSource(4)} />


                </Pressable>
                <Pressable style={[styles.toggle, styles.toggleColorFour, styles.iconContainer]} onPress={() => { play('connect'); setDisplay('impossible') }}>
                    <View style={display === 'impossible' ? styles.selectedFour : null} />
                    <DisplayImage source={getImpossibleSource(1)} />
                    <DisplayImage source={getImpossibleSource(2)} />
                    <DisplayImage source={getImpossibleSource(3)} />
                    <DisplayImage source={getImpossibleSource(4)} />

                </Pressable>
                <Pressable style={[styles.toggle, styles.toggleColorFour, styles.iconContainer]} onPress={() => { play('connect'); setDisplay('glyphs') }}>
                    <View style={display === 'glyphs' ? styles.selectedFour : null} />
                    <DisplayImage source={getGlyphSource(1)} />
                    <DisplayImage source={getGlyphSource(2)} />
                    <DisplayImage source={getGlyphSource(3)} />
                    <DisplayImage source={getGlyphSource(4)} />
                </Pressable>
                <Pressable style={[styles.toggle, styles.toggleRight, styles.toggleColorFour, styles.iconContainer]} onPress={() => { play('connect'); setDisplay('seaAnimal') }}>
                    <View style={display === 'seaAnimal' ? styles.selectedFour : null} />
                    <DisplayImage source={getAnimalSource(1)} />
                    <DisplayImage source={getAnimalSource(2)} />
                    <DisplayImage source={getAnimalSource(3)} />
                    <DisplayImage source={getAnimalSource(4)} />
                </Pressable>
            </View>

            <Text> Version .9 </Text>
            <Button title='Clear User Data' style={{ marginTop: 100 }} onPress={() => clearAll()} />
            <BackButton onPress={() => { play('paper'); navigation.navigate('colorflush') }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: defaultBackground
    },
    topHeader: {
        fontSize: 40,
        position: 'absolute',
        top: '5%'
    },

    headerText: {
        fontSize: 25,
        marginTop: 10
    },
    toggle: {
        borderWidth: 7,
        marginBottom: 10,
    },
    toggleColorFour: {
        borderColor: colorScheme.two
    },

    toggleLeft: {
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        borderRightWidth: 3.5
    },
    toggleMid: {
        borderLeftWidth: 3.5,
        borderRightWidth: 3.5,
        marginLeft: -.5,
        borderRadius: 0
    },
    toggleRight: {
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderLeftWidth: 3.5,
    },
    toggleText: {
        fontSize: 30,
        padding: 5,
        color: 'black',
        alignSelf: 'center'

    },
    difficultyText: {
        fontSize: 30,
        padding: 5,
        color: 'black',
        alignSelf: 'center'

    },
    selected: {
        position: 'absolute',
        opacity: .5,
        width: '100%',
        height: '100%'
    },
    selectedFour:
    {
        position: 'absolute',
        opacity: .5,
        backgroundColor: colorScheme.two,
        width: '100%',
        height: '100%'
    },
    iconSmall: {
        width: 25,
        height: 25
    },
    iconIconContainer: {
        flexDirection: 'row', flexWrap: 'wrap', width: 140
    },
    iconContainer:
        { width: 65, flexDirection: 'row', flexWrap: 'wrap' },
    bar: {
        width: '90%',
        borderRadius: 20,
        height: 1,
        backgroundColor: 'black',
        opacity: .5
    }


});

export default SettingsScreen;