import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, AsyncStorage, LocalStorage, Alert } from 'react-native';
import axios from 'axios';
import { useUser } from './UserContext';

const RegisterPersonScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [TennisId, setTennisId] = useState('');
  const [StandardGivenName, setStandardGivenName] = useState('');
  const [StandardFamilyName, setStandardFamilyName] = useState('');
  const { updateUsername } = useUser();

  const handleRegisterPerson = async () => {
    try {
      const currentDate = new Date().toISOString().slice(0,10);
      console.log(currentDate)
      axios.defaults.baseURL = 'http://localhost:8000/'
      const response = await axios.post('rankings/4/add_create_person_to_ranking/', {
        Updated: currentDate,
        Type: 'Person',
        SortOrder: 1,
        Result: 100,
        Rank: 1,
        RankingItemsCode: 1,
        Person: {
          Updated: currentDate,
          TennisId,
          StandardGivenName,
          StandardFamilyName,
          user: {
            username,
            password,
            email,
          },
        },
      });

      // Handle successful registration
      console.log('Registration successful', response);
      Alert.alert('Registration Successful', 'Parabéns! :)');

      // Update username in context
      updateUsername(username);

      // Reset input fields
      setUsername('');
      setPassword('');
      setEmail('');
      setTennisId('');
      setStandardGivenName('');
      setStandardFamilyName('');
    } catch (error) {
      console.error('Register failed', error);
      Alert.alert('Register Failed', 'Erro! >:(');
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
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Tennis ID"
        value={TennisId}
        onChangeText={(text) => setTennisId(text)}
      />
      <TextInput
        placeholder="Standard Given Name"
        value={StandardGivenName}
        onChangeText={(text) => setStandardGivenName(text)}
      />
      <TextInput
        placeholder="Standard Family Name"
        value={StandardFamilyName}
        onChangeText={(text) => setStandardFamilyName(text)}
      />
      <Button title="Register" onPress={handleRegisterPerson} />
    </View>
  );
};

export default RegisterPersonScreen;
