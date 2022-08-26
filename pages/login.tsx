import React from "react";
import { NextPage } from "next";
import { useErrorHandler } from "react-error-boundary";

import { useAuth } from "../context/AuthContext";
import { withPublic } from "../hooks/auth";

const Login: NextPage = () => {
  const { signInWithGoogle } = useAuth();
  const handleError = useErrorHandler();

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (e: any) {
      handleError(e);
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
