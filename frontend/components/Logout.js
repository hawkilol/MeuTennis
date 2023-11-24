import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, AsyncStorage, LocalStorage, Alert } from 'react-native';
import { useUser } from './UserContext';
const isReactNative = process.env.REACT_NATIVE === 'true';
const storage = isReactNative ? require('@react-native-async-storage/async-storage').default : window.localStorage;

const Logout = () => {
const { updateUsername } = useUser();

  const handleLogout= async () => {
    try {
      console.log("logout!")

      storage.removeItem('access_token');

      storage.removeItem('refresh_token');
 
      storage.removeItem('username');
      updateUsername('');  
      
    } catch (error) {
      console.error('Logout failed', error);
      Alert.alert('Logout Failed', '????');
    }
  };

  return (
    <View>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Logout;
