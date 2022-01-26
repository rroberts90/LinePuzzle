import React, { useEffect, useState,useRef } from 'react';

import { View, Text, Button, Image, TouchableOpacity, Pressable, StyleSheet, Animated, Easing} from 'react-native';
import colorScheme from '../Gameplay/ColorSchemes'

import { getItem, } from '../Storage';
import { PlayButton, BackButton} from './NavigationButtons';
import { InfoHeader } from './Header';
import useSound from '../Sounds';
import useInterval from './useInterval.js';

import GlobalStyles from '../GlobalStyles'
import {getScoring,getStarColors} from './Puzzler'
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
    const colors = getStarColors();
    return stars.map(star=> {
        if(star==='a'){
            return colors['gold']
        }
        if(star === 'b'){
            return colors['silver']
        }else{
            return colors['brown']
        }
    })
}

const DelayInterval = 400;
const Star = ({color,  num}) => {
    const sizeAnim = useRef(new Animated.Value(0)).current;
    const delay = num* DelayInterval;
    //const {play}= useSound();

    useEffect(()=>{
        Animated.sequence([
            Animated.timing(sizeAnim, {
                toValue: 2,
                isInteraction: false,
                useNativeDriver: true,
                duration: 500,
                delay: delay,
                easing: Easing.in(Easing.quad)
            }),
            Animated.timing(sizeAnim, {
                toValue: 1,
                isInteraction: false,
                useNativeDriver: true,
                duration: 500,
                easing: Easing.out(Easing.quad)
            })           
         ]).start(onFinish=> {
            //play('button')
         });


    },[]);
    return (
        <View style = {styles.star}>
            <Image style={[styles.star,styles.starOutline, {tintColor: 'black', opacity: .5}]} source={require('../Icons/star1.png')} />
            <Animated.Image style={[{width:'100%',height:'100%',tintColor: color ,transform: [{scale: sizeAnim}]}]} source={require('../Icons/star4.png')} />
        </View>
    );
}

const ScoreInfo = ({difficulty}) => {
    const scoreInfo = getScoring(difficulty);
    const colors = getStarColors();
    return (
    <>
    <View style={styles.starInfo}>
            <Image style={[styles.star,{tintColor: colors['gold'], opacity: 1}]} source={require('../Icons/star4.png')} />
            
            <Image style={[styles.star,{tintColor: colors['silver'], opacity: 1}]} source={require('../Icons/star4.png')} />
            <Image style={[styles.star,{tintColor: colors['brown'], opacity: 1}]} source={require('../Icons/star4.png')} />

    </View>
    <View style={styles.starInfo}>
        <Text  style={[styles.star, styles.starText]}>{scoreInfo['gold']} s</Text>
        <Text style={[styles.star, styles.starText]}>{scoreInfo['silver']} s</Text>
        <Text style={[styles.star, styles.starText]}>{scoreInfo['brown']} s</Text>

    </View>
    </>
    );
}

const AfterPuzzleScreen = ({navigation, route}) => {
    const {puzzleNumber, difficulty} = route.params;
    const title = route.params.title;
    const [stars, setStars] =useState([]);
    const {play}= useSound();

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
        <Text style={styles.message}>{title} Complete!</Text>
        <View style={styles.starHolder}>
            {stars.map((star,ndx)=> <Star color={star} key={ndx} num={ndx+1}/>)}
            {Array.from({length:10-stars.length}, (_,ndx)=> <Image style={[styles.star, {tintColor: 'black', opacity: .5}]} source={require('../Icons/star1.png')} key={ndx}/>)}
        </View>
        <ScoreInfo difficulty={difficulty}/>



    </View>);
}
//   <PuzzleButton navigation={navigation} disabled={false} toggleDisabled={() => null}   text={'play again'} boardSize={boardSize}/>

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%'

    },
    starHolder:{
        width: '80%',
        height: '30%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 3
    },
    star:{
        width: '18%',
        aspectRatio: 1,
        margin: '1%'
    },
    starOutline:{
        position: 'absolute',
        width:'100%',
        height:'100%',

    },
    starOutline2:{
        width: '15%',
        margin: '2.5%',

    },
    message: { 
        fontSize: 30,
        marginTop: '30%',
        letterSpacing: 1.5,
        opacity: .7,
        flex: 1
    },
    starInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    starText: {
        textAlign: 'center'
    }
});
export default AfterPuzzleScreen;