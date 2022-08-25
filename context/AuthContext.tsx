import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "@firebase/auth";
import { addDoc, collection, doc, getDoc, setDoc } from "@firebase/firestore";

import { auth, db } from "../config/firebase.config";

const AuthContext = createContext<any>({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const splitName = user.providerData[0].displayName?.split(" ");
        const uniqueId =
          splitName?.length != undefined && splitName.length > 1
            ? `@${splitName![0][0].toLowerCase()}${splitName![1].toLowerCase()}`
            : `@${user.providerData[0].displayName?.toLowerCase()}`;
        setUser({
          displayName: user.providerData[0].displayName,
          email: user.providerData[0].email,
          uid: user.uid,
          uniqueId,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    const { user: userAuth } = await signInWithPopup(auth, googleProvider);
    const usersSnap = await getDoc(doc(db, "users", `${user.uid}`));

    if (!usersSnap.exists()) {
      try {
        const splitName = user.providerData[0].displayName?.split(" ");
        const uniqueId =
          splitName?.length != undefined && splitName.length > 1
            ? `@${splitName![0][0].toLowerCase()}${splitName![1].toLowerCase()}`
            : `@${userAuth.providerData[0].displayName?.toLowerCase()}`;
        await setDoc(doc(db, "users", `${user.uid}`), {
          email: userAuth.providerData[0].email,
          name: userAuth.providerData[0].displayName || "",
          photo: userAuth.providerData[0].photoURL || "",
          uniqueId,
        });
        setUser({ ...user, uniqueId });
      } catch (e: any) {
        console.log("error", e);
      }
    }
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, logout, signInWithGoogle }}>
      {loading ? "Loading" : children}
    </AuthContext.Provider>
  );
};
