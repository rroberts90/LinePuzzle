import  React from 'react';
import { View,Text, StyleSheet, SafeAreaView } from 'react-native';
const defaultBackground = 'rgba(248,248,255,1)';

const Header = ({title1,item1,title2, item2}) => {

    return (
        <SafeAreaView style={styles.box2}>

        <View style={styles.duo}>
            <Text style={styles.header}>{title1} </Text>
            <Text style={styles.timetext}>{item1}</Text>
        </View>
        <View style={[styles.duo]}>
            <Text style={styles.header}>{title2} </Text>
            <Text style={styles.timetext}>{item2}</Text>
        </View>
        <View style={{position: 'absolute', left: 0, bottom: 0, justifyContent: 'flex-start', alignItems: 'center', width:'100%'}}>
             <View style={styles.bar}/>        
        </View>

    </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    duo: {
        flexDirection:'row'
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
        alignSelf: 'center',
        opacity: .6,
        marginBottom: 5

    },
    timetext: {
       fontSize: 25,
       opacity: .7,
       alignSelf: 'center',
 
       marginBottom: 5
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