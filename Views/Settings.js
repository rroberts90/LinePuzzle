
import  React, {useState, useEffect} from 'react';

import { View, Text, Button, Image, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import colorScheme from '../Gameplay/ColorSchemes'
import useSound from '../Sounds';

import {clearAll, storeItem, getSettings} from '../Storage'
import { BackButton } from './NavigationButtons';

import { getGlyphSource, getAnimalSource, getSymbolSource, getImpossibleSource } from './Symbols';
const defaultBackground = 'rgba(248,248,255,1)';

const DisplayImage = ({source}) => {
    return <Image style={styles.iconSmall} source={source}/>;
}

function SettingsScreen({navigation, route}) {
    const color  = colorScheme.four;

    const [soundOn, toggleSound] = useState(null);
    const [vibrate, toggleVibrate] = useState(null);

    const [difficulty, setDifficulty] = useState(null);

    const [display, setDisplay] = useState(null);

    const {play} = useSound();

    useEffect(() => {
        getSettings().then(settings => {
            const d = settings[0][1];

            const s = settings[1][1];
            const v = settings[2][1];
            const d2 = settings[3][1];

            setDifficulty(parseInt(d));
            setDisplay(d2? d2.replace(/"/g, '') : 'shapes');

            toggleSound(s === 'true' ? true : false);
            toggleVibrate(v === 'true'? true : false);



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

    return (
        <View style={styles.container}>
             <Text style={styles.topHeader}> Settings </Text>

            <Text style={styles.headerText}> Difficulty </Text>
            <View style={{flexDirection:'row'}}> 
                <Pressable style={[styles.toggle, styles.toggleLeft, styles.toggleColorTwo]} onPress={()=> {play('connect');setDifficulty(1)}}>
                    <View style={difficulty===1 ? styles.selectedOne : null}/>
                    <Text style={styles.difficultyText}>easy</Text>
                </Pressable>
                <Pressable style={[styles.toggle, styles.toggleColorTwo, styles.toggleMid]} onPress={()=> {play('connect'); setDifficulty(2)}}>
                    <View style={difficulty===2 ? styles.selectedOne: null}/>
                    <Text style={styles.difficultyText}>normal</Text>
                </Pressable>
                <Pressable style={[styles.toggle, styles.toggleRight, styles.toggleColorTwo]} onPress={()=> {play('connect'); setDifficulty(3)}}>
                    <View style={difficulty==3 ?  styles.selectedOne :  null}/>
                    <Text style={styles.difficultyText}>hard</Text>
                </Pressable>
            </View>
            <View style={styles.bar}/>        

            <Text style={styles.headerText}> Sound </Text>
            <View style={{flexDirection:'row'}}> 
                <Pressable style={[styles.toggle, styles.toggleLeft]} onPress={()=> {toggleSound(true);play('connect'); }}>
                    <View style={soundOn ? styles.selectedTwo : null}/>
                    <Text style={styles.toggleText}>on</Text>
                </Pressable>
                <Pressable style={[styles.toggle, styles.toggleRight]} onPress={()=> { toggleSound(false)}}>
                    <View style={soundOn ? null : styles.selectedTwo}/>

                    <Text style={styles.toggleText}>off</Text>
                </Pressable>
            </View>
            <View style={styles.bar}/>        

            <Text style={styles.headerText}> Vibrate </Text>
            <View style={{flexDirection:'row'}}> 
                <Pressable style={[styles.toggle, styles.toggleLeft,styles.toggleColorThree]} onPress={()=> {play('connect'); toggleVibrate(true)}}>
                    <View style={vibrate ? styles.selectedThree : null}/>
                    <Text style={styles.toggleText}>on</Text>
                </Pressable>
                <Pressable style={[styles.toggle, styles.toggleRight, styles.toggleColorThree]} onPress={()=> {play('connect'); toggleVibrate(false)}}>
                    <View style={vibrate ? null : styles.selectedThree}/>

                    <Text style={styles.toggleText}>off</Text>
                </Pressable>
            </View>
            <View style={styles.bar}/>        

            <Text style={styles.headerText}> Display </Text>

            <View style={{flexDirection:'row'}}> 
                <Pressable style={[styles.toggle, styles.toggleLeft,styles.toggleColorFour, styles.iconContainer ]} onPress={()=> {play('connect');setDisplay('shapes')}}>
                    <View style={display==='shapes' ? styles.selectedFour : null}/>
                    <DisplayImage source={getSymbolSource(1)}/>
                    <DisplayImage source={getSymbolSource(2)}/>
                    <DisplayImage source={getSymbolSource(3)}/>
                    <DisplayImage source={getSymbolSource(4)}/>


                </Pressable>
                <Pressable style={[styles.toggle, styles.toggleColorFour,  styles.iconContainer]} onPress={()=> {play('connect'); setDisplay('impossible')}}>
                    <View style={display==='impossible' ? styles.selectedFour: null}/>
                    <DisplayImage source={getImpossibleSource(1)}/>
                    <DisplayImage source={getImpossibleSource(2)}/>
                    <DisplayImage source={getImpossibleSource(3)}/>
                    <DisplayImage source={getImpossibleSource(4)}/>

                </Pressable>
                <Pressable style={[styles.toggle, styles.toggleColorFour, styles.iconContainer]} onPress={()=> {play('connect'); setDisplay('glyphs')}}>
                    <View style={display==='glyphs' ?  styles.selectedFour :  null}/>
                    <DisplayImage source={getGlyphSource(1)}/>
                    <DisplayImage source={getGlyphSource(2)}/>
                    <DisplayImage source={getGlyphSource(3)}/>
                    <DisplayImage source={getGlyphSource(4)}/>
                </Pressable>
                <Pressable style={[styles.toggle, styles.toggleRight, styles.toggleColorFour,styles.iconContainer]} onPress={()=> {play('connect'); setDisplay('seaAnimal')}}>
                    <View style={display==='seaAnimal' ?  styles.selectedFour :  null}/>
                    <DisplayImage source={getAnimalSource(1)}/>
                    <DisplayImage source={getAnimalSource(2)}/>
                    <DisplayImage source={getAnimalSource(3)}/>
                    <DisplayImage source={getAnimalSource(4)}/>
                </Pressable>
            </View>

            <Text> Version .9 </Text>
            <Button title='Clear User Data' style={{marginTop:100}} onPress={()=> clearAll()}/>
            <BackButton onPress={()=>{play('paper');navigation.navigate('colorflush')}} />
            </View>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: defaultBackground
},
topHeader: {
    fontSize: 40,
    position: 'absolute',
    top: '5%'
},

headerText: { 
    fontSize: 25,
    marginTop: 10
},
toggle: {
    borderWidth: 7,
    borderColor: colorScheme.two,
    marginBottom: 10,
},
toggleColorTwo:{
    borderColor: colorScheme.one
},
toggleColorThree: {
    borderColor: colorScheme.three
},
toggleColorFour: {
    borderColor: colorScheme.four
},

toggleLeft: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius:15,
    borderRightWidth: 3.5
},
toggleMid: {
    borderLeftWidth: 3.5,
    borderRightWidth: 3.5,
    marginLeft:-.5,
    borderRadius:0
},
toggleRight: {
    borderTopRightRadius: 15,
    borderBottomRightRadius:15,
    borderLeftWidth: 3.5,
},
toggleText: {
    fontSize:30, 
    padding: 5,
    color: 'black',
    alignSelf: 'center'

},
difficultyText: {
    fontSize:30, 
    padding: 5,
    color: 'black',
    alignSelf:'center'

},
selectedThree: {
    position: 'absolute',
    opacity: .5,
    backgroundColor: colorScheme.three,
    width:'100%',
    height: '100%'
},
selectedTwo: {
    position: 'absolute',
    opacity: .5,
    backgroundColor: colorScheme.two,
    width:'100%',
    height: '100%'
},
selectedOne:
{
    position: 'absolute',
    opacity: .5,
    backgroundColor: colorScheme.one,
    width:'100%',
    height: '100%'
},
selectedFour:
{
    position: 'absolute',
    opacity: .5,
    backgroundColor: colorScheme.four,
    width:'100%',
    height: '100%'
},
iconSmall: {
    width: 25,
    height: 25
},
iconIconContainer:{
    flexDirection:'row', flexWrap: 'wrap', width: 140
},
iconContainer: 
    {width:65,flexDirection:'row', flexWrap: 'wrap'},
 bar: {
        width: '90%',
        borderRadius:20,
        height:1,
        backgroundColor:'black',
        opacity: .5
    }


});

export default SettingsScreen;