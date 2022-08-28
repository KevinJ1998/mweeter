import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { onSnapshot } from "@firebase/firestore";
import { useErrorHandler } from "react-error-boundary";

import {
  Follower,
  queryFollowers,
  removeFollower,
} from "../services/firebase.service";
import { useAuth } from "../context/AuthContext";
import { withProtected } from "../hooks/auth";
import UserCard from "../components/UserCard";

const Following: NextPage = () => {
  const handleError = useErrorHandler();
  const { user: currentUser } = useAuth();
  const [following, setFollowing] = useState<Follower[]>([]);

  const unfollow = async (follower: Follower) => {
    try {
      await removeFollower(currentUser.uid, follower.id!);
    } catch (e) {
      handleError(e);
    }
  };

  const renderFollowingUsers = (user: Follower, index: number) => {
    const isFollowing =
      following.filter((follower) => follower.userId === user?.userId).length >
      0;
    return (
      <div key={index} className={"border-t mt-4"}>
        <UserCard
          user={user}
          onClick={() => unfollow(user)}
          buttonFollowingText={isFollowing ? "following" : "follow"}
        />
      </div>
    );
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      queryFollowers(currentUser.uid),
      (snapshot) => {
        const followingArr: Follower[] = [];
        snapshot.forEach((followerDoc) => {
          followingArr.push({
            ...followerDoc.data(),
            id: followerDoc.id,
          } as Follower);
        });
        setFollowing(followingArr);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <>
      <Head>
        <title>Mweeter - Following</title>
        <link rel="icon" href="/mweeter-logo.ico" />
      </Head>
      <div className={"ml-64 p-10"}>
        <p className={"text-2xl font-bold"}>People you follow</p>
        <div className={"mt-3.5 w-3/5 flex grid grid-cols-2 gap-2 space-x-4"}>
          {following.map(renderFollowingUsers)}
        </div>
      </div>
    </>
  );
};

export default withProtected(Following);
