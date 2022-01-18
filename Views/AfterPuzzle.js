import React, { useEffect, useState } from 'react';

import { View, Text, Button, Image, TouchableOpacity, Pressable, StyleSheet, SafeAreaView} from 'react-native';
import colorScheme from '../Gameplay/ColorSchemes'

import { getItem, } from '../Storage';
import { PlayButton, BackButton} from './NavigationButtons';
import { InfoHeader } from './Header';

import GlobalStyles from '../GlobalStyles'

const defaultBackground = GlobalStyles.defaultBackground.backgroundColor;

const changeNames = (stars) =>{
    return stars.map(star=> {
        if(star==='gold'){
            return 'a'
        }
        if(star === 'silver'){
            return 'b'
        }else{
            return 'c'
        }
    })
}
const changeNamesBack = (stars) =>{
    return stars.map(star=> {
        if(star==='a'){
            return 'gold'
        }
        if(star === 'b'){
            return 'silver'
        }else{
            return 'brown'
        }
    })
}

const AfterPuzzleScreen = ({navigation, route}) => {
    const puzzleNumber = route.params.puzzleNumber;
    const [stars, setStars] =useState([]);

    useEffect(()=> {
        getItem('levelProgress').then(levelProgress=> {
            //  aliasing the trophy names into alphabetically ordered names. then just use javascript's built in sort
            const orderedStars = changeNamesBack(changeNames(levelProgress[puzzleNumber-1].stars).sort());

            setStars(orderedStars);
        });
    },[]);

    return (
    <View style={styles.container}>
        <InfoHeader navigation={navigation} title='' overrideDestination={'puzzles'}/>
        <Text style={styles.message}>Puzzle Pack {puzzleNumber} Complete!</Text>
        <View style={styles.starHolder}>
            {stars.map((star,ndx)=> <Image style={[styles.star, {tintColor: star}]} source={require('../Icons/star4.png')} key={ndx}/>)}
            {Array.from({length:20-stars.length}, (_,ndx)=> <Image style={[styles.star, {tintColor: 'black', opacity: .5}]} source={require('../Icons/star1.png')} key={ndx}/>)}
        </View>


    </View>);
}
//   <PuzzleButton navigation={navigation} disabled={false} toggleDisabled={() => null}   text={'play again'} boardSize={boardSize}/>

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'

    },
    starHolder:{
        width: '80%',
        height: '30%',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    star:{
        width: '18%',
        aspectRatio: 1,
        margin: '1%'
    },
    message: { 

        fontSize: 30,
        paddingVertical: '10%',
        letterSpacing: 1.5
    }
});
export default AfterPuzzleScreen;