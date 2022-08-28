import React from "react";
import { NextPage } from "next";
import { useErrorHandler } from "react-error-boundary";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { withProtected } from "../hooks/auth";
import { updateUserInfo } from "../services/firebase.service";

type UserInfo = {
  name?: string;
  lastname?: string;
  uniqueId?: string;
};

const Profile: NextPage = () => {
  const { user } = useAuth();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<UserInfo>();
  const handleError = useErrorHandler();
  const infoUpdatedAlert = () => toast.success("Info updated");

  const updateInfo: SubmitHandler<UserInfo> = async (data) => {
    const name = data.name! + " " + data.lastname;
    try {
      await updateUserInfo(user.uid, {
        name,
        uniqueId: data.uniqueId,
      });
      infoUpdatedAlert();
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <div className={"ml-64 p-10"}>
      <p className={"text-2xl font-bold"}>Your Profile</p>
      <div className={"mt-5"}>
        <form onSubmit={handleSubmit(updateInfo)}>
          <div className={"flex flex-row w-3/5 space-x-6"}>
            <div className={"flex flex-col w-1/2 space-y-2"}>
              <label className={"text-sm font-bold"} htmlFor="name">
                Name
              </label>
              <input
                {...register("name", { required: true })}
                className={"border rounded-md p-1 text-gray-500"}
                type="text"
                name="name"
                defaultValue={user.name.split(" ")[0] || user.name}
              />
            </div>
            <div className={"flex flex-col w-1/2 space-y-2"}>
              <label className={"text-sm font-bold"} htmlFor="lastname">
                Lastname
              </label>
              <input
                {...register("lastname")}
                className={"border rounded-md p-1 text-gray-500"}
                type="text"
                name="lastname"
                defaultValue={`${user.name.split(" ")[1] || ""} ${
                  user.name.split(" ")[2] || ""
                }`}
              />
            </div>
          </div>
          <div>
            {errors.name && (
              <p className={"text-xs text-red-400"}>
                This field can not be blank
              </p>
            )}
          </div>
          <div className={"flex flex-col mt-4 w-[29%] space-y-2"}>
            <label className={"text-sm font-bold"} htmlFor="uniqueId">
              Your handle (username)
            </label>
            <input
              {...register("uniqueId", { required: true })}
              className={"border rounded-md p-1 text-gray-500"}
              type="text"
              name="uniqueId"
              defaultValue={user.uniqueId}
            />
            {errors.uniqueId && <p>{errors.uniqueId.message}</p>}
          </div>
          <div className={"flex flex-col mt-4 w-[29%] space-y-2"}>
            <label className={"text-sm font-bold"} htmlFor="email">
              Email
            </label>
            <input
              className={"border rounded-md p-1 text-gray-500"}
              type="text"
              readOnly
              disabled
              value={user.email}
            />
          </div>
          <div className={"mt-4"}>
            <button
              className={
                "bg-indigo-500 hover:bg-indigo-400 rounded-lg text-white w-40 h-12 font-semibold"
              }
              type="submit"
            >
              Update Info
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withProtected(Profile);
