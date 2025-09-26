import Link from "next/link";
import { Router, useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "../../../config/redux/reducer/authReducer";

export default function navbarComponent() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const router = useRouter();
  return (
    <div className="grid grid-cols-2 w-full h-20 shadow-lg shadow-blue bg-white fixed">
      {!authState.profileFatched && (
        <>
          <div className=" mt-auto mb-auto ml-10">
            <Link href={"/"} className="p-4">
              Home
            </Link>
            <Link href={""} className="p-4">
              Blog
            </Link>
            <Link href={""} className="p-4">
              Connections
            </Link>
            <Link href={""} className="p-4">
              connections
            </Link>
            <Link href={""} className="p-4">
              connections
            </Link>
          </div>
<div className="text-end mt-auto mb-auto mr-30">
            <button
              className="mr-10 border-0 p-2 rounded-4xl bg-amber-300 "
              onClick={() => {
                router.push("/login");
                dispatch(reset())
              }}>
              Login
            </button>
            <button className="border-0 p-2 rounded-4xl ">signup</button>
          </div>
          </>
      )}
          

      {authState.profileFatched && <div className="flex justify-end col-span-2 mr-20 gap-10">
        <div className="flex mt-7  gap-2.5"><p>{authState.user.userId.name}</p>
        <p className="font-bold">profile</p>
        </div>
        <button className="border rounded-3xl m-5 p-2 bg-red-600 text-white" onClick={()=>{localStorage.removeItem("token")
          router.push("/login")
        }}>Loged Out</button>
        </div>}
    </div>
  );
}
