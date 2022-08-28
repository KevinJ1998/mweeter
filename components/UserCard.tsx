import React from "react";
import Image from "next/image";

import { User } from "../context/AuthContext";
import { Follower } from "../services/firebase.service";

type UserCardProps = {
  user: User | Follower;
  onClick: () => void;
  buttonFollowingText: string;
};

const UserCard: React.FC<UserCardProps> = ({
  user,
  onClick,
  buttonFollowingText,
}) => {
  return (
    <div className={"mt-3.5 flex flex-row items-center space-x-2"}>
      <div className={"w-1/4"}>
        <Image
          className="rounded-full"
          src={user?.photo || "/blank-profile-picture.png"}
          alt={user?.name}
          width={35}
          height={35}
        />
      </div>
      <div className={"w-full"}>
        <p className={"font-semibold"}>{user?.name}</p>
        <p className={"text-sm text-gray-500"}>{user?.uniqueId}</p>
      </div>
      <div className={"text-right justify-end"}>
        <button
          className={
            "text-xs font-semibold rounded-full border border-gray-400 p-1 w-20"
          }
          onClick={onClick}
        >
          {buttonFollowingText}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
