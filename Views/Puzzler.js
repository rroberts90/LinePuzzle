import  React, {useState, useEffect, useRef} from 'react';
import { View,Text, StyleSheet, SafeAreaView, Animated, Easing } from 'react-native';
import {PuzzleHeader} from './Header';
import useInterval from "./useInterval";

import GlobalStyles from '../GlobalStyles'

const defaultBackground = GlobalStyles.defaultBackground.backgroundColor;
const defaultSize = 1;

const getScoring = (difficulty) => {
    const baseScoring = {'gold':60, 'silver':120,'brown':160};
    if(difficulty === 'moderate'){
        return {'gold':90, 'silver':150,'brown':300}
    }
    if(difficulty === 'hard') {
        return {'gold':180, 'silver':240,'brown':360}
    }

    return baseScoring;
}

const getGoalInfo = (time, difficulty) => {
    const scoring = getScoring(difficulty);
    if(time <= scoring['gold']){
        return {color: 'gold', time:scoring['gold'] }
    }
    else if(time <= scoring['silver']){
        return {color: 'silver', time:scoring['silver'] }
    }
    else if(time <= scoring['brown']) {
        return {color: 'brown', time:scoring['brown'] }
    }else {
        return {time: '', color: defaultBackground}
    }
}

const getStarColors = () => {
    return {gold: 'gold', brown: 'rgba(185, 114, 45,1)', silver: 'rgb(190,194,203)'}
}

const Puzzler = ({ info, time, setTime, navigation, level, board}) => {

    const [justWon, setJustWon] = useState(false); // hacky way to pause time right after puzzle finished
    const [levelDisplay, setLevelDisplay] = useState(()=> info.puzzleID); // shows the level. the level changes need to be delayed so they look cleaner

    useEffect(()=> setTime(info.savedTime || 0),[]); //reset time on start
    
    useEffect(()=> { // pause time after win 
        if(level > 0){
            setJustWon(true);
            setTimeout(()=> {
                setJustWon(false);           
                 setTime(0);
                 setLevelDisplay(info.puzzleID);
            }, 3500);
        }
    }, [level]);

    useInterval(()=>{ 

        if(!justWon) {
            setTime(t=> t+1);
        }

    }, 1000);
    return (
        <PuzzleHeader navigation = {navigation} info={info} time={time} getGoalInfo={getGoalInfo} level={level} levelDisplay={levelDisplay} board={board} /> 
 );   
}

export {getGoalInfo as getStar, getScoring,getStarColors};

export default Puzzler;