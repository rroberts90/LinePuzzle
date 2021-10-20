import  React, {useState} from 'react';
import { View, Text, Button, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Game from './Game'

function HomeScreen({ navigation }) {
    const [disabled, toggleDisabled]= useState(false);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => {
                    toggleDisabled(true)
                    navigation.navigate('Endless');
                    setTimeout(()=> toggleDisabled(false), 500);

                }}
                disabled={disabled}
            >
            <Text style={styles.buttonText}>Endless </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuButton}

                onPress={() => {
                    toggleDisabled(true)

                    navigation.navigate('Puzzle');
                    setTimeout(()=> toggleDisabled(false), 500);

                }}
                disabled={disabled}

            >      
                        <Text style={styles.buttonText}>Puzzle </Text>
      </TouchableOpacity>

            <TouchableOpacity
            style={styles.menuButton}
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
              <Text style={styles.buttonText}>Settings </Text>
       
              </TouchableOpacity>

        </View>
    );
}
function SettingsScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Settings</Text>
        </View>
    );
}

const Stack = createNativeStackNavigator();

function LogoTitle() {
    return (
        <Image
            style={{ width: 50, height: 50 }}
            source={require('./Icons/Eye1.png')}
        />
    );
}


function App() {
    // eslint-disable react/display-name
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerBackImageSource: require('./Icons/previous.png'),
                headerBackTitleVisible: false

            }}>

                <Stack.Screen name="ColorFlush" component={HomeScreen} options={{
                }} />
                <Stack.Screen name="Endless" component={Game} options={{
                    headerShown: false
                }} />
                <Stack.Screen name="Puzzle" component={Game} options={{
                    headerShown: false
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
        backgroundColor:'lightgrey',
        borderWidth: 1,
        alignItems:'center',
        alignSelf:'center',
        marginVertical: 20,
        padding: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        width: '75%'

    },
    buttonText: {
        color: 'black',
        fontSize: 40,
        fontWeight: 'bold'
    }
});


export default App;