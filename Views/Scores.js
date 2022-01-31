import React, { useEffect, useState } from 'react';

import { View, Text, Button, Image, TouchableOpacity, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import colorScheme from '../Gameplay/ColorSchemes'

import { getItem, getItems, storeItem } from '../Storage';
import { PlayButton, BackButton } from './NavigationButtons';
import useSound from '../Sounds';
import { BoardSize } from './NavigationButtons';
import { InfoHeader } from './Header';


const ScoreBox = ({ header1, header2, score1, score2, color }) => {
    return (
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'column', width: '45%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}><BoardSize row={'4'} col={'6'} /></View>
                <Text style={[styles.userScore]}> {score1} </Text>
            </View>
            <View style={styles.bar} />
            <View style={{ flexDirection: 'column', width: '45%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}><BoardSize row={'5'} col={'7'} /></View>
                <Text style={[styles.userScore]}> {score2} </Text>
            </View>
        </View>
    );
}

function AfterGameScreen({ navigation, route }) {

    const { gameType, score, boardSize } = route.params;
    console.log('after game')
    console.log(score);
    const [high, setHigh] = useState('-');
    const [current, setCurrent] = useState(score);
    let itemName = `${gameType}Score`;

    if (boardSize) {
        itemName += '4x6';
    } else {
        itemName += '5x7';
    }

    useEffect(() => {
        getItem('currentScore').then(val => {
            if(val) {
             setCurrent(val);
            }
        })
    }, []);

    useEffect(() => {
        getItem(itemName).then(val => {

            if (parseInt(val) >= parseInt(score)) {
                setHigh(val);
            } else {
                setHigh(score);
                storeItem(itemName, score);
            }

        })
    }, []);

    return (
        <View style={[styles.container, { justifyContent: 'center' }]}>
            <InfoHeader navigation={navigation} title={''} />
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'column', width: '45%' }}>
                    <Text style={styles.header2}> Score </Text>
                    <Text style={styles.userScore}> {current} </Text>
                </View>
                <View style={styles.bar} />
                <View style={{ flexDirection: 'column', width: '45%' }}>
                    <Text style={styles.header2}> Best Score </Text>
                    <Text style={styles.userScore}> {high} </Text>
                </View>
            </View>
            <View style={styles.bar2} />

            <PlayButton navigation={navigation} title={gameType} borderColor={colorScheme.two} disabled={false} toggleDisabled={() => null} text={'play again'} boardSize={boardSize} />
        </View>);
}
function ScoresScreen({ navigation }) {
    const [puzzles, setPuzzles] = useState('-');
    const [timed, setTimed] = useState({ '4x6': '-', '5x7': '-' });
    const [moves, setMoves] = useState({ '4x6': '-', '5x7': '-' });

    const { play } = useSound();


    useEffect(() => {
        console.log('getting scores');
        getItems('timedScore4x6', 'timedScore5x7').then(items => {
            const small = parseInt(items[0][1]);
            const large = parseInt(items[1][1]);
            setTimed({ '4x6': small === 0 ? '-' : small, '5x7': large === 0 ? '-' : large });
        });
        getItems('movesScore4x6', 'movesScore5x7').then(items => {
            const small = parseInt(items[0][1]);
            const large = parseInt(items[1][1]);
            setMoves({ '4x6': small === 0 ? '-' : small, '5x7': large === 0 ? '-' : large });
        });
    }, []);


    return (
        <>

            <View style={styles.container}>
                <InfoHeader navigation={navigation} title={"High Scores"} />

                <Text style={styles.header}> Moves </Text>
                <ScoreBox header1={'4x6'} score1={moves['4x6']} header2={'5x7'} score2={moves['5x7']} color={colorScheme.two} />
                <View style={styles.bar2} />

                <Text style={styles.header}> Timed </Text>
                <ScoreBox header1={'4x6'} score1={timed['4x6']} header2={'5x7'} score2={timed['5x7']} color={colorScheme.three} />

            </View>

        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '15%'

    },
    box: {
        flexDirection: 'column',
        borderWidth: 7,
        borderColor: colorScheme.three,
        borderRadius: 15,
        padding: 5,
        width: '80%',
        margin: 10,
    },
    header: {
        fontSize: 30,
        alignSelf: 'center',
        marginVertical: 10,
        marginTop: '10%'
    },
    header2: {
        fontSize: 20,
        opacity: .7,
        alignSelf: 'center'
    },

    userScore: { fontSize: 40, alignSelf: 'center' },
    bar: {
        width: 1,
        borderRadius: 10,
        height: '95%',
        backgroundColor: 'black',
        opacity: .5,
        marginHorizontal: 20
    },
    bar2: {
        width: '90%',
        borderRadius: 20,
        height: 1,
        backgroundColor: 'black',
        opacity: .5,
        marginVertical: '5%'
    }

});
export { ScoresScreen, AfterGameScreen };