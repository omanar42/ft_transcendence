import React from "react";
import { login } from "../Login";
import './Chat.css'

const Chat = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="overflow-hidden chat max-w-140 h-60 ml-auto mr-auto -2  grid grid-cols-4">
        <div className="  col-span-1">
            <img className="w-full" src={login} />
        </div>
        <div className="   col-span-2"></div>
        <div className="  "></div>
      </div>
    </div>
  );
};

export default Chat;
