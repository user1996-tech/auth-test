import React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import Image from "next/image";

const NavBar = () => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  return (
    <div className="w-full h-[100px] bg-gray-200 px-5 flex justify-end py-5">
      {user ? (
        <>
          {/* Logout Button and User profile */}
          <div className="space-x-5 flex">
            <div
              className=" rounded-lg border-2 border-black px-5 py-5  justify-center items-center cursor-pointer flex hover:border-gray-200 hover:bg-black hover:text-white transition duration-300"
              onClick={() => {
                router.push("/api/auth/logout");
              }}
            >
              <p>Logout</p>
            </div>

            <div className="h-full aspect-square rounded-full overflow-hidden">
              {user.picture ? (
                <Image
                  src={user.picture}
                  alt=""
                  width={100}
                  height={100}
                  className="object-contain object-center rounded-full overflow-hidden"
                />
              ) : (
                <div className="w-full h-full bg-blue-200" />
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Login Button */}
          <div
            className=" rounded-lg border-2 border-black px-5 py-5  justify-center items-center cursor-pointer flex hover:border-gray-200 hover:bg-black hover:text-white transition duration-300"
            onClick={() => {
              router.push("/api/auth/login");
            }}
          >
            <p>Login</p>
          </div>
        </>
      )}
    </div>
  );
};

export default NavBar;
