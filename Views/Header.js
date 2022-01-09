import  React, { useEffect, useState } from 'react';
import { View,Text, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { BackButton } from './NavigationButtons';
const defaultBackground = 'rgba(248,248,255,1)';

const Header = ({title1,item1,title2, item2, fontAnim, navigation}) => {
    const [loaded, setLoaded]= useState(false);
    useEffect(()=> {setTimeout(()=>setLoaded(true), 10)},
     []);
    return (
        <View style={styles.box2}>
         {loaded ? <BackButton navigation= {navigation}/> : null}
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
const InfoHeader = ({navigation, title}) => {
    return (
    <View style={styles.box3}>
         <BackButton navigation= {navigation}/>
         <Text style={styles.title}>{title} </Text>
         <View style={{position: 'absolute', left: 0, bottom: 0, justifyContent: 'flex-start', alignItems: 'center', width:'100%'}}>
             <View style={styles.bar}/>        
        </View>
            </View>
    );
}
const styles = StyleSheet.create({
    duo: {
        flexDirection:'row',
        alignItems: 'center'
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
        height: '10%',
        width: '100%',
        backgroundColor: defaultBackground,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: 5
        
        
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

});
export {InfoHeader};
export default Header;