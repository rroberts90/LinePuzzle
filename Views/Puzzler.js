import  React, {useState, useEffect, useRef} from 'react';
import { View,Text, StyleSheet, SafeAreaView, Animated, Easing } from 'react-native';
import {PuzzleHeader} from './Header';
import useInterval from "./useInterval";

import GlobalStyles from '../GlobalStyles'

const defaultBackground = GlobalStyles.defaultBackground.backgroundColor;
const defaultSize = 1;

const getScoring = (difficulty) => {
    const baseScoring = {'gold':60, 'silver':120,'brown':300};
    return baseScoring;
}


const getGoalInfo = (time) => {
    const scoring = getScoring();
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


const Puzzler = ({ info, time, setTime, navigation}) => {

    useEffect(()=> setTime(0),[]);
    useInterval(()=>{

        setTime(t=> t+1);

    }, 1000);
    return (
        <PuzzleHeader navigation = {navigation} info={info} time={time} getGoalInfo={getGoalInfo}/> 
 );   
}

export {getGoalInfo as getStar};

export default Puzzler;