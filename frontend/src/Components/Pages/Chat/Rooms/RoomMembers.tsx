import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { RoomContext } from "../../../../Contexts/RoomContext";
import { FaBan } from "react-icons/fa";
import { GiBootKick } from "react-icons/gi";
import LoginInfo from "../../../../Contexts/LoginContext";

const owner = false;

interface RoomMembers{
  Avatar:string;
  UserName:string;
  status:string;
  currentUser:string;
}

function RenderMembers({ avatar, username, currentRoom, status, handrommemebers}:any) {
  const {userInfo} = useContext(LoginInfo);
  const {setOwnersheep, ownerSheep}:any = useContext(RoomContext);
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
  const KickUser = async()=>{
    try{
      const user = 
      {
        roomid: currentRoom,
        target_username: username
      }
     const response = await  axios.post("http://127.0.0.1:3000/chat/kick_user", user, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      handrommemebers(response.data);

    }
    catch(error){
      console.error(error);
    }
}
  return (
    <li className="flex mt-4 w-11/12 pl-4 pr-4 items-center justify-between cursor-pointer hover:bg-blue-600 hover:duration-[0.2s] rounded-xl  ">
      <div className="flex flex-col items-start gap-3">
        <h1 className="text-xl font-bold tracking-2">{username}</h1>
        {(ownerSheep === "OWNER" && userInfo.username !== username) && <div className="flex gap-4 items-center">
          <FaBan onClick={BanUser} className='text-4xl text-red-600 cursor-pointer hover:text-white hover:bg-red-600 hover:duration-[0.2s] rounded-full' />
          <GiBootKick onClick={KickUser} className='text-4xl cursor-pointer  hover:text-red-600 hover:bg-white hover:duration-[0.2s] rounded-full'  />
        </div>}
      <span className="text-lg font-bold">{status}</span>
      </div>
      <img className="w-[6rem] h-[6rem] rounded-full status" src={avatar} alt="avatar" />

    </li>
  );
}

function RoomMembers() {
  const [roomMembers, setRoomMembers ] = useState<RoomMembers[]>([]);
  const {currentRoom, setOwnersheep, ownerSheep} = useContext(RoomContext);
  const {userInfo} = useContext(LoginInfo);

  useEffect(()=>{
    const fetchRoommemebers = async ()=>{
      try{
        const response = await axios.get("http://127.0.0.1:3000/chat/roomUsers", {withCredentials: true, params: {roomId: currentRoom}});
        setRoomMembers(response.data);
        const user = response.data.find((member:RoomMembers)=>member.UserName === userInfo.username);
        if (user)
        setOwnersheep(user.status)
      }
      catch(error){
        console.error(error);
      }
    }
    if (currentRoom)
      fetchRoommemebers();
  },
  [currentRoom])
  const handrommemebers = (rooms)=>{
    setRoomMembers(rooms);
  }
  return (
    <div className="flex flex-col gap-[0.5rem] items-center overflow-hidden">
      <div className="pt-7 pb-7 border-2 text-center w-full border-white border-opacity-20 rounded-2xl">
        <h1 className="text-4xl">Room Members</h1>
      </div>
        <ul className="flex overflow-auto flex-col items-center gap-[0.5rem] w-full border-2 border-white border-opacity-20 h-full text-2xl rounded-2xl">
          {roomMembers.map((memeber, i) => (
            <RenderMembers avatar={memeber.Avatar} username={memeber.UserName} currentRoom={currentRoom} status={memeber.status}handrommemebers={handrommemebers} key={i}/>
          ))}
        </ul>
    </div>
  );
}

export default RoomMembers;
