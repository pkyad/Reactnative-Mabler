import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { Provider } from 'react-redux';
import store from './store';
import settings from './appSettings';
import HttpsClient from './helpers/HttpsClient';

const themeColor = settings.themeColor
const statusBarStyle = settings.statusBarStyle
const url = settings.url

export default function App() {
  return (
    <Provider store = {store}>
      <View style={styles.container}>
        <StatusBar style={statusBarStyle} backgroundColor={themeColor} />
        <AppNavigator />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
