import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isReactNative = process.env.REACT_NATIVE === 'true';

let storage;
if (isReactNative) {
  storage = localStorage;
} else {
  storage = AsyncStorage;
}
let localUsername = await storage.getItem('username');
const ChallengesScreen = (prop) => {
  console.log(prop);
  const [isLoading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);

  const fetchUserChallenges = async () => {
    try {
      const token = await storage.getItem('access_token');

      const response = await axios.get(
        'http://localhost:8000/current_user_challenges/?format=json',
        {
          headers: {
            Authorization: `Bearer ${token}`, // Replace with the actual user token
          },
        }
      );
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
      <View>
        <Button title="Refresh" onPress={handleRefresh} />
      </View>
      <Text>User Challenges:</Text>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          {challenges.map((challenge) => (
            <View
              key={challenge.id}
              // style={[
              //   styles.card,
              //   challenge.isChallenger
              //     ? { backgroundColor: '#ED553B' } // Styling for challenger
              //     : { backgroundColor: '#20639B' }, // Styling for challenged
              // ]}
            >
              style={[
                styles.card,
                localUsername === challenge.Challenger.Person.user.username
                  ? { backgroundColor: 'green' } // Styling for the logged-in user as challenger
                  : { backgroundColor: 'blue' }, // Styling for other cases
              ]}
              {/* Display challenge details as needed */}
              <Text style={styles.label}>Challenger:</Text>
              <Text>{challenge.Challenger.Person.user.username}</Text>
              <Text>{challenge.Challenger.Person.TennisId}</Text>

              <Text style={styles.label}>Challenged:</Text>
              <Text>{challenge.Challenged.Person.user.username}</Text>
              <Text>{challenge.Challenged.Person.TennisId}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    borderRadius: 24, // Rounded corners
    // borderWidth: 1,
    // borderColor: '#ddd', // Border color
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default ChallengesScreen;
