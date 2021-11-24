import  React, {useState, useEffect} from 'react';
import { View, Text, Button, Image, TouchableOpacity, Pressable, StyleSheet, StatusBar, StatusBarStyle, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {getItem, initialize, storeItem} from './Storage'
import colorScheme from './Gameplay/ColorSchemes'
import Game from './Game'
import SettingsScreen from './Views/Settings'
import {ScoresScreen, AfterGameScreen} from './Views/Scores'
import useSound from './Sounds';
import { PlayButton, IconButton } from './Views/NavigationButtons';
import AboutScreen from './Views/AboutScreen'
const defaultBackground = 'rgba(248,248,255,1)';

function HomeScreen({ navigation }) {
    const [disabled, toggleDisabled]= useState(false);
   // const [board, toggleBoard] = useState(false);
    return (
        <SafeAreaView style={[styles.defaultBackground,{ flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={styles.headerText}> COLOR MAZE </Text>

            <PlayButton navigation = {navigation} title={'endless'} borderColor={colorScheme.one} disabled={disabled} toggleDisabled= {toggleDisabled}/>
            <PlayButton navigation = {navigation} title={'moves'} borderColor={colorScheme.two} disabled={disabled} toggleDisabled= {toggleDisabled}/>
            <PlayButton navigation = {navigation} title={'timed'} borderColor={colorScheme.three} disabled={disabled} toggleDisabled= {toggleDisabled}/>
            <View style={[ styles.row]} >
            <IconButton navigation={navigation} title={'Achievements'} borderColor={colorScheme.four} disabled={disabled} toggleDisabled={toggleDisabled} icon={require('./Icons/Trophy.png')} />

                <IconButton navigation={navigation} title={'Settings'} borderColor={colorScheme.four} disabled={disabled} toggleDisabled={toggleDisabled} icon={require('./Icons/Settings.png')} />


            </View>
        </SafeAreaView>

    );
}

function LoadingScreen({navigation}){
    const [tutorialFinished, setTutorialFinished] = useState(true);
    StatusBar.setBarStyle('dark-content');
    useEffect(()=> {getItem('tutorialFinished').then(tutorialFinished=> {
        if( tutorialFinished === null) { // new player
            console.log('go to tutorial');
            initialize();
            setTutorialFinished(false);
            //navigation.navigate('tutorial');
        } else{
            navigation.navigate('colorflush');

        }
    })}, []);

    return(
        <View style={styles.loadingScreen} >
            <Text style={{fontSize: 40}}> COLOR MAZE </Text>
            {!tutorialFinished ? 
            <View style={styles.tutorialAsk}>
                <PlayButton navigation={navigation} borderColor={colorScheme.four} disabled={false} toggleDisabled={()=>{}} title={'tutorial'} text={'go to tutorial'} />
                <PlayButton navigation={navigation} borderColor={colorScheme.one} disabled={false} toggleDisabled={()=>{storeItem('tutorialFinished', true)}} title={'colorflush'} text={'skip tutorial '} />

            </View> : null}
        </View>
    );
}

const Stack = createNativeStackNavigator();


function App() {
    // eslint-disable react/display-name
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerBackTitleVisible: false,
                headerStyle: {backgroundColor: defaultBackground},
                cardStyle: {backgroundColor: 'rgba(0,0,0,0)'}
            }}
            transitionerStyle={{backgroundColor: defaultBackground}}>
                <Stack.Screen name="loading" component={LoadingScreen} options={{
                    gestureEnabled: false,
                    headerShown: false
                }} />
                <Stack.Screen name="colorflush" component={HomeScreen} options={{
                    gestureEnabled: false,
                    headerShown: false
                }} />
                <Stack.Screen name="endless" component={Game} options={{
                    headerShown: false,
                    gestureEnabled: false
                }} />
                <Stack.Screen name="moves" component={Game} options={{
                    headerShown: false,
                    gestureEnabled: false
                }} />
                <Stack.Screen name="timed" component={Game} options={{
                    headerShown: false,
                    gestureEnabled: false
                }} />
                <Stack.Screen name="tutorial" component={Game} options={{
                    headerShown: false,
                    gestureEnabled: false
                }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{
                    headerShown: false,
                    gestureEnabled: false
                }}/>
                <Stack.Screen name="Achievements" component={ScoresScreen} options={{
                    headerShown: false,
                    gestureEnabled: false
                }}/>
                <Stack.Screen name="About" component={AboutScreen} options={{
                    headerShown: false,
                    gestureEnabled: false
                }}/>
                <Stack.Screen name="afterGame" component={AfterGameScreen} options={{
                    headerShown: false,
                    gestureEnabled: false
                }}/>


            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
   
    buttonText: {
        color: 'black',
        fontSize: 40,
        fontWeight: 'bold',
        alignSelf: 'stretch',
        opacity: .8
    },
    loadingScreen: {
        backgroundColor: defaultBackground,
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    defaultBackground: {backgroundColor:defaultBackground},
    iconButton: {
        borderWidth: 7,
        borderRadius: 15,
        alignSelf: 'stretch',
        width: '45%',
        marginHorizontal: 10,
        marginVertical: 20,
        padding: 5
    },
    icon:{
        height: 45, 
        width: 45,
        alignSelf: 'center',
        tintColor: 'black',
        opacity: .65
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width:'60%',
        alignItems: 'stretch'


    }, 
    play: {
        width:'18%',
        aspectRatio: 1,
        marginRight: 10
    }, 
    headerText: { 

        fontSize: 35,
        fontWeight: 'bold',
        letterSpacing: 1.25,
        marginVertical: '8%',
        color: 'rgba(30,30,30,.8)'
        

    },
    toggle: {
        borderRadius: 2,
        borderWidth: 7,
        borderColor: colorScheme.four,

    },
    toggleText: {
        fontSize:35, 
        padding: 10,
        color: 'black',

    },
    selected: {

    },
    tutorialAsk: {
        alignSelf: 'center',
        borderRadius: 10,
        borderWidth: 0,
        padding: '5%',
        marginTop: '10%',
        alignItems: 'center',
        justifyContent: 'center'

    },
    skip1: {

    }
});


export default App;