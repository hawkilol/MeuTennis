import React from 'react'
import { View , Text } from 'react-native'

const MyComponent = ({prop}) => {
    return (
      <View>
        <Text>Hello from MyComponent!1 {prop}</Text>
      </View>
    );
  };
  
export default MyComponent;