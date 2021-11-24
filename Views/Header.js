import  React, { useEffect, useState } from 'react';
import { View,Text, StyleSheet, SafeAreaView, Animated } from 'react-native';
const defaultBackground = 'rgba(248,248,255,1)';

const Header = ({title1,item1,title2, item2, fontAnim}) => {
    const [loaded, setLoaded]= useState(false);
    useEffect((
    )=>  setLoaded(true),[]);
    return (
        <SafeAreaView style={styles.box2}>
        
       {loaded ? <View style={styles.duo}>
            <Text style={styles.header}>{title1} </Text>
            <Animated.View style={[styles.timetext, {transform: [{scale: fontAnim}]}]}>
                <Text style={styles.timetext}>{item1} </Text>
                </Animated.View>
        </View> : null }
        {loaded ?<View style={[styles.duo]}>
            <Text style={styles.header}>{title2} </Text>
            <Text style={styles.timetext}>{item2}</Text>
        </View> : null}
        <View style={{position: 'absolute', left: 0, bottom: 0, justifyContent: 'flex-start', alignItems: 'center', width:'100%'}}>
             <View style={styles.bar}/>        
        </View>

    </SafeAreaView>
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
        paddingHorizontal: 10,
        paddingBottom: 0,
        backgroundColor: defaultBackground,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
        
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
    }

});

export default Header;