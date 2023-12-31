// import React from 'react'
// import { View , Text, Button } from 'react-native'

// function NotHomeScreen({ navigation, route }) {
//     const { from } = route.params;
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Not Home Screen from: {from} </Text>
//         <Button
//         title="Go to Not Home... again"
//         onPress={() => navigation.push('NotHome')}
//       />
//       <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
//       <Button title="Go back" onPress={() => navigation.goBack()} />
//       </View>
//     );
// }
import React, {useEffect, useState} from 'react';
import { SafeAreaView, StyleSheet, Image, ActivityIndicator, FlatList, Text, View } from 'react-native';
import Animated, {
  useAnimatedSensor,
  useAnimatedStyle,
  SensorType,
} from 'react-native-reanimated';

import { BlurView } from 'expo-blur';


//api



const BORDER_RADIUS = 20;
const INTENSITY = 30;

const CARD_WIDTH = 230;
const CARD_HEIGHT = 380;

function NotHomeScreen() {
  const animatedSensor = useAnimatedSensor(SensorType.ROTATION, {
    interval: 0,
  });

  const style = useAnimatedStyle(() => {
    const { pitch, yaw, qy } = animatedSensor.sensor.value;

    let num = qy > 0 ? 30 : 50;

    let yawValue =
      qy > 0 ? num * 2.5 * Number(qy.toFixed(2)) : num * qy.toFixed(2);

    let pitchValue = 26 * pitch.toFixed(2);

    return {
      transform: [{ translateX: yawValue }, { translateY: pitchValue }],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.imageStyle} source={require('./1290.png')} />
      <BlurView intensity={INTENSITY} style={StyleSheet.absoluteFill} />

      <Animated.View style={[styles.animatedViewStyle, style]}>
        <Image style={{ flex: 1 }} source={require('./1290.png')} />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: BORDER_RADIUS,
  },
  animatedViewStyle: {
    width: CARD_WIDTH + 20,
    height: CARD_HEIGHT + 20,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NotHomeScreen;