import React from "react";

const Loading: React.FC = () => (
  <div className={"flex justify-center items-center h-full w-full"}>
    <div
      className={
        "border-8 border-gray-500 border-t-8 border-t-sky-600 rounded-[50%] w-12 h-12 animate-spin mt-48"
      }
    />
  </div>
);

export default Loading;
