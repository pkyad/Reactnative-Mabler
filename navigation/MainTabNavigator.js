import React from 'react';
import { Platform ,Image,View,TouchableOpacity} from 'react-native';
import { FontAwesome ,Ionicons,MaterialCommunityIcons,MaterialIcons,SimpleLineIcons} from '@expo/vector-icons';
import { createAppContainer,createSwitchNavigator,withNavigation} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator,DrawerItems } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import settings from '../appSettings';

const loginType = settings.loginType

import Home from '../screens/Home';
import Visits from '../screens/Visits';
import Reports from '../screens/Reports';
import Training from '../screens/Training';
import RetailerDetails from '../screens/RetailerDetails';
import Notification from '../screens/Notification';
import Merchandise from '../screens/Merchandise';
import RetailerOrder from '../screens/RetailerOrder';
import Schemes from '../screens/Schemes';
import OrderDetail from '../screens/OrderDetail';
import Attendance from '../screens/Attendance';

import OtpLogin from '../OtpBasedLogin/OtpLogin';
import OtpScreen from '../OtpBasedLogin/OtpScreen';

import DrawerContent from '../navigationComponents/DrawerContent';

const HomeStack = createStackNavigator({
   Home:Home,
},
{
  initialRouteName: 'Home',
});

const PageFirstStack = createStackNavigator({
   Visits:Visits,
   RetailerDetails:RetailerDetails,
   Merchandise:Merchandise,
   RetailerOrder:RetailerOrder,
   OrderDetail:OrderDetail,
   Schemes:Schemes,
},
{
  initialRouteName: 'Visits',
});

const PageSecondStack = createStackNavigator({
   Reports:Reports,
},
{
  initialRouteName: 'Reports',
});

const PageThirdStack = createStackNavigator({
   Training:Training,
},
{
  initialRouteName: 'Training',
});

const NotificationStack = createStackNavigator({
   Notification:Notification,
},
{
  initialRouteName: 'Notification',
});

const OtpLoginStack = createStackNavigator({
   OtpLogin:OtpLogin,
   OtpScreen:OtpScreen,
},
{
  initialRouteName: 'OtpLogin',
});

const drawerNavigator = createDrawerNavigator({
  Home:{
      screen:HomeStack,
      navigationOptions: {
        drawerLabel: () => null
      }
  },
  PageFirst:{
      screen:PageFirstStack,
      navigationOptions: {
          drawerLabel: () => null
      }
  } ,
  PageSecond:{
    screen:PageSecondStack,
    navigationOptions:{
      drawerLabel: () => null
    }
  },
  PageThird:{
    screen:PageThirdStack,
    navigationOptions:{
      drawerLabel: () => null
    }
  },
  NotificationStack:{
    screen:NotificationStack,
    navigationOptions:{
      drawerLabel: () => null
    }
  },


  },
  {
    drawerBackgroundColor:'#fff',
    drawerPosition:'left',
    drawerType:'slide',
    hideStatusBar:false,
    contentComponent:props =><DrawerContent  {...props}  />,
    contentOptions: {
        activeTintColor: '#ee5034',
        inactiveTintColor: '#efa834',
        itemsContainerStyle: {
            marginVertical: 0,
            paddingVertical:0
        },
        iconContainerStyle: {
            opacity: 1
        }
    },
    initialRouteName:'Home'
  }
);

export default createAppContainer(drawerNavigator);
