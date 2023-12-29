import ChaneelsList from "./ChaneelsList";
import MessageInput from "./MessageInput";
import UserInfo from "./UserInfo";
import CreateChannel from "./CreateChannel";
import { useEffect, useState } from "react";
import { Room } from "./ChaneelsList";
import axios from "axios";



export default function Chaneels() {
  const [toggelModal, setToggelModal] = useState(false);
  const [channelsList, setChannelsList] = useState<Room[]>([]);

  const handeltoggelModal = () =>{
    setToggelModal(!toggelModal);
  }
  const AddChannelToList = (Room: Room)=> {

    setChannelsList((list)=>[...list, Room]);
  }

  useEffect(()=>{
    const fetchRooms = async ()=>{
      try{
        const response =  await axios.get("127.0.0.1:3000/chat/Rooms");
        console.log(response);
      }
      catch(error){
        console.error(error);
      }
    }
  },[])
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