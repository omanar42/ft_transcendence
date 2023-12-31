import Avatar from "../assets/avatar.jpeg";
import "./RoomList.css";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useContext } from "react";
import { RoomContext} from "../../../../Contexts/RoomContext";

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

export interface Room {
  avatar: string; // assuming avatar is a string URL or similar
  message?: string;
  time: string;
  roomName: string;
  roomType: string;
  roomPassword?: string;
  userName?: string;
  roomId: string;
}

function ListRooms({ avatar, time, roomName, roomType, roomId}: Room) {
  const {setCurrentRoom} = useContext(RoomContext);

  return (
    <li 
    className="flex items-center justify-between mb-6 cursor-pointer"
    key={roomId}
    onClick={()=>{
      setCurrentRoom(roomId)
    }}
    >
      <div className="overflow-hidden flex items-center gap-5">
        <img className="h-[5rem] rounded-full" src={Avatar} alt="avatar" />
        <h1 className="text-2xl pb-2 font-extrabold">{roomName}</h1>
      </div>
      <div className="flex flex-col ml-10">
        <span className="text-xl font-semibold">{time}</span>
        <span className="text-xl font-semibold">{roomType}</span>
      </div>
    </li>
  );
}
function RoomList({ handeltoggelModal, List }) {
  const reversList = [...List].reverse();
  return (
    <div className="col-span-1 flex flex-col items-center gap-5 overflow-hidden">
      <div className=" border-2 border-white border-opacity-20 rounded-lg flex flex-col items-center gap-5 pt-4 pb-4">
        <input
          className="w-11/12 h-[2.5rem] rounded-full pl-10 text-black outline-none"
          type="text"
          placeholder="search"
        />
        <ul className="flex gap-5 w-11/12">
          {avatars.map((avatar) => (
            <ListAvatars avatar={avatar} />
          ))}
        </ul>
      </div>
      <button
        onClick={handeltoggelModal}
        className="w-11/12 flex items-center justify-center gap-10 bg-dark flex-shrink-0 flex-grow-0 basis-[5rem] text-2xl tracking-4 font-bold rounded-xl hover:bg-white hover:text-dark duration-[0.2s]"
      >
        Create Room
        <IoIosAddCircleOutline className="text-4xl" />
      </button>

      <ul className="p-4 scroll-container flex w-full flex-col overflow-auto">
        {reversList.map((conv) => (
          <ListRooms
            avatar={conv.avatar}
            time={conv.time}
            roomName={conv.roomName}
            roomType={conv.roomType}
            roomId={conv.roomId}
          />
        ))}
      </ul>
    </div>
  );
}

export default RoomList;
