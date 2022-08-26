import { getAuth } from "@firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "@firebase/firestore";
import { db } from "../config/firebase.config";
import { User } from "../context/AuthContext";

export type Mweet = {
  text: string;
  uid: string;
  createdAt?: string;
};

export type Follower = User & {
  userId?: string;
};

export const addMweet = async ({ text, uid }: Mweet) => {
  return await addDoc(collection(db, "mweets"), {
    text,
    uid,
    createdAt: serverTimestamp(),
  });
};

export const queryMweetsByUser = (uid: string) => {
  return query(
    collection(db, "mweets"),
    where("uid", "==", `${uid}`),
    orderBy("createdAt", "desc")
  );
};

export const getAllUsers = () => {
  return getDocs(collection(db, "users"));
};

export const getFollowers = async (uid: string) => {
  return await getDocs(collection(db, "users", `${uid}`, "followers"));
};

export const addFollower = async (uid: string, follower: Follower) => {
  return await addDoc(collection(db, "users", `${uid}`, "followers"), {
    ...follower,
  });
};
