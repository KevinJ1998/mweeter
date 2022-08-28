import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { useErrorHandler } from "react-error-boundary";

import { auth, db } from "../config/firebase.config";
import { getUserById } from "../services/firebase.service";
import Loading from "../components/Loading";

export type User = {
  name: string;
  email: string;
  uid?: string;
  photo?: string;
  uniqueId: string;
} | null;

const AuthContext = createContext<any>({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const handleError = useErrorHandler();
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getUserById(user.uid);
        setUser({
          ...userDoc.data(),
          uid: user.uid,
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
    const usersSnap = await getUserById(userAuth.uid);

    if (!usersSnap.exists()) {
      try {
        const splitName = userAuth.providerData[0].displayName?.split(" ");
        const uniqueId =
          splitName?.length != undefined && splitName.length > 1
            ? `@${splitName![0][0].toLowerCase()}${splitName![1].toLowerCase()}`
            : `@${userAuth.providerData[0].displayName?.toLowerCase()}`;
        await setDoc(doc(db, "users", `${userAuth.uid}`), {
          email: userAuth.providerData[0].email,
          name: userAuth.providerData[0].displayName || "",
          photo: userAuth.providerData[0].photoURL || "",
          uniqueId,
        });
      } catch (e: any) {
        handleError(e);
      }
    }
  };

  const sigInWithMicrosoft = async () => {
    const microsoftProvider = new OAuthProvider("microsoft.com");
    const { user: userAuth } = await signInWithPopup(auth, microsoftProvider);
    const usersSnap = await getUserById(userAuth.uid);

    if (!usersSnap.exists()) {
      try {
        const splitName = userAuth.providerData[0].displayName?.split(" ");
        const uniqueId =
          splitName?.length != undefined && splitName.length > 1
            ? `@${splitName![0][0].toLowerCase()}${splitName![1].toLowerCase()}`
            : `@${userAuth.providerData[0].displayName?.toLowerCase()}`;
        await setDoc(doc(db, "users", `${userAuth.uid}`), {
          email: userAuth.providerData[0].email,
          name: userAuth.providerData[0].displayName || "",
          photo: userAuth.providerData[0].photoURL || "",
          uniqueId,
        });
      } catch (e: any) {
        handleError(e);
      }
    }
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, logout, signInWithGoogle, sigInWithMicrosoft }}
    >
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};
