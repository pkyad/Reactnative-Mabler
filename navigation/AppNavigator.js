import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import initialNavigator from './MainTabNavigator';

export default createAppContainer(createSwitchNavigator({
  Main: initialNavigator,
}
));
