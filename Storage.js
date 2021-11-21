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
      const values = await AsyncStorage.multiGet([`@${key1}`, `@${key2}`])
      return values;
    } catch(e) {
      // error reading value
      console.log(e);
    }
  }


  const levelUp = (gameType, localLevel) => {
    const itemName = `${gameType}Score`;
    console.log(itemName);
    if(gameType === 'timed' || gameType === 'moves') {
      getItem(itemName).then(score=> {

        if(localLevel+1 > score){
          storeItem(itemName, localLevel+1);
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
      values = await AsyncStorage.multiGet([ '@difficulty','@sound', '@vibrate', '@display', '@board']);
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
    storeItem('difficulty', true);
    storeItem('vibrate', true);
    storeItem('display', 'impossible');
    storeItem('board', true);

  
  }

  export {clearAll, storeItem, getItem, getItems, levelUp, initialize, getSettings};
