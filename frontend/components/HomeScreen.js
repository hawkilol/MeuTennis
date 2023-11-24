import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native'
import MyComponent from './MyComponent';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Theme } from 'tamagui'
import Logout from './Logout';
import { useUser } from './UserContext';
// import NotHomeScreen from './NotHomeScreen';
const isReactNative = process.env.REACT_NATIVE === 'true';
const storage = isReactNative ? require('@react-native-async-storage/async-storage').default : window.localStorage;

function HomeScreen({ navigation }) {
    console.log("555")
    const { username } = useUser();
    // const navigation = useNavigation();
    // const [setUsername] = useState('');
    
    useEffect(() => {
        console.log("test")
        const fetchUsername = async () => {
            try {
                // Retrieve the JWT token from AsyncStorage
                // const username = storage.getItem('username');

                if (!username) {
                    // Decode the JWT token to get the payload
                    // setUsername(username);
                }
            } catch (error) {
                console.error('Error fetching username', error);
            }
        };

        fetchUsername();
    }, []);


    useEffect(() => {
        // Update the navigation bar title whenever the username changes
        const localusername = storage.getItem('username');
        console.log(username)
        console.log(localusername)
        navigation.setOptions({
            title: `Welcome, ${username || (localusername ? localusername : 'Guest')}`,
          });
        }, [username, navigation]);

    return (

        <Theme name='purple'>
            <View style={styles.container}>
                <Text style={styles.text}>Welcome, {username || 'Guest'}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Home Screen</Text>
                <Text>Meu ™!</Text>
                <MyComponent
                    prop="Prop Works!"
                />
                <Button
                    title="Go to Not Home"
                    onPress={() => navigation.navigate('NotHome', {
                        from: 'fromHome!'
                    })}
                />
                <Button
                    title="Go to API Test"
                    onPress={() => navigation.navigate('ApiTest', {
                        from: 'fromHome!'
                    })}
                />
                <Button
                    title="Go to Tamagui Test"
                    onPress={() => navigation.navigate('TamaguiDemo', {
                        from: 'fromHome!'
                    })}
                />
                <Button
                    title="Go to Login"
                    onPress={() => navigation.navigate('Login', {
                        from: 'fromHome!'
                    })}
                />
                <Button
                    title="Go to Home"
                    onPress={() => navigation.navigate('Home', {
                        from: 'fromHome!'
                    })}
                />
                <Logout>

                </Logout>
            </View>
        </Theme>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
    },
});
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