import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { format, formatDistanceToNowStrict } from "date-fns";
import { onSnapshot } from "@firebase/firestore";
import { useErrorHandler } from "react-error-boundary";
import { useForm, SubmitHandler } from "react-hook-form";

import {
  addFollower,
  addMweet,
  getAllUsers,
  queryFollowers,
  queryMweetsByUser,
  Follower,
  Mweet,
  removeFollower,
} from "../services/firebase.service";
import { useAuth, User } from "../context/AuthContext";
import { withProtected } from "../hooks/auth";
import UserCard from "../components/UserCard";
import Image from "next/image";

type FormValues = {
  mweet: string;
};

const Home: NextPage = () => {
  const { user: currentUser } = useAuth();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormValues>();
  const handleError = useErrorHandler();
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [mweets, setMweets] = useState<Mweet[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const handleClick = async (isFollowing: boolean, user: User) => {
    if (isFollowing) {
      await unfollow(user);
    } else {
      await follow(user);
    }
  };

  const follow = async (follower: User) => {
    try {
      await addFollower(currentUser.uid, {
        userId: follower?.uid,
        name: follower?.name!,
        photo: follower?.photo!,
        email: follower?.email!,
        uniqueId: follower?.uniqueId!,
      });
    } catch (e) {
      handleError(e);
    }
  };

  const unfollow = async (user: User) => {
    const followedUser = followers.filter(
      (follower) => follower.userId === user?.uid
    )[0];

    try {
      await removeFollower(currentUser.uid, followedUser.id!);
    } catch (e) {
      handleError(e);
    }
  };

  const sendMweet: SubmitHandler<FormValues> = async ({ mweet }) => {
    try {
      await addMweet({ text: mweet, uid: currentUser.uid });
      reset();
    } catch (e: any) {
      handleError(e);
    }
  };

  const renderMweets = (mweet: Mweet, index: number) => (
    <div key={index} className={"flex items-start space-x-2 mt-9 mb-4"}>
      <div className={"w-11"}>
        <Image
          className={"rounded-full"}
          src={mweet.photo!}
          alt={mweet.name}
          width={35}
          height={35}
        />
      </div>
      <div className={"w-full"}>
        <div className={"flex flex-row"}>
          <p className={"text-base font-semibold"}>{mweet.name}</p>
          <p className={"text-base text-gray-500 ml-2"}>{mweet.uniqueId}</p>
          <p className={"text-base text-gray-500 list-item ml-7"}>
            {mweet.createdAt}
          </p>
        </div>
        <div>
          <p className={"text-gray-500 mt-2"}>{mweet.text}</p>
        </div>
      </div>
    </div>
  );

  const renderUsers = (user: User, index: number) => {
    const isFollowing =
      followers.filter((follower) => follower.userId === user?.uid).length > 0;
    return (
      <div key={index} className={"w-4/5 border-t mb-7"}>
        <UserCard
          user={user}
          onClick={() => handleClick(isFollowing, user)}
          buttonFollowingText={isFollowing ? "following" : "follow"}
        />
      </div>
    );
  };

  useEffect(() => {
    const followersId: string[] = [];
    const usersArr: User[] = [];

    const getUsersData = async () => {
      const usersSnap = await getAllUsers();

      usersSnap.forEach((userDoc) => {
        if (userDoc.id !== currentUser.uid) {
          usersArr.push({ ...userDoc.data(), uid: userDoc.id } as User);
        }
      });

      setUsers(usersArr);
    };

    getUsersData();

    const unsubscribeFollowers = onSnapshot(
      queryFollowers(currentUser.uid),
      (snapshot) => {
        const followersArr: Follower[] = [];
        snapshot.forEach((follower) => {
          followersArr.push({
            ...follower.data(),
            id: follower.id,
          } as Follower);
          followersId.push(follower.data().userId);
        });
        setFollowers(followersArr);
      }
    );

    const unsubscribeMweets = onSnapshot(queryMweetsByUser(), (snapshot) => {
      const mweetsArr: Mweet[] = [];
      snapshot.forEach((mweet) => {
        if (
          currentUser.uid === mweet.data().uid ||
          followersId.includes(mweet.data().uid)
        ) {
          const serverTimeStampDate = mweet
            .data({ serverTimestamps: "estimate" })
            .createdAt.toDate();
          const daysAgo = parseInt(
            formatDistanceToNowStrict(serverTimeStampDate, {
              unit: "day",
            }).split(" ")[0]
          );
          const user = usersArr.filter(
            (userArr) =>
              userArr?.uid ===
              followersId[followersId.indexOf(mweet.data().uid)]
          )[0];
          mweetsArr.push({
            ...mweet.data(),
            uniqueId: user ? user.uniqueId! : currentUser.uniqueId,
            photo: user ? user.photo! : currentUser.photo,
            name: user ? user.name! : currentUser.name,
            createdAt:
              daysAgo < 5
                ? `${formatDistanceToNowStrict(serverTimeStampDate)} ago`
                : format(serverTimeStampDate, "MMM d',' YYYY"),
          } as Mweet);
        }
      });
      setMweets(mweetsArr);
    });

    return () => {
      unsubscribeMweets();
      unsubscribeFollowers();
    };
  }, [currentUser]);

  return (
    <div className={"justify-center flex flex-col items-center ml-52 p-5"}>
      <Head>
        <title>Mweeter</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={"w-10/12"}>
        <div>
          <h1 className={"text-2xl font-bold"}>Your Feed</h1>
        </div>
        <div className={"mt-5 w-3/5"}>
          <form onSubmit={handleSubmit(sendMweet)}>
            <div className={"flex items-start space-x-2"}>
              <div className={"w-10"}>
                <Image
                  className={"rounded-full"}
                  src={currentUser.photo}
                  width={35}
                  height={35}
                  alt={currentUser.name}
                />
              </div>
              <div>
                <textarea
                  {...register("mweet", { maxLength: 280 })}
                  className={"border-2 rounded-md p-2"}
                  placeholder={"What's on your mind?"}
                  name="mweet"
                  cols={64}
                  rows={3}
                  maxLength={281}
                ></textarea>
                {errors.mweet?.type === "maxLength" && (
                  <p className={"text-xs text-red-400"}>
                    The max for a mweet length is 280
                  </p>
                )}
              </div>
            </div>
            <div className={"text-right mt-5"}>
              <button
                className={
                  "bg-indigo-500 hover:bg-indigo-400 rounded-lg text-white w-40 h-12 font-semibold"
                }
                type={"submit"}
              >
                Send mweet
              </button>
            </div>
          </form>
        </div>
        <div className={"mt-5 w-3/5"}>{mweets.map(renderMweets)}</div>
      </div>

      <section
        className={"h-full lg:w-96 sm:w-80 absolute z-[1] top-12 right-0 pt-5"}
      >
        <div>
          <p className={"text-2xl font-bold mb-5"}>Follow Others</p>
        </div>
        {users.map(renderUsers)}
      </section>
    </div>
  );
};

export default withProtected(Home);
