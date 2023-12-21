import ChatList from "./ChatList";
import MessageInput from "./MessageInput";
import UserInfo from "../Chaneels/UserInfo";
import { useState } from "react";

function Chat() {
  const [currentChatuser, setCurentUser] = useState("");

  const showChatuser = (user:any)=> {
    setCurentUser(user);
  }

  return (
    <div className="bg-dark-100 h-[62rem] grid grid-cols-5 gap-x-2 mt-4">
      <ChatList chatUser={showChatuser}/>
      <MessageInput />
      <UserInfo />
    </div>
  );
}

export default Chat;
