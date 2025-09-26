import { useEffect, useState } from "react";
import Userlayout from "../layout/userlayout";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { loginUser, registerUser } from "../../config/redux/action/authAction";
import { emptyMessage } from "../../config/redux/reducer/authReducer";
export default function LoginComponent() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const handleRegister = () => {
    console.log("regestering...");
    dispatch(registerUser({username, name, password, email}));
  };
  const handleLogin = () => {
    console.log("Login....");
    dispatch(loginUser({ email, password }));
  };
  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  },[authState.loggedIn]);
useEffect(()=>{
  if (localStorage.getItem("token")) {
    router.push("/dashboard");
  }
})

  useEffect(() => {
    dispatch(emptyMessage());
  }, [!isSignup]);

  useEffect(() => {});

  return (
    <Userlayout>
      <div className="grid  grid-cols-2 mb-48 pt-40">
        <div className=" ml-50 mt-30 bg-white  items-center justify-center rounded-l-2xl shadow-lg  shadow-white-500/100 p-20">
          <div>
            <p className="font-bold text-center text-3xl ">
              {isSignup ? "signup" : "login"}
            </p>
            <p className="text-center  mt-5 text-red-600">
              {authState.message.message}
            </p>
          </div>

          {isSignup ? (
            <div className="m-10 ">
              <input
                type="text"
                placeholder="name"
                className=" border text-center rounded-2xl  w-full p-1.5"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          ) : (
            ""
          )}
          {isSignup ? (
            <div className="m-10 ">
              <input
                type="text"
                placeholder="username"
                className=" border text-center rounded-2xl  w-full p-1.5"
                onChange={(e) => setuserName(e.target.value)}
              />
            </div>
          ) : (
            ""
          )}

          <div className="m-10 ">
            <input
              type="text"
              placeholder="E mail"
              className="border rounded-3xl w-full text-center p-1.5"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="m-10 ">
            <input
              type="password"
              placeholder="password"
              className="border rounded-3xl text-center w-full p-1.5"
              onChange={(e) =>  setPassword(e.target.value)}
            />
          </div>
          <div className="m-11 w-1/3">
            <button
              className=" bg-amber-400 p-2 rounded-3xl w-full"
              type="submit"
              onClick={() => {
                if (!isSignup) {
                  handleLogin();
                } else {
                  handleRegister();
                }
              }}>
              Submit
            </button>
          </div>
        </div>
        <div className="bg-blue-300 mt-30 mr-80 rounded-r-2xl pt-60 pl-25 shadow-lg  shadow-white-500/100">
          <div>
            <p className=" font-bold">
              {isSignup
                ? "if you have account "
                : " if you don,t have account please"}
              <br />
              <br />
              <button
                type="button"
                className="bg-amber-400  rounded-3xl p-1"
                onClick={() => {
                  setIsSignup(!isSignup);
                }}>
                {isSignup ? "Log In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </Userlayout>
  );
}
