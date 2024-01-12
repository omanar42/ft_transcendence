import Avatar from "../assets/avatar.jpeg";
import "./RoomList.css";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useContext } from "react";
import { RoomContext } from "../../../../Contexts/RoomContext";
import { IoSettingsOutline } from "react-icons/io5";
import { InputBox } from "./CreateRoom";
const avatars = [Avatar, Avatar, Avatar, Avatar, Avatar, Avatar];

interface messageData {
  message: string;
  roomId: number;
  userName: string;
}

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
  time: string;
  roomName: string;
  roomType: string;
  roomPassword?: string;
  userName?: string;
  roomId: string;
}

function RoomSettings() {
  return (
    <div className="modal flex justify-center items-center">
              <button
          className=" absolute top-[18rem] left-[47rem] text-[7rem] text-pink-100"
        >
          &times;
        </button>
      <div
        className="w-3/6 h-3/6  flex  flex-col items-center border-2 bg-dark-100 rounded-3xl justify-around border-white border-opacity-20"
      >

        <h1 className="text-6xl uppercase font-bold pt-5 pb-10 ">
          Update Room
        </h1>
        <InputBox
          placeholder="Name your Room..."
          type="text"
          custom="outline-none font-bold"
        >
          Room Name
        </InputBox>
        <div className="flex w-10/12  text-4xl justify-between">
          <h1>Room Type</h1>
        </div>
       

        <button
          type="submit"
          className="text-4xl uppercase font-bold  w-[20rem] bg-dark border-[2px] p-5 rounded-xl"
        >
          Create
        </button>
      </div>
    </div>
  );
}

function ListRooms({ avatar, time, roomName, roomType, roomId }: Room) {
  const { setCurrentRoom, ownerSheep }: any = useContext(RoomContext);

  return (
    <li
      className="flex items-center justify-between mb-6 cursor-pointer hover:bg-pink-600 rounded-lg pl-2 pr-2 hover:duration-[0.2s]"
      key={roomId}
      onClick={() => {
        setCurrentRoom(roomId);
      }}
    >
      {/* <RoomSettings /> */}
      <div className="overflow-hidden flex items-center gap-5">
        <img className="h-[5rem] rounded-full" src={Avatar} alt="avatar" />
        <h1 className="text-2xl pb-2 font-extrabold">{roomName}</h1>
      </div>
      <div className="flex flex-col ml-10">
        <span className="text-xl font-semibold">{roomType}</span>
      </div>
      {ownerSheep === "OWNER" && (
        <IoSettingsOutline
          className="text-4xl hover:bg-white rounded-full hover:duration-[0.2s] hover:text-black"
          onClick={() => alert("hello")}
        />
      )}
    </li>
  );
}

function RoomList({ handeltoggelModal, List }: any) {
  const reversList = [...List].reverse();
  return (
    <div className="col-span-1 flex flex-col items-center gap-5 overflow-hidden border-2 border-white border-opacity-20 rounded-2xl">
      <div className=" border-b-2 border-white border-opacity-20 rounded-lg flex flex-col items-center gap-5 pt-4 pb-4">
        <input
          className="w-11/12 h-[2.5rem] rounded-full pl-10 text-white bg-black bg-opacity-80 text-xl outline-none border-2 border-white border-opacity-20"
          type="text"
          placeholder="search"
        />
        <ul className="flex gap-5 w-11/12">
          {avatars.map((avatar, i) => (
            <ListAvatars avatar={avatar} key={i} />
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
        {reversList.map((conv, i) => (
          <ListRooms
            avatar={conv.avatar}
            time={conv.time}
            roomName={conv.roomName}
            roomType={conv.roomType}
            roomId={conv.roomId}
            key={i}
          />
        ))}
      </ul>
    </div>
  );
}

export default RoomList;
