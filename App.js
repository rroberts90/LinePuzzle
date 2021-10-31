import  React, {useState} from 'react';
import { View, Text, Button, Image, TouchableOpacity, Pressable, StyleSheet, StatusBar, StatusBarStyle } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {getItem, initialize} from './Storage'
import colorScheme from './Gameplay/ColorSchemes'
import Game from './Game'
import SettingsScreen from './Views/Settings'
import ScoresScreen from './Views/Scores'

const defaultBackground = 'rgba(248,248,255,1)';

  
const PlayButton = ({navigation, title, disabled, toggleDisabled, borderColor})=> {
    return (
        <TouchableOpacity
        style={[styles.menuButton, {borderColor: borderColor}]}
        onPress={() => {
            toggleDisabled(true)
            navigation.navigate(title);
            setTimeout(()=> toggleDisabled(false), 500);

        }}
        disabled={disabled}
    >
        <Image style={[styles.play, {tintColor:borderColor, opacity: .8}]} source = {require('./Icons/play1.png')}/>
    <Text style={styles.buttonText}>{title} </Text>
    </TouchableOpacity>
    );
}
const IconButton = ({navigation, title, disabled, toggleDisabled, borderColor, icon})=> {
    return (
        <TouchableOpacity
            style={[styles.iconButton,{ borderColor: borderColor }]}
            onPress={() => {
                toggleDisabled(true)
                navigation.navigate(title);
                setTimeout(() => toggleDisabled(false), 500);

            }}
            disabled={disabled}
        >
            <Image style={styles.icon} source={icon} />
        </TouchableOpacity>
    );
}




function HomeScreen({ navigation }) {
    const [disabled, toggleDisabled]= useState(false);

    return (
        <View style={[styles.defaultBackground,{ flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
            <PlayButton navigation = {navigation} title={'endless'} borderColor={colorScheme.one} disabled={disabled} toggleDisabled= {toggleDisabled}/>
            <PlayButton navigation = {navigation} title={'timed'} borderColor={colorScheme.two} disabled={disabled} toggleDisabled= {toggleDisabled}/>
            <PlayButton navigation = {navigation} title={'puzzle'} borderColor={colorScheme.three} disabled={disabled} toggleDisabled= {toggleDisabled}/>
            <View style={[ styles.row]} >
                <IconButton navigation={navigation} title={'Achievements'} borderColor={colorScheme.four} disabled={disabled} toggleDisabled={toggleDisabled} icon={require('./Icons/Trophy.png')} />
                <IconButton navigation={navigation} title={'Settings'} borderColor={colorScheme.four} disabled={disabled} toggleDisabled={toggleDisabled} icon={require('./Icons/Settings.png')} />

            </View>
        </View>

    );
}

function LoadingScreen({navigation}){
    StatusBar.setBarStyle('dark-content');
    getItem('tutorialFinished').then(tutorialFinished=> {
        if( tutorialFinished === null) { // new player
            console.log('go to tutorial');
            initialize();

            navigation.navigate('tutorial');
        } else{
            navigation.navigate('colorflush');

        }
    });

    return(
        <View style={styles.loadingScreen} >
            <Text style={{fontSize: 40}}> COLOR MAZE </Text>
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
                headerStyle: {backgroundColor: defaultBackground}
            }}>
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
                <Stack.Screen name="puzzle" component={Game} options={{
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
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Achievements" component={ScoresScreen} />


            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    menuButton: {
        borderWidth: 7,
        alignItems:'center',
        justifyContent: 'flex-start',
        alignSelf:'center',
        marginVertical: 20,
        padding: 5,
        borderRadius: 15,
        width: '60%',
        flexDirection: 'row'
    },
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
        fontSize: 30
    },
    toggle: {
        borderRadius: 2,
        borderWidth: 7,
        borderColor: colorScheme.four,

    },
    toggleText: {
        fontSize:30, 
        padding: 10,
        color: 'black',

    },
    selected: {

    }
});


export default App;