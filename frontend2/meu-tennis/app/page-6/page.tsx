"use client";

import Image from "next/image";
import Wrapper from "@/components/wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

import manWIthRobot from "@/public/images/man-with-robot.png";

export default function Home() {
  return (
    <section className="flex flex-col lg:flex-row">
      <section className="flex h-screen w-full flex-col justify-between p-9 lg:h-auto">
        <Wrapper>
          <div className="mx-auto flex max-w-sm flex-col justify-between">
            <span
              className={`-mt-14 inline-block text-[64px] font-bold text-black dark:text-white`}
            >
              algo aqui
            </span>
            <p className="pb-6 font-medium">
              kkkk
            </p>

            <div className="">
              <Link href={'/page-5'} passHref>
                <Button
                  className={`text-sm font-bold rounded-3xl bg-zinc-900 text-white dark:bg-white px-7 py-2 dark:text-black`}
                >
                  <span className="">Next</span>
                </Button>
              </Link>
            </div>
          </div>
        </Wrapper>
      </section>

      {/* second half */}

      <section className="hidden lg:flex h-screen w-full flex-col justify-center items-center bg-[#e0f5ff] p-9">
        <Image src={manWIthRobot} alt="Man sitting in wheelchair" />
      </section>
    </section>
  );
}
