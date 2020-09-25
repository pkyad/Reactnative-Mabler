import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import initialNavigator from './MainTabNavigator';
import { createStackNavigator } from 'react-navigation-stack';
import OtpLogin from '../OtpBasedLogin/OtpLogin';
import OtpScreen from '../OtpBasedLogin/OtpScreen';
import Attendance from '../screens/Attendance';
import DefaultScreen from '../screens/DefaultScreen';

const OtpLoginStack = createStackNavigator({
   OtpLogin:OtpLogin,
   OtpScreen:OtpScreen,
},
{
  initialRouteName: 'OtpLogin',
});

export default createAppContainer(createSwitchNavigator({
  DefaultScreen:DefaultScreen,
  Login:OtpLoginStack,
  Attendance:Attendance,
  Main: initialNavigator,
}
));
