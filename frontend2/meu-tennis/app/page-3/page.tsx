"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Wrapper from '@/components/wrapper';

const ChallengesScreen = () => {
  const [challenges, setChallenges] = useState([]);
  const [gettingChallenged, setGettingChallenged] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const localUsername = 'Your Local Username Here';

  const fetchUserChallenges = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        'http://localhost:8000/current_user_challenging/?format=json',
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const fetchUserGettingChallenged = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        'http://localhost:8000/current_user_challenges/?format=json',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGettingChallenged(response.data);
    } catch (error) {
      console.error('Error fetching user challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchUserChallenges();
    fetchUserGettingChallenged();
  };

  const handleCancelChallenge = async (challengeId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(
        `http://localhost:8000/cancel_challenge/${challengeId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleRefresh(); // Refresh the challenges after canceling
    } catch (error) {
      console.error('Error canceling challenge:', error);
    }
  };

  const handleAcceptChallenge = async (challengeId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(
        `http://localhost:8000/accept_challenge/${challengeId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleRefresh(); // Refresh the challenges after accepting
    } catch (error) {
      console.error('Error accepting challenge:', error);
    }
  };

  const handleDeclineChallenge = async (challengeId) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(
        `http://localhost:8000/decline_challenge/${challengeId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleRefresh(); // Refresh the challenges after declining
    } catch (error) {
      console.error('Error declining challenge:', error);
    }
  };

  useEffect(() => {
    fetchUserChallenges();
    fetchUserGettingChallenged();
  }, []);

  return (
    <section className="flex flex-col lg:flex-row">
      <section className="flex h-screen w-full flex-col justify-between p-9 lg:h-auto">
        <Wrapper>
          <div className="container mx-auto p-4">
            <div className="mb-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleRefresh}
              >
                Refresh
              </button>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Desafiando:</h2>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {challenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className={`bg-white p-4 rounded-md shadow-md ${
                        localUsername ===
                        challenge.Challenger.Person.user.username
                          ? 'border-2 border-blue-500' // Styling for challenger
                          : 'border-2 border-red-500' // Styling for challenged
                      }`}
                    >
                      <p className="text-lg font-semibold mb-2">Desafiante:</p>
                      <p>{challenge.Challenger.Person.user.username}</p>
                      <p>{challenge.Challenger.Person.TennisId}</p>

                      <p className="text-lg font-semibold mb-2">Desafiado:</p>
                      <p>{challenge.Challenged.Person.user.username}</p>
                      <p>{challenge.Challenged.Person.TennisId}</p>

                      <p className="text-lg font-semibold mb-2">Status:</p>
                      <p>{challenge.Status}</p>
                      {challenge.Status == 'Pendente' && (
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded-md mt-2"
                            onClick={() =>
                              handleCancelChallenge(challenge.id)
                            }
                          >
                            Cancelar Desafio
                          </button>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">Sendo Desafiado por:</h2>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gettingChallenged.map((challenge) => (
                    <div
                      key={challenge.id}
                      className={`bg-white p-4 rounded-md shadow-md ${
                        localUsername ===
                        challenge.Challenger.Person.user.username
                          ? 'border-2 border-red-500' // Styling for challenger
                          : 'border-2 border-blue-500' // Styling for challenged
                      }`}
                    >
                      <p className="text-lg font-semibold mb-2">Challenger:</p>
                      <p>{challenge.Challenger.Person.user.username}</p>
                      <p>{challenge.Challenger.Person.TennisId}</p>

                      <p className="text-lg font-semibold mb-2">Challenged:</p>
                      <p>{challenge.Challenged.Person.user.username}</p>
                      <p>{challenge.Challenged.Person.TennisId}</p>

                      <p className="text-lg font-semibold mb-2">Status:</p>
                      <p>{challenge.Status}</p>

                      {challenge.Status === 'Pendente' && (
                        <div className="mt-2 space-x-2">
                          <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                            onClick={() =>
                              handleAcceptChallenge(challenge.id)
                            }
                          >
                            Aceitar
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                            onClick={() =>
                              handleDeclineChallenge(challenge.id)
                            }
                          >
                            Recusar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Wrapper>
      </section>
    </section>
  );
};

export default ChallengesScreen;