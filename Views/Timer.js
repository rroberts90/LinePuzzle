import  React, {useState, useEffect} from 'react';
import { View,Text, StyleSheet, SafeAreaView } from 'react-native';
import Header from './Header';
import useInterval from "./useInterval";

const defaultStartTime = 60;
const defaultBackground = 'rgba(248,248,255,1)';

const TimerBoxBackup = ({time, score}) => {
    return (
    <View style={styles.box}>
        <View style={styles.duo}>
            <Text style={styles.header}>time </Text>
            <Text style={styles.timetext}>{time}</Text>
        </View>
        <View style={[styles.duo]}>
            <Text style={styles.header}>score </Text>
            <Text style={styles.timetext}>{level}</Text>
        </View>
    </View>

    );
}
const Timer = ({onFinish, level}) => {
    const [time, setTime] = useState(defaultStartTime);
    //const [score, setScore] = useState(0);
    //console.log(time);
    const isFinished = time <=0;
    useEffect(()=> {
        if(isFinished){
        onFinish('timed',level);
      //  onFinish(level);

        }

    }, [isFinished]);
    
    useInterval(()=>{

        setTime(t=> t-1);
        console.log(time);
        if(time <= 0){
            return;
        }
    }, 1000);
    return (
        <Header title1={'Time'} item1={time} title2={'Score'} item2={level}/>
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
    box2: {
        position:'absolute',
        width: '100%',
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

export default Timer;