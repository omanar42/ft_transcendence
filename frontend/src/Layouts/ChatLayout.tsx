import { Outlet } from "react-router-dom";

import NavigationLink from "../Utils/NavigationLink";


function ChatLayout() {
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
            <Outlet />
        </main>
        </div>
      );
}

export default ChatLayout