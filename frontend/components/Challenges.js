import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isReactNative = process.env.REACT_NATIVE === 'true';

let storage;
if(isReactNative){
    storage = localStorage
}
else{
    storage = AsyncStorage
}
const ChallengesScreen = (prop) => {
  console.log(prop)
  const [isLoading, setLoading] = useState(true);

  const [challenges, setChallenges] = useState([]);

  

  const fetchUserChallenges = async () => {
    try {
      const token = await storage.getItem('access_token');

      const response = await axios.get('http://localhost:8000/current_user_challenges/?format=json', 
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Replace with the actual user token
        },
      });
      // print(response)
      setChallenges(response.data);
    } catch (error) {
      console.error('Error fetching user challenges:', error);
    } finally {
        setLoading(false);

    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchUserChallenges();
  };
  
  useEffect(() => {
    fetchUserChallenges();
  }, []);

  return (
    <View>
      <View >
        <Button title="Refresh" onPress={handleRefresh} />
      </View>
      <Text>User Challenges:</Text>
      
      {isLoading ? (
        <ActivityIndicator />
      ) : (
      <View>
      {challenges.map((challenge) => (
        <View key={challenge.id}>
          {/* Display challenge details as needed */}
          <Text>Challenger:</Text>
          <Text>Username: {challenge.Challenger.Person.user.username}</Text>
          <Text>TennisId: {challenge.Challenger.Person.TennisId}</Text>
          {/* Add other details you want to display */}
          
          <Text>Challenged:</Text>
          <Text>Username: {challenge.Challenged.Person.user.username}</Text>
          <Text>TennisId: {challenge.Challenged.Person.TennisId}</Text>
          {/* Add other details you want to display */}
        </View>
      ))}
      </View>
      )}
    </View>
  );

};

export default ChallengesScreen;
