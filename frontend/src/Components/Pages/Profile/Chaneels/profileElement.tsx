import ChaneelsList from "./ChaneelsList";
import MessageInput from "./MessageInput";
import UserInfo from "./UserInfo";
import CreateChannel from "./CreateChannel";
import { useState } from "react";
import Avatar from './assets/avatar.jpeg';


interface Channel {
  avatar: string; // assuming avatar is a string URL or similar
  message: string;
  time: string;
  username: string;
}


export const List:Array<Channel> = [];

export default function Chaneels() {
  const [toggelModal, setToggelModal] = useState(false);
  const [channelsList, setChannelsList] = useState(List);

  const handeltoggelModal = () =>{
    setToggelModal(!toggelModal);
  }
  const AddChannelToList = (chaneel: Channel)=> {

    setChannelsList((list)=>[...list, chaneel]);
  }
  return (
    <div>
     
     <div className="border-2 border-white rounded-2xl h-[62rem] grid grid-cols-5 gap-x-2 mt-4">
      { toggelModal && <CreateChannel sendChannelComp={AddChannelToList} 
      CloseModal={()=>setToggelModal(false)} />}
        <UserInfo />
        <MessageInput />
        {/* <ChaneelsList handeltoggelModal={handeltoggelModal} List={channelsList} /> */}
        
      </div>
    </div>
  );


}