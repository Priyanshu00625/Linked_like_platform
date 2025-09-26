import { useRouter } from "next/router";
import Userlayout from "./layout/userlayout";
export default function Home() {
  const router = useRouter();
  return (
    <Userlayout>
      <div className="container">
        <div className="minicontainer grid grid-cols-2 gap-5">
          <div className="miniContainer_left m-auto">
            <p className="text-5xl leading-18 bg-gradient-to-r from-black to-blue 800 p-8 bg-clip-text text-transparent">Connect with friends <br />without Exaggeration</p>
            <p className=" ml-9 text-zinc-700">A true Social media platform with stories and blufs</p>
            <div onClick={()=>{
              router.push("/login")
            }} className="buttonJoin  leading-12 border-0 text-center w-20 rounded-full mt-6 bg-blue-300 text-sm ml-9">
              <p className="">Join Now</p>
            </div>
          </div>
          <div className="minContaier_right mt-40 mr-10">
            <img src="Social_media.png" alt="image" className="bg-cover"/>
          </div>
        </div>
      </div>
    </Userlayout>
  )
}
