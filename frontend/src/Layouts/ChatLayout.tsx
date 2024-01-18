import { Outlet } from "react-router-dom";

import NavigationLink from "../Utils/NavigationLink";
import { MdOutlineWarning } from "react-icons/md";
import { useContext } from "react";
import LoginInfo from "../Contexts/LoginContext";


function ChatLayout() {

  const {connected}:any = useContext(LoginInfo)
    return (
        <div className="w-[140rem]  max-w-140 -dark rounded-3xl text-white ml-auto mr-auto">
        <header className="bg-black border-2 border-white  border-opacity-20 bg-opacity-50 backdrop-blur-md h-[8rem] rounded-3xl flex justify-center items-center p-10">
          {/* <img className="h-[1rem]" src={Logo} alt="Logo" /> */}
          <ul className="flex gap-[10rem] font-bold text-2xl">
            <NavigationLink to="/chat">Conversations</NavigationLink>
            <NavigationLink to="rooms">Rooms</NavigationLink>
            <NavigationLink to="friends">Friends</NavigationLink>
            <NavigationLink to="explore">Explore</NavigationLink>
          </ul>
          <div className="flex items-center gap-[5rem] relative">
          </div>
        </header>
        <main>
       {!connected ? <div className="modal h-screen flex justify-center items-center">
            <div className="w-[50%] h-[20%] bg-dark-300 rounded-3xl flex flex-col justify-around items-center">
              <h1 className="text-8xl text-pink-600">You lost Connection</h1>
              <div className="flex items-center gap-[1rem]">
              <MdOutlineWarning  className="text-7xl text-yellow-400"/>
              <h2 className="text-2xl wrap"><strong>CyberPonk</strong>k is open in another window. Click "Use Here"to use <strong>CyberPonk</strong>  in this window</h2>
              </div>
              <button className="text-5xl uppercase p-4 bg-pink-600 rounded-3xl hover:opacity-60 hover:duration-[0.2s]" onClick={()=>window.location.reload()}>Use Here</button>
            </div>
          </div>
          :
            <Outlet />
            }
        </main>
        </div>
      );
}

export default ChatLayout