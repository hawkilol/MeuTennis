import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet, Button } from 'react-native';

const ApiTest = () => {
  const [isLoading, setLoading] = useState(true);
  const [rankingData, setRankingData] = useState(null);
  console.log("123")

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
              <View style={[styles.itemContainer, { backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff' }]}>
                <Text style={styles.rank}>{item.Rank}</Text>
                <Text style={styles.playerName}>
                  {item.Person.StandardGivenName} {item.Person.StandardFamilyName}
                </Text>
                <Text style={styles.type}>{item.Type}</Text>
                <Text style={styles.result}>Result: {item.Result}</Text>
              </View>
            )}
          />
        </View>
      )}
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
});

export default ApiTest;
