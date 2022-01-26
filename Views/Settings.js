
import React, { useState, useEffect } from 'react';

import { View, Text, Button, Image, Pressable, StyleSheet, ScrollView } from 'react-native';
import colorScheme from '../Gameplay/ColorSchemes'
import useSound from '../Sounds';

import { clearAll, storeItem, getSettings } from '../Storage'
import { InfoHeader } from './Header';
import { getGlyphSource, getAnimalSource, getSymbolSource, getImpossibleSource, getDogSource, getDog2Source, getScienceSource, getFoodSource, getDesertSource, getFlowerSource, getFruitSource, getCardSource } from './Symbols';

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

const SymbolGroup = ({ getSource, selected, groupName, setDisplay }) => {
    const { play } = useSound();

    return (<Pressable style={[styles.toggle, styles.toggleColorFour, styles.iconContainer]}
        onPress={() => { play('connect'); setDisplay(groupName) }}
    >
        <View style={selected === groupName ? [styles.selectedFour, {width: styles.iconSmall.width* 4 + 10}] : null} />
        <DisplayImage source={getSource(1)} />
        <DisplayImage source={getSource(2)} />
        <DisplayImage source={getSource(3)} />
        <DisplayImage source={getSource(4)} />
    </Pressable>
    );
}

function SettingsScreen({ navigation, route }) {
    const color = colorScheme.four;

    const [soundOn, toggleSound] = useState(null);

    const [board, toggleBoard] = useState(null);

    const [vibrate, toggleVibrate] = useState(null);

    const [music, toggleMusic] = useState(null);

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

            toggleMusic(d === 'true' ? true : false);

            toggleSound(s === 'true' ? true : false);
            toggleVibrate(v === 'true' ? true : false);
            toggleBoard(b === 'true' ? true : false);

        }).catch(e => console.log(e));
    }, []);

    useEffect(() => {
        if (music !== null) {
            storeItem('music', music);
        }
    }, [music]);

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
                <InfoHeader navigation={navigation} title={'Settings'} />

                <View style={{ flexDirection: 'column', marginTop: '25%' }}>

                    <Text style={styles.headerText}>Music</Text>

                    <View style={styles.line}>
                        <Selector toggle={music} color={colorScheme.four} text1={'on'} text2={'off'} press1={() => { toggleMusic(true); play('connect'); }} press2={() => { toggleMusic(false); play('connect'); }} />
                    </View>
                </View>
                <View style={styles.bar} />
                <View style={{ flexDirection: 'column' }}>

                    <Text style={styles.headerText}>Sounds</Text>

                    <View style={styles.line}>
                        <Selector toggle={soundOn} color={colorScheme.four} text1={'on'} text2={'off'} press1={() => { toggleSound(true); play('connect'); }} press2={() => toggleSound(false)} />
                    </View>
                </View>

                <View style={styles.bar} />
                <View style={{ flexDirection: 'column' }}>

                    <Text style={styles.headerText}>Vibrate</Text>

                    <View style={styles.line}>
                        <Selector toggle={vibrate} color={colorScheme.four} text1={'on'} text2={'off'} press1={() => { toggleVibrate(true); play('connect'); }} press2={() => { toggleVibrate(false); play('connect'); }} />
                    </View>
                </View>

                <View style={styles.bar} />

                <View style={{ flexDirection: 'column' }}>

                    <Text style={styles.headerText}>Themes</Text>

                    <View style={styles.line}>
                        <ScrollView style={{ height: 200 }}>
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <SymbolGroup selected={display} groupName={'impossible'} getSource={getImpossibleSource} setDisplay={setDisplay} />
                                <SymbolGroup selected={display} groupName={'glyph'} getSource={getGlyphSource} setDisplay={setDisplay} />
                                <SymbolGroup selected={display} groupName={'card'} getSource={getCardSource} setDisplay={setDisplay} />
                                <SymbolGroup selected={display} groupName={'animal2'} getSource={getAnimalSource} setDisplay={setDisplay} />
                                <SymbolGroup selected={display} groupName={'animal1'} getSource={getSymbolSource} setDisplay={setDisplay} />
                                <SymbolGroup selected={display} groupName={'pets1'} getSource={getDogSource} setDisplay={setDisplay} />
                                <SymbolGroup selected={display} groupName={'pets2'} getSource={getDog2Source} setDisplay={setDisplay} />
                                <SymbolGroup selected={display} groupName={'science'} getSource={getScienceSource} setDisplay={setDisplay} />
                                <SymbolGroup selected={display} groupName={'food'} getSource={getFoodSource} setDisplay={setDisplay} />
                                <SymbolGroup selected={display} groupName={'desert'} getSource={getDesertSource} setDisplay={setDisplay} />
                                <SymbolGroup selected={display} groupName={'flower'} getSource={getFlowerSource} setDisplay={setDisplay} />
                                <SymbolGroup selected={display} groupName={'fruit'} getSource={getFruitSource} setDisplay={setDisplay} />

                            </View>

                        </ScrollView>
                    </View>
                </View>
                <Button title='Clear User Data' style={{ marginTop: 100 }} onPress={() => clearAll()} />

            </View>
        </>
    );
}

const styles = StyleSheet.create({
    line: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignSelf: 'center',
        margin: 10

    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },

    headerText: {
        fontSize: 25,
        alignSelf: 'center',
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
        width: '65%',
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