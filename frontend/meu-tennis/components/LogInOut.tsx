"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Icons } from "@/components/icons";
import { useTheme } from "next-themes";
import Login from "./Login";
import CustomModal from './Modal';

const storage = localStorage;

export default function LogInOut() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isLogoutSuccessModalVisible, setLogoutSuccessModalVisible] = useState(false);
  const handleLogout= async () => {
    try {
      console.log("logout!")

      storage.removeItem('access_token');

      storage.removeItem('refresh_token');
 
      storage.removeItem('username');
      storage.removeItem('userid');
      //   updateUsername('');  
      setLogoutSuccessModalVisible(true);
      router.push('/')
      // alert('Logout!')

      
    } catch (error) {
      console.error('Logout failed', error);
      alert('Logout Failed')
    }
  };

  return (
    <div className="flex border items-center bg-[#fafafa] shado dark:bg-[#111] dark:border-zinc-800 p-2 px-4 w- justify-between rounded-full">
      {/* <button
        className={`mr-2 p-1 dark:text-zinc-500 text-zinc-700 ${
          theme === "system"
            ? "bg-white dark:bg-[#333] text-zinc-50 rounded-full shadow-xl"
            : ""
        }`}
        onClick={() => setTheme("system")}
      >
        <Icons.monitor classes="" />
      </button> */}
      <button
        className={`mr-2 p-1 dark:text-zinc-500 text-green-700 ${
          theme === "dark"
            ? "bg-white dark:bg-[#333] text-green-700 rounded-full shadow-xl"
            : ""
        }`}
        onClick={() => setLoginModalVisible(true)}
      >
        <Icons.login />
      </button>

      <button
        className={`mr-2 p-1 dark:text-zinc-500 text-red-700 ${
          theme === "light"
            ? "bg-white dark:bg-[#333] text-red-700 rounded-full shadow-xl"
            : ""
        }`}
        onClick={() => handleLogout()}
      >
        <Icons.logout/>
      </button>
      
      <CustomModal
        isVisible={isLoginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        modalText={''}
      >
       
        <div>
          <Login/>
        </div>
      </CustomModal>

       <CustomModal
        isVisible={isLogoutSuccessModalVisible}
        onClose={() => setLogoutSuccessModalVisible(false)}
        modalText={'Deslogado'}
      ></CustomModal>
    </div>
  );
}


