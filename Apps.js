import React, {useEffect} from 'react';
import {AppRegistry, DeviceEventEmitter, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import invokeApp from 'react-native-invoke-app';
import DashBoard from './DashBoard';

const App = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      DeviceEventEmitter.addListener('appInvoked', data => {
        const {route} = data;
        console.log('appInvoked');
        // Using react-navigation library for navigation.
        // navigation.navigate('Dashboard');
      });
      notificationActionHandler()
    }, 5000);
  }, []);

  return (
    <View>
      <Text>This is Home screen.</Text>
    </View>
  );
};


const appStack = ({navigation}) => {
  const Stack = createStackNavigator();
  <NavigationContainer>
    <Stack.Screen name="App" component={App} />
    <Stack.Screen name="DashBoard" component={DashBoard} />
  </NavigationContainer>
  return <Stack />;
};

const notificationActionHandler = async data => {
  // Your background task
  const yourObject = {route: 'DashBoard'};
  console.log('App background')
    invokeApp({
      data: yourObject,
  });
};

AppRegistry.registerHeadlessTask(
  'RNPushNotificationActionHandlerTask',
  () => notificationActionHandler,
);

AppRegistry.registerComponent('testProject', () => appStack);

export default App;
