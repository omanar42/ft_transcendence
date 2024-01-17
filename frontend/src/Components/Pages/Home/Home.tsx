import { useEffect } from "react";
import Robot from "./assets/Robot.png";
import axios from "axios";
import { useContext } from "react";
import LoginInfo from "../../../Contexts/LoginContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Home() {
  const { setuserInfo, userInfo } = useContext(LoginInfo);

  useEffect(() => {
    const savedUserData = localStorage.getItem("userData");

    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/users/info", {
          withCredentials: true,
        });
        setuserInfo((prevstate) => ({
          ...prevstate,
          avatar: response.data.avatar,
          fullname: response.data.fullname,
          status: response.data.status,
          username: response.data.username,
        }));
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      } catch (error) {
        console.error(error);
      }
    };
    if (savedUserData) {
      setuserInfo(savedUserData);
    } else fetchData();
    const allCookies = document.cookie;

    function getCookie(name) {
      const value = `; ${document.cookie}`;
      return value;
    }

    // Usage
    const token = getCookie("access_token");
    console.log("here is the token", token);
  }, []);

  // useEffect(()=>{
  //     console.log(userInfo);
  // }, [userInfo])

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: "0" }}
      exit={{ y: "100%" }}
      className="h-screen flex justify-center relative items-center text-white"
    >
      <div className="w-140 flex gap-[10rem] ">
        <div className="w-3/5">
          <h1 className="text-9xl pb-16">RoboPong Story</h1>
          <p className="text-4xl font-bold pb-16 font-sans leading-[3.4rem]">
            In a cyberpunk dystopia ruled by oppressive corporations, "RoboPong"
            emerges as a rebellion, casting players into neon-lit virtual arenas
            against robotic foes known as RoboPong. The ping pong ball becomes a
            symbol of resistance as players confront advanced AI-controlled
            enemies. As players progress, they unwittingly become heroes in a
            narrative that uncovers the truth behind the corporate regime.
          </p>
          <div className="flex gap-[5rem]">
            <button className="bg-pink-600 rounded-full text-3xl h-[6rem] w-[15rem] hover:bg-dark hover:duration-[0.2s]">
              <Link to="/game">Play Now</Link>
            </button>
            <button className="rounded-full border-[2px] text-3xl h-[6rem] w-[15rem] hover:bg-white hover:text-dark duration-[0.2s]">
              Learn more
            </button>
          </div>
        </div>
        <img
          className="h-[50rem] absolute top-[14rem] right-[1rem]"
          src={Robot}
        />
      </div>
    </motion.div>
  );
}

export default Home;
