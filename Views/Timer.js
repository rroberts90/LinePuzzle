import  React, {useState, useEffect} from 'react';
import { View,Text, StyleSheet } from 'react-native';

import useInterval from "./useInterval";

const defaultStartTime = 60;
const defaultBackground = 'rgba(248,248,255,1)';

const Timer = ({onFinish, completed, level}) => {
    const [time, setTime] = useState(defaultStartTime);
    //const [score, setScore] = useState(0);

    useInterval(()=>{
        if(time <=0) {
            onFinish(level);
        }
        setTime(t=> t-1);

    }, 1000);
    return (
     <View style={styles.box}>
         <View style={styles.duo}>
             <Text style={styles.header}>time </Text>
             <Text style={styles.timetext}>{time}</Text>
         </View>
         <View style={[styles.duo]}>
             <Text style={styles.header}>score </Text>
             <Text style={styles.timetext}>{completed}</Text>
         </View>
     </View>
 );   
}

const styles = StyleSheet.create({
    duo: {
        flexDirection:'row'
    },
    box: {
        position: 'absolute',
        top: '6%',
        alignSelf: 'center',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,.5)',
        opacity: 1,
        paddingHorizontal: 10,
        paddingVertical: 2,
        backgroundColor: defaultBackground,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%'
        
    },
    header: {
        fontSize: 16,
        letterSpacing: 1,
        alignSelf: 'center',
        opacity: .6
    },
    timetext: {
       fontSize: 25,
       opacity: .7
    }

});

export default Timer;