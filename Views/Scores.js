import React, { useState } from 'react';

import { View, Text, Button, Image, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import colorScheme from '../Gameplay/ColorSchemes'

import { getItem } from '../Storage';
import { PlayButton, BackButton } from './NavigationButtons';
import useSound from '../Sounds';

import { StackActions } from '@react-navigation/routers';
const defaultBackground = 'rgba(248,248,255,1)';

//            <PlayButton navigation={navigation} title={'timed'} borderColor={colorScheme.two} disabled={false} toggleDisabled={() => null}   text={'play again'}/>

function AfterGameScreen({ navigation, route }) {
    const { play } = useSound();


    const { gameType, score } = route.params;
    const [high, setHigh] = useState(score);
    const itemName = `${gameType}Score`;
  
    getItem(itemName).then(val => {
        setHigh(val);

    });

    return (
        <View style={styles.container}>
            <View style={{ width:'100%',flexDirection: 'row', justifyContent: 'center'}}>
                <View style={{ flexDirection: 'column', width: '45%' }}>
                    <Text style={styles.header2}> Score </Text>
                    <Text style={styles.userScore}> {score} </Text>
                </View>
                <View style={styles.bar}/>
                <View style={{ flexDirection: 'column' , width:'45%'}}>
                    <Text style={styles.header2}> Best Score </Text>
                    <Text style={styles.userScore}> {high} </Text>
                </View>
            </View>
            <View style={styles.bar2}/>        

            <BackButton onPress={() => { play('paper'); navigation.navigate('colorflush') }} />
            <PlayButton navigation={navigation} title={'timed'} borderColor={colorScheme.two} disabled={false} toggleDisabled={() => null}   text={'play again'}/>
        </View>);
}
function ScoresScreen({ navigation }) {
    const [puzzles, setPuzzles] = useState('-');
    const [timed, setTimed] = useState('-');
    const { play } = useSound();

    getItem('puzzles').then(val => {
        if (val && val > 0) {
            setPuzzles(val);
        }
    });
    getItem('timedScore').then(val => {
        if (val && val > 0) {
            setTimed(val);
        }
    });

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 40, position: 'absolute', top: 45 }}>Achievements</Text>
            <View style={[styles.box, { marginTop: '30%' }]}>
                <Text style={styles.header}>Puzzles Finished</Text>
                <Text style={styles.userScore}> {puzzles}</Text>
            </View>
            <View style={[styles.box, { borderColor: colorScheme.two }]}>
                <Text style={styles.header}>Best Timed Score</Text>
                <Text style={styles.userScore}> {timed} </Text>
            </View>
            <BackButton onPress={() => { play('paper'); navigation.navigate('colorflush') }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: defaultBackground
    },
    box: {
        flexDirection: 'column',
        borderWidth: 7,
        borderColor: colorScheme.three,
        borderRadius: 15,
        padding: 5,
        width: '80%',
        margin: 10
    },
    header: {
        fontSize: 30,
        alignSelf: 'center'
    },
    header2: {
        fontSize: 20,
        opacity: .7,
        alignSelf:'center'
    },
    userScore: { fontSize: 40, alignSelf: 'center' },
    bar: {
        width: 1,
        borderRadius:10,
        height:'95%',
        backgroundColor:'black',
        opacity: .5,
        marginHorizontal: 20
    },
    bar2: {
        width: '90%',
        borderRadius:20,
        height:1,
        backgroundColor:'black',
        opacity: .5,
        marginVertical: '5%'
    }

});
export { ScoresScreen, AfterGameScreen };