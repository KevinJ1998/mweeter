import { getAuth } from "@firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "@firebase/firestore";
import { db } from "../config/firebase.config";
import { User } from "../context/AuthContext";

export type Mweet = {
  text: string;
  uid: string;
  createdAt?: string;
  uniqueId?: string;
  name?: string;
  photo?: string;
};

export type Follower = User & {
  id?: string;
  userId?: string;
};

export const addMweet = async ({ text, uid }: Mweet) => {
  return await addDoc(collection(db, "mweets"), {
    text,
    uid,
    createdAt: serverTimestamp(),
  });
};

export const queryMweetsByUser = () => {
  return query(collection(db, "mweets"), orderBy("createdAt", "desc"));
};

export const getAllUsers = () => {
  return getDocs(collection(db, "users"));
};

export const getUserById = (uid: string) => {
  return getDoc(doc(db, "users", `${uid}`));
};

export const queryFollowers = (uid: string) => {
  return query(collection(db, "users", `${uid}`, "followers"));
};

export const addFollower = async (uid: string, follower: Follower) => {
  return await addDoc(collection(db, "users", `${uid}`, "followers"), {
    ...follower,
  });
};

export const removeFollower = async (uid: string, followerId: string) => {
  return await deleteDoc(
    doc(db, "users", `${uid}`, "followers", `${followerId}`)
  );
};

export const updateUserInfo = async (uid: string, info: any) => {
  return await setDoc(
    doc(db, "users", `${uid}`),
    {
      ...info,
    },
    { merge: true }
  );
};
