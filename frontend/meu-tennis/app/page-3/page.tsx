"use client";

import React, { useState, useEffect } from 'react';
import Wrapper from '@/components/wrapper';
import SocketClient from '@/components/SocketClient';

const ChallengesScreen = () => {
  const [challenges, setChallenges] = useState([]);
  const [gettingChallenged, setGettingChallenged] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const localUsername = '';
  
  const sendMessageSocket = async (data) => {
    const socketClient = new SocketClient();
    socketClient.connectSendRecvClose(data)
    socketClient.client.addEventListener('message', async (event) => {

      const receivedData = await JSON.parse(event.data);
      console.log('Received data from server:', receivedData);
    });
  };

  //Challenging
  const fetchUserChallenges = async () => {
    const token = localStorage.getItem('access_token');
    const data = "getChallenging " + token
    const socketClient = new SocketClient();
    socketClient.connectSendRecvStayOpen(data)

    socketClient.client.addEventListener('message', async (event) => {

      const receivedData = await JSON.parse(event.data);
      console.log('Received data from server:', receivedData);
      setChallenges(receivedData)
      setLoading(false);
    });
  };
  //current_user_challenges
  const fetchUserGettingChallenged = async () => {
    const token = localStorage.getItem('access_token');
    const data = "getChallenges " + token
    const socketClient = new SocketClient();
    socketClient.connectSendRecvStayOpen(data)

    socketClient.client.addEventListener('message', async (event) => {

      const receivedData = await JSON.parse(event.data);
      console.log('Received data from server:', receivedData);
      setGettingChallenged(receivedData)
      setLoading(false);
    });
  };

  const handleRefresh = () => {
    setLoading(true);

    fetchUserChallenges();
    fetchUserGettingChallenged();
    setLoading(false);


  };

  const handleCancelChallenge = async (challengeId) => {
    try {
      console.log(challengeId)
      sendMessageSocket("changeChallengeStatus " + challengeId + " Cancelado")
      handleRefresh(); 
    } catch (error) {
      console.error('Error canceling challenge:', error);
    }
  };

  const handleAcceptChallenge = async (challengeId) => {
    try {
      console.log(challengeId)
      sendMessageSocket("changeChallengeStatus " + challengeId + " Aceito")
      handleRefresh(); 
    } catch (error) {
      console.error('Error canceling challenge:', error);
    }
  };

  const handleDeclineChallenge = async (challengeId) => {
    handleCancelChallenge(challengeId)
  };

  useEffect(() => {
    // setLoading(true);
    fetchUserChallenges();
    fetchUserGettingChallenged();
    setLoading(false);


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
                  {Array.isArray(challenges) && challenges
                    .filter((challenge) => challenge.Status !== 'Cancelado')
                    .map((challenge) => (
                      <div

                        key={challenge.id}
                        className={`bg-white p-4 rounded-md shadow-md ${localUsername ===
                            challenge.Challenger.Person.user.username
                            ? 'border-2 border-blue-500' // challenger
                            : 'border-2 border-red-500' // challenged
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
                  {Array.isArray(gettingChallenged) && gettingChallenged
                    .filter((challenge) => challenge.Status !== 'Cancelado')
                    .map((challenge) => (
                      <div
                        key={challenge.id}
                        className={`bg-white p-4 rounded-md shadow-md ${localUsername ===
                            challenge.Challenger.Person.user.username
                            ? 'border-2 border-red-500' // challenger
                            : 'border-2 border-blue-500' // challenged
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


