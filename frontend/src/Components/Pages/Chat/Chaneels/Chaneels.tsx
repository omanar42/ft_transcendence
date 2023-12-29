import ChaneelsList from "./ChaneelsList";
import MessageInput from "./MessageInput";
import UserInfo from "./UserInfo";
import CreateChannel from "./CreateChannel";
import { useEffect, useState } from "react";
import io from "socket.io-client";


export const socket = io("http://localhost:3000/chat");

interface Room {
  avatar: string; // assuming avatar is a string URL or similar
  message: string;
  time: string;
  roomName: string;
  roomType: string;
}


export const List:Array<Room> = [];

export default function Chaneels() {
  const [toggelModal, setToggelModal] = useState(false);
  const [channelsList, setChannelsList] = useState(List);

  const handeltoggelModal = () =>{
    setToggelModal(!toggelModal);
  }
  const AddChannelToList = (Room: Room)=> {

    setChannelsList((list)=>[...list, Room]);
  }


  return (
    <div>
     
      <div className="bg-dark-100 h-[62rem] grid grid-cols-5 gap-x-2 mt-4">
      { toggelModal && <CreateChannel AddChannelToList={AddChannelToList} CloseModal={()=>setToggelModal(false)} />}
        <ChaneelsList handeltoggelModal={handeltoggelModal} List={channelsList} />
        <MessageInput />
        <UserInfo />
      </div>
    </div>
  );


}