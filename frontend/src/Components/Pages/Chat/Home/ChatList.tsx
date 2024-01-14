import { useContext } from "react";
import Avatar from "../assets/avatar.jpeg";
import './Chatlist.css';
import LoginInfo from "../../../../Contexts/LoginContext";
import { RoomContext } from "../../../../Contexts/RoomContext";

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

interface ListConversations {
    avatar: string,
    username: string,
    message: string,
    time: string,
    roomId: string
}

function ListConversations({ avatar, username, message, time, roomId }:ListConversations) {
  const {setCurrentRoom}:any = useContext(RoomContext);

  return (
    <li onClick={()=>setCurrentRoom(roomId)} className="flex items-center gap-[3rem] p-2 hover:bg-pink-600 hover:duration-[0.2s] rounded-2xl mb-6 cursor-pointer">
      <img className="h-[6rem] w-[6rem] rounded-full" src={avatar} alt="avatar" />
      <div className="overflow-hidden">
        <h1 className="text-2xl pb-2 font-extrabold uppercase">{username}</h1>
        <p className="text-xl">{message}</p>
      </div>
      <span className="text-xl font-semibold">{time}</span>
    </li>
  );
}
function ChatList({chatUser}:any) {
  return (
    <div className="col-span-1 flex flex-col items-center gap-5 overflow-hidden  border-2 border-white border-opacity-20 rounded-2xl font-sans">
      <div className=" border-2 border-white border-opacity-20 rounded-lg flex flex-col items-center gap-5 pt-4 pb-4">
        <input
          className="w-11/12 h-[2.5rem] rounded-full pl-10 text-black outline-none"
          type="text"
          placeholder="search"
        />
        <ul className="flex gap-5 w-11/12">
          {avatars.map((avatar) => (
            <ListAvatars  avatar={avatar} />
          ))}
        </ul>
      </div>
      <ul className="p-4 scroll-container flex w-full flex-col overflow-auto">
        {chatUser.map((conv, i) => (
          <ListConversations
            avatar={conv.Avatar}
            username={conv.roomName}
            roomId={conv.roomId}
            key={i}
          />
        ))}
      </ul>
    </div>
  );
}

export default ChatList;
