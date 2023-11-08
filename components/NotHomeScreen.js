import React from 'react'
import { View , Text, Button } from 'react-native'

function NotHomeScreen({ navigation, route }) {
    const { from } = route.params;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Not Home Screen from: {from} </Text>
        <Button
        title="Go to Not Home... again"
        onPress={() => navigation.push('NotHome')}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
}

export default NotHomeScreen;