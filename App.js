import React, {useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  // PermissionsAndroid,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import BackgroundService from 'react-native-background-actions';
import invokeApp from 'react-native-invoke-app';

import {
  check,
  request,
  RESULTS,
  requestMultiple,
  PERMISSIONS,
} from 'react-native-permissions';

export async function checkMultiplePermissions(permissions) {
  let isPermissionGranted = false;
  const statuses = await requestMultiple(permissions);
  for (var index in permissions) {
    if (statuses[permissions[index]] === RESULTS.GRANTED) {
      isPermissionGranted = true;
    } else {
      isPermissionGranted = false;
      break;
    }
  }
  return isPermissionGranted;
}

  const checkForPermissions  = async ()=>  {
  const permissions =
    Platform.OS === 'ios'
      ? [PERMISSIONS.IOS.LOCATION_ALWAYS]
      : [PERMISSIONS.CAMERA];

  // Call our permission service and check for permissions
  const isPermissionGranted = await checkMultiplePermissions(permissions);
  if (!isPermissionGranted) {
    // Show an alert in case permission was not granted
    Alert.alert(
      'Permission Request',
      'Please allow permission to access the Wakeup.',
      [
        {
          text: 'Go to Settings',
          onPress: () => {
            Linking.openSettings();
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  }
  return isPermissionGranted;
}

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

// const requestCameraPermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.READ_PHONE_STATE,
//       {
//         title: "Cool Photo App Camera Permission",
//         message:
//           "Cool Photo App needs access to your camera " +
//           "so you can take awesome pictures.",
//         buttonNeutral: "Ask Me Later",
//         buttonNegative: "Cancel",
//         buttonPositive: "OK"
//       }
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log("You can use the camera");
//     } else {
//       console.log("Camera permission denied");
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// };

const veryIntensiveTask = async taskDataArguments => {
  // Example of an infinite loop task
  const {delay} = taskDataArguments;
  await new Promise(async resolve => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log(i);
      const log = {logMessage: 'this is the event emitter log'};
      if (i == 10 || i == 20) {
        const brw = async () => {
          invokeApp();

          // await Linking.openURL('https://www.educba.com/')
        };
        brw();

        // Linking.getInitialURL()
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
};

const App = () => {
  useEffect(() => {
    checkForPermissions()
    // requestCameraPermission();
    startBackgroundService();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          startBackgroundService();
        }}
        style={styles.btn}>
        <Text>start BackgroundService</Text>
      </TouchableOpacity>
      <View style={{marginBottom: 20}}></View>
      <TouchableOpacity
        onPress={() => {
          stopBackgroundService();
        }}
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
