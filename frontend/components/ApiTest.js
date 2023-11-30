import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CustomModal from './Modal'

const isReactNative = process.env.REACT_NATIVE === 'true';

let storage;
if (isReactNative) {
  storage = localStorage;
} else {
  storage = AsyncStorage;
}

const ApiTest = () => {
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(true);
  const [rankingData, setRankingData] = useState(null);
  const [isChallengeSuccessModalVisible, setChallengeSuccessModalVisible] = useState(false)
  const [ChallengedName, setChallengedName] = useState(null)


  console.log(isChallengeSuccessModalVisible)
  const getRankingData = async () => {
    try {
      const response = await fetch('http://localhost:8000/ranking/4/');
      const json = await response.json();
      setRankingData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startChallenge = async (rankingItemId, ChallengedName) => {
    try {
      const token = await storage.getItem('access_token');
      const response = await axios.post(
        'http://localhost:8000/rankingItem/register_challenge/',
        {
          Challenged: rankingItemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Challenge started successfully
      console.log('Challenge started successfully', response.data);
      setChallengedName(ChallengedName)
      setChallengeSuccessModalVisible(true);
    } catch (error) {
      // Handle errors
      console.error('Error while starting challenge:', error.message);
    }
  };

  const handleChallengePress = (item) => {
    // Navigate to the challenge route with the selected item
    console.log('apitest');
    console.log(item);
    startChallenge(item.id, item.Person.StandardGivenName.toString());
    // navigation.navigate('ChallengesScreen', { rankingItem: item });
  };

  const handleRefresh = () => {
    setLoading(true);
    getRankingData();
  };

  useEffect(() => {
    getRankingData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Refresh" onPress={handleRefresh} />
      </View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.tableContainer}>
          <FlatList
            style={styles.flatList}
            data={rankingData?.RankingItems || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => handleChallengePress(item)}>
                <View
                  style={[
                    styles.itemContainer,
                    { backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff' },
                  ]}
                >
                  <Text style={styles.rank}>{item.Rank }</Text>
                  <Text>

                  </Text>
                  <Text style={styles.playerName}>
                    {item.Person.StandardGivenName} {item.Person.StandardFamilyName}
                  </Text>
                  <Text style={styles.type}>{item.Type}</Text>
                  <Text style={styles.result}>Result: {item.Result}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Challenge Success Modal */}
      <CustomModal
        isVisible={isChallengeSuccessModalVisible}
        onClose={ () => setChallengeSuccessModalVisible(false)}
        modalText={ ChallengedName + " foi desafiado"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  tableContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    elevation: 3, // Add elevation for shadow (Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  flatList: {
    marginTop: 20,
    padding: 10,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rank: {
    marginRight: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  playerName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  type: {
    fontSize: 16,
    color: '#555',
  },
  result: {
    fontSize: 16,
    color: '#555',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default ApiTest;
