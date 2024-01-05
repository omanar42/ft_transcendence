import Avatar from "../assets/avatar.jpeg";
import { MdOutlineBlock } from "react-icons/md";
import { FaShare } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { RoomContext } from "../../../../Contexts/RoomContext";
import { FaBan } from "react-icons/fa";
import { GiBootKick } from "react-icons/gi";

const chats = [
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "omanar",
    message: "Andoz eandk lyoum",
    time: "10.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "yessad",
    message: "Match nadi a sat",
    time: "6.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "yassin",
    message: "galo liya khsarto ?",
    time: "12.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "ilyas",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
  {
    avatar: Avatar,
    username: "mrobaii",
    message: "Anchdk n72ik a balaty",
    time: "9.00 am",
    status: "online"
  },
];

interface RoomMembers{
  avatar:string;
  username:string;
}

function RenderMembers({ avatar, username, currentRoom }) {

  const BanUser = ()=>{
      try{
        const user = 
        {
          roomid: currentRoom,
          target_username: username
        }
        axios.post("http://127.0.0.1:3000/chat/ban_user", user, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        console.log('Ban user', user);

      }
      catch(error){
        console.error(error);
      }
  }
  const KickUser = ()=>{
    try{
      const user = 
      {
        roomid: currentRoom,
        target_username: username
      }
      axios.post("http://http://127.0.0.1:3000/chat/kick_user", user, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log('Kick user', user);

    }
    catch(error){
      console.error(error);
    }
}
  return (
    <li className="flex pl-[2rem] w-full items-center justify-between">
      <div className="flex flex-col items-start gap-3">
        <h1 className="text-3xl font-bold tracking-2">{username}</h1>
        <div className="flex gap-4 items-center">
          <FaBan onClick={BanUser} className='text-4xl text-red-600 cursor-pointer hover:text-white hover:bg-red-600 hover:duration-[0.2s] rounded-full' />
          <GiBootKick onClick={KickUser} className='text-4xl cursor-pointer  hover:text-red-600 hover:bg-white hover:duration-[0.2s] rounded-full'  />
        </div>
      </div>
      <img className="w-[6rem] rounded-full status" src={avatar} alt="avatar" />

    </li>
  );
}

function RoomMembers() {
  const [roomMembers, setRoomMembers] = useState<RoomMembers[]>([]);
  const {currentRoom} = useContext(RoomContext);
  console.log('room id',currentRoom);
  useEffect(()=>{
    const fetchRoommemebers = async ()=>{
      try{
        const response = await axios.get("http://127.0.0.1:3000/chat/roomUsers", {withCredentials: true, params: {roomId: currentRoom}});
        console.log(response.data);
      }
      catch(error){
        console.error(error);
      }
    }
    if (currentRoom)
      fetchRoommemebers();
  },
  [currentRoom])
  return (
    <div className="flex flex-col gap-[0.5rem] overflow-hidden">
      <div className="pt-7 pb-7 border-2 text-center border-white border-opacity-20 rounded-2xl">
        <h1 className="text-4xl">Room Members</h1>
      </div>
      <ul className="flex overflow-auto flex-col gap-[1rem] items-end pr-[3rem] w-full text-2xl border-2 border-white border-opacity-20 rounded-2xl">
        {chats.map((memeber, i) => (
          <RenderMembers avatar={memeber.avatar} username={memeber.username} currentRoom={currentRoom} key={i}/>
        ))}
      </ul>
    </div>
  );
}

export default RoomMembers;
