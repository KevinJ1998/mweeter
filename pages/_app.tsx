import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ErrorBoundary } from "react-error-boundary";
import toast, { Toaster } from "react-hot-toast";

import { AuthContextProvider } from "../context/AuthContext";
import ErrorFallback from "../components/ErrorFallback";
import SideBar from "../components/SideBar";

function MyApp({ Component, pageProps }: AppProps) {
  const errorHandler = (error: Error, info: { componentStack: string }) => {
    toast.error("Looks like something is broken, try again");
    console.error("Error => ", error, info);
  };

  return (
    <AuthContextProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={errorHandler}>
        <SideBar />
        <Component {...pageProps} />
      </ErrorBoundary>
      <Toaster />
    </AuthContextProvider>
  );
}

export default MyApp;
