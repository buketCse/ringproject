import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Map',
  // tabBarIcon: ({ focused }) => (
  //   <TabBarIcon
  //     focused={focused}
  //     name={'md-information-circle'}
  //   />
  // ),
};

HomeStack.activeBackgroundColor = {backgroundColor:'red'};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  // tabBarIcon: ({ focused }) => (
  //   <TabBarIcon 
  //     focused={focused}
  //     name={'md-options'}
  //   />
  // ),
};

export default createTabNavigator({
  HomeStack,
  SettingsStack,
});
