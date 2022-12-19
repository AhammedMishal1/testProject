import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Linking,
  TouchableOpacity,
} from 'react-native';
import BackgroundService from 'react-native-background-actions';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

BackgroundService.on('expiration', () => {
  console.log('Ios is being closed');
});

const taskRandom = async taskData => {
  if (Platform.OS === 'ios') {
    console.warn('this tak will not keep your app alive in background.');
  }

  await new Promise(async resolve => {
    console.log('hello world!');
    const {delay} = taskData;
    console.log(BackgroundService.isRunning(), delay);
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log('Runned -> ' + i);
      await BackgroundService.updateNotification({
        taskDesc: 'Runned ->' + i,
        progressBar: 2,
      });
      await sleep(delay);
    }
  });
};


const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 1000,
  },
};

function handleOpenURL(evt) {
  // Will be called when the notification is pressed
  console.log(evt.url);
  // do something
}

Linking.addEventListener('url', handleOpenURL);

const App = () => {
  const usingHermes =
    typeof HermesInternal === 'object' && HermesInternal !== null;

  let playing = BackgroundService.isRunning();

  const toggleBackground = async () => {
    playing = !playing;
    if (playing) {
      try {
        console.log('trying to start background service');
        await BackgroundService.start(taskRandom, options);
        console.log('Successfull start');
      } catch (e) {
        console.log('Error', e);
      }
    } else {
      console.log('Stop background service');
      await BackgroundService.stop();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleBackground}
        style={{width: 300, height: 50, backgroundColor: 'green'}}>
        <Text>start task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
