"use client";
import { useState } from 'react';
import axios from 'axios';

const storage = localStorage;
const decodeJWT = (token) => {
    try {
      // Extract the payload from the token (between the second and third dots)
      console.log(token)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(base64);
  
      // Parse the JSON payload
      const parsedPayload = JSON.parse(decodedPayload);
  
      return parsedPayload;
    } catch (error) {
      console.error('Error decoding JWT', error);
      return null;
    }
  };

const Login = () => {
//  const [email, setEmail] = useState('');
//  const [password, setPassword] = useState('');
//  const [code, setCode] = useState('');
//  const [rememberMe, setRememberMe] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

//   const { updateUsername } = useUser();
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false)

 const handleLogin = async () => {
    try {
      axios.defaults.baseURL = 'http://localhost:8000/'
      const response = await axios.post('login', {
        username: username,
        password: password,
      });

      console.log("login!")
      const access_token = response.data.access;
      const refresh_token = response.data.refresh;

      // Store the token for future requests or user sessions
      console.log(access_token)

      storage.setItem('access_token', access_token);

      storage.setItem('refresh_token', refresh_token);
      const decodedJWT = decodeJWT(access_token);
      console.log(decodedJWT)
      storage.setItem('username', decodedJWT.username);
    //   updateUsername(decodedJWT.username)
      // Navigate to the main screen or perform other actions
      // e.g., navigation.navigate('MainScreen');
      setSuccessModalVisible(true);
    } catch (error) {
      console.log("123")
      // console.error('Login failed', error);
      //toast(options); // easy to use
      //alert('Login Failed', 'Please check your username and password.');
    }
 };

 const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
    console.log('Form submitted');
 };

 return (
    // <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
    
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entre na sua conta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value={rememberMe} />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="username"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
 );
}

export default Login;
