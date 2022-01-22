import  React, { useEffect, useState } from 'react';
import { View,Text, StyleSheet, SafeAreaView, Animated, Image } from 'react-native';
import { BackButton } from './NavigationButtons';
import GlobalStyles from '../GlobalStyles'

const defaultBackground = GlobalStyles.defaultBackground.backgroundColor;

const Header = ({title1,item1,title2, item2, fontAnim, navigation}) => {
    return (
        <View style={styles.box2}>
<BackButton navigation= {navigation}/> 
<View style={styles.duo}>
            <Text style={styles.header}>{title1} </Text>
            <Animated.View style={[styles.timetext, {transform: [{scale: fontAnim}]}]}>
                <Text style={styles.timetext}>{item1} </Text>
                </Animated.View>
        </View> 
        <View style={[styles.duo]}>
            <Text style={styles.header}>{title2} </Text>
            <Text style={styles.timetext}>{item2}</Text>
        </View> 
        <View style={{position: 'absolute', left: 0, bottom: 0, justifyContent: 'flex-start', alignItems: 'center', width:'100%'}}>
             <View style={styles.bar}/>        
        </View>

    </View>
    );
}

const InfoHeader = ({navigation, title, overrideDestination}) => {
    
    return (
    <View style={styles.box3}>
         <BackButton navigation= {navigation} overrideDestination={overrideDestination}/>
         <Text style={styles.title}>{title} </Text>
         <View style={{position: 'absolute', left: 0, bottom: 0, justifyContent: 'flex-start', alignItems: 'center', width:'100%'}}>
             <View style={styles.bar}/>        
        </View>
            </View>
    );
}

const PuzzleHeader = ({ navigation,time,info, getGoalInfo }) => {
    const goalInfo = getGoalInfo(time)
    //                <Text style={[styles.timetext, {alignSelf:'flex-end'}]}> {goalInfo.time} s</Text>

    return (
        <View style={styles.box3}>
           
            <BackButton navigation={navigation} overrideDestination={'puzzles'} />
           
            <View style={styles.duo}>
                <Text style={styles.header}>#</Text>
                <Text style={styles.timetext}>{info.puzzleID} </Text>
            </View>
            <View style={styles.duo}>
                <Image style={[styles.star, {tintColor: goalInfo.color}]} source={require('../Icons/star3.png')}/>
            </View>
            <View style={styles.duo}>
                <Text style={styles.timetext}>{time} s</Text>
            </View>

            <View style={{ position: 'absolute', left: 0, bottom: 0, justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                <View style={styles.bar} />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    duo: {
        flexDirection:'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'

    },
    box2: {
        position:'absolute',
        width: '100%',
        height: '10%',
        top:0,
        backgroundColor: defaultBackground,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        paddingBottom: 5
    },
    box3: {
        position: 'absolute',

        height: '10%',
        width: '100%',
        backgroundColor: defaultBackground,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 5,
        top: 0,
        
        
    },
    header: {
        fontSize: 16,
        letterSpacing: 1,
        opacity: .6,


    },
    timetext: {
       fontSize: 23,
       opacity: .7,
     
    },
    bar: {
        width: '95%',
        borderRadius:10,
        height:2,
        backgroundColor:'black',
        opacity: .5,
        alignSelf: 'center'
    },
    title: {
        fontSize: 25,
        opacity: .8
    },
    star: {
        height: 40,
        width: 40
    }

});
export {InfoHeader, PuzzleHeader};
export default Header;