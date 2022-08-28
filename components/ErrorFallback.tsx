import React from "react";

const ErrorFallback: React.FC<any> = ({ error, resetErrorBoundary }) => {
  return (
    <div
      role="alert"
      className={"flex flex-col justify-center items-center h-screen w-screen"}
    >
      <div>
        <p className={"text-center font-bold text-3xl m-7"}>
          Something went wrong:
        </p>
        <pre className={"text-xl text-center text-gray-500"}>
          {error.message}
        </pre>
      </div>
      <div className={"m-7"}>
        <button
          className={
            "bg-indigo-500 w-36 h-10 rounded-lg text-white hover:bg-indigo-400"
          }
          onClick={resetErrorBoundary}
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
