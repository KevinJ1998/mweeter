import React from "react";
import { NextPage } from "next";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import Routes from "../utils/Routes";
import { withPublic } from "../hook/auth";

const Login: NextPage = () => {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();
  const signIn = async () => {
    try {
      await signInWithGoogle();
      router.push(Routes.HOME);
    } catch (e: any) {
      console.log("error", e);
    }
  };
  return (
    <div>
      <div>
        <h1>nweeter</h1>
      </div>
      <div>
        <button onClick={signIn}>SignIn with Google</button>
      </div>
    </div>
  );
};

export default withPublic(Login);
