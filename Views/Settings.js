
import  React, {useState, useEffect} from 'react';

import { View, Text, Button, Image, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import colorScheme from '../Gameplay/ColorSchemes'

import {clearAll, storeItem, getSettings} from '../Storage'

const defaultBackground = 'rgba(248,248,255,1)';

function SettingsScreen({navigation, route}) {
    const color  = colorScheme.four;

    const [soundOn, toggleSound] = useState(null);
    const [vibrate, toggleVibrate] = useState(null);

    const [difficulty, setDifficulty] = useState(null);

    useEffect(() => {
        getSettings().then(settings => {
            console.log('getting settings');
            const d = settings[0][1];
            console.log(d);

            const s = settings[1][1];
            const v = settings[2][1];

            setDifficulty(parseInt(d));
            toggleSound(s === 'true' ? true : false);
            toggleVibrate(v === 'true'? true : false);

        }).catch(e => console.log(e));
    }, []);

    useEffect(() => {
        if (difficulty !== null) {
            console.log('storing difficulty');
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


    return (
        <View style={styles.container}>
            
            <Text style={styles.headerText}> Difficulty </Text>
            <View style={{flexDirection:'row'}}> 
                <Pressable style={[styles.toggle, styles.toggleLeft, styles.toggleColorTwo]} onPress={()=> {setDifficulty(1)}}>
                    <View style={difficulty===1 ? styles.selectedOne : null}/>
                    <Text style={styles.difficultyText}>easy</Text>
                </Pressable>
                <Pressable style={[styles.toggle, styles.toggleColorTwo, styles.toggleMid]} onPress={()=> {setDifficulty(2)}}>
                    <View style={difficulty===2 ? styles.selectedOne: null}/>
                    <Text style={styles.difficultyText}>normal</Text>
                </Pressable>
                <Pressable style={[styles.toggle, styles.toggleRight, styles.toggleColorTwo]} onPress={()=> {setDifficulty(3)}}>
                    <View style={difficulty==3 ?  styles.selectedOne :  null}/>
                    <Text style={styles.difficultyText}>hard</Text>
                </Pressable>
            </View>

            <Text style={styles.headerText}> Sound </Text>
            <View style={{flexDirection:'row'}}> 
                <Pressable style={[styles.toggle, styles.toggleLeft]} onPress={()=> {toggleSound(true)}}>
                    <View style={soundOn ? styles.selectedTwo : null}/>
                    <Text style={styles.toggleText}>on</Text>
                </Pressable>
                <Pressable style={[styles.toggle, styles.toggleRight]} onPress={()=> {toggleSound(false)}}>
                    <View style={soundOn ? null : styles.selectedTwo}/>

                    <Text style={styles.toggleText}>off</Text>
                </Pressable>
            </View>

            <Text style={styles.headerText}> Vibrate </Text>
            <View style={{flexDirection:'row'}}> 
                <Pressable style={[styles.toggle, styles.toggleLeft,styles.toggleColorThree]} onPress={()=> {toggleVibrate(true)}}>
                    <View style={vibrate ? styles.selectedThree : null}/>
                    <Text style={styles.toggleText}>on</Text>
                </Pressable>
                <Pressable style={[styles.toggle, styles.toggleRight, styles.toggleColorThree]} onPress={()=> {toggleVibrate(false)}}>
                    <View style={vibrate ? null : styles.selectedThree}/>

                    <Text style={styles.toggleText}>off</Text>
                </Pressable>
            </View>
           
           
            <Button title='clear' style={{marginTop:100}} onPress={()=> clearAll()}/>
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
headerText: { 
    fontSize: 40,
    margin: 5
},
toggle: {
    borderWidth: 7,
    borderColor: colorScheme.two,
    marginBottom: 50,


},
toggleColorTwo:{
    borderColor: colorScheme.one
},
toggleColorThree: {
    borderColor: colorScheme.three
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
    padding: 10,
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
}
});

export default SettingsScreen;