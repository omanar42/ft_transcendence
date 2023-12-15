import { Link } from "react-router-dom";
import { Logo } from "../Login";
import { VscBellDot } from "react-icons/vsc";
import Avatar from "./assets/avatar.jpeg";
import { useState } from "react";

function Header() {
  const [isOPen, setIsOpen] = useState(false);

  return (
    <header className="bg-dark h-[8rem] rounded-3xl flex justify-between items-center p-10">
      <img className="h-[3rem]" src={Logo} alt="Logo" />
      <ul className="flex gap-[10rem] font-bold text-2xl">
        <Link to="/friends">Friends</Link>
        <Link to="/channels">Channels</Link>
        <Link to="/friends">Home</Link>
      </ul>
      <div className="flex items-center gap-[5rem] relative">
        <VscBellDot className="text-5xl" />
        <img
          className="h-[6rem] cursor-pointer rounded-full"
          src={Avatar}
          alt="avatar"
          onClick={() => setIsOpen(!isOPen)}
        />
        {isOPen && (
          <div className="absolute top-[8rem] rounded-xl pt-3 right-[-1.7rem] bg-dark w-[10rem] h-[10rem]">
            <ul className="flex flex-col items-center justify-center gap-4 font-bold text-2xl">
              <Link to="/profile">Profile</Link>
              <Link to="/profile">Settings</Link>
              <Link to="/profile">Log out</Link>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
