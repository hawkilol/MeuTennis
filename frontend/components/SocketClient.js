import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
// import ReanimatedBottomSheet from 'react-native-reanimated-bottom-sheet';
import NetInfo from '@react-native-community/netinfo';

import  Socket  from 'react-native-tcp';


const SocketClient = () => {
  useEffect(() => {
    const socket = new Socket();

    const handleConnection = () => {
      console.log('Connected to server');
      socket.write('Hello from React Native!');
    };

    const handleData = (data) => {
      console.log('Data from server:', data.toString());
    };

    const handleClose = () => {
      console.log('Connection closed');
    };

    const handleError = (error) => {
      console.error('Socket error:', error);
    };

    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        socket.connect('127.0.0.1', 50010, handleConnection);
        socket.on('data', handleData);
        socket.on('close', handleClose);
        socket.on('error', handleError);
      } else {
        console.warn('Device is offline');
      }
    });

    return () => {
      socket.destroy();
    };
  }, []);

  return (
    <View>
      <Text>Your React Native Component</Text>
    </View>
  );
};

export default SocketClient;
