
import React, { useState, useEffect } from 'react';

import { View, Text, Button, Image, TouchableOpacity, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import colorScheme from '../Gameplay/ColorSchemes'
import useSound from '../Sounds';

import { clearAll, storeItem, getSettings } from '../Storage'
import { BackButton } from './NavigationButtons';
import { InfoHeader } from './Header';
import { getGlyphSource, getAnimalSource, getSymbolSource, getImpossibleSource } from './Symbols';
const defaultBackground = 'rgba(248,248,255,1)';

const DisplayImage = ({ source }) => {
    return <Image style={styles.iconSmall} source={source} />;
}

const Selector = ({ toggle, color, text1, text2, press1, press2 }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
        <>
            <View style={styles.container}>
                <InfoHeader navigation = {navigation} title= {'Settings'}/>
              
                <View style={{ flexDirection: 'column'}}>
                <Text style={styles.headerText}>Difficulty</Text>

                <View style={styles.line}>
                    <Selector toggle={difficulty} color={colorScheme.four} text1={'easy'} text2={'hard'} press1={() => { toggleDifficulty(true); play('connect'); }} press2={() => { toggleDifficulty(false); play('connect'); }} />
                </View>


                </View>
                <View style={styles.bar}/> 
                <View style={{ flexDirection: 'column'}}>

                <Text style={styles.headerText}>Sound</Text>

                <View style={styles.line}>
                    <Selector toggle={soundOn} color={colorScheme.four} text1={'on'} text2={'off'} press1={() => { toggleSound(true); play('connect'); }} press2={() => toggleSound(false)} />
                </View>
                </View>

                <View style={styles.bar}/> 
                <View style={{ flexDirection: 'column'}}>

                <Text style={styles.headerText}>Vibrate</Text>

                <View style={styles.line}>
                    <Selector toggle={vibrate} color={colorScheme.four} text1={'on'} text2={'off'} press1={() => { toggleVibrate(true); play('connect'); }} press2={() => { toggleVibrate(false); play('connect'); }} />
                </View>
                </View>

                <View style={styles.bar}/> 

                <View style={{ flexDirection: 'column'}}>

                <Text style={styles.headerText}>Display</Text>

                <View style={styles.line}>
                    <View style={{ flexDirection: 'column' }}>

                        <Pressable style={[styles.toggle, styles.toggleColorFour, styles.iconContainer]} onPress={() => { play('connect'); setDisplay('impossible') }}>
                            <View style={display === 'impossible' ? styles.selectedFour : null} />
                            <DisplayImage source={getImpossibleSource(1)} />
                            <DisplayImage source={getImpossibleSource(2)} />
                            <DisplayImage source={getImpossibleSource(3)} />
                            <DisplayImage source={getImpossibleSource(4)} />
                        </Pressable>
                        <Pressable style={[styles.toggle, styles.toggleLeft, styles.toggleColorFour, styles.iconContainer]} onPress={() => { play('connect'); setDisplay('glyphs') }}>
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

                        <Pressable style={[styles.toggle, styles.toggleLeft, styles.toggleColorFour, styles.iconContainer]} onPress={() => { play('connect'); setDisplay('shapes') }}>
                            <View style={display === 'shapes' ? styles.selectedFour : null} />
                            <DisplayImage source={getSymbolSource(1)} />
                            <DisplayImage source={getSymbolSource(2)} />
                            <DisplayImage source={getSymbolSource(3)} />
                            <DisplayImage source={getSymbolSource(4)} />
                        </Pressable>
                    </View>
                </View>
                </View>

            </View>
</>
    );
}

const styles = StyleSheet.create({
    line: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignSelf: 'center',
        marginBottom: 10

    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: defaultBackground
    },

    headerText: {
        fontSize: 25,
        alignSelf: 'center',
        marginBottom: '2%'
    },
    toggle: {
        borderWidth: 0,
    },
    toggleColorFour: {
        borderColor: colorScheme.four
    },

    toggleLeft: {
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        borderRightWidth: 0
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
        borderLeftWidth: 0,
    },
    toggleText: {
        fontSize: 20,
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
        height: '100%',
        borderRadius: 10
    },
    selectedFour:
    {
        position: 'absolute',
        opacity: .5,
        backgroundColor: colorScheme.four,
        width: '100%',
        height: '100%',
        borderRadius: 10
    },
    iconSmall: {
        width: 50,
        height: 50
    },
    iconIconContainer: {
        flexDirection: 'row', flexWrap: 'wrap', width: 140
    },
    iconContainer:
        { flexDirection: 'row', flexWrap: 'wrap' },
    bar: {
        width: '70%',
        borderRadius: 20,
        height: 1,
        backgroundColor: 'black',
        opacity: .5,
        alignSelf: 'center',
        marginVertical: 10
    }


});

export default SettingsScreen;