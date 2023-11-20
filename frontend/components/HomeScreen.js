import * as React from 'react';
import { View , Text, StyleSheet, Button } from 'react-native'
import MyComponent from './MyComponent';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Theme } from 'tamagui' 
// import NotHomeScreen from './NotHomeScreen';

function HomeScreen({ navigation }) {
    // const navigation = useNavigation();
    return (
    <Theme name='purple'>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Text>Meu ™!</Text>
        <MyComponent
            prop="Prop Works!"
        />
        <Button
            title="Go to Not Home"
            onPress={() => navigation.navigate('NotHome' , {
                from: 'fromHome!'
            })}
      />
      <Button
            title="Go to API Test"
            onPress={() => navigation.navigate('ApiTest' , {
                from: 'fromHome!'
            })}
      />
      <Button
            title="Go to Tamagui Test"
            onPress={() => navigation.navigate('TamaguiDemo' , {
                from: 'fromHome!'
            })}
      />
      </View>
      </Theme>
    );
}

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Meu ™!</Text>
//       <StatusBar style="auto" />
//       <MyComponent/>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#fff',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//   });
export default HomeScreen;