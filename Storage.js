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
  const getItems = async (key1, key2) => {
    try {
      const values = await AsyncStorage.multiGet([`@level`, `@difficulty`])
      return values;
    } catch(e) {
      // error reading value
      console.log(e);
    }
  }


  const levelUp = (gameType, localLevel) => {
    console.log(`gameType: ${gameType}`);
    if(gameType==='puzzle') {
      getItem('puzzles').then(puzzle=> {
        storeItem('puzzles', puzzle+1)});
    }
    if(gameType === 'timed') {
      getItem('timedScore').then(score=> {
        console.log(`saved score: ${score}`);
        console.log(`local level: ${localLevel}`);

        if(localLevel+1 > score){
          console.log(`storing timedScore: ${localLevel+1}`);
          storeItem('timedScore', localLevel+1);
        }
      });
    }
      getItem('level').then(level=> {

          storeItem('level', level+1)

        
        });

          
  }

  const getSettings = async () => {
    let values;
    try {
      values = await AsyncStorage.multiGet([ '@difficulty','@sound', '@vibrate', '@display']);
      return values;
    } catch(e) {
      // read error
    }
  }

  const initialize = () => {
    console.log('initializing');
    storeItem('level',0);
    storeItem('puzzles',0);
    storeItem('timedScore',0);
    storeItem('sound', true);
    storeItem('difficulty', 1);
    storeItem('vibrate', true);
    storeItem('display', 'impossible');

  
  }

  export {clearAll, storeItem, getItem, getItems, levelUp, initialize, getSettings};
