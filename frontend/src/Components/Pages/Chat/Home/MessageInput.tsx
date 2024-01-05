import { useContext, useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import axios from 'axios'
import avatar from '../assets/avatar.jpeg';
import { RoomContext } from "../../../../Contexts/RoomContext";
import LoginInfo from "../../../../Contexts/LoginContext";
import { IoLogOutSharp } from "react-icons/io5";

interface messageList {
  message:string,
  userName:string;

}

interface messageData{
  message:string;
  roomId:number;
  userName:string;
}

function MessageInput() {
  const [currentMessage, setcurrentMessage] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messageList, setMessageList] = useState<messageList[]>([]);
  const {currentRoom} = useContext(RoomContext);
  const {userInfo, socket} = useContext(LoginInfo);

  const sendMessage = () => {
    if (currentMessage !== "") {
      const messageData:messageData = {
          message: currentMessage,
          roomId:currentRoom,
          userName: userInfo.username,
      };
      setMessageList((list)=>[...list, messageData]);
      setcurrentMessage("");
      socket.emit("message" ,messageData);
      // console.log(messageData);
    }
  };
  useEffect(()=>{
    console.log('this from socket', socket);
    console.log(userInfo);
    socket?.off("new_message").on("new_message", (data)=>{      
      console.log('message from backend ',data);

      setMessageList((list)=>[...list, data]);
      
    })
  },[socket]);
  
  useEffect(()=>{
    const fetchMessages = async () =>{
      const messages = await axios.get(`http://127.0.0.1:3000/chat/Messages`, {
      params: {
        roomId: currentRoom,
      },  
      withCredentials: true});
      console.log('all messagaes', messages.data);
      setMessageList(messages.data.messages);
      setRoomName(messages.data.roomName);
    }
    if (currentRoom){
      fetchMessages();
    }
  }
  ,[currentRoom])
  return (
  <div className="border-2 border-white rounded-2xl border-opacity-20 col-span-3 flex flex-col justify-between overflow-hidden">
  {currentRoom ? <>
  <div className=" bg-dark chat-header flex items-center justify-between pl-[5rem] pr-[5rem] h-[8rem]">
    <img className="h-[6rem] rounded-full"  src={avatar} alt="avatar" />
    <p className="text-3xl">{roomName}</p>
    <IoLogOutSharp className="text-5xl text-red-600 cursor-pointer" />
  </div>
  <div className=" flex-1 pl-[3rem] pr-[3rem] pt-[2rem] flex flex-col items-start overflow-y-scroll">
    {messageList.map((message, i)=> {
      return(<div className={`text-white text-2xl flex flex-col gap-[0.5rem] ${userInfo.username === message.userName ? "" : "self-end"} `} key={i}>
        <div className={`p-[1rem] rounded-lg f ${userInfo.username === message.userName ? "bg-pink-800 " : "bg-blue-600"}`}>
          <p>{message.message}</p>
        </div>
        <p className={`text-[1rem]  ${userInfo.username === message.userName ? "self-start" : "self-end"} font-bold`}>{message.userName}</p>
        <div className="text-lg">
          <p>{}</p>
        </div>
      </div>)
    })}
  </div>
  <div className="h-[6rem] pl-10 pr-10 border-t-2 border-opacity-20 border-white flex justify-between items-center gap-3">
    <input
      className="h-14 flex-1 outline-none rounded-3xl pl-10 text-black"
      type="text"
      placeholder="Write message"
      onChange={(event) => setcurrentMessage(event.target.value)}
      value={currentMessage}
      onKeyPress={(event)=>{
        event.key === "Enter" && sendMessage();
      }}
    />
    <IoIosSend
      onClick={sendMessage}
      className="text-6xl text-pink-100 cursor-pointer"

    />
  </div>
  </> : <div></div>}
  </div>
  );
}

export default MessageInput;
