"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Wrapper from "@/components/wrapper";
import CustomModal from "@/components/Modal";
import Login from '@/components/Login';
const ApiTest = () => {
  const [isLoading, setLoading] = useState(true);
  const [rankingData, setRankingData] = useState(null);
  const [isChallengeSuccessModalVisible, setChallengeSuccessModalVisible] = useState(false);
  const [challengedName, setChallengedName] = useState(null);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);

  console.log(isChallengeSuccessModalVisible);

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

  const startChallenge = async (rankingItemId, challengedName) => {
    try {
      const token = localStorage.getItem('access_token'); // Use localStorage directly
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

      console.log('Challenge started successfully', response.data);
      setChallengedName(challengedName);
      setChallengeSuccessModalVisible(true);
    } catch (error) {
      console.error('Error while starting challenge:', error.message);
    }
  };

  const handleChallengePress = (item) => {
    console.log('apitest');
    console.log(item);
    startChallenge(item.id, item.Person.StandardGivenName.toString());
  };

  const handleRefresh = () => {
    setLoading(true);
    getRankingData();
  };

  useEffect(() => {
    getRankingData();
  }, []);

  return (
    <section className="flex flex-col lg:flex-row">
    <section className="flex h-screen w-full flex-col justify-between p-9 lg:h-auto">
      <Wrapper>
    <div className="container mx-auto p-4">
      <div className="mb-10">
        <button className="bg-blue-500 text-white px-4 py-2" onClick={handleRefresh}>
          Refresh
        </button>
      </div>
      {isLoading ? (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="rounded overflow-hidden bg-white shadow-md">
          <ul className="list-none p-0 m-0">
            {rankingData?.RankingItems.map((item, index) => (
              <li key={item.id} className={`bg-${index % 2 === 0 ? 'gray-300' : 'white'} border-b border-gray-400 p-3 flex items-center`}>
                <span className="mr-3 font-bold">{item.Rank}</span>
                <span className="flex-1 text-gray-700">
                  {item.Person.StandardGivenName} {item.Person.StandardFamilyName}
                </span>
                <span className="text-gray-600">{item.Type}</span>
                <span className="text-gray-600 ml-auto">Result: {item.Result}</span>
                <button className="ml-3 bg-blue-500 text-white px-2 py-1" onClick={() => handleChallengePress(item)}>
                  Challenge
                </button>
                <button className="ml-3 bg-blue-500 text-white px-2 py-1" onClick={() => setLoginModalVisible(true)}>
                  Login
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
       
      {/* Challenge Success Modal */}
      <CustomModal
        isVisible={isChallengeSuccessModalVisible}
        onClose={() => setChallengeSuccessModalVisible(false)}
        modalText={`${challengedName} foi desafiado`}
      />
      <CustomModal
        isVisible={isLoginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        modalText={''}
      >
        <div>
          <Login/>
        </div>
      </CustomModal>
    </div>
    </Wrapper>
      </section>
      </section>

  );
};

export default ApiTest;
