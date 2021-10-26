import  React, {useState} from 'react';
import { View, Text, Button, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import colorScheme from './Gameplay/ColorSchemes'
import Game from './Game'

const defaultBackground = 'rgba(248,248,255,1)';
function HomeScreen({ navigation }) {
    const [disabled, toggleDisabled]= useState(false);

    return (
        <View style={[styles.defaultBackground,{ flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
            <TouchableOpacity
                style={[styles.menuButton, {borderColor: colorScheme.one}]}
                onPress={() => {
                    toggleDisabled(true)
                    navigation.navigate('Endless');
                    setTimeout(()=> toggleDisabled(false), 500);

                }}
                disabled={disabled}
            >
            <Text style={styles.buttonText}>endless </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.menuButton, {borderColor: colorScheme.two}]}

                onPress={() => {
                    toggleDisabled(true)

                    navigation.navigate('Puzzle');
                    setTimeout(()=> toggleDisabled(false), 500);

                }}
                disabled={disabled}

            >      
                        <Text style={styles.buttonText}>puzzle </Text>
      </TouchableOpacity>

            <TouchableOpacity
            style={[styles.menuButton, {borderColor: colorScheme.three}]}
                onPress={() => {
                    toggleDisabled(true)

                    navigation.navigate('Settings', {
                        itemId: 86,
                        otherParam: 'whatever'
                    });
                    setTimeout(()=> toggleDisabled(false), 500);

                }}
                disabled={disabled}

            >   
              <Text style={styles.buttonText}>settings </Text>
       
              </TouchableOpacity>

        </View>
    );
}
function SettingsScreen() {
    return (
        <View style={[styles.defaultBackground,{ flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
            <Text>Settings</Text>
        </View>
    );
}

const Stack = createNativeStackNavigator();


function App() {
    // eslint-disable react/display-name
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerBackImageSource: require('./Icons/previous.png'),
                headerBackTitleVisible: false,
                headerStyle: {backgroundColor: defaultBackground}
            }}>

                <Stack.Screen name="ColorFlush" component={HomeScreen} options={{
                    gestureEnabled: false
                }} />
                <Stack.Screen name="Endless" component={Game} options={{
                    headerShown: false,
                    gestureEnabled: false
                }} />
                <Stack.Screen name="Puzzle" component={Game} options={{
                    headerShown: false,
                    gestureEnabled: false
                }} />
                <Stack.Screen name="Tutorial" component={Game} options={{
                    headerShown: false
                }} />
                <Stack.Screen name="Settings" component={SettingsScreen} />


            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    menuButton: {
        borderWidth: 7,
        alignItems:'center',
        alignSelf:'center',
        marginVertical: 20,
        padding: 5,
        paddingHorizontal: 30,
        borderRadius: 15,
        width: '60%'

    },
    buttonText: {
        color: 'black',
        fontSize: 40,
        fontWeight: 'bold'
    },
    defaultBackground: {backgroundColor:defaultBackground}
});


export default App;