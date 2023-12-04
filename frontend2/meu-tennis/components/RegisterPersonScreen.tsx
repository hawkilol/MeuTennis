"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import CustomModal from './Modal';



const RegisterPersonScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [TennisId, setTennisId] = useState('');
  const [StandardGivenName, setStandardGivenName] = useState('');
  const [StandardFamilyName, setStandardFamilyName] = useState('');
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  
  const router = useRouter();

  const handleRegisterPerson = async () => {
    try {
      const currentDate = new Date().toISOString();
      axios.defaults.baseURL = 'http://localhost:8000/';
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
    //   console.log('Registration successful', response);
    //   alert('Registration Successful');

      // Reset input fields
      setUsername('');
      setPassword('');
      setEmail('');
      setTennisId('');
      setStandardGivenName('');
      setStandardFamilyName('');

      // Redirect to login page after successful registration
      setRegisterModalVisible(true)
      router.push('/');
    } catch (error) {
      console.error('Register failed', error);
      alert('Register Failed');
    }
  };

  return (
    <div className="flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Register</h2>
        <form className="mt-1" onSubmit={(e) => e.preventDefault()}>
          <div>
            <input
              type="text"
              placeholder="Username"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Tennis ID"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              value={TennisId}
              onChange={(e) => setTennisId(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Standard Given Name"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              value={StandardGivenName}
              onChange={(e) => setStandardGivenName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Standard Family Name"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              value={StandardFamilyName}
              onChange={(e) => setStandardFamilyName(e.target.value)}
            />
          </div>
          <button 
              className="mt-5 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleRegisterPerson}>
            Register
          </button>
        </form>
      </div>
      <CustomModal
        isVisible={isRegisterModalVisible}
        onClose={() => setRegisterModalVisible(false)}
        modalText={`Registrado com sucesso`}
      />
    </div>
  );
};

export default RegisterPersonScreen;
