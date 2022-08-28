import React, { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { useErrorHandler } from "react-error-boundary";

import { useAuth } from "../context/AuthContext";
import { withPublic } from "../hooks/auth";
import GoogleIcon from "../components/GoogleIcon";
import MicrosoftIcon from "../components/MicrosoftIcon";
import MweeterLogo from "../components/MweeterLogo";

const Login: NextPage = () => {
  const { signInWithGoogle, sigInWithMicrosoft } = useAuth();
  const handleError = useErrorHandler();
  const [loading, setLoading] = useState<boolean>(false);

  const logInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      setLoading(false);
    } catch (e: any) {
      handleError(e);
    }
  };

  const logInWithMicrosoft = async () => {
    setLoading(true);
    try {
      await sigInWithMicrosoft();
      setLoading(false);
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <div
      className={
        "flex flex-col justify-center items-center h-screen w-screen pt-56"
      }
    >
      <Head>
        <title>Mweeter - Login</title>
        <link rel="icon" href="/mweeter-logo.ico" />
      </Head>
      <div className={"pb-12"}>
        <MweeterLogo />
        <p className={"text-2xl font-bold text-slate-900"}>mweeter</p>
      </div>
      <div className={"flex space-x-2"}>
        <div>
          <button
            className={
              "border w-54 flex rounded-lg text-center py-1 px-3 hover:bg-gray-200"
            }
            onClick={logInWithGoogle}
            disabled={loading}
          >
            <GoogleIcon />
            <p className={"ml-1 self-center text-gray-500"}>
              Sign In with Google
            </p>
          </button>
        </div>
        <div>
          <button
            className={
              "border w-54 flex rounded-lg text-center py-1 px-3 hover:bg-gray-200"
            }
            onClick={logInWithMicrosoft}
            disabled={loading}
          >
            <MicrosoftIcon />
            <p className={"ml-2 self-center text-gray-500"}>
              Sign In with Microsoft
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default withPublic(Login);
