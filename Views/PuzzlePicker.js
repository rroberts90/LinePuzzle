import  React, {useState, useEffect} from 'react';
import {ScrollView, View, StyleSheet } from 'react-native';
import { InfoHeader } from './Header';

import { PuzzleButton } from './NavigationButtons';
import { getItem } from '../Storage';

const packInfo = require('../PremadeBoardStuff/Output/packInfo.json');

const PuzzlePicker = ({navigation, route}) => {
    const [disabled, toggleDisabled]= useState(false);
    const [progress, setProgress]  = useState([]);
    const [renderOnArrival, setROA]  = useState(0);

    if(route.params.updateProgress) {
        route.params.updateProgress = false;
        setROA(count=> count+1);

    }

    useEffect(()=> {
        getItem('levelProgress').then(levelProgress=>{
            setProgress(levelProgress);
        });
        
    },[renderOnArrival]);

    //setupPuzzles()
    const count = packInfo.count;

    return (<View style={styles.container}>
        <InfoHeader title={'Puzzles'} navigation= {navigation}/>
        <ScrollView style={styles.list}>
        {Array.from({length: count}, (_, ndx)=>ndx).map(number=>  {
            const puzzleProgress = progress[number] ? progress[number].progress : 0
            return <PuzzleButton navigation= {navigation} title={'puzzle'} info={{...packInfo.levels[number], initialProgress: puzzleProgress}} disabled = {disabled} toggleDisabled={toggleDisabled} key={number}/>
            } 
        )}
        </ScrollView>
    </View>);

}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        flexDirection: 'column',
         paddingTop: '25%'
},
 list:{
     flex:1,
     height: '100%'
 }
    
});

export default PuzzlePicker;