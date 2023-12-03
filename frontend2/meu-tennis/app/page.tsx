"use client";

import React, { useState } from 'react';

import Image from "next/image";
import Wrapper from "@/components/wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TennisBall from "@/public/images/MeuBall.png";
import CustomModal from '@/components/Modal';
import RegisterPersonScreen from '@/components/RegisterPersonScreen';

export default function Home() {
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);

  return (
    
    <section className="flex flex-col lg:flex-row">
      <section className="flex h-screen w-full flex-col justify-between p-9 lg:h-auto">
        <Wrapper>
          <div className="mx-auto flex max-w-sm flex-col justify-between">
            <span
              className={`-mt-14 inline-block text-[64px] font-bold text-black dark:text-white`}
            >
              MeuTennis™
            </span>
            <p className="pb-6 font-medium">
              Bla bla bla
            </p>

            <div className="">
              <button
                className="mt-5 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setRegisterModalVisible(true)}
              >
                Cadastro de novo pereba
                {/* <Icons.logout /> */}
              </button>
            </div>
          </div>
        </Wrapper>
      </section>

      {/* second half */}

      {/* <section className="hidden lg:flex h-screen w-full flex-col justify-center items-center bg-[#d6ebe9] p-9">
        <Image src={TennisBall} alt="Man sitting in wheelchair" />
      </section> */}

    <section className="hidden lg:flex h-screen w-full flex-col justify-center items-center bg-[#d6ebe9] p-9">
       <div className='max-h-[50%]'>
        <Image src={TennisBall} objectFit='contain' alt="TennisBall"/>
        </div>
    </section>


      <CustomModal
        isVisible={isRegisterModalVisible}
        onClose={() => setRegisterModalVisible(false)}
        modalText={``}
      >
        <RegisterPersonScreen/>
      </CustomModal>
    </section>
  );
}
