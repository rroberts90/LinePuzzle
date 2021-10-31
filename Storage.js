import AsyncStorage from '@react-native-async-storage/async-storage';

const clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }
  
    console.log('Done.')
  }


const storeItem = async (key,value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(`@${key}`, jsonValue)
    } catch (e) {
      // saving error
      console.log(e);
    }
  }

  const getItem = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(`@${key}`)
        return jsonValue != null ? JSON.parse(jsonValue) : null;

    } catch(e) {
      // error reading value
      console.log(e);
    }
  }

  const levelUp = (gameType) => {
    if(gameType==='puzzle') {
      getItem('puzzles').then(puzzle=> {
        console.log('puzzling up');
        console.log(`puzzle: ${puzzle}`)
        storeItem('puzzles', puzzle+1)});
    }
      getItem('level').then(level=> {
          console.log('leveling up');
          console.log(`level: ${level}`)
          storeItem('level', level+1)});
  }

  const getSettings = async () => {
    let values;
    try {
      values = await AsyncStorage.multiGet([ '@difficulty','@sound', '@vibrate']);
    } catch(e) {
      // read error
    }
    return values;
  }
  const initialize = () => {
    console.log('initializing');
    storeItem('level',0);
    storeItem('puzzles',0);
    storeItem('timedScore',0);
    storeItem('sound', true);
    storeItem('difficulty', 1);
    storeItem('vibrate', true);
    
  
  }

  export {clearAll, storeItem, getItem, levelUp, initialize, getSettings};
