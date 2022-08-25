import { addDoc, collection } from "@firebase/firestore";
import { db } from "../config/firebase.config";
import { serverTimestamp } from "@firebase/firestore";

type Mweet = {
  content: string;
  uid: string;
};

export const addMweet = async ({ content, uid }: Mweet) => {
  return await addDoc(collection(db, "mweets"), {
    text: content,
    uid,
    createdAt: serverTimestamp(),
  });
};
