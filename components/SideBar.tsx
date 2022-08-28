import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useErrorHandler } from "react-error-boundary";
import { useRouter } from "next/router";

import { useAuth } from "../context/AuthContext";

import Routes from "../utils/Routes";

import HomeIcon from "./HomeIcon";
import LogOutIcon from "./LogOutIcon";
import LikeIcon from "./LikeIcon";

const SIDE_BAR_OPTIONS = [
  {
    name: "Home",
    link: Routes.HOME,
    icon: <HomeIcon />,
  },
  {
    name: "Following",
    link: Routes.FOLLOWING,
    icon: <LikeIcon />,
  },
  {
    name: "Your Profile",
    link: Routes.PROFILE,
    icon: <HomeIcon />,
  },
];

const SideBar: React.FC = () => {
  const { user, logout } = useAuth();
  const handleError = useErrorHandler();
  const router = useRouter();

  const signOut = async () => {
    try {
      await logout();
    } catch (e: any) {
      handleError(e);
    }
  };
  return (
    <>
      {user && (
        <div
          className={
            "h-full w-56 fixed z-[1] top-0 left-0 pt-5 hidden:overflow-x-scroll bg-gray-100 border-r-2 border-r-gray-200"
          }
        >
          <div>
            <p className={"ml-3 mb-5 text-2xl text-sky-600 font-bold"}>
              mweeter
            </p>
          </div>
          {SIDE_BAR_OPTIONS.map((option, index) => (
            <Link key={index} href={option.link}>
              <div
                key={index}
                className={`flex flex-row ml-3 mt-2 pt-1.5 pr-2 pb-1.5 pl-4 hover:bg-gray-200 hover:cursor-pointer w-4/5 rounded-lg ${
                  router.pathname === option.link ? "bg-gray-200" : null
                }`}
              >
                {option.icon}
                <a className={"text-sm font-semibold ml-2"}>{option.name}</a>
              </div>
            </Link>
          ))}

          <div
            className={
              "flex flex-row ml-3 mt-2 mb-2 pt-1.5 pr-2 pb-1.5 pl-4 hover:bg-gray-200 w-4/5 rounded-lg"
            }
          >
            <LogOutIcon />
            <button className={"text-sm font-semibold ml-2"} onClick={signOut}>
              LogOut
            </button>
          </div>
          <hr className={"m-auto w-4/5 border-gray-200"} />
          <Link href={Routes.PROFILE}>
            <div className={"mt-4 ml-5 flex items-center space-x-2"}>
              <Image
                className="rounded-full hover:cursor-pointer"
                src={user.photo}
                width={35}
                height={35}
                alt={user.name}
              />
              <div>
                <a className={"text-sm font-semibold hover:cursor-pointer"}>
                  {user.name}
                </a>
                <p
                  className={
                    "text-xs text-gray-400 hover:underline hover:cursor-pointer"
                  }
                >
                  {user.uniqueId}
                </p>
              </div>
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default SideBar;
