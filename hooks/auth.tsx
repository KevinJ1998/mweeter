import React from "react";
import { NextComponentType } from "next";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Routes from "../utils/Routes";

type NexComponentTypeExt = NextComponentType & {
  auth?: any;
};

export function withPublic(Component: NexComponentTypeExt) {
  return function WithPublic(props: any) {
    const auth = useAuth();
    const router = useRouter();
    if (auth.user) {
      router.replace(Routes.HOME);
      return <h1>Loading...</h1>;
    }

    return <Component auth={auth} {...props} />;
  };
}

export function withProtected(Component: NexComponentTypeExt) {
  return function WithProtected(props: any) {
    const auth = useAuth();
    const router = useRouter();
    if (!auth.user) {
      router.replace(Routes.LOGIN);
      return <h1>Loading...</h1>;
    }

    return <Component auth={auth} {...props} />;
  };
}
