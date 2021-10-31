import  React, {useState} from 'react';

import { View, Text, Button, Image, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import colorScheme from '../Gameplay/ColorSchemes'

import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { getItem } from '../Storage';
const defaultBackground = 'rgba(248,248,255,1)';

function ScoresScreen({navigation}) {
    const [puzzles, setPuzzles] = useState('-');
    const [timed, setTimed] = useState('-');
    getItem('puzzles').then(val=>{
        if(val && val > 0){
        setPuzzles(val);
    }
    });
    getItem('timedScore').then(val=>{
        if(val && val > 0){
        setTimed(val);
    }
    });

    return (
        <View style={[{ flex: 1, flexDirection:'column',alignItems: 'center', justifyContent: 'flex-start',backgroundColor: defaultBackground }]}>
            <View style={{flexDirection:'column', marginTop:'20%'}}>
                <Text style={styles.header}>Puzzles Done</Text>
                <Text style={styles.userScore}> {puzzles}</Text>
            </View>
            <View style={{flexDirection:'column',marginTop:'20%'}}>
                <Text style={styles.header}>Best Timed Score</Text>
                <Text style={styles.userScore}> {timed} </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {fontSize:30},
    userScore: {fontSize: 40, alignSelf: 'center'}

});
export default ScoresScreen;