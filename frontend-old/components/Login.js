import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, AsyncStorage, LocalStorage, NativeModules, Platform, Image } from 'react-native';
import axios from 'axios';
import { useUser } from './UserContext';
import CustomModal from './Modal'
import alert from './Alert'

// import { toast } from '@baronha/ting';
// ...
const options = {
  title: 'Done 😎',
  message: 'Successful!!',
};

const isReactNative = process.env.REACT_NATIVE === 'true';
const storage = isReactNative ? require('@react-native-async-storage/async-storage').default : window.localStorage;


const decodeJWT = (token) => {
    try {
      // Extract the payload from the token (between the second and third dots)
      console.log(token)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(base64);
  
      // Parse the JSON payload
      const parsedPayload = JSON.parse(decodedPayload);
  
      return parsedPayload;
    } catch (error) {
      console.error('Error decoding JWT', error);
      return null;
    }
  };
  
  // Example usage:
//   const jwtToken = 'your.jwt.token.here';
//   const decodedPayload = decodeJWT(jwtToken);
  
//   if (decodedPayload) {
//     console.log('Decoded JWT Payload:', decodedPayload);
//   } else {
//     console.log('Failed to decode JWT.');
//   }

  
const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { updateUsername } = useUser();
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false)


  const handleLogin = async () => {
    try {
      axios.defaults.baseURL = 'http://localhost:8000/'
      const response = await axios.post('login', {
        username: username,
        password: password,
      });

      console.log("login!")
      const access_token = response.data.access;
      const refresh_token = response.data.refresh;

      // Store the token for future requests or user sessions
      console.log(access_token)

      storage.setItem('access_token', access_token);

      storage.setItem('refresh_token', refresh_token);
      const decodedJWT = decodeJWT(access_token);
      console.log(decodedJWT)
      storage.setItem('username', decodedJWT.username);
      updateUsername(decodedJWT.username)
      // Navigate to the main screen or perform other actions
      // e.g., navigation.navigate('MainScreen');
      setSuccessModalVisible(true);
    } catch (error) {
      console.log("123")
      // console.error('Login failed', error);
      //toast(options); // easy to use
      //alert('Login Failed', 'Please check your username and password.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} />
      <CustomModal
        isVisible={isSuccessModalVisible}
        onClose={ () => setSuccessModalVisible(false)}
        modalText={"Login realizado com sucesso"}
      />
    </View>
  );
};

export default LoginScreen;
