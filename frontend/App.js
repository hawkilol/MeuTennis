import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './components/HomeScreen';
import NotHomeScreen from './components/NotHomeScreen';
import ApiTest from './components/ApiTest';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Demo from './components/Tamagui';
import { Theme } from 'tamagui' // or '@tamagui/core'
import '@tamagui/core/reset.css'

import { TamaguiProvider } from 'tamagui'
// import tamaguiConfig from './tamagui.config'
import appConfig from './tamagui.config'
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <TamaguiProvider config={appConfig}>

    
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NotHome" component={NotHomeScreen} />
        <Stack.Screen name="ApiTest" component={ApiTest} />
        <Stack.Screen name="TamaguiDemo" component={Demo} />
      </Stack.Navigator>
    </NavigationContainer>
    </TamaguiProvider>
  );
}