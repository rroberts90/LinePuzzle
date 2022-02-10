import { Audio } from 'expo-av';
import React, { useState, useEffect } from 'react';
import { getItem } from './Storage';

const sounds = {
    'connect': require('./Sounds/tap2.wav'), 
    'win': require('./Sounds/win3.mp3'),
    'button': require('./Sounds/tap1.wav'),
    'undo': require('./Sounds/tap2.wav'),
    'paper': require('./Sounds/paper.wav'),
    'gameOver':require('./Sounds/gameOver1.wav'),
    'packWin':require('./Sounds/puzzlePackWin.wav')

}

export default function useSound() {

    const [sound, setSound] = useState();

    async function playSound(key) {
        const soundAllowed = await getItem('sound');
        if(!soundAllowed) {
            return;
        }

        const { sound } = await Audio.Sound.createAsync(
            sounds[key]
        );
        setSound(sound);
        
        if(key==='paper'){
            await sound.setPositionAsync(400);
        }
        if(key==='button') {
            await sound.setVolumeAsync(.5);
        }
        if(key ==='packWin') {

           await sound.setVolumeAsync(.5);

        }
        if(key === 'background') {
            await sound.setIsLoopingAsync(true);
        }

        await sound.playAsync();
    }



    useEffect(() => {

        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    return {play: playSound};
}

