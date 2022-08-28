import React, { useState } from "react";
import { NextPage } from "next";
import { useErrorHandler } from "react-error-boundary";

import { useAuth } from "../context/AuthContext";
import { withPublic } from "../hooks/auth";
import MweeterLogo from "../components/MweeterLogo";
import GoogleIcon from "../components/GoogleIcon";

const Login: NextPage = () => {
  const { signInWithGoogle } = useAuth();
  const handleError = useErrorHandler();
  const [loading, setLoading] = useState<boolean>(false);

  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      setLoading(false);
    } catch (e: any) {
      handleError(e);
    }
  };
  return (
    <div
      className={
        "flex flex-col justify-center items-center h-screen w-screen pt-56"
      }
    >
      <div className={"pb-12"}>
        <MweeterLogo />
        <p className={"text-2xl font-bold text-slate-900"}>mweeter</p>
      </div>
      <div>
        <button
          className={
            "border w-54 flex rounded-lg text-center py-1 px-3 hover:bg-gray-200"
          }
          onClick={signIn}
          disabled={loading}
        >
          <GoogleIcon />
          <p className={"ml-1 self-center text-gray-500"}>
            Sign In with Google
          </p>
        </button>
      </div>
    </div>
  );
};

export default withPublic(Login);
