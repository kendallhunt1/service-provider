import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { UserProvider } from './Context/UserContext';
import AppNavigator from './Components/TabNavigator';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

const App = () => {
  const statusBarColor = 'dark-content';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#f08080"
        barStyle={statusBarColor}
      />
      <UserProvider>
      <NavigationContainer>
        <AppNavigator style={styles.tabNavigator} />
      </NavigationContainer>
      </UserProvider>
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  textStyle: {
    textAlign: 'center',
    marginBottom: 3,
    color: 'black'
  },
  tabNavigator: {
    flex: 0,
  }
});
