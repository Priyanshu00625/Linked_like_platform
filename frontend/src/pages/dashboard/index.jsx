import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, getAllPosts } from "../../config/redux/action/postAction";
import {
  getAboutUser,
  getAllUsers,
} from "../../config/redux/action/authAction";
import Userlayout from "../layout/userlayout";
import DashboardLayout from "../layout/dashboardlayout";
import { BASE_URL } from "../../config";

export default function Dashboard() {

  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state)=>state.posts)

  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere]);

  const [postContent, setPostContent] = useState("");
  const [fileContent , setFileContent] = useState();
  const handleUpload = async ()=>{
    await dispatch(createPost({file:fileContent , body:postContent}))
  }
  if (authState.user) {
    return (
      <Userlayout>
        <DashboardLayout>
          <div className="">
            <div className=" flex  gap-6 shadow pl-20 mr-10 rounded-3xl relative py-2.5">
              <img
                src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
                alt=""
                className="rounded-full h-13"
              />
              <textarea
                name=""
                id=""
                className="border w-100 rounded-3xl text-center"
                placeholder={"what's in your mind"}
                onChange={(e) => {
                  setPostContent(e.target.value);
                }}
                value={postContent}
                ></textarea>
              <label htmlFor="fileUpload">
                <div className="fab text-white bg-blue-700 rounded-full mt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-8 ">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
              </label>
              <input type="file" hidden id="fileUpload" onChange={(e)=>{setFileContent(e.target.files[0])}} />
              {postContent.length > 0 &&  <div className="absolute ml-120 mt-15 bg-blue-800 text-white rounded-2xl p-3" onClick={handleUpload}>
                Post
              </div>}
               </div>
             <div className="Post-container flex w-full mt-20 flex-row">
              {postState.posts.map((post)=>{

                return(
                  <div key={post._id} className="border-b flex">
                   <div className="single_card_container flex text-center gap-2 ">
                    <img src={`${BASE_URL}/${authState.user.userId.profilePicture}`} alt="" className="rounded-[50%] w-[20%]"/>
                    <div className="">
                    <p className="text-cente font-bold">{post.userId.name}</p>
                    <p className="text-gray-500 text-sm">@{post.userId.username}</p>
                    <p>{post.body}</p>
                    <div>
                      <img  src={`${BASE_URL}/${post.media}`} alt="" />
                    </div>
                    </div>
                   </div>
                  </div>
                )
              })}
            
            </div>
          </div>
        </DashboardLayout>
      </Userlayout>
    );
  } else {
    return (
      <Userlayout>
        <DashboardLayout>
          <div>
            <div className="create_post_container">
              <h1>Loading</h1>
            </div>
          </div>
        </DashboardLayout>
      </Userlayout>
    );
  }
}
