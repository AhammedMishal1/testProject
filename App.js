import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity,Linking} from 'react-native';
import BackgroundService from 'react-native-background-actions';
// import invokeApp from 'react-native-invoke-app';
import IntentLauncher, { IntentConstant } from 'react-native-intent-launcher'

// IntentLauncher.startActivity({
// 	action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
// 	data: 'package:com.testproject'
// })

// // check if app is installed by package name
// IntentLauncher.isAppInstalled('com.testproject')
//   .then((result) => {
//     console.log('isAppInstalled yes');
//   })
//   .catch((error) => console.warn('isAppInstalled: no', error));

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const veryIntensiveTask = async taskDataArguments => {
  // Example of an infinite loop task
  const {delay} = taskDataArguments;
  await new Promise(async resolve => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log(i);
      const log = { logMessage: 'this is the event emitter log' }
      if(i == 5){
        
      Linking.openURL('https://www.educba.com/')
        // invokeApp({ data: log });
      }
      // api calling here
      await BackgroundService.updateNotification({
        taskDesc: 'counter running' + i,
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
    delay: 3000,
  },
};

const startBackgroundService = async () => {
  await BackgroundService.start(veryIntensiveTask, options);
  await BackgroundService.updateNotification({
    taskDesc: 'Reward App is running',
  });
  
};

const stopBackgroundService = async () => {
  await BackgroundService.stop();
}

const App = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={()=>{startBackgroundService()}}
        style={styles.btn}>
        <Text>start BackgroundService</Text>
      </TouchableOpacity>
      <View style={{marginBottom:20}}></View>
      <TouchableOpacity
        onPress={()=>{stopBackgroundService()}}
        style={styles.btn}>
        <Text>stop BackgroundService</Text>
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
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 50,
    backgroundColor: 'lightgrey',
  },
});

export default App;
