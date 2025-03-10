import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { RoomContext } from "../../../../Contexts/RoomContext";
import { FaBan } from "react-icons/fa";
import { GiBootKick } from "react-icons/gi";
import LoginInfo from "../../../../Contexts/LoginContext";
import { TbCurrencyPoundOff } from "react-icons/tb";
import { toast } from "react-toastify";
import { MdAdminPanelSettings } from "react-icons/md";
import { BiSolidVolumeMute } from "react-icons/bi";
import { VscUnmute } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../../Config";

interface RoomMembers {
  Avatar: string;
  UserName: string;
  status: string;
  currentUser: string;
  user_status: string;
  muted: boolean;
}

function RenderMembers({
  avatar,
  username,
  currentRoom,
  status,
  handrommemebers,
  user_status,
  muted,
}: any) {
  const { userInfo }:any = useContext(LoginInfo);
  const { ownerSheep }: any = useContext(RoomContext);
  const navigate = useNavigate();
  const unBanedUser = async () => {
    try {
     const response =  await axios.post(
        `${BACKEND_URL}/chat/unban_user`,
        { roomid: currentRoom, target_username: username },
        { withCredentials: true }
      );
      handrommemebers(response.data);
    } catch (error) {
      toast.error(error?.response.data.message);
    }
  };

  const BanUser = async () => {
    try {
      const user = {
        roomid: currentRoom,
        target_username: username,
      };
     const response =  await axios.post(`${BACKEND_URL}/chat/ban_user`, user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      handrommemebers(response.data);
    } catch (error) {
      toast.error(error?.response.data.message);
    }
  };
  const KickUser = async () => {
    try {
      const user = {
        roomid: currentRoom,
        target_username: username,
      };
      const response = await axios.post(
        `${BACKEND_URL}/chat/kick_user`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      handrommemebers(response.data);
    } catch (error) {
      toast.error(error?.response.data.message);
    }
  };

  const setAdmin = async () => {
    try {
      const user = {
        roomId: currentRoom,
        username: username,
      };
      const response = await axios.post(
        `${BACKEND_URL}/chat/setadmin`, user, { withCredentials: true});
        handrommemebers(response.data);
  }catch(error){
    toast.error(error?.response.data.message);
  }
}

const MuteUser = async () => {
  try {
    const user = {
      roomId: currentRoom,
      target_username: username,
    };
    const response = await axios.post(
      `${BACKEND_URL}/chat/mute_user`, user, { withCredentials: true});
      handrommemebers(response.data);
}catch(error){
  toast.error(error?.response.data.message);
}
}

const unMuteUser = async () => {
  try {
    const user = {
      roomId: currentRoom,
      target_username: username,
    };
    const response = await axios.post(
      `${BACKEND_URL}/chat/unmute_user`, user, { withCredentials: true});
      handrommemebers(response.data);
}catch(error){
  toast.error(error?.response.data.message);
}
}
  
  return (
    <li className="flex mt-4 w-11/12 pl-4 pr-4 items-center justify-between cursor-pointer hover:bg-blue-600 hover:duration-[0.2s] rounded-xl  ">
      <div className="flex flex-col items-start gap-3">
        <h1 className="text-xl font-bold tracking-2">{username}</h1>
        {(ownerSheep === "OWNER" || ownerSheep === "ADMIN" )&&
          userInfo.username !== username &&
          status !== "OWNER" && status != "BANNED"  && (
            <div className="flex gap-4 items-center">
              <FaBan
                onClick={BanUser}
                className="text-4xl text-red-600 cursor-pointer hover:text-white hover:bg-red-600 hover:duration-[0.2s] rounded-full"
              />
              <GiBootKick
                onClick={KickUser}
                className="text-4xl cursor-pointer  hover:text-red-600 hover:bg-white hover:duration-[0.2s] rounded-full"
              />
              <MdAdminPanelSettings onClick={setAdmin} className="text-4xl cursor-pointer  hover:text-red-600 hover:bg-white hover:duration-[0.2s] rounded-full"/>
              { !muted ? <BiSolidVolumeMute onClick={MuteUser} className="text-4xl cursor-pointer  hover:text-red-600 hover:bg-white hover:duration-[0.2s] rounded-full" />
             : < VscUnmute onClick={unMuteUser} className="text-4xl cursor-pointer  hover:text-red-600 hover:bg-white hover:duration-[0.2s] rounded-full" />}
            </div>
          )}
        {(ownerSheep === "OWNER" || ownerSheep === "ADMIN" )&&
          userInfo.username !== username &&
          status === "BANNED" && (
            <div className="flex gap-4 items-center">
              <TbCurrencyPoundOff onClick={unBanedUser} className="text-4xl rounded-full hover:bg-white hover:text-red-600" />
              <GiBootKick
                onClick={KickUser}
                className="text-4xl cursor-pointer  hover:text-red-600 hover:bg-white hover:duration-[0.2s] rounded-full"
              />
            </div>
          )}
        <span className="text-lg font-bold">{status}</span>
      </div>
      <div className="relative">
      <img
       onClick={()=>navigate(`/Profile/${username}`)} 
        className="w-[6rem] hover:opacity-60 hover:border-2 border-pink-600 hover:duration-[0.2s] h-[6rem] rounded-full status"
        src={avatar}
        alt="avatar"
      />
      <div className={`absolute bottom-0 right-0 w-[1rem] h-[1rem] rounded-full   ${user_status === "ONLINE" ? "bg-green-500" : user_status === "OFFLINE" ? "bg-red-500" : "bg-yellow-500" }`}></div>
      </div>
    </li>
  );
}

function RoomMembers() {
  const [roomMembers, setRoomMembers] = useState<RoomMembers[]>([]);
  const { currentRoom, setOwnersheep, setStatus }:any = useContext(RoomContext);
  const { userInfo,  }:any = useContext(LoginInfo);

  useEffect(() => {
    const fetchRoommemebers = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/chat/roomUsers`,
          { withCredentials: true, params: { roomId: currentRoom } }
        );
        setRoomMembers(response.data);
        const user = response.data.find(
          (member: RoomMembers) => member.UserName === userInfo.username
        );
        if (user){
          setOwnersheep(user.status);
          setStatus(user.muted);
        } 
        
      } catch (error) {
        toast.error(error?.response.data.message);
      }
    };
    if (currentRoom) fetchRoommemebers();
  }, [currentRoom]);
  const handrommemebers = (rooms:any) => {
    setRoomMembers(rooms);
  };
  return (
    <div className="flex flex-col gap-[0.5rem] items-center overflow-hidden">
      <div className="pt-7 pb-7 border-2 text-center w-full border-white border-opacity-20 rounded-2xl">
        <h1 className="text-4xl">Room Members</h1>
      </div>
      <ul className="flex overflow-auto flex-col items-center gap-[0.5rem] w-full border-2 border-white border-opacity-20 h-full text-2xl rounded-2xl">
        {roomMembers.map((memeber, i) => (
          <RenderMembers
            avatar={memeber.Avatar}
            username={memeber.UserName}
            currentRoom={currentRoom}
            status={memeber.status}
            handrommemebers={handrommemebers}
            user_status={memeber.user_status}
            muted={memeber.muted}
            key={i}
          />
        ))}
      </ul>
    </div>
  );
}

export default RoomMembers;
