import Avatar from "../assets/avatar.jpeg";
import "./ChaneelsList.css";
import { IoIosAddCircleOutline } from "react-icons/io";
import CreateChannel from "./CreateChannel";
import { useState } from "react";

const avatars = [Avatar, Avatar, Avatar, Avatar, Avatar, Avatar];

interface ListAvatars {
  avatar: string;
}

function ListAvatars({ avatar }: ListAvatars) {
  return (
    <li>
      <img className="rounded-full" src={avatar} alt="avatar" />
    </li>
  );
}

interface ListChaneels {
  avatar: string;
  username: string;
  message: string;
  time: string;
}

function ListChaneels({
  avatar,
  username,
  message,
  time,
}: ListChaneels) {
  return (
    <li className="flex items-center gap-5 mb-6">
      <img className="h-[5rem] rounded-full" src={avatar} alt="avatar" />
      <div className="overflow-hidden">
        <h1 className="text-2xl pb-2 font-extrabold">{username}</h1>
        <p className="text-xl">{message}</p>
      </div>
      <span className="text-xl font-semibold">{time}</span>
    </li>
  );
}
function ChaneelsList({handeltoggelModal, List}) {


  return (
    <div className="col-span-1 flex flex-col items-center gap-5 overflow-hidden">
      <div className=" border-2 border-white border-opacity-20 rounded-lg flex flex-col items-center gap-5 pt-4 pb-4">
        <input
          className="w-11/12 h-[2.5rem] rounded-full pl-10 text-black outline-none"
          type="text"
          placeholder="search"
        />
        <ul className="flex gap-5 w-11/12">
          {avatars.map((avatar) => (
            <ListAvatars avatar={avatar} />
          ))}
        </ul>
      </div>
      <button onClick={handeltoggelModal} className="w-11/12 flex items-center justify-center gap-10 bg-dark h-[5rem] text-2xl tracking-4 font-bold rounded-xl hover:bg-white hover:text-dark duration-[0.2s]">
        Create Chaneel
        <IoIosAddCircleOutline className="text-4xl" />
      </button>

      <ul className="p-4 scroll-container flex w-full flex-col overflow-auto">
          {List.map((conv)=>
          <ListChaneels 
            avatar={conv.avatar}
            message={conv.message}
            time={conv.time}
            username={conv.username}
          />)}
      </ul>
    </div>
  );
}

export default ChaneelsList;
