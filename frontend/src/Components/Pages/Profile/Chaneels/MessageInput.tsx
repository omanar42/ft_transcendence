import { IoIosSend } from "react-icons/io";
import NavigationLink from "./NavigationLink";
import "./ChaneelsList.css";
function MessageInput() {
  return (
    <div className="border-2 border-white rounded-2xl border-opacity-5 col-span-4 flex flex-col justify-between">
            <header className="backdrop-blur-xl border border-pink-300 h-[8rem] rounded-3xl flex justify-center items-center p-10">
          {/* <img className="h-[1rem]" src={Logo} alt="Logo" /> */}
          <ul className="ww flex gap-[10rem] font-bold text-2xl">
            <NavigationLink to="./">Match history</NavigationLink>
            <NavigationLink to="/friends">Friends</NavigationLink>
          </ul>
          <div className="flex items-center gap-[5rem] relative">
          </div>
        </header>
        <div className="element border border-pink-100 backdrop-blur"> 
          <p className="ww content">you vs player1 <span className="score">DEFEAT 3-5</span>   +20xp      12-12-2023  17:39</p>
        </div>
        <div className="element border border-blue-400 backdrop-blur"> 
          <p className="ww content">you vs player1 <span className="score">VICTORY 5-4</span>   +20xp      12-12-2023  17:39</p>
        </div>
        <div className="element border border-pink-100 backdrop-blur"> 
          <p className="ww content">you vs player1 <span className="score">DEFEAT 3-5</span>   +20xp      12-12-2023  17:39</p>
        </div>
        <div className="element border border-blue-400 backdrop-blur"> 
          <p className="ww content">you vs player1 <span className="score">VICTORY 3-5</span>   +20xp      12-12-2023  17:39</p>
        </div>
        <div className="element border border-blue-400 backdrop-blur"> 
          <p className="ww content">you vs player1 <span className="score">VICTORY 3-5</span>   +20xp      12-12-2023  17:39</p>
        </div>
        <div className="element border border-pink-100 backdrop-blur"> 
          <p className="ww content">you vs player1 <span className="score">DEFEAT 3-5</span>   +20xp      12-12-2023  17:39</p>
        </div>
    </div>
  )
}

export default MessageInput